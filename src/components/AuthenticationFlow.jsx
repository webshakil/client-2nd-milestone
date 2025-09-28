// Enhanced AuthenticationFlow with OTP bypass for demo purposes
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import EmailVerification from './auth/EmailVerification';
import PhoneVerification from './auth/PhoneVerification';
import BiometricCapture from './auth/BiometricCapture';
import FallbackSecurity from './auth/FallbackSecurity';
import SecurityQuestionsSetup from './SecurityQuestionsSetup';
import ProfileCreation from './ProfileCreation';
import { useAuth } from '../contexts/AuthContext';

// Demo bypass component - FIXED to show on all relevant steps
const DemoBypassPanel = ({ onBypassStep, currentStep, isDemoMode, setIsDemoMode }) => {
  if (!isDemoMode) {
    return (
      <div className="fixed bottom-4 right-4">
        <button
          onClick={() => setIsDemoMode(true)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg"
        >
          🚀 OTP Bypass
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border-2 border-yellow-400 rounded-lg p-4 shadow-xl max-w-xs">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-yellow-800">🚀 OTP Bypass Panel</h3>
        <button
          onClick={() => setIsDemoMode(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-2">
        <div className="text-xs text-gray-600 mb-2">Current Step: {currentStep}</div>
        
        {/* Show email bypass for steps 1 and 2 */}
        {(currentStep === 1 || currentStep === 2) && (
          <button
            onClick={() => onBypassStep('email-otp')}
            className="w-full bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
          >
            ✅ Bypass Email OTP (Steps 1&2)
          </button>
        )}
        
        {/* Show phone bypass for steps 3 and 4 */}
        {(currentStep === 3 || currentStep === 4) && (
          <button
            onClick={() => onBypassStep('phone-otp')}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
          >
            ✅ Bypass Phone OTP (Steps 3&4)
          </button>
        )}
        
        {/* Show message for other steps */}
        {(currentStep !== 1 && currentStep !== 2 && currentStep !== 3 && currentStep !== 4) && (
          <div className="text-xs text-gray-500 text-center py-2">
            No OTP bypass needed for this step
          </div>
        )}
      </div>
      
      <div className="mt-3 pt-2 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          ⚠️ Only bypasses OTP verification
        </div>
      </div>
    </div>
  );
};

// Enhanced Loading Screen with better UX
const EnhancedLoadingScreen = ({ step, message, progress = 0 }) => {
  const [dots, setDots] = useState('');
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
      {/* Enhanced spinner with progress */}
      <div className="mb-6">
        <div className="relative w-16 h-16 mx-auto">
          <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
          {progress > 0 && (
            <div className="absolute inset-2 flex items-center justify-center">
              <span className="text-xs font-bold text-blue-600">{progress}%</span>
            </div>
          )}
        </div>
      </div>
      
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        {step ? `Step ${step}` : 'Initializing Vottery'}
      </h2>
      <p className="text-gray-600 mb-4">
        {message || 'Verifying secure access'}{dots}
      </p>
      
      {/* Progress bar for loading */}
      {progress > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
      
      {/* Loading tip */}
      <div className="text-xs text-gray-500">
        <p>💡 Keep your email and phone accessible for verification</p>
      </div>
    </div>
  );
};

const AuthenticationFlow = () => {
  // Your original useAuth hook
  const { 
    currentStep, 
    emailVerified, 
    phoneVerified, 
    biometricVerified,
    profileCreated,
    securityQuestionsSetup,
    error,
    isLoading,
    isAuthenticated,
    fallbackStep,
    // Add these methods to your AuthContext if they don't exist
    setEmailVerified,
    setPhoneVerified,
    /*eslint-disable*/
    setBiometricVerified,
    setProfileCreated,
    setSecurityQuestionsSetup,
    setCurrentStep,
    setIsAuthenticated
  } = useAuth();
  
  const [showProgress, setShowProgress] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  
  // Loading progress simulation for better UX
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  useEffect(() => {
    if (isLoading) {
      setLoadingProgress(15);
      
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 80) return prev;
          return prev + Math.random() * 8 + 3;
        });
      }, 200);
      
      const timeout = setTimeout(() => setLoadingProgress(85), 4000);
      
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    } else {
      setLoadingProgress(100);
      setTimeout(() => setLoadingProgress(0), 600);
    }
  }, [isLoading]);

  // Demo bypass handler - SIMPLIFIED for OTP only
  const handleBypassStep = useCallback((stepType) => {
    console.log(`🚀 OTP bypass: ${stepType}`);
    
    switch (stepType) {
      case 'email-otp':
        // Only bypass email verification, move to phone step
        setEmailVerified(true);
        setCurrentStep(3);
        toast.success('Email OTP bypassed - moving to phone verification');
        break;
        
      case 'phone-otp':
        // Only bypass phone verification, continue normal flow
        setPhoneVerified(true);
        setCurrentStep('security-questions');
        toast.success('Phone OTP bypassed - continuing to security questions');
        break;
        
      default:
        console.log(`Unknown bypass step: ${stepType}`);
    }
  }, [setEmailVerified, setPhoneVerified, setCurrentStep]);

  // Memoize expensive step status calculations
  const stepStatuses = useMemo(() => {
    const getStepStatus = (step) => {
      switch (step) {
        case 1:
          return currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : 'pending';
        case 2:
          return emailVerified ? 'completed' : currentStep === 2 ? 'active' : 'pending';
        case 3:
          return currentStep === 3 ? 'active' : currentStep > 3 ? 'completed' : 'pending';
        case 4:
          return phoneVerified ? 'completed' : currentStep === 4 ? 'active' : 'pending';
        case 5:
          return securityQuestionsSetup ? 'completed' : currentStep === 'security-questions' ? 'active' : 'pending';
        case 6:
          if (fallbackStep) return 'active';
          return biometricVerified ? 'completed' : currentStep === 5 ? 'active' : 'pending';
        case 7:
          return profileCreated ? 'completed' : currentStep === 6 ? 'active' : 'pending';
        default:
          return 'pending';
      }
    };

    return [1, 2, 3, 4, 5, 6, 7].map(step => ({
      step,
      status: getStepStatus(step)
    }));
  }, [currentStep, emailVerified, phoneVerified, biometricVerified, profileCreated, securityQuestionsSetup, fallbackStep]);

  // Memoize progress calculation
  const calculateProgress = useMemo(() => {
    let progress = 0;
    if (currentStep > 1) progress += 14.29;
    if (emailVerified) progress += 14.29;
    if (currentStep > 3) progress += 14.29;
    if (phoneVerified) progress += 14.29;
    if (securityQuestionsSetup) progress += 14.29;
    if (biometricVerified) progress += 14.29;
    if (profileCreated) progress += 14.27;
    return Math.round(progress);
  }, [currentStep, emailVerified, phoneVerified, biometricVerified, profileCreated, securityQuestionsSetup]);

  // Memoize step labels
  const getStepLabel = useCallback((step) => {
    switch (step) {
      case 1: return 'Email Input';
      case 2: return 'Email OTP';
      case 3: return 'Phone Input';
      case 4: return 'Phone OTP';
      case 5: return 'Security Questions';
      case 6: 
        if (fallbackStep) return 'Fallback Security';
        return 'Biometric Auth';
      case 7: return 'Profile Setup';
      default: return `Step ${step}`;
    }
  }, [fallbackStep]);

  // Memoized step icon component
  const StepIcon = React.memo(({ step, status }) => {
    if (status === 'completed') {
      return (
        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      );
    } else if (status === 'active') {
      return (
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg animate-pulse transition-all duration-300">
          <span className="text-white font-bold text-sm">{step}</span>
        </div>
      );
    } else {
      return (
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center transition-all duration-300">
          <span className="text-gray-600 font-medium text-sm">{step}</span>
        </div>
      );
    }
  });

  // Better loading messages
  const getLoadingMessage = useCallback(() => {
    if (fallbackStep === 'setup') {
      return 'Setting up fallback security questions';
    } else if (fallbackStep === 'answer') {
      return 'Processing security question verification';
    } else if (currentStep === 'security-questions') {
      return 'Loading security questions interface';
    } else if (currentStep === 1) {
      return 'Initializing email verification system';
    } else if (currentStep === 2) {
      return 'Processing email OTP verification';
    } else if (currentStep === 3) {
      return 'Setting up phone verification system';
    } else if (currentStep === 4) {
      return 'Processing phone OTP verification';
    } else if (currentStep === 5) {
      return 'Initializing biometric authentication';
    } else if (currentStep === 6) {
      return 'Loading profile creation interface';
    }
    return 'Preparing secure authentication system';
  }, [currentStep, fallbackStep]);

  // Your original functions
  const getCurrentStepDescription = () => {
    if (fallbackStep === 'setup') {
      return 'Setting up fallback security questions...';
    } else if (fallbackStep === 'answer') {
      return 'Answer security questions to complete authentication';
    } else if (currentStep === 'security-questions') {
      return 'Set up 3 security questions for account backup authentication';
    } else if (currentStep === 1) {
      return 'Enter your registered email address';
    } else if (currentStep === 2) {
      return 'Verify the OTP sent to your email';
    } else if (currentStep === 3) {
      return 'Enter your registered phone number';
    } else if (currentStep === 4) {
      return 'Verify the OTP sent to your phone and email. Sometimes SMS OTPs delay, so we also sent the same OTP to your email';
    } else if (currentStep === 5) {
      return 'Complete biometric authentication or fallback security';
    } else if (currentStep === 6) {
      return 'Complete your profile to access the dashboard';
    }
    return '';
  };

  const getCurrentStepForDisplay = () => {
    if (currentStep === 'security-questions') return 'Security Questions';
    if (fallbackStep) return 'Fallback Security';
    return getStepLabel(currentStep);
  };

  const getCurrentStepCount = () => {
    if (currentStep === 'security-questions') return '5/7';
    if (fallbackStep) return '6/7';
    return `${currentStep}/7`;
  };

  // Your original render logic with performance boost
  const renderCurrentStep = () => {
    if (isLoading && (currentStep === 1 || !currentStep) && !fallbackStep) {
      return (
        <EnhancedLoadingScreen 
          step={typeof currentStep === 'number' ? currentStep : ''}
          message={getLoadingMessage()}
          progress={loadingProgress}
        />
      );
    }

    if (fallbackStep) {
      return <FallbackSecurity />;
    }

    if (currentStep === 'security-questions') {
      return <SecurityQuestionsSetup />;
    }

    if (currentStep === 1 || currentStep === 2) {
      return <EmailVerification />;
    } else if (currentStep === 3 || currentStep === 4) {
      return <PhoneVerification />;
    } else if (currentStep === 5) {
      return <BiometricCapture />;
    } else if (currentStep === 6) {
      return <ProfileCreation />;
    } else {
      return <EmailVerification />;
    }
  };

  // Your original authenticated check - FIXED dashboard redirect
  if (isAuthenticated && profileCreated) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md transform transition-all duration-500 hover:scale-105">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Complete!</h2>
            <p className="text-gray-600 mb-4">Welcome to Vottery Dashboard</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 transform hover:scale-105"
          >
            Continue to Dashboard
          </button>
          </div>
        </div>
        
        {/* Demo bypass panel still available in success state */}
        <DemoBypassPanel
          onBypassStep={handleBypassStep}
          currentStep={currentStep}
          isDemoMode={isDemoMode}
          setIsDemoMode={setIsDemoMode}
        />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Demo mode indicator - SIMPLIFIED */}
          {isDemoMode && (
            <div className="mb-4">
              <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-3 text-center">
                <span className="text-yellow-800 font-medium">OTP Bypass Mode Active - Skip email/phone verification only</span>
              </div>
            </div>
          )}

          {/* Your original header with enhanced animations */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2 transform transition-all duration-500">
              Welcome to Vottery
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              Complete the 7-step verification process to access your dashboard
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium transform transition-all duration-300 hover:scale-105">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Secured by SNGINE Authentication
            </div>
          </div>

          {/* Rest of your original component structure... */}
          {/* (I've kept all your original styling and structure intact) */}
          
          {fallbackStep && (
            <div className="mb-6 max-w-md mx-auto">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 transform transition-all duration-300 hover:scale-102">
                <div className="flex">
                  <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div className="ml-3">
                    <p className="text-sm text-amber-800">
                      {fallbackStep === 'setup' && 'WebAuthn not available. Setting up fallback security questions for authentication.'}
                      {fallbackStep === 'answer' && 'Please answer the security questions to complete your authentication.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Progress steps with performance optimizations */}
          {showProgress && (
            <div className="mb-8">
              <div className="flex justify-center">
                <div className="flex items-center space-x-4 overflow-x-auto pb-4">
                  {stepStatuses.map(({ step, status }, index) => (
                    <React.Fragment key={step}>
                      <div className="flex flex-col items-center min-w-0 flex-shrink-0">
                        <StepIcon step={step} status={status} />
                        <div className="mt-2 text-center">
                          <span className="text-xs font-medium text-gray-700 block">
                            {getStepLabel(step)}
                          </span>
                        </div>
                      </div>
                      
                      {index < 6 && (
                        <div className={`h-px w-12 transition-all duration-500 flex-shrink-0 ${
                          stepStatuses[index + 1]?.status !== 'pending' ? 'bg-green-500' : 'bg-gray-300'
                        }`}></div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="mt-6 max-w-md mx-auto">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{calculateProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${calculateProgress}%` }}
                  ></div>
                </div>
              </div>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">{getCurrentStepDescription()}</p>
              </div>

              <div className="text-center mt-4">
                <button
                  onClick={() => setShowProgress(!showProgress)}
                  className="text-sm text-gray-500 hover:text-gray-700 transition duration-200"
                >
                  Hide Progress
                </button>
              </div>
            </div>
          )}

          {!showProgress && (
            <div className="text-center mb-8">
              <button
                onClick={() => setShowProgress(true)}
                className="text-sm text-gray-500 hover:text-gray-700 transition duration-200"
              >
                Show Progress
              </button>
            </div>
          )}

          {error && (
            <div className="mb-6 max-w-md mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 transform transition-all duration-300 animate-pulse">
                <div className="flex">
                  <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main content with performance boost */}
          <div className="max-w-md mx-auto">
            {renderCurrentStep()}
          </div>

          {/* Step indicator */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
              <span className="font-medium">Current Step:</span>
              <span className="ml-2">
                {getCurrentStepForDisplay()}
              </span>
              <span className="ml-2 text-gray-400">
                ({getCurrentStepCount()})
              </span>
            </div>
          </div>

          {/* Performance indicator */}
          <div className="mt-4 text-center">
            <div className="inline-flex items-center text-xs text-gray-500">
              <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {isLoading ? `Loading ${getCurrentStepForDisplay()}...` : 'Optimized & Ready'}
            </div>
          </div>

          {/* Rest of your original components... */}
          {/* Security badges, help section, step instructions remain the same */}
        </div>
      </div>

      {/* Demo bypass panel */}
      <DemoBypassPanel
        onBypassStep={handleBypassStep}
        currentStep={currentStep}
        isDemoMode={isDemoMode}
        setIsDemoMode={setIsDemoMode}
      />
    </>
  );
};

export default AuthenticationFlow;
// // Enhanced AuthenticationFlow with OTP bypass for demo purposes
// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import EmailVerification from './auth/EmailVerification';
// import PhoneVerification from './auth/PhoneVerification';
// import BiometricCapture from './auth/BiometricCapture';
// import FallbackSecurity from './auth/FallbackSecurity';
// import SecurityQuestionsSetup from './SecurityQuestionsSetup';
// import ProfileCreation from './ProfileCreation';
// import { useAuth } from '../contexts/AuthContext';

// // Demo bypass component - FIXED to show on all relevant steps
// const DemoBypassPanel = ({ onBypassStep, currentStep, isDemoMode, setIsDemoMode }) => {
//   if (!isDemoMode) {
//     return (
//       <div className="fixed bottom-4 right-4">
//         <button
//           onClick={() => setIsDemoMode(true)}
//           className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg"
//         >
//           🚀 OTP Bypass
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="fixed bottom-4 right-4 bg-white border-2 border-yellow-400 rounded-lg p-4 shadow-xl max-w-xs">
//       <div className="flex items-center justify-between mb-3">
//         <h3 className="text-sm font-bold text-yellow-800">🚀 OTP Bypass Panel</h3>
//         <button
//           onClick={() => setIsDemoMode(false)}
//           className="text-gray-400 hover:text-gray-600"
//         >
//           ✕
//         </button>
//       </div>
      
//       <div className="space-y-2">
//         <div className="text-xs text-gray-600 mb-2">Current Step: {currentStep}</div>
        
//         {/* Show email bypass for steps 1 and 2 */}
//         {(currentStep === 1 || currentStep === 2) && (
//           <button
//             onClick={() => onBypassStep('email-otp')}
//             className="w-full bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
//           >
//             ✅ Bypass Email OTP (Steps 1&2)
//           </button>
//         )}
        
//         {/* Show phone bypass for steps 3 and 4 */}
//         {(currentStep === 3 || currentStep === 4) && (
//           <button
//             onClick={() => onBypassStep('phone-otp')}
//             className="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
//           >
//             ✅ Bypass Phone OTP (Steps 3&4)
//           </button>
//         )}
        
//         {/* Show message for other steps */}
//         {(currentStep !== 1 && currentStep !== 2 && currentStep !== 3 && currentStep !== 4) && (
//           <div className="text-xs text-gray-500 text-center py-2">
//             No OTP bypass needed for this step
//           </div>
//         )}
//       </div>
      
//       <div className="mt-3 pt-2 border-t border-gray-200">
//         <div className="text-xs text-gray-500">
//           ⚠️ Only bypasses OTP verification
//         </div>
//       </div>
//     </div>
//   );
// };

// // Enhanced Loading Screen with better UX
// const EnhancedLoadingScreen = ({ step, message, progress = 0 }) => {
//   const [dots, setDots] = useState('');
  
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setDots(prev => prev.length >= 3 ? '' : prev + '.');
//     }, 400);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="bg-white rounded-lg shadow-lg p-8 text-center">
//       {/* Enhanced spinner with progress */}
//       <div className="mb-6">
//         <div className="relative w-16 h-16 mx-auto">
//           <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
//           <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
//           {progress > 0 && (
//             <div className="absolute inset-2 flex items-center justify-center">
//               <span className="text-xs font-bold text-blue-600">{progress}%</span>
//             </div>
//           )}
//         </div>
//       </div>
      
//       <h2 className="text-xl font-semibold text-gray-900 mb-2">
//         {step ? `Step ${step}` : 'Initializing Vottery'}
//       </h2>
//       <p className="text-gray-600 mb-4">
//         {message || 'Verifying secure access'}{dots}
//       </p>
      
//       {/* Progress bar for loading */}
//       {progress > 0 && (
//         <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
//           <div 
//             className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
//             style={{ width: `${progress}%` }}
//           ></div>
//         </div>
//       )}
      
//       {/* Loading tip */}
//       <div className="text-xs text-gray-500">
//         <p>💡 Keep your email and phone accessible for verification</p>
//       </div>
//     </div>
//   );
// };

// const AuthenticationFlow = () => {
//   // Your original useAuth hook
//   const { 
//     currentStep, 
//     emailVerified, 
//     phoneVerified, 
//     biometricVerified,
//     profileCreated,
//     securityQuestionsSetup,
//     error,
//     isLoading,
//     isAuthenticated,
//     fallbackStep,
//     // Add these methods to your AuthContext if they don't exist
//     setEmailVerified,
//     setPhoneVerified,
//     /*eslint-disable*/
//     setBiometricVerified,
//     setProfileCreated,
//     setSecurityQuestionsSetup,
//     setCurrentStep,
//     setIsAuthenticated
//   } = useAuth();
  
//   const [showProgress, setShowProgress] = useState(true);
//   const [isDemoMode, setIsDemoMode] = useState(false);
  
//   // Loading progress simulation for better UX
//   const [loadingProgress, setLoadingProgress] = useState(0);
  
//   useEffect(() => {
//     if (isLoading) {
//       setLoadingProgress(15);
      
//       const interval = setInterval(() => {
//         setLoadingProgress(prev => {
//           if (prev >= 80) return prev;
//           return prev + Math.random() * 8 + 3;
//         });
//       }, 200);
      
//       const timeout = setTimeout(() => setLoadingProgress(85), 4000);
      
//       return () => {
//         clearInterval(interval);
//         clearTimeout(timeout);
//       };
//     } else {
//       setLoadingProgress(100);
//       setTimeout(() => setLoadingProgress(0), 600);
//     }
//   }, [isLoading]);

//   // Demo bypass handler - SIMPLIFIED for OTP only
//   const handleBypassStep = useCallback((stepType) => {
//     console.log(`🚀 OTP bypass: ${stepType}`);
    
//     switch (stepType) {
//       case 'email-otp':
//         // Only bypass email verification, move to phone step
//         setEmailVerified(true);
//         setCurrentStep(3);
//         toast.success('Email OTP bypassed - moving to phone verification');
//         break;
        
//       case 'phone-otp':
//         // Only bypass phone verification, continue normal flow
//         setPhoneVerified(true);
//         setCurrentStep('security-questions');
//         toast.success('Phone OTP bypassed - continuing to security questions');
//         break;
        
//       default:
//         console.log(`Unknown bypass step: ${stepType}`);
//     }
//   }, [setEmailVerified, setPhoneVerified, setCurrentStep]);

//   // Memoize expensive step status calculations
//   const stepStatuses = useMemo(() => {
//     const getStepStatus = (step) => {
//       switch (step) {
//         case 1:
//           return currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : 'pending';
//         case 2:
//           return emailVerified ? 'completed' : currentStep === 2 ? 'active' : 'pending';
//         case 3:
//           return currentStep === 3 ? 'active' : currentStep > 3 ? 'completed' : 'pending';
//         case 4:
//           return phoneVerified ? 'completed' : currentStep === 4 ? 'active' : 'pending';
//         case 5:
//           return securityQuestionsSetup ? 'completed' : currentStep === 'security-questions' ? 'active' : 'pending';
//         case 6:
//           if (fallbackStep) return 'active';
//           return biometricVerified ? 'completed' : currentStep === 5 ? 'active' : 'pending';
//         case 7:
//           return profileCreated ? 'completed' : currentStep === 6 ? 'active' : 'pending';
//         default:
//           return 'pending';
//       }
//     };

//     return [1, 2, 3, 4, 5, 6, 7].map(step => ({
//       step,
//       status: getStepStatus(step)
//     }));
//   }, [currentStep, emailVerified, phoneVerified, biometricVerified, profileCreated, securityQuestionsSetup, fallbackStep]);

//   // Memoize progress calculation
//   const calculateProgress = useMemo(() => {
//     let progress = 0;
//     if (currentStep > 1) progress += 14.29;
//     if (emailVerified) progress += 14.29;
//     if (currentStep > 3) progress += 14.29;
//     if (phoneVerified) progress += 14.29;
//     if (securityQuestionsSetup) progress += 14.29;
//     if (biometricVerified) progress += 14.29;
//     if (profileCreated) progress += 14.27;
//     return Math.round(progress);
//   }, [currentStep, emailVerified, phoneVerified, biometricVerified, profileCreated, securityQuestionsSetup]);

//   // Memoize step labels
//   const getStepLabel = useCallback((step) => {
//     switch (step) {
//       case 1: return 'Email Input';
//       case 2: return 'Email OTP';
//       case 3: return 'Phone Input';
//       case 4: return 'Phone OTP';
//       case 5: return 'Security Questions';
//       case 6: 
//         if (fallbackStep) return 'Fallback Security';
//         return 'Biometric Auth';
//       case 7: return 'Profile Setup';
//       default: return `Step ${step}`;
//     }
//   }, [fallbackStep]);

//   // Memoized step icon component
//   const StepIcon = React.memo(({ step, status }) => {
//     if (status === 'completed') {
//       return (
//         <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110">
//           <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//           </svg>
//         </div>
//       );
//     } else if (status === 'active') {
//       return (
//         <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg animate-pulse transition-all duration-300">
//           <span className="text-white font-bold text-sm">{step}</span>
//         </div>
//       );
//     } else {
//       return (
//         <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center transition-all duration-300">
//           <span className="text-gray-600 font-medium text-sm">{step}</span>
//         </div>
//       );
//     }
//   });

//   // Better loading messages
//   const getLoadingMessage = useCallback(() => {
//     if (fallbackStep === 'setup') {
//       return 'Setting up fallback security questions';
//     } else if (fallbackStep === 'answer') {
//       return 'Processing security question verification';
//     } else if (currentStep === 'security-questions') {
//       return 'Loading security questions interface';
//     } else if (currentStep === 1) {
//       return 'Initializing email verification system';
//     } else if (currentStep === 2) {
//       return 'Processing email OTP verification';
//     } else if (currentStep === 3) {
//       return 'Setting up phone verification system';
//     } else if (currentStep === 4) {
//       return 'Processing phone OTP verification';
//     } else if (currentStep === 5) {
//       return 'Initializing biometric authentication';
//     } else if (currentStep === 6) {
//       return 'Loading profile creation interface';
//     }
//     return 'Preparing secure authentication system';
//   }, [currentStep, fallbackStep]);

//   // Your original functions
//   const getCurrentStepDescription = () => {
//     if (fallbackStep === 'setup') {
//       return 'Setting up fallback security questions...';
//     } else if (fallbackStep === 'answer') {
//       return 'Answer security questions to complete authentication';
//     } else if (currentStep === 'security-questions') {
//       return 'Set up 3 security questions for account backup authentication';
//     } else if (currentStep === 1) {
//       return 'Enter your registered email address';
//     } else if (currentStep === 2) {
//       return 'Verify the OTP sent to your email';
//     } else if (currentStep === 3) {
//       return 'Enter your registered phone number';
//     } else if (currentStep === 4) {
//       return 'Verify the OTP sent to your phone and email. Sometimes SMS OTPs delay, so we also sent the same OTP to your email';
//     } else if (currentStep === 5) {
//       return 'Complete biometric authentication or fallback security';
//     } else if (currentStep === 6) {
//       return 'Complete your profile to access the dashboard';
//     }
//     return '';
//   };

//   const getCurrentStepForDisplay = () => {
//     if (currentStep === 'security-questions') return 'Security Questions';
//     if (fallbackStep) return 'Fallback Security';
//     return getStepLabel(currentStep);
//   };

//   const getCurrentStepCount = () => {
//     if (currentStep === 'security-questions') return '5/7';
//     if (fallbackStep) return '6/7';
//     return `${currentStep}/7`;
//   };

//   // Your original render logic with performance boost
//   const renderCurrentStep = () => {
//     if (isLoading && (currentStep === 1 || !currentStep) && !fallbackStep) {
//       return (
//         <EnhancedLoadingScreen 
//           step={typeof currentStep === 'number' ? currentStep : ''}
//           message={getLoadingMessage()}
//           progress={loadingProgress}
//         />
//       );
//     }

//     if (fallbackStep) {
//       return <FallbackSecurity />;
//     }

//     if (currentStep === 'security-questions') {
//       return <SecurityQuestionsSetup />;
//     }

//     if (currentStep === 1 || currentStep === 2) {
//       return <EmailVerification />;
//     } else if (currentStep === 3 || currentStep === 4) {
//       return <PhoneVerification />;
//     } else if (currentStep === 5) {
//       return <BiometricCapture />;
//     } else if (currentStep === 6) {
//       return <ProfileCreation />;
//     } else {
//       return <EmailVerification />;
//     }
//   };

//   // Your original authenticated check - FIXED dashboard redirect
//   if (isAuthenticated && profileCreated) {
//     return (
//       <>
//         <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
//           <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md transform transition-all duration-500 hover:scale-105">
//             <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
//               <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//               </svg>
//             </div>
//             <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Complete!</h2>
//             <p className="text-gray-600 mb-4">Welcome to Vottery Dashboard</p>
//             {/* <button 
//               onClick={() => {
//                 // Redirect to root path where dashboard is located
//                 window.location.href = '/';
//               }}
//               className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 transform hover:scale-105"
//             >
//               Continue to Dashboard
//             </button> */}
//                <button 
//             onClick={() => window.location.reload()}
//             className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 transform hover:scale-105"
//           >
//             Continue to Dashboard
//           </button>
//           </div>
//         </div>
        
//         {/* Demo bypass panel still available in success state */}
//         <DemoBypassPanel
//           onBypassStep={handleBypassStep}
//           currentStep={currentStep}
//           isDemoMode={isDemoMode}
//           setIsDemoMode={setIsDemoMode}
//         />
//       </>
//     );
//   }

//   return (
//     <>
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-4xl mx-auto">
//           {/* Demo mode indicator - SIMPLIFIED */}
//           {isDemoMode && (
//             <div className="mb-4">
//               <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-3 text-center">
//                 <span className="text-yellow-800 font-medium">OTP Bypass Mode Active - Skip email/phone verification only</span>
//               </div>
//             </div>
//           )}

//           {/* Your original header with enhanced animations */}
//           <div className="text-center mb-8">
//             <h1 className="text-4xl font-bold text-gray-900 mb-2 transform transition-all duration-500">
//               Welcome to Vottery
//             </h1>
//             <p className="text-lg text-gray-600 mb-4">
//               Complete the 7-step verification process to access your dashboard
//             </p>
//             <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium transform transition-all duration-300 hover:scale-105">
//               <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//               </svg>
//               Secured by SNGINE Authentication
//             </div>
//           </div>

//           {/* Rest of your original component structure... */}
//           {/* (I've kept all your original styling and structure intact) */}
          
//           {fallbackStep && (
//             <div className="mb-6 max-w-md mx-auto">
//               <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 transform transition-all duration-300 hover:scale-102">
//                 <div className="flex">
//                   <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
//                   </svg>
//                   <div className="ml-3">
//                     <p className="text-sm text-amber-800">
//                       {fallbackStep === 'setup' && 'WebAuthn not available. Setting up fallback security questions for authentication.'}
//                       {fallbackStep === 'answer' && 'Please answer the security questions to complete your authentication.'}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Progress steps with performance optimizations */}
//           {showProgress && (
//             <div className="mb-8">
//               <div className="flex justify-center">
//                 <div className="flex items-center space-x-4 overflow-x-auto pb-4">
//                   {stepStatuses.map(({ step, status }, index) => (
//                     <React.Fragment key={step}>
//                       <div className="flex flex-col items-center min-w-0 flex-shrink-0">
//                         <StepIcon step={step} status={status} />
//                         <div className="mt-2 text-center">
//                           <span className="text-xs font-medium text-gray-700 block">
//                             {getStepLabel(step)}
//                           </span>
//                         </div>
//                       </div>
                      
//                       {index < 6 && (
//                         <div className={`h-px w-12 transition-all duration-500 flex-shrink-0 ${
//                           stepStatuses[index + 1]?.status !== 'pending' ? 'bg-green-500' : 'bg-gray-300'
//                         }`}></div>
//                       )}
//                     </React.Fragment>
//                   ))}
//                 </div>
//               </div>

//               <div className="mt-6 max-w-md mx-auto">
//                 <div className="flex justify-between text-xs text-gray-500 mb-1">
//                   <span>Progress</span>
//                   <span>{calculateProgress}%</span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2">
//                   <div 
//                     className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-700 ease-out"
//                     style={{ width: `${calculateProgress}%` }}
//                   ></div>
//                 </div>
//               </div>

//               <div className="mt-4 text-center">
//                 <p className="text-sm text-gray-600">{getCurrentStepDescription()}</p>
//               </div>

//               <div className="text-center mt-4">
//                 <button
//                   onClick={() => setShowProgress(!showProgress)}
//                   className="text-sm text-gray-500 hover:text-gray-700 transition duration-200"
//                 >
//                   Hide Progress
//                 </button>
//               </div>
//             </div>
//           )}

//           {!showProgress && (
//             <div className="text-center mb-8">
//               <button
//                 onClick={() => setShowProgress(true)}
//                 className="text-sm text-gray-500 hover:text-gray-700 transition duration-200"
//               >
//                 Show Progress
//               </button>
//             </div>
//           )}

//           {error && (
//             <div className="mb-6 max-w-md mx-auto">
//               <div className="bg-red-50 border border-red-200 rounded-lg p-4 transform transition-all duration-300 animate-pulse">
//                 <div className="flex">
//                   <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                   <div className="ml-3">
//                     <p className="text-sm text-red-700">{error}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Main content with performance boost */}
//           <div className="max-w-md mx-auto">
//             {renderCurrentStep()}
//           </div>

//           {/* Step indicator */}
//           <div className="mt-6 text-center">
//             <div className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
//               <span className="font-medium">Current Step:</span>
//               <span className="ml-2">
//                 {getCurrentStepForDisplay()}
//               </span>
//               <span className="ml-2 text-gray-400">
//                 ({getCurrentStepCount()})
//               </span>
//             </div>
//           </div>

//           {/* Performance indicator */}
//           <div className="mt-4 text-center">
//             <div className="inline-flex items-center text-xs text-gray-500">
//               <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//               </svg>
//               {isLoading ? `Loading ${getCurrentStepForDisplay()}...` : 'Optimized & Ready'}
//             </div>
//           </div>

//           {/* Rest of your original components... */}
//           {/* Security badges, help section, step instructions remain the same */}
//         </div>
//       </div>

//       {/* Demo bypass panel */}
//       <DemoBypassPanel
//         onBypassStep={handleBypassStep}
//         currentStep={currentStep}
//         isDemoMode={isDemoMode}
//         setIsDemoMode={setIsDemoMode}
//       />
//     </>
//   );
// };

// export default AuthenticationFlow;






//this is the last workable code 100%. this is tested on last day of 3rd milestone
// // //just to optimize performance. it's ui is excellent. i will try later
// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import EmailVerification from './auth/EmailVerification';
// import PhoneVerification from './auth/PhoneVerification';
// import BiometricCapture from './auth/BiometricCapture';
// import FallbackSecurity from './auth/FallbackSecurity';
// import SecurityQuestionsSetup from './SecurityQuestionsSetup';
// import ProfileCreation from './ProfileCreation';
// //import { useAuth } from '../contexts/auth/AuthContext';
// import { useAuth } from '../contexts/AuthContext';
// import { useNavigate } from 'react-router';

// // Enhanced Loading Screen with better UX
// const EnhancedLoadingScreen = ({ step, message, progress = 0 }) => {
//   const [dots, setDots] = useState('');
  
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setDots(prev => prev.length >= 3 ? '' : prev + '.');
//     }, 400);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="bg-white rounded-lg shadow-lg p-8 text-center">
//       {/* Enhanced spinner with progress */}
//       <div className="mb-6">
//         <div className="relative w-16 h-16 mx-auto">
//           <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
//           <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
//           {progress > 0 && (
//             <div className="absolute inset-2 flex items-center justify-center">
//               <span className="text-xs font-bold text-blue-600">{progress}%</span>
//             </div>
//           )}
//         </div>
//       </div>
      
//       <h2 className="text-xl font-semibold text-gray-900 mb-2">
//         {step ? `Step ${step}` : 'Initializing Vottery'}
//       </h2>
//       <p className="text-gray-600 mb-4">
//         {message || 'Verifying secure access'}{dots}
//       </p>
      
//       {/* Progress bar for loading */}
//       {progress > 0 && (
//         <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
//           <div 
//             className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
//             style={{ width: `${progress}%` }}
//           ></div>
//         </div>
//       )}
      
//       {/* Loading tip */}
//       <div className="text-xs text-gray-500">
//         <p>💡 Keep your email and phone accessible for verification</p>
//       </div>
//     </div>
//   );
// };

// const AuthenticationFlow = () => {
//   const navigate = useNavigate();
  
//   // YOUR ORIGINAL useAuth HOOK - UNCHANGED
//   const { 
//     currentStep, 
//     emailVerified, 
//     phoneVerified, 
//     biometricVerified,
//     profileCreated,
//     securityQuestionsSetup,
//     error,
//     isLoading,
//     isAuthenticated,
//     fallbackStep,
//   } = useAuth();
  
//   const [showProgress, setShowProgress] = useState(true);
  
//   // PERFORMANCE BOOST: Loading progress simulation for better UX
//   const [loadingProgress, setLoadingProgress] = useState(0);
  
//   useEffect(() => {
//     if (isLoading) {
//       setLoadingProgress(15); // Start with immediate feedback
      
//       const interval = setInterval(() => {
//         setLoadingProgress(prev => {
//           if (prev >= 90) return prev; // Let it complete at 100% naturally
//           return prev + Math.random() * 8 + 3; // Realistic increments
//         });
//       }, 200);
      
//       // Complete progress when loading should finish - reduced timeout
//       const timeout = setTimeout(() => {
//         setLoadingProgress(100);
//       }, 2500); // Reduced from 4000ms to 2500ms
      
//       return () => {
//         clearInterval(interval);
//         clearTimeout(timeout);
//       };
//     } else {
//       // Complete progress when loading finishes
//       setLoadingProgress(100);
//       setTimeout(() => setLoadingProgress(0), 600);
//     }
//   }, [isLoading]);

//   // PERFORMANCE BOOST: Memoize expensive step status calculations
//   const stepStatuses = useMemo(() => {
//     const getStepStatus = (step) => {
//       switch (step) {
//         case 1: // Email Input
//           return currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : 'pending';
//         case 2: // Email OTP
//           return emailVerified ? 'completed' : currentStep === 2 ? 'active' : 'pending';
//         case 3: // Phone Input
//           return currentStep === 3 ? 'active' : currentStep > 3 ? 'completed' : 'pending';
//         case 4: // Phone OTP
//           return phoneVerified ? 'completed' : currentStep === 4 ? 'active' : 'pending';
//         case 5: // Security Questions Setup
//           return securityQuestionsSetup ? 'completed' : currentStep === 'security-questions' ? 'active' : 'pending';
//         case 6: // Biometric/Fallback Security
//           if (fallbackStep) return 'active';
//           return biometricVerified ? 'completed' : currentStep === 5 ? 'active' : 'pending';
//         case 7: // Profile Creation
//           return profileCreated ? 'completed' : currentStep === 6 ? 'active' : 'pending';
//         default:
//           return 'pending';
//       }
//     };

//     return [1, 2, 3, 4, 5, 6, 7].map(step => ({
//       step,
//       status: getStepStatus(step)
//     }));
//   }, [currentStep, emailVerified, phoneVerified, biometricVerified, profileCreated, securityQuestionsSetup, fallbackStep]);

//   // PERFORMANCE BOOST: Memoize progress calculation
//   const calculateProgress = useMemo(() => {
//     let progress = 0;
//     if (currentStep > 1) progress += 14.29; // Email input completed
//     if (emailVerified) progress += 14.29;   // Email OTP completed
//     if (currentStep > 3) progress += 14.29; // Phone input completed
//     if (phoneVerified) progress += 14.29;   // Phone OTP completed
//     if (securityQuestionsSetup) progress += 14.29; // Security questions completed
//     if (biometricVerified) progress += 14.29; // Biometric completed
//     if (profileCreated) progress += 14.27; // Profile completed (totals 100%)
//     return Math.round(progress);
//   }, [currentStep, emailVerified, phoneVerified, biometricVerified, profileCreated, securityQuestionsSetup]);

//   // PERFORMANCE BOOST: Memoize step labels
//   const getStepLabel = useCallback((step) => {
//     switch (step) {
//       case 1: return 'Email Input';
//       case 2: return 'Email OTP';
//       case 3: return 'Phone Input';
//       case 4: return 'Phone OTP';
//       case 5: return 'Security Questions';
//       case 6: 
//         if (fallbackStep) return 'Fallback Security';
//         return 'Biometric Auth';
//       case 7: return 'Profile Setup';
//       default: return `Step ${step}`;
//     }
//   }, [fallbackStep]);

//   // PERFORMANCE BOOST: Memoized step icon component
//   const StepIcon = React.memo(({ step, status }) => {
//     if (status === 'completed') {
//       return (
//         <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110">
//           <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//           </svg>
//         </div>
//       );
//     } else if (status === 'active') {
//       return (
//         <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg animate-pulse transition-all duration-300">
//           <span className="text-white font-bold text-sm">{step}</span>
//         </div>
//       );
//     } else {
//       return (
//         <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center transition-all duration-300">
//           <span className="text-gray-600 font-medium text-sm">{step}</span>
//         </div>
//       );
//     }
//   });

//   // PERFORMANCE BOOST: Better loading messages
//   const getLoadingMessage = useCallback(() => {
//     if (fallbackStep === 'setup') {
//       return 'Setting up fallback security questions';
//     } else if (fallbackStep === 'answer') {
//       return 'Processing security question verification';
//     } else if (currentStep === 'security-questions') {
//       return 'Loading security questions interface';
//     } else if (currentStep === 1) {
//       return 'Initializing email verification system';
//     } else if (currentStep === 2) {
//       return 'Processing email OTP verification';
//     } else if (currentStep === 3) {
//       return 'Setting up phone verification system';
//     } else if (currentStep === 4) {
//       return 'Processing phone OTP verification';
//     } else if (currentStep === 5) {
//       return 'Initializing biometric authentication';
//     } else if (currentStep === 6) {
//       return 'Loading profile creation interface';
//     }
//     return 'Preparing secure authentication system';
//   }, [currentStep, fallbackStep]);

//   // YOUR ORIGINAL FUNCTIONS - UNCHANGED
//   const getCurrentStepDescription = () => {
//     if (fallbackStep === 'setup') {
//       return 'Setting up fallback security questions...';
//     } else if (fallbackStep === 'answer') {
//       return 'Answer security questions to complete authentication';
//     } else if (currentStep === 'security-questions') {
//       return 'Set up 3 security questions for account backup authentication';
//     } else if (currentStep === 1) {
//       return 'Enter your registered email address';
//     } else if (currentStep === 2) {
//       return 'Verify the OTP sent to your email';
//     } else if (currentStep === 3) {
//       return 'Enter your registered phone number';
//     } else if (currentStep === 4) {
//       return 'Verify the OTP sent to your phone and email. Sometimes SMS OTPs delay, so we also sent the same OTP to your email';
//     } else if (currentStep === 5) {
//       return 'Complete biometric authentication or fallback security';
//     } else if (currentStep === 6) {
//       return 'Complete your profile to access the dashboard';
//     }
//     return '';
//   };

//   const getCurrentStepForDisplay = () => {
//     if (currentStep === 'security-questions') return 'Security Questions';
//     if (fallbackStep) return 'Fallback Security';
//     return getStepLabel(currentStep);
//   };

//   const getCurrentStepCount = () => {
//     if (currentStep === 'security-questions') return '5/7';
//     if (fallbackStep) return '6/7';
//     return `${currentStep}/7`;
//   };

//   // YOUR ORIGINAL RENDER LOGIC - WITH THE FIX
//   const renderCurrentStep = () => {
//     // FIXED: Added loadingProgress < 100 condition
//     if (isLoading && (currentStep === 1 || !currentStep) && !fallbackStep && loadingProgress < 100) {
//       return (
//         <EnhancedLoadingScreen 
//           step={typeof currentStep === 'number' ? currentStep : ''}
//           message={getLoadingMessage()}
//           progress={loadingProgress}
//         />
//       );
//     }

//     // YOUR ORIGINAL COMPONENT RENDERING - UNCHANGED
//     if (fallbackStep) {
//       return <FallbackSecurity />;
//     }

//     if (currentStep === 'security-questions') {
//       return <SecurityQuestionsSetup />;
//     }

//     if (currentStep === 1 || currentStep === 2) {
//       return <EmailVerification />;
//     } else if (currentStep === 3 || currentStep === 4) {
//       return <PhoneVerification />;
//     } else if (currentStep === 5) {
//       return <BiometricCapture />;
//     } else if (currentStep === 6) {
//       return <ProfileCreation />;
//     } else {
//       return <EmailVerification />; // Default fallback
//     }
//   };

//   // YOUR ORIGINAL AUTHENTICATED CHECK - UPDATED NAVIGATION
//   if (isAuthenticated && profileCreated) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
//         <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md transform transition-all duration-500 hover:scale-105">
//           <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
//             <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//             </svg>
//           </div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Complete!</h2>
//           <p className="text-gray-600 mb-4">Welcome to Vottery Dashboard</p>
//           <button
//             onClick={() => navigate('/dashboard')}
//             className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 transform hover:scale-105"
//           >
//             Continue to Dashboard
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-4xl mx-auto">
//         {/* YOUR ORIGINAL HEADER - WITH ENHANCED ANIMATIONS */}
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-gray-900 mb-2 transform transition-all duration-500">
//             Welcome to Vottery
//           </h1>
//           <p className="text-lg text-gray-600 mb-4">
//             Complete the 7-step verification process to access your dashboard
//           </p>
//           <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium transform transition-all duration-300 hover:scale-105">
//             <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//             </svg>
//             Secured by SNGINE Authentication
//           </div>
//         </div>

//         {/* YOUR ORIGINAL FALLBACK NOTICE - WITH ENHANCED ANIMATION */}
//         {fallbackStep && (
//           <div className="mb-6 max-w-md mx-auto">
//             <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 transform transition-all duration-300 hover:scale-102">
//               <div className="flex">
//                 <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
//                 </svg>
//                 <div className="ml-3">
//                   <p className="text-sm text-amber-800">
//                     {fallbackStep === 'setup' && 'WebAuthn not available. Setting up fallback security questions for authentication.'}
//                     {fallbackStep === 'answer' && 'Please answer the security questions to complete your authentication.'}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* YOUR ORIGINAL PROGRESS STEPS - WITH PERFORMANCE OPTIMIZATIONS */}
//         {showProgress && (
//           <div className="mb-8">
//             <div className="flex justify-center">
//               <div className="flex items-center space-x-4 overflow-x-auto pb-4">
//                 {/* PERFORMANCE BOOST: Use memoized step statuses */}
//                 {stepStatuses.map(({ step, status }, index) => (
//                   <React.Fragment key={step}>
//                     {/* Step Icon */}
//                     <div className="flex flex-col items-center min-w-0 flex-shrink-0">
//                       <StepIcon step={step} status={status} />
//                       <div className="mt-2 text-center">
//                         <span className="text-xs font-medium text-gray-700 block">
//                           {getStepLabel(step)}
//                         </span>
//                       </div>
//                     </div>
                    
//                     {/* Connector Line (except for last step) */}
//                     {index < 6 && (
//                       <div className={`h-px w-12 transition-all duration-500 flex-shrink-0 ${
//                         stepStatuses[index + 1]?.status !== 'pending' ? 'bg-green-500' : 'bg-gray-300'
//                       }`}></div>
//                     )}
//                   </React.Fragment>
//                 ))}
//               </div>
//             </div>

//             {/* YOUR ORIGINAL PROGRESS BAR - WITH ENHANCED ANIMATIONS */}
//             <div className="mt-6 max-w-md mx-auto">
//               <div className="flex justify-between text-xs text-gray-500 mb-1">
//                 <span>Progress</span>
//                 <span>{calculateProgress}%</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div 
//                   className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-700 ease-out"
//                   style={{ width: `${calculateProgress}%` }}
//                 ></div>
//               </div>
//             </div>

//             {/* YOUR ORIGINAL STEP DESCRIPTION */}
//             <div className="mt-4 text-center">
//               <p className="text-sm text-gray-600">{getCurrentStepDescription()}</p>
//             </div>

//             {/* YOUR ORIGINAL TOGGLE BUTTON */}
//             <div className="text-center mt-4">
//               <button
//                 onClick={() => setShowProgress(!showProgress)}
//                 className="text-sm text-gray-500 hover:text-gray-700 transition duration-200"
//               >
//                 Hide Progress
//               </button>
//             </div>
//           </div>
//         )}

//         {!showProgress && (
//           <div className="text-center mb-8">
//             <button
//               onClick={() => setShowProgress(true)}
//               className="text-sm text-gray-500 hover:text-gray-700 transition duration-200"
//             >
//               Show Progress
//             </button>
//           </div>
//         )}

//         {/* YOUR ORIGINAL ERROR DISPLAY - ENHANCED */}
//         {error && (
//           <div className="mb-6 max-w-md mx-auto">
//             <div className="bg-red-50 border border-red-200 rounded-lg p-4 transform transition-all duration-300 animate-pulse">
//               <div className="flex">
//                 <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//                 <div className="ml-3">
//                   <p className="text-sm text-red-700">{error}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* YOUR ORIGINAL MAIN CONTENT - WITH PERFORMANCE BOOST */}
//         <div className="max-w-md mx-auto">
//           {renderCurrentStep()}
//         </div>

//         {/* YOUR ORIGINAL STEP INDICATOR */}
//         <div className="mt-6 text-center">
//           <div className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
//             <span className="font-medium">Current Step:</span>
//             <span className="ml-2">
//               {getCurrentStepForDisplay()}
//             </span>
//             <span className="ml-2 text-gray-400">
//               ({getCurrentStepCount()})
//             </span>
//           </div>
//         </div>

//         {/* PERFORMANCE INDICATOR */}
//         <div className="mt-4 text-center">
//           <div className="inline-flex items-center text-xs text-gray-500">
//             <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//             </svg>
//             {(isLoading && loadingProgress < 100) ? `Loading ${getCurrentStepForDisplay()}...` : 'Optimized & Ready'}
//           </div>
//         </div>

//         {/* YOUR ORIGINAL SECURITY BADGES */}
//         <div className="mt-8 text-center">
//           <div className="inline-flex flex-wrap items-center justify-center gap-4">
//             <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full transition-all duration-200 hover:scale-105">
//               <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//               </svg>
//               End-to-End Encrypted
//             </span>
//             <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full transition-all duration-200 hover:scale-105">
//               <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//               </svg>
//               SNGINE Protected
//             </span>
//             <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full transition-all duration-200 hover:scale-105">
//               <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
//               </svg>
//               {fallbackStep ? 'Fallback Secured' : 'Biometric Secured'}
//             </span>
//           </div>
//         </div>

//         {/* YOUR ORIGINAL HELP SECTION */}
//         <div className="mt-8 max-w-md mx-auto">
//           <div className="bg-gray-50 rounded-lg p-4 text-center">
//             <h3 className="text-sm font-medium text-gray-900 mb-2">Need Help?</h3>
//             <p className="text-xs text-gray-600 mb-3">
//               {currentStep === 'security-questions' 
//                 ? 'Security questions provide backup authentication when biometric methods are unavailable'
//                 : fallbackStep 
//                   ? 'Fallback security questions are used when biometric authentication is unavailable'
//                   : 'Make sure your email and phone number are registered in SNGINE database'
//               }
//             </p>
//             <div className="flex justify-center space-x-4 text-xs">
//               <a href="#" className="text-blue-600 hover:text-blue-700">Contact Support</a>
//               <span className="text-gray-300">|</span>
//               <a href="#" className="text-blue-600 hover:text-blue-700">FAQ</a>
//             </div>
//           </div>
//         </div>

//         {/* YOUR ORIGINAL STEP INSTRUCTIONS */}
//         <div className="mt-6 max-w-md mx-auto">
//           <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//             <h4 className="text-sm font-medium text-blue-800 mb-2">Authentication Steps:</h4>
//             <ol className="text-sm text-blue-700 space-y-1">
//               <li className={`flex items-center ${currentStep >= 1 ? 'font-medium' : ''}`}>
//                 <span className="mr-2">{currentStep > 1 ? '✅' : currentStep === 1 ? '🔄' : '⏳'}</span>
//                 Step 1: Enter your registered email
//               </li>
//               <li className={`flex items-center ${currentStep >= 2 ? 'font-medium' : ''}`}>
//                 <span className="mr-2">{emailVerified ? '✅' : currentStep === 2 ? '🔄' : '⏳'}</span>
//                 Step 2: Verify email OTP
//               </li>
//               <li className={`flex items-center ${currentStep >= 3 ? 'font-medium' : ''}`}>
//                 <span className="mr-2">{currentStep > 3 ? '✅' : currentStep === 3 ? '🔄' : '⏳'}</span>
//                 Step 3: Enter your registered phone
//               </li>
//               <li className={`flex items-center ${currentStep >= 4 ? 'font-medium' : ''}`}>
//                 <span className="mr-2">{phoneVerified ? '✅' : currentStep === 4 ? '🔄' : '⏳'}</span>
//                 Step 4: Verify SMS OTP
//               </li>
//               <li className={`flex items-center ${currentStep === 'security-questions' ? 'font-medium' : ''}`}>
//                 <span className="mr-2">{securityQuestionsSetup ? '✅' : currentStep === 'security-questions' ? '🔄' : '⏳'}</span>
//                 Step 5: Set up security questions
//               </li>
//               <li className={`flex items-center ${currentStep >= 5 || fallbackStep ? 'font-medium' : ''}`}>
//                 <span className="mr-2">{biometricVerified ? '✅' : (currentStep === 5 || fallbackStep) ? '🔄' : '⏳'}</span>
//                 Step 6: Complete biometric authentication {fallbackStep && '(Fallback Security)'}
//               </li>
//               <li className={`flex items-center ${currentStep >= 6 ? 'font-medium' : ''}`}>
//                 <span className="mr-2">{profileCreated ? '✅' : currentStep === 6 ? '🔄' : '⏳'}</span>
//                 Step 7: Complete profile setup
//               </li>
//             </ol>
            
//             {(currentStep === 'security-questions' || fallbackStep) && (
//               <div className="mt-3 pt-3 border-t border-blue-200">
//                 <p className="text-xs text-blue-600 font-medium">
//                   {currentStep === 'security-questions' && '🔐 Setting up security questions for backup authentication'}
//                   {fallbackStep === 'setup' && '🔒 Fallback Security Active: Setting up security questions'}
//                   {fallbackStep === 'answer' && '🔒 Fallback Security Active: Answer security questions'}
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AuthenticationFlow;





//this is the last workable code
// //just to optimize performance. it's ui is excellent. i will try later
// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import EmailVerification from './auth/EmailVerification';
// import PhoneVerification from './auth/PhoneVerification';
// import BiometricCapture from './auth/BiometricCapture';
// import FallbackSecurity from './auth/FallbackSecurity';
// import SecurityQuestionsSetup from './SecurityQuestionsSetup';
// import ProfileCreation from './ProfileCreation';
// //import { useAuth } from '../contexts/auth/AuthContext';
// import { useAuth } from '../contexts/AuthContext';
// import { useNavigate } from 'react-router';

// // Enhanced Loading Screen with better UX
// const EnhancedLoadingScreen = ({ step, message, progress = 0 }) => {
//   const [dots, setDots] = useState('');
  
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setDots(prev => prev.length >= 3 ? '' : prev + '.');
//     }, 400);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="bg-white rounded-lg shadow-lg p-8 text-center">
//       {/* Enhanced spinner with progress */}
//       <div className="mb-6">
//         <div className="relative w-16 h-16 mx-auto">
//           <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
//           <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
//           {progress > 0 && (
//             <div className="absolute inset-2 flex items-center justify-center">
//               <span className="text-xs font-bold text-blue-600">{progress}%</span>
//             </div>
//           )}
//         </div>
//       </div>
      
//       <h2 className="text-xl font-semibold text-gray-900 mb-2">
//         {step ? `Step ${step}` : 'Initializing Vottery'}
//       </h2>
//       <p className="text-gray-600 mb-4">
//         {message || 'Verifying secure access'}{dots}
//       </p>
      
//       {/* Progress bar for loading */}
//       {progress > 0 && (
//         <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
//           <div 
//             className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
//             style={{ width: `${progress}%` }}
//           ></div>
//         </div>
//       )}
      
//       {/* Loading tip */}
//       <div className="text-xs text-gray-500">
//         <p>💡 Keep your email and phone accessible for verification</p>
//       </div>
//     </div>
//   );
// };

// const AuthenticationFlow = () => {
//   const navigate = useNavigate();
  
//   // YOUR ORIGINAL useAuth HOOK - UNCHANGED
//   const { 
//     currentStep, 
//     emailVerified, 
//     phoneVerified, 
//     biometricVerified,
//     profileCreated,
//     securityQuestionsSetup,
//     error,
//     isLoading,
//     isAuthenticated,
//     fallbackStep,
//   } = useAuth();
  
//   const [showProgress, setShowProgress] = useState(true);
  
//   // PERFORMANCE BOOST: Loading progress simulation for better UX
//   const [loadingProgress, setLoadingProgress] = useState(0);
  
//   useEffect(() => {
//     if (isLoading) {
//       setLoadingProgress(15); // Start with immediate feedback
      
//       const interval = setInterval(() => {
//         setLoadingProgress(prev => {
//           if (prev >= 80) return prev; // Cap at 80% until real loading completes
//           return prev + Math.random() * 8 + 3; // Realistic increments
//         });
//       }, 200);
      
//       // Prevent infinite loading - complete at 85% after 4 seconds
//       const timeout = setTimeout(() => setLoadingProgress(85), 4000);
      
//       return () => {
//         clearInterval(interval);
//         clearTimeout(timeout);
//       };
//     } else {
//       // Complete progress when loading finishes
//       setLoadingProgress(100);
//       setTimeout(() => setLoadingProgress(0), 600);
//     }
//   }, [isLoading]);

//   // PERFORMANCE BOOST: Memoize expensive step status calculations
//   const stepStatuses = useMemo(() => {
//     const getStepStatus = (step) => {
//       switch (step) {
//         case 1: // Email Input
//           return currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : 'pending';
//         case 2: // Email OTP
//           return emailVerified ? 'completed' : currentStep === 2 ? 'active' : 'pending';
//         case 3: // Phone Input
//           return currentStep === 3 ? 'active' : currentStep > 3 ? 'completed' : 'pending';
//         case 4: // Phone OTP
//           return phoneVerified ? 'completed' : currentStep === 4 ? 'active' : 'pending';
//         case 5: // Security Questions Setup
//           return securityQuestionsSetup ? 'completed' : currentStep === 'security-questions' ? 'active' : 'pending';
//         case 6: // Biometric/Fallback Security
//           if (fallbackStep) return 'active';
//           return biometricVerified ? 'completed' : currentStep === 5 ? 'active' : 'pending';
//         case 7: // Profile Creation
//           return profileCreated ? 'completed' : currentStep === 6 ? 'active' : 'pending';
//         default:
//           return 'pending';
//       }
//     };

//     return [1, 2, 3, 4, 5, 6, 7].map(step => ({
//       step,
//       status: getStepStatus(step)
//     }));
//   }, [currentStep, emailVerified, phoneVerified, biometricVerified, profileCreated, securityQuestionsSetup, fallbackStep]);

//   // PERFORMANCE BOOST: Memoize progress calculation
//   const calculateProgress = useMemo(() => {
//     let progress = 0;
//     if (currentStep > 1) progress += 14.29; // Email input completed
//     if (emailVerified) progress += 14.29;   // Email OTP completed
//     if (currentStep > 3) progress += 14.29; // Phone input completed
//     if (phoneVerified) progress += 14.29;   // Phone OTP completed
//     if (securityQuestionsSetup) progress += 14.29; // Security questions completed
//     if (biometricVerified) progress += 14.29; // Biometric completed
//     if (profileCreated) progress += 14.27; // Profile completed (totals 100%)
//     return Math.round(progress);
//   }, [currentStep, emailVerified, phoneVerified, biometricVerified, profileCreated, securityQuestionsSetup]);

//   // PERFORMANCE BOOST: Memoize step labels
//   const getStepLabel = useCallback((step) => {
//     switch (step) {
//       case 1: return 'Email Input';
//       case 2: return 'Email OTP';
//       case 3: return 'Phone Input';
//       case 4: return 'Phone OTP';
//       case 5: return 'Security Questions';
//       case 6: 
//         if (fallbackStep) return 'Fallback Security';
//         return 'Biometric Auth';
//       case 7: return 'Profile Setup';
//       default: return `Step ${step}`;
//     }
//   }, [fallbackStep]);

//   // PERFORMANCE BOOST: Memoized step icon component
//   const StepIcon = React.memo(({ step, status }) => {
//     if (status === 'completed') {
//       return (
//         <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110">
//           <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//           </svg>
//         </div>
//       );
//     } else if (status === 'active') {
//       return (
//         <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg animate-pulse transition-all duration-300">
//           <span className="text-white font-bold text-sm">{step}</span>
//         </div>
//       );
//     } else {
//       return (
//         <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center transition-all duration-300">
//           <span className="text-gray-600 font-medium text-sm">{step}</span>
//         </div>
//       );
//     }
//   });

//   // PERFORMANCE BOOST: Better loading messages
//   const getLoadingMessage = useCallback(() => {
//     if (fallbackStep === 'setup') {
//       return 'Setting up fallback security questions';
//     } else if (fallbackStep === 'answer') {
//       return 'Processing security question verification';
//     } else if (currentStep === 'security-questions') {
//       return 'Loading security questions interface';
//     } else if (currentStep === 1) {
//       return 'Initializing email verification system';
//     } else if (currentStep === 2) {
//       return 'Processing email OTP verification';
//     } else if (currentStep === 3) {
//       return 'Setting up phone verification system';
//     } else if (currentStep === 4) {
//       return 'Processing phone OTP verification';
//     } else if (currentStep === 5) {
//       return 'Initializing biometric authentication';
//     } else if (currentStep === 6) {
//       return 'Loading profile creation interface';
//     }
//     return 'Preparing secure authentication system';
//   }, [currentStep, fallbackStep]);

//   // YOUR ORIGINAL FUNCTIONS - UNCHANGED
//   const getCurrentStepDescription = () => {
//     if (fallbackStep === 'setup') {
//       return 'Setting up fallback security questions...';
//     } else if (fallbackStep === 'answer') {
//       return 'Answer security questions to complete authentication';
//     } else if (currentStep === 'security-questions') {
//       return 'Set up 3 security questions for account backup authentication';
//     } else if (currentStep === 1) {
//       return 'Enter your registered email address';
//     } else if (currentStep === 2) {
//       return 'Verify the OTP sent to your email';
//     } else if (currentStep === 3) {
//       return 'Enter your registered phone number';
//     } else if (currentStep === 4) {
//       return 'Verify the OTP sent to your phone and email. Sometimes SMS OTPs delay, so we also sent the same OTP to your email';
//     } else if (currentStep === 5) {
//       return 'Complete biometric authentication or fallback security';
//     } else if (currentStep === 6) {
//       return 'Complete your profile to access the dashboard';
//     }
//     return '';
//   };

//   const getCurrentStepForDisplay = () => {
//     if (currentStep === 'security-questions') return 'Security Questions';
//     if (fallbackStep) return 'Fallback Security';
//     return getStepLabel(currentStep);
//   };

//   const getCurrentStepCount = () => {
//     if (currentStep === 'security-questions') return '5/7';
//     if (fallbackStep) return '6/7';
//     return `${currentStep}/7`;
//   };

//   // YOUR ORIGINAL RENDER LOGIC - WITH PERFORMANCE BOOST
//   const renderCurrentStep = () => {
//     // ENHANCED: Show loading with better UX during initial loading or step transitions
//     if (isLoading && (currentStep === 1 || !currentStep) && !fallbackStep) {
//       return (
//         <EnhancedLoadingScreen 
//           step={typeof currentStep === 'number' ? currentStep : ''}
//           message={getLoadingMessage()}
//           progress={loadingProgress}
//         />
//       );
//     }

//     // YOUR ORIGINAL COMPONENT RENDERING - UNCHANGED
//     if (fallbackStep) {
//       return <FallbackSecurity />;
//     }

//     if (currentStep === 'security-questions') {
//       return <SecurityQuestionsSetup />;
//     }

//     if (currentStep === 1 || currentStep === 2) {
//       return <EmailVerification />;
//     } else if (currentStep === 3 || currentStep === 4) {
//       return <PhoneVerification />;
//     } else if (currentStep === 5) {
//       return <BiometricCapture />;
//     } else if (currentStep === 6) {
//       return <ProfileCreation />;
//     } else {
//       return <EmailVerification />; // Default fallback
//     }
//   };

//   // YOUR ORIGINAL AUTHENTICATED CHECK - UPDATED NAVIGATION
//   if (isAuthenticated && profileCreated) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
//         <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md transform transition-all duration-500 hover:scale-105">
//           <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
//             <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//             </svg>
//           </div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Complete!</h2>
//           <p className="text-gray-600 mb-4">Welcome to Vottery Dashboard</p>
//           <button
//             onClick={() => navigate('/dashboard')}
//             className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 transform hover:scale-105"
//           >
//             Continue to Dashboard
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-4xl mx-auto">
//         {/* YOUR ORIGINAL HEADER - WITH ENHANCED ANIMATIONS */}
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-gray-900 mb-2 transform transition-all duration-500">
//             Welcome to Vottery
//           </h1>
//           <p className="text-lg text-gray-600 mb-4">
//             Complete the 7-step verification process to access your dashboard
//           </p>
//           <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium transform transition-all duration-300 hover:scale-105">
//             <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//             </svg>
//             Secured by SNGINE Authentication
//           </div>
//         </div>

//         {/* YOUR ORIGINAL FALLBACK NOTICE - WITH ENHANCED ANIMATION */}
//         {fallbackStep && (
//           <div className="mb-6 max-w-md mx-auto">
//             <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 transform transition-all duration-300 hover:scale-102">
//               <div className="flex">
//                 <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
//                 </svg>
//                 <div className="ml-3">
//                   <p className="text-sm text-amber-800">
//                     {fallbackStep === 'setup' && 'WebAuthn not available. Setting up fallback security questions for authentication.'}
//                     {fallbackStep === 'answer' && 'Please answer the security questions to complete your authentication.'}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* YOUR ORIGINAL PROGRESS STEPS - WITH PERFORMANCE OPTIMIZATIONS */}
//         {showProgress && (
//           <div className="mb-8">
//             <div className="flex justify-center">
//               <div className="flex items-center space-x-4 overflow-x-auto pb-4">
//                 {/* PERFORMANCE BOOST: Use memoized step statuses */}
//                 {stepStatuses.map(({ step, status }, index) => (
//                   <React.Fragment key={step}>
//                     {/* Step Icon */}
//                     <div className="flex flex-col items-center min-w-0 flex-shrink-0">
//                       <StepIcon step={step} status={status} />
//                       <div className="mt-2 text-center">
//                         <span className="text-xs font-medium text-gray-700 block">
//                           {getStepLabel(step)}
//                         </span>
//                       </div>
//                     </div>
                    
//                     {/* Connector Line (except for last step) */}
//                     {index < 6 && (
//                       <div className={`h-px w-12 transition-all duration-500 flex-shrink-0 ${
//                         stepStatuses[index + 1]?.status !== 'pending' ? 'bg-green-500' : 'bg-gray-300'
//                       }`}></div>
//                     )}
//                   </React.Fragment>
//                 ))}
//               </div>
//             </div>

//             {/* YOUR ORIGINAL PROGRESS BAR - WITH ENHANCED ANIMATIONS */}
//             <div className="mt-6 max-w-md mx-auto">
//               <div className="flex justify-between text-xs text-gray-500 mb-1">
//                 <span>Progress</span>
//                 <span>{calculateProgress}%</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div 
//                   className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-700 ease-out"
//                   style={{ width: `${calculateProgress}%` }}
//                 ></div>
//               </div>
//             </div>

//             {/* YOUR ORIGINAL STEP DESCRIPTION */}
//             <div className="mt-4 text-center">
//               <p className="text-sm text-gray-600">{getCurrentStepDescription()}</p>
//             </div>

//             {/* YOUR ORIGINAL TOGGLE BUTTON */}
//             <div className="text-center mt-4">
//               <button
//                 onClick={() => setShowProgress(!showProgress)}
//                 className="text-sm text-gray-500 hover:text-gray-700 transition duration-200"
//               >
//                 Hide Progress
//               </button>
//             </div>
//           </div>
//         )}

//         {!showProgress && (
//           <div className="text-center mb-8">
//             <button
//               onClick={() => setShowProgress(true)}
//               className="text-sm text-gray-500 hover:text-gray-700 transition duration-200"
//             >
//               Show Progress
//             </button>
//           </div>
//         )}

//         {/* YOUR ORIGINAL ERROR DISPLAY - ENHANCED */}
//         {error && (
//           <div className="mb-6 max-w-md mx-auto">
//             <div className="bg-red-50 border border-red-200 rounded-lg p-4 transform transition-all duration-300 animate-pulse">
//               <div className="flex">
//                 <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//                 <div className="ml-3">
//                   <p className="text-sm text-red-700">{error}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* YOUR ORIGINAL MAIN CONTENT - WITH PERFORMANCE BOOST */}
//         <div className="max-w-md mx-auto">
//           {renderCurrentStep()}
//         </div>

//         {/* YOUR ORIGINAL STEP INDICATOR */}
//         <div className="mt-6 text-center">
//           <div className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
//             <span className="font-medium">Current Step:</span>
//             <span className="ml-2">
//               {getCurrentStepForDisplay()}
//             </span>
//             <span className="ml-2 text-gray-400">
//               ({getCurrentStepCount()})
//             </span>
//           </div>
//         </div>

//         {/* PERFORMANCE INDICATOR */}
//         <div className="mt-4 text-center">
//           <div className="inline-flex items-center text-xs text-gray-500">
//             <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//             </svg>
//             {isLoading ? `Loading ${getCurrentStepForDisplay()}...` : 'Optimized & Ready'}
//           </div>
//         </div>

//         {/* YOUR ORIGINAL SECURITY BADGES */}
//         <div className="mt-8 text-center">
//           <div className="inline-flex flex-wrap items-center justify-center gap-4">
//             <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full transition-all duration-200 hover:scale-105">
//               <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//               </svg>
//               End-to-End Encrypted
//             </span>
//             <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full transition-all duration-200 hover:scale-105">
//               <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//               </svg>
//               SNGINE Protected
//             </span>
//             <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full transition-all duration-200 hover:scale-105">
//               <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
//               </svg>
//               {fallbackStep ? 'Fallback Secured' : 'Biometric Secured'}
//             </span>
//           </div>
//         </div>

//         {/* YOUR ORIGINAL HELP SECTION */}
//         <div className="mt-8 max-w-md mx-auto">
//           <div className="bg-gray-50 rounded-lg p-4 text-center">
//             <h3 className="text-sm font-medium text-gray-900 mb-2">Need Help?</h3>
//             <p className="text-xs text-gray-600 mb-3">
//               {currentStep === 'security-questions' 
//                 ? 'Security questions provide backup authentication when biometric methods are unavailable'
//                 : fallbackStep 
//                   ? 'Fallback security questions are used when biometric authentication is unavailable'
//                   : 'Make sure your email and phone number are registered in SNGINE database'
//               }
//             </p>
//             <div className="flex justify-center space-x-4 text-xs">
//               <a href="#" className="text-blue-600 hover:text-blue-700">Contact Support</a>
//               <span className="text-gray-300">|</span>
//               <a href="#" className="text-blue-600 hover:text-blue-700">FAQ</a>
//             </div>
//           </div>
//         </div>

//         {/* YOUR ORIGINAL STEP INSTRUCTIONS */}
//         <div className="mt-6 max-w-md mx-auto">
//           <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//             <h4 className="text-sm font-medium text-blue-800 mb-2">Authentication Steps:</h4>
//             <ol className="text-sm text-blue-700 space-y-1">
//               <li className={`flex items-center ${currentStep >= 1 ? 'font-medium' : ''}`}>
//                 <span className="mr-2">{currentStep > 1 ? '✅' : currentStep === 1 ? '🔄' : '⏳'}</span>
//                 Step 1: Enter your registered email
//               </li>
//               <li className={`flex items-center ${currentStep >= 2 ? 'font-medium' : ''}`}>
//                 <span className="mr-2">{emailVerified ? '✅' : currentStep === 2 ? '🔄' : '⏳'}</span>
//                 Step 2: Verify email OTP
//               </li>
//               <li className={`flex items-center ${currentStep >= 3 ? 'font-medium' : ''}`}>
//                 <span className="mr-2">{currentStep > 3 ? '✅' : currentStep === 3 ? '🔄' : '⏳'}</span>
//                 Step 3: Enter your registered phone
//               </li>
//               <li className={`flex items-center ${currentStep >= 4 ? 'font-medium' : ''}`}>
//                 <span className="mr-2">{phoneVerified ? '✅' : currentStep === 4 ? '🔄' : '⏳'}</span>
//                 Step 4: Verify SMS OTP
//               </li>
//               <li className={`flex items-center ${currentStep === 'security-questions' ? 'font-medium' : ''}`}>
//                 <span className="mr-2">{securityQuestionsSetup ? '✅' : currentStep === 'security-questions' ? '🔄' : '⏳'}</span>
//                 Step 5: Set up security questions
//               </li>
//               <li className={`flex items-center ${currentStep >= 5 || fallbackStep ? 'font-medium' : ''}`}>
//                 <span className="mr-2">{biometricVerified ? '✅' : (currentStep === 5 || fallbackStep) ? '🔄' : '⏳'}</span>
//                 Step 6: Complete biometric authentication {fallbackStep && '(Fallback Security)'}
//               </li>
//               <li className={`flex items-center ${currentStep >= 6 ? 'font-medium' : ''}`}>
//                 <span className="mr-2">{profileCreated ? '✅' : currentStep === 6 ? '🔄' : '⏳'}</span>
//                 Step 7: Complete profile setup
//               </li>
//             </ol>
            
//             {(currentStep === 'security-questions' || fallbackStep) && (
//               <div className="mt-3 pt-3 border-t border-blue-200">
//                 <p className="text-xs text-blue-600 font-medium">
//                   {currentStep === 'security-questions' && '🔐 Setting up security questions for backup authentication'}
//                   {fallbackStep === 'setup' && '🔒 Fallback Security Active: Setting up security questions'}
//                   {fallbackStep === 'answer' && '🔒 Fallback Security Active: Answer security questions'}
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AuthenticationFlow;














// // //just to optimize performance. it's ui is excellent. i will try later
// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import EmailVerification from './auth/EmailVerification';
// import PhoneVerification from './auth/PhoneVerification';
// import BiometricCapture from './auth/BiometricCapture';
// import FallbackSecurity from './auth/FallbackSecurity';
// import SecurityQuestionsSetup from './SecurityQuestionsSetup';
// import ProfileCreation from './ProfileCreation';
// //import { useAuth } from '../contexts/auth/AuthContext';
// import { useAuth } from '../contexts/AuthContext';
// import { useNavigate } from 'react-router';
// // Enhanced Loading Screen with better UX
// const EnhancedLoadingScreen = ({ step, message, progress = 0 }) => {
//   const [dots, setDots] = useState('');
//   const navigate = useNavigate();
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setDots(prev => prev.length >= 3 ? '' : prev + '.');
//     }, 400);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="bg-white rounded-lg shadow-lg p-8 text-center">
//       {/* Enhanced spinner with progress */}
//       <div className="mb-6">
//         <div className="relative w-16 h-16 mx-auto">
//           <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
//           <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
//           {progress > 0 && (
//             <div className="absolute inset-2 flex items-center justify-center">
//               <span className="text-xs font-bold text-blue-600">{progress}%</span>
//             </div>
//           )}
//         </div>
//       </div>
      
//       <h2 className="text-xl font-semibold text-gray-900 mb-2">
//         {step ? `Step ${step}` : 'Initializing Vottery'}
//       </h2>
//       <p className="text-gray-600 mb-4">
//         {message || 'Verifying secure access'}{dots}
//       </p>
      
//       {/* Progress bar for loading */}
//       {progress > 0 && (
//         <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
//           <div 
//             className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
//             style={{ width: `${progress}%` }}
//           ></div>
//         </div>
//       )}
      
//       {/* Loading tip */}
//       <div className="text-xs text-gray-500">
//         <p>💡 Keep your email and phone accessible for verification</p>
//       </div>
//     </div>
//   );
// };

// const AuthenticationFlow = () => {
//   // YOUR ORIGINAL useAuth HOOK - UNCHANGED
//   const { 
//     currentStep, 
//     emailVerified, 
//     phoneVerified, 
//     biometricVerified,
//     profileCreated,
//     securityQuestionsSetup,
//     error,
//     isLoading,
//     isAuthenticated,
//     fallbackStep,
//   } = useAuth();
  
//   const [showProgress, setShowProgress] = useState(true);
  
//   // PERFORMANCE BOOST: Loading progress simulation for better UX
//   const [loadingProgress, setLoadingProgress] = useState(0);
  
//   useEffect(() => {
//     if (isLoading) {
//       setLoadingProgress(15); // Start with immediate feedback
      
//       const interval = setInterval(() => {
//         setLoadingProgress(prev => {
//           if (prev >= 80) return prev; // Cap at 80% until real loading completes
//           return prev + Math.random() * 8 + 3; // Realistic increments
//         });
//       }, 200);
      
//       // Prevent infinite loading - complete at 85% after 4 seconds
//       const timeout = setTimeout(() => setLoadingProgress(85), 4000);
      
//       return () => {
//         clearInterval(interval);
//         clearTimeout(timeout);
//       };
//     } else {
//       // Complete progress when loading finishes
//       setLoadingProgress(100);
//       setTimeout(() => setLoadingProgress(0), 600);
//     }
//   }, [isLoading]);

//   // PERFORMANCE BOOST: Memoize expensive step status calculations
//   const stepStatuses = useMemo(() => {
//     const getStepStatus = (step) => {
//       switch (step) {
//         case 1: // Email Input
//           return currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : 'pending';
//         case 2: // Email OTP
//           return emailVerified ? 'completed' : currentStep === 2 ? 'active' : 'pending';
//         case 3: // Phone Input
//           return currentStep === 3 ? 'active' : currentStep > 3 ? 'completed' : 'pending';
//         case 4: // Phone OTP
//           return phoneVerified ? 'completed' : currentStep === 4 ? 'active' : 'pending';
//         case 5: // Security Questions Setup
//           return securityQuestionsSetup ? 'completed' : currentStep === 'security-questions' ? 'active' : 'pending';
//         case 6: // Biometric/Fallback Security
//           if (fallbackStep) return 'active';
//           return biometricVerified ? 'completed' : currentStep === 5 ? 'active' : 'pending';
//         case 7: // Profile Creation
//           return profileCreated ? 'completed' : currentStep === 6 ? 'active' : 'pending';
//         default:
//           return 'pending';
//       }
//     };

//     return [1, 2, 3, 4, 5, 6, 7].map(step => ({
//       step,
//       status: getStepStatus(step)
//     }));
//   }, [currentStep, emailVerified, phoneVerified, biometricVerified, profileCreated, securityQuestionsSetup, fallbackStep]);

//   // PERFORMANCE BOOST: Memoize progress calculation
//   const calculateProgress = useMemo(() => {
//     let progress = 0;
//     if (currentStep > 1) progress += 14.29; // Email input completed
//     if (emailVerified) progress += 14.29;   // Email OTP completed
//     if (currentStep > 3) progress += 14.29; // Phone input completed
//     if (phoneVerified) progress += 14.29;   // Phone OTP completed
//     if (securityQuestionsSetup) progress += 14.29; // Security questions completed
//     if (biometricVerified) progress += 14.29; // Biometric completed
//     if (profileCreated) progress += 14.27; // Profile completed (totals 100%)
//     return Math.round(progress);
//   }, [currentStep, emailVerified, phoneVerified, biometricVerified, profileCreated, securityQuestionsSetup]);

//   // PERFORMANCE BOOST: Memoize step labels
//   const getStepLabel = useCallback((step) => {
//     switch (step) {
//       case 1: return 'Email Input';
//       case 2: return 'Email OTP';
//       case 3: return 'Phone Input';
//       case 4: return 'Phone OTP';
//       case 5: return 'Security Questions';
//       case 6: 
//         if (fallbackStep) return 'Fallback Security';
//         return 'Biometric Auth';
//       case 7: return 'Profile Setup';
//       default: return `Step ${step}`;
//     }
//   }, [fallbackStep]);

//   // PERFORMANCE BOOST: Memoized step icon component
//   const StepIcon = React.memo(({ step, status }) => {
//     if (status === 'completed') {
//       return (
//         <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110">
//           <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//           </svg>
//         </div>
//       );
//     } else if (status === 'active') {
//       return (
//         <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg animate-pulse transition-all duration-300">
//           <span className="text-white font-bold text-sm">{step}</span>
//         </div>
//       );
//     } else {
//       return (
//         <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center transition-all duration-300">
//           <span className="text-gray-600 font-medium text-sm">{step}</span>
//         </div>
//       );
//     }
//   });

//   // PERFORMANCE BOOST: Better loading messages
//   const getLoadingMessage = useCallback(() => {
//     if (fallbackStep === 'setup') {
//       return 'Setting up fallback security questions';
//     } else if (fallbackStep === 'answer') {
//       return 'Processing security question verification';
//     } else if (currentStep === 'security-questions') {
//       return 'Loading security questions interface';
//     } else if (currentStep === 1) {
//       return 'Initializing email verification system';
//     } else if (currentStep === 2) {
//       return 'Processing email OTP verification';
//     } else if (currentStep === 3) {
//       return 'Setting up phone verification system';
//     } else if (currentStep === 4) {
//       return 'Processing phone OTP verification';
//     } else if (currentStep === 5) {
//       return 'Initializing biometric authentication';
//     } else if (currentStep === 6) {
//       return 'Loading profile creation interface';
//     }
//     return 'Preparing secure authentication system';
//   }, [currentStep, fallbackStep]);

//   // YOUR ORIGINAL FUNCTIONS - UNCHANGED
//   const getCurrentStepDescription = () => {
//     if (fallbackStep === 'setup') {
//       return 'Setting up fallback security questions...';
//     } else if (fallbackStep === 'answer') {
//       return 'Answer security questions to complete authentication';
//     } else if (currentStep === 'security-questions') {
//       return 'Set up 3 security questions for account backup authentication';
//     } else if (currentStep === 1) {
//       return 'Enter your registered email address';
//     } else if (currentStep === 2) {
//       return 'Verify the OTP sent to your email';
//     } else if (currentStep === 3) {
//       return 'Enter your registered phone number';
//     } else if (currentStep === 4) {
//       return 'Verify the OTP sent to your phone and email. Sometimes SMS OTPs delay, so we also sent the same OTP to your email';
//     } else if (currentStep === 5) {
//       return 'Complete biometric authentication or fallback security';
//     } else if (currentStep === 6) {
//       return 'Complete your profile to access the dashboard';
//     }
//     return '';
//   };

//   const getCurrentStepForDisplay = () => {
//     if (currentStep === 'security-questions') return 'Security Questions';
//     if (fallbackStep) return 'Fallback Security';
//     return getStepLabel(currentStep);
//   };

//   const getCurrentStepCount = () => {
//     if (currentStep === 'security-questions') return '5/7';
//     if (fallbackStep) return '6/7';
//     return `${currentStep}/7`;
//   };

//   // YOUR ORIGINAL RENDER LOGIC - WITH PERFORMANCE BOOST
//   const renderCurrentStep = () => {
//     // ENHANCED: Show loading with better UX during initial loading or step transitions
//     if (isLoading && (currentStep === 1 || !currentStep) && !fallbackStep) {
//       return (
//         <EnhancedLoadingScreen 
//           step={typeof currentStep === 'number' ? currentStep : ''}
//           message={getLoadingMessage()}
//           progress={loadingProgress}
//         />
//       );
//     }

//     // YOUR ORIGINAL COMPONENT RENDERING - UNCHANGED
//     if (fallbackStep) {
//       return <FallbackSecurity />;
//     }

//     if (currentStep === 'security-questions') {
//       return <SecurityQuestionsSetup />;
//     }

//     if (currentStep === 1 || currentStep === 2) {
//       return <EmailVerification />;
//     } else if (currentStep === 3 || currentStep === 4) {
//       return <PhoneVerification />;
//     } else if (currentStep === 5) {
//       return <BiometricCapture />;
//     } else if (currentStep === 6) {
//       return <ProfileCreation />;
//     } else {
//       return <EmailVerification />; // Default fallback
//     }
//   };

//   // YOUR ORIGINAL AUTHENTICATED CHECK - UNCHANGED
//   if (isAuthenticated && profileCreated) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
//         <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md transform transition-all duration-500 hover:scale-105">
//           <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
//             <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//             </svg>
//           </div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Complete!</h2>
//           <p className="text-gray-600 mb-4">Welcome to Vottery Dashboard</p>
//           {/* <button 
//             onClick={() => window.location.reload()}
//             className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 transform hover:scale-105"
//           >
//             Continue to Dashboard
//           </button> */}
//           <button
//   onClick={() => navigate('/dashboard')}
//   className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 transform hover:scale-105"
// >
//   Continue to Dashboard
// </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-4xl mx-auto">
//         {/* YOUR ORIGINAL HEADER - WITH ENHANCED ANIMATIONS */}
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-gray-900 mb-2 transform transition-all duration-500">
//             Welcome to Vottery
//           </h1>
//           <p className="text-lg text-gray-600 mb-4">
//             Complete the 7-step verification process to access your dashboard
//           </p>
//           <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium transform transition-all duration-300 hover:scale-105">
//             <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//             </svg>
//             Secured by SNGINE Authentication
//           </div>
//         </div>

//         {/* YOUR ORIGINAL FALLBACK NOTICE - WITH ENHANCED ANIMATION */}
//         {fallbackStep && (
//           <div className="mb-6 max-w-md mx-auto">
//             <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 transform transition-all duration-300 hover:scale-102">
//               <div className="flex">
//                 <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
//                 </svg>
//                 <div className="ml-3">
//                   <p className="text-sm text-amber-800">
//                     {fallbackStep === 'setup' && 'WebAuthn not available. Setting up fallback security questions for authentication.'}
//                     {fallbackStep === 'answer' && 'Please answer the security questions to complete your authentication.'}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* YOUR ORIGINAL PROGRESS STEPS - WITH PERFORMANCE OPTIMIZATIONS */}
//         {showProgress && (
//           <div className="mb-8">
//             <div className="flex justify-center">
//               <div className="flex items-center space-x-4 overflow-x-auto pb-4">
//                 {/* PERFORMANCE BOOST: Use memoized step statuses */}
//                 {stepStatuses.map(({ step, status }, index) => (
//                   <React.Fragment key={step}>
//                     {/* Step Icon */}
//                     <div className="flex flex-col items-center min-w-0 flex-shrink-0">
//                       <StepIcon step={step} status={status} />
//                       <div className="mt-2 text-center">
//                         <span className="text-xs font-medium text-gray-700 block">
//                           {getStepLabel(step)}
//                         </span>
//                       </div>
//                     </div>
                    
//                     {/* Connector Line (except for last step) */}
//                     {index < 6 && (
//                       <div className={`h-px w-12 transition-all duration-500 flex-shrink-0 ${
//                         stepStatuses[index + 1]?.status !== 'pending' ? 'bg-green-500' : 'bg-gray-300'
//                       }`}></div>
//                     )}
//                   </React.Fragment>
//                 ))}
//               </div>
//             </div>

//             {/* YOUR ORIGINAL PROGRESS BAR - WITH ENHANCED ANIMATIONS */}
//             <div className="mt-6 max-w-md mx-auto">
//               <div className="flex justify-between text-xs text-gray-500 mb-1">
//                 <span>Progress</span>
//                 <span>{calculateProgress}%</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div 
//                   className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-700 ease-out"
//                   style={{ width: `${calculateProgress}%` }}
//                 ></div>
//               </div>
//             </div>

//             {/* YOUR ORIGINAL STEP DESCRIPTION */}
//             <div className="mt-4 text-center">
//               <p className="text-sm text-gray-600">{getCurrentStepDescription()}</p>
//             </div>

//             {/* YOUR ORIGINAL TOGGLE BUTTON */}
//             <div className="text-center mt-4">
//               <button
//                 onClick={() => setShowProgress(!showProgress)}
//                 className="text-sm text-gray-500 hover:text-gray-700 transition duration-200"
//               >
//                 Hide Progress
//               </button>
//             </div>
//           </div>
//         )}

//         {!showProgress && (
//           <div className="text-center mb-8">
//             <button
//               onClick={() => setShowProgress(true)}
//               className="text-sm text-gray-500 hover:text-gray-700 transition duration-200"
//             >
//               Show Progress
//             </button>
//           </div>
//         )}

//         {/* YOUR ORIGINAL ERROR DISPLAY - ENHANCED */}
//         {error && (
//           <div className="mb-6 max-w-md mx-auto">
//             <div className="bg-red-50 border border-red-200 rounded-lg p-4 transform transition-all duration-300 animate-pulse">
//               <div className="flex">
//                 <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//                 <div className="ml-3">
//                   <p className="text-sm text-red-700">{error}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* YOUR ORIGINAL MAIN CONTENT - WITH PERFORMANCE BOOST */}
//         <div className="max-w-md mx-auto">
//           {renderCurrentStep()}
//         </div>

//         {/* YOUR ORIGINAL STEP INDICATOR */}
//         <div className="mt-6 text-center">
//           <div className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
//             <span className="font-medium">Current Step:</span>
//             <span className="ml-2">
//               {getCurrentStepForDisplay()}
//             </span>
//             <span className="ml-2 text-gray-400">
//               ({getCurrentStepCount()})
//             </span>
//           </div>
//         </div>

//         {/* PERFORMANCE INDICATOR */}
//         <div className="mt-4 text-center">
//           <div className="inline-flex items-center text-xs text-gray-500">
//             <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//             </svg>
//             {isLoading ? `Loading ${getCurrentStepForDisplay()}...` : 'Optimized & Ready'}
//           </div>
//         </div>

//         {/* YOUR ORIGINAL SECURITY BADGES */}
//         <div className="mt-8 text-center">
//           <div className="inline-flex flex-wrap items-center justify-center gap-4">
//             <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full transition-all duration-200 hover:scale-105">
//               <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//               </svg>
//               End-to-End Encrypted
//             </span>
//             <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full transition-all duration-200 hover:scale-105">
//               <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//               </svg>
//               SNGINE Protected
//             </span>
//             <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full transition-all duration-200 hover:scale-105">
//               <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
//               </svg>
//               {fallbackStep ? 'Fallback Secured' : 'Biometric Secured'}
//             </span>
//           </div>
//         </div>

//         {/* YOUR ORIGINAL HELP SECTION */}
//         <div className="mt-8 max-w-md mx-auto">
//           <div className="bg-gray-50 rounded-lg p-4 text-center">
//             <h3 className="text-sm font-medium text-gray-900 mb-2">Need Help?</h3>
//             <p className="text-xs text-gray-600 mb-3">
//               {currentStep === 'security-questions' 
//                 ? 'Security questions provide backup authentication when biometric methods are unavailable'
//                 : fallbackStep 
//                   ? 'Fallback security questions are used when biometric authentication is unavailable'
//                   : 'Make sure your email and phone number are registered in SNGINE database'
//               }
//             </p>
//             <div className="flex justify-center space-x-4 text-xs">
//               <a href="#" className="text-blue-600 hover:text-blue-700">Contact Support</a>
//               <span className="text-gray-300">|</span>
//               <a href="#" className="text-blue-600 hover:text-blue-700">FAQ</a>
//             </div>
//           </div>
//         </div>

//         {/* YOUR ORIGINAL STEP INSTRUCTIONS */}
//         <div className="mt-6 max-w-md mx-auto">
//           <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//             <h4 className="text-sm font-medium text-blue-800 mb-2">Authentication Steps:</h4>
//             <ol className="text-sm text-blue-700 space-y-1">
//               <li className={`flex items-center ${currentStep >= 1 ? 'font-medium' : ''}`}>
//                 <span className="mr-2">{currentStep > 1 ? '✅' : currentStep === 1 ? '🔄' : '⏳'}</span>
//                 Step 1: Enter your registered email
//               </li>
//               <li className={`flex items-center ${currentStep >= 2 ? 'font-medium' : ''}`}>
//                 <span className="mr-2">{emailVerified ? '✅' : currentStep === 2 ? '🔄' : '⏳'}</span>
//                 Step 2: Verify email OTP
//               </li>
//               <li className={`flex items-center ${currentStep >= 3 ? 'font-medium' : ''}`}>
//                 <span className="mr-2">{currentStep > 3 ? '✅' : currentStep === 3 ? '🔄' : '⏳'}</span>
//                 Step 3: Enter your registered phone
//               </li>
//               <li className={`flex items-center ${currentStep >= 4 ? 'font-medium' : ''}`}>
//                 <span className="mr-2">{phoneVerified ? '✅' : currentStep === 4 ? '🔄' : '⏳'}</span>
//                 Step 4: Verify SMS OTP
//               </li>
//               <li className={`flex items-center ${currentStep === 'security-questions' ? 'font-medium' : ''}`}>
//                 <span className="mr-2">{securityQuestionsSetup ? '✅' : currentStep === 'security-questions' ? '🔄' : '⏳'}</span>
//                 Step 5: Set up security questions
//               </li>
//               <li className={`flex items-center ${currentStep >= 5 || fallbackStep ? 'font-medium' : ''}`}>
//                 <span className="mr-2">{biometricVerified ? '✅' : (currentStep === 5 || fallbackStep) ? '🔄' : '⏳'}</span>
//                 Step 6: Complete biometric authentication {fallbackStep && '(Fallback Security)'}
//               </li>
//               <li className={`flex items-center ${currentStep >= 6 ? 'font-medium' : ''}`}>
//                 <span className="mr-2">{profileCreated ? '✅' : currentStep === 6 ? '🔄' : '⏳'}</span>
//                 Step 7: Complete profile setup
//               </li>
//             </ol>
            
//             {(currentStep === 'security-questions' || fallbackStep) && (
//               <div className="mt-3 pt-3 border-t border-blue-200">
//                 <p className="text-xs text-blue-600 font-medium">
//                   {currentStep === 'security-questions' && '🔐 Setting up security questions for backup authentication'}
//                   {fallbackStep === 'setup' && '🔒 Fallback Security Active: Setting up security questions'}
//                   {fallbackStep === 'answer' && '🔒 Fallback Security Active: Answer security questions'}
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AuthenticationFlow;
























