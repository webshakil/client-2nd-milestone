// components/fraud/FraudReportsList.js
import React, { useState } from 'react';
import { useFraud } from '../../hooks/useFraud';
import { useAuth } from '../../contexts/AuthContext';
import FraudReportDetails from './FraudReportDetails';

const FraudReportsList = ({ electionId, showActions = true }) => {
  const { 
    reports, 
    updateReportStatus, 
    fraudTypes, 
    severityLevels, 
    statusTypes,
    loading 
  } = useFraud(electionId);
  const { user, hasRole } = useAuth();
  
  const [selectedReport, setSelectedReport] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');

  // Check if user can manage reports
  const canManageReports = hasRole(['Manager', 'Admin', 'Auditor']);

  // Filter reports
  const filteredReports = reports.filter(report => {
    const statusMatch = statusFilter === 'all' || report.status === statusFilter;
    const severityMatch = severityFilter === 'all' || report.severity === severityFilter;
    return statusMatch && severityMatch;
  });

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      investigating: 'bg-blue-100 text-blue-800',
      resolved: 'bg-green-100 text-green-800',
      dismissed: 'bg-gray-100 text-gray-800',
      escalated: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // Get severity color
  const getSeverityColor = (severity) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    return colors[severity] || 'bg-gray-100 text-gray-800';
  };

  // Handle status update
  const handleStatusUpdate = async (reportId, newStatus) => {
    try {
      await updateReportStatus(reportId, newStatus, null, user?.id);
    } catch (error) {
      console.error('Error updating report status:', error);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Fraud Reports ({filteredReports.length})
          </h3>
          
          {/* Filters */}
          <div className="flex space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              {Object.entries(statusTypes).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Severity</option>
              {Object.entries(severityLevels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="divide-y divide-gray-200">
        {filteredReports.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            No fraud reports found
          </div>
        ) : (
          filteredReports.map((report) => (
            <div key={report.report_id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(report.status)}`}>
                      {statusTypes[report.status]}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(report.severity)}`}>
                      {severityLevels[report.severity]}
                    </span>
                    <span className="text-sm text-gray-500">
                      {fraudTypes[report.fraud_type]}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-900 mb-2">
                    {report.description.length > 150 
                      ? `${report.description.substring(0, 150)}...`
                      : report.description
                    }
                  </p>
                  
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>Report ID: {report.report_id}</div>
                    <div>Created: {formatDate(report.created_at)}</div>
                    {report.reported_user_id && (
                      <div>Reported User: {report.reported_user_id}</div>
                    )}
                    {report.investigated_by && (
                      <div>Investigated by: {report.investigated_by}</div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => setSelectedReport(report)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View Details
                  </button>
                  
                  {showActions && canManageReports && report.status === 'pending' && (
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleStatusUpdate(report.report_id, 'investigating')}
                        className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Investigate
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(report.report_id, 'dismissed')}
                        className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}
                  
                  {showActions && canManageReports && report.status === 'investigating' && (
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleStatusUpdate(report.report_id, 'resolved')}
                        className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Resolve
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(report.report_id, 'escalated')}
                        className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Escalate
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Report Details Modal */}
      {selectedReport && (
        <FraudReportDetails
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onStatusUpdate={handleStatusUpdate}
          canManage={canManageReports}
        />
      )}
    </div>
  );
};

export default FraudReportsList;