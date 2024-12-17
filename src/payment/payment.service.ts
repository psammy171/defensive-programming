import { Injectable } from '@nestjs/common';
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
    const res = await axios.post(this.PAYMENT_GATEWAY_LINK, this.map(card));
    return res.data as PaymentResponse;
  }
}
