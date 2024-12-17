import { IsNumberString, IsString, Length } from 'class-validator';

export class CardDto {
  @Length(3, 3)
  @IsNumberString()
  cvv: string;

  @IsString()
  name: string;

  @IsString()
  expiryDate: string;

  @Length(16, 16)
  @IsNumberString()
  cardNumber: string;
}
