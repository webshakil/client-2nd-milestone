import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-hot-toast';
import ElectionCreationWizard from '../../components/election-2/creation/ElectionCreationWizard';
import { useElectionCreation } from '../../hooks/election-2/useElectionCreation';
//import { electionAPI } from '../../services/election-2/electionAPI';
import LoadingScreen from '../../components/LoadingScreen';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import eeelllectionService from '../../services/election/EeellllectionService';
//import ElectionService from '../../services/election/ElectionService';
//ElectionService
const EditElection2 = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [election, setElection] = useState(null);
  const [canEdit, setCanEdit] = useState(false);

  const {
    electionData,
    updateElectionData,
  } = useElectionCreation();

  // Load election data
  useEffect(() => {
    if (id) {
      loadElectionData(id);
    }
  }, [id]);

  const loadElectionData = async (electionId) => {
    try {
      setLoading(true);
      const response = await eeelllectionService.getElection(electionId);
      
      if (response.success) {
        const electionData = response.data;
        setElection(electionData);
        
        // Check if election can be edited
        const editableStatuses = ['draft', 'scheduled'];
        const isEditable = editableStatuses.includes(electionData.status);
        setCanEdit(isEditable);

        if (!isEditable && electionData.status === 'active') {
          toast.info('Election is active. Only limited settings can be modified.');
        } else if (!isEditable) {
          toast.warning('This election cannot be edited in its current state.');
        }
        
        // Transform API data to form data
        const formData = transformElectionForForm(electionData);
        updateElectionData(formData, true); // Skip validation on initial load
      } else {
        toast.error('Failed to load election data');
        navigate('/elections-2');
      }
    } catch (error) {
      console.error('Error loading election:', error);
      toast.error('Failed to load election data');
      navigate('/elections-2');
    } finally {
      setLoading(false);
    }
  };

  const transformElectionForForm = (apiData) => {
    return {
      // Basic Information
      title: apiData.title || '',
      description: apiData.description || '',
      topicImageUrl: apiData.topic_image_url || '',
      topicVideoUrl: apiData.topic_video_url || '',
      logoBrandingUrl: apiData.logo_branding_url || '',
      
      // Scheduling
      startDate: apiData.start_date || '',
      startTime: apiData.start_time || '',
      endDate: apiData.end_date || '',
      endTime: apiData.end_time || '',
      timezone: apiData.timezone || 'UTC',
      
      // Voting Configuration
      votingType: apiData.voting_type || 'plurality',
      permissionToVote: apiData.permission_to_vote || 'world_citizens',
      isPaid: apiData.is_paid || false,
      participationFee: apiData.participation_fee || 0,
      
      // Country Selection
      isCountrySpecific: apiData.is_country_specific || false,
      countries: apiData.countries ? apiData.countries.map(c => c.id) : [],
      
      // Access Control
      biometricRequired: apiData.biometric_required || false,
      authMethod: apiData.auth_method || 'passkey',
      allowOauth: apiData.allow_oauth !== false,
      allowMagicLink: apiData.allow_magic_link !== false,
      allowEmailPassword: apiData.allow_email_password !== false,
      
      // Lottery Settings
      isLotterized: apiData.is_lotterized || false,
      rewardAmount: apiData.reward_amount || 0,
      winnerCount: apiData.winner_count || 1,
      
      // Results Control
      showLiveResults: apiData.show_live_results || false,
      allowVoteEditing: apiData.allow_vote_editing || false,
      
      // Branding
      customVotingUrl: apiData.custom_voting_url || '',
      customCss: apiData.custom_css || '',
      brandColors: apiData.brand_colors || {
        primary: '#3B82F6',
        secondary: '#64748B',
        accent: '#10B981'
      },
      
      // Multi-language
      primaryLanguage: apiData.primary_language || 'en',
      supportsMultilang: apiData.supports_multilang || false,
      
      // Questions
      questions: apiData.questions || []
    };
  };

  const transformFormForAPI = (formData) => {
    return {
      title: formData.title,
      description: formData.description,
      topicImageUrl: formData.topicImageUrl,
      topicVideoUrl: formData.topicVideoUrl,
      logoBrandingUrl: formData.logoBrandingUrl,
      startDate: formData.startDate,
      startTime: formData.startTime,
      endDate: formData.endDate,
      endTime: formData.endTime,
      timezone: formData.timezone,
      votingType: formData.votingType,
      permissionToVote: formData.permissionToVote,
      isPaid: formData.isPaid,
      participationFee: formData.participationFee,
      isCountrySpecific: formData.isCountrySpecific,
      countries: formData.countries,
      biometricRequired: formData.biometricRequired,
      authMethod: formData.authMethod,
      allowOauth: formData.allowOauth,
      allowMagicLink: formData.allowMagicLink,
      allowEmailPassword: formData.allowEmailPassword,
      isLotterized: formData.isLotterized,
      rewardAmount: formData.rewardAmount,
      winnerCount: formData.winnerCount,
      showLiveResults: formData.showLiveResults,
      allowVoteEditing: formData.allowVoteEditing,
      customVotingUrl: formData.customVotingUrl,
      customCss: formData.customCss,
      brandColors: formData.brandColors,
      primaryLanguage: formData.primaryLanguage,
      supportsMultilang: formData.supportsMultilang,
      questions: formData.questions
    };
  };

  const handleSave = async (formData, saveType = 'draft') => {
    try {
      const apiData = transformFormForAPI(formData);
      
      // For active elections, only allow certain fields to be updated
      if (election?.status === 'active') {
        const allowedFields = ['showLiveResults', 'allowVoteEditing', 'description'];
        const restrictedData = {};
        allowedFields.forEach(field => {
          if (apiData[field] !== undefined) {
            restrictedData[field] = apiData[field];
          }
        });
        /*eslint-disable*/
        apiData = restrictedData;
      }

      if (saveType === 'publish') {
        apiData.status = 'active';
      }

      const response = await ElectionService.updateElection(id, apiData);

      if (response.success) {
        const status = saveType === 'publish' ? 'published' : 'saved';
        toast.success(`Election updated and ${status} successfully!`);
        
        // Reload election data
        await loadElectionData(id);
      } else {
        toast.error(response.message || 'Failed to update election');
      }
    } catch (error) {
      console.error('Error updating election:', error);
      toast.error('Failed to update election');
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      navigate('/elections-2');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this election? This action cannot be undone.')) {
      try {
        const response = await ElectionService.deleteElection(id);
        if (response.success) {
          toast.success('Election deleted successfully');
          navigate('/elections-2');
        } else {
          toast.error('Failed to delete election');
        }
      } catch (error) {
        console.error('Error deleting election:', error);
        toast.error('Failed to delete election');
      }
    }
  };

  const handleClone = async () => {
    try {
      const newTitle = `${election.title} (Copy)`;
      const response = await ElectionService.cloneElection(id, newTitle);
      
      if (response.success) {
        toast.success('Election cloned successfully');
        navigate(`/elections-2/${response.data.id}/edit`);
      } else {
        toast.error('Failed to clone election');
      }
    } catch (error) {
      console.error('Error cloning election:', error);
      toast.error('Failed to clone election');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { color: 'bg-gray-100 text-gray-800', text: 'Draft' },
      active: { color: 'bg-green-100 text-green-800', text: 'Active' },
      completed: { color: 'bg-blue-100 text-blue-800', text: 'Completed' },
      cancelled: { color: 'bg-red-100 text-red-800', text: 'Cancelled' }
    };

    const config = statusConfig[status] || statusConfig.draft;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!election) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Election not found</h2>
          <p className="mt-2 text-gray-600">The election you're looking for doesn't exist or has been deleted.</p>
          <button
            onClick={() => navigate('/elections-2')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Elections
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/elections-2')}
                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-1" />
                Back to Elections
              </button>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Edit Election
                </h1>
                <div className="mt-2 flex items-center space-x-4">
                  <p className="text-sm text-gray-600">
                    Last updated: {new Date(election.updated_at).toLocaleDateString()}
                  </p>
                  {getStatusBadge(election.status)}
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={handleClone}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Clone Election
                </button>
                
                {canEdit && election.status === 'draft' && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                )}
                
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Editing Restrictions Notice */}
        {!canEdit && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Limited Editing Mode
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    {election.status === 'active' 
                      ? 'This election is currently active. Only live results and vote editing settings can be modified.'
                      : `This election is ${election.status} and cannot be edited. You can clone it to create a new version.`
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Election Creation Wizard */}
        <div className="bg-white shadow-lg rounded-lg">
          <ElectionCreationWizard
            initialData={electionData}
            onSave={handleSave}
            onCancel={handleCancel}
            isEditing={true}
            election={election}
            readOnly={!canEdit}
            limitedFields={election?.status === 'active' ? ['showLiveResults', 'allowVoteEditing', 'description'] : []}
          />
        </div>
      </div>
    </div>
  );
};

export default EditElection2;