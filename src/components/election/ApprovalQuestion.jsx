// components/election/ApprovalQuestion.jsx
import React from 'react';
import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

const ApprovalQuestion = ({ 
  question, 
  index, 
  onQuestionChange, 
  onOptionChange, 
  onAddOption, 
  onRemoveOption, 
  onRemoveQuestion, 
  canRemoveQuestion 
}) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-gray-900">Question {index + 1}</h4>
        {canRemoveQuestion && (
          <button
            onClick={() => onRemoveQuestion(question.id)}
            className="text-red-600 hover:text-red-700"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={question.question}
          onChange={(e) => onQuestionChange(question.id, 'question', e.target.value)}
          placeholder="Enter your question"
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Candidates/Options (Voters can APPROVE multiple)
        </label>
        <div className="space-y-2">
          {question.options.map((option, optionIndex) => (
            <div key={optionIndex} className="flex items-center space-x-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  disabled
                  className="mr-2 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-600">✓</span>
              </div>
              <input
                type="text"
                value={option}
                onChange={(e) => onOptionChange(question.id, optionIndex, e.target.value)}
                placeholder={`Option ${optionIndex + 1}`}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {question.options.length > 2 && (
                <button
                  onClick={() => onRemoveOption(question.id, optionIndex)}
                  className="text-red-600 hover:text-red-700"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={() => onAddOption(question.id)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Option
          </button>
        </div>

        {/* Approval Voting Explanation */}
        <div className="mt-4 p-3 bg-green-50 rounded-lg">
          <h5 className="text-sm font-medium text-green-800">Approval Voting Preview:</h5>
          <div className="text-xs text-green-700 mt-1">
            <p>Voters can select (approve) as many options as they want.</p>
            <p className="mt-1">The option with the most approvals wins. This reduces strategic voting and often finds the most broadly acceptable choice.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalQuestion;