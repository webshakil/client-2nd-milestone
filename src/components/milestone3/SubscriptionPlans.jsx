import React from 'react';

const SubscriptionPlans = ({ plans, onSubscribe }) => {
  if (!plans) return null;

  const planKeys = Object.keys(plans);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {planKeys.map((key) => {
        const plan = plans[key];
        const isPopular = key === 'yearly';

        return (
          <div
            key={key}
            className={`relative rounded-lg shadow-lg p-6 ${
              isPopular
                ? 'border-2 border-blue-500 transform scale-105'
                : 'border border-gray-200'
            }`}
          >
            {isPopular && (
              <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 rounded-bl-lg rounded-tr-lg text-sm font-bold">
                Popular
              </div>
            )}
            <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold">${plan.price}</span>
              {plan.duration > 0 && (
                <span className="text-gray-600">/{plan.duration} days</span>
              )}
            </div>
            <ul className="mb-6 space-y-2">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Unlimited elections
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Advanced analytics
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Priority support
              </li>
            </ul>
            <button
              onClick={() => onSubscribe(key)}
              className={`w-full py-3 rounded-lg font-bold transition ${
                isPopular
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Subscribe
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default SubscriptionPlans;