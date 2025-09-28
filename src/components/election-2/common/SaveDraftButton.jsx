import React from 'react';
import { DocumentTextIcon, CheckIcon } from '@heroicons/react/24/outline';

const SaveDraftButton = ({ 
  onClick, 
  isSaving = false, 
  lastSaved = null,
  disabled = false,
  className = '',
  size = 'medium',
  showLastSaved = true
}) => {
  const sizeClasses = {
    small: 'px-3 py-1 text-xs',
    medium: 'px-4 py-2 text-sm',
    large: 'px-6 py-3 text-base'
  };

  const iconSizeClasses = {
    small: 'h-3 w-3',
    medium: 'h-4 w-4', 
    large: 'h-5 w-5'
  };

  const formatLastSaved = (timestamp) => {
    if (!timestamp) return '';
    
    const now = new Date();
    const saved = new Date(timestamp);
    const diffMs = now - saved;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffSecs < 60) {
      return 'Saved just now';
    } else if (diffMins < 60) {
      return `Saved ${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `Saved ${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
      return `Saved on ${saved.toLocaleDateString()}`;
    }
  };

  return (
    <div className="flex flex-col items-start">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled || isSaving}
        className={`
          inline-flex items-center border border-gray-300 rounded-md shadow-sm font-medium 
          text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 
          focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 
          disabled:cursor-not-allowed transition-all duration-200
          ${sizeClasses[size]} ${className}
        `}
      >
        {isSaving ? (
          <>
            <svg 
              className={`${iconSizeClasses[size]} mr-2 animate-spin`} 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Saving...
          </>
        ) : lastSaved ? (
          <>
            <CheckIcon className={`${iconSizeClasses[size]} mr-2 text-green-500`} />
            Saved
          </>
        ) : (
          <>
            <DocumentTextIcon className={`${iconSizeClasses[size]} mr-2`} />
            Save Draft
          </>
        )}
      </button>
      
      {showLastSaved && lastSaved && !isSaving && (
        <span className="text-xs text-gray-500 mt-1">
          {formatLastSaved(lastSaved)}
        </span>
      )}
    </div>
  );
};

export default SaveDraftButton;