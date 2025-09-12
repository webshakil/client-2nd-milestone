// components/election/VotingSetup.jsx
import React from 'react';
import VotingTypeSelector from './VotingTypeSelector';
import QuestionManager from './QuestionManager';

const VotingSetup = ({ formData, handleInputChange, questionHandlers }) => {
  const {
    handleQuestionChange,
    handleOptionChange,
    addOption,
    removeOption,
    addQuestion,
    removeQuestion
  } = questionHandlers;

  // Reset questions when voting type changes
  const handleVotingTypeChange = (newType) => {
    handleInputChange('votingType', newType);
    
    // Reset to appropriate default based on voting type
    const defaultQuestion = {
      id: Date.now(),
      type: 'multiple_choice',
      question: '',
      options: ['', ''],
      required: true
    };

    // Adjust default options based on voting type
    if (newType === 'ranked_choice') {
      defaultQuestion.options = ['', '', '']; // Start with 3 candidates
    } else if (newType === 'approval') {
      defaultQuestion.options = ['', '', '']; // Start with 3 options
    }

    // Keep existing questions if they exist, just update the first one
    const updatedQuestions = formData.questions.length > 0 
      ? [{ ...formData.questions[0], ...defaultQuestion, id: formData.questions[0].id }]
      : [defaultQuestion];
    
    handleInputChange('questions', updatedQuestions);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Voting Method & Questions</h3>
      
      {/* Voting Type Selection */}
      <VotingTypeSelector 
        selectedType={formData.votingType}
        onTypeChange={handleVotingTypeChange}
      />

      {/* Questions Section */}
      <QuestionManager
        questions={formData.questions}
        votingType={formData.votingType}
        onQuestionChange={handleQuestionChange}
        onOptionChange={handleOptionChange}
        onAddOption={addOption}
        onRemoveOption={removeOption}
        onAddQuestion={addQuestion}
        onRemoveQuestion={removeQuestion}
      />

      {/* Voting Method Summary */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Voting Method Summary</h4>
        <div className="text-sm text-blue-800">
          {formData.votingType === 'plurality' && (
            <div>
              <p><strong>Plurality Voting:</strong> Each voter selects one option per question.</p>
              <p className="mt-1">The option with the most votes wins. Simple and familiar to most users.</p>
            </div>
          )}
          {formData.votingType === 'ranked_choice' && (
            <div>
              <p><strong>Ranked Choice Voting:</strong> Voters rank candidates in order of preference.</p>
              <p className="mt-1">If no candidate gets 50%+ first choices, the candidate with fewest votes is eliminated and their votes redistributed based on second choices. This continues until someone has a majority.</p>
            </div>
          )}
          {formData.votingType === 'approval' && (
            <div>
              <p><strong>Approval Voting:</strong> Voters can select multiple options they approve of.</p>
              <p className="mt-1">The option with the most total approvals wins. This often finds the most broadly acceptable choice.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VotingSetup;