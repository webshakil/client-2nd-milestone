// components/election/Schedule.jsx
import React from 'react';
import { CurrencyDollarIcon, GlobeAltIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const Schedule = ({ formData, handleInputChange }) => {
  const permissionTypes = [
    {
      value: 'global',
      name: 'Global',
      description: 'Anyone worldwide can participate',
      icon: GlobeAltIcon
    },
    {
      value: 'country',
      name: 'Country Specific',
      description: 'Restrict to specific countries',
      icon: GlobeAltIcon
    },
    {
      value: 'group',
      name: 'Group Only',
      description: 'Only group members can vote',
      icon: UserGroupIcon
    },
    {
      value: 'organization',
      name: 'Organization Only',
      description: 'Only organization members',
      icon: UserGroupIcon
    }
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Schedule & Access</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date & Time *
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="time"
              value={formData.startTime}
              onChange={(e) => handleInputChange('startTime', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Date & Time *
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="time"
              value={formData.endTime}
              onChange={(e) => handleInputChange('endTime', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Timezone
        </label>
        <select
          value={formData.timezone}
          onChange={(e) => handleInputChange('timezone', e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value={Intl.DateTimeFormat().resolvedOptions().timeZone}>
            {Intl.DateTimeFormat().resolvedOptions().timeZone} (Auto-detected)
          </option>
        </select>
      </div>

      {/* Permission Settings */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Who can participate? *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {permissionTypes.map(permission => {
            const Icon = permission.icon;
            return (
              <div
                key={permission.value}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                  formData.permissions === permission.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleInputChange('permissions', permission.value)}
              >
                <Icon className="h-6 w-6 text-gray-600 mb-2" />
                <h4 className="font-medium text-gray-900">{permission.name}</h4>
                <p className="text-sm text-gray-500 mt-1">{permission.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Country Restriction (if country-specific) */}
      {formData.permissions === 'country' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Countries
          </label>
          <select
            value={formData.countryRestriction}
            onChange={(e) => handleInputChange('countryRestriction', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select countries...</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="UK">United Kingdom</option>
            <option value="DE">Germany</option>
            <option value="FR">France</option>
            <option value="BD">Bangladesh</option>
            <option value="IN">India</option>
          </select>
        </div>
      )}

      {/* Group/Organization ID (if applicable) */}
      {(formData.permissions === 'group' || formData.permissions === 'organization') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {formData.permissions === 'group' ? 'Group ID' : 'Organization ID'}
          </label>
          <input
            type="text"
            value={formData.permissions === 'group' ? formData.groupId : formData.organizationId}
            onChange={(e) => handleInputChange(
              formData.permissions === 'group' ? 'groupId' : 'organizationId', 
              e.target.value
            )}
            placeholder={`Enter ${formData.permissions} identifier`}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      )}

      {/* Participation Fee */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <CurrencyDollarIcon className="h-4 w-4 inline mr-1" />
          Participation Fee (USD)
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.fee}
            onChange={(e) => handleInputChange('fee', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Set to 0 for free elections. Fees help prevent spam and fund prizes.
        </p>
      </div>
    </div>
  );
};

export default Schedule;