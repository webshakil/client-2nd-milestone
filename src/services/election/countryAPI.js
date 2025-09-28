// Static countries data with flags
const STATIC_COUNTRIES = [
  // North America
  { id: 1, country_name: 'United States', country_code: 'US', continent: 'North America', phone_code: '+1', flag: '🇺🇸' },
  { id: 2, country_name: 'Canada', country_code: 'CA', continent: 'North America', phone_code: '+1', flag: '🇨🇦' },
  { id: 3, country_name: 'Mexico', country_code: 'MX', continent: 'North America', phone_code: '+52', flag: '🇲🇽' },
  
  // Europe
  { id: 4, country_name: 'United Kingdom', country_code: 'GB', continent: 'Europe', phone_code: '+44', flag: '🇬🇧' },
  { id: 5, country_name: 'Germany', country_code: 'DE', continent: 'Europe', phone_code: '+49', flag: '🇩🇪' },
  { id: 6, country_name: 'France', country_code: 'FR', continent: 'Europe', phone_code: '+33', flag: '🇫🇷' },
  { id: 7, country_name: 'Italy', country_code: 'IT', continent: 'Europe', phone_code: '+39', flag: '🇮🇹' },
  { id: 8, country_name: 'Spain', country_code: 'ES', continent: 'Europe', phone_code: '+34', flag: '🇪🇸' },
  { id: 9, country_name: 'Netherlands', country_code: 'NL', continent: 'Europe', phone_code: '+31', flag: '🇳🇱' },
  { id: 10, country_name: 'Switzerland', country_code: 'CH', continent: 'Europe', phone_code: '+41', flag: '🇨🇭' },
  { id: 11, country_name: 'Sweden', country_code: 'SE', continent: 'Europe', phone_code: '+46', flag: '🇸🇪' },
  { id: 12, country_name: 'Norway', country_code: 'NO', continent: 'Europe', phone_code: '+47', flag: '🇳🇴' },
  { id: 13, country_name: 'Denmark', country_code: 'DK', continent: 'Europe', phone_code: '+45', flag: '🇩🇰' },
  { id: 14, country_name: 'Finland', country_code: 'FI', continent: 'Europe', phone_code: '+358', flag: '🇫🇮' },
  { id: 15, country_name: 'Austria', country_code: 'AT', continent: 'Europe', phone_code: '+43', flag: '🇦🇹' },
  { id: 16, country_name: 'Belgium', country_code: 'BE', continent: 'Europe', phone_code: '+32', flag: '🇧🇪' },
  { id: 17, country_name: 'Portugal', country_code: 'PT', continent: 'Europe', phone_code: '+351', flag: '🇵🇹' },
  { id: 18, country_name: 'Ireland', country_code: 'IE', continent: 'Europe', phone_code: '+353', flag: '🇮🇪' },
  { id: 19, country_name: 'Poland', country_code: 'PL', continent: 'Europe', phone_code: '+48', flag: '🇵🇱' },
  { id: 20, country_name: 'Czech Republic', country_code: 'CZ', continent: 'Europe', phone_code: '+420', flag: '🇨🇿' },
  { id: 21, country_name: 'Hungary', country_code: 'HU', continent: 'Europe', phone_code: '+36', flag: '🇭🇺' },
  { id: 22, country_name: 'Greece', country_code: 'GR', continent: 'Europe', phone_code: '+30', flag: '🇬🇷' },
  { id: 23, country_name: 'Turkey', country_code: 'TR', continent: 'Europe', phone_code: '+90', flag: '🇹🇷' },
  { id: 24, country_name: 'Russia', country_code: 'RU', continent: 'Europe', phone_code: '+7', flag: '🇷🇺' },
  { id: 25, country_name: 'Ukraine', country_code: 'UA', continent: 'Europe', phone_code: '+380', flag: '🇺🇦' },
  
  // Asia
  { id: 26, country_name: 'China', country_code: 'CN', continent: 'Asia', phone_code: '+86', flag: '🇨🇳' },
  { id: 27, country_name: 'Japan', country_code: 'JP', continent: 'Asia', phone_code: '+81', flag: '🇯🇵' },
  { id: 28, country_name: 'South Korea', country_code: 'KR', continent: 'Asia', phone_code: '+82', flag: '🇰🇷' },
  { id: 29, country_name: 'India', country_code: 'IN', continent: 'Asia', phone_code: '+91', flag: '🇮🇳' },
  { id: 30, country_name: 'Singapore', country_code: 'SG', continent: 'Asia', phone_code: '+65', flag: '🇸🇬' },
  { id: 31, country_name: 'Thailand', country_code: 'TH', continent: 'Asia', phone_code: '+66', flag: '🇹🇭' },
  { id: 32, country_name: 'Vietnam', country_code: 'VN', continent: 'Asia', phone_code: '+84', flag: '🇻🇳' },
  { id: 33, country_name: 'Malaysia', country_code: 'MY', continent: 'Asia', phone_code: '+60', flag: '🇲🇾' },
  { id: 34, country_name: 'Indonesia', country_code: 'ID', continent: 'Asia', phone_code: '+62', flag: '🇮🇩' },
  { id: 35, country_name: 'Philippines', country_code: 'PH', continent: 'Asia', phone_code: '+63', flag: '🇵🇭' },
  { id: 36, country_name: 'Bangladesh', country_code: 'BD', continent: 'Asia', phone_code: '+880', flag: '🇧🇩' },
  { id: 37, country_name: 'Pakistan', country_code: 'PK', continent: 'Asia', phone_code: '+92', flag: '🇵🇰' },
  { id: 38, country_name: 'Sri Lanka', country_code: 'LK', continent: 'Asia', phone_code: '+94', flag: '🇱🇰' },
  { id: 39, country_name: 'Myanmar', country_code: 'MM', continent: 'Asia', phone_code: '+95', flag: '🇲🇲' },
  { id: 40, country_name: 'Cambodia', country_code: 'KH', continent: 'Asia', phone_code: '+855', flag: '🇰🇭' },
  { id: 41, country_name: 'Laos', country_code: 'LA', continent: 'Asia', phone_code: '+856', flag: '🇱🇦' },
  { id: 42, country_name: 'Nepal', country_code: 'NP', continent: 'Asia', phone_code: '+977', flag: '🇳🇵' },
  { id: 43, country_name: 'Mongolia', country_code: 'MN', continent: 'Asia', phone_code: '+976', flag: '🇲🇳' },
  
  // Middle East (Asia region)
  { id: 44, country_name: 'United Arab Emirates', country_code: 'AE', continent: 'Asia', phone_code: '+971', flag: '🇦🇪' },
  { id: 45, country_name: 'Saudi Arabia', country_code: 'SA', continent: 'Asia', phone_code: '+966', flag: '🇸🇦' },
  { id: 46, country_name: 'Israel', country_code: 'IL', continent: 'Asia', phone_code: '+972', flag: '🇮🇱' },
  { id: 47, country_name: 'Iran', country_code: 'IR', continent: 'Asia', phone_code: '+98', flag: '🇮🇷' },
  { id: 48, country_name: 'Qatar', country_code: 'QA', continent: 'Asia', phone_code: '+974', flag: '🇶🇦' },
  { id: 49, country_name: 'Kuwait', country_code: 'KW', continent: 'Asia', phone_code: '+965', flag: '🇰🇼' },
  { id: 50, country_name: 'Bahrain', country_code: 'BH', continent: 'Asia', phone_code: '+973', flag: '🇧🇭' },
  { id: 51, country_name: 'Oman', country_code: 'OM', continent: 'Asia', phone_code: '+968', flag: '🇴🇲' },
  { id: 52, country_name: 'Jordan', country_code: 'JO', continent: 'Asia', phone_code: '+962', flag: '🇯🇴' },
  { id: 53, country_name: 'Lebanon', country_code: 'LB', continent: 'Asia', phone_code: '+961', flag: '🇱🇧' },
  { id: 54, country_name: 'Syria', country_code: 'SY', continent: 'Asia', phone_code: '+963', flag: '🇸🇾' },
  { id: 55, country_name: 'Iraq', country_code: 'IQ', continent: 'Asia', phone_code: '+964', flag: '🇮🇶' },
  { id: 56, country_name: 'Afghanistan', country_code: 'AF', continent: 'Asia', phone_code: '+93', flag: '🇦🇫' },
  
  // Australia & Oceania
  { id: 57, country_name: 'Australia', country_code: 'AU', continent: 'Australia & Oceania', phone_code: '+61', flag: '🇦🇺' },
  { id: 58, country_name: 'New Zealand', country_code: 'NZ', continent: 'Australia & Oceania', phone_code: '+64', flag: '🇳🇿' },
  { id: 59, country_name: 'Fiji', country_code: 'FJ', continent: 'Australia & Oceania', phone_code: '+679', flag: '🇫🇯' },
  { id: 60, country_name: 'Papua New Guinea', country_code: 'PG', continent: 'Australia & Oceania', phone_code: '+675', flag: '🇵🇬' },
  { id: 61, country_name: 'Samoa', country_code: 'WS', continent: 'Australia & Oceania', phone_code: '+685', flag: '🇼🇸' },
  { id: 62, country_name: 'Tonga', country_code: 'TO', continent: 'Australia & Oceania', phone_code: '+676', flag: '🇹🇴' },
  
  // South America
  { id: 63, country_name: 'Brazil', country_code: 'BR', continent: 'South America', phone_code: '+55', flag: '🇧🇷' },
  { id: 64, country_name: 'Argentina', country_code: 'AR', continent: 'South America', phone_code: '+54', flag: '🇦🇷' },
  { id: 65, country_name: 'Chile', country_code: 'CL', continent: 'South America', phone_code: '+56', flag: '🇨🇱' },
  { id: 66, country_name: 'Colombia', country_code: 'CO', continent: 'South America', phone_code: '+57', flag: '🇨🇴' },
  { id: 67, country_name: 'Peru', country_code: 'PE', continent: 'South America', phone_code: '+51', flag: '🇵🇪' },
  { id: 68, country_name: 'Venezuela', country_code: 'VE', continent: 'South America', phone_code: '+58', flag: '🇻🇪' },
  { id: 69, country_name: 'Ecuador', country_code: 'EC', continent: 'South America', phone_code: '+593', flag: '🇪🇨' },
  { id: 70, country_name: 'Uruguay', country_code: 'UY', continent: 'South America', phone_code: '+598', flag: '🇺🇾' },
  { id: 71, country_name: 'Paraguay', country_code: 'PY', continent: 'South America', phone_code: '+595', flag: '🇵🇾' },
  { id: 72, country_name: 'Bolivia', country_code: 'BO', continent: 'South America', phone_code: '+591', flag: '🇧🇴' },
  { id: 73, country_name: 'Guyana', country_code: 'GY', continent: 'South America', phone_code: '+592', flag: '🇬🇾' },
  { id: 74, country_name: 'Suriname', country_code: 'SR', continent: 'South America', phone_code: '+597', flag: '🇸🇷' },
  
  // Africa
  { id: 75, country_name: 'South Africa', country_code: 'ZA', continent: 'Africa', phone_code: '+27', flag: '🇿🇦' },
  { id: 76, country_name: 'Nigeria', country_code: 'NG', continent: 'Africa', phone_code: '+234', flag: '🇳🇬' },
  { id: 77, country_name: 'Kenya', country_code: 'KE', continent: 'Africa', phone_code: '+254', flag: '🇰🇪' },
  { id: 78, country_name: 'Egypt', country_code: 'EG', continent: 'Africa', phone_code: '+20', flag: '🇪🇬' },
  { id: 79, country_name: 'Morocco', country_code: 'MA', continent: 'Africa', phone_code: '+212', flag: '🇲🇦' },
  { id: 80, country_name: 'Ghana', country_code: 'GH', continent: 'Africa', phone_code: '+233', flag: '🇬🇭' },
  { id: 81, country_name: 'Ethiopia', country_code: 'ET', continent: 'Africa', phone_code: '+251', flag: '🇪🇹' },
  { id: 82, country_name: 'Tanzania', country_code: 'TZ', continent: 'Africa', phone_code: '+255', flag: '🇹🇿' },
  { id: 83, country_name: 'Uganda', country_code: 'UG', continent: 'Africa', phone_code: '+256', flag: '🇺🇬' },
  { id: 84, country_name: 'Rwanda', country_code: 'RW', continent: 'Africa', phone_code: '+250', flag: '🇷🇼' },
  { id: 85, country_name: 'Algeria', country_code: 'DZ', continent: 'Africa', phone_code: '+213', flag: '🇩🇿' },
  { id: 86, country_name: 'Tunisia', country_code: 'TN', continent: 'Africa', phone_code: '+216', flag: '🇹🇳' },
  { id: 87, country_name: 'Libya', country_code: 'LY', continent: 'Africa', phone_code: '+218', flag: '🇱🇾' },
  { id: 88, country_name: 'Sudan', country_code: 'SD', continent: 'Africa', phone_code: '+249', flag: '🇸🇩' },
  { id: 89, country_name: 'Zimbabwe', country_code: 'ZW', continent: 'Africa', phone_code: '+263', flag: '🇿🇼' },
  { id: 90, country_name: 'Zambia', country_code: 'ZM', continent: 'Africa', phone_code: '+260', flag: '🇿🇲' },
  { id: 91, country_name: 'Botswana', country_code: 'BW', continent: 'Africa', phone_code: '+267', flag: '🇧🇼' },
  { id: 92, country_name: 'Namibia', country_code: 'NA', continent: 'Africa', phone_code: '+264', flag: '🇳🇦' },
  { id: 93, country_name: 'Mozambique', country_code: 'MZ', continent: 'Africa', phone_code: '+258', flag: '🇲🇿' },
  { id: 94, country_name: 'Angola', country_code: 'AO', continent: 'Africa', phone_code: '+244', flag: '🇦🇴' },
  { id: 95, country_name: 'Cameroon', country_code: 'CM', continent: 'Africa', phone_code: '+237', flag: '🇨🇲' },
  { id: 96, country_name: 'Ivory Coast', country_code: 'CI', continent: 'Africa', phone_code: '+225', flag: '🇨🇮' },
  { id: 97, country_name: 'Senegal', country_code: 'SN', continent: 'Africa', phone_code: '+221', flag: '🇸🇳' },
  { id: 98, country_name: 'Mali', country_code: 'ML', continent: 'Africa', phone_code: '+223', flag: '🇲🇱' },
  { id: 99, country_name: 'Burkina Faso', country_code: 'BF', continent: 'Africa', phone_code: '+226', flag: '🇧🇫' },
  { id: 100, country_name: 'Madagascar', country_code: 'MG', continent: 'Africa', phone_code: '+261', flag: '🇲🇬' },
];

const STATIC_CONTINENTS = [
  'Africa',
  'Asia', 
  'Australia & Oceania',
  'Europe',
  'North America',
  'South America'
];

// Static Country API - No network calls, instant responses
class StaticCountryAPI {
  constructor() {
    this.countries = STATIC_COUNTRIES;
    this.continents = STATIC_CONTINENTS;
  }

  // Get all countries - returns immediately with static data
  async getAllCountries() {
    return {
      success: true,
      data: this.countries
    };
  }

  // Get continents - returns immediately with static data
  async getContinents() {
    return {
      success: true,
      data: this.continents
    };
  }

  // Get countries by continent - returns immediately with filtered static data
  async getCountriesByContinent(continent) {
    const countries = this.countries.filter(country => country.continent === continent);
    return {
      success: true,
      data: countries
    };
  }

  // Search countries - returns immediately with filtered static data
  async searchCountries(query) {
    const filteredCountries = this.countries.filter(country =>
      country.country_name.toLowerCase().includes(query.toLowerCase()) ||
      country.country_code.toLowerCase().includes(query.toLowerCase())
    );
    return {
      success: true,
      data: filteredCountries
    };
  }

  // Utility methods - all synchronous, no API calls
  getCountryById(id) {
    return this.countries.find(country => country.id === id);
  }

  getCountryByCode(code) {
    return this.countries.find(country => 
      country.country_code.toLowerCase() === code.toLowerCase()
    );
  }

  getCountriesByIds(ids) {
    return this.countries.filter(country => ids.includes(country.id));
  }

  // Geographic validation helpers
  validateCountrySelection(selectedCountries) {
    const errors = [];
    
    if (!Array.isArray(selectedCountries)) {
      errors.push('Selected countries must be an array');
      return { isValid: false, errors };
    }

    if (selectedCountries.length === 0) {
      errors.push('At least one country must be selected');
      return { isValid: false, errors };
    }

    // Check if all selected countries exist
    const validCountryIds = this.countries.map(c => c.id);
    const invalidIds = selectedCountries.filter(id => !validCountryIds.includes(id));
    
    if (invalidIds.length > 0) {
      errors.push(`Invalid country IDs: ${invalidIds.join(', ')}`);
      return { isValid: false, errors };
    }

    return { isValid: true, errors: [] };
  }

  // Get country statistics
  getCountryStats(selectedCountries = []) {
    if (selectedCountries.length === 0) {
      return {
        total: 0,
        continents: [],
        continentCounts: {}
      };
    }

    const countries = this.getCountriesByIds(selectedCountries);
    const continents = [...new Set(countries.map(c => c.continent))];
    const continentCounts = {};

    continents.forEach(continent => {
      continentCounts[continent] = countries.filter(c => c.continent === continent).length;
    });

    return {
      total: countries.length,
      continents,
      continentCounts
    };
  }

  // Format country display with flags
  formatCountryDisplay(selectedCountries, maxDisplay = 3, includeFlags = true) {
    if (selectedCountries.length === 0) return 'No countries selected';
    
    const countries = this.getCountriesByIds(selectedCountries);
    const names = countries.map(c => includeFlags ? `${c.flag} ${c.country_name}` : c.country_name).sort();
    
    if (names.length <= maxDisplay) {
      return names.join(', ');
    }
    
    const displayed = names.slice(0, maxDisplay).join(', ');
    const remaining = names.length - maxDisplay;
    return `${displayed} and ${remaining} more`;
  }

  // Get country with flag for display
  getCountryDisplayName(countryId, includeFlag = true) {
    const country = this.getCountryById(countryId);
    if (!country) return 'Unknown Country';
    
    return includeFlag ? `${country.flag} ${country.country_name}` : country.country_name;
  }

  // Get all countries for a specific continent with flags
  getContinentCountries(continent) {
    return this.countries
      .filter(country => country.continent === continent)
      .map(country => ({
        ...country,
        displayName: `${country.flag} ${country.country_name}`
      }));
  }
}

// Create singleton instance
const countryAPI = new StaticCountryAPI();

// Export static data and utilities
export { STATIC_COUNTRIES, STATIC_CONTINENTS };

export default countryAPI;
// import { BaseService } from "../core/BaseService";

// class CountryService extends BaseService {
//   constructor() {
//     super('election');
//   }

//   // Get all countries
//   async getAllCountries() {
//     try {
//       const response = await this.get('/api/v1/countries/');
//       return response;
//     } catch (error) {
//       console.error('Failed to get countries:', error);
//       throw error;
//     }
//   }

//   // Get continents
//   async getContinents() {
//     try {
//       const response = await this.get('/api/v1/countries/continents/');
//       return response;
//     } catch (error) {
//       console.error('Failed to get continents:', error);
//       throw error;
//     }
//   }

//   // Get countries by continent
//   async getCountriesByContinent(continent) {
//     try {
//       const response = await this.get(`/api/v1/countries/by-continent/${continent}/`);
//       return response;
//     } catch (error) {
//       console.error('Failed to get countries by continent:', error);
//       throw error;
//     }
//   }

//   // Search countries
//   async searchCountries(query) {
//     try {
//       const response = await this.get(`/api/v1/countries/search/?q=${encodeURIComponent(query)}`);
//       return response;
//     } catch (error) {
//       console.error('Failed to search countries:', error);
//       throw error;
//     }
//   }
// }

// // Mock data for development/fallback
// const MOCK_COUNTRIES = [
//   // North America
//   { id: 1, country_name: 'United States', country_code: 'US', continent: 'North America', phone_code: '+1' },
//   { id: 2, country_name: 'Canada', country_code: 'CA', continent: 'North America', phone_code: '+1' },
//   { id: 3, country_name: 'Mexico', country_code: 'MX', continent: 'North America', phone_code: '+52' },
  
//   // Europe
//   { id: 4, country_name: 'United Kingdom', country_code: 'GB', continent: 'Europe', phone_code: '+44' },
//   { id: 5, country_name: 'Germany', country_code: 'DE', continent: 'Europe', phone_code: '+49' },
//   { id: 6, country_name: 'France', country_code: 'FR', continent: 'Europe', phone_code: '+33' },
//   { id: 7, country_name: 'Italy', country_code: 'IT', continent: 'Europe', phone_code: '+39' },
//   { id: 8, country_name: 'Spain', country_code: 'ES', continent: 'Europe', phone_code: '+34' },
//   { id: 9, country_name: 'Netherlands', country_code: 'NL', continent: 'Europe', phone_code: '+31' },
//   { id: 10, country_name: 'Switzerland', country_code: 'CH', continent: 'Europe', phone_code: '+41' },
//   { id: 11, country_name: 'Sweden', country_code: 'SE', continent: 'Europe', phone_code: '+46' },
//   { id: 12, country_name: 'Norway', country_code: 'NO', continent: 'Europe', phone_code: '+47' },
//   { id: 13, country_name: 'Denmark', country_code: 'DK', continent: 'Europe', phone_code: '+45' },
//   { id: 14, country_name: 'Finland', country_code: 'FI', continent: 'Europe', phone_code: '+358' },
  
//   // Asia
//   { id: 15, country_name: 'China', country_code: 'CN', continent: 'Asia', phone_code: '+86' },
//   { id: 16, country_name: 'Japan', country_code: 'JP', continent: 'Asia', phone_code: '+81' },
//   { id: 17, country_name: 'South Korea', country_code: 'KR', continent: 'Asia', phone_code: '+82' },
//   { id: 18, country_name: 'India', country_code: 'IN', continent: 'Asia', phone_code: '+91' },
//   { id: 19, country_name: 'Singapore', country_code: 'SG', continent: 'Asia', phone_code: '+65' },
//   { id: 20, country_name: 'Thailand', country_code: 'TH', continent: 'Asia', phone_code: '+66' },
//   { id: 21, country_name: 'Vietnam', country_code: 'VN', continent: 'Asia', phone_code: '+84' },
//   { id: 22, country_name: 'Malaysia', country_code: 'MY', continent: 'Asia', phone_code: '+60' },
//   { id: 23, country_name: 'Indonesia', country_code: 'ID', continent: 'Asia', phone_code: '+62' },
//   { id: 24, country_name: 'Philippines', country_code: 'PH', continent: 'Asia', phone_code: '+63' },
//   { id: 25, country_name: 'Bangladesh', country_code: 'BD', continent: 'Asia', phone_code: '+880' },
//   { id: 26, country_name: 'Pakistan', country_code: 'PK', continent: 'Asia', phone_code: '+92' },
  
//   // Australia & Oceania
//   { id: 27, country_name: 'Australia', country_code: 'AU', continent: 'Australia & Oceania', phone_code: '+61' },
//   { id: 28, country_name: 'New Zealand', country_code: 'NZ', continent: 'Australia & Oceania', phone_code: '+64' },
//   { id: 29, country_name: 'Fiji', country_code: 'FJ', continent: 'Australia & Oceania', phone_code: '+679' },
  
//   // South America
//   { id: 30, country_name: 'Brazil', country_code: 'BR', continent: 'South America', phone_code: '+55' },
//   { id: 31, country_name: 'Argentina', country_code: 'AR', continent: 'South America', phone_code: '+54' },
//   { id: 32, country_name: 'Chile', country_code: 'CL', continent: 'South America', phone_code: '+56' },
//   { id: 33, country_name: 'Colombia', country_code: 'CO', continent: 'South America', phone_code: '+57' },
//   { id: 34, country_name: 'Peru', country_code: 'PE', continent: 'South America', phone_code: '+51' },
//   { id: 35, country_name: 'Venezuela', country_code: 'VE', continent: 'South America', phone_code: '+58' },
//   { id: 36, country_name: 'Ecuador', country_code: 'EC', continent: 'South America', phone_code: '+593' },
//   { id: 37, country_name: 'Uruguay', country_code: 'UY', continent: 'South America', phone_code: '+598' },
  
//   // Africa
//   { id: 38, country_name: 'South Africa', country_code: 'ZA', continent: 'Africa', phone_code: '+27' },
//   { id: 39, country_name: 'Nigeria', country_code: 'NG', continent: 'Africa', phone_code: '+234' },
//   { id: 40, country_name: 'Kenya', country_code: 'KE', continent: 'Africa', phone_code: '+254' },
//   { id: 41, country_name: 'Egypt', country_code: 'EG', continent: 'Africa', phone_code: '+20' },
//   { id: 42, country_name: 'Morocco', country_code: 'MA', continent: 'Africa', phone_code: '+212' },
//   { id: 43, country_name: 'Ghana', country_code: 'GH', continent: 'Africa', phone_code: '+233' },
//   { id: 44, country_name: 'Ethiopia', country_code: 'ET', continent: 'Africa', phone_code: '+251' },
//   { id: 45, country_name: 'Tanzania', country_code: 'TZ', continent: 'Africa', phone_code: '+255' },
//   { id: 46, country_name: 'Uganda', country_code: 'UG', continent: 'Africa', phone_code: '+256' },
//   { id: 47, country_name: 'Rwanda', country_code: 'RW', continent: 'Africa', phone_code: '+250' },
  
//   // Middle East
//   { id: 48, country_name: 'United Arab Emirates', country_code: 'AE', continent: 'Asia', phone_code: '+971' },
//   { id: 49, country_name: 'Saudi Arabia', country_code: 'SA', continent: 'Asia', phone_code: '+966' },
//   { id: 50, country_name: 'Israel', country_code: 'IL', continent: 'Asia', phone_code: '+972' },
//   { id: 51, country_name: 'Turkey', country_code: 'TR', continent: 'Europe', phone_code: '+90' },
//   { id: 52, country_name: 'Iran', country_code: 'IR', continent: 'Asia', phone_code: '+98' },
//   { id: 53, country_name: 'Qatar', country_code: 'QA', continent: 'Asia', phone_code: '+974' },
//   { id: 54, country_name: 'Kuwait', country_code: 'KW', continent: 'Asia', phone_code: '+965' },
//   { id: 55, country_name: 'Bahrain', country_code: 'BH', continent: 'Asia', phone_code: '+973' },
//   { id: 56, country_name: 'Oman', country_code: 'OM', continent: 'Asia', phone_code: '+968' },
//   { id: 57, country_name: 'Jordan', country_code: 'JO', continent: 'Asia', phone_code: '+962' },
//   { id: 58, country_name: 'Lebanon', country_code: 'LB', continent: 'Asia', phone_code: '+961' }
// ];

// const MOCK_CONTINENTS = [
//   'Africa',
//   'Asia', 
//   'Australia & Oceania',
//   'Europe',
//   'North America',
//   'South America'
// ];

// // Country API wrapper with fallback support
// class CountryAPIWrapper {
//   constructor() {
//     this.service = new CountryService();
//     this.useOnlineData = true; // Set to false to use mock data
//   }

//   async getAllCountries() {
//     if (!this.useOnlineData) {
//       return {
//         success: true,
//         data: MOCK_COUNTRIES
//       };
//     }

//     try {
//       const response = await this.service.getAllCountries();
//       return response;
//     } catch (error) {
//       console.warn('API call failed, falling back to mock data:', error);
//       return {
//         success: true,
//         data: MOCK_COUNTRIES
//       };
//     }
//   }

//   async getContinents() {
//     if (!this.useOnlineData) {
//       return {
//         success: true,
//         data: MOCK_CONTINENTS
//       };
//     }

//     try {
//       const response = await this.service.getContinents();
//       return response;
//     } catch (error) {
//       console.warn('API call failed, falling back to mock data:', error);
//       return {
//         success: true,
//         data: MOCK_CONTINENTS
//       };
//     }
//   }

//   async getCountriesByContinent(continent) {
//     if (!this.useOnlineData) {
//       const countries = MOCK_COUNTRIES.filter(country => country.continent === continent);
//       return {
//         success: true,
//         data: countries
//       };
//     }

//     try {
//       const response = await this.service.getCountriesByContinent(continent);
//       return response;
//     } catch (error) {
//       console.warn('API call failed, falling back to mock data:', error);
//       const countries = MOCK_COUNTRIES.filter(country => country.continent === continent);
//       return {
//         success: true,
//         data: countries
//       };
//     }
//   }

//   async searchCountries(query) {
//     if (!this.useOnlineData) {
//       const filteredCountries = MOCK_COUNTRIES.filter(country =>
//         country.country_name.toLowerCase().includes(query.toLowerCase()) ||
//         country.country_code.toLowerCase().includes(query.toLowerCase())
//       );
//       return {
//         success: true,
//         data: filteredCountries
//       };
//     }

//     try {
//       const response = await this.service.searchCountries(query);
//       return response;
//     } catch (error) {
//       console.warn('API call failed, falling back to mock data:', error);
//       const filteredCountries = MOCK_COUNTRIES.filter(country =>
//         country.country_name.toLowerCase().includes(query.toLowerCase()) ||
//         country.country_code.toLowerCase().includes(query.toLowerCase())
//       );
//       return {
//         success: true,
//         data: filteredCountries
//       };
//     }
//   }

//   // Utility methods
//   getCountryById(id) {
//     return MOCK_COUNTRIES.find(country => country.id === id);
//   }

//   getCountryByCode(code) {
//     return MOCK_COUNTRIES.find(country => 
//       country.country_code.toLowerCase() === code.toLowerCase()
//     );
//   }

//   getCountriesByIds(ids) {
//     return MOCK_COUNTRIES.filter(country => ids.includes(country.id));
//   }

//   // Geographic validation helpers
//   validateCountrySelection(selectedCountries) {
//     const errors = [];
    
//     if (!Array.isArray(selectedCountries)) {
//       errors.push('Selected countries must be an array');
//       return { isValid: false, errors };
//     }

//     if (selectedCountries.length === 0) {
//       errors.push('At least one country must be selected');
//       return { isValid: false, errors };
//     }

//     // Check if all selected countries exist
//     const validCountryIds = MOCK_COUNTRIES.map(c => c.id);
//     const invalidIds = selectedCountries.filter(id => !validCountryIds.includes(id));
    
//     if (invalidIds.length > 0) {
//       errors.push(`Invalid country IDs: ${invalidIds.join(', ')}`);
//       return { isValid: false, errors };
//     }

//     return { isValid: true, errors: [] };
//   }

//   // Get country statistics
//   getCountryStats(selectedCountries = []) {
//     if (selectedCountries.length === 0) {
//       return {
//         total: 0,
//         continents: [],
//         continentCounts: {}
//       };
//     }

//     const countries = this.getCountriesByIds(selectedCountries);
//     const continents = [...new Set(countries.map(c => c.continent))];
//     const continentCounts = {};

//     continents.forEach(continent => {
//       continentCounts[continent] = countries.filter(c => c.continent === continent).length;
//     });

//     return {
//       total: countries.length,
//       continents,
//       continentCounts
//     };
//   }

//   // Format country display
//   formatCountryDisplay(selectedCountries, maxDisplay = 3) {
//     if (selectedCountries.length === 0) return 'No countries selected';
    
//     const countries = this.getCountriesByIds(selectedCountries);
//     const names = countries.map(c => c.country_name).sort();
    
//     if (names.length <= maxDisplay) {
//       return names.join(', ');
//     }
    
//     const displayed = names.slice(0, maxDisplay).join(', ');
//     const remaining = names.length - maxDisplay;
//     return `${displayed} and ${remaining} more`;
//   }

//   // Enable/disable online mode
//   setOnlineMode(enabled) {
//     this.useOnlineData = enabled;
//   }
// }

// // Create singleton instance
// export const countryAPI = new CountryAPIWrapper();

// // Export service and utilities
// export { CountryService, MOCK_COUNTRIES, MOCK_CONTINENTS };

// export default countryAPI;