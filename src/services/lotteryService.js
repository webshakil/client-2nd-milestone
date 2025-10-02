const API_URL = 'http://localhost:3007/api/lottery';

export const lotteryService = {
  // Draw operations
  async createDraw(electionId, totalWinners, prizePool, lotteryType = '4d') {
    const response = await fetch(`${API_URL}/draws/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ electionId, totalWinners, prizePool, lotteryType })
    });
    return response.json();
  },

  async generateTicket(userId, electionId, drawId) {
    const response = await fetch(`${API_URL}/tickets/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, electionId, drawId })
    });
    return response.json();
  },

  async conductDraw(drawId) {
    const response = await fetch(`${API_URL}/draws/conduct`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ drawId })
    });
    return response.json();
  },

  async getDrawByElection(electionId) {
    const response = await fetch(`${API_URL}/draws/election?electionId=${electionId}`);
    return response.json();
  },

  async getUserTickets(userId, electionId = null) {
    let url = `${API_URL}/tickets/user?userId=${userId}`;
    if (electionId) url += `&electionId=${electionId}`;
    const response = await fetch(url);
    return response.json();
  },

  async getWinners(drawId) {
    const response = await fetch(`${API_URL}/draws/winners?drawId=${drawId}`);
    return response.json();
  },

  // Prize operations
  async createPrizeDistribution(ticketId, userId, amount, distributionMethod) {
    const response = await fetch(`${API_URL}/prizes/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketId, userId, amount, distributionMethod })
    });
    return response.json();
  },

  async getPendingPrizes(threshold = 100) {
    const response = await fetch(`${API_URL}/prizes/pending?threshold=${threshold}`);
    return response.json();
  },

  async getUserPrizes(userId) {
    const response = await fetch(`${API_URL}/prizes/user?userId=${userId}`);
    return response.json();
  },

  async claimPrize(ticketId, userId) {
    const response = await fetch(`${API_URL}/prizes/claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketId, userId })
    });
    return response.json();
  }
};