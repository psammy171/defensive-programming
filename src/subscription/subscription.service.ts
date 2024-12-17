import { BadRequestException, Injectable } from '@nestjs/common';
import { SubscriptionPlan } from './subsriptions.enum';
import { PaymentService } from 'src/payment/payment.service';
import { UpgradeSubscriptionDto } from './dtos/upgrade-subscription.dto';
import { UserContext } from 'src/global/user-context';
import { SubscriptionRepository } from './subscription.repository';

@Injectable()
export class SubscriptionService {
  constructor(
    private paymentService: PaymentService,
    private subscriptionRepo: SubscriptionRepository,
  ) {}

  private isNewSubscriptionPlanCostlier(
    user: UserContext,
    subscriptionPlan: SubscriptionPlan,
  ): boolean {
    switch (user.subscriptionPlan) {
      case SubscriptionPlan.PLATINUM:
        throw new BadRequestException(`Can't upgrade from PLATINUM plan`);
      case SubscriptionPlan.GOLD:
        if (subscriptionPlan !== SubscriptionPlan.PLATINUM) return false;
      case SubscriptionPlan.SILVER:
        if (
          subscriptionPlan === SubscriptionPlan.GOLD ||
          subscriptionPlan === SubscriptionPlan.PLATINUM
        )
          return true;
      default:
        return false;
    }
  }

  getSubscriptionPlans() {
    const keys = Object.keys(SubscriptionPlan);
    const ids = Object.values(SubscriptionPlan);
    const plans: { plan: string; id: string | SubscriptionPlan }[] = [];
    for (let i = 0; i < keys.length; i++) {
      plans.push({
        id: ids[i],
        plan: keys[i],
      });
    }
    return plans;
  }

  async upgradeSubscription(
    user: UserContext,
    upgradeSubscription: UpgradeSubscriptionDto,
  ) {
    if (
      !this.isNewSubscriptionPlanCostlier(
        user,
        upgradeSubscription.subscriptionPlan,
      )
    )
      throw new BadRequestException('Invalid subscription plan');
    const paymentInfo = await this.paymentService.makePayment(
      upgradeSubscription.cardDetails,
    );
    if (paymentInfo.status === 'success') {
      this.subscriptionRepo.updateSubscriptionByUserIdAndSunscriptionPlan(
        user,
        upgradeSubscription.subscriptionPlan,
      );
      return {
        message: 'Subscription Upgraded',
      };
    } else if (paymentInfo.status === 'failure') {
      throw new BadRequestException(paymentInfo.error);
    } else {
      throw new BadRequestException('Something went wrong');
    }
  }
}
