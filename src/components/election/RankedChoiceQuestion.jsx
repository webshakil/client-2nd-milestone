// components/election/RankedChoiceQuestion.jsx
import React from 'react';
import { TrashIcon, PlusIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

const RankedChoiceQuestion = ({ 
  question, 
  index, 
  onQuestionChange, 
  onOptionChange, 
  onAddOption, 
  onRemoveOption, 
  onRemoveQuestion, 
  canRemoveQuestion 
}) => {
  const moveOption = (questionId, fromIndex, toIndex) => {
    const newOptions = [...question.options];
    const [movedOption] = newOptions.splice(fromIndex, 1);
    newOptions.splice(toIndex, 0, movedOption);
    
    // Update all options at once
    newOptions.forEach((option, idx) => {
      onOptionChange(questionId, idx, option);
    });
  };

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
          Candidates/Options (Voters will RANK by preference)
        </label>
        <div className="space-y-2">
          {question.options.map((option, optionIndex) => (
            <div key={optionIndex} className="flex items-center space-x-2">
              <div className="flex flex-col">
                <button
                  onClick={() => moveOption(question.id, optionIndex, Math.max(0, optionIndex - 1))}
                  disabled={optionIndex === 0}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                >
                  <ArrowUpIcon className="h-3 w-3" />
                </button>
                <button
                  onClick={() => moveOption(question.id, optionIndex, Math.min(question.options.length - 1, optionIndex + 1))}
                  disabled={optionIndex === question.options.length - 1}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                >
                  <ArrowDownIcon className="h-3 w-3" />
                </button>
              </div>
              <div className="flex items-center">
                <span className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium mr-2">
                  {optionIndex + 1}
                </span>
              </div>
              <input
                type="text"
                value={option}
                onChange={(e) => onOptionChange(question.id, optionIndex, e.target.value)}
                placeholder={`Candidate ${optionIndex + 1}`}
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
            Add Candidate
          </button>
        </div>
        
        {/* Ranked Choice Explanation */}
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
          <h5 className="text-sm font-medium text-yellow-800">Ranked Choice Voting Preview:</h5>
          <div className="text-xs text-yellow-700 mt-1">
            <p>Voters will rank candidates in order of preference (1st, 2nd, 3rd, etc.)</p>
            <p className="mt-1">If no candidate gets 50%+ first choices, lowest candidates are eliminated and votes redistributed based on next preferences until a winner emerges.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankedChoiceQuestion;