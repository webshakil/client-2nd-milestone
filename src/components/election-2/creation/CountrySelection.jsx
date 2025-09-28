import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, XMarkIcon, GlobeAltIcon, MapPinIcon } from '@heroicons/react/24/outline';
import CountryMultiSelect from '../forms/CountryMultiSelect';
import ValidationErrors from '../common/ValidationErrors';
import countryAPI from '../../../services/election/countryAPI';
// Updated import to use static country API
//import countryAPI from '../../../services/election/staticCountryAPI';

const CountrySelection = ({ formData, updateFormData, errors }) => {
  const [countries, setCountries] = useState([]);
  const [continents, setContinents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContinents, setSelectedContinents] = useState([]);

  useEffect(() => {
    loadCountriesData();
  }, []);

  const loadCountriesData = async () => {
    try {
      setLoading(true);
      const [countriesResponse, continentsResponse] = await Promise.all([
        countryAPI.getAllCountries(),
        countryAPI.getContinents()
      ]);

      if (countriesResponse.success) {
        setCountries(countriesResponse.data);
      }

      if (continentsResponse.success) {
        setContinents(continentsResponse.data);
      }
    } catch (error) {
      console.error('Error loading countries data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = (permission) => {
    updateFormData({
      permissionToVote: permission,
      isCountrySpecific: permission === 'country_specific',
      countries: permission === 'country_specific' ? (formData.countries || []) : []
    });
  };

  const handleCountrySelection = (selectedCountries) => {
    updateFormData({ countries: selectedCountries });
  };

  const handleContinentFilter = (continent) => {
    const isSelected = selectedContinents.includes(continent);
    let newSelectedContinents;

    if (isSelected) {
      newSelectedContinents = selectedContinents.filter(c => c !== continent);
    } else {
      newSelectedContinents = [...selectedContinents, continent];
    }

    setSelectedContinents(newSelectedContinents);

    // Auto-select all countries from selected continents
    if (newSelectedContinents.length > 0) {
      const continentCountries = countries
        .filter(country => newSelectedContinents.includes(country.continent))
        .map(country => country.id);

      const existingCountries = (formData.countries || []).filter(countryId => {
        const country = countries.find(c => c.id === countryId);
        return country && !newSelectedContinents.includes(country.continent);
      });

      updateFormData({ countries: [...existingCountries, ...continentCountries] });
    }
  };
/*eslint-disable*/
  const getSelectedCountriesText = () => {
    const countryCount = formData.countries?.length || 0;
    if (countryCount === 0) return 'No countries selected';
    if (countryCount === 1) return '1 country selected';
    return `${countryCount} countries selected`;
  };

  const getSelectedCountriesList = () => {
    if (!formData.countries || !Array.isArray(formData.countries)) return [];
    
    return countries
      .filter(country => formData.countries.includes(country.id))
      .map(country => ({
        id: country.id,
        name: country.country_name,
        flag: country.flag,
        displayName: `${country.flag} ${country.country_name}`
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  const renderCountryDisplay = () => {
    const selectedCountries = getSelectedCountriesList();
    
    if (selectedCountries.length === 0) {
      return <p>⚠️ No countries selected. Please select at least one country.</p>;
    }
    
    if (selectedCountries.length <= 3) {
      const countryNames = selectedCountries.map(c => c.displayName).join(', ');
      return <p>🌍 This election is restricted to residents of: {countryNames}.</p>;
    } else if (selectedCountries.length <= 10) {
      const countryNames = selectedCountries.map(c => c.displayName).join(', ');
      return (
        <div>
          <p>🌍 This election is restricted to residents of the following countries:</p>
          <p className="mt-1 font-medium">{countryNames}</p>
        </div>
      );
    } else {
      const displayedCountries = selectedCountries.slice(0, 8).map(c => c.displayName);
      const allCountryNames = selectedCountries.map(c => c.displayName);
      
      return (
        <div>
          <p>🌍 This election is restricted to residents of {selectedCountries.length} countries:</p>
          <p className="mt-1 font-medium text-sm">
            {displayedCountries.join(', ')} and {selectedCountries.length - 8} more...
          </p>
          <details className="mt-2">
            <summary className="cursor-pointer text-xs text-blue-600 hover:text-blue-800">
              View all {selectedCountries.length} countries
            </summary>
            <div className="mt-2 p-2 bg-white border border-gray-200 rounded text-xs">
              {allCountryNames.join(', ')}
            </div>
          </details>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading countries...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-medium text-gray-900">Country & Access Settings</h3>
        <p className="mt-1 text-sm text-gray-600">
          Configure geographic access restrictions for your election.
        </p>
      </div>

      {/* Permission Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Who can participate in this election? *
        </label>

        <div className="space-y-3">
          {/* World Citizens */}
          <div 
            className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
              formData.permissionToVote === 'world_citizens'
                ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onClick={() => handlePermissionChange('world_citizens')}
          >
            <div className="flex items-start">
              <input
                type="radio"
                name="permissionToVote"
                value="world_citizens"
                checked={formData.permissionToVote === 'world_citizens'}
                onChange={() => handlePermissionChange('world_citizens')}
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <div className="ml-3 flex-1">
                <div className="flex items-center">
                  <GlobeAltIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <h4 className="text-sm font-medium text-gray-900">World Citizens</h4>
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  Anyone from anywhere in the world can participate in this election.
                  No geographic restrictions will be applied.
                </p>
              </div>
            </div>
          </div>

          {/* Organization Members */}
          <div 
            className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
              formData.permissionToVote === 'organization_members'
                ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onClick={() => handlePermissionChange('organization_members')}
          >
            <div className="flex items-start">
              <input
                type="radio"
                name="permissionToVote"
                value="organization_members"
                checked={formData.permissionToVote === 'organization_members'}
                onChange={() => handlePermissionChange('organization_members')}
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <div className="ml-3 flex-1">
                <div className="flex items-center">
                  <div className="h-5 w-5 bg-gray-400 rounded mr-2"></div>
                  <h4 className="text-sm font-medium text-gray-900">Organization Members</h4>
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  Only registered members of your organization can participate.
                  Access is controlled through membership verification.
                </p>
              </div>
            </div>
          </div>

          {/* Country Specific */}
          <div 
            className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
              formData.permissionToVote === 'country_specific'
                ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onClick={() => handlePermissionChange('country_specific')}
          >
            <div className="flex items-start">
              <input
                type="radio"
                name="permissionToVote"
                value="country_specific"
                checked={formData.permissionToVote === 'country_specific'}
                onChange={() => handlePermissionChange('country_specific')}
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <div className="ml-3 flex-1">
                <div className="flex items-center">
                  <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <h4 className="text-sm font-medium text-gray-900">Specific Countries</h4>
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  Only residents of selected countries can participate.
                  You can choose one or multiple countries.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Country Selection (only show if country_specific is selected) */}
      {formData.permissionToVote === 'country_specific' && (
        <div className="border-t border-gray-200 pt-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Countries *
              </label>
              <p className="text-sm text-gray-600 mb-4">
                Choose which countries' residents can participate in this election.
              </p>
            </div>

            {/* Quick Continent Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Select by Continent
              </label>
              <div className="flex flex-wrap gap-2">
                {continents.map((continent) => (
                  <button
                    key={continent}
                    type="button"
                    onClick={() => handleContinentFilter(continent)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      selectedContinents.includes(continent)
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {continent}
                  </button>
                ))}
              </div>
            </div>

            {/* Country Multi-Select */}
            <div>
              <CountryMultiSelect
                countries={countries}
                selectedCountries={formData.countries || []}
                onSelectionChange={handleCountrySelection}
                error={errors.countries}
                continentFilter={selectedContinents}
                key={`countries-${countries.length}-${selectedContinents.join('-')}`} // Force re-render when data changes
              />
              <ValidationErrors errors={errors.countries ? [errors.countries] : []} />
            </div>

            {/* Selected Countries Summary */}
            {(formData.countries?.length || 0) > 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                <h5 className="text-sm font-medium text-gray-900 mb-2">
                  Selected Countries ({formData.countries.length})
                </h5>
                <div className="max-h-32 overflow-y-auto">
                  <div className="flex flex-wrap gap-1">
                    {getSelectedCountriesList().map((countryObj) => (
                      <span
                        key={`selected-${countryObj.id}`}
                        className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {countryObj.displayName}
                        <button
                          type="button"
                          onClick={() => {
                            const newCountries = (formData.countries || []).filter(id => id !== countryObj.id);
                            updateFormData({ countries: newCountries });
                          }}
                          className="ml-1 hover:text-blue-600"
                        >
                          <XMarkIcon className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Access Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h5 className="text-sm font-medium text-blue-900 mb-2">Access Summary</h5>
        <div className="text-sm text-blue-700">
          {formData.permissionToVote === 'world_citizens' && (
            <p>✅ This election is open to anyone worldwide with no geographic restrictions.</p>
          )}
          {formData.permissionToVote === 'organization_members' && (
            <p>🏢 This election is restricted to verified members of your organization only.</p>
          )}
          {formData.permissionToVote === 'country_specific' && (
            <div>
              {renderCountryDisplay()}
            </div>
          )}
        </div>
      </div>

      {/* Geographic Verification Note */}
      {formData.permissionToVote === 'country_specific' && (formData.countries?.length || 0) > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <h5 className="text-sm font-medium text-yellow-900 mb-2">Geographic Verification</h5>
          <div className="text-sm text-yellow-700">
            <p className="mb-2">
              Voters will be verified using one or more of the following methods:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>IP address geolocation</li>
              <li>Government-issued ID verification</li>
              <li>Address verification</li>
              <li>Phone number country code verification</li>
            </ul>
            <p className="mt-2 text-xs">
              Note: Some verification methods may require additional setup in the Security settings.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CountrySelection;
// import React, { useState, useEffect } from 'react';
// import { ChevronDownIcon, XMarkIcon, GlobeAltIcon, MapPinIcon } from '@heroicons/react/24/outline';
// import CountryMultiSelect from '../forms/CountryMultiSelect';
// import ValidationErrors from '../common/ValidationErrors';
// import countryAPI from '../../../services/election/countryAPI';
// //import { countryAPI } from '../../../services/election-2/countryAPI';

// const CountrySelection = ({ formData, updateFormData, errors }) => {
//   const [countries, setCountries] = useState([]);
//   const [continents, setContinents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedContinents, setSelectedContinents] = useState([]);

//   useEffect(() => {
//     loadCountriesData();
//   }, []);

//   const loadCountriesData = async () => {
//     try {
//       setLoading(true);
//       const [countriesResponse, continentsResponse] = await Promise.all([
//         countryAPI.getAllCountries(),
//         countryAPI.getContinents()
//       ]);

//       if (countriesResponse.success) {
//         setCountries(countriesResponse.data);
//       }

//       if (continentsResponse.success) {
//         setContinents(continentsResponse.data);
//       }
//     } catch (error) {
//       console.error('Error loading countries data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePermissionChange = (permission) => {
//     updateFormData({
//       permissionToVote: permission,
//       isCountrySpecific: permission === 'country_specific',
//       countries: permission === 'country_specific' ? formData.countries : []
//     });
//   };

//   const handleCountrySelection = (selectedCountries) => {
//     updateFormData({ countries: selectedCountries });
//   };

//   const handleContinentFilter = (continent) => {
//     const isSelected = selectedContinents.includes(continent);
//     let newSelectedContinents;

//     if (isSelected) {
//       newSelectedContinents = selectedContinents.filter(c => c !== continent);
//     } else {
//       newSelectedContinents = [...selectedContinents, continent];
//     }

//     setSelectedContinents(newSelectedContinents);

//     // Auto-select all countries from selected continents
//     if (newSelectedContinents.length > 0) {
//       const continentCountries = countries
//         .filter(country => newSelectedContinents.includes(country.continent))
//         .map(country => country.id);

//       const existingCountries = formData.countries.filter(countryId => {
//         const country = countries.find(c => c.id === countryId);
//         return country && !newSelectedContinents.includes(country.continent);
//       });

//       updateFormData({ countries: [...existingCountries, ...continentCountries] });
//     }
//   };
// /*eslint-disable*/
//   const getSelectedCountriesText = () => {
//     if (formData.countries.length === 0) return 'No countries selected';
//     if (formData.countries.length === 1) return '1 country selected';
//     return `${formData.countries.length} countries selected`;
//   };

//   const getSelectedCountriesList = () => {
//     return countries
//       .filter(country => formData.countries.includes(country.id))
//       .map(country => country.country_name)
//       .sort();
//   };

//   const renderCountryDisplay = () => {
//     const selectedCountries = getSelectedCountriesList();
    
//     if (selectedCountries.length === 0) {
//       return <p>⚠️ No countries selected. Please select at least one country.</p>;
//     }
    
//     if (selectedCountries.length <= 3) {
//       return <p>🌍 This election is restricted to residents of: {selectedCountries.join(', ')}.</p>;
//     } else if (selectedCountries.length <= 10) {
//       return (
//         <div>
//           <p>🌍 This election is restricted to residents of the following countries:</p>
//           <p className="mt-1 font-medium">{selectedCountries.join(', ')}</p>
//         </div>
//       );
//     } else {
//       return (
//         <div>
//           <p>🌍 This election is restricted to residents of {selectedCountries.length} countries:</p>
//           <p className="mt-1 font-medium text-sm">
//             {selectedCountries.slice(0, 8).join(', ')} and {selectedCountries.length - 8} more...
//           </p>
//           <details className="mt-2">
//             <summary className="cursor-pointer text-xs text-blue-600 hover:text-blue-800">
//               View all {selectedCountries.length} countries
//             </summary>
//             <div className="mt-2 p-2 bg-white border border-gray-200 rounded text-xs">
//               {selectedCountries.join(', ')}
//             </div>
//           </details>
//         </div>
//       );
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center py-12">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//         <span className="ml-2 text-gray-600">Loading countries...</span>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="border-b border-gray-200 pb-4">
//         <h3 className="text-lg font-medium text-gray-900">Country & Access Settings</h3>
//         <p className="mt-1 text-sm text-gray-600">
//           Configure geographic access restrictions for your election.
//         </p>
//       </div>

//       {/* Permission Type Selection */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-4">
//           Who can participate in this election? *
//         </label>

//         <div className="space-y-3">
//           {/* World Citizens */}
//           <div 
//             className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
//               formData.permissionToVote === 'world_citizens'
//                 ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
//                 : 'border-gray-300 hover:border-gray-400'
//             }`}
//             onClick={() => handlePermissionChange('world_citizens')}
//           >
//             <div className="flex items-start">
//               <input
//                 type="radio"
//                 name="permissionToVote"
//                 value="world_citizens"
//                 checked={formData.permissionToVote === 'world_citizens'}
//                 onChange={() => handlePermissionChange('world_citizens')}
//                 className="mt-1 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
//               />
//               <div className="ml-3 flex-1">
//                 <div className="flex items-center">
//                   <GlobeAltIcon className="h-5 w-5 text-gray-400 mr-2" />
//                   <h4 className="text-sm font-medium text-gray-900">World Citizens</h4>
//                 </div>
//                 <p className="mt-1 text-sm text-gray-600">
//                   Anyone from anywhere in the world can participate in this election.
//                   No geographic restrictions will be applied.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Organization Members */}
//           <div 
//             className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
//               formData.permissionToVote === 'organization_members'
//                 ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
//                 : 'border-gray-300 hover:border-gray-400'
//             }`}
//             onClick={() => handlePermissionChange('organization_members')}
//           >
//             <div className="flex items-start">
//               <input
//                 type="radio"
//                 name="permissionToVote"
//                 value="organization_members"
//                 checked={formData.permissionToVote === 'organization_members'}
//                 onChange={() => handlePermissionChange('organization_members')}
//                 className="mt-1 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
//               />
//               <div className="ml-3 flex-1">
//                 <div className="flex items-center">
//                   <div className="h-5 w-5 bg-gray-400 rounded mr-2"></div>
//                   <h4 className="text-sm font-medium text-gray-900">Organization Members</h4>
//                 </div>
//                 <p className="mt-1 text-sm text-gray-600">
//                   Only registered members of your organization can participate.
//                   Access is controlled through membership verification.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Country Specific */}
//           <div 
//             className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
//               formData.permissionToVote === 'country_specific'
//                 ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
//                 : 'border-gray-300 hover:border-gray-400'
//             }`}
//             onClick={() => handlePermissionChange('country_specific')}
//           >
//             <div className="flex items-start">
//               <input
//                 type="radio"
//                 name="permissionToVote"
//                 value="country_specific"
//                 checked={formData.permissionToVote === 'country_specific'}
//                 onChange={() => handlePermissionChange('country_specific')}
//                 className="mt-1 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
//               />
//               <div className="ml-3 flex-1">
//                 <div className="flex items-center">
//                   <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
//                   <h4 className="text-sm font-medium text-gray-900">Specific Countries</h4>
//                 </div>
//                 <p className="mt-1 text-sm text-gray-600">
//                   Only residents of selected countries can participate.
//                   You can choose one or multiple countries.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Country Selection (only show if country_specific is selected) */}
//       {formData.permissionToVote === 'country_specific' && (
//         <div className="border-t border-gray-200 pt-6">
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Select Countries *
//               </label>
//               <p className="text-sm text-gray-600 mb-4">
//                 Choose which countries' residents can participate in this election.
//               </p>
//             </div>

//             {/* Quick Continent Filters */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Quick Select by Continent
//               </label>
//               <div className="flex flex-wrap gap-2">
//                 {continents.map((continent) => (
//                   <button
//                     key={continent}
//                     type="button"
//                     onClick={() => handleContinentFilter(continent)}
//                     className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
//                       selectedContinents.includes(continent)
//                         ? 'bg-blue-100 text-blue-800 border border-blue-300'
//                         : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
//                     }`}
//                   >
//                     {continent}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Country Multi-Select */}
//             <div>
//               <CountryMultiSelect
//                 countries={countries}
//                 selectedCountries={formData.countries}
//                 onSelectionChange={handleCountrySelection}
//                 error={errors.countries}
//                 continentFilter={selectedContinents}
//               />
//               <ValidationErrors errors={errors.countries ? [errors.countries] : []} />
//             </div>

//             {/* Selected Countries Summary */}
//             {formData.countries.length > 0 && (
//               <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
//                 <h5 className="text-sm font-medium text-gray-900 mb-2">
//                   Selected Countries ({formData.countries.length})
//                 </h5>
//                 <div className="max-h-32 overflow-y-auto">
//                   <div className="flex flex-wrap gap-1">
//                     {getSelectedCountriesList().map((countryName) => (
//                       <span
//                         key={countryName}
//                         className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"
//                       >
//                         {countryName}
//                         <button
//                           type="button"
//                           onClick={() => {
//                             const country = countries.find(c => c.country_name === countryName);
//                             if (country) {
//                               const newCountries = formData.countries.filter(id => id !== country.id);
//                               updateFormData({ countries: newCountries });
//                             }
//                           }}
//                           className="ml-1 hover:text-blue-600"
//                         >
//                           <XMarkIcon className="h-3 w-3" />
//                         </button>
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Access Summary */}
//       <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
//         <h5 className="text-sm font-medium text-blue-900 mb-2">Access Summary</h5>
//         <div className="text-sm text-blue-700">
//           {formData.permissionToVote === 'world_citizens' && (
//             <p>✅ This election is open to anyone worldwide with no geographic restrictions.</p>
//           )}
//           {formData.permissionToVote === 'organization_members' && (
//             <p>🏢 This election is restricted to verified members of your organization only.</p>
//           )}
//           {formData.permissionToVote === 'country_specific' && (
//             <div>
//               {renderCountryDisplay()}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Geographic Verification Note */}
//       {formData.permissionToVote === 'country_specific' && formData.countries.length > 0 && (
//         <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
//           <h5 className="text-sm font-medium text-yellow-900 mb-2">Geographic Verification</h5>
//           <div className="text-sm text-yellow-700">
//             <p className="mb-2">
//               Voters will be verified using one or more of the following methods:
//             </p>
//             <ul className="list-disc list-inside space-y-1">
//               <li>IP address geolocation</li>
//               <li>Government-issued ID verification</li>
//               <li>Address verification</li>
//               <li>Phone number country code verification</li>
//             </ul>
//             <p className="mt-2 text-xs">
//               Note: Some verification methods may require additional setup in the Security settings.
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CountrySelection;
// import React, { useState, useEffect } from 'react';
// import { ChevronDownIcon, XMarkIcon, GlobeAltIcon, MapPinIcon } from '@heroicons/react/24/outline';
// import CountryMultiSelect from '../forms/CountryMultiSelect';
// import ValidationErrors from '../common/ValidationErrors';
// import { countryAPI } from '../../../services/election-2/countryAPI';

// const CountrySelection = ({ formData, updateFormData, errors }) => {
//   const [countries, setCountries] = useState([]);
//   const [continents, setContinents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedContinents, setSelectedContinents] = useState([]);

//   useEffect(() => {
//     loadCountriesData();
//   }, []);

//   const loadCountriesData = async () => {
//     try {
//       setLoading(true);
//       const [countriesResponse, continentsResponse] = await Promise.all([
//         countryAPI.getAllCountries(),
//         countryAPI.getContinents()
//       ]);

//       if (countriesResponse.success) {
//         setCountries(countriesResponse.data);
//       }

//       if (continentsResponse.success) {
//         setContinents(continentsResponse.data);
//       }
//     } catch (error) {
//       console.error('Error loading countries data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePermissionChange = (permission) => {
//     updateFormData({
//       permissionToVote: permission,
//       isCountrySpecific: permission === 'country_specific',
//       countries: permission === 'country_specific' ? formData.countries : []
//     });
//   };

//   const handleCountrySelection = (selectedCountries) => {
//     updateFormData({ countries: selectedCountries });
//   };

//   const handleContinentFilter = (continent) => {
//     const isSelected = selectedContinents.includes(continent);
//     let newSelectedContinents;

//     if (isSelected) {
//       newSelectedContinents = selectedContinents.filter(c => c !== continent);
//     } else {
//       newSelectedContinents = [...selectedContinents, continent];
//     }

//     setSelectedContinents(newSelectedContinents);

//     // Auto-select all countries from selected continents
//     if (newSelectedContinents.length > 0) {
//       const continentCountries = countries
//         .filter(country => newSelectedContinents.includes(country.continent))
//         .map(country => country.id);

//       const existingCountries = formData.countries.filter(countryId => {
//         const country = countries.find(c => c.id === countryId);
//         return country && !newSelectedContinents.includes(country.continent);
//       });

//       updateFormData({ countries: [...existingCountries, ...continentCountries] });
//     }
//   };

//   const getSelectedCountriesText = () => {
//     if (formData.countries.length === 0) return 'No countries selected';
//     if (formData.countries.length === 1) return '1 country selected';
//     return `${formData.countries.length} countries selected`;
//   };

//   const getSelectedCountriesList = () => {
//     return countries
//       .filter(country => formData.countries.includes(country.id))
//       .map(country => country.country_name)
//       .sort();
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center py-12">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//         <span className="ml-2 text-gray-600">Loading countries...</span>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="border-b border-gray-200 pb-4">
//         <h3 className="text-lg font-medium text-gray-900">Country & Access Settings</h3>
//         <p className="mt-1 text-sm text-gray-600">
//           Configure geographic access restrictions for your election.
//         </p>
//       </div>

//       {/* Permission Type Selection */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-4">
//           Who can participate in this election? *
//         </label>

//         <div className="space-y-3">
//           {/* World Citizens */}
//           <div 
//             className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
//               formData.permissionToVote === 'world_citizens'
//                 ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
//                 : 'border-gray-300 hover:border-gray-400'
//             }`}
//             onClick={() => handlePermissionChange('world_citizens')}
//           >
//             <div className="flex items-start">
//               <input
//                 type="radio"
//                 name="permissionToVote"
//                 value="world_citizens"
//                 checked={formData.permissionToVote === 'world_citizens'}
//                 onChange={() => handlePermissionChange('world_citizens')}
//                 className="mt-1 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
//               />
//               <div className="ml-3 flex-1">
//                 <div className="flex items-center">
//                   <GlobeAltIcon className="h-5 w-5 text-gray-400 mr-2" />
//                   <h4 className="text-sm font-medium text-gray-900">World Citizens</h4>
//                 </div>
//                 <p className="mt-1 text-sm text-gray-600">
//                   Anyone from anywhere in the world can participate in this election.
//                   No geographic restrictions will be applied.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Organization Members */}
//           <div 
//             className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
//               formData.permissionToVote === 'organization_members'
//                 ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
//                 : 'border-gray-300 hover:border-gray-400'
//             }`}
//             onClick={() => handlePermissionChange('organization_members')}
//           >
//             <div className="flex items-start">
//               <input
//                 type="radio"
//                 name="permissionToVote"
//                 value="organization_members"
//                 checked={formData.permissionToVote === 'organization_members'}
//                 onChange={() => handlePermissionChange('organization_members')}
//                 className="mt-1 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
//               />
//               <div className="ml-3 flex-1">
//                 <div className="flex items-center">
//                   <div className="h-5 w-5 bg-gray-400 rounded mr-2"></div>
//                   <h4 className="text-sm font-medium text-gray-900">Organization Members</h4>
//                 </div>
//                 <p className="mt-1 text-sm text-gray-600">
//                   Only registered members of your organization can participate.
//                   Access is controlled through membership verification.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Country Specific */}
//           <div 
//             className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
//               formData.permissionToVote === 'country_specific'
//                 ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
//                 : 'border-gray-300 hover:border-gray-400'
//             }`}
//             onClick={() => handlePermissionChange('country_specific')}
//           >
//             <div className="flex items-start">
//               <input
//                 type="radio"
//                 name="permissionToVote"
//                 value="country_specific"
//                 checked={formData.permissionToVote === 'country_specific'}
//                 onChange={() => handlePermissionChange('country_specific')}
//                 className="mt-1 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
//               />
//               <div className="ml-3 flex-1">
//                 <div className="flex items-center">
//                   <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
//                   <h4 className="text-sm font-medium text-gray-900">Specific Countries</h4>
//                 </div>
//                 <p className="mt-1 text-sm text-gray-600">
//                   Only residents of selected countries can participate.
//                   You can choose one or multiple countries.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Country Selection (only show if country_specific is selected) */}
//       {formData.permissionToVote === 'country_specific' && (
//         <div className="border-t border-gray-200 pt-6">
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Select Countries *
//               </label>
//               <p className="text-sm text-gray-600 mb-4">
//                 Choose which countries' residents can participate in this election.
//               </p>
//             </div>

//             {/* Quick Continent Filters */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Quick Select by Continent
//               </label>
//               <div className="flex flex-wrap gap-2">
//                 {continents.map((continent) => (
//                   <button
//                     key={continent}
//                     type="button"
//                     onClick={() => handleContinentFilter(continent)}
//                     className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
//                       selectedContinents.includes(continent)
//                         ? 'bg-blue-100 text-blue-800 border border-blue-300'
//                         : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
//                     }`}
//                   >
//                     {continent}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Country Multi-Select */}
//             <div>
//               <CountryMultiSelect
//                 countries={countries}
//                 selectedCountries={formData.countries}
//                 onSelectionChange={handleCountrySelection}
//                 error={errors.countries}
//                 continentFilter={selectedContinents}
//               />
//               <ValidationErrors errors={errors.countries ? [errors.countries] : []} />
//             </div>

//             {/* Selected Countries Summary */}
//             {formData.countries.length > 0 && (
//               <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
//                 <h5 className="text-sm font-medium text-gray-900 mb-2">
//                   Selected Countries ({formData.countries.length})
//                 </h5>
//                 <div className="max-h-32 overflow-y-auto">
//                   <div className="flex flex-wrap gap-1">
//                     {getSelectedCountriesList().map((countryName) => (
//                       <span
//                         key={countryName}
//                         className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"
//                       >
//                         {countryName}
//                         <button
//                           type="button"
//                           onClick={() => {
//                             const country = countries.find(c => c.country_name === countryName);
//                             if (country) {
//                               const newCountries = formData.countries.filter(id => id !== country.id);
//                               updateFormData({ countries: newCountries });
//                             }
//                           }}
//                           className="ml-1 hover:text-blue-600"
//                         >
//                           <XMarkIcon className="h-3 w-3" />
//                         </button>
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Access Summary */}
//       <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
//         <h5 className="text-sm font-medium text-blue-900 mb-2">Access Summary</h5>
//         <div className="text-sm text-blue-700">
//           {formData.permissionToVote === 'world_citizens' && (
//             <p>✅ This election is open to anyone worldwide with no geographic restrictions.</p>
//           )}
//           {formData.permissionToVote === 'organization_members' && (
//             <p>🏢 This election is restricted to verified members of your organization only.</p>
//           )}
//           {formData.permissionToVote === 'country_specific' && (
//             <div>
//               {formData.countries.length === 0 ? (
//                 <p>⚠️ No countries selected. Please select at least one country.</p>
//               ) : (
//                 <p>🌍 This election is restricted to residents of {getSelectedCountriesText()}.</p>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Geographic Verification Note */}
//       {formData.permissionToVote === 'country_specific' && formData.countries.length > 0 && (
//         <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
//           <h5 className="text-sm font-medium text-yellow-900 mb-2">Geographic Verification</h5>
//           <div className="text-sm text-yellow-700">
//             <p className="mb-2">
//               Voters will be verified using one or more of the following methods:
//             </p>
//             <ul className="list-disc list-inside space-y-1">
//               <li>IP address geolocation</li>
//               <li>Government-issued ID verification</li>
//               <li>Address verification</li>
//               <li>Phone number country code verification</li>
//             </ul>
//             <p className="mt-2 text-xs">
//               Note: Some verification methods may require additional setup in the Security settings.
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CountrySelection;