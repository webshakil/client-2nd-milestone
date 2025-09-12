// components/election/ProgressSteps.jsx
import React from 'react';

const ProgressSteps = ({ steps, currentStep }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <nav className="flex items-center justify-center">
        <ol className="flex items-center space-x-5">
          {steps.map((step) => (
            <li key={step.number} className="flex items-center">
              <div className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    currentStep >= step.number
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-gray-300 text-gray-500'
                  }`}
                >
                  {step.number}
                </div>
                <div className="ml-4 min-w-0">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step.name}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
              </div>
              {step.number < steps.length && (
                <div className="ml-5 w-8 h-0.5 bg-gray-200"></div>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default ProgressSteps;