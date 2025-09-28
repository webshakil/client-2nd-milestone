import { BaseService } from "../core/BaseService";

class LotteryService extends BaseService {
  constructor() {
    super('election');
  }

  // Create lottery configuration
  async createLottery(lotteryData) {
    try {
      const response = await this.post('/api/v1/lottery/', lotteryData);
      return response;
    } catch (error) {
      console.error('Failed to create lottery:', error);
      throw error;
    }
  }

  // Get lottery by election ID
  async getLotteryByElection(electionId) {
    try {
      const response = await this.get(`/api/v1/lottery/?election_id=${electionId}`);
      return response;
    } catch (error) {
      console.error('Failed to get lottery:', error);
      throw error;
    }
  }

  // Update lottery configuration
  async updateLottery(lotteryId, lotteryData) {
    try {
      const response = await this.put(`/api/v1/lottery/${lotteryId}`, lotteryData);
      return response;
    } catch (error) {
      console.error('Failed to update lottery:', error);
      throw error;
    }
  }

  // Delete lottery
  async deleteLottery(lotteryId) {
    try {
      const response = await this.delete(`/api/v1/lottery/${lotteryId}`);
      return response;
    } catch (error) {
      console.error('Failed to delete lottery:', error);
      throw error;
    }
  }

  // Draw lottery winners
  async drawWinners(electionId) {
    try {
      const response = await this.post(`/api/v1/lottery/draw`, { electionId });
      return response;
    } catch (error) {
      console.error('Failed to draw lottery winners:', error);
      throw error;
    }
  }

  // Get lottery winners
  async getLotteryWinners(electionId) {
    try {
      const response = await this.get(`/api/v1/lottery/winners?election_id=${electionId}`);
      return response;
    } catch (error) {
      console.error('Failed to get lottery winners:', error);
      throw error;
    }
  }

  // Get lottery statistics
  async getLotteryStats(electionId) {
    try {
      const response = await this.get(`/api/v1/lottery/stats?election_id=${electionId}`);
      return response;
    } catch (error) {
      console.error('Failed to get lottery statistics:', error);
      throw error;
    }
  }
}