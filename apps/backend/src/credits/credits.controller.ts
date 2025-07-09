import { CREDIT_PACKAGES } from '@cover-letter-ai/constants';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreditsService } from './credits.service';
import { JwtAuthGuard } from 'src/auth/guards';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { UserDocument } from 'src/db/schema';
import { CreateOrderDto, VerifyCreditOrderPaymentDto } from './credits.dto';

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
    return this.creditsService.createOrder(user, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('orders/verify-payment/:orderId')
  verifyCreditOrderPayment(@Param('orderId') orderId: string, @Body() dto: VerifyCreditOrderPaymentDto) {
    return this.creditsService.verifyCreditOrderPayment(orderId, dto);
  }
}
