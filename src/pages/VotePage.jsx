import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import {
  ClockIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';

const VotePage = () => {
  const { electionId } = useParams();
  const navigate = useNavigate();
  /* eslint-disable */
  const { userData } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [election, setElection] = useState(null);
  const [votes, setVotes] = useState({});
  const [rankedVotes, setRankedVotes] = useState({});
  const [approvalVotes, setApprovalVotes] = useState({});
  const [hasVoted, setHasVoted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Mock election data - in real app, this would come from API
  useEffect(() => {
    const mockElection = {
      id: parseInt(electionId),
      title: 'Best Programming Language 2025',
      description: 'Vote for the most popular programming language this year. This election will help determine the community favorite and guide future development efforts.',
      creator: 'Tech Community',
      status: 'active',
      votingType: 'plurality', // Can be: plurality, ranked_choice, approval
      startDate: '2025-09-01T00:00:00Z',
      endDate: '2025-09-15T23:59:59Z',
      biometricRequired: false,
      fee: 0,
      permissions: 'global',
      questions: [
        {
          id: 1,
          question: 'Which programming language do you think is the best for web development in 2025?',
          type: 'multiple_choice',
          options: [
            { id: 1, text: 'JavaScript', votes: 245 },
            { id: 2, text: 'Python', votes: 189 },
            { id: 3, text: 'TypeScript', votes: 167 },
            { id: 4, text: 'Go', votes: 143 },
            { id: 5, text: 'Rust', votes: 98 }
          ]
        }
      ],
      totalVotes: 842,
      allowVoteChanges: true,
      showResultsDuringVoting: true
    };
    setElection(mockElection);
  }, [electionId]);

  const timeRemaining = election ? 
    Math.ceil((new Date(election.endDate) - new Date()) / (1000 * 60 * 60 * 24)) : 0;

  const handlePluralityVote = (questionId, optionId) => {
    setVotes(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleRankedVote = (questionId, optionId, rank) => {
    setRankedVotes(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [optionId]: rank
      }
    }));
  };

  const moveRankedOption = (questionId, optionId, direction) => {
    const currentRanks = rankedVotes[questionId] || {};
    const currentRank = currentRanks[optionId] || 0;
    const newRank = direction === 'up' ? currentRank - 1 : currentRank + 1;
    
    if (newRank < 1) return;
    
    // Find option with the target rank and swap
    const targetOption = Object.keys(currentRanks).find(id => currentRanks[id] === newRank);
    
    const newRanks = { ...currentRanks };
    if (targetOption) {
      newRanks[targetOption] = currentRank;
    }
    newRanks[optionId] = newRank;
    
    setRankedVotes(prev => ({
      ...prev,
      [questionId]: newRanks
    }));
  };

  const handleApprovalVote = (questionId, optionId) => {
    setApprovalVotes(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [optionId]: !prev[questionId]?.[optionId]
      }
    }));
  };

  const getRankedOptions = (questionId) => {
    const ranks = rankedVotes[questionId] || {};
    const question = election.questions.find(q => q.id === questionId);
    
    return question.options
      .map(option => ({
        ...option,
        rank: ranks[option.id] || 0
      }))
      .sort((a, b) => {
        if (a.rank === 0 && b.rank === 0) return 0;
        if (a.rank === 0) return 1;
        if (b.rank === 0) return -1;
        return a.rank - b.rank;
      });
  };

  const canSubmitVote = () => {
    if (!election) return false;
    
    for (const question of election.questions) {
      if (election.votingType === 'plurality') {
        if (!votes[question.id]) return false;
      } else if (election.votingType === 'ranked_choice') {
        const ranks = rankedVotes[question.id] || {};
        if (Object.keys(ranks).length === 0) return false;
      } else if (election.votingType === 'approval') {
        const approvals = approvalVotes[question.id] || {};
        if (!Object.values(approvals).some(Boolean)) return false;
      }
    }
    return true;
  };

  const handleSubmitVote = async () => {
    if (!canSubmitVote()) {
      toast.error('Please complete all questions');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate biometric verification if required
      if (election.biometricRequired) {
        toast.info('Please complete biometric verification...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      // Simulate payment if required
      if (election.fee > 0) {
        toast.info('Processing payment...');
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // Simulate API call
      const voteData = {
        electionId: election.id,
        votes: election.votingType === 'plurality' ? votes :
               election.votingType === 'ranked_choice' ? rankedVotes :
               approvalVotes,
        votingType: election.votingType,
        timestamp: new Date().toISOString()
      };

      console.log('Submitting vote:', voteData);
      await new Promise(resolve => setTimeout(resolve, 1000));

      setHasVoted(true);
      setShowConfirmation(true);
      toast.success('Your vote has been recorded successfully!');

    } catch (error) {
      console.error('Error submitting vote:', error);
      toast.error('Failed to submit vote. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!election) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (showConfirmation) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <CheckCircleIcon className="mx-auto h-16 w-16 text-green-600 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Vote Recorded Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Your vote has been securely recorded and encrypted. You can verify your vote using the verification portal.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="text-sm text-gray-600 mb-2">Vote Receipt ID:</div>
            <div className="font-mono text-lg font-medium text-gray-900">
              VR-{election.id}-{Date.now().toString().slice(-6)}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/verify')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Verify Your Vote
            </button>
            <button
              onClick={() => navigate('/elections')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Back to Elections
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Election Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{election.title}</h1>
            <p className="mt-2 text-gray-600">{election.description}</p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center">
                <ClockIcon className="h-4 w-4 mr-1" />
                {timeRemaining > 0 ? `${timeRemaining} days remaining` : 'Election ended'}
              </div>
              {election.biometricRequired && (
                <div className="flex items-center">
                  <ShieldCheckIcon className="h-4 w-4 mr-1" />
                  Biometric verification required
                </div>
              )}
              {election.fee > 0 && (
                <div className="flex items-center">
                  <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                  ${election.fee} participation fee
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 md:ml-6">
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{election.totalVotes}</div>
              <div className="text-sm text-gray-500">votes cast</div>
            </div>
          </div>
        </div>
      </div>

      {/* Voting Method Info */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-start">
          <ExclamationTriangleIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-blue-900">
              {election.votingType === 'plurality' && 'Single Choice Voting'}
              {election.votingType === 'ranked_choice' && 'Ranked Choice Voting'}
              {election.votingType === 'approval' && 'Approval Voting'}
            </h3>
            <p className="text-blue-700 text-sm mt-1">
              {election.votingType === 'plurality' && 'Select one option for each question.'}
              {election.votingType === 'ranked_choice' && 'Rank options in order of preference (1 = most preferred).'}
              {election.votingType === 'approval' && 'Select all options you approve of.'}
            </p>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {election.questions.map((question) => (
          <div key={question.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">{question.question}</h3>
            
            {/* Plurality Voting */}
            {election.votingType === 'plurality' && (
              <div className="space-y-3">
                {question.options.map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      votes[question.id] === option.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option.id}
                      checked={votes[question.id] === option.id}
                      onChange={() => handlePluralityVote(question.id, option.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-3 flex-1 font-medium text-gray-900">{option.text}</span>
                    {election.showResultsDuringVoting && (
                      <span className="text-sm text-gray-500">{option.votes} votes</span>
                    )}
                  </label>
                ))}
              </div>
            )}

            {/* Ranked Choice Voting */}
            {election.votingType === 'ranked_choice' && (
              <div className="space-y-3">
                {getRankedOptions(question.id).map((option) => {
                  const rank = rankedVotes[question.id]?.[option.id] || 0;
                  return (
                    <div
                      key={option.id}
                      className={`flex items-center p-4 rounded-lg border-2 ${
                        rank > 0 ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mr-4">
                        <button
                          onClick={() => moveRankedOption(question.id, option.id, 'up')}
                          disabled={rank <= 1}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        >
                          <ArrowUpIcon className="h-4 w-4" />
                        </button>
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
                          {rank || '-'}
                        </div>
                        <button
                          onClick={() => moveRankedOption(question.id, option.id, 'down')}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <ArrowDownIcon className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <span className="flex-1 font-medium text-gray-900">{option.text}</span>
                      
                      <button
                        onClick={() => handleRankedVote(question.id, option.id, rank > 0 ? 0 : Object.keys(rankedVotes[question.id] || {}).length + 1)}
                        className={`px-3 py-1 rounded text-sm ${
                          rank > 0
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        }`}
                      >
                        {rank > 0 ? 'Remove' : 'Rank'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Approval Voting */}
            {election.votingType === 'approval' && (
              <div className="space-y-3">
                {question.options.map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      approvalVotes[question.id]?.[option.id]
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={approvalVotes[question.id]?.[option.id] || false}
                      onChange={() => handleApprovalVote(question.id, option.id)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 flex-1 font-medium text-gray-900">{option.text}</span>
                    {election.showResultsDuringVoting && (
                      <span className="text-sm text-gray-500">{option.votes} votes</span>
                    )}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <p className="text-sm text-gray-600">
              {election.allowVoteChanges 
                ? 'You can change your vote until the election ends.'
                : 'Your vote cannot be changed once submitted.'
              }
            </p>
            {hasVoted && (
              <p className="text-sm text-green-600 mt-1">
                You have already voted in this election.
              </p>
            )}
          </div>
          
          <button
            onClick={handleSubmitVote}
            disabled={!canSubmitVote() || isLoading}
            className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? 'Submitting Vote...' : 'Submit Vote'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VotePage;