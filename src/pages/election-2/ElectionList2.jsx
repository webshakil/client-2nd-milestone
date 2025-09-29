import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { toast } from 'react-hot-toast';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  EyeIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  GiftIcon,
  UserGroupIcon,
  CalendarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import LoadingScreen from '../../components/LoadingScreen';
import ElectionService from '../../services/election/electionService';
//import { useElection } from '../../contexts/ElectionContext/useElection';
//import ElectionDetailModal from '../../components/ElectionDetailModal'; // Import the modal component
import ElectionDetailModal from '../../components/election-2/modal/ElectionDetailModal';

const ElectionList2 = () => {
  /*eslint-disable*/
 
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
  const [pricingFilter, setPricingFilter] = useState(searchParams.get('pricing') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'created_at');
  const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'desc');
  const [showFilters, setShowFilters] = useState(false);
  
  // Modal state
  const [showElectionModal, setShowElectionModal] = useState(false);
  const [selectedElectionId, setSelectedElectionId] = useState(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [totalElections, setTotalElections] = useState(0);
  const [electionsPerPage] = useState(12);
  
  // Bulk actions
  const [selectedElections, setSelectedElections] = useState([]);

  useEffect(() => {
    loadElections();
  }, [searchTerm, statusFilter, pricingFilter, sortBy, sortOrder, currentPage]);

  useEffect(() => {
    // Update URL params
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (statusFilter !== 'all') params.set('status', statusFilter);
    if (pricingFilter !== 'all') params.set('pricing', pricingFilter);
    if (sortBy !== 'created_at') params.set('sortBy', sortBy);
    if (sortOrder !== 'desc') params.set('sortOrder', sortOrder);
    if (currentPage !== 1) params.set('page', currentPage.toString());
    
    setSearchParams(params);
  }, [searchTerm, statusFilter, pricingFilter, sortBy, sortOrder, currentPage, setSearchParams]);

  const loadElections = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch all elections from the API
      const response = await fetch(`${import.meta.env.VITE_ELECTION_API_BASE_URL_SINGLE}`);
       //const response = await fetch('https://election-service-2.onrender.com/api/elections');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        let electionsData = result.data.elections || result.data || [];
        
        // Apply filters
        if (searchTerm) {
          electionsData = electionsData.filter(election =>
            election.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            election.description?.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        if (statusFilter !== 'all') {
          electionsData = electionsData.filter(election => {
            const now = new Date();
            const startDate = new Date(election.start_date);
            const endDate = new Date(election.end_date);
            
            switch (statusFilter) {
              case 'draft':
                return election.is_draft;
              case 'active':
                return !election.is_draft && election.is_published && now >= startDate && now <= endDate;
              case 'upcoming':
                return !election.is_draft && election.is_published && now < startDate;
              case 'completed':
                return !election.is_draft && election.is_published && now > endDate;
              default:
                return true;
            }
          });
        }
        
        if (pricingFilter !== 'all') {
          electionsData = electionsData.filter(election => {
            switch (pricingFilter) {
              case 'free':
                return election.pricing_type === 'free';
              case 'paid':
                return election.pricing_type !== 'free';
              case 'regional':
                return election.pricing_type === 'regional';
              default:
                return true;
            }
          });
        }
        
        // Sort elections
        electionsData.sort((a, b) => {
          let aValue = a[sortBy];
          let bValue = b[sortBy];
          
          // Handle date sorting
          if (sortBy.includes('date') || sortBy.includes('_at')) {
            aValue = new Date(aValue);
            bValue = new Date(bValue);
          }
          
          if (sortOrder === 'asc') {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        });
        
        // Apply pagination
        const startIndex = (currentPage - 1) * electionsPerPage;
        const paginatedElections = electionsData.slice(startIndex, startIndex + electionsPerPage);
        
        setElections(paginatedElections);
        setTotalElections(electionsData.length);
      } else {
        throw new Error(result.message || 'Failed to fetch elections');
      }
    } catch (error) {
      console.error('Error loading elections:', error);
      toast.error('Failed to load elections');
      setElections([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, pricingFilter, sortBy, sortOrder, currentPage, electionsPerPage]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handlePricingFilter = (pricing) => {
    setPricingFilter(pricing);
    setCurrentPage(1);
  };

  const handleElectionAction = async (action, electionId) => {
    console.log('handleElectionAction called with:', { action, electionId }); // Debug log
    
    try {
      switch (action) {
        case 'vote':
          navigate(`/vote/${electionId}`);
          break;
          
        case 'pay':
          // Redirect to payment gateway
          navigate(`/payment/${electionId}`);
          break;
          
        case 'edit':
          navigate(`/elections-2/${electionId}/edit`);
          break;
          
        case 'view':
          console.log('Opening modal for election:', electionId); // Debug log
          // Prevent any default navigation
          event?.preventDefault();
          // Open modal with election details
          setSelectedElectionId(electionId);
          setShowElectionModal(true);
          return; // Important: return early to prevent any other navigation
          
        case 'delete':
          if (window.confirm('Are you sure you want to delete this election?')) {
            const response = await ElectionService.deleteElection(electionId);
            if (response.success) {
              toast.success('Election deleted successfully');
              loadElections();
            } else {
              toast.error('Failed to delete election');
            }
          }
          break;
          
        case 'clone':
          const election = elections.find(e => e.id === electionId);
          const newTitle = `${election.title} (Copy)`;
          const cloneResponse = await ElectionService.cloneElection(electionId, newTitle);
          if (cloneResponse.success) {
            toast.success('Election cloned successfully');
            navigate(`/elections-2/${cloneResponse.data.id}/edit`);
          } else {
            toast.error('Failed to clone election');
          }
          break;
          
        default:
          console.log('Unknown action:', action); // Debug log
          break;
      }
    } catch (error) {
      console.error('Error performing election action:', error);
      toast.error('Action failed');
    }
  };

  const closeElectionModal = () => {
    setShowElectionModal(false);
    setSelectedElectionId(null);
  };

  const getElectionStatus = (election) => {
    const now = new Date();
    const startDate = new Date(election.start_date);
    const endDate = new Date(election.end_date);
    
    if (election.is_draft) return 'draft';
    if (!election.is_published) return 'unpublished';
    if (now < startDate) return 'upcoming';
    if (now >= startDate && now <= endDate) return 'active';
    if (now > endDate) return 'completed';
    return 'unknown';
  };

  const getStatusBadge = (election) => {
    const status = getElectionStatus(election);
    const statusConfig = {
      draft: { color: 'bg-gray-100 text-gray-800', text: 'Draft' },
      unpublished: { color: 'bg-yellow-100 text-yellow-800', text: 'Unpublished' },
      upcoming: { color: 'bg-blue-100 text-blue-800', text: 'Upcoming' },
      active: { color: 'bg-green-100 text-green-800', text: 'Active' },
      completed: { color: 'bg-purple-100 text-purple-800', text: 'Completed' },
      unknown: { color: 'bg-gray-100 text-gray-800', text: 'Unknown' }
    };

    const config = statusConfig[status] || statusConfig.unknown;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getPricingBadge = (election) => {
    if (election.pricing_type === 'free') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Free
        </span>
      );
    } else if (election.pricing_type === 'regional') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          Regional Pricing
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
          Paid
        </span>
      );
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTotalPages = () => Math.ceil(totalElections / electionsPerPage);

  const canUserEdit = (election) => {
    // For now, assume user can edit if it's a draft
    // You can add more sophisticated role checking here
    return election.is_draft;
  };

  const canUserVote = (election) => {
    const status = getElectionStatus(election);
    return status === 'active';
  };

  if (loading && elections.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">All Elections</h1>
              <p className="mt-2 text-sm text-gray-600">
                Browse and participate in available voting elections
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Link
                to="/elections-2/dashboard"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <ChartBarIcon className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
              
              <Link
                to="/elections-2/create"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Election
              </Link>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
              {/* Search */}
              <div className="flex-1 max-w-lg">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search elections..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-4">
                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => handleStatusFilter(e.target.value)}
                  className="block px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>

                {/* Pricing Filter */}
                <select
                  value={pricingFilter}
                  onChange={(e) => handlePricingFilter(e.target.value)}
                  className="block px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Pricing</option>
                  <option value="free">Free</option>
                  <option value="paid">Paid</option>
                  <option value="regional">Regional</option>
                </select>

                {/* Sort */}
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-');
                    setSortBy(field);
                    setSortOrder(order);
                  }}
                  className="block px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="created_at-desc">Newest First</option>
                  <option value="created_at-asc">Oldest First</option>
                  <option value="title-asc">Title A-Z</option>
                  <option value="title-desc">Title Z-A</option>
                  <option value="start_date-desc">Start Date (Latest)</option>
                  <option value="start_date-asc">Start Date (Earliest)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Elections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {elections.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {searchTerm ? 'No elections found' : 'No elections available'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm 
                  ? 'Try adjusting your search or filters.' 
                  : 'Check back later for new elections.'
                }
              </p>
            </div>
          ) : (
            elections.map((election) => (
              <div key={election.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* Election Image */}
                {election.topic_image_url && (
                  <div className="h-48 bg-gray-200">
                    <img
                      src={election.topic_image_url}
                      alt={election.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="p-6">
                  {/* Title and Description */}
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {election.title}
                    </h3>
                    {election.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {election.description}
                      </p>
                    )}
                  </div>

                  {/* Status and Pricing Badges */}
                  <div className="flex items-center gap-2 mb-4">
                    {getStatusBadge(election)}
                    {getPricingBadge(election)}
                    {election.is_lotterized && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        <GiftIcon className="h-3 w-3 mr-1" />
                        Lottery
                      </span>
                    )}
                  </div>

                  {/* Election Details */}
                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      <span>Starts: {formatDate(election.start_date)}</span>
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-2" />
                      <span>Ends: {formatDate(election.end_date)}</span>
                    </div>
                    {election.countries && election.countries.length > 0 && (
                      <div className="flex items-center">
                        <UserGroupIcon className="h-4 w-4 mr-2" />
                        <span>{election.countries.length} countries</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {canUserVote(election) && (
                      <>
                        {election.pricing_type === 'free' ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleElectionAction('vote', election.id);
                            }}
                            className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                          >
                            <EyeIcon className="h-4 w-4 mr-1" />
                            Vote Free
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleElectionAction('pay', election.id);
                            }}
                            className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                          >
                            <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                            Pay & Vote
                          </button>
                        )}
                      </>
                    )}
                    
                    {!canUserVote(election) && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleElectionAction('view', election.id);
                        }}
                        className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <EyeIcon className="h-4 w-4 mr-1" />
                        View
                      </button>
                    )}

                    {canUserEdit(election) && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleElectionAction('edit', election.id);
                        }}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {/* Lottery Info */}
                  {election.is_lotterized && (
                    <div className="mt-4 p-3 bg-purple-50 rounded-md">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-purple-800 font-medium">
                          Prize Pool: {election.reward_type === 'monetary' ? `${election.reward_amount}` : election.non_monetary_reward}
                        </span>
                        <span className="text-purple-600">
                          {election.winner_count} winner(s)
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {getTotalPages() > 1 && (
          <div className="mt-8 bg-white px-4 py-3 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">
                  {(currentPage - 1) * electionsPerPage + 1}
                </span>{' '}
                to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * electionsPerPage, totalElections)}
                </span>{' '}
                of{' '}
                <span className="font-medium">{totalElections}</span>{' '}
                results
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {getTotalPages()}
                </span>
                
                <button
                  onClick={() => setCurrentPage(Math.min(getTotalPages(), currentPage + 1))}
                  disabled={currentPage === getTotalPages()}
                  className="relative inline-flex items-center px-4 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Election Detail Modal */}
      <ElectionDetailModal
        isOpen={showElectionModal}
        onClose={closeElectionModal}
        electionId={selectedElectionId}
      />

      
    </div>
  );
};

export default ElectionList2;
// //this is 100% workable codes but to add modal above file added
// import React, { useState, useEffect, useCallback } from 'react';
// import { Link, useNavigate, useSearchParams } from 'react-router';
// import { toast } from 'react-hot-toast';
// import {
//   PlusIcon,
//   MagnifyingGlassIcon,
//   FunnelIcon,
//   PencilIcon,
//   TrashIcon,
//   DocumentDuplicateIcon,
//   EyeIcon,
//   ChartBarIcon,
//   CurrencyDollarIcon,
//   GiftIcon,
//   UserGroupIcon,
//   CalendarIcon,
//   ClockIcon
// } from '@heroicons/react/24/outline';
// import LoadingScreen from '../../components/LoadingScreen';
// import ElectionService from '../../services/election/electionService';
// import { useElection } from '../../contexts/ElectionContext/useElection';


// //import ElectionService from '../../../../../backend/services/election-service-2/src/services/electionService';
// //import ElectionService from '../../services/election/ElectionService';

// const ElectionList2 = () => {
//   /*eslint-disable*/
//    const { election} = useElection();
//   const navigate = useNavigate();
//   const [searchParams, setSearchParams] = useSearchParams();
  
//   const [elections, setElections] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
//   const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
//   const [pricingFilter, setPricingFilter] = useState(searchParams.get('pricing') || 'all');
//   const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'created_at');
//   const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'desc');
//   /*eslint-disable*/
//   const [showFilters, setShowFilters] = useState(false);
  
//   // Pagination
//   const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
//   const [totalElections, setTotalElections] = useState(0);
//   const [electionsPerPage] = useState(12);
  
//   // Bulk actions
//   const [selectedElections, setSelectedElections] = useState([]);

//   useEffect(() => {
//     loadElections();
//   }, [searchTerm, statusFilter, pricingFilter, sortBy, sortOrder, currentPage]);

//   useEffect(() => {
//     // Update URL params
//     const params = new URLSearchParams();
//     if (searchTerm) params.set('search', searchTerm);
//     if (statusFilter !== 'all') params.set('status', statusFilter);
//     if (pricingFilter !== 'all') params.set('pricing', pricingFilter);
//     if (sortBy !== 'created_at') params.set('sortBy', sortBy);
//     if (sortOrder !== 'desc') params.set('sortOrder', sortOrder);
//     if (currentPage !== 1) params.set('page', currentPage.toString());
    
//     setSearchParams(params);
//   }, [searchTerm, statusFilter, pricingFilter, sortBy, sortOrder, currentPage, setSearchParams]);

//   const loadElections = useCallback(async () => {
//     try {
//       setLoading(true);
      
//       // Fetch all elections from the API
//       const response = await fetch('http://localhost:3004/api/elections');
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const result = await response.json();
      
//       if (result.success) {
//         let electionsData = result.data.elections || result.data || [];
        
//         // Apply filters
//         if (searchTerm) {
//           electionsData = electionsData.filter(election =>
//             election.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             election.description?.toLowerCase().includes(searchTerm.toLowerCase())
//           );
//         }
        
//         if (statusFilter !== 'all') {
//           electionsData = electionsData.filter(election => {
//             const now = new Date();
//             const startDate = new Date(election.start_date);
//             const endDate = new Date(election.end_date);
            
//             switch (statusFilter) {
//               case 'draft':
//                 return election.is_draft;
//               case 'active':
//                 return !election.is_draft && election.is_published && now >= startDate && now <= endDate;
//               case 'upcoming':
//                 return !election.is_draft && election.is_published && now < startDate;
//               case 'completed':
//                 return !election.is_draft && election.is_published && now > endDate;
//               default:
//                 return true;
//             }
//           });
//         }
        
//         if (pricingFilter !== 'all') {
//           electionsData = electionsData.filter(election => {
//             switch (pricingFilter) {
//               case 'free':
//                 return election.pricing_type === 'free';
//               case 'paid':
//                 return election.pricing_type !== 'free';
//               case 'regional':
//                 return election.pricing_type === 'regional';
//               default:
//                 return true;
//             }
//           });
//         }
        
//         // Sort elections
//         electionsData.sort((a, b) => {
//           let aValue = a[sortBy];
//           let bValue = b[sortBy];
          
//           // Handle date sorting
//           if (sortBy.includes('date') || sortBy.includes('_at')) {
//             aValue = new Date(aValue);
//             bValue = new Date(bValue);
//           }
          
//           if (sortOrder === 'asc') {
//             return aValue > bValue ? 1 : -1;
//           } else {
//             return aValue < bValue ? 1 : -1;
//           }
//         });
        
//         // Apply pagination
//         const startIndex = (currentPage - 1) * electionsPerPage;
//         const paginatedElections = electionsData.slice(startIndex, startIndex + electionsPerPage);
        
//         setElections(paginatedElections);
//         setTotalElections(electionsData.length);
//       } else {
//         throw new Error(result.message || 'Failed to fetch elections');
//       }
//     } catch (error) {
//       console.error('Error loading elections:', error);
//       toast.error('Failed to load elections');
//       setElections([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [searchTerm, statusFilter, pricingFilter, sortBy, sortOrder, currentPage, electionsPerPage]);

//   const handleSearch = (value) => {
//     setSearchTerm(value);
//     setCurrentPage(1);
//   };

//   const handleStatusFilter = (status) => {
//     setStatusFilter(status);
//     setCurrentPage(1);
//   };

//   const handlePricingFilter = (pricing) => {
//     setPricingFilter(pricing);
//     setCurrentPage(1);
//   };

//   const handleElectionAction = async (action, electionId) => {
//     try {
//       switch (action) {
//         case 'vote':
//           navigate(`/vote/${electionId}`);
//           break;
          
//         case 'pay':
//           // Redirect to payment gateway
//           navigate(`/payment/${electionId}`);
//           break;
          
//         case 'edit':
//           navigate(`/elections-2/${electionId}/edit`);
//           break;
          
//         case 'view':
//           navigate(`/elections/${electionId}`);
//           break;
          
//         case 'delete':
//           if (window.confirm('Are you sure you want to delete this election?')) {
//             const response = await ElectionService.deleteElection(electionId);
//             if (response.success) {
//               toast.success('Election deleted successfully');
//               loadElections();
//             } else {
//               toast.error('Failed to delete election');
//             }
//           }
//           break;
          
//         case 'clone':
//           const election = elections.find(e => e.id === electionId);
//           const newTitle = `${election.title} (Copy)`;
//           const cloneResponse = await ElectionService.cloneElection(electionId, newTitle);
//           if (cloneResponse.success) {
//             toast.success('Election cloned successfully');
//             navigate(`/elections-2/${cloneResponse.data.id}/edit`);
//           } else {
//             toast.error('Failed to clone election');
//           }
//           break;
          
//         default:
//           break;
//       }
//     } catch (error) {
//       console.error('Error performing election action:', error);
//       toast.error('Action failed');
//     }
//   };

//   const getElectionStatus = (election) => {
//     const now = new Date();
//     const startDate = new Date(election.start_date);
//     const endDate = new Date(election.end_date);
    
//     if (election.is_draft) return 'draft';
//     if (!election.is_published) return 'unpublished';
//     if (now < startDate) return 'upcoming';
//     if (now >= startDate && now <= endDate) return 'active';
//     if (now > endDate) return 'completed';
//     return 'unknown';
//   };

//   const getStatusBadge = (election) => {
//     const status = getElectionStatus(election);
//     const statusConfig = {
//       draft: { color: 'bg-gray-100 text-gray-800', text: 'Draft' },
//       unpublished: { color: 'bg-yellow-100 text-yellow-800', text: 'Unpublished' },
//       upcoming: { color: 'bg-blue-100 text-blue-800', text: 'Upcoming' },
//       active: { color: 'bg-green-100 text-green-800', text: 'Active' },
//       completed: { color: 'bg-purple-100 text-purple-800', text: 'Completed' },
//       unknown: { color: 'bg-gray-100 text-gray-800', text: 'Unknown' }
//     };

//     const config = statusConfig[status] || statusConfig.unknown;
    
//     return (
//       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
//         {config.text}
//       </span>
//     );
//   };

//   const getPricingBadge = (election) => {
//     if (election.pricing_type === 'free') {
//       return (
//         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//           Free
//         </span>
//       );
//     } else if (election.pricing_type === 'regional') {
//       return (
//         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//           Regional Pricing
//         </span>
//       );
//     } else {
//       return (
//         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
//           Paid
//         </span>
//       );
//     }
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const getTotalPages = () => Math.ceil(totalElections / electionsPerPage);

//   const canUserEdit = (election) => {
//     // For now, assume user can edit if it's a draft
//     // You can add more sophisticated role checking here
//     return election.is_draft;
//   };

//   const canUserVote = (election) => {
//     const status = getElectionStatus(election);
//     return status === 'active';
//   };

//   if (loading && elections.length === 0) {
//     return <LoadingScreen />;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">All Elections</h1>
//               <p className="mt-2 text-sm text-gray-600">
//                 Browse and participate in available voting elections
//               </p>
//             </div>
            
//             <div className="flex items-center space-x-3">
//               <Link
//                 to="/elections-2/dashboard"
//                 className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
//               >
//                 <ChartBarIcon className="h-4 w-4 mr-2" />
//                 Dashboard
//               </Link>
              
//               <Link
//                 to="/elections-2/create"
//                 className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
//               >
//                 <PlusIcon className="h-4 w-4 mr-2" />
//                 Create Election
//               </Link>
//             </div>
//           </div>
//         </div>

//         {/* Search and Filters */}
//         <div className="bg-white shadow rounded-lg mb-6">
//           <div className="p-6">
//             <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
//               {/* Search */}
//               <div className="flex-1 max-w-lg">
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
//                   </div>
//                   <input
//                     type="text"
//                     placeholder="Search elections..."
//                     value={searchTerm}
//                     onChange={(e) => handleSearch(e.target.value)}
//                     className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>
//               </div>

//               {/* Filters */}
//               <div className="flex flex-wrap items-center gap-4">
//                 {/* Status Filter */}
//                 <select
//                   value={statusFilter}
//                   onChange={(e) => handleStatusFilter(e.target.value)}
//                   className="block px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="all">All Status</option>
//                   <option value="draft">Draft</option>
//                   <option value="upcoming">Upcoming</option>
//                   <option value="active">Active</option>
//                   <option value="completed">Completed</option>
//                 </select>

//                 {/* Pricing Filter */}
//                 <select
//                   value={pricingFilter}
//                   onChange={(e) => handlePricingFilter(e.target.value)}
//                   className="block px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="all">All Pricing</option>
//                   <option value="free">Free</option>
//                   <option value="paid">Paid</option>
//                   <option value="regional">Regional</option>
//                 </select>

//                 {/* Sort */}
//                 <select
//                   value={`${sortBy}-${sortOrder}`}
//                   onChange={(e) => {
//                     const [field, order] = e.target.value.split('-');
//                     setSortBy(field);
//                     setSortOrder(order);
//                   }}
//                   className="block px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="created_at-desc">Newest First</option>
//                   <option value="created_at-asc">Oldest First</option>
//                   <option value="title-asc">Title A-Z</option>
//                   <option value="title-desc">Title Z-A</option>
//                   <option value="start_date-desc">Start Date (Latest)</option>
//                   <option value="start_date-asc">Start Date (Earliest)</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Elections Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {elections.length === 0 ? (
//             <div className="col-span-full text-center py-12">
//               <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
//               <h3 className="mt-2 text-sm font-medium text-gray-900">
//                 {searchTerm ? 'No elections found' : 'No elections available'}
//               </h3>
//               <p className="mt-1 text-sm text-gray-500">
//                 {searchTerm 
//                   ? 'Try adjusting your search or filters.' 
//                   : 'Check back later for new elections.'
//                 }
//               </p>
//             </div>
//           ) : (
//             elections.map((election) => (
//               <div key={election.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
//                 {/* Election Image */}
//                 {election.topic_image_url && (
//                   <div className="h-48 bg-gray-200">
//                     <img
//                       src={election.topic_image_url}
//                       alt={election.title}
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                 )}
                
//                 <div className="p-6">
//                   {/* Title and Description */}
//                   <div className="mb-4">
//                     <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                       {election.title}
//                     </h3>
//                     {election.description && (
//                       <p className="text-sm text-gray-600 line-clamp-2">
//                         {election.description}
//                       </p>
//                     )}
//                   </div>

//                   {/* Status and Pricing Badges */}
//                   <div className="flex items-center gap-2 mb-4">
//                     {getStatusBadge(election)}
//                     {getPricingBadge(election)}
//                     {election.is_lotterized && (
//                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
//                         <GiftIcon className="h-3 w-3 mr-1" />
//                         Lottery
//                       </span>
//                     )}
//                   </div>

//                   {/* Election Details */}
//                   <div className="space-y-2 mb-4 text-sm text-gray-600">
//                     <div className="flex items-center">
//                       <CalendarIcon className="h-4 w-4 mr-2" />
//                       <span>Starts: {formatDate(election.start_date)}</span>
//                     </div>
//                     <div className="flex items-center">
//                       <ClockIcon className="h-4 w-4 mr-2" />
//                       <span>Ends: {formatDate(election.end_date)}</span>
//                     </div>
//                     {election.countries && election.countries.length > 0 && (
//                       <div className="flex items-center">
//                         <UserGroupIcon className="h-4 w-4 mr-2" />
//                         <span>{election.countries.length} countries</span>
//                       </div>
//                     )}
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="flex flex-wrap gap-2">
//                     {canUserVote(election) && (
//                       <>
//                         {election.pricing_type === 'free' ? (
//                           <button
//                             onClick={() => handleElectionAction('vote', election.id)}
//                             className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
//                           >
//                             <EyeIcon className="h-4 w-4 mr-1" />
//                             Vote Free
//                           </button>
//                         ) : (
//                           <button
//                             onClick={() => handleElectionAction('pay', election.id)}
//                             className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
//                           >
//                             <CurrencyDollarIcon className="h-4 w-4 mr-1" />
//                             Pay & Vote
//                           </button>
//                         )}
//                       </>
//                     )}
                    
//                     {!canUserVote(election) && (
//                       <button
//                         onClick={() => handleElectionAction('view', election.id)}
//                         className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
//                       >
//                         <EyeIcon className="h-4 w-4 mr-1" />
//                         View
//                       </button>
//                     )}

//                     {canUserEdit(election) && (
//                       <button
//                         onClick={() => handleElectionAction('edit', election.id)}
//                         className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
//                       >
//                         <PencilIcon className="h-4 w-4" />
//                       </button>
//                     )}
//                   </div>

//                   {/* Lottery Info */}
//                   {election.is_lotterized && (
//                     <div className="mt-4 p-3 bg-purple-50 rounded-md">
//                       <div className="flex items-center justify-between text-sm">
//                         <span className="text-purple-800 font-medium">
//                           Prize Pool: {election.reward_type === 'monetary' ? `$${election.reward_amount}` : election.non_monetary_reward}
//                         </span>
//                         <span className="text-purple-600">
//                           {election.winner_count} winner(s)
//                         </span>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))
//           )}
//         </div>

//         {/* Pagination */}
//         {getTotalPages() > 1 && (
//           <div className="mt-8 bg-white px-4 py-3 border border-gray-200 rounded-lg">
//             <div className="flex items-center justify-between">
//               <div className="text-sm text-gray-700">
//                 Showing{' '}
//                 <span className="font-medium">
//                   {(currentPage - 1) * electionsPerPage + 1}
//                 </span>{' '}
//                 to{' '}
//                 <span className="font-medium">
//                   {Math.min(currentPage * electionsPerPage, totalElections)}
//                 </span>{' '}
//                 of{' '}
//                 <span className="font-medium">{totalElections}</span>{' '}
//                 results
//               </div>
              
//               <div className="flex items-center space-x-2">
//                 <button
//                   onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
//                   disabled={currentPage === 1}
//                   className="relative inline-flex items-center px-4 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Previous
//                 </button>
                
//                 <span className="text-sm text-gray-700">
//                   Page {currentPage} of {getTotalPages()}
//                 </span>
                
//                 <button
//                   onClick={() => setCurrentPage(Math.min(getTotalPages(), currentPage + 1))}
//                   disabled={currentPage === getTotalPages()}
//                   className="relative inline-flex items-center px-4 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//        <pre>{JSON.stringify(election, null, 4)}</pre>
//     </div>
//   );
// };

// export default ElectionList2;
//this is the last workbale code
// import React, { useState, useEffect, useCallback } from 'react';
// import { Link, useNavigate, useSearchParams } from 'react-router';
// import { toast } from 'react-hot-toast';
// import {
//   PlusIcon,
//   MagnifyingGlassIcon,
//   FunnelIcon,
//   EllipsisHorizontalIcon,
//   PencilIcon,
//   TrashIcon,
//   DocumentDuplicateIcon,
//   EyeIcon,
//   ChartBarIcon
// } from '@heroicons/react/24/outline';
// //ElectionService
// //import { electionAPI } from '../../services/election-2/electionAPI';
// import LoadingScreen from '../../components/LoadingScreen';
// import eeelllectionService from '../../services/election/EeellllectionService';
// //import ElectionService from '../../services/election/ElectionService';

// const ElectionList2 = () => {
//   const navigate = useNavigate();
//   const [searchParams, setSearchParams] = useSearchParams();
  
//   const [elections, setElections] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
//   const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
//   const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'created_at');
//   const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'desc');
//   const [showFilters, setShowFilters] = useState(false);
  
//   // Pagination
//   const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
//   const [totalElections, setTotalElections] = useState(0);
//   const [electionsPerPage] = useState(10);
  
//   // Bulk actions
//   const [selectedElections, setSelectedElections] = useState([]);
//   /*eslint-disable*/
//   const [showBulkActions, setShowBulkActions] = useState(false);

//   useEffect(() => {
//     loadElections();
//   }, [searchTerm, statusFilter, sortBy, sortOrder, currentPage]);

//   useEffect(() => {
//     // Update URL params
//     const params = new URLSearchParams();
//     if (searchTerm) params.set('search', searchTerm);
//     if (statusFilter !== 'all') params.set('status', statusFilter);
//     if (sortBy !== 'created_at') params.set('sortBy', sortBy);
//     if (sortOrder !== 'desc') params.set('sortOrder', sortOrder);
//     if (currentPage !== 1) params.set('page', currentPage.toString());
    
//     setSearchParams(params);
//   }, [searchTerm, statusFilter, sortBy, sortOrder, currentPage, setSearchParams]);

//   const loadElections = useCallback(async () => {
//     try {
//       setLoading(true);
      
//       const params = {
//         limit: electionsPerPage,
//         offset: (currentPage - 1) * electionsPerPage
//       };

//       if (searchTerm) {
//         // Use search API
//         const response = await eeelllectionService.searchElections({
//           q: searchTerm,
//           status: statusFilter !== 'all' ? statusFilter : undefined,
//           ...params
//         });
        
//         if (response.success) {
//           setElections(response.data);
//           setTotalElections(response.pagination?.total || response.data.length);
//         }
//       } else {
//         // Use getUserElections API
//         const getUserParams = {
//           ...params,
//           status: statusFilter !== 'all' ? statusFilter : undefined
//         };
        
//         const response = await ElectionService.getUserElections(getUserParams);
        
//         if (response.success) {
//           let electionsData = response.data;
          
//           // Sort elections
//           electionsData.sort((a, b) => {
//             const aValue = a[sortBy];
//             const bValue = b[sortBy];
            
//             if (sortOrder === 'asc') {
//               return aValue > bValue ? 1 : -1;
//             } else {
//               return aValue < bValue ? 1 : -1;
//             }
//           });
          
//           setElections(electionsData);
//           setTotalElections(electionsData.length);
//         }
//       }
//     } catch (error) {
//       console.error('Error loading elections:', error);
//       toast.error('Failed to load elections');
//     } finally {
//       setLoading(false);
//     }
//   }, [searchTerm, statusFilter, sortBy, sortOrder, currentPage, electionsPerPage]);

//   const handleSearch = (value) => {
//     setSearchTerm(value);
//     setCurrentPage(1);
//   };

//   const handleStatusFilter = (status) => {
//     setStatusFilter(status);
//     setCurrentPage(1);
//   };

//   const handleSort = (field) => {
//     if (sortBy === field) {
//       setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortBy(field);
//       setSortOrder('desc');
//     }
//     setCurrentPage(1);
//   };

//   const handleElectionAction = async (action, electionId) => {
//     try {
//       switch (action) {
//         case 'delete':
//           if (window.confirm('Are you sure you want to delete this election?')) {
//             const response = await ElectionService.deleteElection(electionId);
//             if (response.success) {
//               toast.success('Election deleted successfully');
//               loadElections();
//             } else {
//               toast.error('Failed to delete election');
//             }
//           }
//           break;
          
//         case 'clone':
//           const election = elections.find(e => e.id === electionId);
//           const newTitle = `${election.title} (Copy)`;
//           const cloneResponse = await ElectionService.cloneElection(electionId, newTitle);
//           if (cloneResponse.success) {
//             toast.success('Election cloned successfully');
//             navigate(`/elections-2/${cloneResponse.data.id}/edit`);
//           } else {
//             toast.error('Failed to clone election');
//           }
//           break;
          
//         case 'edit':
//           navigate(`/elections-2/${electionId}/edit`);
//           break;
          
//         case 'view':
//           navigate(`/vote/${electionId}`);
//           break;
          
//         default:
//           break;
//       }
//     } catch (error) {
//       console.error('Error performing election action:', error);
//       toast.error('Action failed');
//     }
//   };

//   const handleSelectElection = (electionId) => {
//     setSelectedElections(prev => {
//       if (prev.includes(electionId)) {
//         return prev.filter(id => id !== electionId);
//       } else {
//         return [...prev, electionId];
//       }
//     });
//   };

//   const handleSelectAll = () => {
//     if (selectedElections.length === elections.length) {
//       setSelectedElections([]);
//     } else {
//       setSelectedElections(elections.map(e => e.id));
//     }
//   };

//   const handleBulkAction = async (action) => {
//     try {
//       switch (action) {
//         case 'delete':
//           if (window.confirm(`Are you sure you want to delete ${selectedElections.length} elections?`)) {
//             const results = await ElectionService.batchDelete(selectedElections);
//             const successful = results.filter(r => r.status === 'fulfilled').length;
//             toast.success(`${successful} elections deleted successfully`);
//             setSelectedElections([]);
//             loadElections();
//           }
//           break;
          
//         case 'publish':
//           const publishResults = await ElectionService.batchUpdateStatus(selectedElections, 'active');
//           const publishSuccessful = publishResults.filter(r => r.status === 'fulfilled').length;
//           toast.success(`${publishSuccessful} elections published successfully`);
//           setSelectedElections([]);
//           loadElections();
//           break;
          
//         default:
//           break;
//       }
//     } catch (error) {
//       console.error('Error performing bulk action:', error);
//       toast.error('Bulk action failed');
//     }
//     setShowBulkActions(false);
//   };

//   const getStatusBadge = (status) => {
//     const statusConfig = {
//       draft: { color: 'bg-gray-100 text-gray-800', text: 'Draft' },
//       active: { color: 'bg-green-100 text-green-800', text: 'Active' },
//       completed: { color: 'bg-blue-100 text-blue-800', text: 'Completed' },
//       cancelled: { color: 'bg-red-100 text-red-800', text: 'Cancelled' }
//     };

//     const config = statusConfig[status] || statusConfig.draft;
    
//     return (
//       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
//         {config.text}
//       </span>
//     );
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   const getTotalPages = () => Math.ceil(totalElections / electionsPerPage);

//   if (loading && elections.length === 0) {
//     return <LoadingScreen />;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">Elections</h1>
//               <p className="mt-2 text-sm text-gray-600">
//                 Manage and monitor your voting elections
//               </p>
//             </div>
            
//             <div className="flex items-center space-x-3">
//               <Link
//                 to="/elections-2/dashboard"
//                 className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
//               >
//                 <ChartBarIcon className="h-4 w-4 mr-2" />
//                 Dashboard
//               </Link>
              
//               <Link
//                 to="/elections-2/create"
//                 className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
//               >
//                 <PlusIcon className="h-4 w-4 mr-2" />
//                 Create Election
//               </Link>
//             </div>
//           </div>
//         </div>

//         {/* Search and Filters */}
//         <div className="bg-white shadow rounded-lg mb-6">
//           <div className="p-6">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
//               {/* Search */}
//               <div className="flex-1 max-w-lg">
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
//                   </div>
//                   <input
//                     type="text"
//                     placeholder="Search elections..."
//                     value={searchTerm}
//                     onChange={(e) => handleSearch(e.target.value)}
//                     className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>
//               </div>

//               {/* Filters */}
//               <div className="flex items-center space-x-4">
//                 <button
//                   onClick={() => setShowFilters(!showFilters)}
//                   className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
//                 >
//                   <FunnelIcon className="h-4 w-4 mr-2" />
//                   Filters
//                 </button>

//                 {/* Status Filter */}
//                 <select
//                   value={statusFilter}
//                   onChange={(e) => handleStatusFilter(e.target.value)}
//                   className="block px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="all">All Status</option>
//                   <option value="draft">Draft</option>
//                   <option value="active">Active</option>
//                   <option value="completed">Completed</option>
//                   <option value="cancelled">Cancelled</option>
//                 </select>

//                 {/* Sort */}
//                 <select
//                   value={`${sortBy}-${sortOrder}`}
//                   onChange={(e) => {
//                     const [field, order] = e.target.value.split('-');
//                     setSortBy(field);
//                     setSortOrder(order);
//                   }}
//                   className="block px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="created_at-desc">Newest First</option>
//                   <option value="created_at-asc">Oldest First</option>
//                   <option value="title-asc">Title A-Z</option>
//                   <option value="title-desc">Title Z-A</option>
//                   <option value="start_date-desc">Start Date (Latest)</option>
//                   <option value="start_date-asc">Start Date (Earliest)</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Bulk Actions */}
//         {selectedElections.length > 0 && (
//           <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
//             <div className="flex items-center justify-between">
//               <div className="text-sm text-blue-700">
//                 {selectedElections.length} election(s) selected
//               </div>
              
//               <div className="flex items-center space-x-2">
//                 <button
//                   onClick={() => handleBulkAction('publish')}
//                   className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700"
//                 >
//                   Publish Selected
//                 </button>
                
//                 <button
//                   onClick={() => handleBulkAction('delete')}
//                   className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700"
//                 >
//                   Delete Selected
//                 </button>
                
//                 <button
//                   onClick={() => setSelectedElections([])}
//                   className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
//                 >
//                   Clear Selection
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Elections Table */}
//         <div className="bg-white shadow rounded-lg overflow-hidden">
//           {elections.length === 0 ? (
//             <div className="text-center py-12">
//               <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
//               <h3 className="mt-2 text-sm font-medium text-gray-900">
//                 {searchTerm ? 'No elections found' : 'No elections yet'}
//               </h3>
//               <p className="mt-1 text-sm text-gray-500">
//                 {searchTerm 
//                   ? 'Try adjusting your search or filters.' 
//                   : 'Get started by creating your first election.'
//                 }
//               </p>
//               {!searchTerm && (
//                 <div className="mt-6">
//                   <Link
//                     to="/elections-2/create"
//                     className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
//                   >
//                     <PlusIcon className="h-4 w-4 mr-2" />
//                     Create Election
//                   </Link>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <>
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-6 py-3 text-left">
//                         <input
//                           type="checkbox"
//                           checked={selectedElections.length === elections.length && elections.length > 0}
//                           onChange={handleSelectAll}
//                           className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                         />
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Election
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Status
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Dates
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Votes
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {elections.map((election) => (
//                       <tr key={election.id} className="hover:bg-gray-50">
//                         <td className="px-6 py-4">
//                           <input
//                             type="checkbox"
//                             checked={selectedElections.includes(election.id)}
//                             onChange={() => handleSelectElection(election.id)}
//                             className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                           />
//                         </td>
                        
//                         <td className="px-6 py-4">
//                           <div>
//                             <div className="text-sm font-medium text-gray-900">
//                               {election.title}
//                             </div>
//                             {election.description && (
//                               <div className="text-sm text-gray-500 truncate max-w-xs">
//                                 {election.description}
//                               </div>
//                             )}
//                           </div>
//                         </td>
                        
//                         <td className="px-6 py-4">
//                           {getStatusBadge(election.status)}
//                         </td>
                        
//                         <td className="px-6 py-4 text-sm text-gray-500">
//                           <div>
//                             <div>Start: {formatDate(election.start_date)}</div>
//                             <div>End: {formatDate(election.end_date)}</div>
//                           </div>
//                         </td>
                        
//                         <td className="px-6 py-4 text-sm text-gray-500">
//                           {election.total_votes || 0}
//                         </td>
                        
//                         <td className="px-6 py-4">
//                           <div className="flex items-center space-x-2">
//                             <button
//                               onClick={() => handleElectionAction('edit', election.id)}
//                               className="text-blue-600 hover:text-blue-700"
//                               title="Edit"
//                             >
//                               <PencilIcon className="h-4 w-4" />
//                             </button>
                            
//                             {election.status === 'active' && (
//                               <button
//                                 onClick={() => handleElectionAction('view', election.id)}
//                                 className="text-green-600 hover:text-green-700"
//                                 title="View/Vote"
//                               >
//                                 <EyeIcon className="h-4 w-4" />
//                               </button>
//                             )}
                            
//                             <button
//                               onClick={() => handleElectionAction('clone', election.id)}
//                               className="text-gray-600 hover:text-gray-700"
//                               title="Clone"
//                             >
//                               <DocumentDuplicateIcon className="h-4 w-4" />
//                             </button>
                            
//                             {election.status === 'draft' && (
//                               <button
//                                 onClick={() => handleElectionAction('delete', election.id)}
//                                 className="text-red-600 hover:text-red-700"
//                                 title="Delete"
//                               >
//                                 <TrashIcon className="h-4 w-4" />
//                               </button>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Pagination */}
//               {getTotalPages() > 1 && (
//                 <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
//                   <div className="flex items-center justify-between">
//                     <div className="text-sm text-gray-700">
//                       Showing{' '}
//                       <span className="font-medium">
//                         {(currentPage - 1) * electionsPerPage + 1}
//                       </span>{' '}
//                       to{' '}
//                       <span className="font-medium">
//                         {Math.min(currentPage * electionsPerPage, totalElections)}
//                       </span>{' '}
//                       of{' '}
//                       <span className="font-medium">{totalElections}</span>{' '}
//                       results
//                     </div>
                    
//                     <div className="flex items-center space-x-2">
//                       <button
//                         onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
//                         disabled={currentPage === 1}
//                         className="relative inline-flex items-center px-2 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                       >
//                         Previous
//                       </button>
                      
//                       <span className="text-sm text-gray-700">
//                         Page {currentPage} of {getTotalPages()}
//                       </span>
                      
//                       <button
//                         onClick={() => setCurrentPage(Math.min(getTotalPages(), currentPage + 1))}
//                         disabled={currentPage === getTotalPages()}
//                         className="relative inline-flex items-center px-2 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                       >
//                         Next
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ElectionList2;