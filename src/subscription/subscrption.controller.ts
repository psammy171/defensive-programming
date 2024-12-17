import { Body, Controller, Get, Post } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { UpgradeSubscriptionDto } from './dtos/upgrade-subscription.dto';
import { UserContext } from 'src/global/user-context';
import { SubscriptionPlan } from './subsriptions.enum';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  @Get()
  getSubscriptionPlans() {
    return this.subscriptionService.getSubscriptionPlans();
  }

  @Post('upgrade')
  upgradeSubscription(@Body() upgradeSubscription: UpgradeSubscriptionDto) {
    const user: UserContext = {
      id: 1,
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      subscriptionPlan: SubscriptionPlan.SILVER,
    };
    return this.subscriptionService.upgradeSubscription(
      user,
      upgradeSubscription,
    );
  }
}
