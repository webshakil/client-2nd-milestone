// src/services/cryptoService.js
import axios from 'axios';

//const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
const API_BASE_URL = import.meta.env.VITE_API_URL_CRYPTOGRAPHIC_VOTING|| 'http://localhost:3008';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/crypto`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

class CryptoService {
  // Generate election keys
  static async generateElectionKeys(electionId, userRole, userId) {
    try {
      const response = await apiClient.post('/keys', {
        electionId,
        userRole,
        userId
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to generate election keys');
    }
  }

  // Process encrypted vote
  static async processVote(voteData) {
    try {
      const response = await apiClient.post('/vote', voteData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to process vote');
    }
  }

  // Calculate homomorphic tally
  static async calculateTally(electionId, userRole) {
    try {
      const response = await apiClient.post('/tally', {
        electionId,
        userRole
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to calculate tally');
    }
  }

  // Verify vote integrity
  static async verifyVote(verificationData) {
    try {
      const response = await apiClient.post('/verify', verificationData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to verify vote');
    }
  }

  // Process mixnet
  static async processMixnet(electionId, userRole) {
    try {
      const response = await apiClient.post('/mixnet', {
        electionId,
        userRole
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to process mixnet');
    }
  }

  // Get receipt by verification code
  static async getReceipt(verificationCode) {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/receipts/${verificationCode}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Receipt not found');
    }
  }

  // Get audit logs
  static async getAuditLogs(electionId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/audit/${electionId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch audit logs');
    }
  }
}

export default CryptoService;