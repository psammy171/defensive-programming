import { Injectable } from '@nestjs/common';
import { UserContext } from 'src/global/user-context';
import { SubscriptionPlan } from './subsriptions.enum';

@Injectable()
export class SubscriptionRepository {
  updateSubscriptionByUserIdAndSunscriptionPlan(
    user: UserContext,
    subscriptionPlan: SubscriptionPlan,
  ): UserContext {
    return {
      ...user,
      subscriptionPlan: subscriptionPlan,
    };
  }
}
