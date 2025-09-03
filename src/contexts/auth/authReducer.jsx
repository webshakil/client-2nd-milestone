import { AUTH_ACTIONS } from './authTypes';
import { SecurityUtils } from '../../utils/security';

export const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case AUTH_ACTIONS.SET_STEP:
      return { ...state, currentStep: action.payload };
    case AUTH_ACTIONS.SET_EMAIL:
      return { ...state, email: action.payload };
    case AUTH_ACTIONS.SET_PHONE:
      return { ...state, phone: SecurityUtils.sanitizeInput(action.payload) };
    case AUTH_ACTIONS.SET_EMAIL_VERIFIED:
      return { ...state, emailVerified: action.payload };
    case AUTH_ACTIONS.SET_PHONE_VERIFIED:
      return { ...state, phoneVerified: action.payload };
    case AUTH_ACTIONS.SET_BIOMETRIC_VERIFIED:
      return { ...state, biometricVerified: action.payload };
    case AUTH_ACTIONS.SET_PROFILE_CREATED:
      return { ...state, profileCreated: action.payload };
    case AUTH_ACTIONS.SET_AUTHENTICATED:
      return { ...state, isAuthenticated: action.payload };
    case AUTH_ACTIONS.SET_USER_DATA:
      return { ...state, userData: action.payload };
    case AUTH_ACTIONS.SET_USER_ID:
      return { ...state, userId: action.payload };
    case AUTH_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };
    case AUTH_ACTIONS.SET_REFERRER_VALID:
      return { ...state, isValidReferrer: action.payload, referrerInfo: action.referrerInfo };
    case AUTH_ACTIONS.SET_FALLBACK_QUESTIONS:
      return { ...state, fallbackQuestions: action.payload };
    case AUTH_ACTIONS.SET_FALLBACK_SETUP_COMPLETE:
      return { ...state, fallbackSetupComplete: action.payload };
    case AUTH_ACTIONS.SET_BIOMETRIC_KEYS:
      return { ...state, biometricKeys: action.payload };
    case AUTH_ACTIONS.SET_SECURITY_QUESTIONS_SETUP:
      return { ...state, securityQuestionsSetup: action.payload };
    case AUTH_ACTIONS.SET_COLLECTED_QUESTIONS:
      return { ...state, collectedSecurityQuestions: action.payload };
    case AUTH_ACTIONS.SET_FALLBACK_STEP:
      return { ...state, fallbackStep: action.payload };
    case AUTH_ACTIONS.RESET_AUTH:
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
    case AUTH_ACTIONS.SET_OTP_SENT:
      return { ...state, otpSent: action.payload };
    case AUTH_ACTIONS.SET_RESEND_COOLDOWN:
      return { ...state, resendCooldown: action.payload };
    default:
      return state;
  }
};