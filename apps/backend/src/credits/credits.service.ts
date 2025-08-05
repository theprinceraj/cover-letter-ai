import Razorpay = require('razorpay');
import { Orders } from 'razorpay/dist/types/orders';
import {
  ACCEPTED_CURRENCY_CODES,
  CREDIT_PACKAGES,
  CreditsService_OrderUsingPayPal_Response,
  CreditsService_OrderUsingRazorpay_Response,
  CreditsService_OrderVerification_Response,
  PAYMENT_GATEWAYS,
} from '@cover-letter-ai/constants';
import * as crypto from 'crypto';
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UserDocument } from 'src/db/schema';
import { CreateOrderDto, VerifyRazorpayCreditOrderPaymentDto } from './credits.dto';
import { ConfigService } from '@nestjs/config';
import { DbService } from 'src/db/db.service';
import { CREDIT_ORDER_STATUS } from '@cover-letter-ai/constants';
import { CheckoutPaymentIntent, OrderRequest, OrderStatus } from '@paypal/paypal-server-sdk';
import { ordersController } from 'src/paypal.util';

@Injectable()
export class CreditsService {
  private readonly razorpay: Razorpay;
  constructor(
    private readonly config: ConfigService,
    private readonly db: DbService,
  ) {
    this.razorpay = new Razorpay({
      key_id: this.config.get('RAZORPAY_KEY_ID') as string,
      key_secret: this.config.get('RAZORPAY_KEY_SECRET') as string,
    });
  }

  async createOrderUsingRazorpay(user: UserDocument, dto: CreateOrderDto): Promise<CreditsService_OrderUsingRazorpay_Response> {
    // Get package details
    const pkgDetails = CREDIT_PACKAGES.find((pkg) => pkg.id === dto.packageId);
    if (!pkgDetails) {
      throw new NotFoundException(`Package with ID '${dto.packageId}' not found`);
    }

    // Create order in Razorpay
    const OrderCreateRequestBody: Orders.RazorpayOrderCreateRequestBody = {
      currency: dto.currencyCodeInISOFormat,
      amount: dto.currencyCodeInISOFormat === 'INR' ? pkgDetails.priceInINR * 100 : pkgDetails.priceInUSD_Cents,
      receipt: `order_${user.id}_${new Date().toISOString().split('T')[0]}`,
      notes: {
        user_id: user.id as string,
        user_email: user.email,
        package_id: dto.packageId as string,
      },
    };
    const order = await this.razorpay.orders.create(OrderCreateRequestBody);

    // Create order in database
    const creditOrder = await this.db.creditOrder.create({
      id: order.id,
      userId: user.id,
      amountToBePaidInMinorUnits: order.amount_due,
      currency: order.currency,
      status: order.status,
      receipt: order.receipt,
      notes: order.notes,
      orderCreatedAt: new Date(order.created_at * 1000),
      gateway: PAYMENT_GATEWAYS.RAZORPAY,
    });

    return {
      order: {
        id: creditOrder.id,
        amountToBePaidInMinorUnits: creditOrder.amountToBePaidInMinorUnits,
        currency: creditOrder.currency,
        status: creditOrder.status,
        orderCreatedAt: creditOrder.orderCreatedAt,
      },
      pkg: pkgDetails,
    };
  }

  async createOrderUsingPayPal(user: UserDocument, dto: CreateOrderDto): Promise<CreditsService_OrderUsingPayPal_Response> {
    // Get package details
    const pkgDetails = CREDIT_PACKAGES.find((pkg) => pkg.id === dto.packageId);
    if (!pkgDetails) {
      throw new NotFoundException(`Package with ID '${dto.packageId}' not found`);
    }

    const collect = {
      body: {
        intent: CheckoutPaymentIntent.Capture,
        payer: {
          emailAddress: user.email,
        },
        purchaseUnits: [
          {
            amount: {
              currencyCode: dto.currencyCodeInISOFormat,
              value: String(pkgDetails.priceInUSD_Cents / 100),
            },
            description: `You are going to buy '${pkgDetails.name} package on CoverGenius'`,
            softDescriptor: `CoverGenius '${pkgDetails.name}' Package Order`,
          },
        ],
      } as OrderRequest,
      prefer: 'return=minimal',
    };

    try {
      const { result, ...httpResponse } = await ordersController.createOrder(collect);
      if (!httpResponse.statusCode.toString().startsWith('20') || result.status !== OrderStatus.Created)
        throw new InternalServerErrorException('Failed to create order using Paypal');

      const creditOrder = await this.db.creditOrder.create({
        id: result.id,
        userId: user.id,
        amountToBePaidInMinorUnits: pkgDetails.priceInUSD_Cents,
        currency: ACCEPTED_CURRENCY_CODES.USD,
        status: CREDIT_ORDER_STATUS.CREATED,
        notes: {
          user_id: user.id as string,
          user_email: user.email,
          package_id: dto.packageId as string,
        },
        orderCreatedAt: new Date(Date.now()),
        gateway: PAYMENT_GATEWAYS.PAYPAL,
      });

      return {
        order: {
          id: creditOrder.id,
          amountToBePaidInMinorUnits: pkgDetails.priceInUSD_Cents,
          currency: ACCEPTED_CURRENCY_CODES.USD,
          status: creditOrder.status,
          orderCreatedAt: creditOrder.orderCreatedAt,
        },
        pkg: pkgDetails,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async verifyRazorpayCreditOrderPayment(
    orderId: string,
    dto: VerifyRazorpayCreditOrderPaymentDto,
  ): Promise<CreditsService_OrderVerification_Response> {
    // Verify payment
    const order = await this.razorpay.orders.fetch(orderId);
    if (!order || order.status !== 'paid') {
      throw new BadRequestException('Invalid order ID or order is not paid');
    }
    const generatedSignature = crypto
      .createHmac('sha256', this.config.get('RAZORPAY_KEY_SECRET') as string)
      .update(order.id + '|' + dto.razorpay_payment_id)
      .digest('hex');
    if (generatedSignature !== dto.razorpay_signature) {
      throw new BadRequestException('Invalid signature');
    }

    const creditsAdded = await this.processOrderByID(orderId, dto.razorpay_payment_id);

    return { success: true, creditsAdded: creditsAdded };
  }

  async verifyPayPalCreditOrderPayment(orderId: string): Promise<CreditsService_OrderVerification_Response> {
    const res = await ordersController.captureOrder({ id: orderId });
    if (res.result.status !== OrderStatus.Completed) throw new BadRequestException('Payment failed');

    const creditsAdded = await this.processOrderByID(orderId);

    return { success: true, creditsAdded: creditsAdded };
  }

  private async processOrderByID(orderId: string, razorpay_payment_id?: string): Promise<number> {
    // Check if order exists and is not already processed
    const creditOrder = await this.db.creditOrder.findOne({ id: orderId });
    if (!creditOrder) {
      throw new NotFoundException('Order not found');
    }
    if (creditOrder.status === CREDIT_ORDER_STATUS.PAID) {
      throw new BadRequestException('Order has already been processed');
    }

    // Get package details to know how many credits to add
    const pkgId = creditOrder.notes.package_id;
    const pkgDetails = CREDIT_PACKAGES.find((pkg) => pkg.id === pkgId);
    if (!pkgDetails) throw new NotFoundException(`Package with ID ${pkgId} not found.`);

    // Update order status to paid and fill paymentId
    await this.db.creditOrder.updateOne(
      { id: orderId },
      {
        status: CREDIT_ORDER_STATUS.PAID,
        paymentId: razorpay_payment_id || null,
        paymentVerifiedAt: new Date(),
      },
    );

    // Add credits to user
    await this.db.user.updateOne(
      { id: creditOrder.userId },
      {
        $inc: {
          useLimit: pkgDetails.credits,
        },
      },
    );

    return pkgDetails.credits;
  }
}
