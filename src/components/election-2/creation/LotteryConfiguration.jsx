import React from 'react';
import { Gift, Trophy, DollarSign, Tag, TrendingUp, Info } from 'lucide-react';

const LotteryConfiguration = ({ formData, updateFormData, errors = {} }) => {
  
  const handleLotteryToggle = (isLotterized) => {
    updateFormData({ 
      isLotterized,
      rewardType: isLotterized ? (formData.rewardType || 'monetary') : '',
      rewardAmount: isLotterized ? formData.rewardAmount || 0 : 0,
      nonMonetaryReward: isLotterized ? formData.nonMonetaryReward || '' : '',
      projectedRevenue: isLotterized ? formData.projectedRevenue || 0 : 0,
      winnerCount: isLotterized ? formData.winnerCount || 1 : 1
    });
  };

  const handleRewardTypeChange = (rewardType) => {
    const updates = { rewardType };
    
    // Reset other reward fields when type changes
    if (rewardType === 'monetary') {
      updates.rewardAmount = formData.rewardAmount || 0;
      updates.nonMonetaryReward = '';
      updates.projectedRevenue = 0;
    } else if (rewardType === 'non-monetary') {
      updates.rewardAmount = 0;
      updates.nonMonetaryReward = formData.nonMonetaryReward || '';
      updates.projectedRevenue = 0;
    } else if (rewardType === 'revenue-share') {
      updates.rewardAmount = 0;
      updates.nonMonetaryReward = '';
      updates.projectedRevenue = formData.projectedRevenue || 0;
    }
    
    updateFormData(updates);
  };

  const rewardTypes = [
    {
      id: 'monetary',
      name: 'Defined Monetary Prize',
      description: 'Fixed cash amount',
      icon: <DollarSign className="w-5 h-5" />,
      example: 'e.g., USD 100,000'
    },
    {
      id: 'non-monetary',
      name: 'Defined Non-monetary Prize',
      description: 'Coupons, vouchers, experiences',
      icon: <Gift className="w-5 h-5" />,
      example: 'e.g., One week Dubai holiday with 5-star hotel stay'
    },
    {
      id: 'revenue-share',
      name: 'Defined Projected Content Generated Revenue',
      description: 'Share of projected content revenue',
      icon: <TrendingUp className="w-5 h-5" />,
      example: 'e.g., USD 300,000 content generated revenue'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Lottery Feature</h3>
          <p className="text-sm text-gray-600">Turn this election into a lottery with prizes for voters</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={formData.isLotterized}
            onChange={(e) => handleLotteryToggle(e.target.checked)}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
        </label>
      </div>

      {formData.isLotterized && (
        <div className="bg-green-50 rounded-lg p-4 space-y-6">
          {/* Prize Pool Setup */}
          <div>
            <h4 className="font-medium text-green-800 mb-3">Prize Pool Setup</h4>
            <p className="text-sm text-green-700 mb-4">Creator/sponsor funded prizes</p>
            
            {/* Reward Type Selection */}
            <div className="space-y-3 mb-6">
              {rewardTypes.map((type) => (
                <div key={type.id}>
                  <div
                    className={`relative rounded-lg border cursor-pointer transition-all duration-200 ${
                      (formData.rewardType || 'monetary') === type.id
                        ? 'border-green-500 bg-green-100'
                        : 'border-gray-300 hover:border-gray-400 bg-white'
                    }`}
                    onClick={() => handleRewardTypeChange(type.id)}
                  >
                    <div className="p-3 flex items-center space-x-3">
                      <div className="text-green-600">{type.icon}</div>
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">{type.name}</h5>
                        <p className="text-sm text-gray-600">{type.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{type.example}</p>
                      </div>
                      {(formData.rewardType || 'monetary') === type.id && (
                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Reward Configuration Fields */}
                  {type.id === 'monetary' && (formData.rewardType || 'monetary') === 'monetary' && (
                    <div className="mt-3 bg-blue-50 rounded-lg p-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <DollarSign className="w-4 h-4 inline mr-1" />
                        Total Prize Pool Amount (USD)
                      </label>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        className={`block w-full rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
                          errors.rewardAmount ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter amount (e.g., 100000)"
                        value={formData.rewardAmount || ''}
                        onChange={(e) => updateFormData({ rewardAmount: parseInt(e.target.value) || 0 })}
                      />
                      {errors.rewardAmount && (
                        <p className="text-red-600 text-sm mt-1">{errors.rewardAmount}</p>
                      )}
                    </div>
                  )}

                  {type.id === 'non-monetary' && formData.rewardType === 'non-monetary' && (
                    <div className="mt-3 bg-purple-50 rounded-lg p-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Tag className="w-4 h-4 inline mr-1" />
                        Non-monetary Prize Description
                      </label>
                      <textarea
                        rows={3}
                        className={`block w-full rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
                          errors.nonMonetaryReward ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Describe the prize (e.g., One week Dubai holiday with 5-star hotel stay, luxury spa package, tech gadgets bundle)"
                        value={formData.nonMonetaryReward || ''}
                        onChange={(e) => updateFormData({ nonMonetaryReward: e.target.value })}
                      />
                      {errors.nonMonetaryReward && (
                        <p className="text-red-600 text-sm mt-1">{errors.nonMonetaryReward}</p>
                      )}
                      
                      <div className="mt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <DollarSign className="w-4 h-4 inline mr-1" />
                          Estimated Value (USD)
                        </label>
                        <input
                          type="number"
                          min="1"
                          step="1"
                          className="block w-full rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 border-gray-300"
                          placeholder="Estimated monetary value"
                          value={formData.rewardAmount || ''}
                          onChange={(e) => updateFormData({ rewardAmount: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                    </div>
                  )}

                  {type.id === 'revenue-share' && formData.rewardType === 'revenue-share' && (
                    <div className="mt-3 bg-orange-50 rounded-lg p-3 space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <TrendingUp className="w-4 h-4 inline mr-1" />
                          Projected Content Generated Revenue (USD)
                        </label>
                        <input
                          type="number"
                          min="1"
                          step="1"
                          className={`block w-full rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
                            errors.projectedRevenue ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Enter projected revenue (e.g., 300000)"
                          value={formData.projectedRevenue || ''}
                          onChange={(e) => updateFormData({ projectedRevenue: parseInt(e.target.value) || 0 })}
                        />
                        {errors.projectedRevenue && (
                          <p className="text-red-600 text-sm mt-1">{errors.projectedRevenue}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Revenue Share Percentage for Winners (%)
                        </label>
                        <input
                          type="number"
                          min="0.1"
                          max="100"
                          step="0.1"
                          className="block w-full rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 border-gray-300"
                          placeholder="e.g., 10.5"
                          value={formData.revenueSharePercentage || ''}
                          onChange={(e) => updateFormData({ revenueSharePercentage: parseFloat(e.target.value) || 0 })}
                        />
                        <p className="text-xs text-gray-600 mt-1">
                          Winners will receive this percentage of the actual generated revenue
                        </p>
                      </div>
                      
                      {formData.projectedRevenue && formData.revenueSharePercentage && (
                        <div className="bg-orange-100 rounded-md p-2">
                          <p className="text-sm font-medium text-orange-800">
                            Estimated Prize Pool: ${((formData.projectedRevenue * formData.revenueSharePercentage) / 100).toFixed(2)}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Winner Count Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Trophy className="w-4 h-4 inline mr-1" />
              Number of Winners (1-100)
            </label>
            <input
              type="number"
              min="1"
              max="100"
              step="1"
              className={`block w-full rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
                errors.winnerCount ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="1"
              value={formData.winnerCount || ''}
              onChange={(e) => updateFormData({ winnerCount: parseInt(e.target.value) || 1 })}
            />
            {errors.winnerCount && (
              <p className="text-red-600 text-sm mt-1">{errors.winnerCount}</p>
            )}
          </div>

          {/* Prize Distribution Preview */}
          {formData.winnerCount > 0 && (
            <div className="space-y-3">
              {formData.rewardType === 'monetary' && formData.rewardAmount > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                  <p className="text-sm font-medium text-yellow-800">
                    Prize Distribution: ${(formData.rewardAmount / formData.winnerCount).toFixed(2)} per winner
                  </p>
                </div>
              )}
              
              {formData.rewardType === 'non-monetary' && formData.nonMonetaryReward && (
                <div className="bg-purple-50 border border-purple-200 rounded-md p-3">
                  <p className="text-sm font-medium text-purple-800">
                    Each of the {formData.winnerCount} winner{formData.winnerCount > 1 ? 's' : ''} will receive:
                  </p>
                  <p className="text-sm text-purple-700 mt-1">{formData.nonMonetaryReward}</p>
                </div>
              )}
              
              {formData.rewardType === 'revenue-share' && formData.projectedRevenue > 0 && formData.revenueSharePercentage > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-md p-3">
                  <p className="text-sm font-medium text-orange-800">
                    Revenue Share Distribution: {formData.revenueSharePercentage}% of actual revenue split among {formData.winnerCount} winner{formData.winnerCount > 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-orange-700 mt-1">
                    Estimated: ${((formData.projectedRevenue * formData.revenueSharePercentage) / 100 / formData.winnerCount).toFixed(2)} per winner
                  </p>
                </div>
              )}
            </div>
          )}

          {/* How Lottery Works */}
          <div className="bg-green-100 rounded-md p-3">
            <div className="flex items-start space-x-2">
              <Info className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-green-800 mb-2">How the Lottery Works:</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Each vote automatically becomes a lottery ticket</li>
                  <li>• Winners are selected randomly when the election ends</li>
                  <li>• Prizes are distributed automatically to winners</li>
                  <li>• All lottery draws are cryptographically secure and verifiable</li>
                  <li>• Prize distribution method depends on the selected reward type</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LotteryConfiguration;