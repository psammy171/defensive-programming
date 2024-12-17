import { IsEnum, IsNotEmptyObject, ValidateNested } from 'class-validator';
import { SubscriptionPlan } from '../subsriptions.enum';
import { CardDto } from '../../global/card.dto';
import { Type } from 'class-transformer';

export class UpgradeSubscriptionDto {
  @ValidateNested()
  @Type(() => CardDto)
  @IsNotEmptyObject()
  cardDetails: CardDto;

  @IsEnum(SubscriptionPlan)
  subscriptionPlan: SubscriptionPlan;
}
