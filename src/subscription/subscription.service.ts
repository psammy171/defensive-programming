import { BadRequestException, Injectable } from '@nestjs/common';
import { SubscriptionPlan } from './subsriptions.enum';
import { PaymentService } from 'src/payment/payment.service';
import { UpgradeSubscriptionDto } from './dtos/upgrade-subscription.dto';
import { UserContext } from 'src/global/user-context';
import { SubscriptionRepository } from './subscription.repository';
import { Subscription } from './subscription.entity';

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
        return subscriptionPlan === SubscriptionPlan.PLATINUM;
      case SubscriptionPlan.SILVER:
        return (
          subscriptionPlan === SubscriptionPlan.GOLD ||
          subscriptionPlan === SubscriptionPlan.PLATINUM
        );
      default:
        throw new BadRequestException(
          `Invalid user plan: ${user.subscriptionPlan}`,
        );
    }
  }

  private findSubscriptionByPlanTypeOrThrow(
    subscriptionPlan: SubscriptionPlan,
  ): Subscription {
    return this.subscriptionRepo.findSubscriptionByPlanTypeOrThrow(
      subscriptionPlan,
    );
  }

  getSubscriptionPlans() {
    return this.subscriptionRepo.getSubscriptionPlans();
  }

  async upgradeSubscription(
    user: UserContext,
    upgradeSubscription: UpgradeSubscriptionDto,
  ) {
    this.findSubscriptionByPlanTypeOrThrow(
      upgradeSubscription.subscriptionPlan,
    );
    const isNewPlanCostlier = this.isNewSubscriptionPlanCostlier(
      user,
      upgradeSubscription.subscriptionPlan,
    );
    if (!isNewPlanCostlier)
      throw new BadRequestException(
        'New subscription plan should be higher plan then the current plan',
      );
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
    }
  }
}
