import { CREDIT_PACKAGES, CreditsService_GetPackagesList_Response, PAYMENT_GATEWAYS, AUTH_PROVIDERS } from '@cover-letter-ai/constants';
import { BadRequestException, Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreditsService } from './credits.service';
import { JwtAuthGuard } from '../auth/guards';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UserDocument, GuestDocument } from '../db/schema';
import { CreateOrderDto, VerifyRazorpayCreditOrderPaymentDto } from './credits.dto';

@Controller('credits')
export class CreditsController {
  constructor(private readonly creditsService: CreditsService) {}
  @Get('packages-list')
  getPackagesList(): CreditsService_GetPackagesList_Response {
    return CREDIT_PACKAGES;
  }

  @UseGuards(JwtAuthGuard)
  @Post('orders')
  createOrder(@GetUser() user: UserDocument | GuestDocument, @Body() dto: CreateOrderDto) {
    if (user.provider === AUTH_PROVIDERS.GUEST || !('emailVerified' in user) || !user.emailVerified) {
      throw new BadRequestException('Email is not verified or it is a guest user');
    }
    switch (dto.paymentGateway) {
      case PAYMENT_GATEWAYS.RAZORPAY:
        return this.creditsService.createOrderUsingRazorpay(user as UserDocument, dto);
      case PAYMENT_GATEWAYS.PAYPAL:
        return this.creditsService.createOrderUsingPayPal(user as UserDocument, dto);
      case PAYMENT_GATEWAYS.DODO:
        return 'hello dodo';
      default:
        throw new BadRequestException('Invalid payment gateway provided.');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('orders/verify-payment/razorpay/:orderId')
  verifyRazorpayCreditOrderPayment(
    @Param('orderId') orderId: string,
    @Body() dto: VerifyRazorpayCreditOrderPaymentDto,
    @GetUser() user: UserDocument | GuestDocument,
  ) {
    if (user.provider === AUTH_PROVIDERS.GUEST || !('emailVerified' in user) || !user.emailVerified) {
      throw new BadRequestException('Email is not verified or it is a guest user');
    }
    return this.creditsService.verifyRazorpayCreditOrderPayment(orderId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('orders/verify-payment/paypal/:orderId')
  verifyPayPalCreditOrderPayment(@Param('orderId') orderId: string, @GetUser() user: UserDocument | GuestDocument) {
    if (user.provider === AUTH_PROVIDERS.GUEST || !('emailVerified' in user) || !user.emailVerified) {
      throw new BadRequestException('Email is not verified or it is a guest user');
    }
    return this.creditsService.verifyPayPalCreditOrderPayment(orderId);
  }
}
