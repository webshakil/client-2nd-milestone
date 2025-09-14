// components/fraud/FraudReportDetails.js
import React, { useState } from 'react';
import { useFraud } from '../../hooks/useFraud';
import { useAuth } from '../../contexts/AuthContext';

const FraudReportDetails = ({ report, onClose, onStatusUpdate, canManage }) => {
  const { fraudTypes, severityLevels, statusTypes } = useFraud();
  const { user } = useAuth();
  
  const [resolution, setResolution] = useState('');
  const [showResolutionForm, setShowResolutionForm] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');

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

  // Handle status update with resolution
  const handleStatusUpdate = async () => {
    if (selectedStatus && onStatusUpdate) {
      try {
        await onStatusUpdate(report.report_id, selectedStatus, resolution || null, user?.id);
        onClose();
      } catch (error) {
        console.error('Error updating status:', error);
      }
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Fraud Report Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <span className="sr-only">Close</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Report ID</label>
                <p className="text-sm text-gray-900">{report.report_id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Election ID</label>
                <p className="text-sm text-gray-900">{report.election_id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <div className="mt-1">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(report.status)}`}>
                    {statusTypes[report.status]}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Severity</label>
                <div className="mt-1">
                  <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(report.severity)}`}>
                    {severityLevels[report.severity]}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Fraud Type</label>
                <p className="text-sm text-gray-900">{fraudTypes[report.fraud_type]}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Created</label>
                <p className="text-sm text-gray-900">{formatDate(report.created_at)}</p>
              </div>
              {report.reported_user_id && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Reported User</label>
                  <p className="text-sm text-gray-900">{report.reported_user_id}</p>
                </div>
              )}
              {report.investigated_by && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Investigated By</label>
                  <p className="text-sm text-gray-900">{report.investigated_by}</p>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Description</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-900 whitespace-pre-wrap">
                {report.description}
              </p>
            </div>
          </div>

          {/* Evidence */}
          {report.evidence && Object.keys(report.evidence).length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Evidence</h3>
              <div className="space-y-3">
                {report.evidence.additionalInfo && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Additional Information</label>
                    <div className="bg-gray-50 rounded-lg p-3 mt-1">
                      <p className="text-sm text-gray-900">
                        {report.evidence.additionalInfo}
                      </p>
                    </div>
                  </div>
                )}
                
                {report.evidence.witnesses && report.evidence.witnesses.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Witnesses</label>
                    <div className="mt-1">
                      {report.evidence.witnesses.map((witness, index) => (
                        <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2 mb-1">
                          {witness}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Resolution */}
          {report.resolution && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Resolution</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-900 whitespace-pre-wrap">
                  {report.resolution}
                </p>
              </div>
            </div>
          )}

          {/* Status Update Form */}
          {canManage && !showResolutionForm && report.status !== 'resolved' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Update Status</h3>
              <div className="flex space-x-3">
                {report.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        setSelectedStatus('investigating');
                        setShowResolutionForm(true);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Start Investigation
                    </button>
                    <button
                      onClick={() => {
                        setSelectedStatus('dismissed');
                        setShowResolutionForm(true);
                      }}
                      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                    >
                      Dismiss Report
                    </button>
                  </>
                )}
                
                {report.status === 'investigating' && (
                  <>
                    <button
                      onClick={() => {
                        setSelectedStatus('resolved');
                        setShowResolutionForm(true);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Mark Resolved
                    </button>
                    <button
                      onClick={() => {
                        setSelectedStatus('escalated');
                        setShowResolutionForm(true);
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Escalate
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Resolution Form */}
          {showResolutionForm && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                {selectedStatus === 'resolved' ? 'Resolution Details' : 
                 selectedStatus === 'dismissed' ? 'Dismissal Reason' :
                 selectedStatus === 'escalated' ? 'Escalation Details' : 'Investigation Notes'}
              </h3>
              <div className="space-y-3">
                <textarea
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  rows="4"
                  placeholder={`Enter ${selectedStatus} details...`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={selectedStatus === 'resolved' || selectedStatus === 'dismissed'}
                />
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowResolutionForm(false);
                      setSelectedStatus('');
                      setResolution('');
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleStatusUpdate}
                    disabled={!selectedStatus || ((selectedStatus === 'resolved' || selectedStatus === 'dismissed') && !resolution.trim())}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Update Status
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FraudReportDetails;