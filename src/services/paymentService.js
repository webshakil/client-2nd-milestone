const API_URL = 'http://localhost:3005/api/payments';

export const paymentService = {
  // Wallet operations
  async getWallet(userId) {
    const response = await fetch(`${API_URL}/wallet?userId=${userId}`);
    return response.json();
  },

  async deposit(userId, amount, gatewayTransactionId) {
    const response = await fetch(`${API_URL}/wallet/deposit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, amount, gatewayTransactionId })
    });
    return response.json();
  },

  async withdraw(userId, amount) {
    const response = await fetch(`${API_URL}/wallet/withdraw`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, amount })
    });
    return response.json();
  },

  async getTransactionHistory(userId, limit = 50, offset = 0) {
    const response = await fetch(
      `${API_URL}/wallet/transactions?userId=${userId}&limit=${limit}&offset=${offset}`
    );
    return response.json();
  },

  // Subscription operations
  async getSubscriptionPlans() {
    const response = await fetch(`${API_URL}/subscriptions/plans`);
    return response.json();
  },

  async subscribe(userId, planType, gatewayTransactionId) {
    const response = await fetch(`${API_URL}/subscriptions/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, planType, gatewayTransactionId })
    });
    return response.json();
  },

  async getUserSubscription(userId) {
    const response = await fetch(`${API_URL}/subscriptions/user?userId=${userId}`);
    return response.json();
  },

  async cancelSubscription(subscriptionId, userId) {
    const response = await fetch(`${API_URL}/subscriptions/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscriptionId, userId })
    });
    return response.json();
  }
};