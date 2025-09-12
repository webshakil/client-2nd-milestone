import BaseService from "../core/BaseService";

class AnalyticsService extends BaseService {
  constructor() {
    super('analytics');
  }

  async getDashboardMetrics(timeRange = '30d') {
    return this.get(`/api/analytics/dashboard?range=${timeRange}`);
  }

  async getUserMetrics(userId, timeRange = '30d') {
    return this.get(`/api/analytics/users/${userId}?range=${timeRange}`);
  }

  async getElectionMetrics(electionId, timeRange = '30d') {
    return this.get(`/api/analytics/elections/${electionId}?range=${timeRange}`);
  }

  async exportData(type, filters = {}) {
    return this.post('/api/analytics/export', { type, filters });
  }
}

export const analyticsService = new AnalyticsService();