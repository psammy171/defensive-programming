import { SubscriptionPlan } from 'src/subscription/subsriptions.enum';

export type UserContext = {
  id: number;
  name: string;
  email: string;
  subscriptionPlan: SubscriptionPlan;
};
