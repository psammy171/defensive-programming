import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { CardDto } from 'src/global/card.dto';

interface PaymentResponse {
  status: 'success' | 'failure';
  error?: string;
  transaction_id?: string;
}

@Injectable()
export class PaymentService {
  private PAYMENT_GATEWAY_LINK = 'https://payment.gateway.com/api/pay';

  private map(card: CardDto) {
    return {
      name: card.name,
      cvv: card.cvv,
      card_number: card.cardNumber,
      expiry_date: card.expiryDate,
    };
  }

  async makePayment(card: CardDto): Promise<PaymentResponse> {
    try {
      const { data }: { data: PaymentResponse } = await axios.post(
        this.PAYMENT_GATEWAY_LINK,
        this.map(card),
      );
      return data;
    } catch (err) {
      throw new InternalServerErrorException(
        `Something went wrong while processing payment. Code ${err.code}, message: ${err.message}`,
      );
    }
  }
}
