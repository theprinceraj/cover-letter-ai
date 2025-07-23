import Razorpay = require('razorpay');
import { Orders } from 'razorpay/dist/types/orders';
import { CREDIT_PACKAGES } from '@cover-letter-ai/constants';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UserDocument } from 'src/db/schema';
import { CreateOrderDto, VerifyCreditOrderPaymentDto } from './credits.dto';
import { ConfigService } from '@nestjs/config';
import { DbService } from 'src/db/db.service';
import * as crypto from 'crypto';
import { CREDIT_ORDER_STATUS } from '@cover-letter-ai/constants';

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
  async createOrder(user: UserDocument, dto: CreateOrderDto) {
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

  async verifyCreditOrderPayment(orderId: string, dto: VerifyCreditOrderPaymentDto) {
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
        paymentId: dto.razorpay_payment_id,
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

    return { success: true, creditsAdded: pkgDetails.credits };
  }
}
