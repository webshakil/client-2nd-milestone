// components/election/AdvancedSettings.jsx
import React from 'react';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

const AdvancedSettings = ({ formData, handleInputChange }) => {
  const ToggleSwitch = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between">
      <div>
        <span className="font-medium text-gray-900">{label}</span>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          enabled ? 'bg-blue-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            enabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Advanced Settings & Review</h3>
      
      {/* Security & Privacy Settings */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 mb-4">Security & Privacy</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center">
                <ShieldCheckIcon className="h-5 w-5 text-gray-400 mr-2" />
                <span className="font-medium text-gray-900">Require Biometric Authentication</span>
              </div>
              <p className="text-sm text-gray-500 ml-7">
                Voters must verify identity with fingerprint/face ID
              </p>
            </div>
            <button
              onClick={() => handleInputChange('biometricRequired', !formData.biometricRequired)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                formData.biometricRequired ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  formData.biometricRequired ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Voting Settings */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 mb-4">Voting Behavior</h4>
        <div className="space-y-4">
          <ToggleSwitch
            enabled={formData.allowVoteChanges}
            onChange={(value) => handleInputChange('allowVoteChanges', value)}
            label="Allow Vote Changes"
            description="Voters can modify their votes before election ends"
          />

          <ToggleSwitch
            enabled={formData.showResultsDuringVoting}
            onChange={(value) => handleInputChange('showResultsDuringVoting', value)}
            label="Show Live Results"
            description="Display vote counts while election is active"
          />
        </div>
      </div>

      {/* Election Summary */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 mb-4">Election Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Title:</span>
            <p className="text-gray-900">{formData.title || 'Not set'}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Voting Method:</span>
            <p className="text-gray-900 capitalize">{formData.votingType.replace('_', ' ')}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Questions:</span>
            <p className="text-gray-900">{formData.questions.length}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Duration:</span>
            <p className="text-gray-900">
              {formData.startDate && formData.endDate 
                ? `${formData.startDate} to ${formData.endDate}`
                : 'Not set'
              }
            </p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Participation:</span>
            <p className="text-gray-900 capitalize">{formData.permissions}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Fee:</span>
            <p className="text-gray-900">${formData.fee}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Biometric Required:</span>
            <p className="text-gray-900">{formData.biometricRequired ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Allow Vote Changes:</span>
            <p className="text-gray-900">{formData.allowVoteChanges ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSettings;