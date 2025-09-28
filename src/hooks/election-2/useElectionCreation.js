import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';


const initialElectionData = {
  // Basic Information
  title: '',
  description: '',
  topicImageUrl: '',
  topicVideoUrl: '',
  logoBrandingUrl: '',
  
  // Scheduling
  startDate: '',
  startTime: '09:00',
  endDate: '',
  endTime: '18:00',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
  
  // Voting Configuration
  votingType: 'plurality',
  permissionToVote: 'world_citizens',
  isPaid: false,
  participationFee: 0,
  
  // Country Selection
  isCountrySpecific: false,
  countries: [],
  
  // Access Control
  biometricRequired: false,
  authMethod: 'passkey',
  allowOauth: true,
  allowMagicLink: true,
  allowEmailPassword: true,
  
  // Lottery Settings
  isLotterized: false,
  rewardAmount: 0,
  winnerCount: 1,
  
  // Results Control
  showLiveResults: false,
  allowVoteEditing: false,
  
  // Branding
  customVotingUrl: '',
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
  
  // Questions
  questions: []
};

export const useElectionCreation = (initialData = {}) => {
  // State management
  const [electionData, setElectionData] = useState({
    ...initialElectionData,
    ...initialData
  });

  const [errors, setErrors] = useState({});
  const [warnings, setWarnings] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [validationMode, setValidationMode] = useState('onChange'); // 'onChange', 'onBlur', 'onSubmit'

  // Auto-save functionality
  const autoSaveTimer = useRef(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  // Update election data with validation
  const updateElectionData = useCallback((updates, skipValidation = false) => {
    setElectionData(prev => {
      const newData = { ...prev, ...updates };
      
      // Mark as dirty
      setIsDirty(true);
      
      // Validate if not skipped
      if (!skipValidation && validationMode === 'onChange') {
        validateFields(Object.keys(updates), newData);
      }
      
      // Auto-save trigger
      if (autoSaveEnabled) {
        clearTimeout(autoSaveTimer.current);
        autoSaveTimer.current = setTimeout(() => {
          performAutoSave(newData);
        }, 2000); // 2 second delay
      }
      
      return newData;
    });
  }, [validationMode, autoSaveEnabled]);

  // Batch update for better performance
  const batchUpdateElectionData = useCallback((updatesArray) => {
    setElectionData(prev => {
      let newData = { ...prev };
      updatesArray.forEach(update => {
        newData = { ...newData, ...update };
      });
      
      setIsDirty(true);
      
      if (validationMode === 'onChange') {
        const allFields = updatesArray.flatMap(update => Object.keys(update));
        validateFields(allFields, newData);
      }
      
      return newData;
    });
  }, [validationMode]);

  // Reset form to initial state
  const resetForm = useCallback((newInitialData = {}) => {
    const resetData = { ...initialElectionData, ...initialData, ...newInitialData };
    setElectionData(resetData);
    setErrors({});
    setWarnings({});
    setIsDirty(false);
    setCurrentStep(1);
    setLastSaved(null);
    clearTimeout(autoSaveTimer.current);
  }, [initialData]);

  // Comprehensive field validation
  const validateField = useCallback((field, value, allData = electionData) => {
    const fieldErrors = {};
    const fieldWarnings = {};

    switch (field) {
      case 'title':
        if (!value || value.trim().length === 0) {
          fieldErrors.title = 'Title is required';
        } else if (value.length < 3) {
          fieldErrors.title = 'Title must be at least 3 characters';
        } else if (value.length > 500) {
          fieldErrors.title = 'Title cannot exceed 500 characters';
        } else if (value.length < 10) {
          fieldWarnings.title = 'Consider adding more detail to your title';
        }
        break;

      case 'description':
        if (value && value.length > 5000) {
          fieldErrors.description = 'Description cannot exceed 5000 characters';
        } else if (value && value.length < 20) {
          fieldWarnings.description = 'Consider adding more detail to help voters understand the election';
        }
        break;

      case 'startDate':
        if (!value) {
          fieldErrors.startDate = 'Start date is required ';
        } else {
          const startDateTime = new Date(`${value}T${allData.startTime}`);
          const now = new Date();
          const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
          
          if (startDateTime <= now) {
            fieldErrors.startDate = 'Start date/time must be in the future';
          } else if (startDateTime < oneHourFromNow) {
            fieldWarnings.startDate = 'Starting very soon - ensure you have enough time to set up';
          }
        }
        break;

      case 'endDate':
        if (!value) {
          fieldErrors.endDate = 'End date is required';
        } else if (allData.startDate) {
          const startDateTime = new Date(`${allData.startDate}T${allData.startTime}`);
          const endDateTime = new Date(`${value}T${allData.endTime}`);
          const duration = endDateTime - startDateTime;
          const hoursDuration = duration / (1000 * 60 * 60);
          
          if (endDateTime <= startDateTime) {
            fieldErrors.endDate = 'End date/time must be after start date/time';
          } else if (hoursDuration < 1) {
            fieldErrors.endDate = 'Election must run for at least 1 hour';
          } else if (hoursDuration > 8760) { // 365 days
            fieldErrors.endDate = 'Election cannot run longer than 1 year';
          } else if (hoursDuration < 24) {
            fieldWarnings.endDate = 'Short election duration - consider extending for better participation';
          }
        }
        break;

      case 'participationFee':
        if (allData.isPaid) {
          if (!value || value <= 0) {
            fieldErrors.participationFee = 'Participation fee must be greater than 0 for paid elections';
          } else if (value > 1000) {
            fieldWarnings.participationFee = 'High participation fee may reduce voter turnout';
          }
        }
        break;

      case 'rewardAmount':
        if (allData.isLotterized) {
          if (!value || value <= 0) {
            fieldErrors.rewardAmount = 'Reward amount must be greater than 0 for lottery elections';
          } else if (value > 1000000) {
            fieldErrors.rewardAmount = 'Reward amount cannot exceed $1,000,000';
          }
        }
        break;

      case 'winnerCount':
        if (allData.isLotterized) {
          if (!value || value < 1 || value > 100) {
            fieldErrors.winnerCount = 'Winner count must be between 1 and 100';
          } else if (value > 50) {
            fieldWarnings.winnerCount = 'Many winners may dilute individual prizes';
          }
        }
        break;

      case 'countries':
        if (allData.permissionToVote === 'country_specific') {
          if (!value || value.length === 0) {
            fieldErrors.countries = 'At least one country must be selected for country-specific elections';
          } else if (value.length > 50) {
            fieldWarnings.countries = 'Many countries selected - consider using regional restrictions instead';
          }
        }
        break;

      case 'customVotingUrl':
        if (value) {
          if (value.length < 3) {
            fieldErrors.customVotingUrl = 'Custom URL must be at least 3 characters';
          } else if (value.length > 200) {
            fieldErrors.customVotingUrl = 'Custom URL cannot exceed 200 characters';
          } else if (!/^[a-zA-Z0-9-_]+$/.test(value)) {
            fieldErrors.customVotingUrl = 'Custom URL can only contain letters, numbers, hyphens, and underscores';
          } else if (/^[-_]|[-_]$/.test(value)) {
            fieldErrors.customVotingUrl = 'Custom URL cannot start or end with hyphens or underscores';
          }
        }
        break;

      case 'questions':
        if (!value || value.length === 0) {
          fieldWarnings.questions = 'Consider adding questions to make your election more comprehensive';
        } else {
          value.forEach((question, index) => {
            if (!question.questionText?.trim()) {
              fieldErrors[`question_${index}_text`] = `Question ${index + 1} text is required`;
            }
            if (question.questionFormat === 'multiple_choice' && (!question.answerChoices || question.answerChoices.length < 2)) {
              fieldErrors[`question_${index}_choices`] = `Question ${index + 1} needs at least 2 answer choices`;
            }
          });
        }
        break;

      default:
        break;
    }

    return { errors: fieldErrors, warnings: fieldWarnings };
  }, [electionData]);

  // Validate multiple fields
  const validateFields = useCallback((fields, data = electionData) => {
    let allErrors = { ...errors };
    let allWarnings = { ...warnings };

    fields.forEach(field => {
      const { errors: fieldErrors, warnings: fieldWarnings } = validateField(field, data[field], data);
      
      // Remove existing errors/warnings for this field
      Object.keys(allErrors).forEach(key => {
        if (key === field || key.startsWith(`${field}_`)) {
          delete allErrors[key];
        }
      });
      Object.keys(allWarnings).forEach(key => {
        if (key === field || key.startsWith(`${field}_`)) {
          delete allWarnings[key];
        }
      });
      
      // Add new errors/warnings
      allErrors = { ...allErrors, ...fieldErrors };
      allWarnings = { ...allWarnings, ...fieldWarnings };
    });

    setErrors(allErrors);
    setWarnings(allWarnings);

    return { errors: allErrors, warnings: allWarnings };
  }, [errors, warnings, validateField, electionData]);

  // Validate entire form
  const validateForm = useCallback(() => {
    const allFields = [
      'title', 'description', 'startDate', 'endDate', 'participationFee',
      'rewardAmount', 'winnerCount', 'countries', 'customVotingUrl', 'questions'
    ];
/*eslint-disable*/
    const { errors: formErrors, warnings: formWarnings } = validateFields(allFields);

    // Additional cross-field validations
    const crossFieldErrors = {};

    // Check date consistency
    if (electionData.startDate && electionData.endDate) {
      const start = new Date(`${electionData.startDate}T${electionData.startTime}`);
      const end = new Date(`${electionData.endDate}T${electionData.endTime}`);
      
      if (end <= start) {
        crossFieldErrors.dateConsistency = 'End date/time must be after start date/time';
      }
    }

    // Check lottery configuration
    if (electionData.isLotterized && electionData.isPaid) {
      const totalReward = electionData.rewardAmount * electionData.winnerCount;
      if (totalReward > electionData.participationFee * 1000) { // Assuming max 1000 participants
        crossFieldErrors.lotteryEconomics = 'Lottery rewards may exceed potential revenue';
      }
    }

    const finalErrors = { ...formErrors, ...crossFieldErrors };
    setErrors(finalErrors);

    return Object.keys(finalErrors).length === 0;
  }, [validateFields, electionData]);

  // Step-specific validation
  const validateStep = useCallback((step) => {
    const stepFields = {
      1: ['title', 'description', 'startDate', 'endDate'],
      2: ['votingType', 'permissionToVote', 'participationFee'],
      3: ['countries'],
      4: ['authMethod', 'biometricRequired'],
      5: ['customVotingUrl', 'rewardAmount', 'winnerCount'],
      6: ['questions']
    };

    const fieldsToValidate = stepFields[step] || [];
    const { errors: stepErrors } = validateFields(fieldsToValidate);

    return Object.keys(stepErrors).length === 0;
  }, [validateFields]);

  // Auto-save functionality
  const performAutoSave = useCallback(async (dataToSave) => {
    if (!dataToSave.title || !autoSaveEnabled) return;

    try {
      setIsAutoSaving(true);
      
      // Save to localStorage as backup
      const autoSaveData = {
        data: dataToSave,
        timestamp: new Date().toISOString(),
        version: '1.0'
      };
      
      localStorage.setItem('election_autosave', JSON.stringify(autoSaveData));
      setLastSaved(new Date());
      
    } catch (error) {
      console.warn('Auto-save failed:', error);
    } finally {
      setIsAutoSaving(false);
    }
  }, [autoSaveEnabled]);

  // Load from auto-save
  const loadFromAutoSave = useCallback(() => {
    try {
      const saved = localStorage.getItem('election_autosave');
      if (saved) {
        const autoSaveData = JSON.parse(saved);
        const savedTime = new Date(autoSaveData.timestamp);
        const hoursSince = (new Date() - savedTime) / (1000 * 60 * 60);
        
        if (hoursSince < 24) { // Only load if less than 24 hours old
          return {
            data: autoSaveData.data,
            timestamp: savedTime,
            isRecent: hoursSince < 1
          };
        }
      }
    } catch (error) {
      console.warn('Failed to load auto-save:', error);
    }
    return null;
  }, []);

  // Clear auto-save
  const clearAutoSave = useCallback(() => {
    localStorage.removeItem('election_autosave');
    setLastSaved(null);
  }, []);

  // Form completion percentage
  const completionPercentage = useMemo(() => {
    const requiredFields = ['title', 'startDate', 'endDate'];
    const importantFields = ['description', 'votingType', 'permissionToVote'];
    const optionalFields = ['topicImageUrl', 'customVotingUrl', 'questions'];
    
    const requiredCompleted = requiredFields.filter(field => 
      electionData[field] && electionData[field].toString().trim()
    ).length;
    
    const importantCompleted = importantFields.filter(field => 
      electionData[field] && electionData[field].toString().trim()
    ).length;
    
    const optionalCompleted = optionalFields.filter(field => {
      if (field === 'questions') {
        return electionData[field] && electionData[field].length > 0;
      }
      return electionData[field] && electionData[field].toString().trim();
    }).length;

    const totalRequired = requiredFields.length;
    const totalImportant = importantFields.length;
    const totalOptional = optionalFields.length;
    
    // Weighted calculation: Required 60%, Important 30%, Optional 10%
    const requiredScore = (requiredCompleted / totalRequired) * 0.6;
    const importantScore = (importantCompleted / totalImportant) * 0.3;
    const optionalScore = (optionalCompleted / totalOptional) * 0.1;
    
    return Math.round((requiredScore + importantScore + optionalScore) * 100);
  }, [electionData]);

  // Ready for publish check
  const isReadyForPublish = useMemo(() => {
    const hasRequiredFields = electionData.title && electionData.startDate && electionData.endDate;
    const hasValidDates = (() => {
      if (!electionData.startDate || !electionData.endDate) return false;
      const start = new Date(`${electionData.startDate}T${electionData.startTime}`);
      const end = new Date(`${electionData.endDate}T${electionData.endTime}`);
      return start > new Date() && end > start;
    })();
    
    const hasNoErrors = Object.keys(errors).length === 0;
    const hasValidConfig = (() => {
      if (electionData.permissionToVote === 'country_specific' && electionData.countries.length === 0) return false;
      if (electionData.isPaid && (!electionData.participationFee || electionData.participationFee <= 0)) return false;
      if (electionData.isLotterized && (!electionData.rewardAmount || electionData.rewardAmount <= 0)) return false;
      return true;
    })();

    return hasRequiredFields && hasValidDates && hasNoErrors && hasValidConfig;
  }, [electionData, errors]);

  // Form summary for preview
  const getFormSummary = useCallback(() => {
    return {
      basicInfo: {
        title: electionData.title,
        description: electionData.description,
        hasMedia: !!(electionData.topicImageUrl || electionData.topicVideoUrl || electionData.logoBrandingUrl),
        duration: (() => {
          if (!electionData.startDate || !electionData.endDate) return null;
          const start = new Date(`${electionData.startDate}T${electionData.startTime}`);
          const end = new Date(`${electionData.endDate}T${electionData.endTime}`);
          return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        })()
      },
      configuration: {
        votingType: electionData.votingType,
        permissionType: electionData.permissionToVote,
        countryCount: electionData.countries.length,
        isPaid: electionData.isPaid,
        participationFee: electionData.participationFee,
        isLotterized: electionData.isLotterized,
        rewardAmount: electionData.rewardAmount,
        winnerCount: electionData.winnerCount,
        biometricRequired: electionData.biometricRequired
      },
      content: {
        questionCount: electionData.questions?.length || 0,
        hasCustomBranding: !!(electionData.customCss || electionData.customVotingUrl),
        supportsMultilang: electionData.supportsMultilang
      },
      status: {
        completionPercentage,
        isReadyForPublish,
        hasErrors: Object.keys(errors).length > 0,
        hasWarnings: Object.keys(warnings).length > 0,
        lastSaved
      }
    };
  }, [electionData, completionPercentage, isReadyForPublish, errors, warnings, lastSaved]);

  // Step navigation
  const goToStep = useCallback((step) => {
    if (step >= 1 && step <= 6) {
      setCurrentStep(step);
    }
  }, []);

  const nextStep = useCallback(() => {
    if (validateStep(currentStep) && currentStep < 6) {
      setCurrentStep(prev => prev + 1);
    } else if (!validateStep(currentStep)) {
      toast.error('Please fix the errors in this step before continuing');
    }
  }, [currentStep, validateStep]);

  const previousStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  // Generate URL suggestions
  const generateUrlSuggestions = useCallback(() => {
    if (!electionData.title) return [];
    
    const baseSlug = electionData.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 40);

    const currentYear = new Date().getFullYear();
    const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');

    return [
      baseSlug,
      `${baseSlug}-${currentYear}`,
      `${baseSlug}-${currentYear}-${currentMonth}`,
      `${baseSlug}-election`,
      `${baseSlug}-vote`,
      `vote-${baseSlug}`
    ].filter(Boolean);
  }, [electionData.title]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimeout(autoSaveTimer.current);
    };
  }, []);

  return {
    // Data
    electionData,
    errors,
    warnings,
    isDirty,
    isSubmitting,
    isAutoSaving,
    lastSaved,
    currentStep,
    completionPercentage,
    isReadyForPublish,

    // Computed values
    hasErrors: Object.keys(errors).length > 0,
    hasWarnings: Object.keys(warnings).length > 0,
    isValid: Object.keys(errors).length === 0 && isReadyForPublish,

    // Actions
    updateElectionData,
    batchUpdateElectionData,
    resetForm,
    validateField,
    validateFields,
    validateForm,
    validateStep,

    // Step navigation
    goToStep,
    nextStep,
    previousStep,

    // Auto-save
    setAutoSaveEnabled,
    autoSaveEnabled,
    loadFromAutoSave,
    clearAutoSave,

    // Utilities
    getFormSummary,
    generateUrlSuggestions,

    // Settings
    validationMode,
    setValidationMode,
    setIsSubmitting
  };
};

export default useElectionCreation;