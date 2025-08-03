import { CREDIT_PACKAGES, PAYMENT_GATEWAYS } from '@cover-letter-ai/constants';
import { BadRequestException, Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreditsService } from './credits.service';
import { JwtAuthGuard } from 'src/auth/guards';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { UserDocument } from 'src/db/schema';
import { CreateOrderDto, VerifyRazorpayCreditOrderPaymentDto } from './credits.dto';

@Controller('credits')
export class CreditsController {
  constructor(private readonly creditsService: CreditsService) {}
  @Get('packages-list')
  getPackagesList() {
    return CREDIT_PACKAGES;
  }

  @UseGuards(JwtAuthGuard)
  @Post('orders')
  createOrder(@GetUser() user: UserDocument, @Body() dto: CreateOrderDto) {
    if (!user.emailVerified) throw new BadRequestException('Email is not verified or it is a guest user');
    switch (dto.paymentGateway) {
      case PAYMENT_GATEWAYS.RAZORPAY:
        return this.creditsService.createOrderUsingRazorpay(user, dto);
      case PAYMENT_GATEWAYS.PAYPAL:
        return this.creditsService.createOrderUsingPayPal(user, dto);
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
    @GetUser() user: UserDocument,
  ) {
    if (!user.emailVerified) throw new BadRequestException('Email is not verified or it is a guest user');
    return this.creditsService.verifyRazorpayCreditOrderPayment(orderId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('orders/verify-payment/paypal/:orderId')
  verifyPayPalCreditOrderPayment(@Param('orderId') orderId: string, @GetUser() user: UserDocument) {
    if (!user.emailVerified) throw new BadRequestException('Email is not verified or it is a guest user');
    return this.creditsService.verifyPayPalCreditOrderPayment(orderId);
  }
}
