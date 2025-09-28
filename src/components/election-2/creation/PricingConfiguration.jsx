import React from 'react';
import { DollarSign, Globe, Info } from 'lucide-react';

const PricingConfiguration = ({ formData, updateFormData, errors = {} }) => {
  
  const handlePricingTypeChange = (pricingType) => {
    const updates = { pricingType };
    
    if (pricingType === 'free') {
      updates.isPaid = false;
      updates.participationFee = 0;
      updates.regionalFees = {};
      updates.processingFeePercentage = 0;
    } else if (pricingType === 'general') {
      updates.isPaid = true;
      updates.participationFee = formData.participationFee || 0;
      updates.regionalFees = {};
    } else if (pricingType === 'regional') {
      updates.isPaid = true;
      updates.participationFee = 0;
      updates.regionalFees = formData.regionalFees || getEmptyRegionalFees();
    }
    
    updateFormData(updates);
  };

  const getEmptyRegionalFees = () => ({
    region1: 0, // US & Canada
    region2: 0, // Western Europe
    region3: 0, // Eastern Europe & Russia
    region4: 0, // Africa
    region5: 0, // Latin America & Caribbeans
    region6: 0, // Middle East, Asia, Eurasia, Melanesia, Micronesia, & Polynesia
    region7: 0, // Australasia
    region8: 0  // China, Macau & Hong Kong
  });

  const handleRegionalFeeChange = (region, value) => {
    // Handle empty input
    if (value === '' || value === null || value === undefined) {
      const updatedFees = {
        ...formData.regionalFees,
        [region]: 0
      };
      updateFormData({ regionalFees: updatedFees });
      return;
    }
    
    // Validate and clean the input
    const cleanValue = value.replace(/[^\d.]/g, ''); // Only allow digits and decimal point
    
    // Prevent multiple decimal points
    const parts = cleanValue.split('.');
    const finalValue = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : cleanValue;
    
    // Convert to number
    const numericValue = parseFloat(finalValue);
    
    if (isNaN(numericValue) || numericValue < 0) {
      const updatedFees = {
        ...formData.regionalFees,
        [region]: 0
      };
      updateFormData({ regionalFees: updatedFees });
      return;
    }
    
    // Store the exact parsed value without any rounding unless it has more than 2 decimal places
    const finalNumber = Math.round(numericValue * 100) / 100;
    
    const updatedFees = {
      ...formData.regionalFees,
      [region]: finalNumber
    };
    updateFormData({ regionalFees: updatedFees });
  };

  // Get the current pricing type, default to 'free' if not set
  const currentPricingType = formData.pricingType || 'free';

  const pricingOptions = [
    {
      id: 'free',
      name: 'Free',
      description: 'No participation fee',
      icon: '🆓'
    },
    {
      id: 'general',
      name: 'Paid (General Fee)',
      description: 'Single fee for all participants worldwide',
      icon: '💰'
    },
    {
      id: 'regional',
      name: 'Paid (Regional Fee)',
      description: 'Different fees for 8 regional zones',
      icon: '🌍'
    }
  ];

  const regionalZones = [
    { id: 'region1', name: 'Region 1', description: 'US & Canada' },
    { id: 'region2', name: 'Region 2', description: 'Western Europe' },
    { id: 'region3', name: 'Region 3', description: 'Eastern Europe & Russia' },
    { id: 'region4', name: 'Region 4', description: 'Africa' },
    { id: 'region5', name: 'Region 5', description: 'Latin America & Caribbeans' },
    { id: 'region6', name: 'Region 6', description: 'Middle East, Asia, Eurasia, Melanesia, Micronesia, & Polynesia' },
    { id: 'region7', name: 'Region 7', description: 'Australasia: Australia & New Zealand, Taiwan, South Korea, Japan, & Singapore' },
    { id: 'region8', name: 'Region 8', description: 'China, Macau & Hong Kong' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Regional Pricing Configuration</h3>
        <p className="text-sm text-gray-600">Configure participation fees for different regions</p>
      </div>

      {/* Pricing Type Selection - Radio button style */}
      <div className="space-y-3">
        {pricingOptions.map((option) => (
          <div key={option.id}>
            <div
              className={`relative rounded-lg border cursor-pointer transition-all duration-200 ${
                currentPricingType === option.id
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handlePricingTypeChange(option.id)}
            >
              <div className="p-4 flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    currentPricingType === option.id
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {currentPricingType === option.id && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                </div>
                <span className="text-2xl">{option.icon}</span>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{option.name}</h4>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </div>
              </div>
            </div>

            {/* General Fee Configuration - only shows when general is selected */}
            {option.id === 'general' && currentPricingType === 'general' && (
              <div className="mt-3 bg-blue-50 rounded-lg p-4 space-y-4 border border-blue-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="w-4 h-4 inline mr-1" />
                    Participation Fee (USD)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    className={`block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                      errors.participationFee ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter amount (e.g., 1.00)"
                    value={formData.participationFee || ''}
                    onChange={(e) => updateFormData({ participationFee: parseFloat(e.target.value) || 0 })}
                  />
                  {errors.participationFee && (
                    <p className="text-red-600 text-sm mt-1">{errors.participationFee}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Regional Fee Configuration - only shows when regional is selected */}
      {currentPricingType === 'regional' && (
        <div className="bg-green-50 rounded-lg p-4 space-y-4 border border-green-200">
          <div className="flex items-center space-x-2 mb-4">
            <Globe className="w-5 h-5 text-green-600" />
            <h4 className="font-medium text-green-800">Regional Fee Structure</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {regionalZones.map((zone) => (
              <div key={zone.id} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {zone.name}
                </label>
                <p className="text-xs text-gray-600 mb-1">{zone.description}</p>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="block w-full pl-10 pr-3 py-2 rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
                    placeholder="0.00"
                    value={formData.regionalFees?.[zone.id] || ''}
                    onChange={(e) => handleRegionalFeeChange(zone.id, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-green-100 rounded-md p-3 mt-4">
            <div className="flex items-start space-x-2">
              <Info className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-green-700">
                Set different participation fees based on economic conditions in different regions. Leave at $0.00 for free participation in specific regions.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Processing Fee Configuration - only shows for paid options */}
      {(currentPricingType === 'general' || currentPricingType === 'regional') && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Election Participation Fee Processing Cost (%)
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                className={`block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  errors.processingFeePercentage ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter percentage (e.g., 2.5)"
                value={formData.processingFeePercentage || ''}
                onChange={(e) => updateFormData({ processingFeePercentage: parseFloat(e.target.value) || 0 })}
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
            </div>
            {errors.processingFeePercentage && (
              <p className="text-red-600 text-sm mt-1">{errors.processingFeePercentage}</p>
            )}
          </div>
          
          <div className="bg-gray-100 rounded-md p-3">
            <h4 className="font-medium text-gray-800 mb-2">Processing fee covers:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Payment processing</li>
              <li>• Pricing regionalization & optimization</li>
              <li>• Invoicing</li>
              <li>• Payment recovery</li>
              <li>• Participants payment support</li>
            </ul>
          </div>
        </div>
      )}

      {/* Info message for paid elections */}
      {(currentPricingType === 'general' || currentPricingType === 'regional') && (
        <div className="bg-blue-50 rounded-md p-3 border border-blue-200">
          <div className="flex items-start space-x-2">
            <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-700">
              Paid elections help prevent spam voting and can fund prize pools. You have complete control over the pricing structure.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingConfiguration;
// import React from 'react';
// import { DollarSign, Globe, Info } from 'lucide-react';

// const PricingConfiguration = ({ formData, updateFormData, errors = {} }) => {
  
//   const handlePricingTypeChange = (pricingType) => {
//     const updates = { pricingType };
    
//     if (pricingType === 'free') {
//       updates.isPaid = false;
//       updates.participationFee = 0;
//       updates.regionalFees = {};
//       updates.processingFeePercentage = 0;
//     } else if (pricingType === 'general') {
//       updates.isPaid = true;
//       updates.participationFee = formData.participationFee || 0;
//       updates.regionalFees = {};
//     } else if (pricingType === 'regional') {
//       updates.isPaid = true;
//       updates.participationFee = 0;
//       updates.regionalFees = formData.regionalFees || getEmptyRegionalFees();
//     }
    
//     updateFormData(updates);
//   };

//   const getEmptyRegionalFees = () => ({
//     region1: 0, // US & Canada
//     region2: 0, // Western Europe
//     region3: 0, // Eastern Europe & Russia
//     region4: 0, // Africa
//     region5: 0, // Latin America & Caribbeans
//     region6: 0, // Middle East, Asia, Eurasia, Melanesia, Micronesia, & Polynesia
//     region7: 0, // Australasia
//     region8: 0  // China, Macau & Hong Kong
//   });

//   const handleRegionalFeeChange = (region, value) => {
//     // Direct conversion - let the input value be what the user typed
//     const numericValue = value === '' ? 0 : Number(value);
//     const updatedFees = {
//       ...formData.regionalFees,
//       [region]: numericValue
//     };
//     updateFormData({ regionalFees: updatedFees });
//   };

//   // Get the current pricing type, default to 'free' if not set
//   const currentPricingType = formData.pricingType || 'free';

//   const pricingOptions = [
//     {
//       id: 'free',
//       name: 'Free',
//       description: 'No participation fee',
//       icon: '🆓'
//     },
//     {
//       id: 'general',
//       name: 'Paid (General Fee)',
//       description: 'Single fee for all participants worldwide',
//       icon: '💰'
//     },
//     {
//       id: 'regional',
//       name: 'Paid (Regional Fee)',
//       description: 'Different fees for 8 regional zones',
//       icon: '🌍'
//     }
//   ];

//   const regionalZones = [
//     { id: 'region1', name: 'Region 1', description: 'US & Canada' },
//     { id: 'region2', name: 'Region 2', description: 'Western Europe' },
//     { id: 'region3', name: 'Region 3', description: 'Eastern Europe & Russia' },
//     { id: 'region4', name: 'Region 4', description: 'Africa' },
//     { id: 'region5', name: 'Region 5', description: 'Latin America & Caribbeans' },
//     { id: 'region6', name: 'Region 6', description: 'Middle East, Asia, Eurasia, Melanesia, Micronesia, & Polynesia' },
//     { id: 'region7', name: 'Region 7', description: 'Australasia: Australia & New Zealand, Taiwan, South Korea, Japan, & Singapore' },
//     { id: 'region8', name: 'Region 8', description: 'China, Macau & Hong Kong' }
//   ];

//   return (
//     <div className="space-y-6">
//       <div>
//         <h3 className="text-lg font-semibold text-gray-900">Regional Pricing Configuration</h3>
//         <p className="text-sm text-gray-600">Configure participation fees for different regions</p>
//       </div>

//       {/* Pricing Type Selection - Radio button style */}
//       <div className="space-y-3">
//         {pricingOptions.map((option) => (
//           <div key={option.id}>
//             <div
//               className={`relative rounded-lg border cursor-pointer transition-all duration-200 ${
//                 currentPricingType === option.id
//                   ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
//                   : 'border-gray-200 hover:border-gray-300'
//               }`}
//               onClick={() => handlePricingTypeChange(option.id)}
//             >
//               <div className="p-4 flex items-center space-x-3">
//                 <div className="flex-shrink-0">
//                   <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
//                     currentPricingType === option.id
//                       ? 'border-blue-500 bg-blue-500'
//                       : 'border-gray-300'
//                   }`}>
//                     {currentPricingType === option.id && (
//                       <div className="w-2 h-2 bg-white rounded-full"></div>
//                     )}
//                   </div>
//                 </div>
//                 <span className="text-2xl">{option.icon}</span>
//                 <div className="flex-1">
//                   <h4 className="font-medium text-gray-900">{option.name}</h4>
//                   <p className="text-sm text-gray-600">{option.description}</p>
//                 </div>
//               </div>
//             </div>

//             {/* General Fee Configuration - only shows when general is selected */}
//             {option.id === 'general' && currentPricingType === 'general' && (
//               <div className="mt-3 bg-blue-50 rounded-lg p-4 space-y-4 border border-blue-200">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     <DollarSign className="w-4 h-4 inline mr-1" />
//                     Participation Fee (USD)
//                   </label>
//                   <input
//                     type="number"
//                     min="0"
//                     step="1"
//                     className={`block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
//                       errors.participationFee ? 'border-red-300' : 'border-gray-300'
//                     }`}
//                     placeholder="Enter amount (e.g., 1.00)"
//                     value={formData.participationFee || ''}
//                     onChange={(e) => updateFormData({ participationFee: parseFloat(e.target.value) || 0 })}
//                   />
//                   {errors.participationFee && (
//                     <p className="text-red-600 text-sm mt-1">{errors.participationFee}</p>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Regional Fee Configuration - only shows when regional is selected */}
//       {currentPricingType === 'regional' && (
//         <div className="bg-green-50 rounded-lg p-4 space-y-4 border border-green-200">
//           <div className="flex items-center space-x-2 mb-4">
//             <Globe className="w-5 h-5 text-green-600" />
//             <h4 className="font-medium text-green-800">Regional Fee Structure</h4>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {regionalZones.map((zone) => (
//               <div key={zone.id} className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   {zone.name}
//                 </label>
//                 <p className="text-xs text-gray-600 mb-1">{zone.description}</p>
//                 <div className="relative">
//                   <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                   <input
//                     type="number"
//                     min="0"
//                     step="0.01"
//                     className="block w-full pl-10 pr-3 py-2 rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
//                     placeholder="0.00"
//                     value={formData.regionalFees?.[zone.id] || ''}
//                     onChange={(e) => handleRegionalFeeChange(zone.id, e.target.value)}
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>
          
//           <div className="bg-green-100 rounded-md p-3 mt-4">
//             <div className="flex items-start space-x-2">
//               <Info className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
//               <p className="text-sm text-green-700">
//                 Set different participation fees based on economic conditions in different regions. Leave at $0.00 for free participation in specific regions.
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Processing Fee Configuration - only shows for paid options */}
//       {(currentPricingType === 'general' || currentPricingType === 'regional') && (
//         <div className="bg-gray-50 rounded-lg p-4 space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Election Participation Fee Processing Cost (%)
//             </label>
//             <div className="relative">
//               <input
//                 type="number"
//                 min="0"
//                 max="100"
//                 step="0.1"
//                 className={`block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
//                   errors.processingFeePercentage ? 'border-red-300' : 'border-gray-300'
//                 }`}
//                 placeholder="Enter percentage (e.g., 2.5)"
//                 value={formData.processingFeePercentage || ''}
//                 onChange={(e) => updateFormData({ processingFeePercentage: parseFloat(e.target.value) || 0 })}
//               />
//               <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
//             </div>
//             {errors.processingFeePercentage && (
//               <p className="text-red-600 text-sm mt-1">{errors.processingFeePercentage}</p>
//             )}
//           </div>
          
//           <div className="bg-gray-100 rounded-md p-3">
//             <h4 className="font-medium text-gray-800 mb-2">Processing fee covers:</h4>
//             <ul className="text-sm text-gray-700 space-y-1">
//               <li>• Payment processing</li>
//               <li>• Pricing regionalization & optimization</li>
//               <li>• Invoicing</li>
//               <li>• Payment recovery</li>
//               <li>• Participants payment support</li>
//             </ul>
//           </div>
//         </div>
//       )}

//       {/* Info message for paid elections */}
//       {(currentPricingType === 'general' || currentPricingType === 'regional') && (
//         <div className="bg-blue-50 rounded-md p-3 border border-blue-200">
//           <div className="flex items-start space-x-2">
//             <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
//             <p className="text-sm text-blue-700">
//               Paid elections help prevent spam voting and can fund prize pools. You have complete control over the pricing structure.
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PricingConfiguration;
// //better input handling
// import React from 'react';
// import { DollarSign, Globe, Info } from 'lucide-react';

// const PricingConfiguration = ({ formData, updateFormData, errors = {} }) => {
  
//   const handlePricingTypeChange = (pricingType) => {
//     const updates = { pricingType };
    
//     if (pricingType === 'free') {
//       updates.isPaid = false;
//       updates.participationFee = 0;
//       updates.regionalFees = {};
//       updates.processingFeePercentage = 0;
//     } else if (pricingType === 'general') {
//       updates.isPaid = true;
//       updates.participationFee = formData.participationFee || 0;
//       updates.regionalFees = {};
//     } else if (pricingType === 'regional') {
//       updates.isPaid = true;
//       updates.participationFee = 0;
//       updates.regionalFees = formData.regionalFees || getEmptyRegionalFees();
//     }
    
//     updateFormData(updates);
//   };

//   const getEmptyRegionalFees = () => ({
//     region1: 0, // US & Canada
//     region2: 0, // Western Europe
//     region3: 0, // Eastern Europe & Russia
//     region4: 0, // Africa
//     region5: 0, // Latin America & Caribbeans
//     region6: 0, // Middle East, Asia, Eurasia, Melanesia, Micronesia, & Polynesia
//     region7: 0, // Australasia
//     region8: 0  // China, Macau & Hong Kong
//   });

//   const handleRegionalFeeChange = (region, value) => {
//     // Handle empty or invalid input
//     if (value === '' || value === null || value === undefined) {
//       const updatedFees = {
//         ...formData.regionalFees,
//         [region]: 0
//       };
//       updateFormData({ regionalFees: updatedFees });
//       return;
//     }
    
//     const numericValue = parseFloat(value);
//     if (isNaN(numericValue)) {
//       const updatedFees = {
//         ...formData.regionalFees,
//         [region]: 0
//       };
//       updateFormData({ regionalFees: updatedFees });
//       return;
//     }
    
//     // For integer values, keep them as integers
//     // For decimal values, round to 2 decimal places
//     const cleanValue = Number.isInteger(numericValue) ? 
//       numericValue : 
//       Math.round(numericValue * 100) / 100;
    
//     const updatedFees = {
//       ...formData.regionalFees,
//       [region]: cleanValue
//     };
//     updateFormData({ regionalFees: updatedFees });
//   };

//   // Get the current pricing type, default to 'free' if not set
//   const currentPricingType = formData.pricingType || 'free';

//   const pricingOptions = [
//     {
//       id: 'free',
//       name: 'Free',
//       description: 'No participation fee',
//       icon: '🆓'
//     },
//     {
//       id: 'general',
//       name: 'Paid (General Fee)',
//       description: 'Single fee for all participants worldwide',
//       icon: '💰'
//     },
//     {
//       id: 'regional',
//       name: 'Paid (Regional Fee)',
//       description: 'Different fees for 8 regional zones',
//       icon: '🌍'
//     }
//   ];

//   const regionalZones = [
//     { id: 'region1', name: 'Region 1', description: 'US & Canada' },
//     { id: 'region2', name: 'Region 2', description: 'Western Europe' },
//     { id: 'region3', name: 'Region 3', description: 'Eastern Europe & Russia' },
//     { id: 'region4', name: 'Region 4', description: 'Africa' },
//     { id: 'region5', name: 'Region 5', description: 'Latin America & Caribbeans' },
//     { id: 'region6', name: 'Region 6', description: 'Middle East, Asia, Eurasia, Melanesia, Micronesia, & Polynesia' },
//     { id: 'region7', name: 'Region 7', description: 'Australasia: Australia & New Zealand, Taiwan, South Korea, Japan, & Singapore' },
//     { id: 'region8', name: 'Region 8', description: 'China, Macau & Hong Kong' }
//   ];

//   return (
//     <div className="space-y-6">
//       <div>
//         <h3 className="text-lg font-semibold text-gray-900">Regional Pricing Configuration</h3>
//         <p className="text-sm text-gray-600">Configure participation fees for different regions</p>
//       </div>

//       {/* Pricing Type Selection - Radio button style */}
//       <div className="space-y-3">
//         {pricingOptions.map((option) => (
//           <div key={option.id}>
//             <div
//               className={`relative rounded-lg border cursor-pointer transition-all duration-200 ${
//                 currentPricingType === option.id
//                   ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
//                   : 'border-gray-200 hover:border-gray-300'
//               }`}
//               onClick={() => handlePricingTypeChange(option.id)}
//             >
//               <div className="p-4 flex items-center space-x-3">
//                 <div className="flex-shrink-0">
//                   <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
//                     currentPricingType === option.id
//                       ? 'border-blue-500 bg-blue-500'
//                       : 'border-gray-300'
//                   }`}>
//                     {currentPricingType === option.id && (
//                       <div className="w-2 h-2 bg-white rounded-full"></div>
//                     )}
//                   </div>
//                 </div>
//                 <span className="text-2xl">{option.icon}</span>
//                 <div className="flex-1">
//                   <h4 className="font-medium text-gray-900">{option.name}</h4>
//                   <p className="text-sm text-gray-600">{option.description}</p>
//                 </div>
//               </div>
//             </div>

//             {/* General Fee Configuration - only shows when general is selected */}
//             {option.id === 'general' && currentPricingType === 'general' && (
//               <div className="mt-3 bg-blue-50 rounded-lg p-4 space-y-4 border border-blue-200">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     <DollarSign className="w-4 h-4 inline mr-1" />
//                     Participation Fee (USD)
//                   </label>
//                   <input
//                     type="number"
//                     min="0"
//                     step="0.01"
//                     className={`block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
//                       errors.participationFee ? 'border-red-300' : 'border-gray-300'
//                     }`}
//                     placeholder="Enter amount (e.g., 1.00)"
//                     value={formData.participationFee || ''}
//                     onChange={(e) => updateFormData({ participationFee: parseFloat(e.target.value) || 0 })}
//                   />
//                   {errors.participationFee && (
//                     <p className="text-red-600 text-sm mt-1">{errors.participationFee}</p>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Regional Fee Configuration - only shows when regional is selected */}
//       {currentPricingType === 'regional' && (
//         <div className="bg-green-50 rounded-lg p-4 space-y-4 border border-green-200">
//           <div className="flex items-center space-x-2 mb-4">
//             <Globe className="w-5 h-5 text-green-600" />
//             <h4 className="font-medium text-green-800">Regional Fee Structure</h4>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {regionalZones.map((zone) => (
//               <div key={zone.id} className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   {zone.name}
//                 </label>
//                 <p className="text-xs text-gray-600 mb-1">{zone.description}</p>
//                 <div className="relative">
//                   <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                   <input
//                     type="number"
//                     min="0"
//                     step="0.01"
//                     className="block w-full pl-10 pr-3 py-2 rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
//                     placeholder="0.00"
//                     value={formData.regionalFees?.[zone.id] || ''}
//                     onChange={(e) => handleRegionalFeeChange(zone.id, e.target.value)}
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>
          
//           <div className="bg-green-100 rounded-md p-3 mt-4">
//             <div className="flex items-start space-x-2">
//               <Info className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
//               <p className="text-sm text-green-700">
//                 Set different participation fees based on economic conditions in different regions. Leave at $0.00 for free participation in specific regions.
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Processing Fee Configuration - only shows for paid options */}
//       {(currentPricingType === 'general' || currentPricingType === 'regional') && (
//         <div className="bg-gray-50 rounded-lg p-4 space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Election Participation Fee Processing Cost (%)
//             </label>
//             <div className="relative">
//               <input
//                 type="number"
//                 min="0"
//                 max="100"
//                 step="0.1"
//                 className={`block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
//                   errors.processingFeePercentage ? 'border-red-300' : 'border-gray-300'
//                 }`}
//                 placeholder="Enter percentage (e.g., 2.5)"
//                 value={formData.processingFeePercentage || ''}
//                 onChange={(e) => updateFormData({ processingFeePercentage: parseFloat(e.target.value) || 0 })}
//               />
//               <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
//             </div>
//             {errors.processingFeePercentage && (
//               <p className="text-red-600 text-sm mt-1">{errors.processingFeePercentage}</p>
//             )}
//           </div>
          
//           <div className="bg-gray-100 rounded-md p-3">
//             <h4 className="font-medium text-gray-800 mb-2">Processing fee covers:</h4>
//             <ul className="text-sm text-gray-700 space-y-1">
//               <li>• Payment processing</li>
//               <li>• Pricing regionalization & optimization</li>
//               <li>• Invoicing</li>
//               <li>• Payment recovery</li>
//               <li>• Participants payment support</li>
//             </ul>
//           </div>
//         </div>
//       )}

//       {/* Info message for paid elections */}
//       {(currentPricingType === 'general' || currentPricingType === 'regional') && (
//         <div className="bg-blue-50 rounded-md p-3 border border-blue-200">
//           <div className="flex items-start space-x-2">
//             <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
//             <p className="text-sm text-blue-700">
//               Paid elections help prevent spam voting and can fund prize pools. You have complete control over the pricing structure.
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PricingConfiguration;
// import React from 'react';
// import { DollarSign, Globe, Info } from 'lucide-react';

// const PricingConfiguration = ({ formData, updateFormData, errors = {} }) => {
  
//   const handlePricingTypeChange = (pricingType) => {
//     const updates = { pricingType };
    
//     if (pricingType === 'free') {
//       updates.isPaid = false;
//       updates.participationFee = 0;
//       updates.regionalFees = {};
//       updates.processingFeePercentage = 0;
//     } else if (pricingType === 'general') {
//       updates.isPaid = true;
//       updates.participationFee = formData.participationFee || 0;
//       updates.regionalFees = {};
//     } else if (pricingType === 'regional') {
//       updates.isPaid = true;
//       updates.participationFee = 0;
//       updates.regionalFees = formData.regionalFees || getEmptyRegionalFees();
//     }
    
//     updateFormData(updates);
//   };

//   const getEmptyRegionalFees = () => ({
//     region1: 0, // US & Canada
//     region2: 0, // Western Europe
//     region3: 0, // Eastern Europe & Russia
//     region4: 0, // Africa
//     region5: 0, // Latin America & Caribbeans
//     region6: 0, // Middle East, Asia, Eurasia, Melanesia, Micronesia, & Polynesia
//     region7: 0, // Australasia
//     region8: 0  // China, Macau & Hong Kong
//   });

//   const handleRegionalFeeChange = (region, value) => {
//     const numericValue = parseFloat(value);
//     // Round to 2 decimal places to avoid floating-point precision issues
//     const roundedValue = isNaN(numericValue) ? 0 : Math.round(numericValue * 100) / 100;
//     const updatedFees = {
//       ...formData.regionalFees,
//       [region]: roundedValue
//     };
//     updateFormData({ regionalFees: updatedFees });
//   };

//   // Get the current pricing type, default to 'free' if not set
//   const currentPricingType = formData.pricingType || 'free';

//   const pricingOptions = [
//     {
//       id: 'free',
//       name: 'Free',
//       description: 'No participation fee',
//       icon: '🆓'
//     },
//     {
//       id: 'general',
//       name: 'Paid (General Fee)',
//       description: 'Single fee for all participants worldwide',
//       icon: '💰'
//     },
//     {
//       id: 'regional',
//       name: 'Paid (Regional Fee)',
//       description: 'Different fees for 8 regional zones',
//       icon: '🌍'
//     }
//   ];

//   const regionalZones = [
//     { id: 'region1', name: 'Region 1', description: 'US & Canada' },
//     { id: 'region2', name: 'Region 2', description: 'Western Europe' },
//     { id: 'region3', name: 'Region 3', description: 'Eastern Europe & Russia' },
//     { id: 'region4', name: 'Region 4', description: 'Africa' },
//     { id: 'region5', name: 'Region 5', description: 'Latin America & Caribbeans' },
//     { id: 'region6', name: 'Region 6', description: 'Middle East, Asia, Eurasia, Melanesia, Micronesia, & Polynesia' },
//     { id: 'region7', name: 'Region 7', description: 'Australasia: Australia & New Zealand, Taiwan, South Korea, Japan, & Singapore' },
//     { id: 'region8', name: 'Region 8', description: 'China, Macau & Hong Kong' }
//   ];

//   return (
//     <div className="space-y-6">
//       <div>
//         <h3 className="text-lg font-semibold text-gray-900">Regional Pricing Configuration</h3>
//         <p className="text-sm text-gray-600">Configure participation fees for different regions</p>
//       </div>

//       {/* Pricing Type Selection - Radio button style */}
//       <div className="space-y-3">
//         {pricingOptions.map((option) => (
//           <div key={option.id}>
//             <div
//               className={`relative rounded-lg border cursor-pointer transition-all duration-200 ${
//                 currentPricingType === option.id
//                   ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
//                   : 'border-gray-200 hover:border-gray-300'
//               }`}
//               onClick={() => handlePricingTypeChange(option.id)}
//             >
//               <div className="p-4 flex items-center space-x-3">
//                 <div className="flex-shrink-0">
//                   <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
//                     currentPricingType === option.id
//                       ? 'border-blue-500 bg-blue-500'
//                       : 'border-gray-300'
//                   }`}>
//                     {currentPricingType === option.id && (
//                       <div className="w-2 h-2 bg-white rounded-full"></div>
//                     )}
//                   </div>
//                 </div>
//                 <span className="text-2xl">{option.icon}</span>
//                 <div className="flex-1">
//                   <h4 className="font-medium text-gray-900">{option.name}</h4>
//                   <p className="text-sm text-gray-600">{option.description}</p>
//                 </div>
//               </div>
//             </div>

//             {/* General Fee Configuration - only shows when general is selected */}
//             {option.id === 'general' && currentPricingType === 'general' && (
//               <div className="mt-3 bg-blue-50 rounded-lg p-4 space-y-4 border border-blue-200">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     <DollarSign className="w-4 h-4 inline mr-1" />
//                     Participation Fee (USD)
//                   </label>
//                   <input
//                     type="number"
//                     min="0"
//                     step="0.01"
//                     className={`block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
//                       errors.participationFee ? 'border-red-300' : 'border-gray-300'
//                     }`}
//                     placeholder="Enter amount (e.g., 1.00)"
//                     value={formData.participationFee || ''}
//                     onChange={(e) => updateFormData({ participationFee: parseFloat(e.target.value) || 0 })}
//                   />
//                   {errors.participationFee && (
//                     <p className="text-red-600 text-sm mt-1">{errors.participationFee}</p>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Regional Fee Configuration - only shows when regional is selected */}
//       {currentPricingType === 'regional' && (
//         <div className="bg-green-50 rounded-lg p-4 space-y-4 border border-green-200">
//           <div className="flex items-center space-x-2 mb-4">
//             <Globe className="w-5 h-5 text-green-600" />
//             <h4 className="font-medium text-green-800">Regional Fee Structure</h4>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {regionalZones.map((zone) => (
//               <div key={zone.id} className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   {zone.name}
//                 </label>
//                 <p className="text-xs text-gray-600 mb-1">{zone.description}</p>
//                 <div className="relative">
//                   <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                   <input
//                     type="number"
//                     min="0"
//                     step="0.01"
//                     className="block w-full pl-10 pr-3 py-2 rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
//                     placeholder="0.00"
//                     value={formData.regionalFees?.[zone.id] || ''}
//                     onChange={(e) => handleRegionalFeeChange(zone.id, e.target.value)}
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>
          
//           <div className="bg-green-100 rounded-md p-3 mt-4">
//             <div className="flex items-start space-x-2">
//               <Info className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
//               <p className="text-sm text-green-700">
//                 Set different participation fees based on economic conditions in different regions. Leave at $0.00 for free participation in specific regions.
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Processing Fee Configuration - only shows for paid options */}
//       {(currentPricingType === 'general' || currentPricingType === 'regional') && (
//         <div className="bg-gray-50 rounded-lg p-4 space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Election Participation Fee Processing Cost (%)
//             </label>
//             <div className="relative">
//               <input
//                 type="number"
//                 min="0"
//                 max="100"
//                 step="0.1"
//                 className={`block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
//                   errors.processingFeePercentage ? 'border-red-300' : 'border-gray-300'
//                 }`}
//                 placeholder="Enter percentage (e.g., 2.5)"
//                 value={formData.processingFeePercentage || ''}
//                 onChange={(e) => updateFormData({ processingFeePercentage: parseFloat(e.target.value) || 0 })}
//               />
//               <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
//             </div>
//             {errors.processingFeePercentage && (
//               <p className="text-red-600 text-sm mt-1">{errors.processingFeePercentage}</p>
//             )}
//           </div>
          
//           <div className="bg-gray-100 rounded-md p-3">
//             <h4 className="font-medium text-gray-800 mb-2">Processing fee covers:</h4>
//             <ul className="text-sm text-gray-700 space-y-1">
//               <li>• Payment processing</li>
//               <li>• Pricing regionalization & optimization</li>
//               <li>• Invoicing</li>
//               <li>• Payment recovery</li>
//               <li>• Participants payment support</li>
//             </ul>
//           </div>
//         </div>
//       )}

//       {/* Info message for paid elections */}
//       {(currentPricingType === 'general' || currentPricingType === 'regional') && (
//         <div className="bg-blue-50 rounded-md p-3 border border-blue-200">
//           <div className="flex items-start space-x-2">
//             <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
//             <p className="text-sm text-blue-700">
//               Paid elections help prevent spam voting and can fund prize pools. You have complete control over the pricing structure.
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PricingConfiguration;
// //it sets one option at a time
// import React from 'react';
// import { DollarSign, Globe, Info } from 'lucide-react';

// const PricingConfiguration = ({ formData, updateFormData, errors = {} }) => {
  
//   const handlePricingTypeChange = (pricingType) => {
//     const updates = { pricingType };
    
//     if (pricingType === 'free') {
//       updates.isPaid = false;
//       updates.participationFee = 0;
//       updates.regionalFees = {};
//       updates.processingFeePercentage = 0;
//     } else if (pricingType === 'general') {
//       updates.isPaid = true;
//       updates.participationFee = formData.participationFee || 0;
//       updates.regionalFees = {};
//     } else if (pricingType === 'regional') {
//       updates.isPaid = true;
//       updates.participationFee = 0;
//       updates.regionalFees = formData.regionalFees || getEmptyRegionalFees();
//     }
    
//     updateFormData(updates);
//   };

//   const getEmptyRegionalFees = () => ({
//     region1: 0, // US & Canada
//     region2: 0, // Western Europe
//     region3: 0, // Eastern Europe & Russia
//     region4: 0, // Africa
//     region5: 0, // Latin America & Caribbeans
//     region6: 0, // Middle East, Asia, Eurasia, Melanesia, Micronesia, & Polynesia
//     region7: 0, // Australasia
//     region8: 0  // China, Macau & Hong Kong
//   });

//   const handleRegionalFeeChange = (region, value) => {
//     const numericValue = parseFloat(value);
//     const updatedFees = {
//       ...formData.regionalFees,
//       [region]: isNaN(numericValue) ? 0 : numericValue
//     };
//     updateFormData({ regionalFees: updatedFees });
//   };

//   // Get the current pricing type, default to 'free' if not set
//   const currentPricingType = formData.pricingType || 'free';

//   const pricingOptions = [
//     {
//       id: 'free',
//       name: 'Free',
//       description: 'No participation fee',
//       icon: '🆓'
//     },
//     {
//       id: 'general',
//       name: 'Paid (General Fee)',
//       description: 'Single fee for all participants worldwide',
//       icon: '💰'
//     },
//     {
//       id: 'regional',
//       name: 'Paid (Regional Fee)',
//       description: 'Different fees for 8 regional zones',
//       icon: '🌍'
//     }
//   ];

//   const regionalZones = [
//     { id: 'region1', name: 'Region 1', description: 'US & Canada' },
//     { id: 'region2', name: 'Region 2', description: 'Western Europe' },
//     { id: 'region3', name: 'Region 3', description: 'Eastern Europe & Russia' },
//     { id: 'region4', name: 'Region 4', description: 'Africa' },
//     { id: 'region5', name: 'Region 5', description: 'Latin America & Caribbeans' },
//     { id: 'region6', name: 'Region 6', description: 'Middle East, Asia, Eurasia, Melanesia, Micronesia, & Polynesia' },
//     { id: 'region7', name: 'Region 7', description: 'Australasia: Australia & New Zealand, Taiwan, South Korea, Japan, & Singapore' },
//     { id: 'region8', name: 'Region 8', description: 'China, Macau & Hong Kong' }
//   ];

//   return (
//     <div className="space-y-6">
//       <div>
//         <h3 className="text-lg font-semibold text-gray-900">Regional Pricing Configuration</h3>
//         <p className="text-sm text-gray-600">Configure participation fees for different regions</p>
//       </div>

//       {/* Pricing Type Selection - Radio button style */}
//       <div className="space-y-3">
//         {pricingOptions.map((option) => (
//           <div key={option.id}>
//             <div
//               className={`relative rounded-lg border cursor-pointer transition-all duration-200 ${
//                 currentPricingType === option.id
//                   ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
//                   : 'border-gray-200 hover:border-gray-300'
//               }`}
//               onClick={() => handlePricingTypeChange(option.id)}
//             >
//               <div className="p-4 flex items-center space-x-3">
//                 <div className="flex-shrink-0">
//                   <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
//                     currentPricingType === option.id
//                       ? 'border-blue-500 bg-blue-500'
//                       : 'border-gray-300'
//                   }`}>
//                     {currentPricingType === option.id && (
//                       <div className="w-2 h-2 bg-white rounded-full"></div>
//                     )}
//                   </div>
//                 </div>
//                 <span className="text-2xl">{option.icon}</span>
//                 <div className="flex-1">
//                   <h4 className="font-medium text-gray-900">{option.name}</h4>
//                   <p className="text-sm text-gray-600">{option.description}</p>
//                 </div>
//               </div>
//             </div>

//             {/* General Fee Configuration - only shows when general is selected */}
//             {option.id === 'general' && currentPricingType === 'general' && (
//               <div className="mt-3 bg-blue-50 rounded-lg p-4 space-y-4 border border-blue-200">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     <DollarSign className="w-4 h-4 inline mr-1" />
//                     Participation Fee (USD)
//                   </label>
//                   <input
//                     type="number"
//                     min="0"
//                     step="0.01"
//                     className={`block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
//                       errors.participationFee ? 'border-red-300' : 'border-gray-300'
//                     }`}
//                     placeholder="Enter amount (e.g., 1.00)"
//                     value={formData.participationFee || ''}
//                     onChange={(e) => updateFormData({ participationFee: parseFloat(e.target.value) || 0 })}
//                   />
//                   {errors.participationFee && (
//                     <p className="text-red-600 text-sm mt-1">{errors.participationFee}</p>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Regional Fee Configuration - only shows when regional is selected */}
//       {currentPricingType === 'regional' && (
//         <div className="bg-green-50 rounded-lg p-4 space-y-4 border border-green-200">
//           <div className="flex items-center space-x-2 mb-4">
//             <Globe className="w-5 h-5 text-green-600" />
//             <h4 className="font-medium text-green-800">Regional Fee Structure</h4>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {regionalZones.map((zone) => (
//               <div key={zone.id} className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   {zone.name}
//                 </label>
//                 <p className="text-xs text-gray-600 mb-1">{zone.description}</p>
//                 <div className="relative">
//                   <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                   <input
//                     type="number"
//                     min="0"
//                     step="0.01"
//                     className="block w-full pl-10 pr-3 py-2 rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
//                     placeholder="0.00"
//                     value={formData.regionalFees?.[zone.id] || ''}
//                     onChange={(e) => handleRegionalFeeChange(zone.id, e.target.value)}
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>
          
//           <div className="bg-green-100 rounded-md p-3 mt-4">
//             <div className="flex items-start space-x-2">
//               <Info className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
//               <p className="text-sm text-green-700">
//                 Set different participation fees based on economic conditions in different regions. Leave at $0.00 for free participation in specific regions.
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Processing Fee Configuration - only shows for paid options */}
//       {(currentPricingType === 'general' || currentPricingType === 'regional') && (
//         <div className="bg-gray-50 rounded-lg p-4 space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Election Participation Fee Processing Cost (%)
//             </label>
//             <div className="relative">
//               <input
//                 type="number"
//                 min="0"
//                 max="100"
//                 step="0.1"
//                 className={`block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
//                   errors.processingFeePercentage ? 'border-red-300' : 'border-gray-300'
//                 }`}
//                 placeholder="Enter percentage (e.g., 2.5)"
//                 value={formData.processingFeePercentage || ''}
//                 onChange={(e) => updateFormData({ processingFeePercentage: parseFloat(e.target.value) || 0 })}
//               />
//               <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
//             </div>
//             {errors.processingFeePercentage && (
//               <p className="text-red-600 text-sm mt-1">{errors.processingFeePercentage}</p>
//             )}
//           </div>
          
//           <div className="bg-gray-100 rounded-md p-3">
//             <h4 className="font-medium text-gray-800 mb-2">Processing fee covers:</h4>
//             <ul className="text-sm text-gray-700 space-y-1">
//               <li>• Payment processing</li>
//               <li>• Pricing regionalization & optimization</li>
//               <li>• Invoicing</li>
//               <li>• Payment recovery</li>
//               <li>• Participants payment support</li>
//             </ul>
//           </div>
//         </div>
//       )}

//       {/* Info message for paid elections */}
//       {(currentPricingType === 'general' || currentPricingType === 'regional') && (
//         <div className="bg-blue-50 rounded-md p-3 border border-blue-200">
//           <div className="flex items-start space-x-2">
//             <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
//             <p className="text-sm text-blue-700">
//               Paid elections help prevent spam voting and can fund prize pools. You have complete control over the pricing structure.
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PricingConfiguration;
//it sets two options at a time
// import { DollarSign, Globe, Info } from 'lucide-react';

// const PricingConfiguration = ({ formData, updateFormData, errors = {} }) => {
  
//   const handlePricingTypeChange = (pricingType) => {
//     const updates = { pricingType };
    
//     if (pricingType === 'free') {
//       updates.isPaid = false;
//       updates.participationFee = 0;
//       updates.regionalFees = {};
//       updates.processingFeePercentage = 0;
//     } else if (pricingType === 'general') {
//       updates.isPaid = true;
//       updates.participationFee = formData.participationFee || 0;
//       updates.regionalFees = {};
//     } else if (pricingType === 'regional') {
//       updates.isPaid = true;
//       updates.participationFee = 0;
//       updates.regionalFees = formData.regionalFees || getEmptyRegionalFees();
//     }
    
//     updateFormData(updates);
//   };

//   const getEmptyRegionalFees = () => ({
//     region1: 0, // US & Canada
//     region2: 0, // Western Europe
//     region3: 0, // Eastern Europe & Russia
//     region4: 0, // Africa
//     region5: 0, // Latin America & Caribbeans
//     region6: 0, // Middle East, Asia, Eurasia, Melanesia, Micronesia, & Polynesia
//     region7: 0, // Australasia
//     region8: 0  // China, Macau & Hong Kong
//   });

//   const handleRegionalFeeChange = (region, value) => {
//     const numericValue = parseFloat(value);
//     const updatedFees = {
//       ...formData.regionalFees,
//       [region]: isNaN(numericValue) ? 0 : numericValue
//     };
//     updateFormData({ regionalFees: updatedFees });
//   };

//   const pricingOptions = [
//     {
//       id: 'free',
//       name: 'Free',
//       description: 'No participation fee',
//       icon: '🆓'
//     },
//     {
//       id: 'general',
//       name: 'Paid (General Fee)',
//       description: 'Single fee for all participants worldwide',
//       icon: '💰'
//     },
//     {
//       id: 'regional',
//       name: 'Paid (Regional Fee)',
//       description: 'Different fees for 8 regional zones',
//       icon: '🌍'
//     }
//   ];

//   const regionalZones = [
//     { id: 'region1', name: 'Region 1', description: 'US & Canada' },
//     { id: 'region2', name: 'Region 2', description: 'Western Europe' },
//     { id: 'region3', name: 'Region 3', description: 'Eastern Europe & Russia' },
//     { id: 'region4', name: 'Region 4', description: 'Africa' },
//     { id: 'region5', name: 'Region 5', description: 'Latin America & Caribbeans' },
//     { id: 'region6', name: 'Region 6', description: 'Middle East, Asia, Eurasia, Melanesia, Micronesia, & Polynesia' },
//     { id: 'region7', name: 'Region 7', description: 'Australasia: Australia & New Zealand, Taiwan, South Korea, Japan, & Singapore' },
//     { id: 'region8', name: 'Region 8', description: 'China, Macau & Hong Kong' }
//   ];

//   return (
//     <div className="space-y-6">
//       <div>
//         <h3 className="text-lg font-semibold text-gray-900">Regional Pricing Configuration</h3>
//         <p className="text-sm text-gray-600">Configure participation fees for different regions</p>
//       </div>

//       {/* Pricing Type Selection */}
//       <div className="space-y-3">
//         {pricingOptions.map((option) => (
//           <div key={option.id}>
//             <div
//               className={`relative rounded-lg border cursor-pointer transition-all duration-200 ${
//                 (formData.pricingType || 'free') === option.id
//                   ? 'border-blue-500 bg-blue-50'
//                   : 'border-gray-200 hover:border-gray-300'
//               }`}
//               onClick={() => handlePricingTypeChange(option.id)}
//             >
//               <div className="p-4 flex items-center space-x-3">
//                 <span className="text-2xl">{option.icon}</span>
//                 <div>
//                   <h4 className="font-medium text-gray-900">{option.name}</h4>
//                   <p className="text-sm text-gray-600">{option.description}</p>
//                 </div>
//                 {(formData.pricingType || 'free') === option.id && (
//                   <div className="ml-auto">
//                     <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
//                       <div className="w-2 h-2 bg-white rounded-full"></div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* General Fee Configuration - appears right after the general option */}
//             {option.id === 'general' && formData.pricingType === 'general' && (
//               <div className="mt-3 bg-blue-50 rounded-lg p-4 space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     <DollarSign className="w-4 h-4 inline mr-1" />
//                     Participation Fee (USD)
//                   </label>
//                   <input
//                     type="number"
//                     min="0"
//                     step="0.01"
//                     className={`block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
//                       errors.participationFee ? 'border-red-300' : 'border-gray-300'
//                     }`}
//                     placeholder="Enter amount (e.g., 1.00)"
//                     value={formData.participationFee || ''}
//                     onChange={(e) => updateFormData({ participationFee: parseFloat(e.target.value) || 0 })}
//                   />
//                   {errors.participationFee && (
//                     <p className="text-red-600 text-sm mt-1">{errors.participationFee}</p>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Regional Fee Configuration */}
//       {formData.pricingType === 'regional' && (
//         <div className="bg-green-50 rounded-lg p-4 space-y-4">
//           <div className="flex items-center space-x-2 mb-4">
//             <Globe className="w-5 h-5 text-green-600" />
//             <h4 className="font-medium text-green-800">Regional Fee Structure</h4>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {regionalZones.map((zone) => (
//               <div key={zone.id} className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   {zone.name}
//                 </label>
//                 <p className="text-xs text-gray-600 mb-1">{zone.description}</p>
//                 <div className="relative">
//                   <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                   <input
//                     type="number"
//                     min="0"
//                     step="0.01"
//                     className="block w-full pl-10 pr-3 py-2 rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
//                     placeholder="0.00"
//                     value={formData.regionalFees?.[zone.id] || ''}
//                     onChange={(e) => handleRegionalFeeChange(zone.id, e.target.value)}
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>
          
//           <div className="bg-green-100 rounded-md p-3 mt-4">
//             <div className="flex items-start space-x-2">
//               <Info className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
//               <p className="text-sm text-green-700">
//                 Set different participation fees based on economic conditions in different regions. Leave at $0.00 for free participation in specific regions.
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Processing Fee Configuration */}
//       {(formData.pricingType === 'general' || formData.pricingType === 'regional') && (
//         <div className="bg-gray-50 rounded-lg p-4 space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Election Participation Fee Processing Cost (%)
//             </label>
//             <div className="relative">
//               <input
//                 type="number"
//                 min="0"
//                 max="100"
//                 step="0.1"
//                 className={`block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
//                   errors.processingFeePercentage ? 'border-red-300' : 'border-gray-300'
//                 }`}
//                 placeholder="Enter percentage (e.g., 2.5)"
//                 value={formData.processingFeePercentage || ''}
//                 onChange={(e) => updateFormData({ processingFeePercentage: parseFloat(e.target.value) || 0 })}
//               />
//               <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
//             </div>
//             {errors.processingFeePercentage && (
//               <p className="text-red-600 text-sm mt-1">{errors.processingFeePercentage}</p>
//             )}
//           </div>
          
//           <div className="bg-gray-100 rounded-md p-3">
//             <h4 className="font-medium text-gray-800 mb-2">Processing fee covers:</h4>
//             <ul className="text-sm text-gray-700 space-y-1">
//               <li>• Payment processing</li>
//               <li>• Pricing regionalization & optimization</li>
//               <li>• Invoicing</li>
//               <li>• Payment recovery</li>
//               <li>• Participants payment support</li>
//             </ul>
//           </div>
//         </div>
//       )}

//       {(formData.pricingType === 'general' || formData.pricingType === 'regional') && (
//         <div className="bg-blue-50 rounded-md p-3">
//           <div className="flex items-start space-x-2">
//             <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
//             <p className="text-sm text-blue-700">
//               Paid elections help prevent spam voting and can fund prize pools. You have complete control over the pricing structure.
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PricingConfiguration;
// import React from 'react';
// import { DollarSign, Globe, Info } from 'lucide-react';

// const PricingConfiguration = ({ formData, updateFormData, errors = {} }) => {
  
//   const handlePricingTypeChange = (pricingType) => {
//     const updates = { pricingType };
    
//     if (pricingType === 'free') {
//       updates.isPaid = false;
//       updates.participationFee = 0;
//       updates.regionalFees = {};
//       updates.processingFeePercentage = 0;
//     } else if (pricingType === 'general') {
//       updates.isPaid = true;
//       updates.participationFee = formData.participationFee || 0;
//       updates.regionalFees = {};
//     } else if (pricingType === 'regional') {
//       updates.isPaid = true;
//       updates.participationFee = 0;
//       updates.regionalFees = formData.regionalFees || getEmptyRegionalFees();
//     }
    
//     updateFormData(updates);
//   };

//   const getEmptyRegionalFees = () => ({
//     region1: 0, // US & Canada
//     region2: 0, // Western Europe
//     region3: 0, // Eastern Europe & Russia
//     region4: 0, // Africa
//     region5: 0, // Latin America & Caribbeans
//     region6: 0, // Middle East, Asia, Eurasia, Melanesia, Micronesia, & Polynesia
//     region7: 0, // Australasia
//     region8: 0  // China, Macau & Hong Kong
//   });

//   const handleRegionalFeeChange = (region, value) => {
//     const numericValue = parseFloat(value);
//     const updatedFees = {
//       ...formData.regionalFees,
//       [region]: isNaN(numericValue) ? 0 : numericValue
//     };
//     updateFormData({ regionalFees: updatedFees });
//   };

//   const pricingOptions = [
//     {
//       id: 'free',
//       name: 'Free',
//       description: 'No participation fee',
//       icon: '🆓'
//     },
//     {
//       id: 'general',
//       name: 'Paid (General Fee)',
//       description: 'Single fee for all participants worldwide',
//       icon: '💰'
//     },
//     {
//       id: 'regional',
//       name: 'Paid (Regional Fee)',
//       description: 'Different fees for 8 regional zones',
//       icon: '🌍'
//     }
//   ];

//   const regionalZones = [
//     { id: 'region1', name: 'Region 1', description: 'US & Canada' },
//     { id: 'region2', name: 'Region 2', description: 'Western Europe' },
//     { id: 'region3', name: 'Region 3', description: 'Eastern Europe & Russia' },
//     { id: 'region4', name: 'Region 4', description: 'Africa' },
//     { id: 'region5', name: 'Region 5', description: 'Latin America & Caribbeans' },
//     { id: 'region6', name: 'Region 6', description: 'Middle East, Asia, Eurasia, Melanesia, Micronesia, & Polynesia' },
//     { id: 'region7', name: 'Region 7', description: 'Australasia: Australia & New Zealand, Taiwan, South Korea, Japan, & Singapore' },
//     { id: 'region8', name: 'Region 8', description: 'China, Macau & Hong Kong' }
//   ];

//   return (
//     <div className="space-y-6">
//       <div>
//         <h3 className="text-lg font-semibold text-gray-900">Regional Pricing Configuration</h3>
//         <p className="text-sm text-gray-600">Configure participation fees for different regions</p>
//       </div>

//       {/* Pricing Type Selection */}
//       <div className="space-y-3">
//         {pricingOptions.map((option) => (
//           <div
//             key={option.id}
//             className={`relative rounded-lg border cursor-pointer transition-all duration-200 ${
//               (formData.pricingType || 'free') === option.id
//                 ? 'border-blue-500 bg-blue-50'
//                 : 'border-gray-200 hover:border-gray-300'
//             }`}
//             onClick={() => handlePricingTypeChange(option.id)}
//           >
//             <div className="p-4 flex items-center space-x-3">
//               <span className="text-2xl">{option.icon}</span>
//               <div>
//                 <h4 className="font-medium text-gray-900">{option.name}</h4>
//                 <p className="text-sm text-gray-600">{option.description}</p>
//               </div>
//               {(formData.pricingType || 'free') === option.id && (
//                 <div className="ml-auto">
//                   <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
//                     <div className="w-2 h-2 bg-white rounded-full"></div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* General Fee Configuration */}
//       {formData.pricingType === 'general' && (
//         <div className="bg-blue-50 rounded-lg p-4 space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               <DollarSign className="w-4 h-4 inline mr-1" />
//               Participation Fee (USD)
//             </label>
//             <input
//               type="number"
//               min="0"
//               step="0.01"
//               className={`block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
//                 errors.participationFee ? 'border-red-300' : 'border-gray-300'
//               }`}
//               placeholder="Enter amount (e.g., 1.00)"
//               value={formData.participationFee || ''}
//               onChange={(e) => updateFormData({ participationFee: parseFloat(e.target.value) || 0 })}
//             />
//             {errors.participationFee && (
//               <p className="text-red-600 text-sm mt-1">{errors.participationFee}</p>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Regional Fee Configuration */}
//       {formData.pricingType === 'regional' && (
//         <div className="bg-green-50 rounded-lg p-4 space-y-4">
//           <div className="flex items-center space-x-2 mb-4">
//             <Globe className="w-5 h-5 text-green-600" />
//             <h4 className="font-medium text-green-800">Regional Fee Structure</h4>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {regionalZones.map((zone) => (
//               <div key={zone.id} className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   {zone.name}
//                 </label>
//                 <p className="text-xs text-gray-600 mb-1">{zone.description}</p>
//                 <div className="relative">
//                   <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                   <input
//                     type="number"
//                     min="0"
//                     step="0.01"
//                     className="block w-full pl-10 pr-3 py-2 rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
//                     placeholder="0.00"
//                     value={formData.regionalFees?.[zone.id] || ''}
//                     onChange={(e) => handleRegionalFeeChange(zone.id, e.target.value)}
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>
          
//           <div className="bg-green-100 rounded-md p-3 mt-4">
//             <div className="flex items-start space-x-2">
//               <Info className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
//               <p className="text-sm text-green-700">
//                 Set different participation fees based on economic conditions in different regions. Leave at $0.00 for free participation in specific regions.
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Processing Fee Configuration */}
//       {(formData.pricingType === 'general' || formData.pricingType === 'regional') && (
//         <div className="bg-gray-50 rounded-lg p-4 space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Election Participation Fee Processing Cost (%)
//             </label>
//             <div className="relative">
//               <input
//                 type="number"
//                 min="0"
//                 max="100"
//                 step="0.1"
//                 className={`block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
//                   errors.processingFeePercentage ? 'border-red-300' : 'border-gray-300'
//                 }`}
//                 placeholder="Enter percentage (e.g., 2.5)"
//                 value={formData.processingFeePercentage || ''}
//                 onChange={(e) => updateFormData({ processingFeePercentage: parseFloat(e.target.value) || 0 })}
//               />
//               <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
//             </div>
//             {errors.processingFeePercentage && (
//               <p className="text-red-600 text-sm mt-1">{errors.processingFeePercentage}</p>
//             )}
//           </div>
          
//           <div className="bg-gray-100 rounded-md p-3">
//             <h4 className="font-medium text-gray-800 mb-2">Processing fee covers:</h4>
//             <ul className="text-sm text-gray-700 space-y-1">
//               <li>• Payment processing</li>
//               <li>• Pricing regionalization & optimization</li>
//               <li>• Invoicing</li>
//               <li>• Payment recovery</li>
//               <li>• Participants payment support</li>
//             </ul>
//           </div>
//         </div>
//       )}

//       {(formData.pricingType === 'general' || formData.pricingType === 'regional') && (
//         <div className="bg-blue-50 rounded-md p-3">
//           <div className="flex items-start space-x-2">
//             <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
//             <p className="text-sm text-blue-700">
//               Paid elections help prevent spam voting and can fund prize pools. You have complete control over the pricing structure.
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PricingConfiguration;