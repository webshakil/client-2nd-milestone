
// //this code is 100% perfcet just to update context api i am adding above code
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-hot-toast';
import ElectionCreationWizard from '../../components/election-2/creation/ElectionCreationWizard';
import { useElectionCreation } from '../../hooks/election-2/useElectionCreation';
import LoadingScreen from '../../components/LoadingScreen';
import ElectionService from '../../services/election/electionService';

const CreateElection2 = () => {
  console.log('CreateElection2 component rendered');
  /*eslint-disable*/
 
  
  
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const renderCount = useRef(0);
  
  // Track renders to detect infinite loops
  renderCount.current += 1;
  console.log(`CreateElection2 render count: ${renderCount.current}`);
  
  // Add warning for excessive renders
  if (renderCount.current > 10) {
    console.warn('CreateElection2 has rendered more than 10 times - possible infinite loop detected');
  }

  const [loading, setLoading] = useState(isEditing);
  const [election, setElection] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  const {
    electionData,
    updateElectionData,
  } = useElectionCreation();

  console.log('Current state:', { loading, election, dataLoaded, isEditing, id });

  // Utility function to convert base64 to File objects
  const base64ToFile = (base64String, filename, mimeType) => {
    const base64Data = base64String.split(',')[1];
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    return new File([byteArray], filename, { type: mimeType });
  };

  // Load election data for editing - with safeguards
  useEffect(() => {
    console.log('useEffect triggered:', { isEditing, id, dataLoaded });
    
    if (isEditing && id && !dataLoaded) {
      console.log('Loading election for edit:', id);
      loadElectionForEdit(id);
    }
  }, [id, isEditing, dataLoaded]); // Added dataLoaded to dependencies

  const loadElectionForEdit = async (electionId) => {
    try {
      console.log('loadElectionForEdit called with ID:', electionId);
      setLoading(true);
      
      const response = await ElectionService.getElection(electionId);
      console.log('Election service response:', response);
      
      if (response.success) {
        setElection(response.data);
        
        // Transform API data to form data
        const formData = transformElectionForForm(response.data);
        console.log('Transformed form data:', formData);
        
        updateElectionData(formData);
        setDataLoaded(true); // Mark as loaded to prevent re-fetching
      } else {
        console.error('Failed to load election:', response);
        toast.error('Failed to load election data');
        navigate('/');
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
    const transformed = {
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
      brandColors: apiData.brand_colors || {},
      
      // Multi-language
      primaryLanguage: apiData.primary_language || 'en',
      supportsMultilang: apiData.supports_multilang || false,
      
      // Questions (if any)
      questions: []
    };
    
    console.log('Transformation complete:', transformed);
    return transformed;
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
      pricingType: formData.pricingType,
      regionalFees: formData.regionalFees,
      questions: formData.questions
    };
  };

  const handleSave = async (formData, saveType = 'draft', options = {}) => {
    try {
      console.log('handleSave called with:', { formData, saveType, options });
      
      let uploadedFiles = options.files || [];
      const filesToUpload = [];
      
      // Check for topic image
      if (formData.topicImageUrl && formData.topicImageUrl.startsWith('data:image/')) {
        const mimeType = formData.topicImageUrl.split(';')[0].split(':')[1];
        const extension = mimeType.split('/')[1];
        const topicImageFile = base64ToFile(
          formData.topicImageUrl, 
          `topic_image.${extension}`, 
          mimeType
        );
        filesToUpload.push({
          file: topicImageFile,
          fieldName: 'topicImage'
        });
        console.log('Topic image converted to file:', topicImageFile);
      }
      
      // Check for logo branding image
      if (formData.logoBrandingUrl && formData.logoBrandingUrl.startsWith('data:image/')) {
        const mimeType = formData.logoBrandingUrl.split(';')[0].split(':')[1];
        const extension = mimeType.split('/')[1];
        const logoFile = base64ToFile(
          formData.logoBrandingUrl, 
          `logo_branding.${extension}`, 
          mimeType
        );
        filesToUpload.push({
          file: logoFile,
          fieldName: 'logoBranding'
        });
        console.log('Logo image converted to file:', logoFile);
      }
      
      const allFiles = [...uploadedFiles, ...filesToUpload];
      console.log('All files to upload:', allFiles);
      
      const apiData = transformFormForAPI(formData);
      
      if (saveType === 'publish') {
        apiData.status = 'active';
        apiData.isPublished = true;
        apiData.isDraft = false;
      } else {
        apiData.isDraft = true;
        apiData.isPublished = false;
      }

      let response;
      if (isEditing && id) {
        console.log('Updating election with ID:', id);
        response = await ElectionService.updateElectionWithValidation(id, apiData, allFiles);
      } else {
        console.log('Creating new election');
        response = await ElectionService.createElectionWithValidation(apiData, allFiles);
      }

      console.log('API response:', response);

      if (response.success) {
        const action = isEditing ? 'updated' : 'created';
        const status = saveType === 'publish' ? 'published' : 'saved as draft';
        
        toast.success(`Election ${action} and ${status} successfully!`);
        
        setTimeout(() => {
          navigate('/elections-2');
        }, 1500);
      } else {
        toast.error(response.message || `Failed to ${isEditing ? 'update' : 'create'} election`);
      }
    } catch (error) {
      console.error('Error saving election:', error);
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} election. ${error.message}`);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      navigate('/elections-2');
    }
  };

  // Add timeout to detect if loading never resolves
  useEffect(() => {
    if (loading) {
      const timeout = setTimeout(() => {
        console.warn('Loading state has been true for more than 10 seconds');
        setLoading(false);
      }, 10000);
      
      return () => clearTimeout(timeout);
    }
  }, [loading]);

  if (loading) {
    console.log('Rendering LoadingScreen');
    return <LoadingScreen />;
  }

  console.log('Rendering main component');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isEditing ? 'Edit Election' : 'Create New Election'}
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                {isEditing 
                  ? 'Modify your election settings and configuration'
                  : 'Set up your voting election with customizable options'
                }
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
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

        {/* Election Creation Wizard */}
        <div className="bg-white shadow-lg rounded-lg">
          <ElectionCreationWizard
            initialData={electionData}
            onSave={handleSave}
            onCancel={handleCancel}
            isEditing={isEditing}
            election={election}
          />
        </div>
      </div>
     
    </div>
  );
};

export default CreateElection2;
//last successfull code
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router';
// import { toast } from 'react-hot-toast';
// import ElectionCreationWizard from '../../components/election-2/creation/ElectionCreationWizard';
// import { useElectionCreation } from '../../hooks/election-2/useElectionCreation';
// import LoadingScreen from '../../components/LoadingScreen';
// import ElectionService from '../../services/election/electionService';

// const CreateElection2 = () => {
  
//   const navigate = useNavigate();
//   const { id } = useParams(); // For editing existing election
//   const isEditing = Boolean(id);

//   const [loading, setLoading] = useState(isEditing);
//   const [election, setElection] = useState(null);

//   const {
//     electionData,
//     updateElectionData,
   
//   } = useElectionCreation();

//   // Utility function to convert base64 to File objects
//   const base64ToFile = (base64String, filename, mimeType) => {
//     const base64Data = base64String.split(',')[1]; // Remove data:image/png;base64, part
//     const byteCharacters = atob(base64Data);
//     const byteNumbers = new Array(byteCharacters.length);
    
//     for (let i = 0; i < byteCharacters.length; i++) {
//       byteNumbers[i] = byteCharacters.charCodeAt(i);
//     }
    
//     const byteArray = new Uint8Array(byteNumbers);
//     return new File([byteArray], filename, { type: mimeType });
//   };

//   // Load election data for editing
//   useEffect(() => {
//     if (isEditing && id) {
//       loadElectionForEdit(id);
//     }
//   }, [id, isEditing]);

//   const loadElectionForEdit = async (electionId) => {
//     try {
//       setLoading(true);
//       const response = await ElectionService.getElection(electionId);
      
//       if (response.success) {
//         setElection(response.data);
        
//         // Transform API data to form data
//         const formData = transformElectionForForm(response.data);
//         updateElectionData(formData);
//       } else {
//         toast.error('Failed to load election data');
//         // navigate('/elections-2');
//         navigate('/');
//       }
//     } catch (error) {
//       console.error('Error loading election:', error);
//       toast.error('Failed to load election data');
//       navigate('/elections-2');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const transformElectionForForm = (apiData) => {
//     return {
//       // Basic Information
//       title: apiData.title || '',
//       description: apiData.description || '',
//       topicImageUrl: apiData.topic_image_url || '',
//       topicVideoUrl: apiData.topic_video_url || '',
//       logoBrandingUrl: apiData.logo_branding_url || '',
      
//       // Scheduling
//       startDate: apiData.start_date || '',
//       startTime: apiData.start_time || '',
//       endDate: apiData.end_date || '',
//       endTime: apiData.end_time || '',
//       timezone: apiData.timezone || 'UTC',
      
//       // Voting Configuration
//       votingType: apiData.voting_type || 'plurality',
//       permissionToVote: apiData.permission_to_vote || 'world_citizens',
//       isPaid: apiData.is_paid || false,
//       participationFee: apiData.participation_fee || 0,
      
//       // Country Selection
//       isCountrySpecific: apiData.is_country_specific || false,
//       countries: apiData.countries ? apiData.countries.map(c => c.id) : [],
      
//       // Access Control
//       biometricRequired: apiData.biometric_required || false,
//       authMethod: apiData.auth_method || 'passkey',
//       allowOauth: apiData.allow_oauth !== false,
//       allowMagicLink: apiData.allow_magic_link !== false,
//       allowEmailPassword: apiData.allow_email_password !== false,
      
//       // Lottery Settings
//       isLotterized: apiData.is_lotterized || false,
//       rewardAmount: apiData.reward_amount || 0,
//       winnerCount: apiData.winner_count || 1,
      
//       // Results Control
//       showLiveResults: apiData.show_live_results || false,
//       allowVoteEditing: apiData.allow_vote_editing || false,
      
//       // Branding
//       customVotingUrl: apiData.custom_voting_url || '',
//       customCss: apiData.custom_css || '',
//       brandColors: apiData.brand_colors || {},
      
//       // Multi-language
//       primaryLanguage: apiData.primary_language || 'en',
//       supportsMultilang: apiData.supports_multilang || false,
      
//       // Questions (if any)
//       questions: []
//     };
//   };

//   const transformFormForAPI = (formData) => {
//     return {
//       title: formData.title,
//       description: formData.description,
//       topicImageUrl: formData.topicImageUrl,
//       topicVideoUrl: formData.topicVideoUrl,
//       logoBrandingUrl: formData.logoBrandingUrl,
//       startDate: formData.startDate,
//       startTime: formData.startTime,
//       endDate: formData.endDate,
//       endTime: formData.endTime,
//       timezone: formData.timezone,
//       votingType: formData.votingType,
//       permissionToVote: formData.permissionToVote,
//       isPaid: formData.isPaid,
//       participationFee: formData.participationFee,
//       isCountrySpecific: formData.isCountrySpecific,
//       countries: formData.countries,
//       biometricRequired: formData.biometricRequired,
//       authMethod: formData.authMethod,
//       allowOauth: formData.allowOauth,
//       allowMagicLink: formData.allowMagicLink,
//       allowEmailPassword: formData.allowEmailPassword,
//       isLotterized: formData.isLotterized,
//       rewardAmount: formData.rewardAmount,
//       winnerCount: formData.winnerCount,
//       showLiveResults: formData.showLiveResults,
//       allowVoteEditing: formData.allowVoteEditing,
//       customVotingUrl: formData.customVotingUrl,
//       customCss: formData.customCss,
//       brandColors: formData.brandColors,
//       primaryLanguage: formData.primaryLanguage,
//       supportsMultilang: formData.supportsMultilang,
      
//       // Add the missing fields that were causing issues
//       pricingType: formData.pricingType,
//       regionalFees: formData.regionalFees,
//       questions: formData.questions
//     };
//   };

//   // Updated handleSave function with image conversion
//   const handleSave = async (formData, saveType = 'draft', options = {}) => {
//     try {
//       console.log('handleSave called with:', { formData, saveType, options });
      
//       // Get uploaded files from options
//       let uploadedFiles = options.files || [];
      
//       // Convert base64 images to File objects if they exist
//       const filesToUpload = [];
      
//       // Check for topic image
//       if (formData.topicImageUrl && formData.topicImageUrl.startsWith('data:image/')) {
//         const mimeType = formData.topicImageUrl.split(';')[0].split(':')[1]; // Extract mime type
//         const extension = mimeType.split('/')[1]; // Get file extension
//         const topicImageFile = base64ToFile(
//           formData.topicImageUrl, 
//           `topic_image.${extension}`, 
//           mimeType
//         );
//         filesToUpload.push({
//           file: topicImageFile,
//           fieldName: 'topicImage'
//         });
//         console.log('Topic image converted to file:', topicImageFile);
//       }
      
//       // Check for logo branding image
//       if (formData.logoBrandingUrl && formData.logoBrandingUrl.startsWith('data:image/')) {
//         const mimeType = formData.logoBrandingUrl.split(';')[0].split(':')[1]; // Extract mime type
//         const extension = mimeType.split('/')[1]; // Get file extension
//         const logoFile = base64ToFile(
//           formData.logoBrandingUrl, 
//           `logo_branding.${extension}`, 
//           mimeType
//         );
//         filesToUpload.push({
//           file: logoFile,
//           fieldName: 'logoBranding'
//         });
//         console.log('Logo image converted to file:', logoFile);
//       }
      
//       // Combine with any existing uploaded files
//       const allFiles = [...uploadedFiles, ...filesToUpload];
      
//       console.log('All files to upload:', allFiles);
      
//       // Transform form data for API
//       const apiData = transformFormForAPI(formData);
      
//       // Set draft/publish status
//       if (saveType === 'publish') {
//         apiData.status = 'active';
//         apiData.isPublished = true;
//         apiData.isDraft = false;
//       } else {
//         apiData.isDraft = true;
//         apiData.isPublished = false;
//       }

//       let response;
//       if (isEditing && id) {
//         // Update existing election using service
//         response = await ElectionService.updateElectionWithValidation(id, apiData, allFiles);
//       } else {
//         // Create new election using service
//         response = await ElectionService.createElectionWithValidation(apiData, allFiles);
//       }

//       if (response.success) {
//         const action = isEditing ? 'updated' : 'created';
//         const status = saveType === 'publish' ? 'published' : 'saved as draft';
        
//         toast.success(`Election ${action} and ${status} successfully!`);
        
//         // Navigate to election list or details after a short delay
//         setTimeout(() => {
//           navigate('/elections-2');
//         }, 1500);
//       } else {
//         toast.error(response.message || `Failed to ${isEditing ? 'update' : 'create'} election`);
//       }
//     } catch (error) {
//       console.error('Error saving election:', error);
//       toast.error(`Failed to ${isEditing ? 'update' : 'create'} election. ${error.message}`);
//     }
//   };

//   const handleCancel = () => {
//     if (window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
//       navigate('/elections-2');
//     }
//   };

//   if (loading) {
//     return <LoadingScreen />;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">
//                 {isEditing ? 'Edit Election' : 'Create New Election'}
//               </h1>
//               <p className="mt-2 text-sm text-gray-600">
//                 {isEditing 
//                   ? 'Modify your election settings and configuration'
//                   : 'Set up your voting election with customizable options'
//                 }
//               </p>
//             </div>
            
//             <div className="flex items-center space-x-3">
//               <button
//                 type="button"
//                 onClick={handleCancel}
//                 className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Election Creation Wizard */}
//         <div className="bg-white shadow-lg rounded-lg">
//           <ElectionCreationWizard
//             initialData={electionData}
//             onSave={handleSave}
//             onCancel={handleCancel}
//             isEditing={isEditing}
//             election={election}
//           />
//         </div>
//       </div>
     
//     </div>
//   );
// };

// export default CreateElection2;
//this code is working excellent without images
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router';
// import { toast } from 'react-hot-toast';
// import ElectionCreationWizard from '../../components/election-2/creation/ElectionCreationWizard';
// import { useElectionCreation } from '../../hooks/election-2/useElectionCreation';
// import LoadingScreen from '../../components/LoadingScreen';
// import ElectionService from '../../services/election/electionService';


// const CreateElection2 = () => {
  
//   const navigate = useNavigate();
//   const { id } = useParams(); // For editing existing election
//   const isEditing = Boolean(id);

//   const [loading, setLoading] = useState(isEditing);
//   const [election, setElection] = useState(null);

//   const {
//     electionData,
//     updateElectionData,
   
//   } = useElectionCreation();

//   // Load election data for editing
//   useEffect(() => {
//     if (isEditing && id) {
//       loadElectionForEdit(id);
//     }
//   }, [id, isEditing]);

//   const loadElectionForEdit = async (electionId) => {
//     try {
//       setLoading(true);
//       const response = await ElectionService.getElection(electionId);
      
//       if (response.success) {
//         setElection(response.data);
        
//         // Transform API data to form data
//         const formData = transformElectionForForm(response.data);
//         updateElectionData(formData);
//       } else {
//         toast.error('Failed to load election data');
//         navigate('/elections-2');
//       }
//     } catch (error) {
//       console.error('Error loading election:', error);
//       toast.error('Failed to load election data');
//       navigate('/elections-2');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const transformElectionForForm = (apiData) => {
//     return {
//       // Basic Information
//       title: apiData.title || '',
//       description: apiData.description || '',
//       topicImageUrl: apiData.topic_image_url || '',
//       topicVideoUrl: apiData.topic_video_url || '',
//       logoBrandingUrl: apiData.logo_branding_url || '',
      
//       // Scheduling
//       startDate: apiData.start_date || '',
//       startTime: apiData.start_time || '',
//       endDate: apiData.end_date || '',
//       endTime: apiData.end_time || '',
//       timezone: apiData.timezone || 'UTC',
      
//       // Voting Configuration
//       votingType: apiData.voting_type || 'plurality',
//       permissionToVote: apiData.permission_to_vote || 'world_citizens',
//       isPaid: apiData.is_paid || false,
//       participationFee: apiData.participation_fee || 0,
      
//       // Country Selection
//       isCountrySpecific: apiData.is_country_specific || false,
//       countries: apiData.countries ? apiData.countries.map(c => c.id) : [],
      
//       // Access Control
//       biometricRequired: apiData.biometric_required || false,
//       authMethod: apiData.auth_method || 'passkey',
//       allowOauth: apiData.allow_oauth !== false,
//       allowMagicLink: apiData.allow_magic_link !== false,
//       allowEmailPassword: apiData.allow_email_password !== false,
      
//       // Lottery Settings
//       isLotterized: apiData.is_lotterized || false,
//       rewardAmount: apiData.reward_amount || 0,
//       winnerCount: apiData.winner_count || 1,
      
//       // Results Control
//       showLiveResults: apiData.show_live_results || false,
//       allowVoteEditing: apiData.allow_vote_editing || false,
      
//       // Branding
//       customVotingUrl: apiData.custom_voting_url || '',
//       customCss: apiData.custom_css || '',
//       brandColors: apiData.brand_colors || {},
      
//       // Multi-language
//       primaryLanguage: apiData.primary_language || 'en',
//       supportsMultilang: apiData.supports_multilang || false,
      
//       // Questions (if any)
//       questions: []
//     };
//   };

//   const transformFormForAPI = (formData) => {
//     return {
//       title: formData.title,
//       description: formData.description,
//       questions: formData.questions,
//       topicImageUrl: formData.topicImageUrl,
//       topicVideoUrl: formData.topicVideoUrl,
//       logoBrandingUrl: formData.logoBrandingUrl,
//       startDate: formData.startDate,
//       startTime: formData.startTime,
//       endDate: formData.endDate,
//       endTime: formData.endTime,
//       timezone: formData.timezone,
//       votingType: formData.votingType,
//       permissionToVote: formData.permissionToVote,
//       pricingType: formData.pricingType,
//       regionalFees: formData.regionalFees,
//       isPaid: formData.isPaid,
//       participationFee: formData.participationFee,
//       isCountrySpecific: formData.isCountrySpecific,
//       countries: formData.countries,
//       biometricRequired: formData.biometricRequired,
//       authMethod: formData.authMethod,
//       allowOauth: formData.allowOauth,
//       allowMagicLink: formData.allowMagicLink,
//       allowEmailPassword: formData.allowEmailPassword,
//       isLotterized: formData.isLotterized,
//       rewardAmount: formData.rewardAmount,
//       winnerCount: formData.winnerCount,
//       showLiveResults: formData.showLiveResults,
//       allowVoteEditing: formData.allowVoteEditing,
//       customVotingUrl: formData.customVotingUrl,
//       customCss: formData.customCss,
//       brandColors: formData.brandColors,
//       primaryLanguage: formData.primaryLanguage,
//       supportsMultilang: formData.supportsMultilang
//     };
//   };

//   // Updated handleSave function using ElectionService with file handling
//   const handleSave = async (formData, saveType = 'draft', options = {}) => {
//     try {
//       console.log('handleSave called with:', { formData, saveType, options });
      
//       // Get uploaded files from options
//       const uploadedFiles = options.files || [];
//       console.log('Files to upload:', uploadedFiles);
      
//       // Transform form data for API
//       const apiData = transformFormForAPI(formData);
      
//       // Set draft/publish status
//       if (saveType === 'publish') {
//         apiData.status = 'active';
//         apiData.isPublished = true;
//         apiData.isDraft = false;
//       } else {
//         apiData.isDraft = true;
//         apiData.isPublished = false;
//       }

//       let response;
//       if (isEditing && id) {
//         // Update existing election using service
//         response = await ElectionService.updateElectionWithValidation(id, apiData, uploadedFiles);
//       } else {
//         // Create new election using service
//         response = await ElectionService.createElectionWithValidation(apiData, uploadedFiles);
//       }

//       if (response.success) {
//         const action = isEditing ? 'updated' : 'created';
//         const status = saveType === 'publish' ? 'published' : 'saved as draft';
        
//         toast.success(`Election ${action} and ${status} successfully!`);
        
//         // Navigate to election list or details after a short delay
//         setTimeout(() => {
//           navigate('/elections-2');
//         }, 1500);
//       } else {
//         toast.error(response.message || `Failed to ${isEditing ? 'update' : 'create'} election`);
//       }
//     } catch (error) {
//       console.error('Error saving election:', error);
//       toast.error(`Failed to ${isEditing ? 'update' : 'create'} election. ${error.message}`);
//     }
//   };

//   const handleCancel = () => {
//     if (window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
//       navigate('/elections-2');
//     }
//   };

//   if (loading) {
//     return <LoadingScreen />;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">
//                 {isEditing ? 'Edit Election' : 'Create New Election'}
//               </h1>
//               <p className="mt-2 text-sm text-gray-600">
//                 {isEditing 
//                   ? 'Modify your election settings and configuration'
//                   : 'Set up your voting election with customizable options'
//                 }
//               </p>
//             </div>
            
//             <div className="flex items-center space-x-3">
//               <button
//                 type="button"
//                 onClick={handleCancel}
//                 className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Election Creation Wizard */}
//         <div className="bg-white shadow-lg rounded-lg">
//           <ElectionCreationWizard
//             initialData={electionData}
//             onSave={handleSave}
//             onCancel={handleCancel}
//             isEditing={isEditing}
//             election={election}
//           />
//         </div>
//       </div>
     
//     </div>
//   );
// };

// export default CreateElection2;
//this save file successfully to database without image and videos
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router';
// import { toast } from 'react-hot-toast';
// import ElectionCreationWizard from '../../components/election-2/creation/ElectionCreationWizard';
// import { useElectionCreation } from '../../hooks/election-2/useElectionCreation';
// import LoadingScreen from '../../components/LoadingScreen';
// // Remove ElectionService import - using direct API calls now
// // import ElectionService from '../../services/election/EeellllectionService';

// const CreateElection2 = () => {
  
//   const navigate = useNavigate();
//   const { id } = useParams(); // For editing existing election
//   const isEditing = Boolean(id);

//   const [loading, setLoading] = useState(isEditing);
//   const [election, setElection] = useState(null);

//   const {
//     electionData,
//     updateElectionData,
   
//   } = useElectionCreation();

//   // Direct API call functions
//   const createElectionDirect = async (electionData, files = null) => {
//     try {
//       console.log('Sending election data:', electionData);
      
//       const formData = new FormData();
      
//       // Add all election fields to formData
//       Object.keys(electionData).forEach(key => {
//         if (electionData[key] !== null && electionData[key] !== undefined) {
//           if (typeof electionData[key] === 'object' && !Array.isArray(electionData[key])) {
//             formData.append(key, JSON.stringify(electionData[key]));
//           } else if (Array.isArray(electionData[key])) {
//             formData.append(key, JSON.stringify(electionData[key]));
//           } else {
//             formData.append(key, electionData[key]);
//           }
//         }
//       });
      
//       // Add files if any
//       if (files && files.length > 0) {
//         /*eslint-disable*/
//         files.forEach((file, index) => {
//           formData.append('files', file);
//         });
//       }
      
//       const response = await fetch('http://localhost:3004/api/elections/create', {
//         method: 'POST',
//         body: formData,
//       });
      
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
//       }
      
//       const result = await response.json();
//       console.log('API Response:', result);
//       return result;
      
//     } catch (error) {
//       console.error('Create election error:', error);
//       throw error;
//     }
//   };

//   const updateElectionDirect = async (electionId, electionData, files = null) => {
//     try {
//       console.log('Updating election with ID:', electionId);
//       console.log('Sending election data:', electionData);
      
//       const formData = new FormData();
      
//       // Add all election fields to formData
//       Object.keys(electionData).forEach(key => {
//         if (electionData[key] !== null && electionData[key] !== undefined) {
//           if (typeof electionData[key] === 'object' && !Array.isArray(electionData[key])) {
//             formData.append(key, JSON.stringify(electionData[key]));
//           } else if (Array.isArray(electionData[key])) {
//             formData.append(key, JSON.stringify(electionData[key]));
//           } else {
//             formData.append(key, electionData[key]);
//           }
//         }
//       });
      
//       // Add files if any
//       if (files && files.length > 0) {
//         files.forEach((file, index) => {
//           formData.append('files', file);
//         });
//       }
      
//       const response = await fetch(`http://localhost:3004/api/elections/${electionId}`, {
//         method: 'PUT',
//         body: formData,
//       });
      
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
//       }
      
//       const result = await response.json();
//       console.log('API Response:', result);
//       return result;
      
//     } catch (error) {
//       console.error('Update election error:', error);
//       throw error;
//     }
//   };

//   // Helper function to prepare election data for API
//   const prepareElectionDataForAPI = (formData, saveType = 'draft') => {
//     // Get current user ID from localStorage
//     const getCurrentUserId = () => {
//       try {
//         const userData = localStorage.getItem('vottery_user_data');
//         if (userData) {
//           const user = JSON.parse(userData);
//           return user.id || null;
//         }
//       } catch (error) {
//         console.error('Error getting user ID:', error);
//       }
//       return null;
//     };

//     // Prepare clean data object matching backend field names
//     const cleanData = {
//       title: formData.title?.trim() || '',
//       description: formData.description?.trim() || '',
      
//       // Handle dates properly - extract just the date string, not the object
//       startDate: formData.startDate?.date ? 
//                  (formData.startDate.date.split('T')[0]) : // Extract YYYY-MM-DD from ISO string
//                  (formData.startDate || ''),
//       startTime: formData.startTime || formData.startDate?.time || '09:00',
//       endDate: formData.endDate?.date ? 
//                (formData.endDate.date.split('T')[0]) : // Extract YYYY-MM-DD from ISO string
//                (formData.endDate || ''),
//       endTime: formData.endTime || formData.endDate?.time || '18:00',
//       timezone: formData.timezone || 'UTC',
      
//       // Voting configuration - match backend field names
//       votingType: formData.votingType || 'plurality',
//       permissionToVote: formData.permissionToVote === 'everyone' ? 'open' : 
//                        formData.permissionToVote === 'country_specific' ? 'country_specific' : 'open',
//       pricingType: formData.pricingType || 'free',
//       isPaid: formData.pricingType !== 'free',
//       participationFee: formData.participationFee || 0,
//       regionalFees: formData.regionalFees || {},
      
//       // Country selection
//       countries: formData.countries || [],
//       isCountrySpecific: formData.permissionToVote === 'country_specific',
      
//       // Security settings - match backend field names
//       authMethod: 'passkey',
//       biometricRequired: formData.requiresBiometric || false,
//       allowOauth: true,
//       allowMagicLink: true,
//       allowEmailPassword: true,
      
//       // Lottery settings
//       isLotterized: formData.isLotterized || false,
//       rewardType: formData.rewardType === 'non-monetary' ? 'non_monetary' : (formData.rewardType || 'monetary'),
//       rewardAmount: formData.rewardAmount || 0,
//       nonMonetaryReward: formData.nonMonetaryReward || '',
//       projectedRevenue: formData.projectedRevenue || 0,
//       revenueSharePercentage: formData.revenueSharePercentage || 0,
//       winnerCount: formData.winnerCount || 1,
      
//       // Branding
//       customVotingUrl: formData.customVotingUrl || '',
//       primaryColor: formData.primaryColor || '#3B82F6',
//       brandColors: formData.brandColors || { primary: formData.primaryColor || '#3B82F6' },
//       primaryLanguage: 'en',
//       supportsMultilang: false,
//       customCss: formData.customCss || '',
      
//       // Additional backend fields
//       showLiveResults: true,
//       allowVoteEditing: true,
//       processingFeePercentage: 0,
      
//       // Status based on saveType
//       isDraft: saveType === 'draft',
//       isPublished: saveType === 'publish',
//       creatorId: getCurrentUserId()
//     };
    
//     // Only include non-empty values (except for boolean and number fields)
//     const finalData = {};
//     Object.keys(cleanData).forEach(key => {
//       const value = cleanData[key];
//       if (value !== null && value !== undefined) {
//         // Include boolean and number values even if they are 0 or false
//         if (typeof value === 'boolean' || typeof value === 'number' || 
//             (typeof value === 'string' && value !== '') || 
//             (Array.isArray(value)) || 
//             (typeof value === 'object' && value !== null)) {
//           finalData[key] = value;
//         }
//       }
//     });
    
//     return finalData;
//   };

//   // Load election data for editing (keeping existing functionality)
//   useEffect(() => {
//     if (isEditing && id) {
//       loadElectionForEdit(id);
//     }
//   }, [id, isEditing]);

//   const loadElectionForEdit = async (electionId) => {
//     try {
//       setLoading(true);
//       // For now, you can use a direct API call here too, or keep the existing service call
//       // Since this is just for loading data, not creating/updating
//       const response = await fetch(`http://localhost:3004/api/elections/${electionId}`);
      
//       if (response.ok) {
//         const result = await response.json();
//         if (result.success) {
//           setElection(result.data);
          
//           // Transform API data to form data
//           const formData = transformElectionForForm(result.data);
//           updateElectionData(formData);
//         } else {
//           toast.error('Failed to load election data');
//           navigate('/elections-2');
//         }
//       } else {
//         toast.error('Failed to load election data');
//         navigate('/elections-2');
//       }
//     } catch (error) {
//       console.error('Error loading election:', error);
//       toast.error('Failed to load election data');
//       navigate('/elections-2');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const transformElectionForForm = (apiData) => {
//     return {
//       // Basic Information
//       title: apiData.title || '',
//       description: apiData.description || '',
//       topicImageUrl: apiData.topic_image_url || '',
//       topicVideoUrl: apiData.topic_video_url || '',
//       logoBrandingUrl: apiData.logo_branding_url || '',
      
//       // Scheduling
//       startDate: apiData.start_date || '',
//       startTime: apiData.start_time || '',
//       endDate: apiData.end_date || '',
//       endTime: apiData.end_time || '',
//       timezone: apiData.timezone || 'UTC',
      
//       // Voting Configuration
//       votingType: apiData.voting_type || 'plurality',
//       permissionToVote: apiData.permission_to_vote || 'world_citizens',
//       isPaid: apiData.is_paid || false,
//       participationFee: apiData.participation_fee || 0,
      
//       // Country Selection
//       isCountrySpecific: apiData.is_country_specific || false,
//       countries: apiData.countries ? apiData.countries.map(c => c.id) : [],
      
//       // Access Control
//       biometricRequired: apiData.biometric_required || false,
//       authMethod: apiData.auth_method || 'passkey',
//       allowOauth: apiData.allow_oauth !== false,
//       allowMagicLink: apiData.allow_magic_link !== false,
//       allowEmailPassword: apiData.allow_email_password !== false,
      
//       // Lottery Settings
//       isLotterized: apiData.is_lotterized || false,
//       rewardAmount: apiData.reward_amount || 0,
//       winnerCount: apiData.winner_count || 1,
      
//       // Results Control
//       showLiveResults: apiData.show_live_results || false,
//       allowVoteEditing: apiData.allow_vote_editing || false,
      
//       // Branding
//       customVotingUrl: apiData.custom_voting_url || '',
//       customCss: apiData.custom_css || '',
//       brandColors: apiData.brand_colors || {},
      
//       // Multi-language
//       primaryLanguage: apiData.primary_language || 'en',
//       supportsMultilang: apiData.supports_multilang || false,
      
//       // Questions (if any)
//       questions: []
//     };
//   };
// /*eslint-disable*/
//   const transformFormForAPI = (formData) => {
//     return {
//       title: formData.title,
//       description: formData.description,
//       topicImageUrl: formData.topicImageUrl,
//       topicVideoUrl: formData.topicVideoUrl,
//       logoBrandingUrl: formData.logoBrandingUrl,
//       startDate: formData.startDate,
//       startTime: formData.startTime,
//       endDate: formData.endDate,
//       endTime: formData.endTime,
//       timezone: formData.timezone,
//       votingType: formData.votingType,
//       permissionToVote: formData.permissionToVote,
//       isPaid: formData.isPaid,
//       participationFee: formData.participationFee,
//       isCountrySpecific: formData.isCountrySpecific,
//       countries: formData.countries,
//       biometricRequired: formData.biometricRequired,
//       authMethod: formData.authMethod,
//       allowOauth: formData.allowOauth,
//       allowMagicLink: formData.allowMagicLink,
//       allowEmailPassword: formData.allowEmailPassword,
//       isLotterized: formData.isLotterized,
//       rewardAmount: formData.rewardAmount,
//       winnerCount: formData.winnerCount,
//       showLiveResults: formData.showLiveResults,
//       allowVoteEditing: formData.allowVoteEditing,
//       customVotingUrl: formData.customVotingUrl,
//       customCss: formData.customCss,
//       brandColors: formData.brandColors,
//       primaryLanguage: formData.primaryLanguage,
//       supportsMultilang: formData.supportsMultilang
//     };
//   };

//   // New handleSave function with direct API calls
//   const handleSave = async (formData, saveType = 'draft', options = {}) => {
//     try {
//       console.log('handleSave called with:', { formData, saveType, options });
      
//       // Prepare data for API using the comprehensive data preparation
//       const apiData = prepareElectionDataForAPI(formData, saveType);
      
//       console.log('Prepared API data:', apiData);
      
//       // Get any uploaded files from options
//       const uploadedFiles = options.files || [];
      
//       let response;
//       if (isEditing && id) {
//         // Update existing election
//         response = await updateElectionDirect(id, apiData, uploadedFiles);
//       } else {
//         // Create new election
//         response = await createElectionDirect(apiData, uploadedFiles);
//       }

//       if (response.success) {
//         const action = isEditing ? 'updated' : 'created';
//         const status = saveType === 'publish' ? 'published' : 'saved as draft';
        
//         toast.success(`Election ${action} and ${status} successfully!`);
        
//         // Navigate to election list or details after a short delay
//         setTimeout(() => {
//           navigate('/elections-2');
//         }, 1500);
//       } else {
//         toast.error(response.message || `Failed to ${isEditing ? 'update' : 'create'} election`);
//       }
//     } catch (error) {
//       console.error('Error saving election:', error);
//       toast.error(`Failed to ${isEditing ? 'update' : 'create'} election. ${error.message}`);
//     }
//   };

//   const handleCancel = () => {
//     if (window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
//       navigate('/elections-2');
//     }
//   };

//   if (loading) {
//     return <LoadingScreen />;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">
//                 {isEditing ? 'Edit Election' : 'Create New Election'}
//               </h1>
//               <p className="mt-2 text-sm text-gray-600">
//                 {isEditing 
//                   ? 'Modify your election settings and configuration'
//                   : 'Set up your voting election with customizable options'
//                 }
//               </p>
//             </div>
            
//             <div className="flex items-center space-x-3">
//               <button
//                 type="button"
//                 onClick={handleCancel}
//                 className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Election Creation Wizard */}
//         <div className="bg-white shadow-lg rounded-lg">
//           <ElectionCreationWizard
//             initialData={electionData}
//             onSave={handleSave}
//             onCancel={handleCancel}
//             isEditing={isEditing}
//             election={election}
//           />
//         </div>
//       </div>
     
//     </div>
//   );
// };

// export default CreateElection2;




//this is the last workable code
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router';
// import { toast } from 'react-hot-toast';
// import ElectionCreationWizard from '../../components/election-2/creation/ElectionCreationWizard';
// import { useElectionCreation } from '../../hooks/election-2/useElectionCreation';
// //import { electionAPI } from '../../services/election-2/electionAPI';
// import LoadingScreen from '../../components/LoadingScreen';
// //import ElectionService from '../../services/election/EeellllectionService';
// import ElectionService from '../../services/election/ElectionService';

// const CreateElection2 = () => {
  
//   const navigate = useNavigate();
//   const { id } = useParams(); // For editing existing election
//   const isEditing = Boolean(id);

//   const [loading, setLoading] = useState(isEditing);
//   const [election, setElection] = useState(null);

//   const {
//     electionData,
//     updateElectionData,
   
//   } = useElectionCreation();

//   // Load election data for editing
//   useEffect(() => {
//     if (isEditing && id) {
//       loadElectionForEdit(id);
//     }
//   }, [id, isEditing]);

//   const loadElectionForEdit = async (electionId) => {
//     try {
//       setLoading(true);
//       const response = await ElectionService.getElection(electionId);
      
//       if (response.success) {
//         setElection(response.data);
        
//         // Transform API data to form data
//         const formData = transformElectionForForm(response.data);
//         updateElectionData(formData);
//       } else {
//         toast.error('Failed to load election data');
//         navigate('/elections-2');
//       }
//     } catch (error) {
//       console.error('Error loading election:', error);
//       toast.error('Failed to load election data');
//       navigate('/elections-2');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const transformElectionForForm = (apiData) => {
//     return {
//       // Basic Information
//       title: apiData.title || '',
//       description: apiData.description || '',
//       topicImageUrl: apiData.topic_image_url || '',
//       topicVideoUrl: apiData.topic_video_url || '',
//       logoBrandingUrl: apiData.logo_branding_url || '',
      
//       // Scheduling
//       startDate: apiData.start_date || '',
//       startTime: apiData.start_time || '',
//       endDate: apiData.end_date || '',
//       endTime: apiData.end_time || '',
//       timezone: apiData.timezone || 'UTC',
      
//       // Voting Configuration
//       votingType: apiData.voting_type || 'plurality',
//       permissionToVote: apiData.permission_to_vote || 'world_citizens',
//       isPaid: apiData.is_paid || false,
//       participationFee: apiData.participation_fee || 0,
      
//       // Country Selection
//       isCountrySpecific: apiData.is_country_specific || false,
//       countries: apiData.countries ? apiData.countries.map(c => c.id) : [],
      
//       // Access Control
//       biometricRequired: apiData.biometric_required || false,
//       authMethod: apiData.auth_method || 'passkey',
//       allowOauth: apiData.allow_oauth !== false,
//       allowMagicLink: apiData.allow_magic_link !== false,
//       allowEmailPassword: apiData.allow_email_password !== false,
      
//       // Lottery Settings
//       isLotterized: apiData.is_lotterized || false,
//       rewardAmount: apiData.reward_amount || 0,
//       winnerCount: apiData.winner_count || 1,
      
//       // Results Control
//       showLiveResults: apiData.show_live_results || false,
//       allowVoteEditing: apiData.allow_vote_editing || false,
      
//       // Branding
//       customVotingUrl: apiData.custom_voting_url || '',
//       customCss: apiData.custom_css || '',
//       brandColors: apiData.brand_colors || {},
      
//       // Multi-language
//       primaryLanguage: apiData.primary_language || 'en',
//       supportsMultilang: apiData.supports_multilang || false,
      
//       // Questions (if any)
//       questions: []
//     };
//   };

//   const transformFormForAPI = (formData) => {
//     return {
//       title: formData.title,
//       description: formData.description,
//       topicImageUrl: formData.topicImageUrl,
//       topicVideoUrl: formData.topicVideoUrl,
//       logoBrandingUrl: formData.logoBrandingUrl,
//       startDate: formData.startDate,
//       startTime: formData.startTime,
//       endDate: formData.endDate,
//       endTime: formData.endTime,
//       timezone: formData.timezone,
//       votingType: formData.votingType,
//       permissionToVote: formData.permissionToVote,
//       isPaid: formData.isPaid,
//       participationFee: formData.participationFee,
//       isCountrySpecific: formData.isCountrySpecific,
//       countries: formData.countries,
//       biometricRequired: formData.biometricRequired,
//       authMethod: formData.authMethod,
//       allowOauth: formData.allowOauth,
//       allowMagicLink: formData.allowMagicLink,
//       allowEmailPassword: formData.allowEmailPassword,
//       isLotterized: formData.isLotterized,
//       rewardAmount: formData.rewardAmount,
//       winnerCount: formData.winnerCount,
//       showLiveResults: formData.showLiveResults,
//       allowVoteEditing: formData.allowVoteEditing,
//       customVotingUrl: formData.customVotingUrl,
//       customCss: formData.customCss,
//       brandColors: formData.brandColors,
//       primaryLanguage: formData.primaryLanguage,
//       supportsMultilang: formData.supportsMultilang
//     };
//   };

//   const handleSave = async (formData, saveType = 'draft') => {
//     try {
//       const apiData = transformFormForAPI(formData);
      
//       if (saveType === 'publish') {
//         apiData.status = 'active';
//       }

//       let response;
//       if (isEditing) {
//         response = await ElectionService.updateElection(id, apiData);
//       } else {
//         response = await ElectionService.createElection(apiData);
//       }

//       if (response.success) {
//         const action = isEditing ? 'updated' : 'created';
//         const status = saveType === 'publish' ? 'published' : 'saved as draft';
        
//         toast.success(`Election ${action} and ${status} successfully!`);
        
//         // Navigate to election list or details
//         navigate('/elections-2');
//       } else {
//         toast.error(response.message || `Failed to ${isEditing ? 'update' : 'create'} election`);
//       }
//     } catch (error) {
//       console.error('Error saving election:', error);
//       toast.error(`Failed to ${isEditing ? 'update' : 'create'} election`);
//     }
//   };

//   const handleCancel = () => {
//     if (window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
//       navigate('/elections-2');
//     }
//   };

//   if (loading) {
//     return <LoadingScreen />;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">
//                 {isEditing ? 'Edit Election' : 'Create New Election'}
//               </h1>
//               <p className="mt-2 text-sm text-gray-600">
//                 {isEditing 
//                   ? 'Modify your election settings and configuration'
//                   : 'Set up your voting election with customizable options'
//                 }
//               </p>
//             </div>
            
//             <div className="flex items-center space-x-3">
//               <button
//                 type="button"
//                 onClick={handleCancel}
//                 className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Election Creation Wizard */}
//         <div className="bg-white shadow-lg rounded-lg">
//           <ElectionCreationWizard
//             initialData={electionData}
//             onSave={handleSave}
//             onCancel={handleCancel}
//             isEditing={isEditing}
//             election={election}
//           />
//         </div>
//       </div>
     
//     </div>
//   );
// };

// export default CreateElection2;