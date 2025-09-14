// components/fraud/FraudReportForm.js
import React, { useState } from 'react';
import { useFraud } from '../../hooks/useFraud';
import { useAuth } from '../../contexts/AuthContext';

const FraudReportForm = ({ electionId, onSuccess, onCancel }) => {
  const { createReport, fraudTypes, loading } = useFraud(electionId);
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    fraudType: '',
    description: '',
    reportedUserId: '',
    severity: 'medium',
    evidence: {
      screenshots: [],
      documents: [],
      witnesses: [],
      additionalInfo: ''
    }
  });
  
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleEvidenceChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      evidence: {
        ...prev.evidence,
        [field]: value
      }
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fraudType) {
      newErrors.fraudType = 'Fraud type is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const reportData = {
        electionId,
        fraudType: formData.fraudType,
        description: formData.description.trim(),
        reportedUserId: formData.reportedUserId || null,
        severity: formData.severity,
        evidence: formData.evidence,
        userId: user?.id
      };

      await createReport(reportData);
      
      // Reset form
      setFormData({
        fraudType: '',
        description: '',
        reportedUserId: '',
        severity: 'medium',
        evidence: {
          screenshots: [],
          documents: [],
          witnesses: [],
          additionalInfo: ''
        }
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting fraud report:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Report Fraud
        </h3>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <span className="sr-only">Close</span>
            ✕
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Fraud Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fraud Type *
          </label>
          <select
            name="fraudType"
            value={formData.fraudType}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.fraudType ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          >
            <option value="">Select fraud type</option>
            {Object.entries(fraudTypes).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
          {errors.fraudType && (
            <p className="text-red-500 text-sm mt-1">{errors.fraudType}</p>
          )}
        </div>

        {/* Severity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Severity Level
          </label>
          <select
            name="severity"
            value={formData.severity}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        {/* Reported User ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reported User ID (optional)
          </label>
          <input
            type="text"
            name="reportedUserId"
            value={formData.reportedUserId}
            onChange={handleInputChange}
            placeholder="Enter user ID if known"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            placeholder="Provide detailed description of the fraud incident..."
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            Minimum 20 characters ({formData.description.length}/20)
          </p>
        </div>

        {/* Evidence Section */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-900">Evidence (Optional)</h4>
          
          {/* Additional Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Information
            </label>
            <textarea
              value={formData.evidence.additionalInfo}
              onChange={(e) => handleEvidenceChange('additionalInfo', e.target.value)}
              rows="3"
              placeholder="Any additional details, witness information, or relevant context..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Witnesses */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Witnesses
            </label>
            <input
              type="text"
              value={formData.evidence.witnesses.join(', ')}
              onChange={(e) => handleEvidenceChange('witnesses', e.target.value.split(',').map(w => w.trim()).filter(w => w))}
              placeholder="Witness names or IDs (comma-separated)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FraudReportForm;