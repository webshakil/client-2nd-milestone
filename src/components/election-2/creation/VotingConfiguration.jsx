
import React, { useState } from 'react';
import { HelpCircle, Users, MessageCircle } from 'lucide-react';
import QuestionCreator from './QuestionCreator';
import PricingConfiguration from './PricingConfiguration';
import LotteryConfiguration from './LotteryConfiguration';

const VotingConfiguration = ({ formData, updateFormData, errors = {} }) => {
  const [activeStep, setActiveStep] = useState('voting-method'); // voting-method, questions, permissions, features
  const [questions, setQuestions] = useState(formData.questions || []);

  // Sync questions with parent formData whenever questions change
  const handleQuestionsUpdate = (updatedQuestions) => {
    setQuestions(updatedQuestions);
    updateFormData({ questions: updatedQuestions });
  };

  const handleVotingTypeChange = (type) => {
    updateFormData({ 
      votingType: type,
      // Reset questions when voting type changes
      questions: []
    });
    setQuestions([]);
    // Auto-advance to questions step
    setActiveStep('questions');
  };

  const handlePermissionChange = (permission) => {
    updateFormData({ permissionToVote: permission });
  };

  const votingTypes = [
    {
      id: 'plurality',
      name: 'Plurality Voting',
      description: 'Single candidate selection - most votes wins',
      icon: '🗳️',
      details: 'Voters select one candidate. Candidate with most votes wins.',
      features: ['Simple and intuitive', 'Quick vote counting', 'Clear winners', 'Traditional democratic voting']
    },
    {
      id: 'ranked_choice',
      name: 'Ranked Choice Voting',
      description: 'Preference ranking with elimination rounds',
      icon: '📊',
      details: 'Voters rank candidates by preference. Elimination rounds until majority.',
      features: ['Eliminates spoiler effect', 'Ensures majority winner', 'More representative results', 'Encourages broader appeal']
    },
    {
      id: 'approval',
      name: 'Approval Voting',
      description: 'Multiple candidate approval selection',
      icon: '✅',
      details: 'Voters approve multiple candidates they support.',
      features: ['Reduces strategic voting', 'Simple ballot design', 'Encourages moderate candidates', 'Express broader preferences']
    }
  ];

  const permissionOptions = [
    {
      id: 'world_citizens',
      name: 'Open to Everyone',
      description: 'Anyone in the world can vote',
      icon: <Users className="w-5 h-5" />
    },
    {
      id: 'registered_members',
      name: 'Registered Members Only',
      description: 'Only members of your organization',
      icon: <Users className="w-5 h-5" />
    },
    {
      id: 'country_specific',
      name: 'Country Specific',
      description: 'Residents of selected countries only',
      icon: <Users className="w-5 h-5" />
    }
  ];

  const steps = [
    { id: 'voting-method', title: 'Voting Method', icon: '🗳️', completed: !!formData.votingType },
    { id: 'questions', title: 'Questions', icon: '❓', completed: questions.length > 0 },
    { id: 'permissions', title: 'Permissions', icon: '👥', completed: !!formData.permissionToVote },
    { id: 'features', title: 'Features', icon: '⚡', completed: true }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Voting Configuration</h2>
        <p className="mt-2 text-gray-600">
          Configure how people will vote and who can participate in your election.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <button
              onClick={() => setActiveStep(step.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeStep === step.id
                  ? 'bg-blue-500 text-white'
                  : step.completed
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-white text-gray-500 hover:bg-gray-100'
              }`}
            >
              <span className="text-lg">{step.icon}</span>
              <span className="font-medium">{step.title}</span>
              {step.completed && activeStep !== step.id && (
                <span className="text-green-500">✓</span>
              )}
            </button>
            {index < steps.length - 1 && (
              <div className="w-8 h-0.5 bg-gray-300 mx-2"></div>
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {/* Voting Method Step */}
        {activeStep === 'voting-method' && (
          <div className="p-6 space-y-6">
            <div className="flex items-center space-x-2 mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Choose Voting Method</h3>
              <HelpCircle className="w-4 h-4 text-gray-400" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {votingTypes.map((type) => (
                <div
                  key={type.id}
                  className={`relative rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    formData.votingType === type.id
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                  onClick={() => handleVotingTypeChange(type.id)}
                >
                  <div className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="text-3xl">{type.icon}</span>
                      <div>
                        <h4 className="font-semibold text-gray-900">{type.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-3">{type.details}</p>
                    
                    <div className="space-y-1">
                      {type.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-xs text-gray-500">
                          <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {formData.votingType === type.id && (
                    <div className="absolute top-3 right-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {errors.votingType && (
              <p className="text-red-600 text-sm">{errors.votingType}</p>
            )}

            {formData.votingType && (
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setActiveStep('questions')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Configure Questions
                </button>
              </div>
            )}
          </div>
        )}

        {/* Questions Step */}
        {activeStep === 'questions' && formData.votingType && (
          <div className="p-6">
            <QuestionCreator
              electionId={formData.electionId}
              votingType={formData.votingType}
              questions={questions}
              setQuestions={handleQuestionsUpdate}
              updateFormData={updateFormData}
              errors={errors}
            />
            
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => setActiveStep('voting-method')}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Back to Voting Method
              </button>
              <button
                onClick={() => setActiveStep('permissions')}
                //disabled={questions.length === 0}
                disabled={false}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Permissions
              </button>
            </div>
          </div>
        )}

        {/* Permissions Step */}
        {activeStep === 'permissions' && (
          <div className="p-6 space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Who Can Vote?</h3>
            
            <div className="space-y-3">
              {permissionOptions.map((option) => (
                <div
                  key={option.id}
                  className={`relative rounded-lg border cursor-pointer transition-all duration-200 ${
                    formData.permissionToVote === option.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handlePermissionChange(option.id)}
                >
                  <div className="p-4 flex items-center space-x-3">
                    {option.icon}
                    <div>
                      <h4 className="font-medium text-gray-900">{option.name}</h4>
                      <p className="text-sm text-gray-600">{option.description}</p>
                    </div>
                    {formData.permissionToVote === option.id && (
                      <div className="ml-auto">
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {errors.permissionToVote && (
              <p className="text-red-600 text-sm">{errors.permissionToVote}</p>
            )}

            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => setActiveStep('questions')}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Back to Questions
              </button>
              <button
                onClick={() => setActiveStep('features')}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Continue to Features
              </button>
            </div>
          </div>
        )}

        {/* Features Step */}
        {activeStep === 'features' && (
          <div className="p-6 space-y-8">
            {/* Pricing Configuration */}
            <PricingConfiguration
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
            />

            {/* Lottery Configuration */}
            <LotteryConfiguration
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
            />

            {/* Results Display Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Results Display</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Show Live Results</h4>
                    <p className="text-sm text-gray-600">Allow voters to see vote counts while election is active</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={formData.showLiveResults}
                      onChange={(e) => updateFormData({ showLiveResults: e.target.checked })}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Allow Vote Editing</h4>
                    <p className="text-sm text-gray-600">Let voters change their vote before the election ends</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={formData.allowVoteEditing}
                      onChange={(e) => updateFormData({ allowVoteEditing: e.target.checked })}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => setActiveStep('permissions')}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Back to Permissions
              </button>
              <div className="text-sm text-green-600 flex items-center">
                <span className="mr-2">✓</span>
                Configuration Complete
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VotingConfiguration;
// //with latest pricing
// //to get question preview
// import React, { useState } from 'react';
// import { HelpCircle, Users, Gift, Trophy, MessageCircle } from 'lucide-react';
// import QuestionCreator from './QuestionCreator';
// import PricingConfiguration from './PricingConfiguration';

// const VotingConfiguration = ({ formData, updateFormData, errors = {} }) => {
//   const [activeStep, setActiveStep] = useState('voting-method'); // voting-method, questions, permissions, features
//   const [questions, setQuestions] = useState(formData.questions || []);

//   // Sync questions with parent formData whenever questions change
//   const handleQuestionsUpdate = (updatedQuestions) => {
//     setQuestions(updatedQuestions);
//     updateFormData({ questions: updatedQuestions });
//   };

//   const handleVotingTypeChange = (type) => {
//     updateFormData({ 
//       votingType: type,
//       // Reset questions when voting type changes
//       questions: []
//     });
//     setQuestions([]);
//     // Auto-advance to questions step
//     setActiveStep('questions');
//   };

//   const handlePermissionChange = (permission) => {
//     updateFormData({ permissionToVote: permission });
//   };

//   const handleLotteryToggle = (isLotterized) => {
//     updateFormData({ 
//       isLotterized,
//       rewardAmount: isLotterized ? formData.rewardAmount || 10 : 0,
//       winnerCount: isLotterized ? formData.winnerCount || 1 : 1
//     });
//   };

//   const votingTypes = [
//     {
//       id: 'plurality',
//       name: 'Plurality Voting',
//       description: 'Single candidate selection - most votes wins',
//       icon: '🗳️',
//       details: 'Voters select one candidate. Candidate with most votes wins.',
//       features: ['Simple and intuitive', 'Quick vote counting', 'Clear winners', 'Traditional democratic voting']
//     },
//     {
//       id: 'ranked_choice',
//       name: 'Ranked Choice Voting',
//       description: 'Preference ranking with elimination rounds',
//       icon: '📊',
//       details: 'Voters rank candidates by preference. Elimination rounds until majority.',
//       features: ['Eliminates spoiler effect', 'Ensures majority winner', 'More representative results', 'Encourages broader appeal']
//     },
//     {
//       id: 'approval',
//       name: 'Approval Voting',
//       description: 'Multiple candidate approval selection',
//       icon: '✅',
//       details: 'Voters approve multiple candidates they support.',
//       features: ['Reduces strategic voting', 'Simple ballot design', 'Encourages moderate candidates', 'Express broader preferences']
//     }
//   ];

//   const permissionOptions = [
//     {
//       id: 'world_citizens',
//       name: 'Open to Everyone',
//       description: 'Anyone in the world can vote',
//       icon: <Users className="w-5 h-5" />
//     },
//     {
//       id: 'registered_members',
//       name: 'Registered Members Only',
//       description: 'Only members of your organization',
//       icon: <Users className="w-5 h-5" />
//     },
//     {
//       id: 'country_specific',
//       name: 'Country Specific',
//       description: 'Residents of selected countries only',
//       icon: <Users className="w-5 h-5" />
//     }
//   ];

//   const steps = [
//     { id: 'voting-method', title: 'Voting Method', icon: '🗳️', completed: !!formData.votingType },
//     { id: 'questions', title: 'Questions', icon: '❓', completed: questions.length > 0 },
//     { id: 'permissions', title: 'Permissions', icon: '👥', completed: !!formData.permissionToVote },
//     { id: 'features', title: 'Features', icon: '⚡', completed: true }
//   ];

//   return (
//     <div className="space-y-8">
//       {/* Header */}
//       <div>
//         <h2 className="text-2xl font-bold text-gray-900">Voting Configuration</h2>
//         <p className="mt-2 text-gray-600">
//           Configure how people will vote and who can participate in your election.
//         </p>
//       </div>

//       {/* Progress Steps */}
//       <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
//         {steps.map((step, index) => (
//           <div key={step.id} className="flex items-center">
//             <button
//               onClick={() => setActiveStep(step.id)}
//               className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
//                 activeStep === step.id
//                   ? 'bg-blue-500 text-white'
//                   : step.completed
//                   ? 'bg-green-100 text-green-700 hover:bg-green-200'
//                   : 'bg-white text-gray-500 hover:bg-gray-100'
//               }`}
//             >
//               <span className="text-lg">{step.icon}</span>
//               <span className="font-medium">{step.title}</span>
//               {step.completed && activeStep !== step.id && (
//                 <span className="text-green-500">✓</span>
//               )}
//             </button>
//             {index < steps.length - 1 && (
//               <div className="w-8 h-0.5 bg-gray-300 mx-2"></div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Step Content */}
//       <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
//         {/* Voting Method Step */}
//         {activeStep === 'voting-method' && (
//           <div className="p-6 space-y-6">
//             <div className="flex items-center space-x-2 mb-6">
//               <h3 className="text-lg font-semibold text-gray-900">Choose Voting Method</h3>
//               <HelpCircle className="w-4 h-4 text-gray-400" />
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               {votingTypes.map((type) => (
//                 <div
//                   key={type.id}
//                   className={`relative rounded-lg border-2 cursor-pointer transition-all duration-200 ${
//                     formData.votingType === type.id
//                       ? 'border-blue-500 bg-blue-50 shadow-md'
//                       : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
//                   }`}
//                   onClick={() => handleVotingTypeChange(type.id)}
//                 >
//                   <div className="p-6">
//                     <div className="flex items-center space-x-3 mb-4">
//                       <span className="text-3xl">{type.icon}</span>
//                       <div>
//                         <h4 className="font-semibold text-gray-900">{type.name}</h4>
//                         <p className="text-sm text-gray-600 mt-1">{type.description}</p>
//                       </div>
//                     </div>
                    
//                     <p className="text-sm text-gray-700 mb-3">{type.details}</p>
                    
//                     <div className="space-y-1">
//                       {type.features.map((feature, index) => (
//                         <div key={index} className="flex items-center text-xs text-gray-500">
//                           <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
//                           {feature}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
                  
//                   {formData.votingType === type.id && (
//                     <div className="absolute top-3 right-3">
//                       <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
//                         <div className="w-2 h-2 bg-white rounded-full"></div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
            
//             {errors.votingType && (
//               <p className="text-red-600 text-sm">{errors.votingType}</p>
//             )}

//             {formData.votingType && (
//               <div className="flex justify-end mt-6">
//                 <button
//                   onClick={() => setActiveStep('questions')}
//                   className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
//                 >
//                   <MessageCircle className="w-4 h-4 mr-2" />
//                   Configure Questions
//                 </button>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Questions Step */}
//         {activeStep === 'questions' && formData.votingType && (
//           <div className="p-6">
//             <QuestionCreator
//               electionId={formData.electionId}
//               votingType={formData.votingType}
//               questions={questions}
//               setQuestions={handleQuestionsUpdate}
//               updateFormData={updateFormData}
//               errors={errors}
//             />
            
//             <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
//               <button
//                 onClick={() => setActiveStep('voting-method')}
//                 className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//               >
//                 Back to Voting Method
//               </button>
//               <button
//                 onClick={() => setActiveStep('permissions')}
//                 disabled={questions.length === 0}
//                 className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Continue to Permissions
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Permissions Step */}
//         {activeStep === 'permissions' && (
//           <div className="p-6 space-y-6">
//             <h3 className="text-lg font-semibold text-gray-900">Who Can Vote?</h3>
            
//             <div className="space-y-3">
//               {permissionOptions.map((option) => (
//                 <div
//                   key={option.id}
//                   className={`relative rounded-lg border cursor-pointer transition-all duration-200 ${
//                     formData.permissionToVote === option.id
//                       ? 'border-blue-500 bg-blue-50'
//                       : 'border-gray-200 hover:border-gray-300'
//                   }`}
//                   onClick={() => handlePermissionChange(option.id)}
//                 >
//                   <div className="p-4 flex items-center space-x-3">
//                     {option.icon}
//                     <div>
//                       <h4 className="font-medium text-gray-900">{option.name}</h4>
//                       <p className="text-sm text-gray-600">{option.description}</p>
//                     </div>
//                     {formData.permissionToVote === option.id && (
//                       <div className="ml-auto">
//                         <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
//                           <div className="w-2 h-2 bg-white rounded-full"></div>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
            
//             {errors.permissionToVote && (
//               <p className="text-red-600 text-sm">{errors.permissionToVote}</p>
//             )}

//             <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
//               <button
//                 onClick={() => setActiveStep('questions')}
//                 className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//               >
//                 Back to Questions
//               </button>
//               <button
//                 onClick={() => setActiveStep('features')}
//                 className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//               >
//                 Continue to Features
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Features Step */}
//         {activeStep === 'features' && (
//           <div className="p-6 space-y-8">
//             {/* Pricing Configuration */}
//             <PricingConfiguration
//               formData={formData}
//               updateFormData={updateFormData}
//               errors={errors}
//             />

//             {/* Lottery Configuration */}
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900">Lottery Feature</h3>
//                   <p className="text-sm text-gray-600">Turn this election into a lottery with prizes for voters</p>
//                 </div>
//                 <label className="relative inline-flex items-center cursor-pointer">
//                   <input
//                     type="checkbox"
//                     className="sr-only peer"
//                     checked={formData.isLotterized}
//                     onChange={(e) => handleLotteryToggle(e.target.checked)}
//                   />
//                   <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
//                 </label>
//               </div>

//               {formData.isLotterized && (
//                 <div className="bg-green-50 rounded-lg p-4 space-y-4">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         <Gift className="w-4 h-4 inline mr-1" />
//                         Total Prize Pool (USD)
//                       </label>
//                       <input
//                         type="number"
//                         min="1"
//                         step="1"
//                         className={`block w-full rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
//                           errors.rewardAmount ? 'border-red-300' : 'border-gray-300'
//                         }`}
//                         placeholder="100"
//                         value={formData.rewardAmount || ''}
//                         onChange={(e) => updateFormData({ rewardAmount: parseInt(e.target.value) || 0 })}
//                       />
//                       {errors.rewardAmount && (
//                         <p className="text-red-600 text-sm mt-1">{errors.rewardAmount}</p>
//                       )}
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         <Trophy className="w-4 h-4 inline mr-1" />
//                         Number of Winners (1-100)
//                       </label>
//                       <input
//                         type="number"
//                         min="1"
//                         max="100"
//                         step="1"
//                         className={`block w-full rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
//                           errors.winnerCount ? 'border-red-300' : 'border-gray-300'
//                         }`}
//                         placeholder="1"
//                         value={formData.winnerCount || ''}
//                         onChange={(e) => updateFormData({ winnerCount: parseInt(e.target.value) || 1 })}
//                       />
//                       {errors.winnerCount && (
//                         <p className="text-red-600 text-sm mt-1">{errors.winnerCount}</p>
//                       )}
//                     </div>
//                   </div>

//                   <div className="bg-green-100 rounded-md p-3">
//                     <h4 className="font-medium text-green-800 mb-2">How the Lottery Works:</h4>
//                     <ul className="text-sm text-green-700 space-y-1">
//                       <li>• Each vote automatically becomes a lottery ticket</li>
//                       <li>• Winners are selected randomly when the election ends</li>
//                       <li>• Prizes are distributed automatically to winners' wallets</li>
//                       <li>• All lottery draws are cryptographically secure and verifiable</li>
//                     </ul>
//                   </div>

//                   {formData.rewardAmount > 0 && formData.winnerCount > 0 && (
//                     <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
//                       <p className="text-sm font-medium text-yellow-800">
//                         Prize Distribution: ${(formData.rewardAmount / formData.winnerCount).toFixed(2)} per winner
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Results Display Options */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold text-gray-900">Results Display</h3>
              
//               <div className="space-y-3">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h4 className="font-medium text-gray-900">Show Live Results</h4>
//                     <p className="text-sm text-gray-600">Allow voters to see vote counts while election is active</p>
//                   </div>
//                   <label className="relative inline-flex items-center cursor-pointer">
//                     <input
//                       type="checkbox"
//                       className="sr-only peer"
//                       checked={formData.showLiveResults}
//                       onChange={(e) => updateFormData({ showLiveResults: e.target.checked })}
//                     />
//                     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                   </label>
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h4 className="font-medium text-gray-900">Allow Vote Editing</h4>
//                     <p className="text-sm text-gray-600">Let voters change their vote before the election ends</p>
//                   </div>
//                   <label className="relative inline-flex items-center cursor-pointer">
//                     <input
//                       type="checkbox"
//                       className="sr-only peer"
//                       checked={formData.allowVoteEditing}
//                       onChange={(e) => updateFormData({ allowVoteEditing: e.target.checked })}
//                     />
//                     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                   </label>
//                 </div>
//               </div>
//             </div>

//             <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
//               <button
//                 onClick={() => setActiveStep('permissions')}
//                 className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//               >
//                 Back to Permissions
//               </button>
//               <div className="text-sm text-green-600 flex items-center">
//                 <span className="mr-2">✓</span>
//                 Configuration Complete
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default VotingConfiguration;
// //to get question preview
// import React, { useState } from 'react';
// import { HelpCircle, Users, DollarSign, Gift, Trophy, MessageCircle } from 'lucide-react';
// import QuestionCreator from './QuestionCreator';

// const VotingConfiguration = ({ formData, updateFormData, errors = {} }) => {
//   const [activeStep, setActiveStep] = useState('voting-method'); // voting-method, questions, permissions, features
//   const [questions, setQuestions] = useState(formData.questions || []);

//   // Sync questions with parent formData whenever questions change
//   const handleQuestionsUpdate = (updatedQuestions) => {
//     setQuestions(updatedQuestions);
//     updateFormData({ questions: updatedQuestions });
//   };

//   const handleVotingTypeChange = (type) => {
//     updateFormData({ 
//       votingType: type,
//       // Reset questions when voting type changes
//       questions: []
//     });
//     setQuestions([]);
//     // Auto-advance to questions step
//     setActiveStep('questions');
//   };

//   const handlePermissionChange = (permission) => {
//     updateFormData({ permissionToVote: permission });
//   };

//   const handlePaidToggle = (isPaid) => {
//     updateFormData({ 
//       isPaid,
//       participationFee: isPaid ? formData.participationFee || 1 : 0
//     });
//   };

//   const handleLotteryToggle = (isLotterized) => {
//     updateFormData({ 
//       isLotterized,
//       rewardAmount: isLotterized ? formData.rewardAmount || 10 : 0,
//       winnerCount: isLotterized ? formData.winnerCount || 1 : 1
//     });
//   };

//   const votingTypes = [
//     {
//       id: 'plurality',
//       name: 'Plurality Voting',
//       description: 'Single candidate selection - most votes wins',
//       icon: '🗳️',
//       details: 'Voters select one candidate. Candidate with most votes wins.',
//       features: ['Simple and intuitive', 'Quick vote counting', 'Clear winners', 'Traditional democratic voting']
//     },
//     {
//       id: 'ranked_choice',
//       name: 'Ranked Choice Voting',
//       description: 'Preference ranking with elimination rounds',
//       icon: '📊',
//       details: 'Voters rank candidates by preference. Elimination rounds until majority.',
//       features: ['Eliminates spoiler effect', 'Ensures majority winner', 'More representative results', 'Encourages broader appeal']
//     },
//     {
//       id: 'approval',
//       name: 'Approval Voting',
//       description: 'Multiple candidate approval selection',
//       icon: '✅',
//       details: 'Voters approve multiple candidates they support.',
//       features: ['Reduces strategic voting', 'Simple ballot design', 'Encourages moderate candidates', 'Express broader preferences']
//     }
//   ];

//   const permissionOptions = [
//     {
//       id: 'world_citizens',
//       name: 'Open to Everyone',
//       description: 'Anyone in the world can vote',
//       icon: <Users className="w-5 h-5" />
//     },
//     {
//       id: 'registered_members',
//       name: 'Registered Members Only',
//       description: 'Only members of your organization',
//       icon: <Users className="w-5 h-5" />
//     },
//     {
//       id: 'country_specific',
//       name: 'Country Specific',
//       description: 'Residents of selected countries only',
//       icon: <Users className="w-5 h-5" />
//     }
//   ];

//   const steps = [
//     { id: 'voting-method', title: 'Voting Method', icon: '🗳️', completed: !!formData.votingType },
//     { id: 'questions', title: 'Questions', icon: '❓', completed: questions.length > 0 },
//     { id: 'permissions', title: 'Permissions', icon: '👥', completed: !!formData.permissionToVote },
//     { id: 'features', title: 'Features', icon: '⚡', completed: true }
//   ];

//   return (
//     <div className="space-y-8">
//       {/* Header */}
//       <div>
//         <h2 className="text-2xl font-bold text-gray-900">Voting Configuration</h2>
//         <p className="mt-2 text-gray-600">
//           Configure how people will vote and who can participate in your election.
//         </p>
//       </div>

//       {/* Progress Steps */}
//       <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
//         {steps.map((step, index) => (
//           <div key={step.id} className="flex items-center">
//             <button
//               onClick={() => setActiveStep(step.id)}
//               className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
//                 activeStep === step.id
//                   ? 'bg-blue-500 text-white'
//                   : step.completed
//                   ? 'bg-green-100 text-green-700 hover:bg-green-200'
//                   : 'bg-white text-gray-500 hover:bg-gray-100'
//               }`}
//             >
//               <span className="text-lg">{step.icon}</span>
//               <span className="font-medium">{step.title}</span>
//               {step.completed && activeStep !== step.id && (
//                 <span className="text-green-500">✓</span>
//               )}
//             </button>
//             {index < steps.length - 1 && (
//               <div className="w-8 h-0.5 bg-gray-300 mx-2"></div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Step Content */}
//       <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
//         {/* Voting Method Step */}
//         {activeStep === 'voting-method' && (
//           <div className="p-6 space-y-6">
//             <div className="flex items-center space-x-2 mb-6">
//               <h3 className="text-lg font-semibold text-gray-900">Choose Voting Method</h3>
//               <HelpCircle className="w-4 h-4 text-gray-400" />
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               {votingTypes.map((type) => (
//                 <div
//                   key={type.id}
//                   className={`relative rounded-lg border-2 cursor-pointer transition-all duration-200 ${
//                     formData.votingType === type.id
//                       ? 'border-blue-500 bg-blue-50 shadow-md'
//                       : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
//                   }`}
//                   onClick={() => handleVotingTypeChange(type.id)}
//                 >
//                   <div className="p-6">
//                     <div className="flex items-center space-x-3 mb-4">
//                       <span className="text-3xl">{type.icon}</span>
//                       <div>
//                         <h4 className="font-semibold text-gray-900">{type.name}</h4>
//                         <p className="text-sm text-gray-600 mt-1">{type.description}</p>
//                       </div>
//                     </div>
                    
//                     <p className="text-sm text-gray-700 mb-3">{type.details}</p>
                    
//                     <div className="space-y-1">
//                       {type.features.map((feature, index) => (
//                         <div key={index} className="flex items-center text-xs text-gray-500">
//                           <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
//                           {feature}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
                  
//                   {formData.votingType === type.id && (
//                     <div className="absolute top-3 right-3">
//                       <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
//                         <div className="w-2 h-2 bg-white rounded-full"></div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
            
//             {errors.votingType && (
//               <p className="text-red-600 text-sm">{errors.votingType}</p>
//             )}

//             {formData.votingType && (
//               <div className="flex justify-end mt-6">
//                 <button
//                   onClick={() => setActiveStep('questions')}
//                   className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
//                 >
//                   <MessageCircle className="w-4 h-4 mr-2" />
//                   Configure Questions
//                 </button>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Questions Step */}
//         {activeStep === 'questions' && formData.votingType && (
//           <div className="p-6">
//             <QuestionCreator
//               electionId={formData.electionId}
//               votingType={formData.votingType}
//               questions={questions}
//               setQuestions={handleQuestionsUpdate}
//               updateFormData={updateFormData}
//               errors={errors}
//             />
            
//             <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
//               <button
//                 onClick={() => setActiveStep('voting-method')}
//                 className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//               >
//                 Back to Voting Method
//               </button>
//               <button
//                 onClick={() => setActiveStep('permissions')}
//                 disabled={questions.length === 0}
//                 className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Continue to Permissions
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Permissions Step */}
//         {activeStep === 'permissions' && (
//           <div className="p-6 space-y-6">
//             <h3 className="text-lg font-semibold text-gray-900">Who Can Vote?</h3>
            
//             <div className="space-y-3">
//               {permissionOptions.map((option) => (
//                 <div
//                   key={option.id}
//                   className={`relative rounded-lg border cursor-pointer transition-all duration-200 ${
//                     formData.permissionToVote === option.id
//                       ? 'border-blue-500 bg-blue-50'
//                       : 'border-gray-200 hover:border-gray-300'
//                   }`}
//                   onClick={() => handlePermissionChange(option.id)}
//                 >
//                   <div className="p-4 flex items-center space-x-3">
//                     {option.icon}
//                     <div>
//                       <h4 className="font-medium text-gray-900">{option.name}</h4>
//                       <p className="text-sm text-gray-600">{option.description}</p>
//                     </div>
//                     {formData.permissionToVote === option.id && (
//                       <div className="ml-auto">
//                         <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
//                           <div className="w-2 h-2 bg-white rounded-full"></div>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
            
//             {errors.permissionToVote && (
//               <p className="text-red-600 text-sm">{errors.permissionToVote}</p>
//             )}

//             <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
//               <button
//                 onClick={() => setActiveStep('questions')}
//                 className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//               >
//                 Back to Questions
//               </button>
//               <button
//                 onClick={() => setActiveStep('features')}
//                 className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//               >
//                 Continue to Features
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Features Step */}
//         {activeStep === 'features' && (
//           <div className="p-6 space-y-8">
//             {/* Paid Election Toggle */}
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900">Participation Fee</h3>
//                   <p className="text-sm text-gray-600">Charge voters to participate in this election</p>
//                 </div>
//                 <label className="relative inline-flex items-center cursor-pointer">
//                   <input
//                     type="checkbox"
//                     className="sr-only peer"
//                     checked={formData.isPaid}
//                     onChange={(e) => handlePaidToggle(e.target.checked)}
//                   />
//                   <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                 </label>
//               </div>

//               {formData.isPaid && (
//                 <div className="bg-gray-50 rounded-lg p-4 space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       <DollarSign className="w-4 h-4 inline mr-1" />
//                       Participation Fee (USD)
//                     </label>
//                     <input
//                       type="number"
//                       min="0.01"
//                       step="0.01"
//                       className={`block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
//                         errors.participationFee ? 'border-red-300' : 'border-gray-300'
//                       }`}
//                       placeholder="1.00"
//                       value={formData.participationFee || ''}
//                       onChange={(e) => updateFormData({ participationFee: parseFloat(e.target.value) || 0 })}
//                     />
//                     {errors.participationFee && (
//                       <p className="text-red-600 text-sm mt-1">{errors.participationFee}</p>
//                     )}
//                   </div>
//                   <div className="bg-blue-50 rounded-md p-3">
//                     <p className="text-sm text-blue-700">
//                       💡 Paid elections help prevent spam voting and can fund prize pools.
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Lottery Configuration */}
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900">Lottery Feature</h3>
//                   <p className="text-sm text-gray-600">Turn this election into a lottery with prizes for voters</p>
//                 </div>
//                 <label className="relative inline-flex items-center cursor-pointer">
//                   <input
//                     type="checkbox"
//                     className="sr-only peer"
//                     checked={formData.isLotterized}
//                     onChange={(e) => handleLotteryToggle(e.target.checked)}
//                   />
//                   <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
//                 </label>
//               </div>

//               {formData.isLotterized && (
//                 <div className="bg-green-50 rounded-lg p-4 space-y-4">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         <Gift className="w-4 h-4 inline mr-1" />
//                         Total Prize Pool (USD)
//                       </label>
//                       <input
//                         type="number"
//                         min="1"
//                         step="1"
//                         className={`block w-full rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
//                           errors.rewardAmount ? 'border-red-300' : 'border-gray-300'
//                         }`}
//                         placeholder="100"
//                         value={formData.rewardAmount || ''}
//                         onChange={(e) => updateFormData({ rewardAmount: parseInt(e.target.value) || 0 })}
//                       />
//                       {errors.rewardAmount && (
//                         <p className="text-red-600 text-sm mt-1">{errors.rewardAmount}</p>
//                       )}
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         <Trophy className="w-4 h-4 inline mr-1" />
//                         Number of Winners (1-100)
//                       </label>
//                       <input
//                         type="number"
//                         min="1"
//                         max="100"
//                         step="1"
//                         className={`block w-full rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
//                           errors.winnerCount ? 'border-red-300' : 'border-gray-300'
//                         }`}
//                         placeholder="1"
//                         value={formData.winnerCount || ''}
//                         onChange={(e) => updateFormData({ winnerCount: parseInt(e.target.value) || 1 })}
//                       />
//                       {errors.winnerCount && (
//                         <p className="text-red-600 text-sm mt-1">{errors.winnerCount}</p>
//                       )}
//                     </div>
//                   </div>

//                   <div className="bg-green-100 rounded-md p-3">
//                     <h4 className="font-medium text-green-800 mb-2">How the Lottery Works:</h4>
//                     <ul className="text-sm text-green-700 space-y-1">
//                       <li>• Each vote automatically becomes a lottery ticket</li>
//                       <li>• Winners are selected randomly when the election ends</li>
//                       <li>• Prizes are distributed automatically to winners' wallets</li>
//                       <li>• All lottery draws are cryptographically secure and verifiable</li>
//                     </ul>
//                   </div>

//                   {formData.rewardAmount > 0 && formData.winnerCount > 0 && (
//                     <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
//                       <p className="text-sm font-medium text-yellow-800">
//                         Prize Distribution: ${(formData.rewardAmount / formData.winnerCount).toFixed(2)} per winner
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Results Display Options */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold text-gray-900">Results Display</h3>
              
//               <div className="space-y-3">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h4 className="font-medium text-gray-900">Show Live Results</h4>
//                     <p className="text-sm text-gray-600">Allow voters to see vote counts while election is active</p>
//                   </div>
//                   <label className="relative inline-flex items-center cursor-pointer">
//                     <input
//                       type="checkbox"
//                       className="sr-only peer"
//                       checked={formData.showLiveResults}
//                       onChange={(e) => updateFormData({ showLiveResults: e.target.checked })}
//                     />
//                     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                   </label>
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h4 className="font-medium text-gray-900">Allow Vote Editing</h4>
//                     <p className="text-sm text-gray-600">Let voters change their vote before the election ends</p>
//                   </div>
//                   <label className="relative inline-flex items-center cursor-pointer">
//                     <input
//                       type="checkbox"
//                       className="sr-only peer"
//                       checked={formData.allowVoteEditing}
//                       onChange={(e) => updateFormData({ allowVoteEditing: e.target.checked })}
//                     />
//                     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                   </label>
//                 </div>
//               </div>
//             </div>

//             <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
//               <button
//                 onClick={() => setActiveStep('permissions')}
//                 className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//               >
//                 Back to Permissions
//               </button>
//               <div className="text-sm text-green-600 flex items-center">
//                 <span className="mr-2">✓</span>
//                 Configuration Complete
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default VotingConfiguration;
// import React, { useState } from 'react';
// import { HelpCircle, Users, DollarSign, Gift, Trophy, MessageCircle } from 'lucide-react';
// import QuestionCreator from './QuestionCreator';

// const VotingConfiguration = ({ formData, updateFormData, errors = {} }) => {
//   const [activeStep, setActiveStep] = useState('voting-method'); // voting-method, questions, permissions, features
//   const [questions, setQuestions] = useState(formData.questions || []);

//   const handleVotingTypeChange = (type) => {
//     updateFormData({ 
//       votingType: type,
//       // Reset questions when voting type changes
//       questions: []
//     });
//     setQuestions([]);
//     // Auto-advance to questions step
//     setActiveStep('questions');
//   };

//   const handlePermissionChange = (permission) => {
//     updateFormData({ permissionToVote: permission });
//   };

//   const handlePaidToggle = (isPaid) => {
//     updateFormData({ 
//       isPaid,
//       participationFee: isPaid ? formData.participationFee || 1 : 0
//     });
//   };

//   const handleLotteryToggle = (isLotterized) => {
//     updateFormData({ 
//       isLotterized,
//       rewardAmount: isLotterized ? formData.rewardAmount || 10 : 0,
//       winnerCount: isLotterized ? formData.winnerCount || 1 : 1
//     });
//   };

//   const votingTypes = [
//     {
//       id: 'plurality',
//       name: 'Plurality Voting',
//       description: 'Single candidate selection - most votes wins',
//       icon: '🗳️',
//       details: 'Voters select one candidate. Candidate with most votes wins.',
//       features: ['Simple and intuitive', 'Quick vote counting', 'Clear winners', 'Traditional democratic voting']
//     },
//     {
//       id: 'ranked_choice',
//       name: 'Ranked Choice Voting',
//       description: 'Preference ranking with elimination rounds',
//       icon: '📊',
//       details: 'Voters rank candidates by preference. Elimination rounds until majority.',
//       features: ['Eliminates spoiler effect', 'Ensures majority winner', 'More representative results', 'Encourages broader appeal']
//     },
//     {
//       id: 'approval',
//       name: 'Approval Voting',
//       description: 'Multiple candidate approval selection',
//       icon: '✅',
//       details: 'Voters approve multiple candidates they support.',
//       features: ['Reduces strategic voting', 'Simple ballot design', 'Encourages moderate candidates', 'Express broader preferences']
//     }
//   ];

//   const permissionOptions = [
//     {
//       id: 'world_citizens',
//       name: 'Open to Everyone',
//       description: 'Anyone in the world can vote',
//       icon: <Users className="w-5 h-5" />
//     },
//     {
//       id: 'registered_members',
//       name: 'Registered Members Only',
//       description: 'Only members of your organization',
//       icon: <Users className="w-5 h-5" />
//     },
//     {
//       id: 'country_specific',
//       name: 'Country Specific',
//       description: 'Residents of selected countries only',
//       icon: <Users className="w-5 h-5" />
//     }
//   ];

//   const steps = [
//     { id: 'voting-method', title: 'Voting Method', icon: '🗳️', completed: !!formData.votingType },
//     { id: 'questions', title: 'Questions', icon: '❓', completed: questions.length > 0 },
//     { id: 'permissions', title: 'Permissions', icon: '👥', completed: !!formData.permissionToVote },
//     { id: 'features', title: 'Features', icon: '⚡', completed: true }
//   ];

//   return (
//     <div className="space-y-8">
//       {/* Header */}
//       <div>
//         <h2 className="text-2xl font-bold text-gray-900">Voting Configuration</h2>
//         <p className="mt-2 text-gray-600">
//           Configure how people will vote and who can participate in your election.
//         </p>
//       </div>

//       {/* Progress Steps */}
//       <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
//         {steps.map((step, index) => (
//           <div key={step.id} className="flex items-center">
//             <button
//               onClick={() => setActiveStep(step.id)}
//               className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
//                 activeStep === step.id
//                   ? 'bg-blue-500 text-white'
//                   : step.completed
//                   ? 'bg-green-100 text-green-700 hover:bg-green-200'
//                   : 'bg-white text-gray-500 hover:bg-gray-100'
//               }`}
//             >
//               <span className="text-lg">{step.icon}</span>
//               <span className="font-medium">{step.title}</span>
//               {step.completed && activeStep !== step.id && (
//                 <span className="text-green-500">✓</span>
//               )}
//             </button>
//             {index < steps.length - 1 && (
//               <div className="w-8 h-0.5 bg-gray-300 mx-2"></div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Step Content */}
//       <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
//         {/* Voting Method Step */}
//         {activeStep === 'voting-method' && (
//           <div className="p-6 space-y-6">
//             <div className="flex items-center space-x-2 mb-6">
//               <h3 className="text-lg font-semibold text-gray-900">Choose Voting Method</h3>
//               <HelpCircle className="w-4 h-4 text-gray-400" />
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               {votingTypes.map((type) => (
//                 <div
//                   key={type.id}
//                   className={`relative rounded-lg border-2 cursor-pointer transition-all duration-200 ${
//                     formData.votingType === type.id
//                       ? 'border-blue-500 bg-blue-50 shadow-md'
//                       : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
//                   }`}
//                   onClick={() => handleVotingTypeChange(type.id)}
//                 >
//                   <div className="p-6">
//                     <div className="flex items-center space-x-3 mb-4">
//                       <span className="text-3xl">{type.icon}</span>
//                       <div>
//                         <h4 className="font-semibold text-gray-900">{type.name}</h4>
//                         <p className="text-sm text-gray-600 mt-1">{type.description}</p>
//                       </div>
//                     </div>
                    
//                     <p className="text-sm text-gray-700 mb-3">{type.details}</p>
                    
//                     <div className="space-y-1">
//                       {type.features.map((feature, index) => (
//                         <div key={index} className="flex items-center text-xs text-gray-500">
//                           <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
//                           {feature}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
                  
//                   {formData.votingType === type.id && (
//                     <div className="absolute top-3 right-3">
//                       <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
//                         <div className="w-2 h-2 bg-white rounded-full"></div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
            
//             {errors.votingType && (
//               <p className="text-red-600 text-sm">{errors.votingType}</p>
//             )}

//             {formData.votingType && (
//               <div className="flex justify-end mt-6">
//                 <button
//                   onClick={() => setActiveStep('questions')}
//                   className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
//                 >
//                   <MessageCircle className="w-4 h-4 mr-2" />
//                   Configure Questions
//                 </button>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Questions Step */}
//         {activeStep === 'questions' && formData.votingType && (
//           <div className="p-6">
//             <QuestionCreator
//               electionId={formData.electionId}
//               votingType={formData.votingType}
//               questions={questions}
//               setQuestions={setQuestions}
//               updateFormData={updateFormData}
//               errors={errors}
//             />
            
//             <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
//               <button
//                 onClick={() => setActiveStep('voting-method')}
//                 className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//               >
//                 Back to Voting Method
//               </button>
//               <button
//                 onClick={() => setActiveStep('permissions')}
//                 disabled={questions.length === 0}
//                 className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Continue to Permissions
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Permissions Step */}
//         {activeStep === 'permissions' && (
//           <div className="p-6 space-y-6">
//             <h3 className="text-lg font-semibold text-gray-900">Who Can Vote?</h3>
            
//             <div className="space-y-3">
//               {permissionOptions.map((option) => (
//                 <div
//                   key={option.id}
//                   className={`relative rounded-lg border cursor-pointer transition-all duration-200 ${
//                     formData.permissionToVote === option.id
//                       ? 'border-blue-500 bg-blue-50'
//                       : 'border-gray-200 hover:border-gray-300'
//                   }`}
//                   onClick={() => handlePermissionChange(option.id)}
//                 >
//                   <div className="p-4 flex items-center space-x-3">
//                     {option.icon}
//                     <div>
//                       <h4 className="font-medium text-gray-900">{option.name}</h4>
//                       <p className="text-sm text-gray-600">{option.description}</p>
//                     </div>
//                     {formData.permissionToVote === option.id && (
//                       <div className="ml-auto">
//                         <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
//                           <div className="w-2 h-2 bg-white rounded-full"></div>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
            
//             {errors.permissionToVote && (
//               <p className="text-red-600 text-sm">{errors.permissionToVote}</p>
//             )}

//             <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
//               <button
//                 onClick={() => setActiveStep('questions')}
//                 className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//               >
//                 Back to Questions
//               </button>
//               <button
//                 onClick={() => setActiveStep('features')}
//                 className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//               >
//                 Continue to Features
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Features Step */}
//         {activeStep === 'features' && (
//           <div className="p-6 space-y-8">
//             {/* Paid Election Toggle */}
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900">Participation Fee</h3>
//                   <p className="text-sm text-gray-600">Charge voters to participate in this election</p>
//                 </div>
//                 <label className="relative inline-flex items-center cursor-pointer">
//                   <input
//                     type="checkbox"
//                     className="sr-only peer"
//                     checked={formData.isPaid}
//                     onChange={(e) => handlePaidToggle(e.target.checked)}
//                   />
//                   <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                 </label>
//               </div>

//               {formData.isPaid && (
//                 <div className="bg-gray-50 rounded-lg p-4 space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       <DollarSign className="w-4 h-4 inline mr-1" />
//                       Participation Fee (USD)
//                     </label>
//                     <input
//                       type="number"
//                       min="0.01"
//                       step="0.01"
//                       className={`block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
//                         errors.participationFee ? 'border-red-300' : 'border-gray-300'
//                       }`}
//                       placeholder="1.00"
//                       value={formData.participationFee || ''}
//                       onChange={(e) => updateFormData({ participationFee: parseFloat(e.target.value) || 0 })}
//                     />
//                     {errors.participationFee && (
//                       <p className="text-red-600 text-sm mt-1">{errors.participationFee}</p>
//                     )}
//                   </div>
//                   <div className="bg-blue-50 rounded-md p-3">
//                     <p className="text-sm text-blue-700">
//                       💡 Paid elections help prevent spam voting and can fund prize pools.
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Lottery Configuration */}
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900">Lottery Feature</h3>
//                   <p className="text-sm text-gray-600">Turn this election into a lottery with prizes for voters</p>
//                 </div>
//                 <label className="relative inline-flex items-center cursor-pointer">
//                   <input
//                     type="checkbox"
//                     className="sr-only peer"
//                     checked={formData.isLotterized}
//                     onChange={(e) => handleLotteryToggle(e.target.checked)}
//                   />
//                   <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
//                 </label>
//               </div>

//               {formData.isLotterized && (
//                 <div className="bg-green-50 rounded-lg p-4 space-y-4">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         <Gift className="w-4 h-4 inline mr-1" />
//                         Total Prize Pool (USD)
//                       </label>
//                       <input
//                         type="number"
//                         min="1"
//                         step="1"
//                         className={`block w-full rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
//                           errors.rewardAmount ? 'border-red-300' : 'border-gray-300'
//                         }`}
//                         placeholder="100"
//                         value={formData.rewardAmount || ''}
//                         onChange={(e) => updateFormData({ rewardAmount: parseInt(e.target.value) || 0 })}
//                       />
//                       {errors.rewardAmount && (
//                         <p className="text-red-600 text-sm mt-1">{errors.rewardAmount}</p>
//                       )}
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         <Trophy className="w-4 h-4 inline mr-1" />
//                         Number of Winners (1-100)
//                       </label>
//                       <input
//                         type="number"
//                         min="1"
//                         max="100"
//                         step="1"
//                         className={`block w-full rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
//                           errors.winnerCount ? 'border-red-300' : 'border-gray-300'
//                         }`}
//                         placeholder="1"
//                         value={formData.winnerCount || ''}
//                         onChange={(e) => updateFormData({ winnerCount: parseInt(e.target.value) || 1 })}
//                       />
//                       {errors.winnerCount && (
//                         <p className="text-red-600 text-sm mt-1">{errors.winnerCount}</p>
//                       )}
//                     </div>
//                   </div>

//                   <div className="bg-green-100 rounded-md p-3">
//                     <h4 className="font-medium text-green-800 mb-2">How the Lottery Works:</h4>
//                     <ul className="text-sm text-green-700 space-y-1">
//                       <li>• Each vote automatically becomes a lottery ticket</li>
//                       <li>• Winners are selected randomly when the election ends</li>
//                       <li>• Prizes are distributed automatically to winners' wallets</li>
//                       <li>• All lottery draws are cryptographically secure and verifiable</li>
//                     </ul>
//                   </div>

//                   {formData.rewardAmount > 0 && formData.winnerCount > 0 && (
//                     <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
//                       <p className="text-sm font-medium text-yellow-800">
//                         Prize Distribution: ${(formData.rewardAmount / formData.winnerCount).toFixed(2)} per winner
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Results Display Options */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold text-gray-900">Results Display</h3>
              
//               <div className="space-y-3">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h4 className="font-medium text-gray-900">Show Live Results</h4>
//                     <p className="text-sm text-gray-600">Allow voters to see vote counts while election is active</p>
//                   </div>
//                   <label className="relative inline-flex items-center cursor-pointer">
//                     <input
//                       type="checkbox"
//                       className="sr-only peer"
//                       checked={formData.showLiveResults}
//                       onChange={(e) => updateFormData({ showLiveResults: e.target.checked })}
//                     />
//                     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                   </label>
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h4 className="font-medium text-gray-900">Allow Vote Editing</h4>
//                     <p className="text-sm text-gray-600">Let voters change their vote before the election ends</p>
//                   </div>
//                   <label className="relative inline-flex items-center cursor-pointer">
//                     <input
//                       type="checkbox"
//                       className="sr-only peer"
//                       checked={formData.allowVoteEditing}
//                       onChange={(e) => updateFormData({ allowVoteEditing: e.target.checked })}
//                     />
//                     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                   </label>
//                 </div>
//               </div>
//             </div>

//             <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
//               <button
//                 onClick={() => setActiveStep('permissions')}
//                 className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//               >
//                 Back to Permissions
//               </button>
//               <div className="text-sm text-green-600 flex items-center">
//                 <span className="mr-2">✓</span>
//                 Configuration Complete
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default VotingConfiguration;
// import React, { useState } from 'react';
// import { HelpCircle, Users, DollarSign, Gift, Trophy, MessageCircle, Plus, Trash2, Edit3 } from 'lucide-react';
// import questionService, { questionHelpers, votingTypeConfigs } from '../../../services/election-2/questionAPI';
// //import { questionService, votingTypeConfigs, questionHelpers } from '../services/election-2/questionAPI';
// //import { questionService, votingTypeConfigs, questionHelpers } from '../services/election-2/questionAPI';

// const VotingConfiguration = ({ formData, updateFormData, errors = {} }) => {
//   const [activeStep, setActiveStep] = useState('voting-method'); // voting-method, questions, permissions, features
//   const [questions, setQuestions] = useState(formData.questions || []);
//   const [editingQuestion, setEditingQuestion] = useState(null);
//   const [savingQuestion, setSavingQuestion] = useState(false);

//   const handleVotingTypeChange = (type) => {
//     updateFormData({ 
//       votingType: type,
//       // Reset questions when voting type changes
//       questions: []
//     });
//     setQuestions([]);
//     // Auto-advance to questions step
//     setActiveStep('questions');
//   };

//   const handlePermissionChange = (permission) => {
//     updateFormData({ permissionToVote: permission });
//   };

//   const handlePaidToggle = (isPaid) => {
//     updateFormData({ 
//       isPaid,
//       participationFee: isPaid ? formData.participationFee || 1 : 0
//     });
//   };

//   const handleLotteryToggle = (isLotterized) => {
//     updateFormData({ 
//       isLotterized,
//       rewardAmount: isLotterized ? formData.rewardAmount || 10 : 0,
//       winnerCount: isLotterized ? formData.winnerCount || 1 : 1
//     });
//   };

//   const addQuestion = () => {
//     /*eslint-disable*/
//     const config = votingTypeConfigs[formData.votingType];
//     const defaultQuestion = questionHelpers.getDefaultQuestion(formData.votingType);
    
//     const newQuestion = {
//       id: `temp_${Date.now()}`, // Temporary ID until saved
//       questionText: '',
//       answerChoices: defaultQuestion.answerChoices,
//       isNew: true
//     };
    
//     setQuestions(prev => [...prev, newQuestion]);
//     setEditingQuestion(newQuestion.id);
//   };

//   const updateQuestion = (questionId, updates) => {
//     setQuestions(prev => prev.map(q => 
//       q.id === questionId ? { ...q, ...updates } : q
//     ));
//   };

//   const deleteQuestion = (questionId) => {
//     setQuestions(prev => prev.filter(q => q.id !== questionId));
//     if (editingQuestion === questionId) {
//       setEditingQuestion(null);
//     }
//   };

//   const addAnswerChoice = (questionId) => {
//     const question = questions.find(q => q.id === questionId);
//     if (!question) return;
    
//     const config = votingTypeConfigs[formData.votingType];
//     if (question.answerChoices.length >= config.maxChoices) {
//       alert(`Maximum ${config.maxChoices} choices allowed for ${formData.votingType.replace('_', ' ')} voting`);
//       return;
//     }

//     const newChoice = {
//       id: `choice_${Date.now()}`,
//       text: ''
//     };
    
//     updateQuestion(questionId, {
//       answerChoices: [...question.answerChoices, newChoice]
//     });
//   };

//   const updateAnswerChoice = (questionId, choiceId, text) => {
//     const question = questions.find(q => q.id === questionId);
//     if (!question) return;
    
//     const updatedChoices = question.answerChoices.map(choice =>
//       choice.id === choiceId ? { ...choice, text } : choice
//     );
    
//     updateQuestion(questionId, { answerChoices: updatedChoices });
//   };

//   const deleteAnswerChoice = (questionId, choiceId) => {
//     const question = questions.find(q => q.id === questionId);
//     if (!question) return;
    
//     const config = votingTypeConfigs[formData.votingType];
//     if (question.answerChoices.length <= config.minChoices) {
//       alert(`Minimum ${config.minChoices} choices required for ${formData.votingType.replace('_', ' ')} voting`);
//       return;
//     }
    
//     const updatedChoices = question.answerChoices.filter(choice => choice.id !== choiceId);
//     updateQuestion(questionId, { answerChoices: updatedChoices });
//   };

//   const saveQuestion = async (questionId) => {
//     const question = questions.find(q => q.id === questionId);
//     if (!question) return;

//     // Validate question
//     const validation = questionHelpers.validateQuestion(
//       formData.votingType, 
//       question.questionText, 
//       question.answerChoices
//     );

//     if (!validation.isValid) {
//       alert(Object.values(validation.errors)[0]);
//       return;
//     }

//     setSavingQuestion(true);
//     try {
//       if (question.isNew) {
//         // Create new question
//         const questionData = questionHelpers.createQuestionData(
//           formData.votingType,
//           question.questionText,
//           question.answerChoices,
//           { questionOrder: questions.length }
//         );

//         const response = await questionService.createQuestion(formData.electionId, questionData);
        
//         // Update the question with server response
//         updateQuestion(questionId, {
//           ...response.data,
//           isNew: false
//         });
//       } else {
//         // Update existing question
//         const questionData = questionHelpers.createQuestionData(
//           formData.votingType,
//           question.questionText,
//           question.answerChoices
//         );

//         await questionService.updateQuestion(question.id, questionData);
//       }

//       setEditingQuestion(null);
      
//       // Update form data
//       updateFormData({ questions: questions });
      
//     } catch (error) {
//       alert(error.message);
//     } finally {
//       setSavingQuestion(false);
//     }
//   };

//   const votingTypes = [
//     {
//       id: 'plurality',
//       name: 'Plurality Voting',
//       description: 'Traditional voting - one choice per voter',
//       icon: '🗳️',
//       details: 'Voters select one candidate. Most votes wins.',
//       features: ['Simple and intuitive', 'Quick vote counting', 'Clear winners']
//     },
//     {
//       id: 'ranked_choice',
//       name: 'Ranked Choice Voting',
//       description: 'Voters rank candidates in order of preference',
//       icon: '📊',
//       details: 'Elimination rounds until one candidate has majority.',
//       features: ['Eliminates spoiler effect', 'Ensures majority winner', 'More representative results']
//     },
//     {
//       id: 'approval',
//       name: 'Approval Voting',
//       description: 'Voters can approve multiple candidates',
//       icon: '✅',
//       details: 'Voters can select all candidates they approve of.',
//       features: ['Reduces strategic voting', 'Simple ballot', 'Encourages moderate candidates']
//     }
//   ];

//   const permissionOptions = [
//     {
//       id: 'world_citizens',
//       name: 'Open to Everyone',
//       description: 'Anyone in the world can vote',
//       icon: <Users className="w-5 h-5" />
//     },
//     {
//       id: 'registered_members',
//       name: 'Registered Members Only',
//       description: 'Only members of your organization',
//       icon: <Users className="w-5 h-5" />
//     },
//     {
//       id: 'country_specific',
//       name: 'Country Specific',
//       description: 'Residents of selected countries only',
//       icon: <Users className="w-5 h-5" />
//     }
//   ];

//   const steps = [
//     { id: 'voting-method', title: 'Voting Method', icon: '🗳️', completed: !!formData.votingType },
//     { id: 'questions', title: 'Questions', icon: '❓', completed: questions.length > 0 },
//     { id: 'permissions', title: 'Permissions', icon: '👥', completed: !!formData.permissionToVote },
//     { id: 'features', title: 'Features', icon: '⚡', completed: true }
//   ];

//   return (
//     <div className="space-y-8">
//       {/* Header */}
//       <div>
//         <h2 className="text-2xl font-bold text-gray-900">Voting Configuration</h2>
//         <p className="mt-2 text-gray-600">
//           Configure how people will vote and who can participate in your election.
//         </p>
//       </div>

//       {/* Progress Steps */}
//       <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
//         {steps.map((step, index) => (
//           <div key={step.id} className="flex items-center">
//             <button
//               onClick={() => setActiveStep(step.id)}
//               className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
//                 activeStep === step.id
//                   ? 'bg-blue-500 text-white'
//                   : step.completed
//                   ? 'bg-green-100 text-green-700 hover:bg-green-200'
//                   : 'bg-white text-gray-500 hover:bg-gray-100'
//               }`}
//             >
//               <span className="text-lg">{step.icon}</span>
//               <span className="font-medium">{step.title}</span>
//               {step.completed && activeStep !== step.id && (
//                 <span className="text-green-500">✓</span>
//               )}
//             </button>
//             {index < steps.length - 1 && (
//               <div className="w-8 h-0.5 bg-gray-300 mx-2"></div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Step Content */}
//       <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
//         {/* Voting Method Step */}
//         {activeStep === 'voting-method' && (
//           <div className="p-6 space-y-6">
//             <div className="flex items-center space-x-2 mb-6">
//               <h3 className="text-lg font-semibold text-gray-900">Choose Voting Method</h3>
//               <HelpCircle className="w-4 h-4 text-gray-400" />
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               {votingTypes.map((type) => (
//                 <div
//                   key={type.id}
//                   className={`relative rounded-lg border-2 cursor-pointer transition-all duration-200 ${
//                     formData.votingType === type.id
//                       ? 'border-blue-500 bg-blue-50 shadow-md'
//                       : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
//                   }`}
//                   onClick={() => handleVotingTypeChange(type.id)}
//                 >
//                   <div className="p-6">
//                     <div className="flex items-center space-x-3 mb-4">
//                       <span className="text-3xl">{type.icon}</span>
//                       <div>
//                         <h4 className="font-semibold text-gray-900">{type.name}</h4>
//                         <p className="text-sm text-gray-600 mt-1">{type.description}</p>
//                       </div>
//                     </div>
                    
//                     <p className="text-sm text-gray-700 mb-3">{type.details}</p>
                    
//                     <div className="space-y-1">
//                       {type.features.map((feature, index) => (
//                         <div key={index} className="flex items-center text-xs text-gray-500">
//                           <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
//                           {feature}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
                  
//                   {formData.votingType === type.id && (
//                     <div className="absolute top-3 right-3">
//                       <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
//                         <div className="w-2 h-2 bg-white rounded-full"></div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
            
//             {errors.votingType && (
//               <p className="text-red-600 text-sm">{errors.votingType}</p>
//             )}

//             {formData.votingType && (
//               <div className="flex justify-end mt-6">
//                 <button
//                   onClick={() => setActiveStep('questions')}
//                   className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
//                 >
//                   <MessageCircle className="w-4 h-4 mr-2" />
//                   Configure Questions
//                 </button>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Questions Step */}
//         {activeStep === 'questions' && formData.votingType && (
//           <div className="p-6">
//             <div className="mb-6">
//               <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
//                 <div className="flex items-center space-x-3 mb-3">
//                   <span className="text-3xl">
//                     {formData.votingType === 'plurality' && '🗳️'}
//                     {formData.votingType === 'ranked_choice' && '📊'}
//                     {formData.votingType === 'approval' && '✅'}
//                   </span>
//                   <div>
//                     <h2 className="text-xl font-bold text-gray-900">
//                       {votingTypeConfigs[formData.votingType]?.title}
//                     </h2>
//                     <p className="text-gray-600">
//                       {votingTypeConfigs[formData.votingType]?.description}
//                     </p>
//                   </div>
//                 </div>
                
//                 <div className="bg-white rounded-md p-4 border border-blue-200">
//                   <div className="flex items-start space-x-2">
//                     <HelpCircle className="w-5 h-5 text-blue-500 mt-0.5" />
//                     <div className="text-sm text-blue-700">
//                       <strong>Requirements:</strong>
//                       <ul className="mt-1 space-y-1">
//                         <li>• Minimum {votingTypeConfigs[formData.votingType]?.minChoices} answer choices per question</li>
//                         <li>• Maximum {votingTypeConfigs[formData.votingType]?.maxChoices} answer choices per question</li>
//                         <li>• {votingTypeConfigs[formData.votingType]?.instruction}</li>
//                       </ul>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Questions List */}
//             <div className="space-y-4 mb-6">
//               {questions.map((question, index) => (
//                 <div key={question.id} className="bg-white rounded-lg border border-gray-200 shadow-sm">
//                   {/* Question Header */}
//                   <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
//                     <div className="flex items-center space-x-3">
//                       <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
//                         {index + 1}
//                       </span>
//                       <h3 className="text-lg font-semibold text-gray-900">
//                         {question.questionText || 'Untitled Question'}
//                       </h3>
//                     </div>
                    
//                     <div className="flex items-center space-x-2">
//                       <button
//                         onClick={() => setEditingQuestion(
//                           editingQuestion === question.id ? null : question.id
//                         )}
//                         className="p-2 rounded-md text-gray-500 hover:text-blue-600 hover:bg-blue-50"
//                       >
//                         <Edit3 className="w-4 h-4" />
//                       </button>
                      
//                       {questions.length > 1 && (
//                         <button
//                           onClick={() => deleteQuestion(question.id)}
//                           className="p-2 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       )}
//                     </div>
//                   </div>

//                   {/* Question Content */}
//                   <div className="p-6">
//                     {editingQuestion === question.id ? (
//                       // Edit Mode
//                       <div className="space-y-4">
//                         {/* Question Text */}
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Question Text *
//                           </label>
//                           <input
//                             type="text"
//                             className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                             placeholder="Enter your question..."
//                             value={question.questionText || ''}
//                             onChange={(e) => updateQuestion(question.id, { questionText: e.target.value })}
//                           />
//                         </div>

//                         {/* Answer Choices */}
//                         <div>
//                           <div className="flex items-center justify-between mb-3">
//                             <label className="block text-sm font-medium text-gray-700">
//                               Answer Choices * 
//                               <span className="text-gray-500">
//                                 (Min: {votingTypeConfigs[formData.votingType]?.minChoices}, 
//                                 Max: {votingTypeConfigs[formData.votingType]?.maxChoices})
//                               </span>
//                             </label>
//                             <button
//                               onClick={() => addAnswerChoice(question.id)}
//                               disabled={question.answerChoices?.length >= votingTypeConfigs[formData.votingType]?.maxChoices}
//                               className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                             >
//                               <Plus className="w-4 h-4 mr-1" />
//                               Add Choice
//                             </button>
//                           </div>

//                           <div className="space-y-2">
//                             {(question.answerChoices || []).map((choice, choiceIndex) => (
//                               <div key={choice.id} className="flex items-center space-x-3">
//                                 <span className="text-sm text-gray-500 w-8">
//                                   {formData.votingType === 'ranked_choice' ? `${choiceIndex + 1}.` : '•'}
//                                 </span>
//                                 <input
//                                   type="text"
//                                   className="flex-1 rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                                   placeholder={`Choice ${choiceIndex + 1}`}
//                                   value={choice.text || ''}
//                                   onChange={(e) => updateAnswerChoice(question.id, choice.id, e.target.value)}
//                                 />
                                
//                                 {question.answerChoices.length > votingTypeConfigs[formData.votingType]?.minChoices && (
//                                   <button
//                                     onClick={() => deleteAnswerChoice(question.id, choice.id)}
//                                     className="p-2 text-gray-400 hover:text-red-600"
//                                   >
//                                     <Trash2 className="w-4 h-4" />
//                                   </button>
//                                 )}
//                               </div>
//                             ))}
//                           </div>
//                         </div>

//                         {/* Voting Type Specific Info */}
//                         <div className="bg-gray-50 rounded-md p-3">
//                           <p className="text-sm text-gray-600">
//                             {formData.votingType === 'plurality' && '🗳️ Voters will select one choice from this question'}
//                             {formData.votingType === 'ranked_choice' && '📊 Voters will rank these choices in order of preference'}
//                             {formData.votingType === 'approval' && '✅ Voters can select multiple choices they approve of'}
//                           </p>
//                         </div>

//                         {/* Save/Cancel Buttons */}
//                         <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
//                           <button
//                             onClick={() => setEditingQuestion(null)}
//                             className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//                           >
//                             Cancel
//                           </button>
//                           <button
//                             onClick={() => saveQuestion(question.id)}
//                             disabled={savingQuestion}
//                             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
//                           >
//                             {savingQuestion ? (
//                               <>
//                                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                                 Saving...
//                               </>
//                             ) : (
//                               'Save Question'
//                             )}
//                           </button>
//                         </div>
//                       </div>
//                     ) : (
//                       // View Mode
//                       <div className="space-y-4">
//                         <div className="space-y-2">
//                           {(question.answerChoices || []).map((choice, choiceIndex) => (
//                             <div key={choice.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
//                               <span className="text-sm font-medium text-gray-500 w-8">
//                                 {formData.votingType === 'ranked_choice' ? `${choiceIndex + 1}.` : '•'}
//                               </span>
//                               <span className="text-gray-700">
//                                 {choice.text || `Choice ${choiceIndex + 1}`}
//                               </span>
//                             </div>
//                           ))}
//                         </div>

//                         {/* Voting Type Indicator */}
//                         <div className="text-xs text-gray-500 bg-gray-100 rounded-md p-2">
//                           {formData.votingType === 'plurality' && '🗳️ Voters select one choice'}
//                           {formData.votingType === 'ranked_choice' && '📊 Voters rank choices by preference'}
//                           {formData.votingType === 'approval' && '✅ Voters can select multiple choices'}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Add Question Button */}
//             <div className="flex justify-center mb-6">
//               <button
//                 onClick={addQuestion}
//                 className="inline-flex items-center px-6 py-3 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-colors"
//               >
//                 <Plus className="w-5 h-5 mr-2" />
//                 Add Question
//               </button>
//             </div>
            
//             <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
//               <button
//                 onClick={() => setActiveStep('voting-method')}
//                 className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//               >
//                 Back to Voting Method
//               </button>
//               <button
//                 onClick={() => setActiveStep('permissions')}
//                 disabled={questions.length === 0}
//                 className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Continue to Permissions
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Permissions Step */}
//         {activeStep === 'permissions' && (
//           <div className="p-6 space-y-6">
//             <h3 className="text-lg font-semibold text-gray-900">Who Can Vote?</h3>
            
//             <div className="space-y-3">
//               {permissionOptions.map((option) => (
//                 <div
//                   key={option.id}
//                   className={`relative rounded-lg border cursor-pointer transition-all duration-200 ${
//                     formData.permissionToVote === option.id
//                       ? 'border-blue-500 bg-blue-50'
//                       : 'border-gray-200 hover:border-gray-300'
//                   }`}
//                   onClick={() => handlePermissionChange(option.id)}
//                 >
//                   <div className="p-4 flex items-center space-x-3">
//                     {option.icon}
//                     <div>
//                       <h4 className="font-medium text-gray-900">{option.name}</h4>
//                       <p className="text-sm text-gray-600">{option.description}</p>
//                     </div>
//                     {formData.permissionToVote === option.id && (
//                       <div className="ml-auto">
//                         <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
//                           <div className="w-2 h-2 bg-white rounded-full"></div>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
            
//             {errors.permissionToVote && (
//               <p className="text-red-600 text-sm">{errors.permissionToVote}</p>
//             )}

//             <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
//               <button
//                 onClick={() => setActiveStep('questions')}
//                 className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//               >
//                 Back to Questions
//               </button>
//               <button
//                 onClick={() => setActiveStep('features')}
//                 className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//               >
//                 Continue to Features
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Features Step */}
//         {activeStep === 'features' && (
//           <div className="p-6 space-y-8">
//             {/* Paid Election Toggle */}
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900">Participation Fee</h3>
//                   <p className="text-sm text-gray-600">Charge voters to participate in this election</p>
//                 </div>
//                 <label className="relative inline-flex items-center cursor-pointer">
//                   <input
//                     type="checkbox"
//                     className="sr-only peer"
//                     checked={formData.isPaid}
//                     onChange={(e) => handlePaidToggle(e.target.checked)}
//                   />
//                   <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                 </label>
//               </div>

//               {formData.isPaid && (
//                 <div className="bg-gray-50 rounded-lg p-4 space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       <DollarSign className="w-4 h-4 inline mr-1" />
//                       Participation Fee (USD)
//                     </label>
//                     <input
//                       type="number"
//                       min="0.01"
//                       step="0.01"
//                       className={`block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
//                         errors.participationFee ? 'border-red-300' : 'border-gray-300'
//                       }`}
//                       placeholder="1.00"
//                       value={formData.participationFee || ''}
//                       onChange={(e) => updateFormData({ participationFee: parseFloat(e.target.value) || 0 })}
//                     />
//                     {errors.participationFee && (
//                       <p className="text-red-600 text-sm mt-1">{errors.participationFee}</p>
//                     )}
//                   </div>
//                   <div className="bg-blue-50 rounded-md p-3">
//                     <p className="text-sm text-blue-700">
//                       💡 Paid elections help prevent spam voting and can fund prize pools.
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Lottery Configuration */}
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900">Lottery Feature</h3>
//                   <p className="text-sm text-gray-600">Turn this election into a lottery with prizes for voters</p>
//                 </div>
//                 <label className="relative inline-flex items-center cursor-pointer">
//                   <input
//                     type="checkbox"
//                     className="sr-only peer"
//                     checked={formData.isLotterized}
//                     onChange={(e) => handleLotteryToggle(e.target.checked)}
//                   />
//                   <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
//                 </label>
//               </div>

//               {formData.isLotterized && (
//                 <div className="bg-green-50 rounded-lg p-4 space-y-4">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         <Gift className="w-4 h-4 inline mr-1" />
//                         Total Prize Pool (USD)
//                       </label>
//                       <input
//                         type="number"
//                         min="1"
//                         step="1"
//                         className={`block w-full rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
//                           errors.rewardAmount ? 'border-red-300' : 'border-gray-300'
//                         }`}
//                         placeholder="100"
//                         value={formData.rewardAmount || ''}
//                         onChange={(e) => updateFormData({ rewardAmount: parseInt(e.target.value) || 0 })}
//                       />
//                       {errors.rewardAmount && (
//                         <p className="text-red-600 text-sm mt-1">{errors.rewardAmount}</p>
//                       )}
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         <Trophy className="w-4 h-4 inline mr-1" />
//                         Number of Winners (1-100)
//                       </label>
//                       <input
//                         type="number"
//                         min="1"
//                         max="100"
//                         step="1"
//                         className={`block w-full rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
//                           errors.winnerCount ? 'border-red-300' : 'border-gray-300'
//                         }`}
//                         placeholder="1"
//                         value={formData.winnerCount || ''}
//                         onChange={(e) => updateFormData({ winnerCount: parseInt(e.target.value) || 1 })}
//                       />
//                       {errors.winnerCount && (
//                         <p className="text-red-600 text-sm mt-1">{errors.winnerCount}</p>
//                       )}
//                     </div>
//                   </div>

//                   <div className="bg-green-100 rounded-md p-3">
//                     <h4 className="font-medium text-green-800 mb-2">How the Lottery Works:</h4>
//                     <ul className="text-sm text-green-700 space-y-1">
//                       <li>• Each vote automatically becomes a lottery ticket</li>
//                       <li>• Winners are selected randomly when the election ends</li>
//                       <li>• Prizes are distributed automatically to winners' wallets</li>
//                       <li>• All lottery draws are cryptographically secure and verifiable</li>
//                     </ul>
//                   </div>

//                   {formData.rewardAmount > 0 && formData.winnerCount > 0 && (
//                     <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
//                       <p className="text-sm font-medium text-yellow-800">
//                         Prize Distribution: ${(formData.rewardAmount / formData.winnerCount).toFixed(2)} per winner
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Results Display Options */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold text-gray-900">Results Display</h3>
              
//               <div className="space-y-3">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h4 className="font-medium text-gray-900">Show Live Results</h4>
//                     <p className="text-sm text-gray-600">Allow voters to see vote counts while election is active</p>
//                   </div>
//                   <label className="relative inline-flex items-center cursor-pointer">
//                     <input
//                       type="checkbox"
//                       className="sr-only peer"
//                       checked={formData.showLiveResults}
//                       onChange={(e) => updateFormData({ showLiveResults: e.target.checked })}
//                     />
//                     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                   </label>
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h4 className="font-medium text-gray-900">Allow Vote Editing</h4>
//                     <p className="text-sm text-gray-600">Let voters change their vote before the election ends</p>
//                   </div>
//                   <label className="relative inline-flex items-center cursor-pointer">
//                     <input
//                       type="checkbox"
//                       className="sr-only peer"
//                       checked={formData.allowVoteEditing}
//                       onChange={(e) => updateFormData({ allowVoteEditing: e.target.checked })}
//                     />
//                     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                   </label>
//                 </div>
//               </div>
//             </div>

//             <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
//               <button
//                 onClick={() => setActiveStep('permissions')}
//                 className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//               >
//                 Back to Permissions
//               </button>
//               <div className="text-sm text-green-600 flex items-center">
//                 <span className="mr-2">✓</span>
//                 Configuration Complete
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default VotingConfiguration;
// import React from 'react';
// import { HelpCircle, Users, DollarSign, Gift, Trophy } from 'lucide-react';

// const VotingConfiguration = ({ formData, updateFormData, errors = {} }) => {
//   const handleVotingTypeChange = (type) => {
//     updateFormData({ votingType: type });
//   };

//   const handlePermissionChange = (permission) => {
//     updateFormData({ permissionToVote: permission });
//   };

//   const handlePaidToggle = (isPaid) => {
//     updateFormData({ 
//       isPaid,
//       participationFee: isPaid ? formData.participationFee || 1 : 0
//     });
//   };

//   const handleLotteryToggle = (isLotterized) => {
//     updateFormData({ 
//       isLotterized,
//       rewardAmount: isLotterized ? formData.rewardAmount || 10 : 0,
//       winnerCount: isLotterized ? formData.winnerCount || 1 : 1
//     });
//   };

//   const votingTypes = [
//     {
//       id: 'plurality ',
//       name: 'Plurality Voting',
//       description: 'Traditional voting - one choice per voter',
//       icon: '🗳️',
//       details: 'Voters select one candidate. Most votes wins.'
//     },
//     {
//       id: 'ranked_choice',
//       name: 'Ranked Choice Voting',
//       description: 'Voters rank candidates in order of preference',
//       icon: '📊',
//       details: 'Elimination rounds until one candidate has majority.'
//     },
//     {
//       id: 'approval',
//       name: 'Approval Voting',
//       description: 'Voters can approve multiple candidates',
//       icon: '✅',
//       details: 'Voters can select all candidates they approve of.'
//     }
//   ];

//   const permissionOptions = [
//     {
//       id: 'world_citizens',
//       name: 'Open to Everyone',
//       description: 'Anyone in the world can vote',
//       icon: <Users className="w-5 h-5" />
//     },
//     {
//       id: 'registered_members',
//       name: 'Registered Members Only',
//       description: 'Only members of your organization',
//       icon: <Users className="w-5 h-5" />
//     },
//     {
//       id: 'country_specific',
//       name: 'Country Specific',
//       description: 'Residents of selected countries only',
//       icon: <Users className="w-5 h-5" />
//     }
//   ];

//   return (
//     <div className="space-y-8">
//       {/* Header */}
//       <div>
//         <h2 className="text-2xl font-bold text-gray-900">Voting Configuration</h2>
//         <p className="mt-2 text-gray-600">
//           Configure how people will vote and who can participate in your election.
//         </p>
//       </div>

//       {/* Voting Type Selection */}
//       <div className="space-y-4">
//         <div className="flex items-center space-x-2">
//           <h3 className="text-lg font-semibold text-gray-900">Voting Method</h3>
//           <HelpCircle className="w-4 h-4 text-gray-400" />
//         </div>
        
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {votingTypes.map((type) => (
//             <div
//               key={type.id}
//               className={`relative rounded-lg border-2 cursor-pointer transition-all duration-200 ${
//                 formData.votingType === type.id
//                   ? 'border-blue-500 bg-blue-50'
//                   : 'border-gray-200 hover:border-gray-300'
//               }`}
//               onClick={() => handleVotingTypeChange(type.id)}
//             >
//               <div className="p-4">
//                 <div className="flex items-center space-x-3">
//                   <span className="text-2xl">{type.icon}</span>
//                   <div>
//                     <h4 className="font-semibold text-gray-900">{type.name}</h4>
//                     <p className="text-sm text-gray-600 mt-1">{type.description}</p>
//                   </div>
//                 </div>
//                 <p className="text-xs text-gray-500 mt-2">{type.details}</p>
//               </div>
              
//               {formData.votingType === type.id && (
//                 <div className="absolute top-2 right-2">
//                   <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
//                     <div className="w-2 h-2 bg-white rounded-full"></div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//         {errors.votingType && (
//           <p className="text-red-600 text-sm">{errors.votingType}</p>
//         )}
//       </div>

//       {/* Permission to Vote */}
//       <div className="space-y-4">
//         <h3 className="text-lg font-semibold text-gray-900">Who Can Vote?</h3>
        
//         <div className="space-y-3">
//           {permissionOptions.map((option) => (
//             <div
//               key={option.id}
//               className={`relative rounded-lg border cursor-pointer transition-all duration-200 ${
//                 formData.permissionToVote === option.id
//                   ? 'border-blue-500 bg-blue-50'
//                   : 'border-gray-200 hover:border-gray-300'
//               }`}
//               onClick={() => handlePermissionChange(option.id)}
//             >
//               <div className="p-4 flex items-center space-x-3">
//                 {option.icon}
//                 <div>
//                   <h4 className="font-medium text-gray-900">{option.name}</h4>
//                   <p className="text-sm text-gray-600">{option.description}</p>
//                 </div>
//                 {formData.permissionToVote === option.id && (
//                   <div className="ml-auto">
//                     <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
//                       <div className="w-2 h-2 bg-white rounded-full"></div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//         {errors.permissionToVote && (
//           <p className="text-red-600 text-sm">{errors.permissionToVote}</p>
//         )}
//       </div>

//       {/* Paid Election Toggle */}
//       <div className="space-y-4">
//         <div className="flex items-center justify-between">
//           <div>
//             <h3 className="text-lg font-semibold text-gray-900">Participation Fee</h3>
//             <p className="text-sm text-gray-600">Charge voters to participate in this election</p>
//           </div>
//           <label className="relative inline-flex items-center cursor-pointer">
//             <input
//               type="checkbox"
//               className="sr-only peer"
//               checked={formData.isPaid}
//               onChange={(e) => handlePaidToggle(e.target.checked)}
//             />
//             <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//           </label>
//         </div>

//         {formData.isPaid && (
//           <div className="bg-gray-50 rounded-lg p-4 space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 <DollarSign className="w-4 h-4 inline mr-1" />
//                 Participation Fee (USD)
//               </label>
//               <input
//                 type="number"
//                 min="0.01"
//                 step="0.01"
//                 className={`block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
//                   errors.participationFee ? 'border-red-300' : 'border-gray-300'
//                 }`}
//                 placeholder="1.00"
//                 value={formData.participationFee || ''}
//                 onChange={(e) => updateFormData({ participationFee: parseFloat(e.target.value) || 0 })}
//               />
//               {errors.participationFee && (
//                 <p className="text-red-600 text-sm mt-1">{errors.participationFee}</p>
//               )}
//             </div>
//             <div className="bg-blue-50 rounded-md p-3">
//               <p className="text-sm text-blue-700">
//                 💡 Paid elections help prevent spam voting and can fund prize pools.
//               </p>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Lottery Configuration */}
//       <div className="space-y-4">
//         <div className="flex items-center justify-between">
//           <div>
//             <h3 className="text-lg font-semibold text-gray-900">Lottery Feature</h3>
//             <p className="text-sm text-gray-600">Turn this election into a lottery with prizes for voters</p>
//           </div>
//           <label className="relative inline-flex items-center cursor-pointer">
//             <input
//               type="checkbox"
//               className="sr-only peer"
//               checked={formData.isLotterized}
//               onChange={(e) => handleLotteryToggle(e.target.checked)}
//             />
//             <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
//           </label>
//         </div>

//         {formData.isLotterized && (
//           <div className="bg-green-50 rounded-lg p-4 space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   <Gift className="w-4 h-4 inline mr-1" />
//                   Total Prize Pool (USD)
//                 </label>
//                 <input
//                   type="number"
//                   min="1"
//                   step="1"
//                   className={`block w-full rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
//                     errors.rewardAmount ? 'border-red-300' : 'border-gray-300'
//                   }`}
//                   placeholder="100"
//                   value={formData.rewardAmount || ''}
//                   onChange={(e) => updateFormData({ rewardAmount: parseInt(e.target.value) || 0 })}
//                 />
//                 {errors.rewardAmount && (
//                   <p className="text-red-600 text-sm mt-1">{errors.rewardAmount}</p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   <Trophy className="w-4 h-4 inline mr-1" />
//                   Number of Winners (1-100)
//                 </label>
//                 <input
//                   type="number"
//                   min="1"
//                   max="100"
//                   step="1"
//                   className={`block w-full rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
//                     errors.winnerCount ? 'border-red-300' : 'border-gray-300'
//                   }`}
//                   placeholder="1"
//                   value={formData.winnerCount || ''}
//                   onChange={(e) => updateFormData({ winnerCount: parseInt(e.target.value) || 1 })}
//                 />
//                 {errors.winnerCount && (
//                   <p className="text-red-600 text-sm mt-1">{errors.winnerCount}</p>
//                 )}
//               </div>
//             </div>

//             <div className="bg-green-100 rounded-md p-3">
//               <h4 className="font-medium text-green-800 mb-2">🎰 How the Lottery Works:</h4>
//               <ul className="text-sm text-green-700 space-y-1">
//                 <li>• Each vote automatically becomes a lottery ticket</li>
//                 <li>• Winners are selected randomly when the election ends</li>
//                 <li>• Prizes are distributed automatically to winners' wallets</li>
//                 <li>• All lottery draws are cryptographically secure and verifiable</li>
//               </ul>
//             </div>

//             {formData.rewardAmount > 0 && formData.winnerCount > 0 && (
//               <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
//                 <p className="text-sm font-medium text-yellow-800">
//                   Prize Distribution: ${(formData.rewardAmount / formData.winnerCount).toFixed(2)} per winner
//                 </p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Results Display Options */}
//       <div className="space-y-4">
//         <h3 className="text-lg font-semibold text-gray-900">Results Display</h3>
        
//         <div className="space-y-3">
//           <div className="flex items-center justify-between">
//             <div>
//               <h4 className="font-medium text-gray-900">Show Live Results</h4>
//               <p className="text-sm text-gray-600">Allow voters to see vote counts while election is active</p>
//             </div>
//             <label className="relative inline-flex items-center cursor-pointer">
//               <input
//                 type="checkbox"
//                 className="sr-only peer"
//                 checked={formData.showLiveResults}
//                 onChange={(e) => updateFormData({ showLiveResults: e.target.checked })}
//               />
//               <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//             </label>
//           </div>

//           <div className="flex items-center justify-between">
//             <div>
//               <h4 className="font-medium text-gray-900">Allow Vote Editing</h4>
//               <p className="text-sm text-gray-600">Let voters change their vote before the election ends</p>
//             </div>
//             <label className="relative inline-flex items-center cursor-pointer">
//               <input
//                 type="checkbox"
//                 className="sr-only peer"
//                 checked={formData.allowVoteEditing}
//                 onChange={(e) => updateFormData({ allowVoteEditing: e.target.checked })}
//               />
//               <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//             </label>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VotingConfiguration;