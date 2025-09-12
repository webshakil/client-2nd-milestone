import { useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { SecurityUtils } from '../../utils/security';
import { b64ToBytes, isBiometricSupported, getDeviceInfo, getCapabilities, getLocation, getBiometricData } from '../utils/biometricUtils';

export const useAuthActions = (state, dispatch, api3001, api3002, api3003, getUserId, generateDeviceFingerprint) => {
  // STEP 1: Send email OTP
  const sendEmailOTP = useCallback(async (email) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      if (!SecurityUtils.isValidEmail(email)) {
        throw new Error('Invalid email format');
      }

      const response = await api3001('/api/auth/send-email-otp', {
        body: {
          email: SecurityUtils.sanitizeInput(email),
          referrer: document.referrer,
          timestamp: Date.now()
        }
      });

      if (response?.success) {
        dispatch({ type: 'SET_EMAIL', payload: email });
        dispatch({ type: 'SET_OTP_SENT', payload: true });
        dispatch({ type: 'SET_STEP', payload: 2 });
        toast.success('OTP sent to your email successfully');
        return response;
      }
      throw new Error(response?.message || 'Failed to send email OTP');
    } catch (error) {
      const errorMessage = error.message || 'Failed to send email OTP';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [api3001, dispatch]);

  // STEP 2: Verify email OTP
  const verifyEmailOTP = useCallback(async (otp) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      if (!otp || otp.length !== 6) throw new Error('Invalid OTP format');

      const response = await api3001('/api/auth/verify-email-otp', {
        body: {
          otp: SecurityUtils.sanitizeInput(otp),
          referrer: document.referrer,
          timestamp: Date.now()
        }
      });

      if (response?.success) {
        dispatch({ type: 'SET_EMAIL_VERIFIED', payload: true });
        dispatch({ type: 'SET_STEP', payload: 3 });
        toast.success('Email verified successfully');
        return response;
      }
      throw new Error(response?.message || 'Invalid email OTP');
    } catch (error) {
      const errorMessage = error.message || 'Invalid email OTP';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [api3001, dispatch]);

  // STEP 3: Send phone OTP
  const sendPhoneOTP = useCallback(async (phone) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
  
      let cleanPhone = phone.trim();
      if (!cleanPhone.startsWith('+') && /^\d/.test(cleanPhone)) cleanPhone = '+' + cleanPhone;
      if (cleanPhone.startsWith('+')) cleanPhone = '+' + cleanPhone.substring(1).replace(/\D/g, '');
  
      if (!SecurityUtils.isValidPhone(cleanPhone)) {
        throw new Error('Invalid phone number format');
      }
  
      const response = await api3001('/api/auth/send-sms-otp', {
        body: {
          phone: cleanPhone,
          referrer: document.referrer,
          timestamp: Date.now()
        }
      });
  
      // Always proceed even if SMS sending failed
      dispatch({ type: 'SET_PHONE', payload: cleanPhone });
      dispatch({ type: 'SET_OTP_SENT', payload: true });
      dispatch({ type: 'SET_STEP', payload: 4 });
  
      if (response?.success) {
        toast.success('OTP sent to your phone successfully');
      } else {
        toast.error('SMS OTP sending failed, proceeding anyway');
      }
  
      return response;
    } catch (error) {
      console.warn('SMS sending failed, proceeding anyway:', error);
      dispatch({ type: 'SET_PHONE', payload: phone });
      dispatch({ type: 'SET_OTP_SENT', payload: true });
      dispatch({ type: 'SET_STEP', payload: 4 });
      toast.error('SMS OTP failed, but you can continue');
      return { success: false, message: 'SMS failed, proceeding anyway' };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [api3001, dispatch]);

  // STEP 4: Verify phone OTP
  const verifyPhoneOTP = useCallback(async (otp) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
  
      if (!otp || otp.length !== 6) throw new Error('Invalid OTP format');
  
      const response = await api3001('/api/auth/verify-sms-otp', {
        body: {
          otp: SecurityUtils.sanitizeInput(otp),
          referrer: document.referrer,
          timestamp: Date.now()
        }
      });
  
      // Always proceed
      dispatch({ type: 'SET_PHONE_VERIFIED', payload: true });
      dispatch({ type: 'SET_STEP', payload: 'security-questions' });
  
      if (response?.success) {
        toast.success('Phone verified successfully');
      } else {
        toast.error('SMS OTP verification failed, proceeding anyway');
      }
  
      return response;
    } catch (error) {
      console.warn('SMS OTP verification failed, proceeding anyway:', error);
      dispatch({ type: 'SET_PHONE_VERIFIED', payload: true });
      dispatch({ type: 'SET_STEP', payload: 'security-questions' });
      toast.error('SMS OTP failed, but you can continue');
      return { success: false, message: 'SMS OTP failed, proceeding anyway' };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [api3001, dispatch]);

  // STEP 5: Save security questions
  const saveSecurityQuestions = useCallback(async (questionsAndAnswers) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      if (!questionsAndAnswers || !Array.isArray(questionsAndAnswers) || questionsAndAnswers.length < 3) {
        throw new Error('Please provide exactly 3 security questions and answers');
      }

      for (const qa of questionsAndAnswers) {
        if (!qa.question || !qa.answer || qa.question.trim() === '' || qa.answer.trim() === '') {
          throw new Error('All questions and answers must be filled');
        }
        if (qa.answer.trim().length < 2) {
          throw new Error('All answers must be at least 2 characters long');
        }
      }

      const questionTexts = questionsAndAnswers.map(q => q.question.trim().toLowerCase());
      const uniqueQuestions = [...new Set(questionTexts)];
      if (uniqueQuestions.length !== questionsAndAnswers.length) {
        throw new Error('Please ensure all security questions are different');
      }

      let userId = state.userId;
      if (!userId) {
        userId = await getUserId();
        if (!userId) throw new Error('Failed to get user ID');
      }

      for (const qa of questionsAndAnswers) {
        const questionResponse = await api3003(`/api/biometric/add-question/${userId}`, {
          method: 'POST',
          body: {
            question: qa.question.trim(),
            answer: qa.answer.trim()
          }
        });

        if (!questionResponse?.success) {
          throw new Error(questionResponse?.message || `Failed to add security question: ${qa.question}`);
        }
      }

      dispatch({ type: 'SET_COLLECTED_QUESTIONS', payload: questionsAndAnswers });
      dispatch({ type: 'SET_SECURITY_QUESTIONS_SETUP', payload: true });
      
      toast.success('Security questions saved successfully!');
      return { success: true };

    } catch (error) {
      console.error('Save security questions error:', error);
      const errorMessage = error?.message || 'Failed to save security questions';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.userId, getUserId, api3003, dispatch]);

  // STEP 6: Complete Authentication
  const completeAuthentication = useCallback(async () => {
    let loadingStateCleared = false;
    
    const clearLoadingState = () => {
      if (!loadingStateCleared) {
        dispatch({ type: 'SET_LOADING', payload: false });
        loadingStateCleared = true;
      }
    };

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      if (!state.emailVerified || !state.phoneVerified) {
        throw new Error('Email and phone verification must be completed first');
      }

      if (!state.securityQuestionsSetup) {
        throw new Error('Security questions must be setup first');
      }

      let userId = state.userId;
      if (!userId) {
        userId = await getUserId();
        if (!userId) throw new Error('Failed to get user ID');
      }

      let biometricSuccess = false;

      const biometricSupported = await isBiometricSupported();

      if (biometricSupported) {
        try {
          const deviceFingerprint = await generateDeviceFingerprint();
          const deviceInfo = getDeviceInfo();
          const capabilities = getCapabilities();
          const location = getLocation();

          const deviceResponse = await api3002('/api/biometric/device/register', {
            body: { 
              sngine_email: state.email, 
              sngine_phone: state.phone, 
              deviceInfo, 
              location, 
              capabilities, 
              referrer: document.referrer, 
              timestamp: Date.now() 
            }
          });

          if (deviceResponse?.success && deviceResponse?.device?.id) {
            const deviceId = deviceResponse.device.id;
            const biometricData = getBiometricData();
            biometricData.deviceFingerprint = deviceFingerprint;

            const biometricResponse = await api3002('/api/biometric/register', {
              body: { 
                sngine_email: state.email, 
                sngine_phone: state.phone, 
                deviceId, 
                biometricType: 'device_fingerprint', 
                biometricData, 
                referrer: document.referrer, 
                timestamp: Date.now() 
              }
            });

            if (biometricResponse?.success) {
              const begin = await api3002('/api/biometric/webauthn/register/begin', {
                body: { 
                  sngine_email: state.email, 
                  sngine_phone: state.phone, 
                  deviceId, 
                  referrer: document.referrer, 
                  timestamp: Date.now() 
                }
              });

              if (begin?.success && begin?.options) {
                const publicKey = { 
                  ...begin.options, 
                  challenge: b64ToBytes(begin.options.challenge), 
                  user: { ...begin.options.user, id: b64ToBytes(begin.options.user.id) } 
                };
                const credential = await navigator.credentials.create({ publicKey });

                if (credential) {
                  const attestationObject = new Uint8Array(credential.response.attestationObject || []);
                  const clientDataJSON = new Uint8Array(credential.response.clientDataJSON || []);

                  const finish = await api3002('/api/biometric/webauthn/register/finish', {
                    body: { 
                      sngine_email: state.email, 
                      sngine_phone: state.phone, 
                      deviceId, 
                      credential: { 
                        id: credential.id, 
                        rawId: Array.from(new Uint8Array(credential.rawId)), 
                        response: { 
                          attestationObject: Array.from(attestationObject), 
                          clientDataJSON: Array.from(clientDataJSON) 
                        }, 
                        type: credential.type 
                      }, 
                      referrer: document.referrer, 
                      timestamp: Date.now() 
                    }
                  });

                  if (finish?.success) {
                    biometricSuccess = true;
                  }
                }
              }
            }
          }
        } catch (biometricError) {
          console.warn('Biometric authentication failed, continuing with fallback setup:', biometricError);
        }
      } else {
        console.log('Biometric not supported on this device');
      }

      console.log('Setting up mandatory fallback security...');
      
      const keysResponse = await api3003(`/api/biometric/register-keys/${userId}`, {
        method: 'POST'
      });

      if (!keysResponse?.success) {
        throw new Error(keysResponse?.message || 'Failed to register cryptographic keys');
      }

      dispatch({ type: 'SET_BIOMETRIC_KEYS', payload: keysResponse.keys });

      const questionsResponse = await api3003(`/api/biometric/questions/${userId}`, {
        method: 'GET'
      });

      if (questionsResponse?.success && questionsResponse?.questions) {
        const questions = questionsResponse.questions.map(q => q.question);
        dispatch({ type: 'SET_FALLBACK_QUESTIONS', payload: questions });
      }

      dispatch({ type: 'SET_FALLBACK_SETUP_COMPLETE', payload: true });
      dispatch({ type: 'SET_BIOMETRIC_VERIFIED', payload: true });
      dispatch({ type: 'SET_STEP', payload: 6 });

      const successMessage = biometricSuccess 
        ? 'Biometric authentication and fallback security setup completed successfully!'
        : 'Fallback security setup completed successfully!';
      
      clearLoadingState(); // Clear loading before showing success message
      toast.success(successMessage);

      return { 
        success: true, 
        biometricSuccess, 
        fallbackSetup: true, 
        message: successMessage 
      };

    } catch (error) {
      console.error('Complete authentication error:', error);
      const errorMessage = error?.message || 'Authentication failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      clearLoadingState(); // Clear loading before showing error
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      clearLoadingState(); // Ensure loading is cleared in all cases
    }
  }, [state.email, state.phone, state.emailVerified, state.phoneVerified, state.userId, state.securityQuestionsSetup, generateDeviceFingerprint, getUserId, api3002, api3003, dispatch]);

  // Get fallback questions
  const getFallbackQuestions = useCallback(async () => {
    try {
      let userId = state.userId;
      if (!userId) {
        userId = await getUserId();
        if (!userId) throw new Error('Failed to get user ID');
      }

      const questionsResponse = await api3003(`/api/biometric/questions/${userId}`, {
        method: 'GET'
      });

      if (questionsResponse?.success && questionsResponse?.questions) {
        const questions = questionsResponse.questions.map(q => q.question);
        dispatch({ type: 'SET_FALLBACK_QUESTIONS', payload: questions });
        return questions;
      }

      return [];
    } catch (error) {
      console.error('Get fallback questions error:', error);
      return [];
    }
  }, [state.userId, getUserId, api3003, dispatch]);

  return {
    sendEmailOTP,
    verifyEmailOTP,
    sendPhoneOTP,
    verifyPhoneOTP,
    saveSecurityQuestions,
    completeAuthentication,
    getFallbackQuestions
  };
};