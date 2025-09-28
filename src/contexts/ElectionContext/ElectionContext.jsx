// // contexts/ElectionContext/ElectionContext.js
// import { createContext } from 'react';

// // Initial state
// export const initialState = {
//   election: {
//     // Basic Information
//     title: '',
//     description: '',
//     topicImageUrl: '',
//     topicVideoUrl: '',
//     logoBrandingUrl: '',
//     customVotingUrl: '',
    
//     // Scheduling
//     startDate: { date: '', time: '09:00' },
//     endDate: { date: '', time: '18:00' },
//     startTime: '09:00',
//     endTime: '18:00',
//     timezone: 'UTC',
    
//     // Voting Configuration
//     votingType: 'plurality',
//     permissionToVote: 'open',
    
//     // Authentication
//     authMethod: 'passkey',
//     biometricRequired: false,
//     allowOauth: true,
//     allowMagicLink: true,
//     allowEmailPassword: true,
    
//     // Location Settings
//     isCountrySpecific: false,
//     countries: [],
    
//     // Pricing
//     pricingType: 'free',
//     isPaid: false,
//     participationFee: 0,
//     regionalFees: {
//       region1: 0, region2: 0, region3: 0, region4: 0,
//       region5: 0, region6: 0, region7: 0, region8: 0
//     },
//     processingFeePercentage: 0,
//     projectedRevenue: 0,
//     revenueSharePercentage: 0,
    
//     // Lottery Configuration
//     isLotterized: false,
//     rewardType: 'monetary',
//     rewardAmount: 0,
//     nonMonetaryReward: '',
//     winnerCount: 1,
    
//     // Display Settings
//     showLiveResults: true,
//     allowVoteEditing: true,
//     customCss: '',
//     brandColors: {
//       primary: '#3B82F6',
//       secondary: '#64748B',
//       accent: '#10B981',
//       background: '#FFFFFF',
//       text: '#1F2937'
//     },
    
//     // Internationalization
//     primaryLanguage: 'en',
//     supportsMultilang: false,
    
//     // Status
//     isDraft: true,
//     isPublished: false,
    
//     // Questions
//     questions: [],
    
//     // User Info
//     creatorId: null
//   },
//   uploadedFiles: {
//     topicImage: null,
//     logoBranding: null,
//     questionImages: [],
//     answerImages: []
//   },
//   isLoading: false,
//   error: null,
//   lastSaved: null
// };

// // Action types
// export const ActionTypes = {
//   SET_LOADING: 'SET_LOADING',
//   SET_ERROR: 'SET_ERROR',
//   SET_ELECTION_DATA: 'SET_ELECTION_DATA',
//   UPDATE_FIELD: 'UPDATE_FIELD',
//   UPDATE_FILES: 'UPDATE_FILES',
//   RESET_ELECTION: 'RESET_ELECTION',
//   SET_LAST_SAVED: 'SET_LAST_SAVED'
// };

// // Reducer
// export const electionReducer = (state, action) => {
//   switch (action.type) {
//     case ActionTypes.SET_LOADING:
//       return { ...state, isLoading: action.payload };
      
//     case ActionTypes.SET_ERROR:
//       return { ...state, error: action.payload, isLoading: false };
      
//     case ActionTypes.SET_ELECTION_DATA:
//       return { 
//         ...state, 
//         election: { ...state.election, ...action.payload },
//         error: null 
//       };
      
//     case ActionTypes.UPDATE_FIELD:
//       return { 
//         ...state, 
//         election: { ...state.election, ...action.payload } 
//       };
      
//     case ActionTypes.UPDATE_FILES:
//       return { 
//         ...state, 
//         uploadedFiles: { ...state.uploadedFiles, ...action.payload } 
//       };
      
//     case ActionTypes.RESET_ELECTION:
//       return { ...initialState };
      
//     case ActionTypes.SET_LAST_SAVED:
//       return { ...state, lastSaved: action.payload };
      
//     default:
//       return state;
//   }
// };

// // Create context
// export const ElectionContext = createContext();
// import React, { createContext, useReducer, useCallback } from 'react';
// import { electionReducer, initialState, ELECTION_ACTIONS } from './electionReducer';

// // Create Context
// const ElectionContext = createContext();

// // Provider Component
// export const ElectionProvider = ({ children, initialElection = {} }) => {
//   const [state, dispatch] = useReducer(electionReducer, {
//     ...initialState,
//     ...initialElection
//   });

//   // Action Creators
//   const setElectionData = useCallback((data) => {
//     dispatch({ type: ELECTION_ACTIONS.SET_ELECTION_DATA, payload: data });
//   }, []);

//   const updateElectionField = useCallback((updates) => {
//     dispatch({ type: ELECTION_ACTIONS.UPDATE_ELECTION_FIELD, payload: updates });
//   }, []);

//   const addQuestion = useCallback((question) => {
//     const questionWithId = {
//       ...question,
//       id: question.id || `question_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
//       answers: question.answers || []
//     };
//     dispatch({ type: ELECTION_ACTIONS.ADD_QUESTION, payload: questionWithId });
//     return questionWithId.id;
//   }, []);

//   const updateQuestion = useCallback((questionId, updates) => {
//     dispatch({ 
//       type: ELECTION_ACTIONS.UPDATE_QUESTION, 
//       payload: { id: questionId, ...updates } 
//     });
//   }, []);

//   const deleteQuestion = useCallback((questionId) => {
//     dispatch({ type: ELECTION_ACTIONS.DELETE_QUESTION, payload: questionId });
//   }, []);

//   const addAnswer = useCallback((questionId, answer) => {
//     const answerWithId = {
//       ...answer,
//       id: answer.id || `answer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
//     };
//     dispatch({ 
//       type: ELECTION_ACTIONS.ADD_ANSWER, 
//       payload: { questionId, answer: answerWithId } 
//     });
//     return answerWithId.id;
//   }, []);

//   const updateAnswer = useCallback((questionId, answerId, updates) => {
//     dispatch({ 
//       type: ELECTION_ACTIONS.UPDATE_ANSWER, 
//       payload: { questionId, answerId, updates } 
//     });
//   }, []);

//   const deleteAnswer = useCallback((questionId, answerId) => {
//     dispatch({ 
//       type: ELECTION_ACTIONS.DELETE_ANSWER, 
//       payload: { questionId, answerId } 
//     });
//   }, []);

//   const setLoading = useCallback((loading) => {
//     dispatch({ type: ELECTION_ACTIONS.SET_LOADING, payload: loading });
//   }, []);

//   const setError = useCallback((error) => {
//     dispatch({ type: ELECTION_ACTIONS.SET_ERROR, payload: error });
//   }, []);

//   const clearError = useCallback(() => {
//     dispatch({ type: ELECTION_ACTIONS.CLEAR_ERROR });
//   }, []);

//   const resetElection = useCallback(() => {
//     dispatch({ type: ELECTION_ACTIONS.RESET_ELECTION });
//   }, []);

//   // Image Upload Functions
//   const uploadImage = useCallback((file, type, questionId = null, answerId = null) => {
//     // Validate file
//     if (!file || !file.type.startsWith('image/')) {
//       setError('Please select a valid image file');
//       return null;
//     }

//     // Check file size (5MB limit)
//     if (file.size > 5 * 1024 * 1024) {
//       setError('Image file size must be less than 5MB');
//       return null;
//     }

//     // Create temporary URL for immediate preview
//     const tempUrl = URL.createObjectURL(file);
    
//     // Update context immediately with temp URL for preview
//     switch (type) {
//       case 'question':
//         if (questionId) {
//           dispatch({ 
//             type: ELECTION_ACTIONS.UPDATE_QUESTION_IMAGE, 
//             payload: { questionId, imageUrl: tempUrl } 
//           });
//         }
//         break;
//       case 'answer':
//         if (questionId && answerId) {
//           dispatch({ 
//             type: ELECTION_ACTIONS.UPDATE_ANSWER_IMAGE, 
//             payload: { questionId, answerId, imageUrl: tempUrl } 
//           });
//         }
//         break;
//       case 'topic':
//         dispatch({ 
//           type: ELECTION_ACTIONS.UPDATE_TOPIC_IMAGE, 
//           payload: tempUrl 
//         });
//         break;
//       case 'logo':
//         dispatch({ 
//           type: ELECTION_ACTIONS.UPDATE_LOGO_IMAGE, 
//           payload: tempUrl 
//         });
//         break;
//       default:
//         setError('Invalid image type');
//         return null;
//     }

//     // Add to pending uploads for later API call
//     const uploadItem = {
//       id: `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
//       file,
//       type,
//       questionId,
//       answerId,
//       tempUrl,
//       status: 'pending',
//       timestamp: Date.now()
//     };

//     dispatch({ 
//       type: ELECTION_ACTIONS.UPLOAD_IMAGE_START, 
//       payload: uploadItem 
//     });

//     return uploadItem.id;
//   }, [setError]);

//   const uploadPendingImages = useCallback(async () => {
//     const { pending } = state.imageUploads;
    
//     if (pending.length === 0) return;

//     try {
//       // Process each pending upload
//       for (const uploadItem of pending) {
//         const formData = new FormData();
//         formData.append('image', uploadItem.file);
//         formData.append('type', uploadItem.type);
        
//         if (uploadItem.questionId) {
//           formData.append('questionId', uploadItem.questionId);
//         }
//         if (uploadItem.answerId) {
//           formData.append('answerId', uploadItem.answerId);
//         }
        
//         // API call to upload image
//         const response = await fetch('/api/upload/image', {
//           method: 'POST',
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('authToken')}`
//           },
//           body: formData
//         });
        
//         if (!response.ok) {
//           throw new Error(`Upload failed: ${response.statusText}`);
//         }
        
//         const result = await response.json();
        
//         // Update with real URL from API
//         switch (uploadItem.type) {
//           case 'question':
//             dispatch({ 
//               type: ELECTION_ACTIONS.UPDATE_QUESTION_IMAGE, 
//               payload: { questionId: uploadItem.questionId, imageUrl: result.imageUrl } 
//             });
//             break;
//           case 'answer':
//             dispatch({ 
//               type: ELECTION_ACTIONS.UPDATE_ANSWER_IMAGE, 
//               payload: { 
//                 questionId: uploadItem.questionId, 
//                 answerId: uploadItem.answerId, 
//                 imageUrl: result.imageUrl 
//               } 
//             });
//             break;
//           case 'topic':
//             dispatch({ 
//               type: ELECTION_ACTIONS.UPDATE_TOPIC_IMAGE, 
//               payload: result.imageUrl 
//             });
//             break;
//           case 'logo':
//             dispatch({ 
//               type: ELECTION_ACTIONS.UPDATE_LOGO_IMAGE, 
//               payload: result.imageUrl 
//             });
//             break;
//         }
        
//         // Clean up temp URL
//         URL.revokeObjectURL(uploadItem.tempUrl);
//       }
      
//       // Clear pending uploads
//       dispatch({ type: ELECTION_ACTIONS.CLEAR_PENDING_UPLOADS });
//       dispatch({ type: ELECTION_ACTIONS.UPLOAD_IMAGE_SUCCESS });
      
//     } catch (error) {
//       dispatch({ 
//         type: ELECTION_ACTIONS.UPLOAD_IMAGE_FAILURE, 
//         payload: error.message 
//       });
//       setError('Failed to upload images: ' + error.message);
//       throw error;
//     }
//   }, [state.imageUploads, setError]);

//   const removeImage = useCallback((type, questionId = null, answerId = null) => {
//     switch (type) {
//       case 'question':
//         if (questionId) {
//           dispatch({ 
//             type: ELECTION_ACTIONS.UPDATE_QUESTION_IMAGE, 
//             payload: { questionId, imageUrl: null } 
//           });
//         }
//         break;
//       case 'answer':
//         if (questionId && answerId) {
//           dispatch({ 
//             type: ELECTION_ACTIONS.UPDATE_ANSWER_IMAGE, 
//             payload: { questionId, answerId, imageUrl: null } 
//           });
//         }
//         break;
//       case 'topic':
//         dispatch({ 
//           type: ELECTION_ACTIONS.UPDATE_TOPIC_IMAGE, 
//           payload: null 
//         });
//         break;
//       case 'logo':
//         dispatch({ 
//           type: ELECTION_ACTIONS.UPDATE_LOGO_IMAGE, 
//           payload: null 
//         });
//         break;
//     }
//   }, []);

//   // Selectors
//   const getQuestion = useCallback((questionId) => {
//     return state.questions.find(q => q.id === questionId);
//   }, [state.questions]);

//   const getAnswer = useCallback((questionId, answerId) => {
//     const question = state.questions.find(q => q.id === questionId);
//     return question?.answers?.find(a => a.id === answerId);
//   }, [state.questions]);

//   const getAllQuestions = useCallback(() => {
//     return state.questions;
//   }, [state.questions]);

//   const getQuestionsByType = useCallback((type) => {
//     return state.questions.filter(q => q.questionType === type);
//   }, [state.questions]);

//   const getTotalAnswersCount = useCallback(() => {
//     return state.questions.reduce((total, question) => 
//       total + (question.answers?.length || 0), 0
//     );
//   }, [state.questions]);

//   const isElectionValid = useCallback(() => {
//     const hasTitle = state.title && state.title.trim().length > 0;
//     const hasStartDate = state.startDate && state.startDate.date;
//     const hasEndDate = state.endDate && state.endDate.date;
//     const hasQuestions = state.questions.length > 0;
    
//     return hasTitle && hasStartDate && hasEndDate && hasQuestions;
//   }, [state.title, state.startDate, state.endDate, state.questions]);

//   const getElectionSummary = useCallback(() => {
//     return {
//       title: state.title,
//       questionsCount: state.questions.length,
//       answersCount: state.questions.reduce((total, q) => total + (q.answers?.length || 0), 0),
//       votingType: state.votingType,
//       isLotterized: state.isLotterized,
//       isPaid: state.pricingType !== 'free',
//       startDate: state.startDate,
//       endDate: state.endDate,
//       pendingUploads: state.imageUploads.pending.length
//     };
//   }, [state]);

//   // API functions
//   const saveElection = useCallback(async () => {
//     setLoading(true);
//     try {
//       // Upload pending images first
//       if (state.imageUploads.pending.length > 0) {
//         await uploadPendingImages();
//       }
      
//       // Mock API call for saving election
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       const savedData = {
//         ...state,
//         electionId: state.electionId || `election_${Date.now()}`,
//         lastSaved: new Date().toISOString(),
//         isDraft: true
//       };
      
//       updateElectionField({
//         electionId: savedData.electionId,
//         lastSaved: savedData.lastSaved,
//         isDraft: true
//       });
      
//       return savedData;
//     } catch (error) {
//       setError('Failed to save election');
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   }, [state, uploadPendingImages, setLoading, setError, updateElectionField]);

//   const publishElection = useCallback(async () => {
//     setLoading(true);
//     try {
//       if (!isElectionValid()) {
//         throw new Error('Election is not valid for publishing');
//       }

//       // Upload pending images first
//       if (state.imageUploads.pending.length > 0) {
//         await uploadPendingImages();
//       }

//       // Mock API call for publishing
//       await new Promise(resolve => setTimeout(resolve, 1500));
      
//       updateElectionField({
//         isPublished: true,
//         isDraft: false,
//         lastSaved: new Date().toISOString()
//       });
      
//       return state;
//     } catch (error) {
//       setError('Failed to publish election');
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   }, [state, uploadPendingImages, setLoading, setError, updateElectionField, isElectionValid]);

//   const loadElection = useCallback(async (electionId) => {
//     setLoading(true);
//     clearError();
    
//     try {
//       // Mock API call
//       await new Promise(resolve => setTimeout(resolve, 800));
      
//       // Mock loaded data - in real implementation, this would come from API
//       const mockElectionData = {
//         ...state,
//         electionId,
//         title: `Loaded Election ${electionId}`,
//         description: 'This is a loaded election',
//         // ... other loaded data
//       };
      
//       setElectionData(mockElectionData);
//       return mockElectionData;
//     } catch (error) {
//       setError('Failed to load election');
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   }, [state, setLoading, clearError, setError, setElectionData]);

//   const contextValue = {
//     // Current state
//     election: state,
    
//     // Actions
//     setElectionData,
//     updateElectionField,
//     addQuestion,
//     updateQuestion,
//     deleteQuestion,
//     addAnswer,
//     updateAnswer,
//     deleteAnswer,
//     setLoading,
//     setError,
//     clearError,
//     resetElection,
    
//     // Image Upload Actions
//     uploadImage,
//     uploadPendingImages,
//     removeImage,
    
//     // Selectors
//     getQuestion,
//     getAnswer,
//     getAllQuestions,
//     getQuestionsByType,
//     getTotalAnswersCount,
//     isElectionValid,
//     getElectionSummary,
    
//     // API functions
//     saveElection,
//     publishElection,
//     loadElection,
    
//     // Convenience getters
//     electionId: state.electionId,
//     isLoading: state.isLoading,
//     error: state.error,
//     questions: state.questions,
//     totalQuestions: state.questions.length,
//     totalAnswers: state.questions.reduce((total, q) => total + (q.answers?.length || 0), 0),
//     imageUploads: state.imageUploads
//   };

//   return (
//     <ElectionContext.Provider value={contextValue}>
//       {children}
//     </ElectionContext.Provider>
//   );
// };

// export default ElectionContext;




 import React, { createContext,  useReducer, useCallback } from 'react';
 import { electionReducer, initialState, ELECTION_ACTIONS } from './electionReducer';

 // Create Context
 const ElectionContext = createContext();

 // Provider Component
 export const ElectionProvider = ({ children, initialElection = {} }) => {
   const [state, dispatch] = useReducer(electionReducer, {
     ...initialState,
    ...initialElection
  });

  // Action Creators
  const setElectionData = useCallback((data) => {
    dispatch({ type: ELECTION_ACTIONS.SET_ELECTION_DATA, payload: data });
  }, []);

   const updateElectionField = useCallback((updates) => {
     dispatch({ type: ELECTION_ACTIONS.UPDATE_ELECTION_FIELD, payload: updates });  }, []);

  const addQuestion = useCallback((question) => {
     const questionWithId = {
       ...question,
       id: question.id || `question_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
       answers: question.answers || []
    };
     dispatch({ type: ELECTION_ACTIONS.ADD_QUESTION, payload: questionWithId });
    return questionWithId.id;
   }, []);

   const updateQuestion = useCallback((questionId, updates) => {
     dispatch({ 
      type: ELECTION_ACTIONS.UPDATE_QUESTION, 
      payload: { id: questionId, ...updates } 
     });
  }, []);

   const deleteQuestion = useCallback((questionId) => {
    dispatch({ type: ELECTION_ACTIONS.DELETE_QUESTION, payload: questionId });
   }, []);

  const addAnswer = useCallback((questionId, answer) => {
    const answerWithId = {
       ...answer,
      id: answer.id || `answer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    dispatch({ 
       type: ELECTION_ACTIONS.ADD_ANSWER, 
       payload: { questionId, answer: answerWithId } 
    });
    return answerWithId.id;
  }, []);

   const updateAnswer = useCallback((questionId, answerId, updates) => {
     dispatch({ 
      type: ELECTION_ACTIONS.UPDATE_ANSWER, 
       payload: { questionId, answerId, updates } 
     });
   }, []);

   const deleteAnswer = useCallback((questionId, answerId) => {
     dispatch({ 
      type: ELECTION_ACTIONS.DELETE_ANSWER, 
      payload: { questionId, answerId } 
    });
   }, []);

   const setLoading = useCallback((loading) => {
     dispatch({ type: ELECTION_ACTIONS.SET_LOADING, payload: loading });
   }, []);

  const setError = useCallback((error) => {
     dispatch({ type: ELECTION_ACTIONS.SET_ERROR, payload: error });
  }, []);

  const clearError = useCallback(() => {
     dispatch({ type: ELECTION_ACTIONS.CLEAR_ERROR });
   }, []);

   const resetElection = useCallback(() => {
    dispatch({ type: ELECTION_ACTIONS.RESET_ELECTION });
  }, []);

//   // Selectors
   const getQuestion = useCallback((questionId) => {
     return state.questions.find(q => q.id === questionId);
   }, [state.questions]);

   const getAnswer = useCallback((questionId, answerId) => {
     const question = state.questions.find(q => q.id === questionId);
     return question?.answers?.find(a => a.id === answerId);
   }, [state.questions]);

   const getAllQuestions = useCallback(() => {
     return state.questions;
   }, [state.questions]);

   const getQuestionsByType = useCallback((type) => {
     return state.questions.filter(q => q.questionType === type);
   }, [state.questions]);

   const getTotalAnswersCount = useCallback(() => {
     return state.questions.reduce((total, question) => 
      total + (question.answers?.length || 0), 0
    );
  }, [state.questions]);

   const isElectionValid = useCallback(() => {
     const hasTitle = state.title && state.title.trim().length > 0;
    const hasStartDate = state.startDate && state.startDate.date;
     const hasEndDate = state.endDate && state.endDate.date;
    const hasQuestions = state.questions.length > 0;
    
    return hasTitle && hasStartDate && hasEndDate && hasQuestions;
  }, [state.title, state.startDate, state.endDate, state.questions]);

  const getElectionSummary = useCallback(() => {
    return {
      title: state.title,
      questionsCount: state.questions.length,
      answersCount: state.questions.reduce((total, q) => total + (q.answers?.length || 0), 0),
      votingType: state.votingType,
      isLotterized: state.isLotterized,
      isPaid: state.pricingType !== 'free',
      startDate: state.startDate,
      endDate: state.endDate
    };
  }, [state]);

   // API functions
   const saveElection = useCallback(async () => {
    setLoading(true);
    try {
//       // Mock API call
     await new Promise(resolve => setTimeout(resolve, 1000));
      
       const savedData = {
         ...state,
        electionId: state.electionId || `election_${Date.now()}`,
       lastSaved: new Date().toISOString(),
         isDraft: true
      };
     
      updateElectionField({
         electionId: savedData.electionId,
         lastSaved: savedData.lastSaved,
        isDraft: true
      });
      
       return savedData;
    } catch (error) {
       setError('Failed to save election');
       throw error;
     } finally {
       setLoading(false);
     }
   }, [state, setLoading, setError, updateElectionField]);

   const publishElection = useCallback(async () => {
     setLoading(true);
     try {
       if (!isElectionValid()) {
         throw new Error('Election is not valid for publishing');
       }
       // Mock API call
       await new Promise(resolve => setTimeout(resolve, 1500));
      
       updateElectionField({
         isPublished: true,
         isDraft: false,
         lastSaved: new Date().toISOString()
       });
      
       return state;
     } catch (error) {
       setError('Failed to publish election');
       throw error;
     } finally {
       setLoading(false);
     }
   }, [state, setLoading, setError, updateElectionField, isElectionValid]);

   const loadElection = useCallback(async (electionId) => {
     setLoading(true);
     clearError();
    
     try {
       // Mock API call
       await new Promise(resolve => setTimeout(resolve, 800));
      
       // Mock loaded data - in real implementation, this would come from API
       const mockElectionData = {
         ...state,
         electionId,
         title: `Loaded Election ${electionId}`,
         description: 'This is a loaded election',
         // ... other loaded data
       };
      
       setElectionData(mockElectionData);
       return mockElectionData;
     } catch (error) {
       setError('Failed to load election');
       throw error;
     } finally {
       setLoading(false);
     }
   }, [state, setLoading, clearError, setError, setElectionData]);

   const contextValue = {
     // Current state
     election: state,
    
     // Actions
     setElectionData,


         updateElectionField,
     addQuestion,
     updateQuestion,
     deleteQuestion,
     addAnswer,
     updateAnswer,
     deleteAnswer,
     setLoading,
     setError,
     clearError,
     resetElection,
    
     // Selectors
     getQuestion,
     getAnswer,
     getAllQuestions,
     getQuestionsByType,
     getTotalAnswersCount,
     isElectionValid,
     getElectionSummary,
    
     // API functions
     saveElection,
     publishElection,
     loadElection,
    
     // Convenience getters
     electionId: state.electionId,
     isLoading: state.isLoading,
     error: state.error,
     questions: state.questions,
     totalQuestions: state.questions.length,
     totalAnswers: state.questions.reduce((total, q) => total + (q.answers?.length || 0), 0)
   };

   return (
     <ElectionContext.Provider value={contextValue}>
       {children}
     </ElectionContext.Provider>
   );
 };

 export default ElectionContext;