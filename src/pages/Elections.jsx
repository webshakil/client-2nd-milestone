import React, { useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import {
  PlusCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ClockIcon,
  UsersIcon,
  CheckCircleIcon,
  EyeIcon,
  PlayIcon
} from '@heroicons/react/24/outline';

const Elections = () => {
  const { hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Mock election data - in real app, this would come from API
  /* eslint-disable */
  const [elections, setElections] = useState([
    {
      id: 1,
      title: 'Best Programming Language 2025',
      description: 'Vote for the most popular programming language this year',
      creator: 'Tech Community',
      status: 'active',
      category: 'technology',
      startDate: '2025-09-01T00:00:00Z',
      endDate: '2025-09-15T23:59:59Z',
      votingType: 'plurality',
      participantsCount: 1247,
      votesCount: 892,
      biometricRequired: false,
      fee: 0,
      image: '/api/placeholder/400/200',
      permissions: 'global',
      tags: ['programming', 'technology', 'community']
    },
    {
      id: 2,
      title: 'Climate Action Initiative Approval',
      description: 'Should our organization implement the new climate action plan?',
      creator: 'Environmental Org',
      status: 'active',
      category: 'environment',
      startDate: '2025-09-05T00:00:00Z',
      endDate: '2025-09-20T23:59:59Z',
      votingType: 'approval',
      participantsCount: 456,
      votesCount: 234,
      biometricRequired: true,
      fee: 5,
      image: '/api/placeholder/400/200',
      permissions: 'organization',
      tags: ['climate', 'environment', 'policy']
    },
    {
      id: 3,
      title: 'City Mayor Election 2025',
      description: 'Official mayoral election for our city',
      creator: 'City Government',
      status: 'draft',
      category: 'politics',
      startDate: '2025-10-01T00:00:00Z',
      endDate: '2025-10-15T23:59:59Z',
      votingType: 'ranked_choice',
      participantsCount: 0,
      votesCount: 0,
      biometricRequired: true,
      fee: 0,
      image: '/api/placeholder/400/200',
      permissions: 'country',
      tags: ['politics', 'government', 'local']
    },
    {
      id: 4,
      title: 'Office Lunch Menu Choice',
      description: 'What should we have for lunch this week?',
      creator: 'Office Admin',
      status: 'completed',
      category: 'lifestyle',
      startDate: '2025-09-01T00:00:00Z',
      endDate: '2025-09-07T23:59:59Z',
      votingType: 'plurality',
      participantsCount: 45,
      votesCount: 42,
      biometricRequired: false,
      fee: 0,
      image: '/api/placeholder/400/200',
      permissions: 'group',
      tags: ['food', 'office', 'casual']
    }
  ]);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'politics', label: 'Politics & Government' },
    { value: 'technology', label: 'Technology' },
    { value: 'environment', label: 'Environment' },
    { value: 'lifestyle', label: 'Lifestyle' },
    { value: 'business', label: 'Business' },
    { value: 'education', label: 'Education' },
    { value: 'entertainment', label: 'Entertainment' }
  ];

  const getStatusBadge = (status) => {
    const badges = {
      draft: { color: 'bg-gray-100 text-gray-800', text: 'Draft' },
      active: { color: 'bg-green-100 text-green-800', text: 'Active' },
      completed: { color: 'bg-blue-100 text-blue-800', text: 'Completed' },
      cancelled: { color: 'bg-red-100 text-red-800', text: 'Cancelled' }
    };
    return badges[status] || badges.draft;
  };

  const getVotingTypeBadge = (type) => {
    const badges = {
      plurality: { color: 'bg-blue-50 text-blue-700', text: 'Single Choice' },
      ranked_choice: { color: 'bg-purple-50 text-purple-700', text: 'Ranked Choice' },
      approval: { color: 'bg-green-50 text-green-700', text: 'Approval' }
    };
    return badges[type] || badges.plurality;
  };

  const filteredElections = elections.filter(election => {
    const matchesSearch = election.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         election.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         election.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || election.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || election.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const sortedElections = [...filteredElections].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.startDate) - new Date(a.startDate);
      case 'oldest':
        return new Date(a.startDate) - new Date(b.startDate);
      case 'mostVotes':
        return b.votesCount - a.votesCount;
      case 'endingSoon':
        return new Date(a.endDate) - new Date(b.endDate);
      default:
        return 0;
    }
  });

  const canCreateElection = hasPermission('manage_elections') || hasPermission('manage_content');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Elections</h1>
          <p className="mt-1 text-sm text-gray-500">
            Discover and participate in voting campaigns
          </p>
        </div>
        
        {canCreateElection && (
          <div className="mt-4 sm:mt-0">
            <Link
              to="/elections/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusCircleIcon className="h-4 w-4 mr-2" />
              Create Election
            </Link>
          </div>
        )}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search elections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="mostVotes">Most Votes</option>
              <option value="endingSoon">Ending Soon</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {elections.filter(e => e.status === 'active').length}
              </div>
              <div className="text-sm text-gray-500">Active Elections</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UsersIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {elections.reduce((sum, e) => sum + e.participantsCount, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">Total Participants</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {elections.filter(e => e.status === 'draft').length}
              </div>
              <div className="text-sm text-gray-500">Draft Elections</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {elections.filter(e => e.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-500">Completed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Elections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedElections.map((election) => {
          const statusBadge = getStatusBadge(election.status);
          const votingBadge = getVotingTypeBadge(election.votingType);
          const timeRemaining = election.status === 'active' ? 
            Math.ceil((new Date(election.endDate) - new Date()) / (1000 * 60 * 60 * 24)) : null;
          
          return (
            <div key={election.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              {/* Image */}
              <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <div className="text-white text-lg font-semibold">
                  {election.title.substring(0, 2).toUpperCase()}
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {election.title}
                  </h3>
                  <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusBadge.color}`}>
                    {statusBadge.text}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {election.description}
                </p>
                
                {/* Metadata */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Created by:</span>
                    <span className="font-medium text-gray-900">{election.creator}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Voting Type:</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${votingBadge.color}`}>
                      {votingBadge.text}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Participants:</span>
                    <span className="font-medium text-gray-900">{election.participantsCount}</span>
                  </div>
                  
                  {election.status === 'active' && timeRemaining && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Time left:</span>
                      <span className="font-medium text-orange-600">
                        {timeRemaining} day{timeRemaining !== 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                  
                  {election.fee > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Fee:</span>
                      <span className="font-medium text-green-600">${election.fee}</span>
                    </div>
                  )}
                  
                  {election.biometricRequired && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Biometric:</span>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                        Required
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {election.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                      {tag}
                    </span>
                  ))}
                  {election.tags.length > 3 && (
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                      +{election.tags.length - 3}
                    </span>
                  )}
                </div>
                
                {/* Actions */}
                <div className="flex space-x-2">
                  {election.status === 'active' && (
                    <Link
                      to={`/vote/${election.id}`}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg text-sm font-medium"
                    >
                      <PlayIcon className="h-4 w-4 inline mr-1" />
                      Vote Now
                    </Link>
                  )}
                  
                  {election.status === 'completed' && (
                    <Link
                      to={`/elections/${election.id}/results`}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white text-center py-2 px-4 rounded-lg text-sm font-medium"
                    >
                      <EyeIcon className="h-4 w-4 inline mr-1" />
                      View Results
                    </Link>
                  )}
                  
                  <Link
                    to={`/elections/${election.id}`}
                    className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {sortedElections.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No elections found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter criteria.
          </p>
          {canCreateElection && (
            <div className="mt-6">
              <Link
                to="/elections/create"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <PlusCircleIcon className="h-4 w-4 mr-2" />
                Create First Election
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Elections;