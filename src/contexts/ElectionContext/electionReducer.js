// Action Types
export const ELECTION_ACTIONS = {
  SET_ELECTION_DATA: 'SET_ELECTION_DATA',
  UPDATE_ELECTION_FIELD: 'UPDATE_ELECTION_FIELD',
  ADD_QUESTION: 'ADD_QUESTION',
  UPDATE_QUESTION: 'UPDATE_QUESTION',
  DELETE_QUESTION: 'DELETE_QUESTION',
  ADD_ANSWER: 'ADD_ANSWER',
  UPDATE_ANSWER: 'UPDATE_ANSWER',
  DELETE_ANSWER: 'DELETE_ANSWER',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  RESET_ELECTION: 'RESET_ELECTION',
  // New image upload actions
  UPLOAD_IMAGE_START: 'UPLOAD_IMAGE_START',
  UPLOAD_IMAGE_SUCCESS: 'UPLOAD_IMAGE_SUCCESS',
  UPLOAD_IMAGE_FAILURE: 'UPLOAD_IMAGE_FAILURE',
  UPDATE_QUESTION_IMAGE: 'UPDATE_QUESTION_IMAGE',
  UPDATE_ANSWER_IMAGE: 'UPDATE_ANSWER_IMAGE',
  UPDATE_TOPIC_IMAGE: 'UPDATE_TOPIC_IMAGE',
  UPDATE_LOGO_IMAGE: 'UPDATE_LOGO_IMAGE',
  CLEAR_PENDING_UPLOADS: 'CLEAR_PENDING_UPLOADS'
};

// Initial State
export const initialState = {
  // Basic Election Info
  electionId: null,
  title: '',
  description: '',
  topicImageUrl: '',
  topicVideoUrl: '',
  logoBrandingUrl: '',
  customVotingUrl: '',
  
  // Scheduling
  startDate: { date: '', time: '09:00' },
  endDate: { date: '', time: '18:00' },
  startTime: '09:00',
  endTime: '18:00',
  timezone: 'UTC',
  
  // Voting Configuration
  votingType: 'plurality',
  permissionToVote: 'world_citizens',
  questions: [],
  
  // Access Control
  authMethod: 'passkey',
  biometricRequired: false,
  allowOauth: true,
  allowMagicLink: true,
  allowEmailPassword: true,
  
  // Country Restrictions
  isCountrySpecific: false,
  countries: [],
  
  // Pricing Configuration
  pricingType: 'free',
  isPaid: false,
  participationFee: 0,
  regionalFees: {},
  processingFeePercentage: 0,
  
  // Lottery Configuration
  isLotterized: false,
  rewardType: 'monetary',
  rewardAmount: 0,
  nonMonetaryReward: '',
  projectedRevenue: 0,
  revenueSharePercentage: 0,
  winnerCount: 1,
  
  // Results Control
  showLiveResults: false,
  allowVoteEditing: false,
  
  // Branding
  customCss: '',
  brandColors: {
    primary: '#3B82F6',
    secondary: '#64748B',
    accent: '#10B981',
    background: '#FFFFFF',
    text: '#1F2937'
  },
  
  // Multi-language
  primaryLanguage: 'en',
  supportsMultilang: false,
  
  // State Management
  isLoading: false,
  error: null,
  isDraft: true,
  isPublished: false,
  lastSaved: null,
  
  // Image Upload Management
  imageUploads: {
    pending: [], // Array of pending upload objects
    uploading: false,
    uploadProgress: {},
    failed: []
  }
};

// Reducer
export const electionReducer = (state, action) => {
  switch (action.type) {
    case ELECTION_ACTIONS.SET_ELECTION_DATA:
      return {
        ...state,
        ...action.payload,
        error: null
      };
      
    case ELECTION_ACTIONS.UPDATE_ELECTION_FIELD:
      return {
        ...state,
        ...action.payload,
        error: null
      };
      
    case ELECTION_ACTIONS.ADD_QUESTION:
      return {
        ...state,
        questions: [...state.questions, action.payload],
        error: null
      };
      
    case ELECTION_ACTIONS.UPDATE_QUESTION:
      return {
        ...state,
        questions: state.questions.map(q => 
          q.id === action.payload.id ? { ...q, ...action.payload } : q
        ),
        error: null
      };
      
    case ELECTION_ACTIONS.DELETE_QUESTION:
      return {
        ...state,
        questions: state.questions.filter(q => q.id !== action.payload),
        error: null
      };
      
    case ELECTION_ACTIONS.ADD_ANSWER:
      return {
        ...state,
        questions: state.questions.map(q => 
          q.id === action.payload.questionId 
            ? { ...q, answers: [...(q.answers || []), action.payload.answer] }
            : q
        ),
        error: null
      };
      
    case ELECTION_ACTIONS.UPDATE_ANSWER:
      return {
        ...state,
        questions: state.questions.map(q => 
          q.id === action.payload.questionId
            ? {
                ...q,
                answers: q.answers.map(a => 
                  a.id === action.payload.answerId 
                    ? { ...a, ...action.payload.updates }
                    : a
                )
              }
            : q
        ),
        error: null
      };
      
    case ELECTION_ACTIONS.DELETE_ANSWER:
      return {
        ...state,
        questions: state.questions.map(q => 
          q.id === action.payload.questionId
            ? { ...q, answers: q.answers.filter(a => a.id !== action.payload.answerId) }
            : q
        ),
        error: null
      };
      
    case ELECTION_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
      
    case ELECTION_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
      
    case ELECTION_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
      
    case ELECTION_ACTIONS.RESET_ELECTION:
      return {
        ...initialState
      };

    // New image upload cases
    case ELECTION_ACTIONS.UPLOAD_IMAGE_START:
      return {
        ...state,
        imageUploads: {
          ...state.imageUploads,
          uploading: true,
          pending: [...state.imageUploads.pending, action.payload]
        }
      };

    case ELECTION_ACTIONS.UPLOAD_IMAGE_SUCCESS:
      return {
        ...state,
        imageUploads: {
          ...state.imageUploads,
          uploading: false,
          uploadProgress: {}
        }
      };

    case ELECTION_ACTIONS.UPLOAD_IMAGE_FAILURE:
      return {
        ...state,
        imageUploads: {
          ...state.imageUploads,
          uploading: false,
          failed: [...state.imageUploads.failed, action.payload]
        }
      };

    case ELECTION_ACTIONS.UPDATE_QUESTION_IMAGE:
      return {
        ...state,
        questions: state.questions.map(q => 
          q.id === action.payload.questionId 
            ? { ...q, questionImageUrl: action.payload.imageUrl }
            : q
        )
      };

    case ELECTION_ACTIONS.UPDATE_ANSWER_IMAGE:
      return {
        ...state,
        questions: state.questions.map(q => 
          q.id === action.payload.questionId
            ? {
                ...q,
                answers: q.answers.map(a => 
                  a.id === action.payload.answerId 
                    ? { ...a, imageUrl: action.payload.imageUrl }
                    : a
                )
              }
            : q
        )
      };

    case ELECTION_ACTIONS.UPDATE_TOPIC_IMAGE:
      return {
        ...state,
        topicImageUrl: action.payload
      };

    case ELECTION_ACTIONS.UPDATE_LOGO_IMAGE:
      return {
        ...state,
        logoBrandingUrl: action.payload
      };

    case ELECTION_ACTIONS.CLEAR_PENDING_UPLOADS:
      return {
        ...state,
        imageUploads: {
          ...state.imageUploads,
          pending: [],
          failed: []
        }
      };
      
    default:
      return state;
  }
};
// // Action Types
// export const ELECTION_ACTIONS = {
//   SET_ELECTION_DATA: 'SET_ELECTION_DATA',
//   UPDATE_ELECTION_FIELD: 'UPDATE_ELECTION_FIELD',
//   ADD_QUESTION: 'ADD_QUESTION',
//   UPDATE_QUESTION: 'UPDATE_QUESTION',
//   DELETE_QUESTION: 'DELETE_QUESTION',
//   ADD_ANSWER: 'ADD_ANSWER',
//   UPDATE_ANSWER: 'UPDATE_ANSWER',
//   DELETE_ANSWER: 'DELETE_ANSWER',
//   SET_LOADING: 'SET_LOADING',
//   SET_ERROR: 'SET_ERROR',
//   CLEAR_ERROR: 'CLEAR_ERROR',
//   RESET_ELECTION: 'RESET_ELECTION'
// };

// // Initial State
// export const initialState = {
//   // Basic Election Info
//   electionId: null,
//   title: '',
//   description: '',
//   topicImageUrl: '',
//   topicVideoUrl: '',
//   logoBrandingUrl: '',
//   customVotingUrl: '',
  
//   // Scheduling
//   startDate: { date: '', time: '09:00' },
//   endDate: { date: '', time: '18:00' },
//   startTime: '09:00',
//   endTime: '18:00',
//   timezone: 'UTC',
  
//   // Voting Configuration
//   votingType: 'plurality',
//   permissionToVote: 'world_citizens',
//   questions: [],
  
//   // Access Control
//   authMethod: 'passkey',
//   biometricRequired: false,
//   allowOauth: true,
//   allowMagicLink: true,
//   allowEmailPassword: true,
  
//   // Country Restrictions
//   isCountrySpecific: false,
//   countries: [],
  
//   // Pricing Configuration
//   pricingType: 'free',
//   isPaid: false,
//   participationFee: 0,
//   regionalFees: {},
//   processingFeePercentage: 0,
  
//   // Lottery Configuration
//   isLotterized: false,
//   rewardType: 'monetary',
//   rewardAmount: 0,
//   nonMonetaryReward: '',
//   projectedRevenue: 0,
//   revenueSharePercentage: 0,
//   winnerCount: 1,
  
//   // Results Control
//   showLiveResults: false,
//   allowVoteEditing: false,
  
//   // Branding
//   customCss: '',
//   brandColors: {
//     primary: '#3B82F6',
//     secondary: '#64748B',
//     accent: '#10B981',
//     background: '#FFFFFF',
//     text: '#1F2937'
//   },
  
//   // Multi-language
//   primaryLanguage: 'en',
//   supportsMultilang: false,
  
//   // State Management
//   isLoading: false,
//   error: null,
//   isDraft: true,
//   isPublished: false,
//   lastSaved: null
// };

// // Reducer
// export const electionReducer = (state, action) => {
//   switch (action.type) {
//     case ELECTION_ACTIONS.SET_ELECTION_DATA:
//       return {
//         ...state,
//         ...action.payload,
//         error: null
//       };
      
//     case ELECTION_ACTIONS.UPDATE_ELECTION_FIELD:
//       return {
//         ...state,
//         ...action.payload,
//         error: null
//       };
      
//     case ELECTION_ACTIONS.ADD_QUESTION:
//       return {
//         ...state,
//         questions: [...state.questions, action.payload],
//         error: null
//       };
      
//     case ELECTION_ACTIONS.UPDATE_QUESTION:
//       return {
//         ...state,
//         questions: state.questions.map(q => 
//           q.id === action.payload.id ? { ...q, ...action.payload } : q
//         ),
//         error: null
//       };
      
//     case ELECTION_ACTIONS.DELETE_QUESTION:
//       return {
//         ...state,
//         questions: state.questions.filter(q => q.id !== action.payload),
//         error: null
//       };
      
//     case ELECTION_ACTIONS.ADD_ANSWER:
//       return {
//         ...state,
//         questions: state.questions.map(q => 
//           q.id === action.payload.questionId 
//             ? { ...q, answers: [...(q.answers || []), action.payload.answer] }
//             : q
//         ),
//         error: null
//       };
      
//     case ELECTION_ACTIONS.UPDATE_ANSWER:
//       return {
//         ...state,
//         questions: state.questions.map(q => 
//           q.id === action.payload.questionId
//             ? {
//                 ...q,
//                 answers: q.answers.map(a => 
//                   a.id === action.payload.answerId 
//                     ? { ...a, ...action.payload.updates }
//                     : a
//                 )
//               }
//             : q
//         ),
//         error: null
//       };
      
//     case ELECTION_ACTIONS.DELETE_ANSWER:
//       return {
//         ...state,
//         questions: state.questions.map(q => 
//           q.id === action.payload.questionId
//             ? { ...q, answers: q.answers.filter(a => a.id !== action.payload.answerId) }
//             : q
//         ),
//         error: null
//       };
      
//     case ELECTION_ACTIONS.SET_LOADING:
//       return {
//         ...state,
//         isLoading: action.payload
//       };
      
//     case ELECTION_ACTIONS.SET_ERROR:
//       return {
//         ...state,
//         error: action.payload,
//         isLoading: false
//       };
      
//     case ELECTION_ACTIONS.CLEAR_ERROR:
//       return {
//         ...state,
//         error: null
//       };
      
//     case ELECTION_ACTIONS.RESET_ELECTION:
//       return {
//         ...initialState
//       };
      
//     default:
//       return state;
//   }
// };