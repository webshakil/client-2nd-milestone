// services/fraud/fraudService.js
import { apiClient } from '../core/apiClient';

class FraudService {
  constructor() {
    this.fraudService = 'fraud'; // Using fraud service for fraud endpoints
    this.electionService = 'election'; // Using election service for elections
    this.votingService = 'votingengineqa'; // Using voting engine for vote data
    this.basePath = '/api/fraud';
  }

  // Create fraud report
  async createFraudReport(reportData) {
    try {
      const response = await apiClient.request(
        this.fraudService,
        `${this.basePath}/report`,
        {
          method: 'POST',
          body: reportData
        }
      );
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get fraud reports for election
  async getFraudReports(electionId, status = null) {
    try {
      const endpoint = status 
        ? `${this.basePath}/reports/${electionId}?status=${status}`
        : `${this.basePath}/reports/${electionId}`;
        
      const response = await apiClient.request(
        this.fraudService,
        endpoint,
        {
          method: 'GET',
          cacheTTL: 10000
        }
      );
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update fraud report status
  async updateFraudReport(reportId, updateData) {
    try {
      const response = await apiClient.request(
        this.fraudService,
        `${this.basePath}/report/${reportId}`,
        {
          method: 'PUT',
          body: updateData
        }
      );
      
      // Clear relevant cache entries
      apiClient.clearCache('fraud_reports');
      apiClient.clearCache('fraud_pending');
      
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Detect fraud patterns
  async detectFraud(electionId, voteData) {
    try {
      const response = await apiClient.request(
        this.fraudService,
        `${this.basePath}/detect`,
        {
          method: 'POST',
          body: {
            electionId,
            voteData
          },
          skipCache: true
        }
      );
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get all pending fraud reports
  async getAllPendingReports() {
    try {
      const response = await apiClient.request(
        this.fraudService,
        `${this.basePath}/pending`,
        {
          method: 'GET',
          cacheTTL: 5000
        }
      );
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get real elections list
  async getElections() {
    try {
      const response = await apiClient.request(
        this.electionService,
        '/api/elections',
        {
          method: 'GET',
          cacheTTL: 60000
        }
      );
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get votes for fraud detection from voting engine
  async getVotesForElection(electionId) {
    try {
      const response = await apiClient.request(
        this.votingService,
        `/api/votes/election/${electionId}`,
        {
          method: 'GET',
          cacheTTL: 30000
        }
      );
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Error handler
  handleError(error) {
    return {
      message: error.message || 'An error occurred',
      status: error.status || 500,
      data: error.data || null
    };
  }
}

export default new FraudService();