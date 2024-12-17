import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscrption.controller';
import { SubscriptionService } from './subscription.service';
import { PaymentModule } from 'src/payment/payment.module';
import { SubscriptionRepository } from './subscription.repository';

@Module({
  imports: [PaymentModule],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, SubscriptionRepository],
})
export class SubscriptionModule {}
