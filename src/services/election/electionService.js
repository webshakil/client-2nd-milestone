// services/election/electionService.js
import { BaseService } from '../core/BaseService.js';

class ElectionService extends BaseService {
  constructor() {
    // Use 'user' service type since your BaseService maps election to localhost:3004
    // But actually, let me check your BaseService - you don't have election mapped there
    // So I'll extend the baseUrls in constructor
    super('default');
    
    // Override the baseUrl to point to your election service
    this.baseUrl = import.meta.env?.VITE_ELECTION_API_BASE_URL || 'http://localhost:3004';
  }

  /**
   * Transform election data for API submission
   * @param {Object} electionData - Raw election data from form
   * @returns {Object} Transformed data for API
   */
  transformElectionDataForAPI(electionData) {
    console.log('🔍 Raw electionData received in transformElectionDataForAPI:', electionData);
    console.log('🔍 electionData.regionalFees:', electionData.regionalFees);
    console.log('🔍 electionData.pricingType:', electionData.pricingType);
    // Get current user ID from token or localStorage
    const getCurrentUserId = () => {
      try {
        const userData = localStorage.getItem('vottery_user_data');
        if (userData) {
          const user = JSON.parse(userData);
          return user.id || null;
        }
      } catch (error) {
        console.error('Error getting user ID:', error);
      }
      return null;
    };

    const transformedData = {
      ...electionData,
      // Ensure required fields
      creatorId: electionData.creatorId || getCurrentUserId(),
      
      // Transform dates to match backend expectations
      startDate: electionData.startDate?.date || null,
      endDate: electionData.endDate?.date || null,
      startTime: electionData.startDate?.time || '09:00',
      endTime: electionData.endDate?.time || '18:00',
      
      // Ensure boolean fields are properly set
      isDraft: electionData.isDraft || false,
      isPublished: electionData.isPublished || false,
      isLotterized: electionData.isLotterized || false,
      requireBiometric: electionData.requireBiometric || false,
      requireIdVerification: electionData.requireIdVerification || false,
      
      // Ensure arrays are properly formatted
      countries: electionData.countries || [],
      candidates: electionData.candidates || [],
      
      // Handle pricing
      // pricingType: electionData.pricingType || 'free',
      // participationFee: electionData.pricingType === 'general' ? electionData.participationFee : 0,
      // regionalFees: electionData.pricingType === 'regional' ? electionData.regionalFees : {},
      // In ElectionService.js, update the pricing section:
// Handle pricing
pricingType: electionData.pricingType || 'free',
participationFee: electionData.pricingType === 'general' ? electionData.participationFee : 0,
regionalFees: electionData.regionalFees || {}, // Don't overwrite, keep existing regionalFees
      
      // Handle lottery settings
      rewardType: electionData.isLotterized ? electionData.rewardType : null,
      rewardAmount: electionData.isLotterized && electionData.rewardType === 'monetary' ? electionData.rewardAmount : 0,
      nonMonetaryReward: electionData.isLotterized && electionData.rewardType === 'non_monetary' ? electionData.nonMonetaryReward : null,
      projectedRevenue: electionData.isLotterized && electionData.rewardType === 'revenue_share' ? electionData.projectedRevenue : 0,
      revenueSharePercentage: electionData.isLotterized && electionData.rewardType === 'revenue_share' ? electionData.revenueSharePercentage : 0,
      winnerCount: electionData.isLotterized ? electionData.winnerCount : 1,
      
      // Metadata
      createdAt: electionData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Remove undefined fields
    Object.keys(transformedData).forEach(key => {
      if (transformedData[key] === undefined) {
        delete transformedData[key];
      }
    });

    return transformedData;
  }

  /**
   * Create election with validation
   * @param {Object} electionData - Election data
   * @param {Array} files - Optional files to upload
   * @returns {Promise} Creation result
   */
  // In electionService.js, update the createElectionWithValidation method:

async createElectionWithValidation(electionData, uploadedFiles = []) {
  try {
    console.log('Creating election with validation:', electionData);
    console.log('Uploaded files:', uploadedFiles);
    
    // Check if we have actual files to upload
    const hasFiles = uploadedFiles && uploadedFiles.length > 0 && 
                     uploadedFiles.some(fileData => fileData && fileData.file);

    if (hasFiles) {
      const formData = new FormData();
      
      // Transform data for API (but keep base64 images for now)
      const transformedData = this.transformElectionDataForAPI(electionData);
      
      // Append all election data as individual form fields
      Object.keys(transformedData).forEach(key => {
        if (transformedData[key] !== null && transformedData[key] !== undefined) {
          if (typeof transformedData[key] === 'object') {
            formData.append(key, JSON.stringify(transformedData[key]));
          } else {
            formData.append(key, transformedData[key]);
          }
        }
      });
      
      // Append files based on their field names
      uploadedFiles.forEach((fileData) => {
        if (fileData && fileData.file) {
          switch (fileData.fieldName) {
            case 'topicImage':
              formData.append('topicImage', fileData.file);
              break;
            case 'logoBranding':
              formData.append('logoBranding', fileData.file);
              break;
            case 'questionImage':
              formData.append('questionImages', fileData.file);
              break;
            case 'answerImage':
              formData.append('answerImages', fileData.file);
              break;
            default:
              formData.append('files', fileData.file);
          }
        }
      });

      // Log FormData contents for debugging
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await this.request('/api/elections/create', {
        method: 'POST',
        body: formData,
        headers: {} // Let browser set Content-Type for FormData
      });

      if (!response.success) {
        throw new Error(response.message || 'Failed to create election');
      }

      return {
        success: true,
        data: response.data,
        message: response.message || 'Election created successfully'
      };
    } else {
      // No files, use JSON
      const transformedData = this.transformElectionDataForAPI(electionData);
      const response = await this.post('/api/elections/create', transformedData);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to create election');
      }

      return {
        success: true,
        data: response.data,
        message: response.message || 'Election created successfully'
      };
    }
  } catch (error) {
    console.error('Error in createElectionWithValidation:', error);
    throw error;
  }
}
  // async createElectionWithValidation(electionData, files = []) {
  //   try {
  //     console.log('Creating election with validation:', electionData);
      
  //     // Transform data for API
  //     const transformedData = this.transformElectionDataForAPI(electionData);
  //     console.log('Transformed election data:', transformedData);

  //     // If files are present, use FormData
  //     if (files && files.length > 0) {
  //       const formData = new FormData();
        
  //       // Append election data as JSON string
  //       formData.append('electionData', JSON.stringify(transformedData));
        
  //       // Append files
  //       files.forEach((file, index) => {
  //         if (file.file) {
  //           formData.append(`file_${index}`, file.file, file.file.name);
  //           formData.append(`fileType_${index}`, file.type || 'document');
  //         }
  //       });

  //       // Use BaseService request with FormData (handles auth automatically)
  //       const response = await this.request('/api/elections/create', {
  //         method: 'POST',
  //         body: formData,
  //         headers: {} // Let browser set Content-Type for FormData, BaseService adds auth
  //       });

  //       if (!response.success) {
  //         throw new Error(response.message || 'Failed to create election');
  //       }

  //       return {
  //         success: true,
  //         data: response.data,
  //         message: response.message || 'Election created successfully'
  //       };
  //     } else {
  //       // Use BaseService post method (handles auth automatically)
  //       const response = await this.post('/api/elections/create', transformedData);
        
  //       if (!response.success) {
  //         throw new Error(response.message || 'Failed to create election');
  //       }

  //       return {
  //         success: true,
  //         data: response.data,
  //         message: response.message || 'Election created successfully'
  //       };
  //     }
  //   } catch (error) {
  //     console.error('Error in createElectionWithValidation:', error);
  //     throw error;
  //   }
  // }

  /**
   * Update election with validation
   * @param {string} electionId - Election ID
   * @param {Object} electionData - Updated election data
   * @param {Array} files - Optional files to upload
   * @returns {Promise} Update result
   */
  async updateElectionWithValidation(electionId, electionData, files = []) {
    try {
      console.log('Updating election with validation:', electionId, electionData);
      
      // Transform data for API
      const transformedData = this.transformElectionDataForAPI(electionData);
      console.log('Transformed election data for update:', transformedData);

      // If files are present, use FormData
      if (files && files.length > 0) {
        const formData = new FormData();
        
        // Append election data as JSON string
        formData.append('electionData', JSON.stringify(transformedData));
        
        // Append files
        files.forEach((file, index) => {
          if (file.file) {
            formData.append(`file_${index}`, file.file, file.file.name);
            formData.append(`fileType_${index}`, file.type || 'document');
          }
        });

        // Use BaseService request with FormData
        const response = await this.request(`/api/elections/update/${electionId}`, {
          method: 'PUT',
          body: formData,
          headers: {} // Let browser set Content-Type for FormData
        });

        if (!response.success) {
          throw new Error(response.message || 'Failed to update election');
        }

        return {
          success: true,
          data: response.data,
          message: response.message || 'Election updated successfully'
        };
      } else {
        // Use BaseService put method
        const response = await this.put(`/api/elections/update/${electionId}`, transformedData);
        
        if (!response.success) {
          throw new Error(response.message || 'Failed to update election');
        }

        return {
          success: true,
          data: response.data,
          message: response.message || 'Election updated successfully'
        };
      }
    } catch (error) {
      console.error('Error in updateElectionWithValidation:', error);
      throw error;
    }
  }

  /**
   * Get election by ID
   * @param {string} electionId - Election ID
   * @returns {Promise} Election data
   */
  async getElection(electionId) {
    try {
      const response = await this.get(`/api/elections/${electionId}`);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch election');
      }

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching election:', error);
      throw error;
    }
  }

  /**
   * Get elections list
   * @param {Object} filters - Query filters
   * @returns {Promise} Elections list
   */
  async getElections(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const endpoint = queryParams ? `/api/elections?${queryParams}` : '/api/elections';
      
      const response = await this.get(endpoint);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch elections');
      }

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error fetching elections:', error);
      throw error;
    }
  }

  /**
   * Delete election
   * @param {string} electionId - Election ID
   * @returns {Promise} Delete result
   */
  async deleteElection(electionId) {
    try {
      const response = await this.delete(`/api/elections/delete/${electionId}`);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete election');
      }

      return {
        success: true,
        message: response.message || 'Election deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting election:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const electionService = new ElectionService();

// Export the methods for direct use
export const createElectionWithValidation = (electionData, files) => 
  electionService.createElectionWithValidation(electionData, files);

export const updateElectionWithValidation = (electionId, electionData, files) => 
  electionService.updateElectionWithValidation(electionId, electionData, files);

export const getElection = (electionId) => 
  electionService.getElection(electionId);

export const getElections = (filters) => 
  electionService.getElections(filters);

export const deleteElection = (electionId) => 
  electionService.deleteElection(electionId);

export default electionService;
//this is the last working code
// // services/election/electionService.js
// import { BaseService } from '../core/BaseService.js';

// class ElectionService extends BaseService {
//   constructor() {
//     // Use 'user' service type since your BaseService maps election to localhost:3004
//     // But actually, let me check your BaseService - you don't have election mapped there
//     // So I'll extend the baseUrls in constructor
//     super('default');
    
//     // Override the baseUrl to point to your election service
//     this.baseUrl = import.meta.env?.VITE_ELECTION_API_BASE_URL || 'http://localhost:3004';
//   }

//   /**
//    * Transform election data for API submission
//    * @param {Object} electionData - Raw election data from form
//    * @returns {Object} Transformed data for API
//    */
//   transformElectionDataForAPI(electionData) {
//     // Get current user ID from token or localStorage
//     const getCurrentUserId = () => {
//       try {
//         const userData = localStorage.getItem('vottery_user_data');
//         if (userData) {
//           const user = JSON.parse(userData);
//           return user.id || null;
//         }
//       } catch (error) {
//         console.error('Error getting user ID:', error);
//       }
//       return null;
//     };

//     // Transform date objects to ISO strings
//     const transformDates = (dateObj) => {
//       if (!dateObj || !dateObj.date) return null;
//       const dateStr = `${dateObj.date}T${dateObj.time || '09:00'}:00.000Z`;
//       return new Date(dateStr).toISOString();
//     };

//     const transformedData = {
//       ...electionData,
//       // Ensure required fields
//       creatorId: electionData.creatorId || getCurrentUserId(),
      
//       // Transform dates
//       startDateTime: transformDates(electionData.startDate),
//       endDateTime: transformDates(electionData.endDate),
      
//       // Remove old date format fields
//       startDate: undefined,
//       endDate: undefined,
//       startTime: undefined,
//       endTime: undefined,
      
//       // Ensure boolean fields are properly set
//       isDraft: electionData.isDraft || false,
//       isPublished: electionData.isPublished || false,
//       isLotterized: electionData.isLotterized || false,
//       requireBiometric: electionData.requireBiometric || false,
//       requireIdVerification: electionData.requireIdVerification || false,
      
//       // Ensure arrays are properly formatted
//       countries: electionData.countries || [],
//       candidates: electionData.candidates || [],
      
//       // Handle pricing
//       pricingType: electionData.pricingType || 'free',
//       participationFee: electionData.pricingType === 'general' ? electionData.participationFee : 0,
//       regionalFees: electionData.pricingType === 'regional' ? electionData.regionalFees : {},
      
//       // Handle lottery settings
//       rewardType: electionData.isLotterized ? electionData.rewardType : null,
//       rewardAmount: electionData.isLotterized && electionData.rewardType === 'monetary' ? electionData.rewardAmount : 0,
//       nonMonetaryReward: electionData.isLotterized && electionData.rewardType === 'non_monetary' ? electionData.nonMonetaryReward : null,
//       projectedRevenue: electionData.isLotterized && electionData.rewardType === 'revenue_share' ? electionData.projectedRevenue : 0,
//       revenueSharePercentage: electionData.isLotterized && electionData.rewardType === 'revenue_share' ? electionData.revenueSharePercentage : 0,
//       winnerCount: electionData.isLotterized ? electionData.winnerCount : 1,
      
//       // Metadata
//       createdAt: electionData.createdAt || new Date().toISOString(),
//       updatedAt: new Date().toISOString()
//     };

//     // Remove undefined fields
//     Object.keys(transformedData).forEach(key => {
//       if (transformedData[key] === undefined) {
//         delete transformedData[key];
//       }
//     });

//     return transformedData;
//   }

//   /**
//    * Create election with validation
//    * @param {Object} electionData - Election data
//    * @param {Array} files - Optional files to upload
//    * @returns {Promise} Creation result
//    */
//   async createElectionWithValidation(electionData, files = []) {
//     try {
//       console.log('Creating election with validation:', electionData);
      
//       // Transform data for API
//       const transformedData = this.transformElectionDataForAPI(electionData);
//       console.log('Transformed election data:', transformedData);

//       // If files are present, use FormData
//       if (files && files.length > 0) {
//         const formData = new FormData();
        
//         // Append election data as JSON string
//         formData.append('electionData', JSON.stringify(transformedData));
        
//         // Append files
//         files.forEach((file, index) => {
//           if (file.file) {
//             formData.append(`file_${index}`, file.file, file.file.name);
//             formData.append(`fileType_${index}`, file.type || 'document');
//           }
//         });

//         // Use BaseService request with FormData (handles auth automatically)
//         const response = await this.request('/api/elections/create', {
//           method: 'POST',
//           body: formData,
//           headers: {} // Let browser set Content-Type for FormData, BaseService adds auth
//         });

//         if (!response.success) {
//           throw new Error(response.message || 'Failed to create election');
//         }

//         return {
//           success: true,
//           data: response.data,
//           message: response.message || 'Election created successfully'
//         };
//       } else {
//         // Use BaseService post method (handles auth automatically)
//         const response = await this.post('/api/elections/create', transformedData);
        
//         if (!response.success) {
//           throw new Error(response.message || 'Failed to create election');
//         }

//         return {
//           success: true,
//           data: response.data,
//           message: response.message || 'Election created successfully'
//         };
//       }
//     } catch (error) {
//       console.error('Error in createElectionWithValidation:', error);
//       throw error;
//     }
//   }

//   /**
//    * Update election with validation
//    * @param {string} electionId - Election ID
//    * @param {Object} electionData - Updated election data
//    * @param {Array} files - Optional files to upload
//    * @returns {Promise} Update result
//    */
//   async updateElectionWithValidation(electionId, electionData, files = []) {
//     try {
//       console.log('Updating election with validation:', electionId, electionData);
      
//       // Transform data for API
//       const transformedData = this.transformElectionDataForAPI(electionData);
//       console.log('Transformed election data for update:', transformedData);

//       // If files are present, use FormData
//       if (files && files.length > 0) {
//         const formData = new FormData();
        
//         // Append election data as JSON string
//         formData.append('electionData', JSON.stringify(transformedData));
        
//         // Append files
//         files.forEach((file, index) => {
//           if (file.file) {
//             formData.append(`file_${index}`, file.file, file.file.name);
//             formData.append(`fileType_${index}`, file.type || 'document');
//           }
//         });

//         // Use BaseService request with FormData
//         const response = await this.request(`/api/election/update/${electionId}`, {
//           method: 'PUT',
//           body: formData,
//           headers: {} // Let browser set Content-Type for FormData
//         });

//         if (!response.success) {
//           throw new Error(response.message || 'Failed to update election');
//         }

//         return {
//           success: true,
//           data: response.data,
//           message: response.message || 'Election updated successfully'
//         };
//       } else {
//         // Use BaseService put method
//         const response = await this.put(`/api/election/update/${electionId}`, transformedData);
        
//         if (!response.success) {
//           throw new Error(response.message || 'Failed to update election');
//         }

//         return {
//           success: true,
//           data: response.data,
//           message: response.message || 'Election updated successfully'
//         };
//       }
//     } catch (error) {
//       console.error('Error in updateElectionWithValidation:', error);
//       throw error;
//     }
//   }

//   /**
//    * Get election by ID
//    * @param {string} electionId - Election ID
//    * @returns {Promise} Election data
//    */
//   async getElection(electionId) {
//     try {
//       const response = await this.get(`/api/election/${electionId}`);
      
//       if (!response.success) {
//         throw new Error(response.message || 'Failed to fetch election');
//       }

//       return {
//         success: true,
//         data: response.data
//       };
//     } catch (error) {
//       console.error('Error fetching election:', error);
//       throw error;
//     }
//   }

//   /**
//    * Get elections list
//    * @param {Object} filters - Query filters
//    * @returns {Promise} Elections list
//    */
//   async getElections(filters = {}) {
//     try {
//       const queryParams = new URLSearchParams(filters).toString();
//       const endpoint = queryParams ? `/api/elections?${queryParams}` : '/api/elections';
      
//       const response = await this.get(endpoint);
      
//       if (!response.success) {
//         throw new Error(response.message || 'Failed to fetch elections');
//       }

//       return {
//         success: true,
//         data: response.data
//       };
//     } catch (error) {
//       console.error('Error fetching elections:', error);
//       throw error;
//     }
//   }

//   /**
//    * Delete election
//    * @param {string} electionId - Election ID
//    * @returns {Promise} Delete result
//    */
//   async deleteElection(electionId) {
//     try {
//       const response = await this.delete(`/api/election/delete/${electionId}`);
      
//       if (!response.success) {
//         throw new Error(response.message || 'Failed to delete election');
//       }

//       return {
//         success: true,
//         message: response.message || 'Election deleted successfully'
//       };
//     } catch (error) {
//       console.error('Error deleting election:', error);
//       throw error;
//     }
//   }
// }

// // Export singleton instance
// export const electionService = new ElectionService();

// // Export the methods for direct use
// export const createElectionWithValidation = (electionData, files) => 
//   electionService.createElectionWithValidation(electionData, files);

// export const updateElectionWithValidation = (electionId, electionData, files) => 
//   electionService.updateElectionWithValidation(electionId, electionData, files);

// export const getElection = (electionId) => 
//   electionService.getElection(electionId);

// export const getElections = (filters) => 
//   electionService.getElections(filters);

// export const deleteElection = (electionId) => 
//   electionService.deleteElection(electionId);

// export default electionService;