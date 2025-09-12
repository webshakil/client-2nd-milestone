import { SecurityUtils } from '../../utils/security';

// Auth reducer
export const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'SET_EMAIL':
      return { ...state, email: action.payload };
    case 'SET_PHONE':
      return { ...state, phone: SecurityUtils.sanitizeInput(action.payload) };
    case 'SET_EMAIL_VERIFIED':
      return { ...state, emailVerified: action.payload };
    case 'SET_PHONE_VERIFIED':
      return { ...state, phoneVerified: action.payload };
    case 'SET_BIOMETRIC_VERIFIED':
      return { ...state, biometricVerified: action.payload };
    case 'SET_PROFILE_CREATED':
      return { ...state, profileCreated: action.payload };
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    case 'SET_USER_DATA':
      return { ...state, userData: action.payload };
    case 'SET_USER_ID':
      return { ...state, userId: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_REFERRER_VALID':
      return { ...state, isValidReferrer: action.payload, referrerInfo: action.referrerInfo };
    case 'SET_FALLBACK_QUESTIONS':
      return { ...state, fallbackQuestions: action.payload };
    case 'SET_FALLBACK_SETUP_COMPLETE':
      return { ...state, fallbackSetupComplete: action.payload };
    case 'SET_BIOMETRIC_KEYS':
      return { ...state, biometricKeys: action.payload };
    case 'SET_SECURITY_QUESTIONS_SETUP':
      return { ...state, securityQuestionsSetup: action.payload };
    case 'SET_COLLECTED_QUESTIONS':
      return { ...state, collectedSecurityQuestions: action.payload };
    case 'SET_FALLBACK_STEP':
      return { ...state, fallbackStep: action.payload };
    case 'RESET_AUTH':
      return {
        ...state,
        currentStep: 1,
        email: '',
        phone: '',
        userId: null,
        emailVerified: false,
        phoneVerified: false,
        biometricVerified: false,
        profileCreated: false,
        error: null,
        isAuthenticated: false,
        userData: null,
        fallbackQuestions: [],
        fallbackSetupComplete: false,
        biometricKeys: null,
        securityQuestionsSetup: false,
        collectedSecurityQuestions: [],
        fallbackStep: null
      };
    case 'SET_OTP_SENT':
      return { ...state, otpSent: action.payload };
    case 'SET_RESEND_COOLDOWN':
      return { ...state, resendCooldown: action.payload };
    default:
      return state;
  }
};

export const initialState = {
  isAuthenticated: false,
  isLoading: false,
  currentStep: 1,
  email: '',
  phone: '',
  userId: null,
  emailVerified: false,
  phoneVerified: false,
  biometricVerified: false,
  profileCreated: false,
  userData: null,
  error: null,
  isValidReferrer: false,
  referrerInfo: null,
  otpSent: false,
  resendCooldown: 0,
  fallbackQuestions: [],
  fallbackSetupComplete: false,
  biometricKeys: null,
  securityQuestionsSetup: false,
  collectedSecurityQuestions: [],
  fallbackStep: null
};