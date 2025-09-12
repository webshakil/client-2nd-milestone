// components/election/PluralityQuestion.jsx
import React from 'react';
import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

const PluralityQuestion = ({ 
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
          Options (Voters will select ONE)
        </label>
        <div className="space-y-2">
          {question.options.map((option, optionIndex) => (
            <div key={optionIndex} className="flex items-center space-x-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  name={`preview-${question.id}`}
                  disabled
                  className="mr-2 text-blue-600"
                />
                <span className="text-sm text-gray-600">{optionIndex + 1}.</span>
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
        <p className="text-xs text-gray-500 mt-2">
          In plurality voting, each voter can select only one option.
        </p>
      </div>
    </div>
  );
};

export default PluralityQuestion;