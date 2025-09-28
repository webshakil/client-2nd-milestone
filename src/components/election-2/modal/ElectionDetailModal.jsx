import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-hot-toast';
import {
  XMarkIcon,
  EyeIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ClockIcon,
  UserGroupIcon,
  GiftIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  LanguageIcon,
  QuestionMarkCircleIcon,
  PlayIcon,
  PencilIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import LotteryVotingDemo from './LotteryVotingDemo'; // Import the demo component

const ElectionDetailModal = ({ isOpen, onClose, electionId }) => {
  const navigate = useNavigate();
  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showLotteryDemo, setShowLotteryDemo] = useState(false); // Add demo state

  useEffect(() => {
    if (isOpen && electionId) {
      fetchElectionDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, electionId]);

  const fetchElectionDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://election-service-2.onrender.com/api/elections/${electionId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.success) {
        setElection(result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch election details');
      }
    } catch (error) {
      console.error('Error fetching election details:', error);
      toast.error('Failed to load election details');
      onClose();
    } finally {
      setLoading(false);
    }
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
      unknown: { color: 'bg-gray-100 text-gray-800', text: 'Unknown' },
    };
    const config = statusConfig[status] || statusConfig.unknown;
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}
      >
        {config.text}
      </span>
    );
  };

  const getPricingBadge = (election) => {
    if (election.pricing_type === 'free') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          Free
        </span>
      );
    } else if (election.pricing_type === 'regional') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          Regional Pricing
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
          Paid
        </span>
      );
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour24 = parseInt(hours, 10);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  };

  const canUserVote = (election) => {
    const status = getElectionStatus(election);
    // Allow voting for active elections, and also show buttons for upcoming elections for demo purposes
    return status === 'active' || status === 'upcoming';
  };

  const handleVoteAction = () => {
    // Show lottery demo instead of navigating
    setShowLotteryDemo(true);
  };

  const handleEdit = () => {
    navigate(`/elections-2/${election.id}/edit`);
    onClose();
  };

  const getRegionalPricingDisplay = (regionalFees) => {
    if (!regionalFees) return null;
    const regionNames = {
      region1: 'Region 1',
      region2: 'Region 2',
      region3: 'Region 3',
      region4: 'Region 4',
      region5: 'Region 5',
      region6: 'Region 6',
      region7: 'Region 7',
      region8: 'Region 8',
    };
    return Object.entries(regionalFees).map(([region, price]) => ({
      region: regionNames[region] || region,
      price: parseFloat(price),
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-4 mx-auto p-0 border w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 shadow-lg rounded-lg bg-white max-h-[95vh] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : election ? (
          <>
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-gray-900 truncate">{election.title}</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto max-h-[calc(95vh-80px)]">
              {/* Hero Image */}
              {election.topic_image_url && (
                <div className="h-64 bg-gray-200 relative">
                  <img
                    src={election.topic_image_url}
                    alt={election.title}
                    className="w-full h-full object-cover"
                  />
                  {election.logo_branding_url && (
                    <div className="absolute top-4 left-4">
                      <img
                        src={election.logo_branding_url}
                        alt="Logo"
                        className="h-16 w-16 object-contain bg-white rounded-lg p-2 shadow-md"
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="p-6 space-y-6">
                {/* Status and Pricing */}
                <div className="flex flex-wrap items-center gap-3">
                  {getStatusBadge(election)}
                  {getPricingBadge(election)}
                  {election.is_lotterized && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                      <GiftIcon className="h-4 w-4 mr-1" /> Lottery
                    </span>
                  )}
                  {election.biometric_required && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                      <ShieldCheckIcon className="h-4 w-4 mr-1" /> Biometric Required
                    </span>
                  )}
                  {election.custom_voting_url && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                      Custom URL: {election.custom_voting_url}
                    </span>
                  )}
                </div>

                {/* Description */}
                {election.description && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-700 leading-relaxed">{election.description}</p>
                  </div>
                )}

                {/* Video */}
                {election.topic_video_url && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                      <PlayIcon className="h-5 w-5 mr-2" /> Topic Video
                    </h3>
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      <iframe
                        src={election.topic_video_url.replace('watch?v=', 'embed/')}
                        title="Election Topic Video"
                        className="w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                )}

                {/* Election Details Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Timing Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Schedule & Timing</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CalendarIcon className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">Start</p>
                          <p className="text-gray-600">{formatDate(election.start_date)}</p>
                          <p className="text-gray-500 text-sm">{formatTime(election.start_time)}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <ClockIcon className="h-5 w-5 text-red-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">End</p>
                          <p className="text-gray-600">{formatDate(election.end_date)}</p>
                          <p className="text-gray-500 text-sm">{formatTime(election.end_time)}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <GlobeAltIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">Timezone</p>
                          <p className="text-gray-600">{election.timezone || 'UTC'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Voting Configuration */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Voting Configuration</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium text-gray-900">Voting Type</p>
                        <p className="text-gray-600 capitalize">
                          {election.voting_type?.replace('_', ' ')}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Permission to Vote</p>
                        <p className="text-gray-600 capitalize">
                          {election.permission_to_vote?.replace('_', ' ')}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Authentication Method</p>
                        <p className="text-gray-600 capitalize">{election.auth_method}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Additional Auth Options</p>
                        <div className="text-sm text-gray-600 space-y-1">
                          {election.allow_oauth && <p>✓ OAuth Allowed</p>}
                          {election.allow_magic_link && <p>✓ Magic Link Allowed</p>}
                          {election.allow_email_password && <p>✓ Email/Password Allowed</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Countries */}
                {election.countries && election.countries.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <MapPinIcon className="h-5 w-5 mr-2" /> Eligible Countries ({election.countries.length})
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {election.countries.map((country, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
                          <span className="text-lg">{country.flag}</span>
                          <span className="text-sm font-medium text-gray-700">{country.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Regional Pricing */}
                {election.pricing_type === 'regional' && election.regional_fees && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                      <CurrencyDollarIcon className="h-5 w-5 mr-2" /> Regional Pricing
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {getRegionalPricingDisplay(election.regional_fees)?.map((item, index) => (
                        <div key={index} className="bg-white p-3 rounded-md border">
                          <p className="font-medium text-blue-900">{item.region}</p>
                          <p className="text-blue-700">${item.price.toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pricing Information */}
                {election.pricing_type !== 'free' && election.pricing_type !== 'regional' && (
                  <div className="bg-orange-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-orange-900 mb-3 flex items-center">
                      <CurrencyDollarIcon className="h-5 w-5 mr-2" /> Pricing Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium text-orange-900">Participation Fee</p>
                        <p className="text-orange-700">${election.participation_fee || 0}</p>
                      </div>
                      <div>
                        <p className="font-medium text-orange-900">Processing Fee</p>
                        <p className="text-orange-700">{election.processing_fee_percentage || 0}%</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Questions */}
                {election.questions && election.questions.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <QuestionMarkCircleIcon className="h-5 w-5 mr-2" /> Election Questions ({election.questions.length})
                    </h3>
                    <div className="space-y-4">
                      {election.questions.map((question, index) => (
                        <div key={question.id || index} className="border rounded-lg p-4 bg-gray-50">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{question.questionText}</h4>
                            <div className="flex gap-2">
                              <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                {question.questionType?.replace('_', ' ').toUpperCase()}
                              </span>
                              {question.isRequired && (
                                <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                                  Required
                                </span>
                              )}
                            </div>
                          </div>
                          {question.answers && question.answers.length > 0 && (
                            <div className="mt-3">
                              <p className="text-sm font-medium text-gray-700 mb-2">Answer Options:</p>
                              <div className="space-y-1">
                                {question.answers.map((answer, answerIndex) => (
                                  <div key={answer.id || answerIndex} className="text-sm text-gray-600 pl-4">
                                    • {answer.text}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lottery Information */}
                {election.is_lotterized && (
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-purple-900 mb-3 flex items-center">
                      <GiftIcon className="h-5 w-5 mr-2" /> Lottery Prize Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="font-medium text-purple-900">Prize Type</p>
                        <p className="text-purple-700 capitalize">{election.reward_type}</p>
                      </div>
                      <div>
                        <p className="font-medium text-purple-900">Prize Amount</p>
                        <p className="text-purple-700">
                          {election.reward_type === 'monetary'
                            ? `$${election.reward_amount}`
                            : election.non_monetary_reward || 'Non-monetary prize'}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-purple-900">Number of Winners</p>
                        <p className="text-purple-700">{election.winner_count || 1}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Election Settings */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Election Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-900">Live Results</p>
                      <p className="text-gray-600">{election.show_live_results ? 'Enabled' : 'Disabled'}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Vote Editing</p>
                      <p className="text-gray-600">{election.allow_vote_editing ? 'Allowed' : 'Not Allowed'}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Primary Language</p>
                      <p className="text-gray-600">{election.primary_language?.toUpperCase() || 'EN'}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Multi-language Support</p>
                      <p className="text-gray-600">{election.supports_multilang ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="border-t pt-6">
                  <div className="flex flex-col sm:flex-row gap-3">
                    {canUserVote(election) ? (
                      <button
                        onClick={handleVoteAction}
                        className={`flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white ${
                          election.pricing_type === 'free'
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-blue-600 hover:bg-blue-700'
                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                      >
                        {election.pricing_type === 'free' ? (
                          <>
                            <EyeIcon className="h-5 w-5 mr-2" /> Vote Now
                          </>
                        ) : (
                          <>
                            <CurrencyDollarIcon className="h-5 w-5 mr-2" /> Pay Now
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={handleVoteAction}
                        disabled={getElectionStatus(election) === 'completed'}
                        className={`flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white ${
                          getElectionStatus(election) === 'completed'
                            ? 'bg-gray-400 cursor-not-allowed'
                            : election.pricing_type === 'free'
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-blue-600 hover:bg-blue-700'
                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                      >
                        {election.pricing_type === 'free' ? (
                          <>
                            <EyeIcon className="h-5 w-5 mr-2" /> Vote Now
                          </>
                        ) : (
                          <>
                            <CurrencyDollarIcon className="h-5 w-5 mr-2" /> Pay Now
                          </>
                        )}
                      </button>
                    )}

                    {election.is_draft && (
                      <button
                        onClick={handleEdit}
                        className="px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <PencilIcon className="h-5 w-5 mr-2 inline" /> Edit Election
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Failed to load election details</p>
          </div>
        )}

        {/* Lottery Demo Modal (rendered outside loading/content condition so it can appear when toggled) */}
        {showLotteryDemo && (
          <LotteryVotingDemo election={election} onClose={() => setShowLotteryDemo(false)} />
        )}
      </div>
    </div>
  );
};

export default ElectionDetailModal;

//this code is excellent but to show extensive demo above code
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router';
// import { toast } from 'react-hot-toast';
// import {
//   XMarkIcon,
//   EyeIcon,
//   CurrencyDollarIcon,
//   CalendarIcon,
//   ClockIcon,
//   UserGroupIcon,
//   GiftIcon,
//   GlobeAltIcon,
//   ShieldCheckIcon,
//   CreditCardIcon,
//   LanguageIcon,
//   QuestionMarkCircleIcon,
//   PlayIcon,
//   PencilIcon,
//   MapPinIcon
// } from '@heroicons/react/24/outline';

// const ElectionDetailModal = ({ isOpen, onClose, electionId }) => {
//   const navigate = useNavigate();
//   const [election, setElection] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (isOpen && electionId) {
//       fetchElectionDetails();
//     }
//   }, [isOpen, electionId]);

//   const fetchElectionDetails = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`http://localhost:3004/api/elections/${electionId}`);
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const result = await response.json();
      
//       if (result.success) {
//         setElection(result.data);
//       } else {
//         throw new Error(result.message || 'Failed to fetch election details');
//       }
//     } catch (error) {
//       console.error('Error fetching election details:', error);
//       toast.error('Failed to load election details');
//       onClose();
//     } finally {
//       setLoading(false);
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
//       <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
//         {config.text}
//       </span>
//     );
//   };

//   const getPricingBadge = (election) => {
//     if (election.pricing_type === 'free') {
//       return (
//         <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
//           Free
//         </span>
//       );
//     } else if (election.pricing_type === 'regional') {
//       return (
//         <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
//           Regional Pricing
//         </span>
//       );
//     } else {
//       return (
//         <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
//           Paid
//         </span>
//       );
//     }
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const formatTime = (timeString) => {
//     if (!timeString) return '';
//     const [hours, minutes] = timeString.split(':');
//     const hour24 = parseInt(hours);
//     const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
//     const ampm = hour24 >= 12 ? 'PM' : 'AM';
//     return `${hour12}:${minutes} ${ampm}`;
//   };

//   const canUserVote = (election) => {
//     const status = getElectionStatus(election);
//     // Allow voting for active elections, and also show buttons for upcoming elections for demo purposes
//     return status === 'active' || status === 'upcoming';
//   };

//   const handleVoteAction = () => {
//     if (election.pricing_type === 'free') {
//       navigate(`/vote/${election.id}`);
//     } else {
//       navigate(`/payment/${election.id}`);
//     }
//     onClose();
//   };

//   const handleEdit = () => {
//     navigate(`/elections-2/${election.id}/edit`);
//     onClose();
//   };

//   const getRegionalPricingDisplay = (regionalFees) => {
//     if (!regionalFees) return null;
    
//     const regionNames = {
//       region1: 'Region 1',
//       region2: 'Region 2', 
//       region3: 'Region 3',
//       region4: 'Region 4',
//       region5: 'Region 5',
//       region6: 'Region 6',
//       region7: 'Region 7',
//       region8: 'Region 8'
//     };

//     return Object.entries(regionalFees).map(([region, price]) => ({
//       region: regionNames[region] || region,
//       price: parseFloat(price)
//     }));
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
//       <div className="relative top-4 mx-auto p-0 border w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 shadow-lg rounded-lg bg-white max-h-[95vh] overflow-hidden">
//         {loading ? (
//           <div className="flex items-center justify-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//           </div>
//         ) : election ? (
//           <>
//             {/* Modal Header */}
//             <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
//               <h2 className="text-2xl font-bold text-gray-900 truncate">
//                 {election.title}
//               </h2>
//               <button
//                 onClick={onClose}
//                 className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
//               >
//                 <XMarkIcon className="h-6 w-6" />
//               </button>
//             </div>

//             {/* Modal Content */}
//             <div className="overflow-y-auto max-h-[calc(95vh-80px)]">
//               {/* Hero Image */}
//               {election.topic_image_url && (
//                 <div className="h-64 bg-gray-200 relative">
//                   <img
//                     src={election.topic_image_url}
//                     alt={election.title}
//                     className="w-full h-full object-cover"
//                   />
//                   {election.logo_branding_url && (
//                     <div className="absolute top-4 left-4">
//                       <img
//                         src={election.logo_branding_url}
//                         alt="Logo"
//                         className="h-16 w-16 object-contain bg-white rounded-lg p-2 shadow-md"
//                       />
//                     </div>
//                   )}
//                 </div>
//               )}

//               <div className="p-6 space-y-6">
//                 {/* Status and Pricing */}
//                 <div className="flex flex-wrap items-center gap-3">
//                   {getStatusBadge(election)}
//                   {getPricingBadge(election)}
//                   {election.is_lotterized && (
//                     <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
//                       <GiftIcon className="h-4 w-4 mr-1" />
//                       Lottery
//                     </span>
//                   )}
//                   {election.biometric_required && (
//                     <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
//                       <ShieldCheckIcon className="h-4 w-4 mr-1" />
//                       Biometric Required
//                     </span>
//                   )}
//                   {election.custom_voting_url && (
//                     <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
//                       Custom URL: {election.custom_voting_url}
//                     </span>
//                   )}
//                 </div>

//                 {/* Description */}
//                 {election.description && (
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
//                     <p className="text-gray-700 leading-relaxed">{election.description}</p>
//                   </div>
//                 )}

//                 {/* Video */}
//                 {election.topic_video_url && (
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
//                       <PlayIcon className="h-5 w-5 mr-2" />
//                       Topic Video
//                     </h3>
//                     <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
//                       <iframe
//                         src={election.topic_video_url.replace('watch?v=', 'embed/')}
//                         title="Election Topic Video"
//                         className="w-full h-full"
//                         frameBorder="0"
//                         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                         allowFullScreen
//                       ></iframe>
//                     </div>
//                   </div>
//                 )}

//                 {/* Election Details Grid */}
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                   {/* Timing Information */}
//                   <div className="space-y-4">
//                     <h3 className="text-lg font-semibold text-gray-900">Schedule & Timing</h3>
//                     <div className="space-y-3">
//                       <div className="flex items-start gap-3">
//                         <CalendarIcon className="h-5 w-5 text-green-600 mt-0.5" />
//                         <div>
//                           <p className="font-medium text-gray-900">Start</p>
//                           <p className="text-gray-600">{formatDate(election.start_date)}</p>
//                           <p className="text-gray-500 text-sm">{formatTime(election.start_time)}</p>
//                         </div>
//                       </div>
//                       <div className="flex items-start gap-3">
//                         <ClockIcon className="h-5 w-5 text-red-600 mt-0.5" />
//                         <div>
//                           <p className="font-medium text-gray-900">End</p>
//                           <p className="text-gray-600">{formatDate(election.end_date)}</p>
//                           <p className="text-gray-500 text-sm">{formatTime(election.end_time)}</p>
//                         </div>
//                       </div>
//                       <div className="flex items-start gap-3">
//                         <GlobeAltIcon className="h-5 w-5 text-blue-600 mt-0.5" />
//                         <div>
//                           <p className="font-medium text-gray-900">Timezone</p>
//                           <p className="text-gray-600">{election.timezone || 'UTC'}</p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Voting Configuration */}
//                   <div className="space-y-4">
//                     <h3 className="text-lg font-semibold text-gray-900">Voting Configuration</h3>
//                     <div className="space-y-3">
//                       <div>
//                         <p className="font-medium text-gray-900">Voting Type</p>
//                         <p className="text-gray-600 capitalize">{election.voting_type?.replace('_', ' ')}</p>
//                       </div>
//                       <div>
//                         <p className="font-medium text-gray-900">Permission to Vote</p>
//                         <p className="text-gray-600 capitalize">{election.permission_to_vote?.replace('_', ' ')}</p>
//                       </div>
//                       <div>
//                         <p className="font-medium text-gray-900">Authentication Method</p>
//                         <p className="text-gray-600 capitalize">{election.auth_method}</p>
//                       </div>
//                       <div>
//                         <p className="font-medium text-gray-900">Additional Auth Options</p>
//                         <div className="text-sm text-gray-600 space-y-1">
//                           {election.allow_oauth && <p>✓ OAuth Allowed</p>}
//                           {election.allow_magic_link && <p>✓ Magic Link Allowed</p>}
//                           {election.allow_email_password && <p>✓ Email/Password Allowed</p>}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Countries */}
//                 {election.countries && election.countries.length > 0 && (
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
//                       <MapPinIcon className="h-5 w-5 mr-2" />
//                       Eligible Countries ({election.countries.length})
//                     </h3>
//                     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
//                       {election.countries.map((country, index) => (
//                         <div key={index} className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
//                           <span className="text-lg">{country.flag}</span>
//                           <span className="text-sm font-medium text-gray-700">{country.name}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Regional Pricing */}
//                 {election.pricing_type === 'regional' && election.regional_fees && (
//                   <div className="bg-blue-50 rounded-lg p-4">
//                     <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
//                       <CurrencyDollarIcon className="h-5 w-5 mr-2" />
//                       Regional Pricing
//                     </h3>
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//                       {getRegionalPricingDisplay(election.regional_fees)?.map((item, index) => (
//                         <div key={index} className="bg-white p-3 rounded-md border">
//                           <p className="font-medium text-blue-900">{item.region}</p>
//                           <p className="text-blue-700">${item.price.toFixed(2)}</p>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Pricing Information */}
//                 {(election.pricing_type !== 'free' && election.pricing_type !== 'regional') && (
//                   <div className="bg-orange-50 rounded-lg p-4">
//                     <h3 className="text-lg font-semibold text-orange-900 mb-3 flex items-center">
//                       <CurrencyDollarIcon className="h-5 w-5 mr-2" />
//                       Pricing Information
//                     </h3>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <p className="font-medium text-orange-900">Participation Fee</p>
//                         <p className="text-orange-700">${election.participation_fee || 0}</p>
//                       </div>
//                       <div>
//                         <p className="font-medium text-orange-900">Processing Fee</p>
//                         <p className="text-orange-700">{election.processing_fee_percentage || 0}%</p>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Questions */}
//                 {election.questions && election.questions.length > 0 && (
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
//                       <QuestionMarkCircleIcon className="h-5 w-5 mr-2" />
//                       Election Questions ({election.questions.length})
//                     </h3>
//                     <div className="space-y-4">
//                       {election.questions.map((question, index) => (
//                         <div key={question.id || index} className="border rounded-lg p-4 bg-gray-50">
//                           <div className="flex items-start justify-between mb-2">
//                             <h4 className="font-medium text-gray-900">{question.questionText}</h4>
//                             <div className="flex gap-2">
//                               <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
//                                 {question.questionType?.replace('_', ' ').toUpperCase()}
//                               </span>
//                               {question.isRequired && (
//                                 <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
//                                   Required
//                                 </span>
//                               )}
//                             </div>
//                           </div>
//                           {question.answers && question.answers.length > 0 && (
//                             <div className="mt-3">
//                               <p className="text-sm font-medium text-gray-700 mb-2">Answer Options:</p>
//                               <div className="space-y-1">
//                                 {question.answers.map((answer, answerIndex) => (
//                                   <div key={answer.id || answerIndex} className="text-sm text-gray-600 pl-4">
//                                     • {answer.text}
//                                   </div>
//                                 ))}
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Lottery Information */}
//                 {election.is_lotterized && (
//                   <div className="bg-purple-50 rounded-lg p-4">
//                     <h3 className="text-lg font-semibold text-purple-900 mb-3 flex items-center">
//                       <GiftIcon className="h-5 w-5 mr-2" />
//                       Lottery Prize Details
//                     </h3>
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                       <div>
//                         <p className="font-medium text-purple-900">Prize Type</p>
//                         <p className="text-purple-700 capitalize">{election.reward_type}</p>
//                       </div>
//                       <div>
//                         <p className="font-medium text-purple-900">Prize Amount</p>
//                         <p className="text-purple-700">
//                           {election.reward_type === 'monetary' 
//                             ? `$${election.reward_amount}` 
//                             : election.non_monetary_reward || 'Non-monetary prize'}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="font-medium text-purple-900">Number of Winners</p>
//                         <p className="text-purple-700">{election.winner_count || 1}</p>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Election Settings */}
//                 <div className="bg-gray-50 rounded-lg p-4">
//                   <h3 className="text-lg font-semibold text-gray-900 mb-3">Election Settings</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//                     <div>
//                       <p className="font-medium text-gray-900">Live Results</p>
//                       <p className="text-gray-600">{election.show_live_results ? 'Enabled' : 'Disabled'}</p>
//                     </div>
//                     <div>
//                       <p className="font-medium text-gray-900">Vote Editing</p>
//                       <p className="text-gray-600">{election.allow_vote_editing ? 'Allowed' : 'Not Allowed'}</p>
//                     </div>
//                     <div>
//                       <p className="font-medium text-gray-900">Primary Language</p>
//                       <p className="text-gray-600">{election.primary_language?.toUpperCase() || 'EN'}</p>
//                     </div>
//                     <div>
//                       <p className="font-medium text-gray-900">Multi-language Support</p>
//                       <p className="text-gray-600">{election.supports_multilang ? 'Yes' : 'No'}</p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="border-t pt-6">
//                   <div className="flex flex-col sm:flex-row gap-3">
//                     {canUserVote(election) ? (
//                       <button
//                         onClick={handleVoteAction}
//                         className={`flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white ${
//                           election.pricing_type === 'free'
//                             ? 'bg-green-600 hover:bg-green-700'
//                             : 'bg-blue-600 hover:bg-blue-700'
//                         } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
//                       >
//                         {election.pricing_type === 'free' ? (
//                           <>
//                             <EyeIcon className="h-5 w-5 mr-2" />
//                             Vote Now
//                           </>
//                         ) : (
//                           <>
//                             <CurrencyDollarIcon className="h-5 w-5 mr-2" />
//                             Pay Now
//                           </>
//                         )}
//                       </button>
//                     ) : (
//                       <button
//                         onClick={handleVoteAction}
//                         disabled={getElectionStatus(election) === 'completed'}
//                         className={`flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white ${
//                           getElectionStatus(election) === 'completed' 
//                             ? 'bg-gray-400 cursor-not-allowed' 
//                             : election.pricing_type === 'free'
//                             ? 'bg-green-600 hover:bg-green-700'
//                             : 'bg-blue-600 hover:bg-blue-700'
//                         } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
//                       >
//                         {election.pricing_type === 'free' ? (
//                           <>
//                             <EyeIcon className="h-5 w-5 mr-2" />
//                             Vote Now
//                           </>
//                         ) : (
//                           <>
//                             <CurrencyDollarIcon className="h-5 w-5 mr-2" />
//                             Pay Now
//                           </>
//                         )}
//                       </button>
//                     )}
                    
//                     {election.is_draft && (
//                       <button
//                         onClick={handleEdit}
//                         className="px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                       >
//                         <PencilIcon className="h-5 w-5 mr-2 inline" />
//                         Edit Election
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </>
//         ) : (
//           <div className="flex items-center justify-center h-64">
//             <p className="text-gray-500">Failed to load election details</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ElectionDetailModal;
//this code is excellent but vote now is not showing
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router';
// import { toast } from 'react-hot-toast';
// import {
//   XMarkIcon,
//   EyeIcon,
//   CurrencyDollarIcon,
//   CalendarIcon,
//   ClockIcon,
//   UserGroupIcon,
//   GiftIcon,
//   GlobeAltIcon,
//   ShieldCheckIcon,
//   CreditCardIcon,
//   LanguageIcon,
//   QuestionMarkCircleIcon,
//   PlayIcon,
//   PencilIcon,
//   MapPinIcon
// } from '@heroicons/react/24/outline';

// const ElectionDetailModal = ({ isOpen, onClose, electionId }) => {
//   const navigate = useNavigate();
//   const [election, setElection] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (isOpen && electionId) {
//       fetchElectionDetails();
//     }
//   }, [isOpen, electionId]);

//   const fetchElectionDetails = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`http://localhost:3004/api/elections/${electionId}`);
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const result = await response.json();
      
//       if (result.success) {
//         setElection(result.data);
//       } else {
//         throw new Error(result.message || 'Failed to fetch election details');
//       }
//     } catch (error) {
//       console.error('Error fetching election details:', error);
//       toast.error('Failed to load election details');
//       onClose();
//     } finally {
//       setLoading(false);
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
//       <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
//         {config.text}
//       </span>
//     );
//   };

//   const getPricingBadge = (election) => {
//     if (election.pricing_type === 'free') {
//       return (
//         <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
//           Free
//         </span>
//       );
//     } else if (election.pricing_type === 'regional') {
//       return (
//         <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
//           Regional Pricing
//         </span>
//       );
//     } else {
//       return (
//         <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
//           Paid
//         </span>
//       );
//     }
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const formatTime = (timeString) => {
//     if (!timeString) return '';
//     const [hours, minutes] = timeString.split(':');
//     const hour24 = parseInt(hours);
//     const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
//     const ampm = hour24 >= 12 ? 'PM' : 'AM';
//     return `${hour12}:${minutes} ${ampm}`;
//   };

//   const canUserVote = (election) => {
//     const status = getElectionStatus(election);
//     return status === 'active';
//   };

//   const handleVoteAction = () => {
//     if (election.pricing_type === 'free') {
//       navigate(`/vote/${election.id}`);
//     } else {
//       navigate(`/payment/${election.id}`);
//     }
//     onClose();
//   };

//   const handleEdit = () => {
//     navigate(`/elections-2/${election.id}/edit`);
//     onClose();
//   };

//   const getRegionalPricingDisplay = (regionalFees) => {
//     if (!regionalFees) return null;
    
//     const regionNames = {
//       region1: 'Region 1',
//       region2: 'Region 2', 
//       region3: 'Region 3',
//       region4: 'Region 4',
//       region5: 'Region 5',
//       region6: 'Region 6',
//       region7: 'Region 7',
//       region8: 'Region 8'
//     };

//     return Object.entries(regionalFees).map(([region, price]) => ({
//       region: regionNames[region] || region,
//       price: parseFloat(price)
//     }));
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
//       <div className="relative top-4 mx-auto p-0 border w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 shadow-lg rounded-lg bg-white max-h-[95vh] overflow-hidden">
//         {loading ? (
//           <div className="flex items-center justify-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//           </div>
//         ) : election ? (
//           <>
//             {/* Modal Header */}
//             <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
//               <h2 className="text-2xl font-bold text-gray-900 truncate">
//                 {election.title}
//               </h2>
//               <button
//                 onClick={onClose}
//                 className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
//               >
//                 <XMarkIcon className="h-6 w-6" />
//               </button>
//             </div>

//             {/* Modal Content */}
//             <div className="overflow-y-auto max-h-[calc(95vh-80px)]">
//               {/* Hero Image */}
//               {election.topic_image_url && (
//                 <div className="h-64 bg-gray-200 relative">
//                   <img
//                     src={election.topic_image_url}
//                     alt={election.title}
//                     className="w-full h-full object-cover"
//                   />
//                   {election.logo_branding_url && (
//                     <div className="absolute top-4 left-4">
//                       <img
//                         src={election.logo_branding_url}
//                         alt="Logo"
//                         className="h-16 w-16 object-contain bg-white rounded-lg p-2 shadow-md"
//                       />
//                     </div>
//                   )}
//                 </div>
//               )}

//               <div className="p-6 space-y-6">
//                 {/* Status and Pricing */}
//                 <div className="flex flex-wrap items-center gap-3">
//                   {getStatusBadge(election)}
//                   {getPricingBadge(election)}
//                   {election.is_lotterized && (
//                     <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
//                       <GiftIcon className="h-4 w-4 mr-1" />
//                       Lottery
//                     </span>
//                   )}
//                   {election.biometric_required && (
//                     <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
//                       <ShieldCheckIcon className="h-4 w-4 mr-1" />
//                       Biometric Required
//                     </span>
//                   )}
//                   {election.custom_voting_url && (
//                     <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
//                       Custom URL: {election.custom_voting_url}
//                     </span>
//                   )}
//                 </div>

//                 {/* Description */}
//                 {election.description && (
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
//                     <p className="text-gray-700 leading-relaxed">{election.description}</p>
//                   </div>
//                 )}

//                 {/* Video */}
//                 {election.topic_video_url && (
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
//                       <PlayIcon className="h-5 w-5 mr-2" />
//                       Topic Video
//                     </h3>
//                     <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
//                       <iframe
//                         src={election.topic_video_url.replace('watch?v=', 'embed/')}
//                         title="Election Topic Video"
//                         className="w-full h-full"
//                         frameBorder="0"
//                         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                         allowFullScreen
//                       ></iframe>
//                     </div>
//                   </div>
//                 )}

//                 {/* Election Details Grid */}
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                   {/* Timing Information */}
//                   <div className="space-y-4">
//                     <h3 className="text-lg font-semibold text-gray-900">Schedule & Timing</h3>
//                     <div className="space-y-3">
//                       <div className="flex items-start gap-3">
//                         <CalendarIcon className="h-5 w-5 text-green-600 mt-0.5" />
//                         <div>
//                           <p className="font-medium text-gray-900">Start</p>
//                           <p className="text-gray-600">{formatDate(election.start_date)}</p>
//                           <p className="text-gray-500 text-sm">{formatTime(election.start_time)}</p>
//                         </div>
//                       </div>
//                       <div className="flex items-start gap-3">
//                         <ClockIcon className="h-5 w-5 text-red-600 mt-0.5" />
//                         <div>
//                           <p className="font-medium text-gray-900">End</p>
//                           <p className="text-gray-600">{formatDate(election.end_date)}</p>
//                           <p className="text-gray-500 text-sm">{formatTime(election.end_time)}</p>
//                         </div>
//                       </div>
//                       <div className="flex items-start gap-3">
//                         <GlobeAltIcon className="h-5 w-5 text-blue-600 mt-0.5" />
//                         <div>
//                           <p className="font-medium text-gray-900">Timezone</p>
//                           <p className="text-gray-600">{election.timezone || 'UTC'}</p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Voting Configuration */}
//                   <div className="space-y-4">
//                     <h3 className="text-lg font-semibold text-gray-900">Voting Configuration</h3>
//                     <div className="space-y-3">
//                       <div>
//                         <p className="font-medium text-gray-900">Voting Type</p>
//                         <p className="text-gray-600 capitalize">{election.voting_type?.replace('_', ' ')}</p>
//                       </div>
//                       <div>
//                         <p className="font-medium text-gray-900">Permission to Vote</p>
//                         <p className="text-gray-600 capitalize">{election.permission_to_vote?.replace('_', ' ')}</p>
//                       </div>
//                       <div>
//                         <p className="font-medium text-gray-900">Authentication Method</p>
//                         <p className="text-gray-600 capitalize">{election.auth_method}</p>
//                       </div>
//                       <div>
//                         <p className="font-medium text-gray-900">Additional Auth Options</p>
//                         <div className="text-sm text-gray-600 space-y-1">
//                           {election.allow_oauth && <p>✓ OAuth Allowed</p>}
//                           {election.allow_magic_link && <p>✓ Magic Link Allowed</p>}
//                           {election.allow_email_password && <p>✓ Email/Password Allowed</p>}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Countries */}
//                 {election.countries && election.countries.length > 0 && (
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
//                       <MapPinIcon className="h-5 w-5 mr-2" />
//                       Eligible Countries ({election.countries.length})
//                     </h3>
//                     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
//                       {election.countries.map((country, index) => (
//                         <div key={index} className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
//                           <span className="text-lg">{country.flag}</span>
//                           <span className="text-sm font-medium text-gray-700">{country.name}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Regional Pricing */}
//                 {election.pricing_type === 'regional' && election.regional_fees && (
//                   <div className="bg-blue-50 rounded-lg p-4">
//                     <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
//                       <CurrencyDollarIcon className="h-5 w-5 mr-2" />
//                       Regional Pricing
//                     </h3>
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//                       {getRegionalPricingDisplay(election.regional_fees)?.map((item, index) => (
//                         <div key={index} className="bg-white p-3 rounded-md border">
//                           <p className="font-medium text-blue-900">{item.region}</p>
//                           <p className="text-blue-700">${item.price.toFixed(2)}</p>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Pricing Information */}
//                 {(election.pricing_type !== 'free' && election.pricing_type !== 'regional') && (
//                   <div className="bg-orange-50 rounded-lg p-4">
//                     <h3 className="text-lg font-semibold text-orange-900 mb-3 flex items-center">
//                       <CurrencyDollarIcon className="h-5 w-5 mr-2" />
//                       Pricing Information
//                     </h3>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <p className="font-medium text-orange-900">Participation Fee</p>
//                         <p className="text-orange-700">${election.participation_fee || 0}</p>
//                       </div>
//                       <div>
//                         <p className="font-medium text-orange-900">Processing Fee</p>
//                         <p className="text-orange-700">{election.processing_fee_percentage || 0}%</p>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Questions */}
//                 {election.questions && election.questions.length > 0 && (
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
//                       <QuestionMarkCircleIcon className="h-5 w-5 mr-2" />
//                       Election Questions ({election.questions.length})
//                     </h3>
//                     <div className="space-y-4">
//                       {election.questions.map((question, index) => (
//                         <div key={question.id || index} className="border rounded-lg p-4 bg-gray-50">
//                           <div className="flex items-start justify-between mb-2">
//                             <h4 className="font-medium text-gray-900">{question.questionText}</h4>
//                             <div className="flex gap-2">
//                               <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
//                                 {question.questionType?.replace('_', ' ').toUpperCase()}
//                               </span>
//                               {question.isRequired && (
//                                 <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
//                                   Required
//                                 </span>
//                               )}
//                             </div>
//                           </div>
//                           {question.answers && question.answers.length > 0 && (
//                             <div className="mt-3">
//                               <p className="text-sm font-medium text-gray-700 mb-2">Answer Options:</p>
//                               <div className="space-y-1">
//                                 {question.answers.map((answer, answerIndex) => (
//                                   <div key={answer.id || answerIndex} className="text-sm text-gray-600 pl-4">
//                                     • {answer.text}
//                                   </div>
//                                 ))}
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Lottery Information */}
//                 {election.is_lotterized && (
//                   <div className="bg-purple-50 rounded-lg p-4">
//                     <h3 className="text-lg font-semibold text-purple-900 mb-3 flex items-center">
//                       <GiftIcon className="h-5 w-5 mr-2" />
//                       Lottery Prize Details
//                     </h3>
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                       <div>
//                         <p className="font-medium text-purple-900">Prize Type</p>
//                         <p className="text-purple-700 capitalize">{election.reward_type}</p>
//                       </div>
//                       <div>
//                         <p className="font-medium text-purple-900">Prize Amount</p>
//                         <p className="text-purple-700">
//                           {election.reward_type === 'monetary' 
//                             ? `$${election.reward_amount}` 
//                             : election.non_monetary_reward || 'Non-monetary prize'}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="font-medium text-purple-900">Number of Winners</p>
//                         <p className="text-purple-700">{election.winner_count || 1}</p>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Election Settings */}
//                 <div className="bg-gray-50 rounded-lg p-4">
//                   <h3 className="text-lg font-semibold text-gray-900 mb-3">Election Settings</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//                     <div>
//                       <p className="font-medium text-gray-900">Live Results</p>
//                       <p className="text-gray-600">{election.show_live_results ? 'Enabled' : 'Disabled'}</p>
//                     </div>
//                     <div>
//                       <p className="font-medium text-gray-900">Vote Editing</p>
//                       <p className="text-gray-600">{election.allow_vote_editing ? 'Allowed' : 'Not Allowed'}</p>
//                     </div>
//                     <div>
//                       <p className="font-medium text-gray-900">Primary Language</p>
//                       <p className="text-gray-600">{election.primary_language?.toUpperCase() || 'EN'}</p>
//                     </div>
//                     <div>
//                       <p className="font-medium text-gray-900">Multi-language Support</p>
//                       <p className="text-gray-600">{election.supports_multilang ? 'Yes' : 'No'}</p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="border-t pt-6">
//                   <div className="flex flex-col sm:flex-row gap-3">
//                     {canUserVote(election) ? (
//                       <button
//                         onClick={handleVoteAction}
//                         className={`flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white ${
//                           election.pricing_type === 'free'
//                             ? 'bg-green-600 hover:bg-green-700'
//                             : 'bg-blue-600 hover:bg-blue-700'
//                         } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
//                       >
//                         {election.pricing_type === 'free' ? (
//                           <>
//                             <EyeIcon className="h-5 w-5 mr-2" />
//                             Vote Now
//                           </>
//                         ) : (
//                           <>
//                             <CurrencyDollarIcon className="h-5 w-5 mr-2" />
//                             Pay Now
//                           </>
//                         )}
//                       </button>
//                     ) : (
//                       <div className="flex-1 text-center py-3 text-gray-500">
//                         {getElectionStatus(election) === 'draft' ? 'Election is in draft mode' : 
//                          getElectionStatus(election) === 'upcoming' ? 'Voting not started yet' :
//                          getElectionStatus(election) === 'completed' ? 'Voting has ended' :
//                          'Voting is not available for this election'}
//                       </div>
//                     )}
                    
//                     {election.is_draft && (
//                       <button
//                         onClick={handleEdit}
//                         className="px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                       >
//                         <PencilIcon className="h-5 w-5 mr-2 inline" />
//                         Edit Election
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </>
//         ) : (
//           <div className="flex items-center justify-center h-64">
//             <p className="text-gray-500">Failed to load election details</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ElectionDetailModal;
//this code is excellent but vote now and video redirecting 
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router';
// import { toast } from 'react-hot-toast';
// import {
//   XMarkIcon,
//   EyeIcon,
//   CurrencyDollarIcon,
//   CalendarIcon,
//   ClockIcon,
//   UserGroupIcon,
//   GiftIcon,
//   GlobeAltIcon,
//   ShieldCheckIcon,
//   CreditCardIcon,
//   LanguageIcon,
//   QuestionMarkCircleIcon,
//   PlayIcon,
//   PencilIcon,
//   MapPinIcon
// } from '@heroicons/react/24/outline';

// const ElectionDetailModal = ({ isOpen, onClose, electionId }) => {
//   const navigate = useNavigate();
//   const [election, setElection] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (isOpen && electionId) {
//       fetchElectionDetails();
//     }
//   }, [isOpen, electionId]);

//   const fetchElectionDetails = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`http://localhost:3004/api/elections/${electionId}`);
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const result = await response.json();
      
//       if (result.success) {
//         setElection(result.data);
//       } else {
//         throw new Error(result.message || 'Failed to fetch election details');
//       }
//     } catch (error) {
//       console.error('Error fetching election details:', error);
//       toast.error('Failed to load election details');
//       onClose();
//     } finally {
//       setLoading(false);
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
//       <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
//         {config.text}
//       </span>
//     );
//   };

//   const getPricingBadge = (election) => {
//     if (election.pricing_type === 'free') {
//       return (
//         <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
//           Free
//         </span>
//       );
//     } else if (election.pricing_type === 'regional') {
//       return (
//         <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
//           Regional Pricing
//         </span>
//       );
//     } else {
//       return (
//         <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
//           Paid
//         </span>
//       );
//     }
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const formatTime = (timeString) => {
//     if (!timeString) return '';
//     const [hours, minutes] = timeString.split(':');
//     const hour24 = parseInt(hours);
//     const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
//     const ampm = hour24 >= 12 ? 'PM' : 'AM';
//     return `${hour12}:${minutes} ${ampm}`;
//   };

//   const canUserVote = (election) => {
//     const status = getElectionStatus(election);
//     return status === 'active';
//   };

//   const handleVoteAction = () => {
//     if (election.pricing_type === 'free') {
//       navigate(`/vote/${election.id}`);
//     } else {
//       navigate(`/payment/${election.id}`);
//     }
//     onClose();
//   };

//   const handleEdit = () => {
//     navigate(`/elections-2/${election.id}/edit`);
//     onClose();
//   };

//   const getRegionalPricingDisplay = (regionalFees) => {
//     if (!regionalFees) return null;
    
//     const regionNames = {
//       region1: 'Region 1',
//       region2: 'Region 2', 
//       region3: 'Region 3',
//       region4: 'Region 4',
//       region5: 'Region 5',
//       region6: 'Region 6',
//       region7: 'Region 7',
//       region8: 'Region 8'
//     };

//     return Object.entries(regionalFees).map(([region, price]) => ({
//       region: regionNames[region] || region,
//       price: parseFloat(price)
//     }));
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
//       <div className="relative top-4 mx-auto p-0 border w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 shadow-lg rounded-lg bg-white max-h-[95vh] overflow-hidden">
//         {loading ? (
//           <div className="flex items-center justify-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//           </div>
//         ) : election ? (
//           <>
//             {/* Modal Header */}
//             <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
//               <h2 className="text-2xl font-bold text-gray-900 truncate">
//                 {election.title}
//               </h2>
//               <button
//                 onClick={onClose}
//                 className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
//               >
//                 <XMarkIcon className="h-6 w-6" />
//               </button>
//             </div>

//             {/* Modal Content */}
//             <div className="overflow-y-auto max-h-[calc(95vh-80px)]">
//               {/* Hero Image */}
//               {election.topic_image_url && (
//                 <div className="h-64 bg-gray-200 relative">
//                   <img
//                     src={election.topic_image_url}
//                     alt={election.title}
//                     className="w-full h-full object-cover"
//                   />
//                   {election.logo_branding_url && (
//                     <div className="absolute top-4 left-4">
//                       <img
//                         src={election.logo_branding_url}
//                         alt="Logo"
//                         className="h-16 w-16 object-contain bg-white rounded-lg p-2 shadow-md"
//                       />
//                     </div>
//                   )}
//                 </div>
//               )}

//               <div className="p-6 space-y-6">
//                 {/* Status and Pricing */}
//                 <div className="flex flex-wrap items-center gap-3">
//                   {getStatusBadge(election)}
//                   {getPricingBadge(election)}
//                   {election.is_lotterized && (
//                     <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
//                       <GiftIcon className="h-4 w-4 mr-1" />
//                       Lottery
//                     </span>
//                   )}
//                   {election.biometric_required && (
//                     <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
//                       <ShieldCheckIcon className="h-4 w-4 mr-1" />
//                       Biometric Required
//                     </span>
//                   )}
//                   {election.custom_voting_url && (
//                     <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
//                       Custom URL: {election.custom_voting_url}
//                     </span>
//                   )}
//                 </div>

//                 {/* Description */}
//                 {election.description && (
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
//                     <p className="text-gray-700 leading-relaxed">{election.description}</p>
//                   </div>
//                 )}

//                 {/* Video */}
//                 {election.topic_video_url && (
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
//                       <PlayIcon className="h-5 w-5 mr-2" />
//                       Topic Video
//                     </h3>
//                     <a
//                       href={election.topic_video_url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
//                     >
//                       <PlayIcon className="h-4 w-4 mr-2" />
//                       Watch Video
//                     </a>
//                   </div>
//                 )}

//                 {/* Election Details Grid */}
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                   {/* Timing Information */}
//                   <div className="space-y-4">
//                     <h3 className="text-lg font-semibold text-gray-900">Schedule & Timing</h3>
//                     <div className="space-y-3">
//                       <div className="flex items-start gap-3">
//                         <CalendarIcon className="h-5 w-5 text-green-600 mt-0.5" />
//                         <div>
//                           <p className="font-medium text-gray-900">Start</p>
//                           <p className="text-gray-600">{formatDate(election.start_date)}</p>
//                           <p className="text-gray-500 text-sm">{formatTime(election.start_time)}</p>
//                         </div>
//                       </div>
//                       <div className="flex items-start gap-3">
//                         <ClockIcon className="h-5 w-5 text-red-600 mt-0.5" />
//                         <div>
//                           <p className="font-medium text-gray-900">End</p>
//                           <p className="text-gray-600">{formatDate(election.end_date)}</p>
//                           <p className="text-gray-500 text-sm">{formatTime(election.end_time)}</p>
//                         </div>
//                       </div>
//                       <div className="flex items-start gap-3">
//                         <GlobeAltIcon className="h-5 w-5 text-blue-600 mt-0.5" />
//                         <div>
//                           <p className="font-medium text-gray-900">Timezone</p>
//                           <p className="text-gray-600">{election.timezone || 'UTC'}</p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Voting Configuration */}
//                   <div className="space-y-4">
//                     <h3 className="text-lg font-semibold text-gray-900">Voting Configuration</h3>
//                     <div className="space-y-3">
//                       <div>
//                         <p className="font-medium text-gray-900">Voting Type</p>
//                         <p className="text-gray-600 capitalize">{election.voting_type?.replace('_', ' ')}</p>
//                       </div>
//                       <div>
//                         <p className="font-medium text-gray-900">Permission to Vote</p>
//                         <p className="text-gray-600 capitalize">{election.permission_to_vote?.replace('_', ' ')}</p>
//                       </div>
//                       <div>
//                         <p className="font-medium text-gray-900">Authentication Method</p>
//                         <p className="text-gray-600 capitalize">{election.auth_method}</p>
//                       </div>
//                       <div>
//                         <p className="font-medium text-gray-900">Additional Auth Options</p>
//                         <div className="text-sm text-gray-600 space-y-1">
//                           {election.allow_oauth && <p>✓ OAuth Allowed</p>}
//                           {election.allow_magic_link && <p>✓ Magic Link Allowed</p>}
//                           {election.allow_email_password && <p>✓ Email/Password Allowed</p>}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Countries */}
//                 {election.countries && election.countries.length > 0 && (
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
//                       <MapPinIcon className="h-5 w-5 mr-2" />
//                       Eligible Countries ({election.countries.length})
//                     </h3>
//                     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
//                       {election.countries.map((country, index) => (
//                         <div key={index} className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
//                           <span className="text-lg">{country.flag}</span>
//                           <span className="text-sm font-medium text-gray-700">{country.name}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Regional Pricing */}
//                 {election.pricing_type === 'regional' && election.regional_fees && (
//                   <div className="bg-blue-50 rounded-lg p-4">
//                     <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
//                       <CurrencyDollarIcon className="h-5 w-5 mr-2" />
//                       Regional Pricing
//                     </h3>
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//                       {getRegionalPricingDisplay(election.regional_fees)?.map((item, index) => (
//                         <div key={index} className="bg-white p-3 rounded-md border">
//                           <p className="font-medium text-blue-900">{item.region}</p>
//                           <p className="text-blue-700">${item.price.toFixed(2)}</p>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Pricing Information */}
//                 {(election.pricing_type !== 'free' && election.pricing_type !== 'regional') && (
//                   <div className="bg-orange-50 rounded-lg p-4">
//                     <h3 className="text-lg font-semibold text-orange-900 mb-3 flex items-center">
//                       <CurrencyDollarIcon className="h-5 w-5 mr-2" />
//                       Pricing Information
//                     </h3>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <p className="font-medium text-orange-900">Participation Fee</p>
//                         <p className="text-orange-700">${election.participation_fee || 0}</p>
//                       </div>
//                       <div>
//                         <p className="font-medium text-orange-900">Processing Fee</p>
//                         <p className="text-orange-700">{election.processing_fee_percentage || 0}%</p>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Questions */}
//                 {election.questions && election.questions.length > 0 && (
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
//                       <QuestionMarkCircleIcon className="h-5 w-5 mr-2" />
//                       Election Questions ({election.questions.length})
//                     </h3>
//                     <div className="space-y-4">
//                       {election.questions.map((question, index) => (
//                         <div key={question.id || index} className="border rounded-lg p-4 bg-gray-50">
//                           <div className="flex items-start justify-between mb-2">
//                             <h4 className="font-medium text-gray-900">{question.questionText}</h4>
//                             <div className="flex gap-2">
//                               <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
//                                 {question.questionType?.replace('_', ' ').toUpperCase()}
//                               </span>
//                               {question.isRequired && (
//                                 <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
//                                   Required
//                                 </span>
//                               )}
//                             </div>
//                           </div>
//                           {question.answers && question.answers.length > 0 && (
//                             <div className="mt-3">
//                               <p className="text-sm font-medium text-gray-700 mb-2">Answer Options:</p>
//                               <div className="space-y-1">
//                                 {question.answers.map((answer, answerIndex) => (
//                                   <div key={answer.id || answerIndex} className="text-sm text-gray-600 pl-4">
//                                     • {answer.text}
//                                   </div>
//                                 ))}
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Lottery Information */}
//                 {election.is_lotterized && (
//                   <div className="bg-purple-50 rounded-lg p-4">
//                     <h3 className="text-lg font-semibold text-purple-900 mb-3 flex items-center">
//                       <GiftIcon className="h-5 w-5 mr-2" />
//                       Lottery Prize Details
//                     </h3>
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                       <div>
//                         <p className="font-medium text-purple-900">Prize Type</p>
//                         <p className="text-purple-700 capitalize">{election.reward_type}</p>
//                       </div>
//                       <div>
//                         <p className="font-medium text-purple-900">Prize Amount</p>
//                         <p className="text-purple-700">
//                           {election.reward_type === 'monetary' 
//                             ? `$${election.reward_amount}` 
//                             : election.non_monetary_reward || 'Non-monetary prize'}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="font-medium text-purple-900">Number of Winners</p>
//                         <p className="text-purple-700">{election.winner_count || 1}</p>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Election Settings */}
//                 <div className="bg-gray-50 rounded-lg p-4">
//                   <h3 className="text-lg font-semibold text-gray-900 mb-3">Election Settings</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//                     <div>
//                       <p className="font-medium text-gray-900">Live Results</p>
//                       <p className="text-gray-600">{election.show_live_results ? 'Enabled' : 'Disabled'}</p>
//                     </div>
//                     <div>
//                       <p className="font-medium text-gray-900">Vote Editing</p>
//                       <p className="text-gray-600">{election.allow_vote_editing ? 'Allowed' : 'Not Allowed'}</p>
//                     </div>
//                     <div>
//                       <p className="font-medium text-gray-900">Primary Language</p>
//                       <p className="text-gray-600">{election.primary_language?.toUpperCase() || 'EN'}</p>
//                     </div>
//                     <div>
//                       <p className="font-medium text-gray-900">Multi-language Support</p>
//                       <p className="text-gray-600">{election.supports_multilang ? 'Yes' : 'No'}</p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="border-t pt-6">
//                   <div className="flex flex-col sm:flex-row gap-3">
//                     {canUserVote(election) ? (
//                       <button
//                         onClick={handleVoteAction}
//                         className={`flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white ${
//                           election.pricing_type === 'free'
//                             ? 'bg-green-600 hover:bg-green-700'
//                             : 'bg-blue-600 hover:bg-blue-700'
//                         } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
//                       >
//                         {election.pricing_type === 'free' ? (
//                           <>
//                             <EyeIcon className="h-5 w-5 mr-2" />
//                             Vote Now (Free)
//                           </>
//                         ) : (
//                           <>
//                             <CurrencyDollarIcon className="h-5 w-5 mr-2" />
//                             Pay to Vote
//                           </>
//                         )}
//                       </button>
//                     ) : (
//                       <div className="flex-1 text-center py-3 text-gray-500">
//                         {getElectionStatus(election) === 'draft' ? 'Election is in draft mode' : 
//                          getElectionStatus(election) === 'upcoming' ? 'Voting not started yet' :
//                          getElectionStatus(election) === 'completed' ? 'Voting has ended' :
//                          'Voting is not available for this election'}
//                       </div>
//                     )}
                    
//                     {election.is_draft && (
//                       <button
//                         onClick={handleEdit}
//                         className="px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                       >
//                         <PencilIcon className="h-5 w-5 mr-2 inline" />
//                         Edit Election
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </>
//         ) : (
//           <div className="flex items-center justify-center h-64">
//             <p className="text-gray-500">Failed to load election details</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ElectionDetailModal;
//last workable codes
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router';
// import { toast } from 'react-hot-toast';
// import {
//   XMarkIcon,
//   EyeIcon,
//   CurrencyDollarIcon,
//   CalendarIcon,
//   ClockIcon,
//   UserGroupIcon,
//   GiftIcon,
//   GlobeAltIcon,
//   ShieldCheckIcon,
//   CreditCardIcon,
//   LanguageIcon
// } from '@heroicons/react/24/outline';

// const ElectionDetailModal = ({ isOpen, onClose, electionId }) => {
//   const navigate = useNavigate();
//   const [election, setElection] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (isOpen && electionId) {
//       fetchElectionDetails();
//     }
//   }, [isOpen, electionId]);

//   const fetchElectionDetails = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(`http://localhost:3004/api/elections/${electionId}`);
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const result = await response.json();
      
//       if (result.success) {
//         setElection(result.data);
//       } else {
//         throw new Error(result.message || 'Failed to fetch election details');
//       }
//     } catch (error) {
//       console.error('Error fetching election details:', error);
//       toast.error('Failed to load election details');
//       onClose();
//     } finally {
//       setLoading(false);
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
//       <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
//         {config.text}
//       </span>
//     );
//   };

//   const getPricingBadge = (election) => {
//     if (election.pricing_type === 'free') {
//       return (
//         <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
//           Free
//         </span>
//       );
//     } else if (election.pricing_type === 'regional') {
//       return (
//         <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
//           Regional Pricing
//         </span>
//       );
//     } else {
//       return (
//         <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
//           Paid
//         </span>
//       );
//     }
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const canUserVote = (election) => {
//     const status = getElectionStatus(election);
//     return status === 'active';
//   };

//   const handleVoteAction = () => {
//     if (election.pricing_type === 'free') {
//       navigate(`/vote/${election.id}`);
//     } else {
//       navigate(`/payment/${election.id}`);
//     }
//     onClose();
//   };

//   const handleEdit = () => {
//     navigate(`/elections-2/${election.id}/edit`);
//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
//       <div className="relative top-8 mx-auto p-0 border w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 shadow-lg rounded-lg bg-white max-h-[90vh] overflow-hidden">
//         {loading ? (
//           <div className="flex items-center justify-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//           </div>
//         ) : election ? (
//           <>
//             {/* Modal Header */}
//             <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
//               <h2 className="text-2xl font-bold text-gray-900 truncate">
//                 {election.title}
//               </h2>
//               <button
//                 onClick={onClose}
//                 className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
//               >
//                 <XMarkIcon className="h-6 w-6" />
//               </button>
//             </div>

//             {/* Modal Content */}
//             <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
//               {/* Hero Image */}
//               {election.topic_image_url && (
//                 <div className="h-64 bg-gray-200">
//                   <img
//                     src={election.topic_image_url}
//                     alt={election.title}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//               )}

//               <div className="p-6 space-y-6">
//                 {/* Status and Pricing */}
//                 <div className="flex flex-wrap items-center gap-3">
//                   {getStatusBadge(election)}
//                   {getPricingBadge(election)}
//                   {election.is_lotterized && (
//                     <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
//                       <GiftIcon className="h-4 w-4 mr-1" />
//                       Lottery
//                     </span>
//                   )}
//                   {election.biometric_required && (
//                     <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
//                       <ShieldCheckIcon className="h-4 w-4 mr-1" />
//                       Biometric Required
//                     </span>
//                   )}
//                 </div>

//                 {/* Description */}
//                 {election.description && (
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
//                     <p className="text-gray-700 leading-relaxed">{election.description}</p>
//                   </div>
//                 )}

//                 {/* Election Details Grid */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {/* Timing Information */}
//                   <div className="space-y-4">
//                     <h3 className="text-lg font-semibold text-gray-900">Timing</h3>
//                     <div className="space-y-3">
//                       <div className="flex items-start gap-3">
//                         <CalendarIcon className="h-5 w-5 text-green-600 mt-0.5" />
//                         <div>
//                           <p className="font-medium text-gray-900">Start Date</p>
//                           <p className="text-gray-600">{formatDate(election.start_date)}</p>
//                         </div>
//                       </div>
//                       <div className="flex items-start gap-3">
//                         <ClockIcon className="h-5 w-5 text-red-600 mt-0.5" />
//                         <div>
//                           <p className="font-medium text-gray-900">End Date</p>
//                           <p className="text-gray-600">{formatDate(election.end_date)}</p>
//                         </div>
//                       </div>
//                       <div className="flex items-start gap-3">
//                         <GlobeAltIcon className="h-5 w-5 text-blue-600 mt-0.5" />
//                         <div>
//                           <p className="font-medium text-gray-900">Timezone</p>
//                           <p className="text-gray-600">{election.timezone || 'UTC'}</p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Voting Configuration */}
//                   <div className="space-y-4">
//                     <h3 className="text-lg font-semibold text-gray-900">Voting Configuration</h3>
//                     <div className="space-y-3">
//                       <div>
//                         <p className="font-medium text-gray-900">Voting Type</p>
//                         <p className="text-gray-600 capitalize">{election.voting_type}</p>
//                       </div>
//                       <div>
//                         <p className="font-medium text-gray-900">Permission to Vote</p>
//                         <p className="text-gray-600 capitalize">{election.permission_to_vote?.replace('_', ' ')}</p>
//                       </div>
//                       <div>
//                         <p className="font-medium text-gray-900">Authentication Method</p>
//                         <p className="text-gray-600 capitalize">{election.auth_method}</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Countries */}
//                 {election.countries && election.countries.length > 0 && (
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900 mb-3">Available Countries</h3>
//                     <div className="flex items-center gap-2">
//                       <UserGroupIcon className="h-5 w-5 text-blue-600" />
//                       <span className="text-gray-600">{election.countries.length} countries eligible</span>
//                     </div>
//                   </div>
//                 )}

//                 {/* Lottery Information */}
//                 {election.is_lotterized && (
//                   <div className="bg-purple-50 rounded-lg p-4">
//                     <h3 className="text-lg font-semibold text-purple-900 mb-3 flex items-center">
//                       <GiftIcon className="h-5 w-5 mr-2" />
//                       Lottery Prize
//                     </h3>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <p className="font-medium text-purple-900">Prize Amount</p>
//                         <p className="text-purple-700">
//                           {election.reward_type === 'monetary' 
//                             ? `$${election.reward_amount}` 
//                             : election.non_monetary_reward || 'Non-monetary prize'}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="font-medium text-purple-900">Number of Winners</p>
//                         <p className="text-purple-700">{election.winner_count || 1}</p>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Pricing Information */}
//                 {election.pricing_type !== 'free' && (
//                   <div className="bg-orange-50 rounded-lg p-4">
//                     <h3 className="text-lg font-semibold text-orange-900 mb-3 flex items-center">
//                       <CurrencyDollarIcon className="h-5 w-5 mr-2" />
//                       Pricing Information
//                     </h3>
//                     <div>
//                       <p className="font-medium text-orange-900">Participation Fee</p>
//                       <p className="text-orange-700">${election.participation_fee || 0}</p>
//                     </div>
//                   </div>
//                 )}

//                 {/* Language Support */}
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900 mb-3">Language Support</h3>
//                   <div className="flex items-center gap-2">
//                     <LanguageIcon className="h-5 w-5 text-green-600" />
//                     <span className="text-gray-600">
//                       Primary: {election.primary_language || 'English'}
//                       {election.supports_multilang && ' • Multi-language support'}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="border-t pt-6">
//                   <div className="flex flex-col sm:flex-row gap-3">
//                     {canUserVote(election) ? (
//                       <button
//                         onClick={handleVoteAction}
//                         className={`flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white ${
//                           election.pricing_type === 'free'
//                             ? 'bg-green-600 hover:bg-green-700'
//                             : 'bg-blue-600 hover:bg-blue-700'
//                         } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
//                       >
//                         {election.pricing_type === 'free' ? (
//                           <>
//                             <EyeIcon className="h-5 w-5 mr-2" />
//                             Vote Now (Free)
//                           </>
//                         ) : (
//                           <>
//                             <CurrencyDollarIcon className="h-5 w-5 mr-2" />
//                             Pay & Vote (${election.participation_fee || 0})
//                           </>
//                         )}
//                       </button>
//                     ) : (
//                       <div className="flex-1 text-center py-3 text-gray-500">
//                         Voting is not available for this election
//                       </div>
//                     )}
                    
//                     {election.is_draft && (
//                       <button
//                         onClick={handleEdit}
//                         className="px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                       >
//                         Edit Election
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </>
//         ) : (
//           <div className="flex items-center justify-center h-64">
//             <p className="text-gray-500">Failed to load election details</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ElectionDetailModal;