import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SubscriptionModule } from './subscription/subscription.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [SubscriptionModule, PaymentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
