// src/services/PaymentService.js
import { toast } from 'react-hot-toast';

class PaymentService {
  constructor() {
    this.apiUrl = import.meta.env.VITE_PAYMENT_API_URL || 'http://localhost:3001';
  }

  // Get payment amount from election
  getPaymentAmount(election) {
    return election.participation_fee || election.regional_fees?.region1 || 10;
  }

  // Process Stripe Payment
  async processStripePayment(election, userId = 'user_123') {
    try {
      const response = await fetch(`${this.apiUrl}/api/payments/stripe/create-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: this.getPaymentAmount(election),
          currency: 'usd',
          electionTitle: election.title,
          electionId: election.id,
          userId: userId,
          successUrl: `${window.location.origin}/payment/success?election_id=${election.id}`,
          cancelUrl: `${window.location.origin}/payment/cancel?election_id=${election.id}`,
        }),
      });

      const data = await response.json();

      if (data.success && data.url) {
        window.location.href = data.url;
        return { success: true };
      } else {
        throw new Error(data.error || 'Stripe payment failed');
      }
    } catch (error) {
      console.error('Stripe payment error:', error);
      toast.error(error.message || 'Stripe payment failed. Please try again.');
      return { success: false, error: error.message };
    }
  }

  // Process Paddle Payment
  async processPaddlePayment(election, userId = 'user_123', userEmail = 'user@example.com') {
    try {
      const response = await fetch(`${this.apiUrl}/api/payments/paddle/create-transaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: this.getPaymentAmount(election),
          currency: 'USD',
          electionTitle: election.title,
          electionId: election.id,
          userId: userId,
          userEmail: userEmail,
          successUrl: `${window.location.origin}/payment/success?election_id=${election.id}`,
          cancelUrl: `${window.location.origin}/payment/cancel?election_id=${election.id}`,
        }),
      });

      const data = await response.json();

      if (data.success && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return { success: true };
      } else {
        throw new Error(data.error || 'Paddle payment failed');
      }
    } catch (error) {
      console.error('Paddle payment error:', error);
      toast.error(error.message || 'Paddle payment failed. Please try again.');
      return { success: false, error: error.message };
    }
  }

  // Process Demo Payment
  /*eslint-disable*/
  async processDemoPayment(election) {
    return new Promise((resolve) => {
      setTimeout(() => {
        toast.success('Demo payment successful! You can now vote.');
        resolve({ success: true });
      }, 2000);
    });
  }

  // Verify Payment
  async verifyPayment(provider, paymentIntentId) {
    try {
      const response = await fetch(`${this.apiUrl}/api/payments/${provider}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentIntentId }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Payment verification error:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new PaymentService();