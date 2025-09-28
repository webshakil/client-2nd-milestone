import React from 'react';
import { ExclamationCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const ValidationErrors = ({ 
  errors = [], 
  warnings = [], 
  infos = [],
  className = '',
  showIcons = true,
  maxErrors = null,
  collapsible = false
}) => {
  const [isExpanded, setIsExpanded] = React.useState(true);
  
  // Normalize inputs to arrays
  const normalizedErrors = Array.isArray(errors) ? errors : [errors].filter(Boolean);
  const normalizedWarnings = Array.isArray(warnings) ? warnings : [warnings].filter(Boolean);
  const normalizedInfos = Array.isArray(infos) ? infos : [infos].filter(Boolean);
  
  // Apply max errors limit
  const displayErrors = maxErrors ? normalizedErrors.slice(0, maxErrors) : normalizedErrors;
  const hasMoreErrors = maxErrors && normalizedErrors.length > maxErrors;
  
  const totalItems = normalizedErrors.length + normalizedWarnings.length + normalizedInfos.length;
  
  if (totalItems === 0) {
    return null;
  }

  const ErrorItem = ({ type, message, icon: Icon }) => (
    <div className={`flex items-start space-x-2 ${
      type === 'error' ? 'text-red-700' : 
      type === 'warning' ? 'text-yellow-700' : 
      'text-blue-700'
    }`}>
      {showIcons && Icon && (
        <Icon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
          type === 'error' ? 'text-red-400' : 
          type === 'warning' ? 'text-yellow-400' : 
          'text-blue-400'
        }`} />
      )}
      <span className="text-sm">{message}</span>
    </div>
  );

  return (
    <div className={className}>
      {/* Errors */}
      {normalizedErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-2">
          {collapsible && normalizedErrors.length > 1 ? (
            <div>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center justify-between w-full text-left"
              >
                <span className="text-sm font-medium text-red-800">
                  {normalizedErrors.length} Error{normalizedErrors.length !== 1 ? 's' : ''}
                </span>
                <span className="text-red-600">
                  {isExpanded ? '−' : '+'}
                </span>
              </button>
              
              {isExpanded && (
                <div className="mt-2 space-y-1">
                  {displayErrors.map((error, index) => (
                    <ErrorItem 
                      key={index} 
                      type="error" 
                      message={error} 
                      icon={ExclamationCircleIcon} 
                    />
                  ))}
                  {hasMoreErrors && (
                    <div className="text-sm text-red-600 mt-2">
                      + {normalizedErrors.length - maxErrors} more error{normalizedErrors.length - maxErrors !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-1">
              {displayErrors.map((error, index) => (
                <ErrorItem 
                  key={index} 
                  type="error" 
                  message={error} 
                  icon={ExclamationCircleIcon} 
                />
              ))}
              {hasMoreErrors && (
                <div className="text-sm text-red-600 mt-2">
                  + {normalizedErrors.length - maxErrors} more error{normalizedErrors.length - maxErrors !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Warnings */}
      {normalizedWarnings.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-2">
          <div className="space-y-1">
            {normalizedWarnings.map((warning, index) => (
              <ErrorItem 
                key={index} 
                type="warning" 
                message={warning} 
                icon={ExclamationTriangleIcon} 
              />
            ))}
          </div>
        </div>
      )}

      {/* Info Messages */}
      {normalizedInfos.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <div className="space-y-1">
            {normalizedInfos.map((info, index) => (
              <ErrorItem 
                key={index} 
                type="info" 
                message={info} 
                icon={InformationCircleIcon} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ValidationErrors;