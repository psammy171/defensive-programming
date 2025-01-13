import { BadRequestException, Injectable } from '@nestjs/common';
import { UserContext } from 'src/global/user-context';
import { SubscriptionPlan } from './subsriptions.enum';
import { Subscription } from './subscription.entity';

@Injectable()
export class SubscriptionRepository {
  private SUBSCRIPTION_PLANS: Subscription[] = [
    {
      subscriptionPlan: SubscriptionPlan.PLATINUM,
      price: 1000,
    },
    {
      subscriptionPlan: SubscriptionPlan.GOLD,
      price: 800,
    },
    {
      subscriptionPlan: SubscriptionPlan.SILVER,
      price: 500,
    },
  ];

  findSubscriptionByPlanTypeOrThrow(
    subscriptionPlan: SubscriptionPlan,
  ): Subscription {
    const subscription = this.SUBSCRIPTION_PLANS.find(
      (sub) => sub.subscriptionPlan === subscriptionPlan,
    );
    if (!subscription)
      throw new BadRequestException(
        `Subscription plan ${subscriptionPlan} not found`,
      );
    return subscription;
  }

  getSubscriptionPlans(): Subscription[] {
    return this.SUBSCRIPTION_PLANS;
  }

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
