// components/election/VotingTypeSelector.jsx
import React from 'react';

const VotingTypeSelector = ({ selectedType, onTypeChange }) => {
  const votingTypes = [
    {
      value: 'plurality',
      name: 'Plurality Voting',
      description: 'Single choice selection - voters pick one option',
      icon: '1️⃣',
      details: 'Traditional multiple choice with one selection allowed'
    },
    {
      value: 'ranked_choice',
      name: 'Ranked Choice Voting',
      description: 'Voters rank options by preference',
      icon: '📊',
      details: 'Preference ranking system with elimination rounds'
    },
    {
      value: 'approval',
      name: 'Approval Voting',
      description: 'Voters can approve multiple options',
      icon: '✅',
      details: 'Multiple candidate approval selection'
    }
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-4">
        Choose Voting Method *
      </label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {votingTypes.map(type => (
          <div
            key={type.value}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
              selectedType === type.value
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onTypeChange(type.value)}
          >
            <div className="text-2xl mb-2">{type.icon}</div>
            <h4 className="font-medium text-gray-900">{type.name}</h4>
            <p className="text-sm text-gray-500 mt-1">{type.description}</p>
            <p className="text-xs text-gray-400 mt-2">{type.details}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VotingTypeSelector;