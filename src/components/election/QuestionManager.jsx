// components/election/QuestionManager.jsx
import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import PluralityQuestion from './PluralityQuestion';
import RankedChoiceQuestion from './RankedChoiceQuestion';
import ApprovalQuestion from './ApprovalQuestion';

const QuestionManager = ({ 
  questions, 
  votingType, 
  onQuestionChange, 
  onOptionChange, 
  onAddOption, 
  onRemoveOption, 
  onAddQuestion, 
  onRemoveQuestion 
}) => {
  const renderQuestion = (question, index) => {
    const commonProps = {
      question,
      index,
      onQuestionChange,
      onOptionChange,
      onAddOption,
      onRemoveOption,
      onRemoveQuestion,
      canRemoveQuestion: questions.length > 1
    };

    switch (votingType) {
      case 'plurality':
        return <PluralityQuestion key={question.id} {...commonProps} />;
      case 'ranked_choice':
        return <RankedChoiceQuestion key={question.id} {...commonProps} />;
      case 'approval':
        return <ApprovalQuestion key={question.id} {...commonProps} />;
      default:
        return <PluralityQuestion key={question.id} {...commonProps} />;
    }
  };

  const getQuestionLimit = () => {
    switch (votingType) {
      case 'plurality':
        return 20; // Allow multiple questions for polls
      case 'ranked_choice':
        return 1;  // Typically one question with multiple candidates
      case 'approval':
        return 5;  // Allow several questions but not unlimited
      default:
        return 10;
    }
  };

  const getAddButtonText = () => {
    switch (votingType) {
      case 'plurality':
        return 'Add Question';
      case 'ranked_choice':
        return 'Add Question';
      case 'approval':
        return 'Add Question';
      default:
        return 'Add Question';
    }
  };

  const getHelpText = () => {
    switch (votingType) {
      case 'plurality':
        return 'Each question allows voters to select one option. You can add multiple questions for comprehensive polling.';
      case 'ranked_choice':
        return 'Voters will rank all candidates in order of preference. Usually one question with multiple candidates works best.';
      case 'approval':
        return 'Voters can approve multiple options per question. Great for selecting multiple winners or gathering broad preferences.';
      default:
        return '';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Questions *
          </label>
          <p className="text-xs text-gray-500 mt-1">{getHelpText()}</p>
        </div>
        {questions.length < getQuestionLimit() && (
          <button
            onClick={onAddQuestion}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            {getAddButtonText()}
          </button>
        )}
      </div>

      <div className="space-y-6">
        {questions.map((question, index) => renderQuestion(question, index))}
      </div>

      {questions.length >= getQuestionLimit() && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Maximum {getQuestionLimit()} questions allowed for {votingType.replace('_', ' ')} voting.
          </p>
        </div>
      )}
    </div>
  );
};

export default QuestionManager;