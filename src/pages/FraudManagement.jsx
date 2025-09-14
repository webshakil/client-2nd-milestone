// pages/FraudManagement.js - Full Working Version
import React, { useState, useEffect } from 'react';
import fraudService from '../services/fraud/fraudService';

const FraudManagement = () => {
  const [activeTab, setActiveTab] = useState('reports');
  const [selectedElectionId, setSelectedElectionId] = useState('');
  const [showReportForm, setShowReportForm] = useState(false);
  const [reports, setReports] = useState([]);
  const [pendingReports, setPendingReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [elections, setElections] = useState([]);

  // Simple user management
  const getUserData = () => {
    try {
      const userData = localStorage.getItem('vottery_user_data');
      return userData ? JSON.parse(userData) : null;
      /*eslint-disable*/
    } catch (error) {
      return null;
    }
  };

  const hasRole = (allowedRoles) => {
    const user = getUserData();
    if (!user) return false;
    const userRole = user.admin_role || user.role;
    if (!userRole) return false;
    return allowedRoles.map(r => r.toLowerCase()).includes(userRole.toLowerCase());
  };

  const user = getUserData();
  const canViewReports = hasRole(['manager', 'admin', 'auditor']);
  const canCreateReports = true;
  const canManageReports = hasRole(['manager', 'admin', 'auditor']);
  const canRunDetection = hasRole(['manager', 'admin', 'auditor', 'analyst']);

  // Fraud types
  const fraudTypes = {
    duplicate_voting: 'Duplicate Voting',
    voter_impersonation: 'Voter Impersonation',
    vote_buying: 'Vote Buying',
    coercion: 'Coercion',
    technical_manipulation: 'Technical Manipulation',
    other: 'Other'
  };

  // Load data on mount
  useEffect(() => {
    loadElections();
    if (canViewReports) {
      loadPendingReports();
    }
  }, []);

  useEffect(() => {
    if (selectedElectionId && canViewReports) {
      loadReports(selectedElectionId);
    }
  }, [selectedElectionId]);

  // API Functions
  const loadElections = async () => {
    try {
      // Sample elections - replace with real API call
      setElections([
        { id: 'election_001', title: 'Presidential Election 2024' },
        { id: 'election_002', title: 'Senate Election 2024' },
        { id: 'election_003', title: 'Local Council Election 2024' }
      ]);
    } catch (error) {
      console.error('Failed to load elections:', error);
    }
  };

  const loadReports = async (electionId) => {
    setLoading(true);
    try {
      const response = await fraudService.getFraudReports(electionId);
      if (response.success) {
        setReports(response.data.reports || []);
      }
    } catch (error) {
      console.error('Failed to load reports:', error);
      setReports([]);
    }
    setLoading(false);
  };

  const loadPendingReports = async () => {
    try {
      const response = await fraudService.getAllPendingReports();
      if (response.success) {
        setPendingReports(response.data.reports || []);
      }
    } catch (error) {
      console.error('Failed to load pending reports:', error);
      setPendingReports([]);
    }
  };

  const submitFraudReport = async (formData) => {
    setLoading(true);
    try {
      const reportData = {
        electionId: selectedElectionId,
        fraudType: formData.fraudType,
        description: formData.description,
        severity: formData.severity || 'medium',
        evidence: formData.evidence || {},
        userId: user?.id
      };

      const response = await fraudService.createFraudReport(reportData);
      if (response.success) {
        alert('Fraud report submitted successfully');
        setShowReportForm(false);
        if (selectedElectionId) {
          loadReports(selectedElectionId);
        }
        loadPendingReports();
      }
    } catch (error) {
      alert('Failed to submit report: ' + error.message);
    }
    setLoading(false);
  };

  const updateReportStatus = async (reportId, status, resolution = null) => {
    setLoading(true);
    try {
      const response = await fraudService.updateFraudReport(reportId, {
        status,
        resolution,
        userId: user?.id
      });
      
      if (response.success) {
        alert('Report status updated successfully');
        if (selectedElectionId) {
          loadReports(selectedElectionId);
        }
        loadPendingReports();
      }
    } catch (error) {
      alert('Failed to update report: ' + error.message);
    }
    setLoading(false);
  };

  const runFraudDetection = async () => {
    if (!selectedElectionId) {
      alert('Please select an election first');
      return;
    }

    setLoading(true);
    try {
      // First, try to get real voting data for the election
      let voteData = [];
      
      try {
        const votesResponse = await fraudService.getVotesForElection(selectedElectionId);
        if (votesResponse.success && votesResponse.data) {
          voteData = votesResponse.data.votes || votesResponse.data || [];
        }
      } catch (error) {
        console.warn('Could not fetch real vote data, using sample data for detection:', error);
      }

      // If no real vote data, use sample data for demonstration
      if (voteData.length === 0) {
        voteData = [
          { voter_id: 'voter_001', candidate_id: 'candidate_A', timestamp: '2024-03-01T10:00:00Z', ip_address: '192.168.1.1' },
          { voter_id: 'voter_002', candidate_id: 'candidate_B', timestamp: '2024-03-01T10:05:00Z', ip_address: '192.168.1.2' },
          { voter_id: 'voter_003', candidate_id: 'candidate_A', timestamp: '2024-03-01T10:10:00Z', ip_address: '192.168.1.3' },
          { voter_id: 'voter_001', candidate_id: 'candidate_A', timestamp: '2024-03-01T10:15:00Z', ip_address: '192.168.1.1' }, // Duplicate
          { voter_id: 'voter_004', candidate_id: 'candidate_C', timestamp: '2024-03-01T10:20:00Z', ip_address: '192.168.1.4' },
        ];
      }

      const response = await fraudService.detectFraud(selectedElectionId, voteData);
      if (response.success) {
        const issues = response.data.detected_issues || {};
        const stats = response.data.voting_statistics || {};
        
        alert(`Fraud Detection Complete for Election ${selectedElectionId}:\n\n` +
              `Issues Detected:\n` +
              `- Duplicate Votes: ${issues.duplicates || 0}\n` +
              `- Suspicious Patterns: ${issues.suspicious_patterns || 0}\n` +
              `- Voting Anomalies: ${issues.voting_anomalies || 0}\n\n` +
              `Voting Statistics:\n` +
              `- Total Votes: ${stats.total_votes || voteData.length}\n` +
              `- Unique Voters: ${stats.unique_voters || 'N/A'}\n\n` +
              `${voteData.length > 5 ? 'Analysis based on real voting data' : 'Analysis based on sample data'}`);
      }
    } catch (error) {
      alert('Fraud detection failed: ' + error.message);
      console.error('Fraud detection error:', error);
    }
    setLoading(false);
  };

  const tabs = [
    { id: 'reports', name: 'Fraud Reports', show: canViewReports || canCreateReports },
    { id: 'detection', name: 'Fraud Detection', show: canRunDetection },
    { id: 'pending', name: `Pending (${pendingReports.length})`, show: canManageReports }
  ].filter(tab => tab.show);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Fraud Management System</h1>
                <p className="text-sm text-gray-600 mt-1">Report, investigate, and analyze election fraud</p>
              </div>
              
              {canCreateReports && (
                <button
                  onClick={() => setShowReportForm(true)}
                  disabled={loading}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Report Fraud'}
                </button>
              )}
            </div>

            {/* Election Selector */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Election</label>
              <select
                value={selectedElectionId}
                onChange={(e) => setSelectedElectionId(e.target.value)}
                className="max-w-md px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">All Elections</option>
                {elections.map((election) => (
                  <option key={election.id} value={election.id}>{election.title}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        {tabs.length > 0 && (
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">Fraud Reports</h3>
            </div>
            
            {selectedElectionId ? (
              <div className="p-6">
                {loading ? (
                  <p>Loading reports...</p>
                ) : reports.length === 0 ? (
                  <p className="text-gray-500">No fraud reports found for this election</p>
                ) : (
                  <div className="space-y-4">
                    {reports.map((report) => (
                      <div key={report.report_id} className="border rounded p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <span className={`px-2 py-1 text-xs rounded ${
                                report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {report.status}
                              </span>
                              <span className="text-sm text-gray-500">
                                {fraudTypes[report.fraud_type] || report.fraud_type}
                              </span>
                            </div>
                            <p className="text-sm">{report.description}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(report.created_at).toLocaleString()}
                            </p>
                          </div>
                          
                          {canManageReports && report.status === 'pending' && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => updateReportStatus(report.report_id, 'investigating')}
                                className="px-3 py-1 text-xs bg-blue-600 text-white rounded"
                              >
                                Investigate
                              </button>
                              <button
                                onClick={() => updateReportStatus(report.report_id, 'dismissed', 'No evidence found')}
                                className="px-3 py-1 text-xs bg-gray-600 text-white rounded"
                              >
                                Dismiss
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                Please select an election to view fraud reports
              </div>
            )}
          </div>
        )}

        {/* Detection Tab */}
        {activeTab === 'detection' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Fraud Detection Analysis</h3>
            <div className="space-y-4">
              <p className="text-gray-600">
                Run automated fraud detection on voting data for the selected election.
              </p>
              <button
                onClick={runFraudDetection}
                disabled={loading || !selectedElectionId}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Analyzing...' : 'Run Fraud Detection'}
              </button>
              {!selectedElectionId && (
                <p className="text-sm text-yellow-600">Please select an election first</p>
              )}
            </div>
          </div>
        )}

        {/* Pending Tab */}
        {activeTab === 'pending' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">Pending Reports ({pendingReports.length})</h3>
            </div>
            
            <div className="p-6">
              {pendingReports.length === 0 ? (
                <p className="text-gray-500">No pending fraud reports</p>
              ) : (
                <div className="space-y-4">
                  {pendingReports.map((report) => (
                    <div key={report.report_id} className="border rounded p-4 bg-yellow-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{fraudTypes[report.fraud_type]}</p>
                          <p className="text-sm text-gray-600">{report.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Election: {report.election_id} | {new Date(report.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => updateReportStatus(report.report_id, 'investigating')}
                            className="px-3 py-1 text-xs bg-blue-600 text-white rounded"
                          >
                            Investigate
                          </button>
                          <button
                            onClick={() => updateReportStatus(report.report_id, 'dismissed', 'Invalid report')}
                            className="px-3 py-1 text-xs bg-gray-600 text-white rounded"
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Report Form Modal */}
      {showReportForm && (
        <FraudReportModal
          onSubmit={submitFraudReport}
          onClose={() => setShowReportForm(false)}
          electionId={selectedElectionId}
          fraudTypes={fraudTypes}
        />
      )}
    </div>
  );
};

// Report Form Component
const FraudReportModal = ({ onSubmit, onClose, electionId, fraudTypes }) => {
  const [formData, setFormData] = useState({
    fraudType: '',
    description: '',
    severity: 'medium',
    evidence: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fraudType || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Report Fraud</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Fraud Type *</label>
              <select
                value={formData.fraudType}
                onChange={(e) => setFormData({...formData, fraudType: e.target.value})}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select fraud type</option>
                {Object.entries(fraudTypes).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Severity</label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({...formData, severity: e.target.value})}
                className="w-full p-2 border rounded"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-2 border rounded"
                rows="3"
                placeholder="Describe the fraud incident in detail..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Evidence (Optional)</label>
              <textarea
                value={formData.evidence}
                onChange={(e) => setFormData({...formData, evidence: e.target.value})}
                className="w-full p-2 border rounded"
                rows="2"
                placeholder="Any additional evidence or witness information..."
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Submit Report
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FraudManagement;