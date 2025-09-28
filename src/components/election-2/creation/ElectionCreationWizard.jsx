import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useElection } from '../../../contexts/ElectionContext/useElection';
import StepIndicator from '../common/StepIndicator';
import BasicElectionSetup from './BasicElectionSetup';
import VotingConfiguration from './VotingConfiguration';
import CountrySelection from './CountrySelection';
import AccessControlSettings from './AccessControlSettings';
import BrandingCustomization from './BrandingCustomization';
import ElectionPreview from './ElectionPreview';
import SaveDraftButton from '../common/SaveDraftButton';

const STEPS = [
  { id: 1, name: 'Basic Setup', description: 'Election title, description, and scheduling' },
  { id: 2, name: 'Voting Config', description: 'Voting type and permissions' },
  { id: 3, name: 'Country Access', description: 'Geographic restrictions' },
  { id: 4, name: 'Security', description: 'Authentication and biometric settings' },
  { id: 5, name: 'Branding', description: 'Custom appearance and lottery settings' },
  { id: 6, name: 'Preview', description: 'Review and publish' }
];

/*eslint-disable*/
const ElectionCreationWizard = ({ 
  initialData, 
  onSave, 
  isEditing = false,
  election = null 
}) => {
  // Use Election Context
  const {
    election: formData,
    updateElectionField,
    isLoading: contextLoading,
    error: contextError,
    setElectionData,
    uploadedFiles,
    setUploadedFiles
  } = useElection();

  const [currentStep, setCurrentStep] = useState(1);
  const [stepErrors, setStepErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Initialize election data when component mounts or initialData changes
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      const processedInitialData = { ...initialData };
      
      // Convert old string dates to object format if needed
      if (typeof initialData.startDate === 'string' && initialData.startDate) {
        processedInitialData.startDate = {
          date: initialData.startDate,
          time: initialData.startTime || '09:00'
        };
      }
      
      if (typeof initialData.endDate === 'string' && initialData.endDate) {
        processedInitialData.endDate = {
          date: initialData.endDate,
          time: initialData.endTime || '18:00'
        };
      }
      
      // Ensure objects exist even if not in initial data
      if (!processedInitialData.startDate) {
        processedInitialData.startDate = { date: '', time: '09:00' };
      }
      
      if (!processedInitialData.endDate) {
        processedInitialData.endDate = { date: '', time: '18:00' };
      }
      
      // Set the election data in context
      setElectionData(processedInitialData);
    }
  }, [initialData, setElectionData]);

  // This is now just a wrapper around the context function
  const updateFormData = (updates) => {
    console.log('updateFormData called with:', updates);
    updateElectionField(updates);
    console.log('Updated election data:', formData);
    
    // Clear step errors when data is updated
    const currentStepErrors = stepErrors[currentStep];
    if (currentStepErrors && Object.keys(updates).some(key => currentStepErrors[key])) {
      setStepErrors(prev => ({
        ...prev,
        [currentStep]: Object.fromEntries(
          /*eslint-disable*/
          Object.entries(currentStepErrors).filter(([key]) => !updates.hasOwnProperty(key))
        )
      }));
    }
  };

  const validateStep = (step) => {
    const errors = {};

    switch (step) {
      case 1: // Basic Setup
        if (!formData.title?.trim()) {
          errors.title = 'Title is required';
        } else if (formData.title.length < 3) {
          errors.title = 'Title must be at least 3 characters';
        }

        if (!formData.startDate?.date) {
          errors.startDate = 'Start date is required';
        }

        if (!formData.endDate?.date) {
          errors.endDate = 'End date is required';
        }

        if (formData.startDate?.date && formData.endDate?.date) {
          const start = new Date(`${formData.startDate.date}T${formData.startDate.time || '09:00'}`);
          const end = new Date(`${formData.endDate.date}T${formData.endDate.time || '18:00'}`);
          
          if (start >= end) {
            errors.endDate = 'End date/time must be after start date/time';
          }

          if (start <= new Date()) {
            errors.startDate = 'Start date/time must be in the future';
          }
        }
        break;

      case 2: // Voting Configuration
        // Updated pricing validation logic
        if (formData.pricingType === 'general') {
          if (!formData.participationFee || formData.participationFee <= 0) {
            errors.participationFee = 'Participation fee must be greater than 0 for general paid elections';
          }
        }
        
        if (formData.pricingType === 'regional') {
          const regionalFees = formData.regionalFees || {};
          const hasAnyRegionalFee = Object.values(regionalFees).some(fee => fee > 0);
          if (!hasAnyRegionalFee) {
            errors.regionalFees = 'At least one regional fee must be greater than 0 for regional pricing';
          }
        }

        // Updated lottery validation logic
        if (formData.isLotterized) {
          if (formData.rewardType === 'monetary') {
            if (!formData.rewardAmount || formData.rewardAmount <= 0) {
              errors.rewardAmount = 'Reward amount must be greater than 0 for monetary lottery elections';
            }
          }
          
          if (formData.rewardType === 'non_monetary') {
            if (!formData.nonMonetaryReward?.trim()) {
              errors.nonMonetaryReward = 'Non-monetary reward description is required';
            }
          }
          
          if (formData.rewardType === 'revenue_share') {
            if (!formData.projectedRevenue || formData.projectedRevenue <= 0) {
              errors.projectedRevenue = 'Projected revenue must be greater than 0 for revenue-share lottery';
            }
            if (!formData.revenueSharePercentage || formData.revenueSharePercentage <= 0) {
              errors.revenueSharePercentage = 'Revenue share percentage must be greater than 0';
            }
          }
          
          if (!formData.winnerCount || formData.winnerCount < 1 || formData.winnerCount > 100) {
            errors.winnerCount = 'Winner count must be between 1 and 100';
          }
        }
        break;

      case 3: // Country Selection
        if (formData.permissionToVote === 'country_specific' && (!formData.countries || formData.countries.length === 0)) {
          errors.countries = 'At least one country must be selected for country-specific elections';
        }
        break;

      case 4: // Access Control
        // No specific validations for this step
        break;

      case 5: // Branding
        if (formData.customVotingUrl && formData.customVotingUrl.length < 3) {
          errors.customVotingUrl = 'Custom URL must be at least 3 characters';
        }
        break;

      case 6: // Preview
        // Validate all previous steps
        for (let i = 1; i < 6; i++) {
          const stepValidation = validateStep(i);
          if (Object.keys(stepValidation).length > 0) {
            errors[`step${i}`] = `Please fix errors in step ${i}`;
          }
        }
        break;
    }

    return errors;
  };

  const handleNext = () => {
    const errors = validateStep(currentStep);
    
    if (Object.keys(errors).length > 0) {
      setStepErrors(prev => ({ ...prev, [currentStep]: errors }));
      toast.error('Please fix the errors before continuing');
      return;
    }

    setStepErrors(prev => ({ ...prev, [currentStep]: {} }));
    setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleStepClick = (step) => {
    if (step <= currentStep || step === currentStep + 1) {
      if (step === currentStep + 1) {
        handleNext();
      } else {
        setCurrentStep(step);
      }
    }
  };

  // Simplified handleSaveDraft - calls parent's onSave function
  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      if (onSave) {
        await onSave(formData, 'draft', { files: uploadedFiles });
      }
    } catch (error) {
      console.error('Save draft error:', error);
      toast.error(error.message || 'Failed to save draft');
    } finally {
      setIsSaving(false);
    }
  };

  // Simplified handlePublish - calls parent's onSave function
  const handlePublish = async () => {
    const errors = validateStep(6);
    
    if (Object.keys(errors).length > 0) {
      setStepErrors(prev => ({ ...prev, [6]: errors }));
      toast.error('Please fix all errors before publishing');
      return;
    }

    setIsSaving(true);
    try {
      if (onSave) {
        await onSave(formData, 'publish', { files: uploadedFiles });
      }
    } catch (error) {
      console.error('Publish election error:', error);
      toast.error(error.message || 'Failed to publish election');
    } finally {
      setIsSaving(false);
    }
  };

  const renderStepContent = () => {
    const stepProps = {
      formData,
      updateFormData,
      errors: stepErrors[currentStep] || {},
      isEditing,
      uploadedFiles,
      setUploadedFiles
    };

    switch (currentStep) {
      case 1:
        return <BasicElectionSetup {...stepProps} />;
      case 2:
        return <VotingConfiguration {...stepProps} />;
      case 3:
        return <CountrySelection {...stepProps} />;
      case 4:
        return <AccessControlSettings {...stepProps} />;
      case 5:
        return <BrandingCustomization {...stepProps} />;
      case 6:
        return <ElectionPreview {...stepProps} election={election} />;
      default:
        return null;
    }
  };

  // Show loading state from context
  if (contextLoading && !formData.title) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading election data...</p>
        </div>
      </div>
    );
  }

  // Show error state from context
  if (contextError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-red-800">
          <h3 className="font-medium">Error loading election</h3>
          <p className="mt-2">{contextError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header with Step Indicator */}
      <div className="mb-8">
        <StepIndicator
          steps={STEPS}
          currentStep={currentStep}
          onStepClick={handleStepClick}
          errors={stepErrors}
        />
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          {renderStepContent()}
        </div>

        {/* Navigation Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Previous
                </button>
              )}

              <SaveDraftButton
                onClick={handleSaveDraft}
                isSaving={isSaving || contextLoading}
                disabled={isSaving || contextLoading}
              />
            </div>

            <div className="flex items-center space-x-3">
              {currentStep < STEPS.length ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Next
                </button>
              ) : (
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    disabled={isSaving || contextLoading}
                    className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? 'Saving...' : 'Save as Draft'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={handlePublish}
                    disabled={isSaving || contextLoading}
                    className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? 'Publishing...' : (isEditing ? 'Update Election' : 'Publish Election')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Information */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1]?.description}
        </p>
      </div>
    </div>
  );
};

export default ElectionCreationWizard;
//this is making successful api call and save data to database but has some errors 
// import React, { useState, useEffect } from 'react';
// import { toast } from 'react-hot-toast';
// import { useElection } from '../../../contexts/ElectionContext/useElection';
// import StepIndicator from '../common/StepIndicator';
// import BasicElectionSetup from './BasicElectionSetup';
// import VotingConfiguration from './VotingConfiguration';
// import CountrySelection from './CountrySelection';
// import AccessControlSettings from './AccessControlSettings';
// import BrandingCustomization from './BrandingCustomization';
// import ElectionPreview from './ElectionPreview';
// import SaveDraftButton from '../common/SaveDraftButton';

// const STEPS = [
//   { id: 1, name: 'Basic Setup', description: 'Election title, description, and scheduling' },
//   { id: 2, name: 'Voting Config', description: 'Voting type and permissions' },
//   { id: 3, name: 'Country Access', description: 'Geographic restrictions' },
//   { id: 4, name: 'Security', description: 'Authentication and biometric settings' },
//   { id: 5, name: 'Branding', description: 'Custom appearance and lottery settings' },
//   { id: 6, name: 'Preview', description: 'Review and publish' }
// ];

// /*eslint-disable*/
// const ElectionCreationWizard = ({ 
//   initialData, 
//   onSave, 
//   isEditing = false,
//   election = null 
// }) => {
//   // Use Election Context
//   const {
//     election: formData,
//     updateElectionField,
//     isLoading: contextLoading,
//     error: contextError,
//     setElectionData,
//     uploadedFiles,
//     setUploadedFiles
//   } = useElection();

//   const [currentStep, setCurrentStep] = useState(1);
//   const [stepErrors, setStepErrors] = useState({});
//   const [isSaving, setIsSaving] = useState(false);

//   // Initialize election data when component mounts or initialData changes
//   useEffect(() => {
//     if (initialData && Object.keys(initialData).length > 0) {
//       const processedInitialData = { ...initialData };
      
//       // Convert old string dates to object format if needed
//       if (typeof initialData.startDate === 'string' && initialData.startDate) {
//         processedInitialData.startDate = {
//           date: initialData.startDate,
//           time: initialData.startTime || '09:00'
//         };
//       }
      
//       if (typeof initialData.endDate === 'string' && initialData.endDate) {
//         processedInitialData.endDate = {
//           date: initialData.endDate,
//           time: initialData.endTime || '18:00'
//         };
//       }
      
//       // Ensure objects exist even if not in initial data
//       if (!processedInitialData.startDate) {
//         processedInitialData.startDate = { date: '', time: '09:00' };
//       }
      
//       if (!processedInitialData.endDate) {
//         processedInitialData.endDate = { date: '', time: '18:00' };
//       }
      
//       // Set the election data in context
//       setElectionData(processedInitialData);
//     }
//   }, [initialData, setElectionData]);

//   // Direct API call function for creating election
//   const createElectionDirect = async (electionData, files = null) => {
//     try {
//       console.log('Sending election data:', electionData);
      
//       const formDataObj = new FormData();
      
//       // Add all election fields to formData
//       Object.keys(electionData).forEach(key => {
//         if (electionData[key] !== null && electionData[key] !== undefined) {
//           if (typeof electionData[key] === 'object' && !Array.isArray(electionData[key])) {
//             formDataObj.append(key, JSON.stringify(electionData[key]));
//           } else if (Array.isArray(electionData[key])) {
//             formDataObj.append(key, JSON.stringify(electionData[key]));
//           } else {
//             formDataObj.append(key, electionData[key]);
//           }
//         }
//       });
      
//       // Add files if any
//       if (files && files.length > 0) {
//         files.forEach((file, index) => {
//           formDataObj.append('files', file);
//         });
//       }
      
//       const response = await fetch('http://localhost:3004/api/elections/create', {
//         method: 'POST',
//         body: formDataObj,
//         // Don't set Content-Type header when using FormData - browser will set it automatically
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

//   // Direct API call function for updating election
//   const updateElectionDirect = async (electionId, electionData, files = null) => {
//     try {
//       console.log('Updating election with ID:', electionId);
//       console.log('Sending election data:', electionData);
      
//       const formDataObj = new FormData();
      
//       // Add all election fields to formData
//       Object.keys(electionData).forEach(key => {
//         if (electionData[key] !== null && electionData[key] !== undefined) {
//           if (typeof electionData[key] === 'object' && !Array.isArray(electionData[key])) {
//             formDataObj.append(key, JSON.stringify(electionData[key]));
//           } else if (Array.isArray(electionData[key])) {
//             formDataObj.append(key, JSON.stringify(electionData[key]));
//           } else {
//             formDataObj.append(key, electionData[key]);
//           }
//         }
//       });
      
//       // Add files if any
//       if (files && files.length > 0) {
//         files.forEach((file, index) => {
//           formDataObj.append('files', file);
//         });
//       }
      
//       const response = await fetch(`http://localhost:3004/api/elections/${electionId}`, {
//         method: 'PUT',
//         body: formDataObj,
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
//   const prepareElectionData = (formData) => {
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
      
//       // Handle dates properly
//       startDate: formData.startDate?.date || '',
//       startTime: formData.startDate?.time || '09:00',
//       endDate: formData.endDate?.date || '',
//       endTime: formData.endDate?.time || '18:00',
//       timezone: 'UTC',
      
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
//       brandColors: { primary: formData.primaryColor || '#3B82F6' },
//       primaryLanguage: 'en',
//       supportsMultilang: false,
      
//       // Additional backend fields
//       showLiveResults: true,
//       allowVoteEditing: true,
//       customCss: '',
//       processingFeePercentage: 0,
      
//       // Status
//       isDraft: formData.isDraft || false,
//       isPublished: formData.isPublished || false,
//       creatorId: formData.creatorId || getCurrentUserId()
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

//   // This is now just a wrapper around the context function
//   const updateFormData = (updates) => {
//     console.log('updateFormData called with:', updates);
//     updateElectionField(updates);
//     console.log('Updated election data:', formData);
    
//     // Clear step errors when data is updated
//     const currentStepErrors = stepErrors[currentStep];
//     if (currentStepErrors && Object.keys(updates).some(key => currentStepErrors[key])) {
//       setStepErrors(prev => ({
//         ...prev,
//         [currentStep]: Object.fromEntries(
//           /*eslint-disable*/
//           Object.entries(currentStepErrors).filter(([key]) => !updates.hasOwnProperty(key))
//         )
//       }));
//     }
//   };

//   const validateStep = (step) => {
//     const errors = {};

//     switch (step) {
//       case 1: // Basic Setup
//         if (!formData.title?.trim()) {
//           errors.title = 'Title is required';
//         } else if (formData.title.length < 3) {
//           errors.title = 'Title must be at least 3 characters';
//         }

//         if (!formData.startDate?.date) {
//           errors.startDate = 'Start date is required';
//         }

//         if (!formData.endDate?.date) {
//           errors.endDate = 'End date is required';
//         }

//         if (formData.startDate?.date && formData.endDate?.date) {
//           const start = new Date(`${formData.startDate.date}T${formData.startDate.time || '09:00'}`);
//           const end = new Date(`${formData.endDate.date}T${formData.endDate.time || '18:00'}`);
          
//           if (start >= end) {
//             errors.endDate = 'End date/time must be after start date/time';
//           }

//           if (start <= new Date()) {
//             errors.startDate = 'Start date/time must be in the future';
//           }
//         }
//         break;

//       case 2: // Voting Configuration
//         // Updated pricing validation logic
//         if (formData.pricingType === 'general') {
//           if (!formData.participationFee || formData.participationFee <= 0) {
//             errors.participationFee = 'Participation fee must be greater than 0 for general paid elections';
//           }
//         }
        
//         if (formData.pricingType === 'regional') {
//           const regionalFees = formData.regionalFees || {};
//           const hasAnyRegionalFee = Object.values(regionalFees).some(fee => fee > 0);
//           if (!hasAnyRegionalFee) {
//             errors.regionalFees = 'At least one regional fee must be greater than 0 for regional pricing';
//           }
//         }

//         // Updated lottery validation logic
//         if (formData.isLotterized) {
//           if (formData.rewardType === 'monetary') {
//             if (!formData.rewardAmount || formData.rewardAmount <= 0) {
//               errors.rewardAmount = 'Reward amount must be greater than 0 for monetary lottery elections';
//             }
//           }
          
//           if (formData.rewardType === 'non_monetary') {
//             if (!formData.nonMonetaryReward?.trim()) {
//               errors.nonMonetaryReward = 'Non-monetary reward description is required';
//             }
//           }
          
//           if (formData.rewardType === 'revenue_share') {
//             if (!formData.projectedRevenue || formData.projectedRevenue <= 0) {
//               errors.projectedRevenue = 'Projected revenue must be greater than 0 for revenue-share lottery';
//             }
//             if (!formData.revenueSharePercentage || formData.revenueSharePercentage <= 0) {
//               errors.revenueSharePercentage = 'Revenue share percentage must be greater than 0';
//             }
//           }
          
//           if (!formData.winnerCount || formData.winnerCount < 1 || formData.winnerCount > 100) {
//             errors.winnerCount = 'Winner count must be between 1 and 100';
//           }
//         }
//         break;

//       case 3: // Country Selection
//         if (formData.permissionToVote === 'country_specific' && (!formData.countries || formData.countries.length === 0)) {
//           errors.countries = 'At least one country must be selected for country-specific elections';
//         }
//         break;

//       case 4: // Access Control
//         // No specific validations for this step
//         break;

//       case 5: // Branding
//         if (formData.customVotingUrl && formData.customVotingUrl.length < 3) {
//           errors.customVotingUrl = 'Custom URL must be at least 3 characters';
//         }
//         break;

//       case 6: // Preview
//         // Validate all previous steps
//         for (let i = 1; i < 6; i++) {
//           const stepValidation = validateStep(i);
//           if (Object.keys(stepValidation).length > 0) {
//             errors[`step${i}`] = `Please fix errors in step ${i}`;
//           }
//         }
//         break;
//     }

//     return errors;
//   };

//   const handleNext = () => {
//     const errors = validateStep(currentStep);
    
//     if (Object.keys(errors).length > 0) {
//       setStepErrors(prev => ({ ...prev, [currentStep]: errors }));
//       toast.error('Please fix the errors before continuing');
//       return;
//     }

//     setStepErrors(prev => ({ ...prev, [currentStep]: {} }));
//     setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
//   };

//   const handlePrevious = () => {
//     setCurrentStep(prev => Math.max(prev - 1, 1));
//   };

//   const handleStepClick = (step) => {
//     if (step <= currentStep || step === currentStep + 1) {
//       if (step === currentStep + 1) {
//         handleNext();
//       } else {
//         setCurrentStep(step);
//       }
//     }
//   };

//   // Modified handleSaveDraft with direct API call
//   const handleSaveDraft = async () => {
//     setIsSaving(true);
//     try {
//       // Prepare data for API
//       const apiData = prepareElectionData({
//         ...formData,
//         isDraft: true,
//         isPublished: false
//       });
      
//       console.log('Saving draft with data:', apiData);
      
//       let result;
//       if (isEditing && formData.id) {
//         // Update existing election as draft
//         result = await updateElectionDirect(formData.id, apiData, uploadedFiles);
//       } else {
//         // Create new election as draft
//         result = await createElectionDirect(apiData, uploadedFiles);
//       }
      
//       if (result.success) {
//         // Handle case where API returns null data but success is true
//         const responseData = result.data || { 
//           ...apiData, 
//           id: result.id || Date.now(), // Fallback ID if not provided
//           createdAt: new Date().toISOString(),
//           updatedAt: new Date().toISOString()
//         };
        
//         // Update context with response data
//         setElectionData(responseData);
//         toast.success('Draft saved successfully!');
        
//         // Call onSave callback if provided
//         if (onSave) {
//           await onSave(responseData, 'draft');
//         }
//       } else {
//         throw new Error(result.message || 'Failed to save draft');
//       }
      
//     } catch (error) {
//       console.error('Save draft error:', error);
//       toast.error(error.message || 'Failed to save draft');
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   // Modified handlePublish with direct API call
//   const handlePublish = async () => {
//     const errors = validateStep(6);
    
//     if (Object.keys(errors).length > 0) {
//       setStepErrors(prev => ({ ...prev, [6]: errors }));
//       toast.error('Please fix all errors before publishing');
//       return;
//     }

//     setIsSaving(true);
//     try {
//       // Prepare data for API
//       const apiData = prepareElectionData({
//         ...formData,
//         isDraft: false,
//         isPublished: true
//       });
      
//       console.log('Publishing election with data:', apiData);
      
//       let result;
//       if (isEditing && formData.id) {
//         // Update existing election and publish
//         result = await updateElectionDirect(formData.id, apiData, uploadedFiles);
//         toast.success('Election updated and published successfully!');
//       } else {
//         // Create new election and publish
//         result = await createElectionDirect(apiData, uploadedFiles);
//         toast.success('Election published successfully!');
//       }
      
//       if (result.success) {
//         // Handle case where API returns null data but success is true
//         const responseData = result.data || { 
//           ...apiData, 
//           id: result.id || Date.now(), // Fallback ID if not provided
//           createdAt: new Date().toISOString(),
//           updatedAt: new Date().toISOString()
//         };
        
//         // Update context with response data
//         setElectionData(responseData);
        
//         // Call onSave callback if provided
//         if (onSave) {
//           await onSave(responseData, 'publish');
//         }
//       } else {
//         throw new Error(result.message || 'Failed to publish election');
//       }
      
//     } catch (error) {
//       console.error('Publish election error:', error);
//       toast.error(error.message || 'Failed to publish election');
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const renderStepContent = () => {
//     const stepProps = {
//       formData,
//       updateFormData,
//       errors: stepErrors[currentStep] || {},
//       isEditing,
//       uploadedFiles,
//       setUploadedFiles
//     };

//     switch (currentStep) {
//       case 1:
//         return <BasicElectionSetup {...stepProps} />;
//       case 2:
//         return <VotingConfiguration {...stepProps} />;
//       case 3:
//         return <CountrySelection {...stepProps} />;
//       case 4:
//         return <AccessControlSettings {...stepProps} />;
//       case 5:
//         return <BrandingCustomization {...stepProps} />;
//       case 6:
//         return <ElectionPreview {...stepProps} election={election} />;
//       default:
//         return null;
//     }
//   };

//   // Show loading state from context
//   if (contextLoading && !formData.title) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//           <p className="mt-4 text-gray-600">Loading election data...</p>
//         </div>
//       </div>
//     );
//   }

//   // Show error state from context
//   if (contextError) {
//     return (
//       <div className="bg-red-50 border border-red-200 rounded-md p-4">
//         <div className="text-red-800">
//           <h3 className="font-medium">Error loading election</h3>
//           <p className="mt-2">{contextError}</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto">
//       {/* Header with Step Indicator */}
//       <div className="mb-8">
//         <StepIndicator
//           steps={STEPS}
//           currentStep={currentStep}
//           onStepClick={handleStepClick}
//           errors={stepErrors}
//         />
//       </div>

//       {/* Step Content */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//         <div className="p-6">
//           {renderStepContent()}
//         </div>

//         {/* Navigation Footer */}
//         <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               {currentStep > 1 && (
//                 <button
//                   type="button"
//                   onClick={handlePrevious}
//                   className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 >
//                   Previous
//                 </button>
//               )}

//               <SaveDraftButton
//                 onClick={handleSaveDraft}
//                 isSaving={isSaving || contextLoading}
//                 disabled={isSaving || contextLoading}
//               />
//             </div>

//             <div className="flex items-center space-x-3">
//               {currentStep < STEPS.length ? (
//                 <button
//                   type="button"
//                   onClick={handleNext}
//                   className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 >
//                   Next
//                 </button>
//               ) : (
//                 <div className="flex space-x-3">
//                   <button
//                     type="button"
//                     onClick={handleSaveDraft}
//                     disabled={isSaving || contextLoading}
//                     className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {isSaving ? 'Saving...' : 'Save as Draft'}
//                   </button>
                  
//                   <button
//                     type="button"
//                     onClick={handlePublish}
//                     disabled={isSaving || contextLoading}
//                     className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {isSaving ? 'Publishing...' : (isEditing ? 'Update Election' : 'Publish Election')}
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Progress Information */}
//       <div className="mt-4 text-center">
//         <p className="text-sm text-gray-500">
//           Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1]?.description}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default ElectionCreationWizard;











//last workable code just retrieve
// import React, { useState, useEffect } from 'react';
// import { toast } from 'react-hot-toast';
// import { useElection } from '../../../contexts/ElectionContext/useElection';
// import { createElectionWithValidation, updateElectionWithValidation } from '../../../services/election/electionService';
// import StepIndicator from '../common/StepIndicator';
// import BasicElectionSetup from './BasicElectionSetup';
// import VotingConfiguration from './VotingConfiguration';
// import CountrySelection from './CountrySelection';
// import AccessControlSettings from './AccessControlSettings';
// import BrandingCustomization from './BrandingCustomization';
// import ElectionPreview from './ElectionPreview';
// import SaveDraftButton from '../common/SaveDraftButton';

// const STEPS = [
//   { id: 1, name: 'Basic Setup', description: 'Election title, description, and scheduling' },
//   { id: 2, name: 'Voting Config', description: 'Voting type and permissions' },
//   { id: 3, name: 'Country Access', description: 'Geographic restrictions' },
//   { id: 4, name: 'Security', description: 'Authentication and biometric settings' },
//   { id: 5, name: 'Branding', description: 'Custom appearance and lottery settings' },
//   { id: 6, name: 'Preview', description: 'Review and publish' }
// ];
// /*eslint-disable*/
// const ElectionCreationWizard = ({ 
//   initialData, 
//   onSave, 
//   isEditing = false,
//   election = null 
// }) => {
//   // Use Election Context
//   const {
//     election: formData,
//     updateElectionField,
//     isLoading: contextLoading,
//     error: contextError,
//     setElectionData,
//     uploadedFiles,
//     setUploadedFiles
//   } = useElection();

//   const [currentStep, setCurrentStep] = useState(1);
//   const [stepErrors, setStepErrors] = useState({});
//   const [isSaving, setIsSaving] = useState(false);

//   // Initialize election data when component mounts or initialData changes
//   useEffect(() => {
//     if (initialData && Object.keys(initialData).length > 0) {
//       const processedInitialData = { ...initialData };
      
//       // Convert old string dates to object format if needed
//       if (typeof initialData.startDate === 'string' && initialData.startDate) {
//         processedInitialData.startDate = {
//           date: initialData.startDate,
//           time: initialData.startTime || '09:00'
//         };
//       }
      
//       if (typeof initialData.endDate === 'string' && initialData.endDate) {
//         processedInitialData.endDate = {
//           date: initialData.endDate,
//           time: initialData.endTime || '18:00'
//         };
//       }
      
//       // Ensure objects exist even if not in initial data
//       if (!processedInitialData.startDate) {
//         processedInitialData.startDate = { date: '', time: '09:00' };
//       }
      
//       if (!processedInitialData.endDate) {
//         processedInitialData.endDate = { date: '', time: '18:00' };
//       }
      
//       // Set the election data in context
//       setElectionData(processedInitialData);
//     }
//   }, [initialData, setElectionData]);

//   // This is now just a wrapper around the context function
//   const updateFormData = (updates) => {
//     console.log('updateFormData called with:', updates);
//     updateElectionField(updates);
//     console.log('Updated election data:', formData);
    
//     // Clear step errors when data is updated
//     const currentStepErrors = stepErrors[currentStep];
//     if (currentStepErrors && Object.keys(updates).some(key => currentStepErrors[key])) {
//       setStepErrors(prev => ({
//         ...prev,
//         [currentStep]: Object.fromEntries(
//           /*eslint-disable*/
//           Object.entries(currentStepErrors).filter(([key]) => !updates.hasOwnProperty(key))
//         )
//       }));
//     }
//   };

//   const validateStep = (step) => {
//     const errors = {};

//     switch (step) {
//       case 1: // Basic Setup
//         if (!formData.title?.trim()) {
//           errors.title = 'Title is required';
//         } else if (formData.title.length < 3) {
//           errors.title = 'Title must be at least 3 characters';
//         }

//         if (!formData.startDate?.date) {
//           errors.startDate = 'Start date is required';
//         }

//         if (!formData.endDate?.date) {
//           errors.endDate = 'End date is required';
//         }

//         if (formData.startDate?.date && formData.endDate?.date) {
//           const start = new Date(`${formData.startDate.date}T${formData.startDate.time || '09:00'}`);
//           const end = new Date(`${formData.endDate.date}T${formData.endDate.time || '18:00'}`);
          
//           if (start >= end) {
//             errors.endDate = 'End date/time must be after start date/time';
//           }

//           if (start <= new Date()) {
//             errors.startDate = 'Start date/time must be in the future';
//           }
//         }
//         break;

//       case 2: // Voting Configuration
//         // Updated pricing validation logic
//         if (formData.pricingType === 'general') {
//           if (!formData.participationFee || formData.participationFee <= 0) {
//             errors.participationFee = 'Participation fee must be greater than 0 for general paid elections';
//           }
//         }
        
//         if (formData.pricingType === 'regional') {
//           const regionalFees = formData.regionalFees || {};
//           const hasAnyRegionalFee = Object.values(regionalFees).some(fee => fee > 0);
//           if (!hasAnyRegionalFee) {
//             errors.regionalFees = 'At least one regional fee must be greater than 0 for regional pricing';
//           }
//         }

//         // Updated lottery validation logic
//         if (formData.isLotterized) {
//           if (formData.rewardType === 'monetary') {
//             if (!formData.rewardAmount || formData.rewardAmount <= 0) {
//               errors.rewardAmount = 'Reward amount must be greater than 0 for monetary lottery elections';
//             }
//           }
          
//           if (formData.rewardType === 'non_monetary') {
//             if (!formData.nonMonetaryReward?.trim()) {
//               errors.nonMonetaryReward = 'Non-monetary reward description is required';
//             }
//           }
          
//           if (formData.rewardType === 'revenue_share') {
//             if (!formData.projectedRevenue || formData.projectedRevenue <= 0) {
//               errors.projectedRevenue = 'Projected revenue must be greater than 0 for revenue-share lottery';
//             }
//             if (!formData.revenueSharePercentage || formData.revenueSharePercentage <= 0) {
//               errors.revenueSharePercentage = 'Revenue share percentage must be greater than 0';
//             }
//           }
          
//           if (!formData.winnerCount || formData.winnerCount < 1 || formData.winnerCount > 100) {
//             errors.winnerCount = 'Winner count must be between 1 and 100';
//           }
//         }
//         break;

//       case 3: // Country Selection
//         if (formData.permissionToVote === 'country_specific' && (!formData.countries || formData.countries.length === 0)) {
//           errors.countries = 'At least one country must be selected for country-specific elections';
//         }
//         break;

//       case 4: // Access Control
//         // No specific validations for this step
//         break;

//       case 5: // Branding
//         if (formData.customVotingUrl && formData.customVotingUrl.length < 3) {
//           errors.customVotingUrl = 'Custom URL must be at least 3 characters';
//         }
//         break;

//       case 6: // Preview
//         // Validate all previous steps
//         for (let i = 1; i < 6; i++) {
//           const stepValidation = validateStep(i);
//           if (Object.keys(stepValidation).length > 0) {
//             errors[`step${i}`] = `Please fix errors in step ${i}`;
//           }
//         }
//         break;
//     }

//     return errors;
//   };

//   const handleNext = () => {
//     const errors = validateStep(currentStep);
    
//     if (Object.keys(errors).length > 0) {
//       setStepErrors(prev => ({ ...prev, [currentStep]: errors }));
//       toast.error('Please fix the errors before continuing');
//       return;
//     }

//     setStepErrors(prev => ({ ...prev, [currentStep]: {} }));
//     setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
//   };

//   const handlePrevious = () => {
//     setCurrentStep(prev => Math.max(prev - 1, 1));
//   };

//   const handleStepClick = (step) => {
//     if (step <= currentStep || step === currentStep + 1) {
//       if (step === currentStep + 1) {
//         handleNext();
//       } else {
//         setCurrentStep(step);
//       }
//     }
//   };

//   const handleSaveDraft = async () => {
//     setIsSaving(true);
//     try {
//       const draftData = { ...formData, isDraft: true, isPublished: false };
      
//       if (isEditing && formData.id) {
//         // Update existing election as draft
//         const response = await updateElectionWithValidation(
//           formData.id,
//           draftData,
//           uploadedFiles
//         );
        
//         // Update context with response data
//         setElectionData(response.data);
//         toast.success('Draft updated successfully!');
//       } else {
//         // Create new election as draft
//         const response = await createElectionWithValidation(
//           draftData,
//           uploadedFiles
//         );
        
//         // Update context with response data including new ID
//         setElectionData(response.data);
//         toast.success('Draft saved successfully!');
//       }

//       // Call onSave callback if provided
//       if (onSave) {
//         const dataForSave = {
//           ...formData,
//           startDate: formData.startDate?.date || '',
//           startTime: formData.startDate?.time || '09:00',
//           endDate: formData.endDate?.date || '',
//           endTime: formData.endDate?.time || '18:00'
//         };
        
//         await onSave(dataForSave, 'draft');
//       }
      
//     } catch (error) {
//       console.error('Save draft error:', error);
//       toast.error(error.message || 'Failed to save draft');
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handlePublish = async () => {
//     const errors = validateStep(6);
    
//     if (Object.keys(errors).length > 0) {
//       setStepErrors(prev => ({ ...prev, [6]: errors }));
//       toast.error('Please fix all errors before publishing');
//       return;
//     }

//     setIsSaving(true);
//     try {
//       // Get current user ID from localStorage
//       const getCurrentUserId = () => {
//         try {
//           const userData = localStorage.getItem('vottery_user_data');
//           if (userData) {
//             const user = JSON.parse(userData);
//             return user.id || null;
//           }
//         } catch (error) {
//           console.error('Error getting user ID:', error);
//         }
//         return null;
//       };

//       // Prepare election data for API
//       const electionDataForAPI = {
//         ...formData,
//         isDraft: false,
//         isPublished: true,
//         creatorId: formData.creatorId || getCurrentUserId()
//       };

//       console.log('Publishing election with data:', electionDataForAPI);
//       console.log('Publishing election with files:', uploadedFiles);

//       let response;
      
//       if (isEditing && formData.id) {
//         // Update existing election and publish
//         response = await updateElectionWithValidation(
//           formData.id,
//           electionDataForAPI,
//           uploadedFiles
//         );
        
//         toast.success('Election updated and published successfully!');
//       } else {
//         // Create new election and publish
//         response = await createElectionWithValidation(
//           electionDataForAPI,
//           uploadedFiles
//         );
        
//         toast.success('Election published successfully!');
//       }

//       // Update context with response data
//       setElectionData(response.data);

//       // Call onSave callback if provided
//       if (onSave) {
//         const dataForSave = {
//           ...response.data,
//           startDate: formData.startDate?.date || '',
//           startTime: formData.startDate?.time || '09:00',
//           endDate: formData.endDate?.date || '',
//           endTime: formData.endDate?.time || '18:00'
//         };
        
//         await onSave(dataForSave, 'publish');
//       }
      
//     } catch (error) {
//       console.error('Publish election error:', error);
//       toast.error(error.message || 'Failed to publish election');
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const renderStepContent = () => {
//     const stepProps = {
//       formData,
//       updateFormData,
//       errors: stepErrors[currentStep] || {},
//       isEditing,
//       uploadedFiles,
//       setUploadedFiles
//     };

//     switch (currentStep) {
//       case 1:
//         return <BasicElectionSetup {...stepProps} />;
//       case 2:
//         return <VotingConfiguration {...stepProps} />;
//       case 3:
//         return <CountrySelection {...stepProps} />;
//       case 4:
//         return <AccessControlSettings {...stepProps} />;
//       case 5:
//         return <BrandingCustomization {...stepProps} />;
//       case 6:
//         return <ElectionPreview {...stepProps} election={election} />;
//       default:
//         return null;
//     }
//   };

//   // Show loading state from context
//   if (contextLoading && !formData.title) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//           <p className="mt-4 text-gray-600">Loading election data...</p>
//         </div>
//       </div>
//     );
//   }

//   // Show error state from context
//   if (contextError) {
//     return (
//       <div className="bg-red-50 border border-red-200 rounded-md p-4">
//         <div className="text-red-800">
//           <h3 className="font-medium">Error loading election</h3>
//           <p className="mt-2">{contextError}</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto">
//       {/* Header with Step Indicator */}
//       <div className="mb-8">
//         <StepIndicator
//           steps={STEPS}
//           currentStep={currentStep}
//           onStepClick={handleStepClick}
//           errors={stepErrors}
//         />
//       </div>

//       {/* Step Content */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//         <div className="p-6">
//           {renderStepContent()}
//         </div>

//         {/* Navigation Footer */}
//         <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               {currentStep > 1 && (
//                 <button
//                   type="button"
//                   onClick={handlePrevious}
//                   className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 >
//                   Previous
//                 </button>
//               )}

//               <SaveDraftButton
//                 onClick={handleSaveDraft}
//                 isSaving={isSaving || contextLoading}
//                 disabled={isSaving || contextLoading}
//               />
//             </div>

//             <div className="flex items-center space-x-3">
//               {currentStep < STEPS.length ? (
//                 <button
//                   type="button"
//                   onClick={handleNext}
//                   className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 >
//                   Next
//                 </button>
//               ) : (
//                 <div className="flex space-x-3">
//                   <button
//                     type="button"
//                     onClick={handleSaveDraft}
//                     disabled={isSaving || contextLoading}
//                     className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {isSaving ? 'Saving...' : 'Save as Draft'}
//                   </button>
                  
//                   <button
//                     type="button"
//                     onClick={handlePublish}
//                     disabled={isSaving || contextLoading}
//                     className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {isSaving ? 'Publishing...' : (isEditing ? 'Update Election' : 'Publish Election')}
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Progress Information */}
//       <div className="mt-4 text-center">
//         <p className="text-sm text-gray-500">
//           Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1]?.description}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default ElectionCreationWizard;




// //this is the latest workable code
// import React, { useState, useEffect } from 'react';
// import { toast } from 'react-hot-toast';
// import { useElection } from '../../../contexts/ElectionContext/useElection';
// //import { createElectionWithValidation, updateElectionWithValidation } from '../../../services/election/electionHelpers';
// import StepIndicator from '../common/StepIndicator';
// import BasicElectionSetup from './BasicElectionSetup';
// import VotingConfiguration from './VotingConfiguration';
// import CountrySelection from './CountrySelection';
// import AccessControlSettings from './AccessControlSettings';
// import BrandingCustomization from './BrandingCustomization';
// import ElectionPreview from './ElectionPreview';
// import SaveDraftButton from '../common/SaveDraftButton';
// import { createElectionWithValidation } from '../../../services/election/electionService';

// const STEPS = [
//   { id: 1, name: 'Basic Setup', description: 'Election title, description, and scheduling' },
//   { id: 2, name: 'Voting Config', description: 'Voting type and permissions' },
//   { id: 3, name: 'Country Access', description: 'Geographic restrictions' },
//   { id: 4, name: 'Security', description: 'Authentication and biometric settings' },
//   { id: 5, name: 'Branding', description: 'Custom appearance and lottery settings' },
//   { id: 6, name: 'Preview', description: 'Review and publish' }
// ];

// const ElectionCreationWizard = ({ 
//   initialData, 
//   onSave, 
//   isEditing = false,
//   election = null 
// }) => {
//   // Use Election Context
//   const {
//     election: formData,
//     updateElectionField,
//     isLoading: contextLoading,
//     error: contextError,
//     setElectionData,
//     //saveElection,
//     //publishElection,
//     uploadedFiles,
//     setUploadedFiles
//   } = useElection();

//   const [currentStep, setCurrentStep] = useState(1);
//   const [stepErrors, setStepErrors] = useState({});
//   const [isSaving, setIsSaving] = useState(false);

//   // Initialize election data when component mounts or initialData changes
//   useEffect(() => {
//     if (initialData && Object.keys(initialData).length > 0) {
//       const processedInitialData = { ...initialData };
      
//       // Convert old string dates to object format if needed
//       if (typeof initialData.startDate === 'string' && initialData.startDate) {
//         processedInitialData.startDate = {
//           date: initialData.startDate,
//           time: initialData.startTime || '09:00'
//         };
//       }
      
//       if (typeof initialData.endDate === 'string' && initialData.endDate) {
//         processedInitialData.endDate = {
//           date: initialData.endDate,
//           time: initialData.endTime || '18:00'
//         };
//       }
      
//       // Ensure objects exist even if not in initial data
//       if (!processedInitialData.startDate) {
//         processedInitialData.startDate = { date: '', time: '09:00' };
//       }
      
//       if (!processedInitialData.endDate) {
//         processedInitialData.endDate = { date: '', time: '18:00' };
//       }
      
//       // Set the election data in context
//       setElectionData(processedInitialData);
//     }
//   }, [initialData, setElectionData]);

//   // This is now just a wrapper around the context function
//   const updateFormData = (updates) => {
//     console.log('updateFormData called with:', updates);
//     updateElectionField(updates);
//     console.log('Updated election data:', formData);
    
//     // Clear step errors when data is updated
//     const currentStepErrors = stepErrors[currentStep];
//     if (currentStepErrors && Object.keys(updates).some(key => currentStepErrors[key])) {
//       setStepErrors(prev => ({
//         ...prev,
//         [currentStep]: Object.fromEntries(
//           /*eslint-disable*/
//           Object.entries(currentStepErrors).filter(([key]) => !updates.hasOwnProperty(key))
//         )
//       }));
//     }
//   };

//   const validateStep = (step) => {
//     const errors = {};

//     switch (step) {
//       case 1: // Basic Setup
//         if (!formData.title?.trim()) {
//           errors.title = 'Title is required';
//         } else if (formData.title.length < 3) {
//           errors.title = 'Title must be at least 3 characters';
//         }

//         if (!formData.startDate?.date) {
//           errors.startDate = 'Start date is required';
//         }

//         if (!formData.endDate?.date) {
//           errors.endDate = 'End date is required';
//         }

//         if (formData.startDate?.date && formData.endDate?.date) {
//           const start = new Date(`${formData.startDate.date}T${formData.startDate.time || '09:00'}`);
//           const end = new Date(`${formData.endDate.date}T${formData.endDate.time || '18:00'}`);
          
//           if (start >= end) {
//             errors.endDate = 'End date/time must be after start date/time';
//           }

//           if (start <= new Date()) {
//             errors.startDate = 'Start date/time must be in the future';
//           }
//         }
//         break;

//       case 2: // Voting Configuration
//         // Updated pricing validation logic
//         if (formData.pricingType === 'general') {
//           if (!formData.participationFee || formData.participationFee <= 0) {
//             errors.participationFee = 'Participation fee must be greater than 0 for general paid elections';
//           }
//         }
        
//         if (formData.pricingType === 'regional') {
//           const regionalFees = formData.regionalFees || {};
//           const hasAnyRegionalFee = Object.values(regionalFees).some(fee => fee > 0);
//           if (!hasAnyRegionalFee) {
//             errors.regionalFees = 'At least one regional fee must be greater than 0 for regional pricing';
//           }
//         }

//         // Updated lottery validation logic
//         if (formData.isLotterized) {
//           if (formData.rewardType === 'monetary') {
//             if (!formData.rewardAmount || formData.rewardAmount <= 0) {
//               errors.rewardAmount = 'Reward amount must be greater than 0 for monetary lottery elections';
//             }
//           }
          
//           if (formData.rewardType === 'non_monetary') {
//             if (!formData.nonMonetaryReward?.trim()) {
//               errors.nonMonetaryReward = 'Non-monetary reward description is required';
//             }
//           }
          
//           if (formData.rewardType === 'revenue_share') {
//             if (!formData.projectedRevenue || formData.projectedRevenue <= 0) {
//               errors.projectedRevenue = 'Projected revenue must be greater than 0 for revenue-share lottery';
//             }
//             if (!formData.revenueSharePercentage || formData.revenueSharePercentage <= 0) {
//               errors.revenueSharePercentage = 'Revenue share percentage must be greater than 0';
//             }
//           }
          
//           if (!formData.winnerCount || formData.winnerCount < 1 || formData.winnerCount > 100) {
//             errors.winnerCount = 'Winner count must be between 1 and 100';
//           }
//         }
//         break;

//       case 3: // Country Selection
//         if (formData.permissionToVote === 'country_specific' && (!formData.countries || formData.countries.length === 0)) {
//           errors.countries = 'At least one country must be selected for country-specific elections';
//         }
//         break;

//       case 4: // Access Control
//         // No specific validations for this step
//         break;

//       case 5: // Branding
//         if (formData.customVotingUrl && formData.customVotingUrl.length < 3) {
//           errors.customVotingUrl = 'Custom URL must be at least 3 characters';
//         }
//         break;

//       case 6: // Preview
//         // Validate all previous steps
//         for (let i = 1; i < 6; i++) {
//           const stepValidation = validateStep(i);
//           if (Object.keys(stepValidation).length > 0) {
//             errors[`step${i}`] = `Please fix errors in step ${i}`;
//           }
//         }
//         break;
//     }

//     return errors;
//   };

//   const handleNext = () => {
//     const errors = validateStep(currentStep);
    
//     if (Object.keys(errors).length > 0) {
//       setStepErrors(prev => ({ ...prev, [currentStep]: errors }));
//       toast.error('Please fix the errors before continuing');
//       return;
//     }

//     setStepErrors(prev => ({ ...prev, [currentStep]: {} }));
//     setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
//   };

//   const handlePrevious = () => {
//     setCurrentStep(prev => Math.max(prev - 1, 1));
//   };

//   const handleStepClick = (step) => {
//     if (step <= currentStep || step === currentStep + 1) {
//       if (step === currentStep + 1) {
//         handleNext();
//       } else {
//         setCurrentStep(step);
//       }
//     }
//   };

//   const handleSaveDraft = async () => {
//     setIsSaving(true);
//     try {
//       if (isEditing && formData.id) {
//         // Update existing election as draft
//         const response = await updateElectionWithValidation(
//           formData.id,
//           { ...formData, isDraft: true, isPublished: false },
//           uploadedFiles
//         );
        
//         if (response.success) {
//           // Update context with response data
//           setElectionData(response.data);
//           toast.success('Draft updated successfully!');
//         }
//       } else {
//         // Create new election as draft
//         const response = await createElectionWithValidation(
//           { ...formData, isDraft: true, isPublished: false },
//           uploadedFiles
//         );
        
//         if (response.success) {
//           // Update context with response data including new ID
//           setElectionData(response.data);
//           toast.success('Draft saved successfully!');
//         }
//       }

//       // If onSave prop is provided (for backward compatibility)
//       if (onSave) {
//         const dataForSave = {
//           ...formData,
//           startDate: formData.startDate?.date || '',
//           startTime: formData.startDate?.time || '09:00',
//           endDate: formData.endDate?.date || '',
//           endTime: formData.endDate?.time || '18:00'
//         };
        
//         await onSave(dataForSave, 'draft');
//       }
      
//     } catch (error) {
//       console.error('Save draft error:', error);
//       toast.error(error.message || 'Failed to save draft');
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handlePublish = async () => {
//     const errors = validateStep(6);
    
//     if (Object.keys(errors).length > 0) {
//       setStepErrors(prev => ({ ...prev, [6]: errors }));
//       toast.error('Please fix all errors before publishing');
//       return;
//     }

//     setIsSaving(true);
//     try {
//       // Get current user ID from localStorage
//       const getCurrentUserId = () => {
//         try {
//           const userData = localStorage.getItem('vottery_user_data');
//           if (userData) {
//             const user = JSON.parse(userData);
//             return user.id || null;
//           }
//         } catch (error) {
//           console.error('Error getting user ID:', error);
//         }
//         return null;
//       };

//       // Prepare election data for API
//       const electionDataForAPI = {
//         ...formData,
//         isDraft: false,
//         isPublished: true,
//         creatorId: formData.creatorId || getCurrentUserId()
//       };

//       console.log('Publishing election with data:', electionDataForAPI);
//       console.log('Publishing election with files:', uploadedFiles);

//       if (isEditing && formData.id) {
//         // Update existing election and publish
//         const response = await updateElectionWithValidation(
//           formData.id,
//           electionDataForAPI,
//           uploadedFiles
//         );
        
//         if (response.success) {
//           // Update context with response data
//           setElectionData(response.data);
//           toast.success('Election updated and published successfully!');
          
//           // Redirect or callback
//           if (onSave) {
//             onSave(response.data, 'publish');
//           }
//         }
//       } else {
//         // Create new election and publish
//         const response = await createElectionWithValidation(
//           electionDataForAPI,
//           uploadedFiles
//         );
        
//         if (response.success) {
//           // Update context with response data including new ID
//           setElectionData(response.data);
//           toast.success('Election published successfully!');
          
//           // Redirect or callback
//           if (onSave) {
//             onSave(response.data, 'publish');
//           }
//         }
//       }

//       // If onSave prop is provided (for backward compatibility)
//       if (onSave) {
//         const dataForSave = {
//           ...formData,
//           startDate: formData.startDate?.date || '',
//           startTime: formData.startDate?.time || '09:00',
//           endDate: formData.endDate?.date || '',
//           endTime: formData.endDate?.time || '18:00'
//         };
        
//         await onSave(dataForSave, 'publish');
//       }
      
//     } catch (error) {
//       console.error('Publish election error:', error);
//       toast.error(error.message || 'Failed to publish election');
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const renderStepContent = () => {
//     const stepProps = {
//       formData,
//       updateFormData,
//       errors: stepErrors[currentStep] || {},
//       isEditing,
//       uploadedFiles,
//       setUploadedFiles
//     };

//     switch (currentStep) {
//       case 1:
//         return <BasicElectionSetup {...stepProps} />;
//       case 2:
//         return <VotingConfiguration {...stepProps} />;
//       case 3:
//         return <CountrySelection {...stepProps} />;
//       case 4:
//         return <AccessControlSettings {...stepProps} />;
//       case 5:
//         return <BrandingCustomization {...stepProps} />;
//       case 6:
//         return <ElectionPreview {...stepProps} election={election} />;
//       default:
//         return null;
//     }
//   };

//   // Show loading state from context
//   if (contextLoading && !formData.title) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//           <p className="mt-4 text-gray-600">Loading election data...</p>
//         </div>
//       </div>
//     );
//   }

//   // Show error state from context
//   if (contextError) {
//     return (
//       <div className="bg-red-50 border border-red-200 rounded-md p-4">
//         <div className="text-red-800">
//           <h3 className="font-medium">Error loading election</h3>
//           <p className="mt-2">{contextError}</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto">
//       {/* Header with Step Indicator */}
//       <div className="mb-8">
//         <StepIndicator
//           steps={STEPS}
//           currentStep={currentStep}
//           onStepClick={handleStepClick}
//           errors={stepErrors}
//         />
//       </div>

//       {/* Step Content */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//         <div className="p-6">
//           {renderStepContent()}
//         </div>

//         {/* Navigation Footer */}
//         <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               {currentStep > 1 && (
//                 <button
//                   type="button"
//                   onClick={handlePrevious}
//                   className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 >
//                   Previous
//                 </button>
//               )}

//               <SaveDraftButton
//                 onClick={handleSaveDraft}
//                 isSaving={isSaving || contextLoading}
//                 disabled={isSaving || contextLoading}
//               />
//             </div>

//             <div className="flex items-center space-x-3">
//               {currentStep < STEPS.length ? (
//                 <button
//                   type="button"
//                   onClick={handleNext}
//                   className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 >
//                   Next
//                 </button>
//               ) : (
//                 <div className="flex space-x-3">
//                   <button
//                     type="button"
//                     onClick={handleSaveDraft}
//                     disabled={isSaving || contextLoading}
//                     className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {isSaving ? 'Saving...' : 'Save as Draft'}
//                   </button>
                  
//                   <button
//                     type="button"
//                     onClick={handlePublish}
//                     disabled={isSaving || contextLoading}
//                     className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {isSaving ? 'Publishing...' : (isEditing ? 'Update Election' : 'Publish Election')}
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Progress Information */}
//       <div className="mt-4 text-center">
//         <p className="text-sm text-gray-500">
//           Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1]?.description}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default ElectionCreationWizard;
// //fromdata by contex
// import React, { useState, useEffect } from 'react';
// import { toast } from 'react-hot-toast';
// //import { useElection } from '../contexts/useElection'; // Import the hook
// import StepIndicator from '../common/StepIndicator';
// import BasicElectionSetup from './BasicElectionSetup';
// import VotingConfiguration from './VotingConfiguration';
// import CountrySelection from './CountrySelection';
// import AccessControlSettings from './AccessControlSettings';
// import BrandingCustomization from './BrandingCustomization';
// import ElectionPreview from './ElectionPreview';
// import SaveDraftButton from '../common/SaveDraftButton';
// import { useElection } from '../../../contexts/ElectionContext/useElection';




// const STEPS = [
//   { id: 1, name: 'Basic Setup', description: 'Election title, description, and scheduling' },
//   { id: 2, name: 'Voting Config', description: 'Voting type and permissions' },
//   { id: 3, name: 'Country Access', description: 'Geographic restrictions' },
//   { id: 4, name: 'Security', description: 'Authentication and biometric settings' },
//   { id: 5, name: 'Branding', description: 'Custom appearance and lottery settings' },
//   { id: 6, name: 'Preview', description: 'Review and publish' }
// ];

// const ElectionCreationWizard = ({ 
//   initialData, 
//   onSave, 
//   isEditing = false,
//   election = null 
// }) => {
//   // Use Election Context instead of local state
//   const {
//     election: formData,
//     updateElectionField,
//     isLoading: contextLoading,
//     error: contextError,
//     setElectionData,
//     saveElection,
//     publishElection,
  
//   } = useElection();

//   const [currentStep, setCurrentStep] = useState(1);
//   const [stepErrors, setStepErrors] = useState({});
//   const [isSaving, setIsSaving] = useState(false);

//   // Initialize election data when component mounts or initialData changes
//   useEffect(() => {
//     if (initialData && Object.keys(initialData).length > 0) {
//       // Handle conversion from old data structure to new structure
//       const processedInitialData = { ...initialData };
      
//       // Convert old string dates to object format if needed
//       if (typeof initialData.startDate === 'string' && initialData.startDate) {
//         processedInitialData.startDate = {
//           date: initialData.startDate,
//           time: initialData.startTime || '09:00'
//         };
//       }
      
//       if (typeof initialData.endDate === 'string' && initialData.endDate) {
//         processedInitialData.endDate = {
//           date: initialData.endDate,
//           time: initialData.endTime || '18:00'
//         };
//       }
      
//       // Ensure objects exist even if not in initial data
//       if (!processedInitialData.startDate) {
//         processedInitialData.startDate = { date: '', time: '09:00' };
//       }
      
//       if (!processedInitialData.endDate) {
//         processedInitialData.endDate = { date: '', time: '18:00' };
//       }
      
//       // Set the election data in context
//       setElectionData(processedInitialData);
//     }
//   }, [initialData, setElectionData]);

//   // This is now just a wrapper around the context function
//   const updateFormData = (updates) => {
//     console.log('updateFormData called with:', updates);
//     updateElectionField(updates);
//     console.log('Updated election data:', formData);
    
//     // Clear step errors when data is updated
//     const currentStepErrors = stepErrors[currentStep];
//     if (currentStepErrors && Object.keys(updates).some(key => currentStepErrors[key])) {
//       setStepErrors(prev => ({
//         ...prev,
//         [currentStep]: Object.fromEntries(
//           /*eslint-disable*/
//           Object.entries(currentStepErrors).filter(([key]) => !updates.hasOwnProperty(key))
//         )
//       }));
//     }
//   };

//   const validateStep = (step) => {
//     const errors = {};

//     switch (step) {
//       case 1: // Basic Setup
//         if (!formData.title?.trim()) {
//           errors.title = 'Title is required';
//         } else if (formData.title.length < 3) {
//           errors.title = 'Title must be at least 3 characters';
//         }

//         if (!formData.startDate?.date) {
//           errors.startDate = 'Start date is required';
//         }

//         if (!formData.endDate?.date) {
//           errors.endDate = 'End date is required';
//         }

//         if (formData.startDate?.date && formData.endDate?.date) {
//           const start = new Date(`${formData.startDate.date}T${formData.startDate.time || '09:00'}`);
//           const end = new Date(`${formData.endDate.date}T${formData.endDate.time || '18:00'}`);
          
//           if (start >= end) {
//             errors.endDate = 'End date/time must be after start date/time';
//           }

//           if (start <= new Date()) {
//             errors.startDate = 'Start date/time must be in the future';
//           }
//         }
//         break;

//       case 2: // Voting Configuration
//         // Updated pricing validation logic
//         if (formData.pricingType === 'general') {
//           if (!formData.participationFee || formData.participationFee <= 0) {
//             errors.participationFee = 'Participation fee must be greater than 0 for general paid elections';
//           }
//         }
        
//         if (formData.pricingType === 'regional') {
//           // Check if at least one regional fee is set
//           const regionalFees = formData.regionalFees || {};
//           const hasAnyRegionalFee = Object.values(regionalFees).some(fee => fee > 0);
//           if (!hasAnyRegionalFee) {
//             errors.regionalFees = 'At least one regional fee must be greater than 0 for regional pricing';
//           }
//         }

//         // Updated lottery validation logic
//         if (formData.isLotterized) {
//           if (formData.rewardType === 'monetary') {
//             if (!formData.rewardAmount || formData.rewardAmount <= 0) {
//               errors.rewardAmount = 'Reward amount must be greater than 0 for monetary lottery elections';
//             }
//           }
          
//           if (formData.rewardType === 'non-monetary') {
//             if (!formData.nonMonetaryReward?.trim()) {
//               errors.nonMonetaryReward = 'Non-monetary reward description is required';
//             }
//           }
          
//           if (formData.rewardType === 'revenue-share') {
//             if (!formData.projectedRevenue || formData.projectedRevenue <= 0) {
//               errors.projectedRevenue = 'Projected revenue must be greater than 0 for revenue-share lottery';
//             }
//             if (!formData.revenueSharePercentage || formData.revenueSharePercentage <= 0) {
//               errors.revenueSharePercentage = 'Revenue share percentage must be greater than 0';
//             }
//           }
          
//           if (!formData.winnerCount || formData.winnerCount < 1 || formData.winnerCount > 100) {
//             errors.winnerCount = 'Winner count must be between 1 and 100';
//           }
//         }
//         break;

//       case 3: // Country Selection
//         if (formData.permissionToVote === 'country_specific' && formData.countries.length === 0) {
//           errors.countries = 'At least one country must be selected for country-specific elections';
//         }
//         break;

//       case 4: // Access Control
//         // No specific validations for this step
//         break;

//       case 5: // Branding
//         if (formData.customVotingUrl && formData.customVotingUrl.length < 3) {
//           errors.customVotingUrl = 'Custom URL must be at least 3 characters';
//         }
//         break;

//       case 6: // Preview
//         // Validate all previous steps
//         for (let i = 1; i < 6; i++) {
//           const stepValidation = validateStep(i);
//           if (Object.keys(stepValidation).length > 0) {
//             errors[`step${i}`] = `Please fix errors in step ${i}`;
//           }
//         }
//         break;
//     }

//     return errors;
//   };

//   const handleNext = () => {
//     const errors = validateStep(currentStep);
    
//     if (Object.keys(errors).length > 0) {
//       setStepErrors(prev => ({ ...prev, [currentStep]: errors }));
//       toast.error('Please fix the errors before continuing');
//       return;
//     }

//     setStepErrors(prev => ({ ...prev, [currentStep]: {} }));
//     setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
//   };

//   const handlePrevious = () => {
//     setCurrentStep(prev => Math.max(prev - 1, 1));
//   };

//   const handleStepClick = (step) => {
//     // Allow jumping to any previous step or next step if current is valid
//     if (step <= currentStep || step === currentStep + 1) {
//       if (step === currentStep + 1) {
//         handleNext();
//       } else {
//         setCurrentStep(step);
//       }
//     }
//   };

//   const handleSaveDraft = async () => {
//     setIsSaving(true);
//     try {
//       // Use context save function first
//       const savedData = await saveElection();
      
//       // If onSave prop is provided (for backward compatibility)
//       if (onSave) {
//         const dataForSave = {
//           ...formData,
//           // Convert object dates back to strings for backend if needed
//           startDate: formData.startDate?.date || '',
//           startTime: formData.startDate?.time || '09:00',
//           endDate: formData.endDate?.date || '',
//           endTime: formData.endDate?.time || '18:00'
//         };
        
//         await onSave(dataForSave, 'draft');
//       }
      
//       toast.success('Draft saved successfully!');
//     } catch (error) {
//       toast.error(error.message || 'Failed to save draft');
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handlePublish = async () => {
//     const errors = validateStep(6);
    
//     if (Object.keys(errors).length > 0) {
//       setStepErrors(prev => ({ ...prev, [6]: errors }));
//       toast.error('Please fix all errors before publishing');
//       return;
//     }

//     setIsSaving(true);
//     try {
//       // Use context publish function first
//       const publishedData = await publishElection();
      
//       // If onSave prop is provided (for backward compatibility)
//       if (onSave) {
//         const dataForSave = {
//           ...formData,
//           // Convert object dates back to strings for backend if needed
//           startDate: formData.startDate?.date || '',
//           startTime: formData.startDate?.time || '09:00',
//           endDate: formData.endDate?.date || '',
//           endTime: formData.endDate?.time || '18:00'
//         };
        
//         await onSave(dataForSave, 'publish');
//       }
      
//       toast.success(isEditing ? 'Election updated successfully!' : 'Election published successfully!');
//     } catch (error) {
//       toast.error(error.message || 'Failed to publish election');
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const renderStepContent = () => {
//     const stepProps = {
//       formData,
//       updateFormData,
//       errors: stepErrors[currentStep] || {},
//       isEditing
//     };

//     switch (currentStep) {
//       case 1:
//         return <BasicElectionSetup {...stepProps} />;
//       case 2:
//         return <VotingConfiguration {...stepProps} />;
//       case 3:
//         return <CountrySelection {...stepProps} />;
//       case 4:
//         return <AccessControlSettings {...stepProps} />;
//       case 5:
//         return <BrandingCustomization {...stepProps} />;
//       case 6:
//         return <ElectionPreview {...stepProps} election={election} />;
//       default:
//         return null;
//     }
//   };

//   // Show loading state from context
//   if (contextLoading && !formData.title) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//           <p className="mt-4 text-gray-600">Loading election data...</p>
//         </div>
//       </div>
//     );
//   }

//   // Show error state from context
//   if (contextError) {
//     return (
//       <div className="bg-red-50 border border-red-200 rounded-md p-4">
//         <div className="text-red-800">
//           <h3 className="font-medium">Error loading election</h3>
//           <p className="mt-2">{contextError}</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto">
//       {/* Header with Step Indicator */}
//       <div className="mb-8">
//         <StepIndicator
//           steps={STEPS}
//           currentStep={currentStep}
//           onStepClick={handleStepClick}
//           errors={stepErrors}
//         />
//       </div>

//       {/* Step Content */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//         <div className="p-6">
//           {renderStepContent()}
//         </div>

//         {/* Navigation Footer */}
//         <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               {currentStep > 1 && (
//                 <button
//                   type="button"
//                   onClick={handlePrevious}
//                   className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 >
//                   Previous
//                 </button>
//               )}

//               <SaveDraftButton
//                 onClick={handleSaveDraft}
//                 isSaving={isSaving || contextLoading}
//                 disabled={isSaving || contextLoading}
//               />
//             </div>

//             <div className="flex items-center space-x-3">
//               {currentStep < STEPS.length ? (
//                 <button
//                   type="button"
//                   onClick={handleNext}
//                   className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 >
//                   Next
//                 </button>
//               ) : (
//                 <div className="flex space-x-3">
//                   <button
//                     type="button"
//                     onClick={handleSaveDraft}
//                     disabled={isSaving || contextLoading}
//                     className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {isSaving ? 'Saving...' : 'Save as Draft'}
//                   </button>
                  
//                   <button
//                     type="button"
//                     onClick={handlePublish}
//                     disabled={isSaving || contextLoading}
//                     className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {isSaving ? 'Publishing...' : (isEditing ? 'Update Election' : 'Publish Election')}
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Progress Information */}
//       <div className="mt-4 text-center">
//         <p className="text-sm text-gray-500">
//           Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1]?.description}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default ElectionCreationWizard;
// //new pricing model added
// import React, { useState, useEffect } from 'react';
// import { toast } from 'react-hot-toast';
// import StepIndicator from '../common/StepIndicator';
// import BasicElectionSetup from './BasicElectionSetup';
// import VotingConfiguration from './VotingConfiguration';
// import CountrySelection from './CountrySelection';
// import AccessControlSettings from './AccessControlSettings';
// import BrandingCustomization from './BrandingCustomization';
// import ElectionPreview from './ElectionPreview';
// import SaveDraftButton from '../common/SaveDraftButton';

// const STEPS = [
//   { id: 1, name: 'Basic Setup', description: 'Election title, description, and scheduling' },
//   { id: 2, name: 'Voting Config', description: 'Voting type and permissions' },
//   { id: 3, name: 'Country Access', description: 'Geographic restrictions' },
//   { id: 4, name: 'Security', description: 'Authentication and biometric settings' },
//   { id: 5, name: 'Branding', description: 'Custom appearance and lottery settings' },
//   { id: 6, name: 'Preview', description: 'Review and publish' }
// ];

// const ElectionCreationWizard = ({ 
//   initialData, 
//   onSave, 
//   isEditing = false,
//   election = null 
// }) => {
//   const [currentStep, setCurrentStep] = useState(1);
//   const [formData, setFormData] = useState({
//     // Basic Information
//     title: '',
//     description: '',
//     topicImageUrl: '',
//     topicVideoUrl: '',
//     logoBrandingUrl: '',
    
//     // Updated Scheduling - now using objects to match DateTimePicker
//     startDate: { date: '', time: '09:00' },
//     endDate: { date: '', time: '18:00' },
//     timezone: 'UTC',
    
//     // Voting Configuration
//     votingType: 'plurality',
//     permissionToVote: 'world_citizens',
    
//     // Pricing Configuration - NEW FIELDS
//     pricingType: 'free', // 'free', 'general', 'regional'
//     isPaid: false,
//     participationFee: 0,
//     regionalFees: {}, // For regional pricing
//     processingFeePercentage: 0,
    
//     // Country Selection
//     isCountrySpecific: false,
//     countries: [],
    
//     // Access Control
//     biometricRequired: false,
//     authMethod: 'passkey',
//     allowOauth: true,
//     allowMagicLink: true,
//     allowEmailPassword: true,
    
//     // Lottery Settings - UPDATED FIELDS
//     isLotterized: false,
//     rewardType: 'monetary', // 'monetary', 'non-monetary', 'revenue-share'
//     rewardAmount: 0,
//     nonMonetaryReward: '',
//     projectedRevenue: 0,
//     revenueSharePercentage: 0,
//     winnerCount: 1,
    
//     // Results Control
//     showLiveResults: false,
//     allowVoteEditing: false,
    
//     // Branding
//     customVotingUrl: '',
//     customCss: '',
//     brandColors: {
//       primary: '#3B82F6',
//       secondary: '#64748B',
//       accent: '#10B981'
//     },
    
//     // Multi-language
//     primaryLanguage: 'en',
//     supportsMultilang: false,
    
//     ...initialData
//   });

//   const [stepErrors, setStepErrors] = useState({});
//   const [isSaving, setIsSaving] = useState(false);

//   useEffect(() => {
//     if (initialData) {
//       // Handle conversion from old data structure to new structure
//       const processedInitialData = { ...initialData };
      
//       // Convert old string dates to object format if needed
//       if (typeof initialData.startDate === 'string' && initialData.startDate) {
//         processedInitialData.startDate = {
//           date: initialData.startDate,
//           time: initialData.startTime || '09:00'
//         };
//       }
      
//       if (typeof initialData.endDate === 'string' && initialData.endDate) {
//         processedInitialData.endDate = {
//           date: initialData.endDate,
//           time: initialData.endTime || '18:00'
//         };
//       }
      
//       // Ensure objects exist even if not in initial data
//       if (!processedInitialData.startDate) {
//         processedInitialData.startDate = { date: '', time: '09:00' };
//       }
      
//       if (!processedInitialData.endDate) {
//         processedInitialData.endDate = { date: '', time: '18:00' };
//       }
      
//       setFormData(prev => ({ ...prev, ...processedInitialData }));
//     }
//   }, [initialData]);

//   const updateFormData = (updates) => {
//     console.log('updateFormData called with:', updates); // Debug log
//     setFormData(prev => {
//       const newData = { ...prev, ...updates };
//       console.log('New formData shakil:', newData); // Debug log
//       return newData;
//     });
    
//     // Clear step errors when data is updated
//     const currentStepErrors = stepErrors[currentStep];
//     if (currentStepErrors && Object.keys(updates).some(key => currentStepErrors[key])) {
//       setStepErrors(prev => ({
//         ...prev,
//         [currentStep]: Object.fromEntries(
//           /*eslint-disable*/
//           Object.entries(currentStepErrors).filter(([key]) => !updates.hasOwnProperty(key))
//         )
//       }));
//     }
//   };

//   const validateStep = (step) => {
//     const errors = {};

//     switch (step) {
//       case 1: // Basic Setup
//         if (!formData.title?.trim()) {
//           errors.title = 'Title is required';
//         } else if (formData.title.length < 3) {
//           errors.title = 'Title must be at least 3 characters';
//         }

//         if (!formData.startDate?.date) {
//           errors.startDate = 'Start date is required';
//         }

//         if (!formData.endDate?.date) {
//           errors.endDate = 'End date is required';
//         }

//         if (formData.startDate?.date && formData.endDate?.date) {
//           const start = new Date(`${formData.startDate.date}T${formData.startDate.time || '09:00'}`);
//           const end = new Date(`${formData.endDate.date}T${formData.endDate.time || '18:00'}`);
          
//           if (start >= end) {
//             errors.endDate = 'End date/time must be after start date/time';
//           }

//           if (start <= new Date()) {
//             errors.startDate = 'Start date/time must be in the future';
//           }
//         }
//         break;

//       case 2: // Voting Configuration
//         // Updated pricing validation logic
//         if (formData.pricingType === 'general') {
//           if (!formData.participationFee || formData.participationFee <= 0) {
//             errors.participationFee = 'Participation fee must be greater than 0 for general paid elections';
//           }
//         }
        
//         if (formData.pricingType === 'regional') {
//           // Check if at least one regional fee is set
//           const regionalFees = formData.regionalFees || {};
//           const hasAnyRegionalFee = Object.values(regionalFees).some(fee => fee > 0);
//           if (!hasAnyRegionalFee) {
//             errors.regionalFees = 'At least one regional fee must be greater than 0 for regional pricing';
//           }
//         }

//         // Updated lottery validation logic
//         if (formData.isLotterized) {
//           if (formData.rewardType === 'monetary') {
//             if (!formData.rewardAmount || formData.rewardAmount <= 0) {
//               errors.rewardAmount = 'Reward amount must be greater than 0 for monetary lottery elections';
//             }
//           }
          
//           if (formData.rewardType === 'non-monetary') {
//             if (!formData.nonMonetaryReward?.trim()) {
//               errors.nonMonetaryReward = 'Non-monetary reward description is required';
//             }
//           }
          
//           if (formData.rewardType === 'revenue-share') {
//             if (!formData.projectedRevenue || formData.projectedRevenue <= 0) {
//               errors.projectedRevenue = 'Projected revenue must be greater than 0 for revenue-share lottery';
//             }
//             if (!formData.revenueSharePercentage || formData.revenueSharePercentage <= 0) {
//               errors.revenueSharePercentage = 'Revenue share percentage must be greater than 0';
//             }
//           }
          
//           if (!formData.winnerCount || formData.winnerCount < 1 || formData.winnerCount > 100) {
//             errors.winnerCount = 'Winner count must be between 1 and 100';
//           }
//         }
//         break;

//       case 3: // Country Selection
//         if (formData.permissionToVote === 'country_specific' && formData.countries.length === 0) {
//           errors.countries = 'At least one country must be selected for country-specific elections';
//         }
//         break;

//       case 4: // Access Control
//         // No specific validations for this step
//         break;

//       case 5: // Branding
//         if (formData.customVotingUrl && formData.customVotingUrl.length < 3) {
//           errors.customVotingUrl = 'Custom URL must be at least 3 characters';
//         }
//         break;

//       case 6: // Preview
//         // Validate all previous steps
//         for (let i = 1; i < 6; i++) {
//           const stepValidation = validateStep(i);
//           if (Object.keys(stepValidation).length > 0) {
//             errors[`step${i}`] = `Please fix errors in step ${i}`;
//           }
//         }
//         break;
//     }

//     return errors;
//   };

//   const handleNext = () => {
//     const errors = validateStep(currentStep);
    
//     if (Object.keys(errors).length > 0) {
//       setStepErrors(prev => ({ ...prev, [currentStep]: errors }));
//       toast.error('Please fix the errors before continuing');
//       return;
//     }

//     setStepErrors(prev => ({ ...prev, [currentStep]: {} }));
//     setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
//   };

//   const handlePrevious = () => {
//     setCurrentStep(prev => Math.max(prev - 1, 1));
//   };

//   const handleStepClick = (step) => {
//     // Allow jumping to any previous step or next step if current is valid
//     if (step <= currentStep || step === currentStep + 1) {
//       if (step === currentStep + 1) {
//         handleNext();
//       } else {
//         setCurrentStep(step);
//       }
//     }
//   };

//   const handleSaveDraft = async () => {
//     setIsSaving(true);
//     try {
//       // Convert data structure for backend compatibility
//       const dataForSave = {
//         ...formData,
//         // Convert object dates back to strings for backend if needed
//         startDate: formData.startDate?.date || '',
//         startTime: formData.startDate?.time || '09:00',
//         endDate: formData.endDate?.date || '',
//         endTime: formData.endDate?.time || '18:00'
//       };
      
//       await onSave(dataForSave, 'draft');
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handlePublish = async () => {
//     const errors = validateStep(6);
    
//     if (Object.keys(errors).length > 0) {
//       setStepErrors(prev => ({ ...prev, [6]: errors }));
//       toast.error('Please fix all errors before publishing');
//       return;
//     }

//     setIsSaving(true);
//     try {
//       // Convert data structure for backend compatibility
//       const dataForSave = {
//         ...formData,
//         // Convert object dates back to strings for backend if needed
//         startDate: formData.startDate?.date || '',
//         startTime: formData.startDate?.time || '09:00',
//         endDate: formData.endDate?.date || '',
//         endTime: formData.endDate?.time || '18:00'
//       };
      
//       await onSave(dataForSave, 'publish');
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const renderStepContent = () => {
//     const stepProps = {
//       formData,
//       updateFormData,
//       errors: stepErrors[currentStep] || {},
//       isEditing
//     };

//     switch (currentStep) {
//       case 1:
//         return <BasicElectionSetup {...stepProps} />;
//       case 2:
//         return <VotingConfiguration {...stepProps} />;
//       case 3:
//         return <CountrySelection {...stepProps} />;
//       case 4:
//         return <AccessControlSettings {...stepProps} />;
//       case 5:
//         return <BrandingCustomization {...stepProps} />;
//       case 6:
//         return <ElectionPreview {...stepProps} election={election} />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto">
//       {/* Header with Step Indicator */}
//       <div className="mb-8">
//         <StepIndicator
//           steps={STEPS}
//           currentStep={currentStep}
//           onStepClick={handleStepClick}
//           errors={stepErrors}
//         />
//       </div>

//       {/* Step Content */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//         <div className="p-6">
//           {renderStepContent()}
//         </div>

//         {/* Navigation Footer */}
//         <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               {currentStep > 1 && (
//                 <button
//                   type="button"
//                   onClick={handlePrevious}
//                   className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 >
//                   Previous
//                 </button>
//               )}

//               <SaveDraftButton
//                 onClick={handleSaveDraft}
//                 isSaving={isSaving}
//                 disabled={isSaving}
//               />
//             </div>

//             <div className="flex items-center space-x-3">
//               {currentStep < STEPS.length ? (
//                 <button
//                   type="button"
//                   onClick={handleNext}
//                   className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 >
//                   Next
//                 </button>
//               ) : (
//                 <div className="flex space-x-3">
//                   <button
//                     type="button"
//                     onClick={handleSaveDraft}
//                     disabled={isSaving}
//                     className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {isSaving ? 'Saving...' : 'Save as Draft'}
//                   </button>
                  
//                   <button
//                     type="button"
//                     onClick={handlePublish}
//                     disabled={isSaving}
//                     className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {isSaving ? 'Publishing...' : (isEditing ? 'Update Election' : 'Publish Election')}
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Progress Information */}
//       <div className="mt-4 text-center">
//         <p className="text-sm text-gray-500">
//           Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1]?.description}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default ElectionCreationWizard;
// import React, { useState, useEffect } from 'react';
// import { toast } from 'react-hot-toast';
// import StepIndicator from '../common/StepIndicator';
// import BasicElectionSetup from './BasicElectionSetup';
// import VotingConfiguration from './VotingConfiguration';
// import CountrySelection from './CountrySelection';
// import AccessControlSettings from './AccessControlSettings';
// import BrandingCustomization from './BrandingCustomization';
// import ElectionPreview from './ElectionPreview';
// import SaveDraftButton from '../common/SaveDraftButton';

// const STEPS = [
//   { id: 1, name: 'Basic Setup', description: 'Election title, description, and scheduling' },
//   { id: 2, name: 'Voting Config', description: 'Voting type and permissions' },
//   { id: 3, name: 'Country Access', description: 'Geographic restrictions' },
//   { id: 4, name: 'Security', description: 'Authentication and biometric settings' },
//   { id: 5, name: 'Branding', description: 'Custom appearance and lottery settings' },
//   { id: 6, name: 'Preview', description: 'Review and publish' }
// ];

// const ElectionCreationWizard = ({ 
//   initialData, 
//   onSave, 
//   isEditing = false,
//   election = null 
// }) => {
//   const [currentStep, setCurrentStep] = useState(1);
//   const [formData, setFormData] = useState({
//     // Basic Information
//     title: '',
//     description: '',
//     topicImageUrl: '',
//     topicVideoUrl: '',
//     logoBrandingUrl: '',
    
//     // Updated Scheduling - now using objects to match DateTimePicker
//     startDate: { date: '', time: '09:00' },
//     endDate: { date: '', time: '18:00' },
//     timezone: 'UTC',
    
//     // Voting Configuration
//     votingType: 'plurality',
//     permissionToVote: 'world_citizens',
//     isPaid: false,
//     participationFee: 0,
    
//     // Country Selection
//     isCountrySpecific: false,
//     countries: [],
    
//     // Access Control
//     biometricRequired: false,
//     authMethod: 'passkey',
//     allowOauth: true,
//     allowMagicLink: true,
//     allowEmailPassword: true,
    
//     // Lottery Settings
//     isLotterized: false,
//     rewardAmount: 0,
//     winnerCount: 1,
    
//     // Results Control
//     showLiveResults: false,
//     allowVoteEditing: false,
    
//     // Branding
//     customVotingUrl: '',
//     customCss: '',
//     brandColors: {
//       primary: '#3B82F6',
//       secondary: '#64748B',
//       accent: '#10B981'
//     },
    
//     // Multi-language
//     primaryLanguage: 'en',
//     supportsMultilang: false,
    
//     ...initialData
//   });

//   const [stepErrors, setStepErrors] = useState({});
//   const [isSaving, setIsSaving] = useState(false);

//   useEffect(() => {
//     if (initialData) {
//       // Handle conversion from old data structure to new structure
//       const processedInitialData = { ...initialData };
      
//       // Convert old string dates to object format if needed
//       if (typeof initialData.startDate === 'string' && initialData.startDate) {
//         processedInitialData.startDate = {
//           date: initialData.startDate,
//           time: initialData.startTime || '09:00'
//         };
//       }
      
//       if (typeof initialData.endDate === 'string' && initialData.endDate) {
//         processedInitialData.endDate = {
//           date: initialData.endDate,
//           time: initialData.endTime || '18:00'
//         };
//       }
      
//       // Ensure objects exist even if not in initial data
//       if (!processedInitialData.startDate) {
//         processedInitialData.startDate = { date: '', time: '09:00' };
//       }
      
//       if (!processedInitialData.endDate) {
//         processedInitialData.endDate = { date: '', time: '18:00' };
//       }
      
//       setFormData(prev => ({ ...prev, ...processedInitialData }));
//     }
//   }, [initialData]);

//   const updateFormData = (updates) => {
//     console.log('updateFormData called with:', updates); // Debug log
//     setFormData(prev => {
//       const newData = { ...prev, ...updates };
//       console.log('New formData shakil:', newData); // Debug log
//       return newData;
//     });
    
//     // Clear step errors when data is updated
//     const currentStepErrors = stepErrors[currentStep];
//     if (currentStepErrors && Object.keys(updates).some(key => currentStepErrors[key])) {
//       setStepErrors(prev => ({
//         ...prev,
//         [currentStep]: Object.fromEntries(
//           /*eslint-disable*/
//           Object.entries(currentStepErrors).filter(([key]) => !updates.hasOwnProperty(key))
//         )
//       }));
//     }
//   };

//   const validateStep = (step) => {
//     const errors = {};

//     switch (step) {
//       case 1: // Basic Setup
//         if (!formData.title?.trim()) {
//           errors.title = 'Title is required';
//         } else if (formData.title.length < 3) {
//           errors.title = 'Title must be at least 3 characters';
//         }

//         if (!formData.startDate?.date) {
//           errors.startDate = 'Start date is required';
//         }

//         if (!formData.endDate?.date) {
//           errors.endDate = 'End date is required';
//         }

//         if (formData.startDate?.date && formData.endDate?.date) {
//           const start = new Date(`${formData.startDate.date}T${formData.startDate.time || '09:00'}`);
//           const end = new Date(`${formData.endDate.date}T${formData.endDate.time || '18:00'}`);
          
//           if (start >= end) {
//             errors.endDate = 'End date/time must be after start date/time';
//           }

//           if (start <= new Date()) {
//             errors.startDate = 'Start date/time must be in the future';
//           }
//         }
//         break;

//       case 2: // Voting Configuration
//         if (formData.isPaid && (!formData.participationFee || formData.participationFee <= 0)) {
//           errors.participationFee = 'Participation fee must be greater than 0 for paid elections';
//         }

//         if (formData.isLotterized) {
//           if (!formData.rewardAmount || formData.rewardAmount <= 0) {
//             errors.rewardAmount = 'Reward amount must be greater than 0 for lottery elections';
//           }
          
//           if (!formData.winnerCount || formData.winnerCount < 1 || formData.winnerCount > 100) {
//             errors.winnerCount = 'Winner count must be between 1 and 100';
//           }
//         }
//         break;

//       case 3: // Country Selection
//         if (formData.permissionToVote === 'country_specific' && formData.countries.length === 0) {
//           errors.countries = 'At least one country must be selected for country-specific elections';
//         }
//         break;

//       case 4: // Access Control
//         // No specific validations for this step
//         break;

//       case 5: // Branding
//         if (formData.customVotingUrl && formData.customVotingUrl.length < 3) {
//           errors.customVotingUrl = 'Custom URL must be at least 3 characters';
//         }
//         break;

//       case 6: // Preview
//         // Validate all previous steps
//         for (let i = 1; i < 6; i++) {
//           const stepValidation = validateStep(i);
//           if (Object.keys(stepValidation).length > 0) {
//             errors[`step${i}`] = `Please fix errors in step ${i}`;
//           }
//         }
//         break;
//     }

//     return errors;
//   };

//   const handleNext = () => {
//     const errors = validateStep(currentStep);
    
//     if (Object.keys(errors).length > 0) {
//       setStepErrors(prev => ({ ...prev, [currentStep]: errors }));
//       toast.error('Please fix the errors before continuing');
//       return;
//     }

//     setStepErrors(prev => ({ ...prev, [currentStep]: {} }));
//     setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
//   };

//   const handlePrevious = () => {
//     setCurrentStep(prev => Math.max(prev - 1, 1));
//   };

//   const handleStepClick = (step) => {
//     // Allow jumping to any previous step or next step if current is valid
//     if (step <= currentStep || step === currentStep + 1) {
//       if (step === currentStep + 1) {
//         handleNext();
//       } else {
//         setCurrentStep(step);
//       }
//     }
//   };

//   const handleSaveDraft = async () => {
//     setIsSaving(true);
//     try {
//       // Convert data structure for backend compatibility
//       const dataForSave = {
//         ...formData,
//         // Convert object dates back to strings for backend if needed
//         startDate: formData.startDate?.date || '',
//         startTime: formData.startDate?.time || '09:00',
//         endDate: formData.endDate?.date || '',
//         endTime: formData.endDate?.time || '18:00'
//       };
      
//       await onSave(dataForSave, 'draft');
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handlePublish = async () => {
//     const errors = validateStep(6);
    
//     if (Object.keys(errors).length > 0) {
//       setStepErrors(prev => ({ ...prev, [6]: errors }));
//       toast.error('Please fix all errors before publishing');
//       return;
//     }

//     setIsSaving(true);
//     try {
//       // Convert data structure for backend compatibility
//       const dataForSave = {
//         ...formData,
//         // Convert object dates back to strings for backend if needed
//         startDate: formData.startDate?.date || '',
//         startTime: formData.startDate?.time || '09:00',
//         endDate: formData.endDate?.date || '',
//         endTime: formData.endDate?.time || '18:00'
//       };
      
//       await onSave(dataForSave, 'publish');
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const renderStepContent = () => {
//     const stepProps = {
//       formData,
//       updateFormData,
//       errors: stepErrors[currentStep] || {},
//       isEditing
//     };

//     switch (currentStep) {
//       case 1:
//         return <BasicElectionSetup {...stepProps} />;
//       case 2:
//         return <VotingConfiguration {...stepProps} />;
//       case 3:
//         return <CountrySelection {...stepProps} />;
//       case 4:
//         return <AccessControlSettings {...stepProps} />;
//       case 5:
//         return <BrandingCustomization {...stepProps} />;
//       case 6:
//         return <ElectionPreview {...stepProps} election={election} />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto">
//       {/* Header with Step Indicator */}
//       <div className="mb-8">
//         <StepIndicator
//           steps={STEPS}
//           currentStep={currentStep}
//           onStepClick={handleStepClick}
//           errors={stepErrors}
//         />
//       </div>

//       {/* Step Content */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//         <div className="p-6">
//           {renderStepContent()}
//         </div>

//         {/* Navigation Footer */}
//         <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               {currentStep > 1 && (
//                 <button
//                   type="button"
//                   onClick={handlePrevious}
//                   className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 >
//                   Previous
//                 </button>
//               )}

//               <SaveDraftButton
//                 onClick={handleSaveDraft}
//                 isSaving={isSaving}
//                 disabled={isSaving}
//               />
//             </div>

//             <div className="flex items-center space-x-3">
//               {currentStep < STEPS.length ? (
//                 <button
//                   type="button"
//                   onClick={handleNext}
//                   className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 >
//                   Next
//                 </button>
//               ) : (
//                 <div className="flex space-x-3">
//                   <button
//                     type="button"
//                     onClick={handleSaveDraft}
//                     disabled={isSaving}
//                     className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {isSaving ? 'Saving...' : 'Save as Draft'}
//                   </button>
                  
//                   <button
//                     type="button"
//                     onClick={handlePublish}
//                     disabled={isSaving}
//                     className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {isSaving ? 'Publishing...' : (isEditing ? 'Update Election' : 'Publish Election')}
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Progress Information */}
//       <div className="mt-4 text-center">
//         <p className="text-sm text-gray-500">
//           Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1]?.description}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default ElectionCreationWizard;
