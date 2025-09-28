//this is without token and below with token
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-hot-toast';
import {
  DocumentTextIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  UserGroupIcon,
  PhotoIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';
//import electionService from '../services/election/electionService';
import ProgressSteps from '../components/election/ProgressSteps';
import BasicInfo from '../components/election/BasicInfo';
import Schedule from '../components/election/Schedule';
import VotingSetup from '../components/election/VotingSetup';
import AdvancedSettings from '../components/election/AdvancedSettings';
//import ElectionService from '../services/election/ElectionService';
import { useElection } from '../contexts/ElectionContext/useElection';
import eeelllectionService from '../services/election/EeellllectionService';


const CreateElection = () => {
  const { dispatch } = useElection();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    // Removed category field
    votingType: 'plurality',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    fee: 0,
    biometricRequired: false,
    permissions: 'global',
    countryRestriction: '',
    groupId: '',
    organizationId: '',
    allowVoteChanges: true,
    showResultsDuringVoting: false,
    questions: [
      {
        id: 1,
        type: 'multiple_choice',
        question: '',
        options: ['', ''],
        required: true
      }
    ],
    media: {
      logo: null,
      coverImage: null,
      videos: []
    }
  });

  const steps = [
    { number: 1, name: 'Basic Info', description: 'Title and description' },
    { number: 2, name: 'Voting Setup', description: 'Questions and voting method' },
    { number: 3, name: 'Schedule', description: 'Dates, times, and permissions' },
    { number: 4, name: 'Settings', description: 'Advanced options and review' }
  ];

  // Form data handlers
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Question handlers
  const handleQuestionChange = (questionId, field, value) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId ? { ...q, [field]: value } : q
      )
    }));
  };

  const handleOptionChange = (questionId, optionIndex, value) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((option, index) =>
                index === optionIndex ? value : option
              )
            }
          : q
      )
    }));
  };

  const addOption = (questionId) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId
          ? { ...q, options: [...q.options, ''] }
          : q
      )
    }));
  };

  const removeOption = (questionId, optionIndex) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId
          ? { ...q, options: q.options.filter((_, index) => index !== optionIndex) }
          : q
      )
    }));
  };

  const addQuestion = () => {
    let newQuestion = {
      id: Date.now(),
      type: 'multiple_choice',
      question: '',
      options: ['', ''],
      required: true
    };

    // Adjust defaults based on voting type
    if (formData.votingType === 'ranked_choice' || formData.votingType === 'approval') {
      newQuestion.options = ['', '', '']; // Start with 3 options
    }

    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  const removeQuestion = (questionId) => {
    if (formData.questions.length > 1) {
      setFormData(prev => ({
        ...prev,
        questions: prev.questions.filter(q => q.id !== questionId)
      }));
    }
  };

  // Media handlers
  const handleMediaUpload = (type, file) => {
    setFormData(prev => ({
      ...prev,
      media: {
        ...prev.media,
        [type]: file
      }
    }));
  };

  // Form submission
  // Form submission
const handleSubmit = async (isDraft = false) => {
  setIsLoading(true);

  try {
    // Client-side validation
    if (!formData.title.trim()) {
      toast.error('Election title is required');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Election description is required');
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      toast.error('Start and end dates are required');
      return;
    }

    if (new Date(`${formData.endDate}T${formData.endTime}`) <= new Date(`${formData.startDate}T${formData.startTime}`)) {
      toast.error('End date must be after start date');
      return;
    }

    // Validate questions
    for (const question of formData.questions) {
      if (!question.question.trim()) {
        toast.error('All questions must have text');
        return;
      }

      const validOptions = question.options.filter(opt => opt.trim());
      if (validOptions.length < 2) {
        toast.error('Each question must have at least 2 options');
        return;
      }
    }

    // Show progress toast
    const loadingToast = toast.loading(
      isDraft ? 'Saving election as draft...' : 'Creating election...'
    );

    try {
      // Call the election service to create election with questions and answers
      const result = await eeelllectionService.createElection(formData, isDraft);

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      // Show success message
      toast.success(result.message);

      console.log('Election created successfully:', result);

      // ⬅️ Update election context here
      dispatch({ type: "ADD_ELECTION", payload: result.data });

      // Navigate to elections list or the created election
      navigate('/elections');

    } catch (apiError) {
      // Dismiss loading toast
      toast.dismiss(loadingToast);

      // Show specific error message from API
      toast.error(apiError.message);
      console.error('API Error:', apiError);
    }

  } catch (error) {
    console.error('Unexpected error creating election:', error);
    toast.error('An unexpected error occurred. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

  // const handleSubmit = async (isDraft = false) => {
  //   setIsLoading(true);
    
  //   try {
  //     // Client-side validation
  //     if (!formData.title.trim()) {
  //       toast.error('Election title is required');
  //       return;
  //     }

  //     if (!formData.description.trim()) {
  //       toast.error('Election description is required');
  //       return;
  //     }

  //     if (!formData.startDate || !formData.endDate) {
  //       toast.error('Start and end dates are required');
  //       return;
  //     }

  //     if (new Date(`${formData.endDate}T${formData.endTime}`) <= new Date(`${formData.startDate}T${formData.startTime}`)) {
  //       toast.error('End date must be after start date');
  //       return;
  //     }

  //     // Validate questions
  //     for (const question of formData.questions) {
  //       if (!question.question.trim()) {
  //         toast.error('All questions must have text');
  //         return;
  //       }
        
  //       const validOptions = question.options.filter(opt => opt.trim());
  //       if (validOptions.length < 2) {
  //         toast.error('Each question must have at least 2 options');
  //         return;
  //       }
  //     }

  //     // Show progress toast
  //     const loadingToast = toast.loading(
  //       isDraft ? 'Saving election as draft...' : 'Creating election...'
  //     );

  //     try {
  //       // Call the election service to create election with questions and answers
  //       const result = await ElectionService.createElection(formData, isDraft);
        
  //       // Dismiss loading toast
  //       toast.dismiss(loadingToast);
        
  //       // Show success message
  //       toast.success(result.message);
        
  //       console.log('Election created successfully:', result);
        
  //       // Navigate to elections list or the created election
  //       navigate('/elections');
        
  //     } catch (apiError) {
  //       // Dismiss loading toast
  //       toast.dismiss(loadingToast);
        
  //       // Show specific error message from API
  //       toast.error(apiError.message);
  //       console.error('API Error:', apiError);
  //     }

  //   } catch (error) {
  //     console.error('Unexpected error creating election:', error);
  //     toast.error('An unexpected error occurred. Please try again.');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // Navigation helpers
  const nextStep = () => setCurrentStep(Math.min(4, currentStep + 1));
  const prevStep = () => setCurrentStep(Math.max(1, currentStep - 1));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900">Create New Election</h1>
        <p className="mt-1 text-sm text-gray-500">
          Set up a new voting campaign with custom questions and settings
        </p>
      </div>

      {/* Progress Steps */}
      <ProgressSteps steps={steps} currentStep={currentStep} />

      {/* Step Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <BasicInfo 
            formData={formData}
            handleInputChange={handleInputChange}
            handleMediaUpload={handleMediaUpload}
          />
        )}

        {/* Step 2: Voting Setup */}
        {currentStep === 2 && (
          <VotingSetup 
            formData={formData}
            handleInputChange={handleInputChange}
            questionHandlers={{
              handleQuestionChange,
              handleOptionChange,
              addOption,
              removeOption,
              addQuestion,
              removeQuestion
            }}
          />
        )}

        {/* Step 3: Schedule */}
        {currentStep === 3 && (
          <Schedule 
            formData={formData}
            handleInputChange={handleInputChange}
          />
        )}

        {/* Step 4: Settings */}
        {currentStep === 4 && (
          <AdvancedSettings 
            formData={formData}
            handleInputChange={handleInputChange}
          />
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex space-x-3">
            {currentStep === 4 && (
              <button
                onClick={() => handleSubmit(true)}
                disabled={isLoading}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Save as Draft
              </button>
            )}

            {currentStep < 4 ? (
              <button
                onClick={nextStep}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                onClick={() => handleSubmit(false)}
                disabled={isLoading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {isLoading ? 'Creating...' : 'Create Election'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateElection;
// //after diving
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router';
// import { toast } from 'react-hot-toast';
// import {
//   DocumentTextIcon,
//   CalendarIcon,
//   CurrencyDollarIcon,
//   ShieldCheckIcon,
//   GlobeAltIcon,
//   UserGroupIcon,
//   PhotoIcon,
//   VideoCameraIcon
// } from '@heroicons/react/24/outline';
// import electionService from '../services/election/electionService';
// import ProgressSteps from '../components/election/ProgressSteps';
// import BasicInfo from '../components/election/BasicInfo';
// import Schedule from '../components/election/Schedule';
// import VotingSetup from '../components/election/VotingSetup';
// import AdvancedSettings from '../components/election/AdvancedSettings';


// const CreateElection = () => {
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(false);
//   const [currentStep, setCurrentStep] = useState(1);

//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     category: '',
//     votingType: 'plurality',
//     startDate: '',
//     startTime: '',
//     endDate: '',
//     endTime: '',
//     timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
//     fee: 0,
//     biometricRequired: false,
//     permissions: 'global',
//     countryRestriction: '',
//     groupId: '',
//     organizationId: '',
//     allowVoteChanges: true,
//     showResultsDuringVoting: false,
//     questions: [
//       {
//         id: 1,
//         type: 'multiple_choice',
//         question: '',
//         options: ['', ''],
//         required: true
//       }
//     ],
//     media: {
//       logo: null,
//       coverImage: null,
//       videos: []
//     }
//   });

//   const steps = [
//     { number: 1, name: 'Basic Info', description: 'Title, description, and category' },
//     { number: 2, name: 'Voting Setup', description: 'Questions and voting method' },
//     { number: 3, name: 'Schedule', description: 'Dates, times, and permissions' },
//     { number: 4, name: 'Settings', description: 'Advanced options and review' }
//   ];

//   // Form data handlers
//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   // Question handlers
//   const handleQuestionChange = (questionId, field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       questions: prev.questions.map(q =>
//         q.id === questionId ? { ...q, [field]: value } : q
//       )
//     }));
//   };

//   const handleOptionChange = (questionId, optionIndex, value) => {
//     setFormData(prev => ({
//       ...prev,
//       questions: prev.questions.map(q =>
//         q.id === questionId
//           ? {
//               ...q,
//               options: q.options.map((option, index) =>
//                 index === optionIndex ? value : option
//               )
//             }
//           : q
//       )
//     }));
//   };

//   const addOption = (questionId) => {
//     setFormData(prev => ({
//       ...prev,
//       questions: prev.questions.map(q =>
//         q.id === questionId
//           ? { ...q, options: [...q.options, ''] }
//           : q
//       )
//     }));
//   };

//   const removeOption = (questionId, optionIndex) => {
//     setFormData(prev => ({
//       ...prev,
//       questions: prev.questions.map(q =>
//         q.id === questionId
//           ? { ...q, options: q.options.filter((_, index) => index !== optionIndex) }
//           : q
//       )
//     }));
//   };

//   const addQuestion = () => {
//     let newQuestion = {
//       id: Date.now(),
//       type: 'multiple_choice',
//       question: '',
//       options: ['', ''],
//       required: true
//     };

//     // Adjust defaults based on voting type
//     if (formData.votingType === 'ranked_choice' || formData.votingType === 'approval') {
//       newQuestion.options = ['', '', '']; // Start with 3 options
//     }

//     setFormData(prev => ({
//       ...prev,
//       questions: [...prev.questions, newQuestion]
//     }));
//   };

//   const removeQuestion = (questionId) => {
//     if (formData.questions.length > 1) {
//       setFormData(prev => ({
//         ...prev,
//         questions: prev.questions.filter(q => q.id !== questionId)
//       }));
//     }
//   };

//   // Media handlers
//   const handleMediaUpload = (type, file) => {
//     setFormData(prev => ({
//       ...prev,
//       media: {
//         ...prev.media,
//         [type]: file
//       }
//     }));
//   };

//   // Form submission
//   const handleSubmit = async (isDraft = false) => {
//     setIsLoading(true);
    
//     try {
//       // Client-side validation
//       if (!formData.title.trim()) {
//         toast.error('Election title is required');
//         return;
//       }

//       if (!formData.description.trim()) {
//         toast.error('Election description is required');
//         return;
//       }

//       if (!formData.startDate || !formData.endDate) {
//         toast.error('Start and end dates are required');
//         return;
//       }

//       if (new Date(`${formData.endDate}T${formData.endTime}`) <= new Date(`${formData.startDate}T${formData.startTime}`)) {
//         toast.error('End date must be after start date');
//         return;
//       }

//       // Validate questions
//       for (const question of formData.questions) {
//         if (!question.question.trim()) {
//           toast.error('All questions must have text');
//           return;
//         }
        
//         const validOptions = question.options.filter(opt => opt.trim());
//         if (validOptions.length < 2) {
//           toast.error('Each question must have at least 2 options');
//           return;
//         }
//       }

//       // Show progress toast
//       const loadingToast = toast.loading(
//         isDraft ? 'Saving election as draft...' : 'Creating election...'
//       );

//       try {
//         // Call the election service to create election with questions and answers
//         const result = await electionService.createElection(formData, isDraft);
        
//         // Dismiss loading toast
//         toast.dismiss(loadingToast);
        
//         // Show success message
//         toast.success(result.message);
        
//         console.log('Election created successfully:', result);
        
//         // Navigate to elections list or the created election
//         navigate('/elections');
        
//       } catch (apiError) {
//         // Dismiss loading toast
//         toast.dismiss(loadingToast);
        
//         // Show specific error message from API
//         toast.error(apiError.message);
//         console.error('API Error:', apiError);
//       }

//     } catch (error) {
//       console.error('Unexpected error creating election:', error);
//       toast.error('An unexpected error occurred. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Navigation helpers
//   const nextStep = () => setCurrentStep(Math.min(4, currentStep + 1));
//   const prevStep = () => setCurrentStep(Math.max(1, currentStep - 1));

//   return (
//     <div className="max-w-4xl mx-auto space-y-6">
//       {/* Header */}
//       <div className="bg-white rounded-lg border border-gray-200 p-6">
//         <h1 className="text-2xl font-bold text-gray-900">Create New Election</h1>
//         <p className="mt-1 text-sm text-gray-500">
//           Set up a new voting campaign with custom questions and settings
//         </p>
//       </div>

//       {/* Progress Steps */}
//       <ProgressSteps steps={steps} currentStep={currentStep} />

//       {/* Step Content */}
//       <div className="bg-white rounded-lg border border-gray-200 p-6">
//         {/* Step 1: Basic Info */}
//         {currentStep === 1 && (
//           <BasicInfo 
//             formData={formData}
//             handleInputChange={handleInputChange}
//             handleMediaUpload={handleMediaUpload}
//           />
//         )}

//         {/* Step 2: Voting Setup */}
//         {currentStep === 2 && (
//           <VotingSetup 
//             formData={formData}
//             handleInputChange={handleInputChange}
//             questionHandlers={{
//               handleQuestionChange,
//               handleOptionChange,
//               addOption,
//               removeOption,
//               addQuestion,
//               removeQuestion
//             }}
//           />
//         )}

//         {/* Step 3: Schedule */}
//         {currentStep === 3 && (
//           <Schedule 
//             formData={formData}
//             handleInputChange={handleInputChange}
//           />
//         )}

//         {/* Step 4: Settings */}
//         {currentStep === 4 && (
//           <AdvancedSettings 
//             formData={formData}
//             handleInputChange={handleInputChange}
//           />
//         )}

//         {/* Navigation Buttons */}
//         <div className="flex justify-between pt-6 border-t border-gray-200">
//           <button
//             onClick={prevStep}
//             disabled={currentStep === 1}
//             className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             Previous
//           </button>

//           <div className="flex space-x-3">
//             {currentStep === 4 && (
//               <button
//                 onClick={() => handleSubmit(true)}
//                 disabled={isLoading}
//                 className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
//               >
//                 Save as Draft
//               </button>
//             )}

//             {currentStep < 4 ? (
//               <button
//                 onClick={nextStep}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//               >
//                 Next
//               </button>
//             ) : (
//               <button
//                 onClick={() => handleSubmit(false)}
//                 disabled={isLoading}
//                 className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
//               >
//                 {isLoading ? 'Creating...' : 'Create Election'}
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateElection;
// //with dynamic data
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router';
// import { toast } from 'react-hot-toast';
// import {
//   DocumentTextIcon,
//   CalendarIcon,
//   CurrencyDollarIcon,
//   ShieldCheckIcon,
//   GlobeAltIcon,
//   UserGroupIcon,
//   PhotoIcon,
//   VideoCameraIcon,
//   PlusIcon,
//   TrashIcon
// } from '@heroicons/react/24/outline';
// import electionService from '../services/election/electionService';

// const CreateElection = () => {
//   const navigate = useNavigate();

//   const [isLoading, setIsLoading] = useState(false);
//   const [currentStep, setCurrentStep] = useState(1);

//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     category: '',
//     votingType: 'plurality',
//     startDate: '',
//     startTime: '',
//     endDate: '',
//     endTime: '',
//     timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
//     fee: 0,
//     biometricRequired: false,
//     permissions: 'global',
//     countryRestriction: '',
//     groupId: '',
//     organizationId: '',
//     allowVoteChanges: true,
//     showResultsDuringVoting: false,
//     questions: [
//       {
//         id: 1,
//         type: 'multiple_choice',
//         question: '',
//         options: ['', ''],
//         required: true
//       }
//     ],
//     media: {
//       logo: null,
//       coverImage: null,
//       videos: []
//     }
//   });

//   const votingTypes = [
//     {
//       value: 'plurality',
//       name: 'Plurality Voting',
//       description: 'Single choice selection - voters pick one option',
//       icon: '1️⃣'
//     },
//     {
//       value: 'ranked_choice',
//       name: 'Ranked Choice Voting',
//       description: 'Voters rank options by preference',
//       icon: '📊'
//     },
//     {
//       value: 'approval',
//       name: 'Approval Voting',
//       description: 'Voters can approve multiple options',
//       icon: '✅'
//     }
//   ];

//   const categories = [
//     'Politics & Government',
//     'Technology',
//     'Environment',
//     'Business',
//     'Education',
//     'Entertainment',
//     'Sports',
//     'Lifestyle',
//     'Health',
//     'Community'
//   ];

//   const permissionTypes = [
//     {
//       value: 'global',
//       name: 'Global',
//       description: 'Anyone worldwide can participate',
//       icon: GlobeAltIcon
//     },
//     {
//       value: 'country',
//       name: 'Country Specific',
//       description: 'Restrict to specific countries',
//       icon: GlobeAltIcon
//     },
//     {
//       value: 'group',
//       name: 'Group Only',
//       description: 'Only group members can vote',
//       icon: UserGroupIcon
//     },
//     {
//       value: 'organization',
//       name: 'Organization Only',
//       description: 'Only organization members',
//       icon: UserGroupIcon
//     }
//   ];

//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const handleQuestionChange = (questionId, field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       questions: prev.questions.map(q =>
//         q.id === questionId ? { ...q, [field]: value } : q
//       )
//     }));
//   };

//   const handleOptionChange = (questionId, optionIndex, value) => {
//     setFormData(prev => ({
//       ...prev,
//       questions: prev.questions.map(q =>
//         q.id === questionId
//           ? {
//               ...q,
//               options: q.options.map((option, index) =>
//                 index === optionIndex ? value : option
//               )
//             }
//           : q
//       )
//     }));
//   };

//   const addOption = (questionId) => {
//     setFormData(prev => ({
//       ...prev,
//       questions: prev.questions.map(q =>
//         q.id === questionId
//           ? { ...q, options: [...q.options, ''] }
//           : q
//       )
//     }));
//   };

//   const removeOption = (questionId, optionIndex) => {
//     setFormData(prev => ({
//       ...prev,
//       questions: prev.questions.map(q =>
//         q.id === questionId
//           ? { ...q, options: q.options.filter((_, index) => index !== optionIndex) }
//           : q
//       )
//     }));
//   };

//   const addQuestion = () => {
//     const newQuestion = {
//       id: Date.now(),
//       type: 'multiple_choice',
//       question: '',
//       options: ['', ''],
//       required: true
//     };
//     setFormData(prev => ({
//       ...prev,
//       questions: [...prev.questions, newQuestion]
//     }));
//   };

//   const removeQuestion = (questionId) => {
//     if (formData.questions.length > 1) {
//       setFormData(prev => ({
//         ...prev,
//         questions: prev.questions.filter(q => q.id !== questionId)
//       }));
//     }
//   };

//   // Updated handleSubmit function with real API integration
//   const handleSubmit = async (isDraft = false) => {
//     setIsLoading(true);
    
//     try {
//       // Client-side validation
//       if (!formData.title.trim()) {
//         toast.error('Election title is required');
//         return;
//       }

//       if (!formData.description.trim()) {
//         toast.error('Election description is required');
//         return;
//       }

//       if (!formData.startDate || !formData.endDate) {
//         toast.error('Start and end dates are required');
//         return;
//       }

//       if (new Date(`${formData.endDate}T${formData.endTime}`) <= new Date(`${formData.startDate}T${formData.startTime}`)) {
//         toast.error('End date must be after start date');
//         return;
//       }

//       // Validate questions
//       for (const question of formData.questions) {
//         if (!question.question.trim()) {
//           toast.error('All questions must have text');
//           return;
//         }
        
//         const validOptions = question.options.filter(opt => opt.trim());
//         if (validOptions.length < 2) {
//           toast.error('Each question must have at least 2 options');
//           return;
//         }
//       }

//       // Show progress toast
//       const loadingToast = toast.loading(
//         isDraft ? 'Saving election as draft...' : 'Creating election...'
//       );

//       try {
//         // Call the election service to create election with questions and answers
//         const result = await electionService.createElection(formData, isDraft);
        
//         // Dismiss loading toast
//         toast.dismiss(loadingToast);
        
//         // Show success message
//         toast.success(result.message);
        
//         console.log('Election created successfully:', result);
        
//         // Navigate to elections list or the created election
//         navigate('/elections');
        
//       } catch (apiError) {
//         // Dismiss loading toast
//         toast.dismiss(loadingToast);
        
//         // Show specific error message from API
//         toast.error(apiError.message);
//         console.error('API Error:', apiError);
//       }

//     } catch (error) {
//       console.error('Unexpected error creating election:', error);
//       toast.error('An unexpected error occurred. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const steps = [
//     { number: 1, name: 'Basic Info', description: 'Title, description, and category' },
//     { number: 2, name: 'Voting Setup', description: 'Questions and voting method' },
//     { number: 3, name: 'Schedule', description: 'Dates, times, and permissions' },
//     { number: 4, name: 'Settings', description: 'Advanced options and review' }
//   ];

//   return (
//     <div className="max-w-4xl mx-auto space-y-6">
//       {/* Header */}
//       <div className="bg-white rounded-lg border border-gray-200 p-6">
//         <h1 className="text-2xl font-bold text-gray-900">Create New Election</h1>
//         <p className="mt-1 text-sm text-gray-500">
//           Set up a new voting campaign with custom questions and settings
//         </p>
//       </div>

//       {/* Progress Steps */}
//       <div className="bg-white rounded-lg border border-gray-200 p-6">
//         <nav className="flex items-center justify-center">
//           <ol className="flex items-center space-x-5">
//             {steps.map((step) => (
//               <li key={step.number} className="flex items-center">
//                 <div className="flex items-center">
//                   <div
//                     className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
//                       currentStep >= step.number
//                         ? 'bg-blue-600 border-blue-600 text-white'
//                         : 'border-gray-300 text-gray-500'
//                     }`}
//                   >
//                     {step.number}
//                   </div>
//                   <div className="ml-4 min-w-0">
//                     <p className={`text-sm font-medium ${
//                       currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'
//                     }`}>
//                       {step.name}
//                     </p>
//                     <p className="text-xs text-gray-500">{step.description}</p>
//                   </div>
//                 </div>
//                 {step.number < steps.length && (
//                   <div className="ml-5 w-8 h-0.5 bg-gray-200"></div>
//                 )}
//               </li>
//             ))}
//           </ol>
//         </nav>
//       </div>

//       {/* Step Content */}
//       <div className="bg-white rounded-lg border border-gray-200 p-6">
//         {/* Step 1: Basic Info */}
//         {currentStep === 1 && (
//           <div className="space-y-6">
//             <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Election Title *
//               </label>
//               <input
//                 type="text"
//                 value={formData.title}
//                 onChange={(e) => handleInputChange('title', e.target.value)}
//                 placeholder="Enter a clear, descriptive title"
//                 className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Description *
//               </label>
//               <textarea
//                 rows={4}
//                 value={formData.description}
//                 onChange={(e) => handleInputChange('description', e.target.value)}
//                 placeholder="Provide details about what you're voting on and any important context"
//                 className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Category
//               </label>
//               <select
//                 value={formData.category}
//                 onChange={(e) => handleInputChange('category', e.target.value)}
//                 className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//               >
//                 <option value="">Select a category</option>
//                 {categories.map(category => (
//                   <option key={category} value={category.toLowerCase().replace(/\s+/g, '_')}>
//                     {category}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   <PhotoIcon className="h-4 w-4 inline mr-1" />
//                   Cover Image
//                 </label>
//                 <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
//                   <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
//                   <div className="mt-2">
//                     <button className="text-blue-600 hover:text-blue-500">
//                       Upload image
//                     </button>
//                     <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   <PhotoIcon className="h-4 w-4 inline mr-1" />
//                   Logo/Branding
//                 </label>
//                 <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
//                   <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
//                   <div className="mt-2">
//                     <button className="text-blue-600 hover:text-blue-500">
//                       Upload logo
//                     </button>
//                     <p className="text-xs text-gray-500 mt-1">Square format preferred</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Step 2: Voting Setup */}
//         {currentStep === 2 && (
//           <div className="space-y-6">
//             <h3 className="text-lg font-medium text-gray-900">Voting Method & Questions</h3>
            
//             {/* Voting Type Selection */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-4">
//                 Choose Voting Method *
//               </label>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 {votingTypes.map(type => (
//                   <div
//                     key={type.value}
//                     className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
//                       formData.votingType === type.value
//                         ? 'border-blue-500 bg-blue-50'
//                         : 'border-gray-200 hover:border-gray-300'
//                     }`}
//                     onClick={() => handleInputChange('votingType', type.value)}
//                   >
//                     <div className="text-2xl mb-2">{type.icon}</div>
//                     <h4 className="font-medium text-gray-900">{type.name}</h4>
//                     <p className="text-sm text-gray-500 mt-1">{type.description}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Questions */}
//             <div>
//               <div className="flex items-center justify-between mb-4">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Questions *
//                 </label>
//                 <button
//                   onClick={addQuestion}
//                   className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
//                 >
//                   <PlusIcon className="h-4 w-4 mr-1" />
//                   Add Question
//                 </button>
//               </div>

//               <div className="space-y-6">
//                 {formData.questions.map((question, index) => (
//                   <div key={question.id} className="border border-gray-200 rounded-lg p-4">
//                     <div className="flex items-center justify-between mb-4">
//                       <h4 className="font-medium text-gray-900">Question {index + 1}</h4>
//                       {formData.questions.length > 1 && (
//                         <button
//                           onClick={() => removeQuestion(question.id)}
//                           className="text-red-600 hover:text-red-700"
//                         >
//                           <TrashIcon className="h-4 w-4" />
//                         </button>
//                       )}
//                     </div>

//                     <div className="mb-4">
//                       <input
//                         type="text"
//                         value={question.question}
//                         onChange={(e) => handleQuestionChange(question.id, 'question', e.target.value)}
//                         placeholder="Enter your question"
//                         className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Options
//                       </label>
//                       <div className="space-y-2">
//                         {question.options.map((option, optionIndex) => (
//                           <div key={optionIndex} className="flex items-center space-x-2">
//                             <input
//                               type="text"
//                               value={option}
//                               onChange={(e) => handleOptionChange(question.id, optionIndex, e.target.value)}
//                               placeholder={`Option ${optionIndex + 1}`}
//                               className="flex-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                             />
//                             {question.options.length > 2 && (
//                               <button
//                                 onClick={() => removeOption(question.id, optionIndex)}
//                                 className="text-red-600 hover:text-red-700"
//                               >
//                                 <TrashIcon className="h-4 w-4" />
//                               </button>
//                             )}
//                           </div>
//                         ))}
//                         <button
//                           onClick={() => addOption(question.id)}
//                           className="text-blue-600 hover:text-blue-700 text-sm font-medium"
//                         >
//                           + Add Option
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Step 3: Schedule */}
//         {currentStep === 3 && (
//           <div className="space-y-6">
//             <h3 className="text-lg font-medium text-gray-900">Schedule & Access</h3>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Start Date & Time *
//                 </label>
//                 <div className="grid grid-cols-2 gap-2">
//                   <input
//                     type="date"
//                     value={formData.startDate}
//                     onChange={(e) => handleInputChange('startDate', e.target.value)}
//                     className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                   />
//                   <input
//                     type="time"
//                     value={formData.startTime}
//                     onChange={(e) => handleInputChange('startTime', e.target.value)}
//                     className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   End Date & Time *
//                 </label>
//                 <div className="grid grid-cols-2 gap-2">
//                   <input
//                     type="date"
//                     value={formData.endDate}
//                     onChange={(e) => handleInputChange('endDate', e.target.value)}
//                     className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                   />
//                   <input
//                     type="time"
//                     value={formData.endTime}
//                     onChange={(e) => handleInputChange('endTime', e.target.value)}
//                     className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Timezone
//               </label>
//               <select
//                 value={formData.timezone}
//                 onChange={(e) => handleInputChange('timezone', e.target.value)}
//                 className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//               >
//                 <option value={Intl.DateTimeFormat().resolvedOptions().timeZone}>
//                   {Intl.DateTimeFormat().resolvedOptions().timeZone} (Auto-detected)
//                 </option>
//               </select>
//             </div>

//             {/* Permission Settings */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-4">
//                 Who can participate? *
//               </label>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {permissionTypes.map(permission => {
//                   const Icon = permission.icon;
//                   return (
//                     <div
//                       key={permission.value}
//                       className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
//                         formData.permissions === permission.value
//                           ? 'border-blue-500 bg-blue-50'
//                           : 'border-gray-200 hover:border-gray-300'
//                       }`}
//                       onClick={() => handleInputChange('permissions', permission.value)}
//                     >
//                       <Icon className="h-6 w-6 text-gray-600 mb-2" />
//                       <h4 className="font-medium text-gray-900">{permission.name}</h4>
//                       <p className="text-sm text-gray-500 mt-1">{permission.description}</p>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Country Restriction (if country-specific) */}
//             {formData.permissions === 'country' && (
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Select Countries
//                 </label>
//                 <select
//                   value={formData.countryRestriction}
//                   onChange={(e) => handleInputChange('countryRestriction', e.target.value)}
//                   className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="">Select countries...</option>
//                   <option value="US">United States</option>
//                   <option value="CA">Canada</option>
//                   <option value="UK">United Kingdom</option>
//                   <option value="DE">Germany</option>
//                   <option value="FR">France</option>
//                   <option value="BD">Bangladesh</option>
//                   <option value="IN">India</option>
//                 </select>
//               </div>
//             )}

//             {/* Group/Organization ID (if applicable) */}
//             {(formData.permissions === 'group' || formData.permissions === 'organization') && (
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   {formData.permissions === 'group' ? 'Group ID' : 'Organization ID'}
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.permissions === 'group' ? formData.groupId : formData.organizationId}
//                   onChange={(e) => handleInputChange(
//                     formData.permissions === 'group' ? 'groupId' : 'organizationId', 
//                     e.target.value
//                   )}
//                   placeholder={`Enter ${formData.permissions} identifier`}
//                   className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
//             )}

//             {/* Participation Fee */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 <CurrencyDollarIcon className="h-4 w-4 inline mr-1" />
//                 Participation Fee (USD)
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <span className="text-gray-500 sm:text-sm">$</span>
//                 </div>
//                 <input
//                   type="number"
//                   min="0"
//                   step="0.01"
//                   value={formData.fee}
//                   onChange={(e) => handleInputChange('fee', parseFloat(e.target.value) || 0)}
//                   placeholder="0.00"
//                   className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
//               <p className="text-xs text-gray-500 mt-1">
//                 Set to 0 for free elections. Fees help prevent spam and fund prizes.
//               </p>
//             </div>
//           </div>
//         )}

//         {/* Step 4: Settings */}
//         {currentStep === 4 && (
//           <div className="space-y-6">
//             <h3 className="text-lg font-medium text-gray-900">Advanced Settings & Review</h3>
            
//             {/* Security & Privacy Settings */}
//             <div className="bg-gray-50 rounded-lg p-6">
//               <h4 className="font-medium text-gray-900 mb-4">Security & Privacy</h4>
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <div className="flex items-center">
//                       <ShieldCheckIcon className="h-5 w-5 text-gray-400 mr-2" />
//                       <span className="font-medium text-gray-900">Require Biometric Authentication</span>
//                     </div>
//                     <p className="text-sm text-gray-500 ml-7">
//                       Voters must verify identity with fingerprint/face ID
//                     </p>
//                   </div>
//                   <button
//                     onClick={() => handleInputChange('biometricRequired', !formData.biometricRequired)}
//                     className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
//                       formData.biometricRequired ? 'bg-blue-600' : 'bg-gray-200'
//                     }`}
//                   >
//                     <span
//                       className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
//                         formData.biometricRequired ? 'translate-x-5' : 'translate-x-0'
//                       }`}
//                     />
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Voting Settings */}
//             <div className="bg-gray-50 rounded-lg p-6">
//               <h4 className="font-medium text-gray-900 mb-4">Voting Behavior</h4>
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <span className="font-medium text-gray-900">Allow Vote Changes</span>
//                     <p className="text-sm text-gray-500">
//                       Voters can modify their votes before election ends
//                     </p>
//                   </div>
//                   <button
//                     onClick={() => handleInputChange('allowVoteChanges', !formData.allowVoteChanges)}
//                     className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
//                       formData.allowVoteChanges ? 'bg-blue-600' : 'bg-gray-200'
//                     }`}
//                   >
//                     <span
//                       className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
//                         formData.allowVoteChanges ? 'translate-x-5' : 'translate-x-0'
//                       }`}
//                     />
//                   </button>
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <div>
//                     <span className="font-medium text-gray-900">Show Live Results</span>
//                     <p className="text-sm text-gray-500">
//                       Display vote counts while election is active
//                     </p>
//                   </div>
//                   <button
//                     onClick={() => handleInputChange('showResultsDuringVoting', !formData.showResultsDuringVoting)}
//                     className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
//                       formData.showResultsDuringVoting ? 'bg-blue-600' : 'bg-gray-200'
//                     }`}
//                   >
//                     <span
//                       className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
//                         formData.showResultsDuringVoting ? 'translate-x-5' : 'translate-x-0'
//                       }`}
//                     />
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Election Summary */}
//             <div className="bg-blue-50 rounded-lg p-6">
//               <h4 className="font-medium text-gray-900 mb-4">Election Summary</h4>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//                 <div>
//                   <span className="font-medium text-gray-700">Title:</span>
//                   <p className="text-gray-900">{formData.title || 'Not set'}</p>
//                 </div>
//                 <div>
//                   <span className="font-medium text-gray-700">Voting Method:</span>
//                   <p className="text-gray-900 capitalize">{formData.votingType.replace('_', ' ')}</p>
//                 </div>
//                 <div>
//                   <span className="font-medium text-gray-700">Questions:</span>
//                   <p className="text-gray-900">{formData.questions.length}</p>
//                 </div>
//                 <div>
//                   <span className="font-medium text-gray-700">Duration:</span>
//                   <p className="text-gray-900">
//                     {formData.startDate && formData.endDate 
//                       ? `${formData.startDate} to ${formData.endDate}`
//                       : 'Not set'
//                     }
//                   </p>
//                 </div>
//                 <div>
//                   <span className="font-medium text-gray-700">Participation:</span>
//                   <p className="text-gray-900 capitalize">{formData.permissions}</p>
//                 </div>
//                 <div>
//                   <span className="font-medium text-gray-700">Fee:</span>
//                   <p className="text-gray-900">${formData.fee}</p>
//                 </div>
//                 <div>
//                   <span className="font-medium text-gray-700">Biometric Required:</span>
//                   <p className="text-gray-900">{formData.biometricRequired ? 'Yes' : 'No'}</p>
//                 </div>
//                 <div>
//                   <span className="font-medium text-gray-700">Allow Vote Changes:</span>
//                   <p className="text-gray-900">{formData.allowVoteChanges ? 'Yes' : 'No'}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Navigation Buttons */}
//         <div className="flex justify-between pt-6 border-t border-gray-200">
//           <button
//             onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
//             disabled={currentStep === 1}
//             className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             Previous
//           </button>

//           <div className="flex space-x-3">
//             {currentStep === 4 && (
//               <button
//                 onClick={() => handleSubmit(true)}
//                 disabled={isLoading}
//                 className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
//               >
//                 Save as Draft
//               </button>
//             )}

//             {currentStep < 4 ? (
//               <button
//                 onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//               >
//                 Next
//               </button>
//             ) : (
//               <button
//                 onClick={() => handleSubmit(false)}
//                 disabled={isLoading}
//                 className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
//               >
//                 {isLoading ? 'Creating...' : 'Create Election'}
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateElection;
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router';
// import { useAuth } from '../contexts/AuthContext';
// import { toast } from 'react-hot-toast';
// import {
//   DocumentTextIcon,
//   CalendarIcon,
//   CurrencyDollarIcon,
//   ShieldCheckIcon,
//   GlobeAltIcon,
//   UserGroupIcon,
//   PhotoIcon,
//   VideoCameraIcon,
//   PlusIcon,
//   TrashIcon
// } from '@heroicons/react/24/outline';

// const CreateElection = () => {
//   const navigate = useNavigate();
//   const { userData } = useAuth();
//   const [isLoading, setIsLoading] = useState(false);
//   const [currentStep, setCurrentStep] = useState(1);

//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     category: '',
//     votingType: 'plurality',
//     startDate: '',
//     startTime: '',
//     endDate: '',
//     endTime: '',
//     timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
//     fee: 0,
//     biometricRequired: false,
//     permissions: 'global',
//     countryRestriction: '',
//     groupId: '',
//     organizationId: '',
//     allowVoteChanges: true,
//     showResultsDuringVoting: false,
//     questions: [
//       {
//         id: 1,
//         type: 'multiple_choice',
//         question: '',
//         options: ['', ''],
//         required: true
//       }
//     ],
//     media: {
//       logo: null,
//       coverImage: null,
//       videos: []
//     }
//   });

//   const votingTypes = [
//     {
//       value: 'plurality',
//       name: 'Plurality Voting',
//       description: 'Single choice selection - voters pick one option',
//       icon: '1️⃣'
//     },
//     {
//       value: 'ranked_choice',
//       name: 'Ranked Choice Voting',
//       description: 'Voters rank options by preference',
//       icon: '📊'
//     },
//     {
//       value: 'approval',
//       name: 'Approval Voting',
//       description: 'Voters can approve multiple options',
//       icon: '✅'
//     }
//   ];

//   const categories = [
//     'Politics & Government',
//     'Technology',
//     'Environment',
//     'Business',
//     'Education',
//     'Entertainment',
//     'Sports',
//     'Lifestyle',
//     'Health',
//     'Community'
//   ];

//   const permissionTypes = [
//     {
//       value: 'global',
//       name: 'Global',
//       description: 'Anyone worldwide can participate',
//       icon: GlobeAltIcon
//     },
//     {
//       value: 'country',
//       name: 'Country Specific',
//       description: 'Restrict to specific countries',
//       icon: GlobeAltIcon
//     },
//     {
//       value: 'group',
//       name: 'Group Only',
//       description: 'Only group members can vote',
//       icon: UserGroupIcon
//     },
//     {
//       value: 'organization',
//       name: 'Organization Only',
//       description: 'Only organization members',
//       icon: UserGroupIcon
//     }
//   ];

//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const handleQuestionChange = (questionId, field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       questions: prev.questions.map(q =>
//         q.id === questionId ? { ...q, [field]: value } : q
//       )
//     }));
//   };

//   const handleOptionChange = (questionId, optionIndex, value) => {
//     setFormData(prev => ({
//       ...prev,
//       questions: prev.questions.map(q =>
//         q.id === questionId
//           ? {
//               ...q,
//               options: q.options.map((option, index) =>
//                 index === optionIndex ? value : option
//               )
//             }
//           : q
//       )
//     }));
//   };

//   const addOption = (questionId) => {
//     setFormData(prev => ({
//       ...prev,
//       questions: prev.questions.map(q =>
//         q.id === questionId
//           ? { ...q, options: [...q.options, ''] }
//           : q
//       )
//     }));
//   };

//   const removeOption = (questionId, optionIndex) => {
//     setFormData(prev => ({
//       ...prev,
//       questions: prev.questions.map(q =>
//         q.id === questionId
//           ? { ...q, options: q.options.filter((_, index) => index !== optionIndex) }
//           : q
//       )
//     }));
//   };

//   const addQuestion = () => {
//     const newQuestion = {
//       id: Date.now(),
//       type: 'multiple_choice',
//       question: '',
//       options: ['', ''],
//       required: true
//     };
//     setFormData(prev => ({
//       ...prev,
//       questions: [...prev.questions, newQuestion]
//     }));
//   };

//   const removeQuestion = (questionId) => {
//     if (formData.questions.length > 1) {
//       setFormData(prev => ({
//         ...prev,
//         questions: prev.questions.filter(q => q.id !== questionId)
//       }));
//     }
//   };

//   const handleSubmit = async (isDraft = false) => {
//     setIsLoading(true);
//     try {
//       // Validation
//       if (!formData.title.trim()) {
//         toast.error('Election title is required');
//         return;
//       }

//       if (!formData.description.trim()) {
//         toast.error('Election description is required');
//         return;
//       }

//       if (!formData.startDate || !formData.endDate) {
//         toast.error('Start and end dates are required');
//         return;
//       }

//       if (new Date(`${formData.endDate}T${formData.endTime}`) <= new Date(`${formData.startDate}T${formData.startTime}`)) {
//         toast.error('End date must be after start date');
//         return;
//       }

//       // Validate questions
//       for (const question of formData.questions) {
//         if (!question.question.trim()) {
//           toast.error('All questions must have text');
//           return;
//         }
        
//         const validOptions = question.options.filter(opt => opt.trim());
//         if (validOptions.length < 2) {
//           toast.error('Each question must have at least 2 options');
//           return;
//         }
//       }

//       // Create election data
//       const electionData = {
//         ...formData,
//         status: isDraft ? 'draft' : 'active',
//         createdBy: userData?.id,
//         createdAt: new Date().toISOString()
//       };

//       // Here you would call your API
//       console.log('Creating election:', electionData);
      
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 1000));

//       toast.success(`Election ${isDraft ? 'saved as draft' : 'created'} successfully!`);
//       navigate('/elections');
//     } catch (error) {
//       console.error('Error creating election:', error);
//       toast.error('Failed to create election');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const steps = [
//     { number: 1, name: 'Basic Info', description: 'Title, description, and category' },
//     { number: 2, name: 'Voting Setup', description: 'Questions and voting method' },
//     { number: 3, name: 'Schedule', description: 'Dates, times, and permissions' },
//     { number: 4, name: 'Settings', description: 'Advanced options and review' }
//   ];

//   return (
//     <div className="max-w-4xl mx-auto space-y-6">
//       {/* Header */}
//       <div className="bg-white rounded-lg border border-gray-200 p-6">
//         <h1 className="text-2xl font-bold text-gray-900">Create New Election</h1>
//         <p className="mt-1 text-sm text-gray-500">
//           Set up a new voting campaign with custom questions and settings
//         </p>
//       </div>

//       {/* Progress Steps */}
//       <div className="bg-white rounded-lg border border-gray-200 p-6">
//         <nav className="flex items-center justify-center">
//           <ol className="flex items-center space-x-5">
//             {steps.map((step) => (
//               <li key={step.number} className="flex items-center">
//                 <div className="flex items-center">
//                   <div
//                     className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
//                       currentStep >= step.number
//                         ? 'bg-blue-600 border-blue-600 text-white'
//                         : 'border-gray-300 text-gray-500'
//                     }`}
//                   >
//                     {step.number}
//                   </div>
//                   <div className="ml-4 min-w-0">
//                     <p className={`text-sm font-medium ${
//                       currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'
//                     }`}>
//                       {step.name}
//                     </p>
//                     <p className="text-xs text-gray-500">{step.description}</p>
//                   </div>
//                 </div>
//                 {step.number < steps.length && (
//                   <div className="ml-5 w-8 h-0.5 bg-gray-200"></div>
//                 )}
//               </li>
//             ))}
//           </ol>
//         </nav>
//       </div>

//       {/* Step Content */}
//       <div className="bg-white rounded-lg border border-gray-200 p-6">
//         {/* Step 1: Basic Info */}
//         {currentStep === 1 && (
//           <div className="space-y-6">
//             <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Election Title *
//               </label>
//               <input
//                 type="text"
//                 value={formData.title}
//                 onChange={(e) => handleInputChange('title', e.target.value)}
//                 placeholder="Enter a clear, descriptive title"
//                 className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Description *
//               </label>
//               <textarea
//                 rows={4}
//                 value={formData.description}
//                 onChange={(e) => handleInputChange('description', e.target.value)}
//                 placeholder="Provide details about what you're voting on and any important context"
//                 className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Category
//               </label>
//               <select
//                 value={formData.category}
//                 onChange={(e) => handleInputChange('category', e.target.value)}
//                 className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//               >
//                 <option value="">Select a category</option>
//                 {categories.map(category => (
//                   <option key={category} value={category.toLowerCase().replace(/\s+/g, '_')}>
//                     {category}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   <PhotoIcon className="h-4 w-4 inline mr-1" />
//                   Cover Image
//                 </label>
//                 <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
//                   <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
//                   <div className="mt-2">
//                     <button className="text-blue-600 hover:text-blue-500">
//                       Upload image
//                     </button>
//                     <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   <PhotoIcon className="h-4 w-4 inline mr-1" />
//                   Logo/Branding
//                 </label>
//                 <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
//                   <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
//                   <div className="mt-2">
//                     <button className="text-blue-600 hover:text-blue-500">
//                       Upload logo
//                     </button>
//                     <p className="text-xs text-gray-500 mt-1">Square format preferred</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Step 2: Voting Setup */}
//         {currentStep === 2 && (
//           <div className="space-y-6">
//             <h3 className="text-lg font-medium text-gray-900">Voting Method & Questions</h3>
            
//             {/* Voting Type Selection */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-4">
//                 Choose Voting Method *
//               </label>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 {votingTypes.map(type => (
//                   <div
//                     key={type.value}
//                     className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
//                       formData.votingType === type.value
//                         ? 'border-blue-500 bg-blue-50'
//                         : 'border-gray-200 hover:border-gray-300'
//                     }`}
//                     onClick={() => handleInputChange('votingType', type.value)}
//                   >
//                     <div className="text-2xl mb-2">{type.icon}</div>
//                     <h4 className="font-medium text-gray-900">{type.name}</h4>
//                     <p className="text-sm text-gray-500 mt-1">{type.description}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Questions */}
//             <div>
//               <div className="flex items-center justify-between mb-4">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Questions *
//                 </label>
//                 <button
//                   onClick={addQuestion}
//                   className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
//                 >
//                   <PlusIcon className="h-4 w-4 mr-1" />
//                   Add Question
//                 </button>
//               </div>

//               <div className="space-y-6">
//                 {formData.questions.map((question, index) => (
//                   <div key={question.id} className="border border-gray-200 rounded-lg p-4">
//                     <div className="flex items-center justify-between mb-4">
//                       <h4 className="font-medium text-gray-900">Question {index + 1}</h4>
//                       {formData.questions.length > 1 && (
//                         <button
//                           onClick={() => removeQuestion(question.id)}
//                           className="text-red-600 hover:text-red-700"
//                         >
//                           <TrashIcon className="h-4 w-4" />
//                         </button>
//                       )}
//                     </div>

//                     <div className="mb-4">
//                       <input
//                         type="text"
//                         value={question.question}
//                         onChange={(e) => handleQuestionChange(question.id, 'question', e.target.value)}
//                         placeholder="Enter your question"
//                         className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Options
//                       </label>
//                       <div className="space-y-2">
//                         {question.options.map((option, optionIndex) => (
//                           <div key={optionIndex} className="flex items-center space-x-2">
//                             <input
//                               type="text"
//                               value={option}
//                               onChange={(e) => handleOptionChange(question.id, optionIndex, e.target.value)}
//                               placeholder={`Option ${optionIndex + 1}`}
//                               className="flex-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                             />
//                             {question.options.length > 2 && (
//                               <button
//                                 onClick={() => removeOption(question.id, optionIndex)}
//                                 className="text-red-600 hover:text-red-700"
//                               >
//                                 <TrashIcon className="h-4 w-4" />
//                               </button>
//                             )}
//                           </div>
//                         ))}
//                         <button
//                           onClick={() => addOption(question.id)}
//                           className="text-blue-600 hover:text-blue-700 text-sm font-medium"
//                         >
//                           + Add Option
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Step 3: Schedule */}
//         {currentStep === 3 && (
//           <div className="space-y-6">
//             <h3 className="text-lg font-medium text-gray-900">Schedule & Access</h3>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Start Date & Time *
//                 </label>
//                 <div className="grid grid-cols-2 gap-2">
//                   <input
//                     type="date"
//                     value={formData.startDate}
//                     onChange={(e) => handleInputChange('startDate', e.target.value)}
//                     className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                   />
//                   <input
//                     type="time"
//                     value={formData.startTime}
//                     onChange={(e) => handleInputChange('startTime', e.target.value)}
//                     className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   End Date & Time *
//                 </label>
//                 <div className="grid grid-cols-2 gap-2">
//                   <input
//                     type="date"
//                     value={formData.endDate}
//                     onChange={(e) => handleInputChange('endDate', e.target.value)}
//                     className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                   />
//                   <input
//                     type="time"
//                     value={formData.endTime}
//                     onChange={(e) => handleInputChange('endTime', e.target.value)}
//                     className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Timezone
//               </label>
//               <select
//                 value={formData.timezone}
//                 onChange={(e) => handleInputChange('timezone', e.target.value)}
//                 className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//               >
//                 <option value={Intl.DateTimeFormat().resolvedOptions().timeZone}>
//                   {Intl.DateTimeFormat().resolvedOptions().timeZone} (Auto-detected)
//                 </option>
//               </select>
//             </div>

//             {/* Permission Settings */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-4">
//                 Who can participate? *
//               </label>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {permissionTypes.map(permission => {
//                   const Icon = permission.icon;
//                   return (
//                     <div
//                       key={permission.value}
//                       className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
//                         formData.permissions === permission.value
//                           ? 'border-blue-500 bg-blue-50'
//                           : 'border-gray-200 hover:border-gray-300'
//                       }`}
//                       onClick={() => handleInputChange('permissions', permission.value)}
//                     >
//                       <Icon className="h-6 w-6 text-gray-600 mb-2" />
//                       <h4 className="font-medium text-gray-900">{permission.name}</h4>
//                       <p className="text-sm text-gray-500 mt-1">{permission.description}</p>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Country Restriction (if country-specific) */}
//             {formData.permissions === 'country' && (
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Select Countries
//                 </label>
//                 <select
//                   value={formData.countryRestriction}
//                   onChange={(e) => handleInputChange('countryRestriction', e.target.value)}
//                   className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="">Select countries...</option>
//                   <option value="US">United States</option>
//                   <option value="CA">Canada</option>
//                   <option value="UK">United Kingdom</option>
//                   <option value="DE">Germany</option>
//                   <option value="FR">France</option>
//                   <option value="BD">Bangladesh</option>
//                   <option value="IN">India</option>
//                 </select>
//               </div>
//             )}

//             {/* Group/Organization ID (if applicable) */}
//             {(formData.permissions === 'group' || formData.permissions === 'organization') && (
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   {formData.permissions === 'group' ? 'Group ID' : 'Organization ID'}
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.permissions === 'group' ? formData.groupId : formData.organizationId}
//                   onChange={(e) => handleInputChange(
//                     formData.permissions === 'group' ? 'groupId' : 'organizationId', 
//                     e.target.value
//                   )}
//                   placeholder={`Enter ${formData.permissions} identifier`}
//                   className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
//             )}

//             {/* Participation Fee */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 <CurrencyDollarIcon className="h-4 w-4 inline mr-1" />
//                 Participation Fee (USD)
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <span className="text-gray-500 sm:text-sm">$</span>
//                 </div>
//                 <input
//                   type="number"
//                   min="0"
//                   step="0.01"
//                   value={formData.fee}
//                   onChange={(e) => handleInputChange('fee', parseFloat(e.target.value) || 0)}
//                   placeholder="0.00"
//                   className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
//               <p className="text-xs text-gray-500 mt-1">
//                 Set to 0 for free elections. Fees help prevent spam and fund prizes.
//               </p>
//             </div>
//           </div>
//         )}

//         {/* Step 4: Settings */}
//         {currentStep === 4 && (
//           <div className="space-y-6">
//             <h3 className="text-lg font-medium text-gray-900">Advanced Settings & Review</h3>
            
//             {/* Security & Privacy Settings */}
//             <div className="bg-gray-50 rounded-lg p-6">
//               <h4 className="font-medium text-gray-900 mb-4">Security & Privacy</h4>
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <div className="flex items-center">
//                       <ShieldCheckIcon className="h-5 w-5 text-gray-400 mr-2" />
//                       <span className="font-medium text-gray-900">Require Biometric Authentication</span>
//                     </div>
//                     <p className="text-sm text-gray-500 ml-7">
//                       Voters must verify identity with fingerprint/face ID
//                     </p>
//                   </div>
//                   <button
//                     onClick={() => handleInputChange('biometricRequired', !formData.biometricRequired)}
//                     className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
//                       formData.biometricRequired ? 'bg-blue-600' : 'bg-gray-200'
//                     }`}
//                   >
//                     <span
//                       className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
//                         formData.biometricRequired ? 'translate-x-5' : 'translate-x-0'
//                       }`}
//                     />
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Voting Settings */}
//             <div className="bg-gray-50 rounded-lg p-6">
//               <h4 className="font-medium text-gray-900 mb-4">Voting Behavior</h4>
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <span className="font-medium text-gray-900">Allow Vote Changes</span>
//                     <p className="text-sm text-gray-500">
//                       Voters can modify their votes before election ends
//                     </p>
//                   </div>
//                   <button
//                     onClick={() => handleInputChange('allowVoteChanges', !formData.allowVoteChanges)}
//                     className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
//                       formData.allowVoteChanges ? 'bg-blue-600' : 'bg-gray-200'
//                     }`}
//                   >
//                     <span
//                       className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
//                         formData.allowVoteChanges ? 'translate-x-5' : 'translate-x-0'
//                       }`}
//                     />
//                   </button>
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <div>
//                     <span className="font-medium text-gray-900">Show Live Results</span>
//                     <p className="text-sm text-gray-500">
//                       Display vote counts while election is active
//                     </p>
//                   </div>
//                   <button
//                     onClick={() => handleInputChange('showResultsDuringVoting', !formData.showResultsDuringVoting)}
//                     className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
//                       formData.showResultsDuringVoting ? 'bg-blue-600' : 'bg-gray-200'
//                     }`}
//                   >
//                     <span
//                       className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
//                         formData.showResultsDuringVoting ? 'translate-x-5' : 'translate-x-0'
//                       }`}
//                     />
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Election Summary */}
//             <div className="bg-blue-50 rounded-lg p-6">
//               <h4 className="font-medium text-gray-900 mb-4">Election Summary</h4>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//                 <div>
//                   <span className="font-medium text-gray-700">Title:</span>
//                   <p className="text-gray-900">{formData.title || 'Not set'}</p>
//                 </div>
//                 <div>
//                   <span className="font-medium text-gray-700">Voting Method:</span>
//                   <p className="text-gray-900 capitalize">{formData.votingType.replace('_', ' ')}</p>
//                 </div>
//                 <div>
//                   <span className="font-medium text-gray-700">Questions:</span>
//                   <p className="text-gray-900">{formData.questions.length}</p>
//                 </div>
//                 <div>
//                   <span className="font-medium text-gray-700">Duration:</span>
//                   <p className="text-gray-900">
//                     {formData.startDate && formData.endDate 
//                       ? `${formData.startDate} to ${formData.endDate}`
//                       : 'Not set'
//                     }
//                   </p>
//                 </div>
//                 <div>
//                   <span className="font-medium text-gray-700">Participation:</span>
//                   <p className="text-gray-900 capitalize">{formData.permissions}</p>
//                 </div>
//                 <div>
//                   <span className="font-medium text-gray-700">Fee:</span>
//                   <p className="text-gray-900">${formData.fee}</p>
//                 </div>
//                 <div>
//                   <span className="font-medium text-gray-700">Biometric Required:</span>
//                   <p className="text-gray-900">{formData.biometricRequired ? 'Yes' : 'No'}</p>
//                 </div>
//                 <div>
//                   <span className="font-medium text-gray-700">Allow Vote Changes:</span>
//                   <p className="text-gray-900">{formData.allowVoteChanges ? 'Yes' : 'No'}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Navigation Buttons */}
//         <div className="flex justify-between pt-6 border-t border-gray-200">
//           <button
//             onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
//             disabled={currentStep === 1}
//             className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             Previous
//           </button>

//           <div className="flex space-x-3">
//             {currentStep === 4 && (
//               <button
//                 onClick={() => handleSubmit(true)}
//                 disabled={isLoading}
//                 className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
//               >
//                 Save as Draft
//               </button>
//             )}

//             {currentStep < 4 ? (
//               <button
//                 onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//               >
//                 Next
//               </button>
//             ) : (
//               <button
//                 onClick={() => handleSubmit(false)}
//                 disabled={isLoading}
//                 className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
//               >
//                 {isLoading ? 'Creating...' : 'Create Election'}
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateElection;