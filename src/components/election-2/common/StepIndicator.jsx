import React from 'react';
import { CheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';

const StepIndicator = ({ 
  steps, 
  currentStep, 
  onStepClick, 
  errors = {},
  className = "" 
}) => {
  const getStepStatus = (step) => {
    const stepNumber = step.id;
    
    // Check if step has errors - only check if errors object has actual error content
    const stepErrors = errors[stepNumber];
    const hasErrors = stepErrors && 
      typeof stepErrors === 'object' && 
      Object.keys(stepErrors).length > 0 &&
      Object.values(stepErrors).some(error => error && error !== '');
    
    if (hasErrors) {
      return 'error';
    }
    
    if (stepNumber < currentStep) {
      return 'completed';
    } else if (stepNumber === currentStep) {
      return 'current';
    } else {
      return 'upcoming';
    }
  };

  const getStepClasses = (step) => {
    const status = getStepStatus(step);
    const baseClasses = "relative flex items-center justify-center w-10 h-10 rounded-full border-2 text-sm font-medium transition-all duration-200";
    
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-blue-600 border-blue-600 text-white hover:bg-blue-700 cursor-pointer`;
      case 'current':
        return `${baseClasses} bg-blue-600 border-blue-600 text-white ring-4 ring-blue-100`;
      case 'error':
        return `${baseClasses} bg-red-100 border-red-300 text-red-600 hover:bg-red-200 cursor-pointer`;
      case 'upcoming':
      default:
        return `${baseClasses} bg-white border-gray-300 text-gray-500 hover:border-gray-400 cursor-pointer`;
    }
  };

  const getConnectorClasses = (step, index) => {
    if (index === steps.length - 1) return "hidden";
    
    const nextStepStatus = getStepStatus(steps[index + 1]);
    const currentStepStatus = getStepStatus(step);
    
    if (currentStepStatus === 'completed' || nextStepStatus === 'completed' || nextStepStatus === 'current') {
      return "flex-1 h-0.5 bg-blue-600 mx-4";
    } else {
      return "flex-1 h-0.5 bg-gray-300 mx-4";
    }
  };

  const handleStepClick = (step) => {
    const stepNumber = step.id;
    
    // Allow clicking on completed steps, current step, or next step
    if (stepNumber <= currentStep || stepNumber === currentStep + 1) {
      onStepClick?.(stepNumber);
    }
  };

  const getStepIcon = (step) => {
    const status = getStepStatus(step);
    
    switch (status) {
      case 'completed':
        return <CheckIcon className="w-6 h-6" />;
      case 'error':
        return <ExclamationTriangleIcon className="w-5 h-5" />;
      case 'current':
      case 'upcoming':
      default:
        return step.id;
    }
  };

  // Get actual errors for display - only show real errors
  const getDisplayErrors = () => {
    const realErrors = [];
    
    Object.entries(errors).forEach(([key, error]) => {
      if (error && typeof error === 'object' && Object.keys(error).length > 0) {
        // It's a step errors object
        /*eslint-disable*/
        Object.entries(error).forEach(([fieldKey, fieldError]) => {
          if (fieldError && fieldError !== '') {
            realErrors.push(`Step ${key}: ${fieldError}`);
          }
        });
      } else if (error && typeof error === 'string' && error !== '') {
        // It's a direct error message
        realErrors.push(error);
      }
    });
    
    return realErrors;
  };

  const displayErrors = getDisplayErrors();

  return (
    <div className={`w-full ${className}`}>
      {/* Desktop Step Indicator */}
      <div className="hidden sm:block">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => handleStepClick(step)}
                  className={getStepClasses(step)}
                  disabled={step.id > currentStep + 1}
                  title={`${step.name}: ${step.description}`}
                >
                  {getStepIcon(step)}
                </button>
                
                {/* Step Label */}
                <div className="mt-3 text-center">
                  <div className={`text-sm font-medium ${
                    getStepStatus(step) === 'current' 
                      ? 'text-blue-600' 
                      : getStepStatus(step) === 'error'
                      ? 'text-red-600'
                      : getStepStatus(step) === 'completed'
                      ? 'text-gray-900'
                      : 'text-gray-500'
                  }`}>
                    {step.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 max-w-24 truncate">
                    {step.description}
                  </div>
                </div>
              </div>
              
              {/* Connector Line */}
              <div className={getConnectorClasses(step, index)} />
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Mobile Step Indicator */}
      <div className="block sm:hidden">
        <div className="flex items-center justify-center space-x-2 mb-4">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => handleStepClick(step)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                getStepStatus(step) === 'completed'
                  ? 'bg-blue-600'
                  : getStepStatus(step) === 'current'
                  ? 'bg-blue-600 ring-2 ring-blue-200'
                  : getStepStatus(step) === 'error'
                  ? 'bg-red-400'
                  : 'bg-gray-300'
              }`}
              disabled={step.id > currentStep + 1}
            />
          ))}
        </div>
        
        {/* Current Step Info */}
        <div className="text-center">
          <div className="text-lg font-medium text-gray-900">
            Step {currentStep}: {steps.find(s => s.id === currentStep)?.name}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {steps.find(s => s.id === currentStep)?.description}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>Start</span>
          <span>{Math.round(((currentStep - 1) / (steps.length - 1)) * 100)}% Complete</span>
          <span>Finish</span>
        </div>
      </div>

      {/* Error Summary - Only show if there are actual errors */}
      {displayErrors.length > 0 && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-3">
          <div className="flex">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Please fix the following issues:
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className="list-disc list-inside space-y-1">
                  {displayErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Debug Section - Remove after testing */}
      {/* <div className="mt-4 bg-gray-100 p-3 rounded text-xs">
        <h4 className="font-semibold mb-2">Debug - Errors Object:</h4>
        <pre>{JSON.stringify(errors, null, 2)}</pre>
      </div> */}
    </div>
  );
};

export default StepIndicator;
