// hooks/useFraud.js
import { useState, useEffect, useCallback } from 'react';
import fraudService from '../services/fraud/fraudService';
import toast from 'react-hot-toast';

export const useFraud = (electionId = null) => {
  const [reports, setReports] = useState([]);
  const [pendingReports, setPendingReports] = useState([]);
  const [fraudAnalysis, setFraudAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Fraud types mapping
  const fraudTypes = {
    duplicate_voting: 'Duplicate Voting',
    voter_impersonation: 'Voter Impersonation',
    vote_buying: 'Vote Buying',
    coercion: 'Coercion',
    technical_manipulation: 'Technical Manipulation',
    other: 'Other'
  };

  const severityLevels = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical'
  };

  const statusTypes = {
    pending: 'Pending',
    investigating: 'Investigating',
    resolved: 'Resolved',
    dismissed: 'Dismissed',
    escalated: 'Escalated'
  };

  // Get user data from localStorage - FIXED to prevent dependency loops
  const getUserData = useCallback(() => {
    try {
      const userData = localStorage.getItem('vottery_user_data');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        if (!user || user.id !== parsedUser.id) {
          setUser(parsedUser);
        }
        return parsedUser;
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
    return null;
  }, []); // Remove user dependency to prevent loop

  // Check if user has required role - DEFINE SECOND
  const hasRole = useCallback((allowedRoles) => {
    try {
      const currentUser = user || getUserData();
      if (!currentUser || !currentUser.role) return false;
      
      // Convert to lowercase for comparison
      const userRole = currentUser.role.toLowerCase();
      const normalizedRoles = allowedRoles.map(role => role.toLowerCase());
      
      return normalizedRoles.includes(userRole);
    } catch (error) {
      console.error('Error checking user role:', error);
      return false;
    }
  }, [user, getUserData]);

  // Initialize user data on mount
  useEffect(() => {
    getUserData();
  }, [getUserData]);

  // Create fraud report
  const createReport = useCallback(async (reportData) => {
    setLoading(true);
    setError(null);
    
    try {
      const currentUser = user || getUserData();
      const enrichedReportData = {
        ...reportData,
        userId: currentUser?.id
      };
      
      const response = await fraudService.createFraudReport(enrichedReportData);
      if (response.success) {
        toast.success('Fraud report submitted successfully');
        if (electionId === reportData.electionId) {
          await fetchReports(electionId);
        }
        return response.data;
      }
    } catch (error) {
      setError(error.message);
      toast.error(error.message || 'Failed to submit fraud report');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [electionId, user, getUserData]);

  // Fetch reports for election
  const fetchReports = useCallback(async (electionId, status = null) => {
    if (!electionId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fraudService.getFraudReports(electionId, status);
      if (response.success) {
        setReports(response.data.reports);
        return response.data;
      }
    } catch (error) {
      setError(error.message);
      toast.error('Failed to fetch fraud reports');
    } finally {
      setLoading(false);
    }
  }, []);

  // Update report status
  const updateReportStatus = useCallback(async (reportId, status, resolution = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const currentUser = user || getUserData();
      const response = await fraudService.updateFraudReport(reportId, {
        status,
        resolution,
        userId: currentUser?.id
      });
      
      if (response.success) {
        toast.success('Report status updated successfully');
        // Refresh reports
        if (electionId) {
          await fetchReports(electionId);
        }
        await fetchPendingReports();
        return response.data;
      }
    } catch (error) {
      setError(error.message);
      toast.error(error.message || 'Failed to update report status');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [electionId, fetchReports, user, getUserData]);

  // Detect fraud patterns
  const detectFraud = useCallback(async (electionId, voteData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fraudService.detectFraud(electionId, voteData);
      if (response.success) {
        setFraudAnalysis(response.data);
        toast.success('Fraud detection analysis completed');
        return response.data;
      }
    } catch (error) {
      setError(error.message);
      toast.error(error.message || 'Failed to perform fraud detection');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch pending reports
  const fetchPendingReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fraudService.getAllPendingReports();
      if (response.success) {
        setPendingReports(response.data.reports);
        return response.data;
      }
    } catch (error) {
      setError(error.message);
      toast.error('Failed to fetch pending reports');
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch reports when electionId changes
  useEffect(() => {
    if (electionId) {
      fetchReports(electionId);
    }
  }, [electionId, fetchReports]);

  // Auto-fetch pending reports on mount - FIXED dependencies
  useEffect(() => {
    fetchPendingReports();
  }, []); // Empty dependency array to run only once

  // Return object with all properly defined functions
  return {
    // Data
    reports,
    pendingReports,
    fraudAnalysis,
    loading,
    error,
    user,
    
    // Constants
    fraudTypes,
    severityLevels,
    statusTypes,
    
    // Actions
    createReport,
    fetchReports,
    updateReportStatus,
    detectFraud,
    fetchPendingReports,
    
    // Utilities
    hasRole,
    getUserData,
    clearError: () => setError(null),
    refreshData: () => {
      if (electionId) fetchReports(electionId);
      fetchPendingReports();
    }
  };
};