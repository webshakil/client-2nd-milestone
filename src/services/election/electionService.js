//this is without token and below is with token

// services/electionService.js
import { apiClient } from '../core/apiClient';

class ElectionService {
  constructor() {
    this.serviceType = 'election';
  }

  // Transform frontend form data to backend format
  transformElectionData(formData, isDraft = false) {
    return {
      title: formData.title,
      description: formData.description,
      // Removed category field as backend doesn't support it
      voting_type: formData.votingType,
      start_date: formData.startDate && formData.startTime 
        ? `${formData.startDate}T${formData.startTime}:00.000Z` 
        : null,
      end_date: formData.endDate && formData.endTime 
        ? `${formData.endDate}T${formData.endTime}:00.000Z` 
        : null,
      timezone: formData.timezone,
      fee: formData.fee || 0,
      biometric_required: formData.biometricRequired,
      permissions: formData.permissions,
      country_restriction: formData.countryRestriction || null,
      group_id: formData.groupId || null,
      organization_id: formData.organizationId || null,
      allow_vote_changes: formData.allowVoteChanges,
      show_results_during_voting: formData.showResultsDuringVoting,
      state: isDraft ? 'draft' : 'active',
      custom_branding: {
        logo_url: formData.media?.logo || null,
        banner_url: formData.media?.coverImage || null,
        videos: formData.media?.videos || []
      }
    };
  }

  // Transform frontend question data to backend format
  transformQuestionData(question, electionId, order) {
    return {
      election_id: electionId,
      question_text: question.question,
      question_type: question.type || 'multiple_choice',
      is_required: question.required || true,
      display_order: order,
      options: {
        allow_multiple_selection: question.type === 'checkbox',
        randomize_options: false
      }
    };
  }

  // Transform frontend answer options to backend format
  transformAnswerData(option, questionId, order) {
    return {
      question_id: questionId,
      answer_text: option,
      display_order: order,
      is_correct: false // For polls, this doesn't matter
    };
  }

  // Create election with questions and answers
  async createElection(formData, isDraft = false) {
    try {
      console.log('Starting election creation process...');
      
      // Step 1: Create the election
      const electionData = this.transformElectionData(formData, isDraft);
      console.log('Election data:', electionData);

      const electionResponse = await apiClient.request('election', '/api/elections', {
        method: 'POST',
        body: electionData
      });

      if (!electionResponse.success) {
        throw new Error(electionResponse.message || 'Failed to create election');
      }

      const electionId = electionResponse.data.election.election_id;
      console.log('Election created with ID:', electionId);

      // Step 2: Create questions with answers using the question service
      const createdQuestions = [];
      
      for (let i = 0; i < formData.questions.length; i++) {
        const question = formData.questions[i];
        
        // Filter out empty options
        const validOptions = question.options.filter(option => option.trim());
        
        if (validOptions.length < 2) {
          throw new Error(`Question ${i + 1} must have at least 2 options`);
        }

        // Create question with answers in the question service
        const questionData = {
          question_text: question.question,
          question_type: question.type || 'multiple_choice',
          is_required: question.required || true,
          display_order: i + 1,
          options: {
            allow_multiple_selection: question.type === 'checkbox',
            randomize_options: false
          },
          answers: validOptions.map((option, index) => ({
            answer_text: option,
            display_order: index + 1,
            is_correct: false
          }))
        };
        
        console.log(`Creating question ${i + 1}:`, questionData);

        const questionResponse = await apiClient.request('user', `/api/questions/${electionId}/questions`, {
          method: 'POST',
          body: questionData
        });

        if (!questionResponse.success) {
          throw new Error(questionResponse.message || `Failed to create question ${i + 1}`);
        }

        createdQuestions.push(questionResponse.data);
      }

      console.log('Election creation completed successfully');

      return {
        success: true,
        election: electionResponse.data.election,
        questions: createdQuestions,
        message: `Election ${isDraft ? 'saved as draft' : 'created'} successfully`
      };

    } catch (error) {
      console.error('Error creating election:', error);
      
      // Provide more specific error messages
      if (error.message.includes('validation')) {
        throw new Error('Validation failed. Please check your input data.');
      } else if (error.message.includes('authentication')) {
        throw new Error('Authentication failed. Please log in again.');
      } else if (error.message.includes('permission')) {
        throw new Error('You do not have permission to create elections.');
      } else {
        throw new Error(error.message || 'Failed to create election. Please try again.');
      }
    }
  }

  // Get user's elections
  async getMyElections(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.state) queryParams.append('state', filters.state);
      if (filters.voting_type) queryParams.append('voting_type', filters.voting_type);
      if (filters.limit) queryParams.append('limit', filters.limit);
      if (filters.offset) queryParams.append('offset', filters.offset);

      const response = await apiClient.request('election', `/api/elections/my?${queryParams.toString()}`, {
        method: 'GET'
      });

      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch elections');
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching my elections:', error);
      throw new Error(error.message || 'Failed to fetch elections');
    }
  }

  // Get public elections
  async getPublicElections(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.voting_type) queryParams.append('voting_type', filters.voting_type);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.limit) queryParams.append('limit', filters.limit);
      if (filters.offset) queryParams.append('offset', filters.offset);

      const response = await apiClient.request('election', `/api/elections/public?${queryParams.toString()}`, {
        method: 'GET'
      });

      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch public elections');
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching public elections:', error);
      throw new Error(error.message || 'Failed to fetch public elections');
    }
  }

  // Get specific election
  async getElection(electionId) {
    try {
      const response = await apiClient.request('election', `/api/elections/${electionId}`, {
        method: 'GET'
      });

      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch election');
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching election:', error);
      throw new Error(error.message || 'Election not found');
    }
  }

  // Update election
  async updateElection(electionId, formData) {
    try {
      const electionData = this.transformElectionData(formData);
      
      const response = await apiClient.request('election', `/api/elections/${electionId}`, {
        method: 'PUT',
        body: electionData
      });

      if (!response.success) {
        throw new Error(response.message || 'Failed to update election');
      }

      return response.data;
    } catch (error) {
      console.error('Error updating election:', error);
      throw new Error(error.message || 'Failed to update election');
    }
  }

  // Delete election
  async deleteElection(electionId) {
    try {
      const response = await apiClient.request('election', `/api/elections/${electionId}`, {
        method: 'DELETE'
      });

      if (!response.success) {
        throw new Error(response.message || 'Failed to delete election');
      }

      return response.data;
    } catch (error) {
      console.error('Error deleting election:', error);
      throw new Error(error.message || 'Failed to delete election');
    }
  }

  // Change election state
  async changeElectionState(electionId, state) {
    try {
      const response = await apiClient.request('election', `/api/elections/${electionId}/state`, {
        method: 'PATCH',
        body: { state }
      });

      if (!response.success) {
        throw new Error(response.message || 'Failed to change election state');
      }

      return response.data;
    } catch (error) {
      console.error('Error changing election state:', error);
      throw new Error(error.message || 'Failed to change election state');
    }
  }
}

// Create singleton instance
export const electionService = new ElectionService();
export default electionService;

// import { apiClient } from '../core/apiClient';

// class ElectionService {
//   constructor() {
//     this.serviceType = 'election';
//   }

//   // Transform frontend form data to backend format
//   transformElectionData(formData, isDraft = false) {
//     return {
//       title: formData.title,
//       description: formData.description,
//       category: formData.category || null,
//       voting_type: formData.votingType,
//       start_date: formData.startDate && formData.startTime 
//         ? `${formData.startDate}T${formData.startTime}:00.000Z` 
//         : null,
//       end_date: formData.endDate && formData.endTime 
//         ? `${formData.endDate}T${formData.endTime}:00.000Z` 
//         : null,
//       timezone: formData.timezone,
//       fee: formData.fee || 0,
//       biometric_required: formData.biometricRequired,
//       permissions: formData.permissions,
//       country_restriction: formData.countryRestriction || null,
//       group_id: formData.groupId || null,
//       organization_id: formData.organizationId || null,
//       allow_vote_changes: formData.allowVoteChanges,
//       show_results_during_voting: formData.showResultsDuringVoting,
//       state: isDraft ? 'draft' : 'active',
//       custom_branding: {
//         logo_url: formData.media?.logo || null,
//         banner_url: formData.media?.coverImage || null,
//         videos: formData.media?.videos || []
//       }
//     };
//   }

//   // Transform frontend question data to backend format
//   transformQuestionData(question, electionId, order) {
//     return {
//       election_id: electionId,
//       question_text: question.question,
//       question_type: question.type || 'multiple_choice',
//       is_required: question.required || true,
//       display_order: order,
//       options: {
//         allow_multiple_selection: question.type === 'checkbox',
//         randomize_options: false
//       }
//     };
//   }

//   // Transform frontend answer options to backend format
//   transformAnswerData(option, questionId, order) {
//     return {
//       question_id: questionId,
//       answer_text: option,
//       display_order: order,
//       is_correct: false // For polls, this doesn't matter
//     };
//   }

//   // Create election with questions and answers
//   async createElection(formData, isDraft = false) {
//     try {
//       console.log('Starting election creation process...');
      
//       // Step 1: Create the election
//       const electionData = this.transformElectionData(formData, isDraft);
//       console.log('Election data:', electionData);

//       const electionResponse = await apiClient.request('election', '/api/elections', {
//         method: 'POST',
//         body: electionData
//       });

//       if (!electionResponse.success) {
//         throw new Error(electionResponse.message || 'Failed to create election');
//       }

//       const electionId = electionResponse.data.election.election_id;
//       console.log('Election created with ID:', electionId);

//       // Step 2: Create questions with answers using the question service
//       const createdQuestions = [];
      
//       for (let i = 0; i < formData.questions.length; i++) {
//         const question = formData.questions[i];
        
//         // Filter out empty options
//         const validOptions = question.options.filter(option => option.trim());
        
//         if (validOptions.length < 2) {
//           throw new Error(`Question ${i + 1} must have at least 2 options`);
//         }

//         // Create question with answers in the question service
//         const questionData = {
//           question_text: question.question,
//           question_type: question.type || 'multiple_choice',
//           is_required: question.required || true,
//           display_order: i + 1,
//           options: {
//             allow_multiple_selection: question.type === 'checkbox',
//             randomize_options: false
//           },
//           answers: validOptions.map((option, index) => ({
//             answer_text: option,
//             display_order: index + 1,
//             is_correct: false
//           }))
//         };
        
//         console.log(`Creating question ${i + 1}:`, questionData);

//         const questionResponse = await apiClient.request('user', `/api/questions/${electionId}/questions`, {
//           method: 'POST',
//           body: questionData
//         });

//         if (!questionResponse.success) {
//           throw new Error(questionResponse.message || `Failed to create question ${i + 1}`);
//         }

//         createdQuestions.push(questionResponse.data);
//       }

//       console.log('Election creation completed successfully');

//       return {
//         success: true,
//         election: electionResponse.data.election,
//         questions: createdQuestions,
//         message: `Election ${isDraft ? 'saved as draft' : 'created'} successfully`
//       };

//     } catch (error) {
//       console.error('Error creating election:', error);
      
//       // Provide more specific error messages
//       if (error.message.includes('validation')) {
//         throw new Error('Validation failed. Please check your input data.');
//       } else if (error.message.includes('authentication')) {
//         throw new Error('Authentication failed. Please log in again.');
//       } else if (error.message.includes('permission')) {
//         throw new Error('You do not have permission to create elections.');
//       } else {
//         throw new Error(error.message || 'Failed to create election. Please try again.');
//       }
//     }
//   }

//   // Get user's elections
//   async getMyElections(filters = {}) {
//     try {
//       const queryParams = new URLSearchParams();
      
//       if (filters.state) queryParams.append('state', filters.state);
//       if (filters.voting_type) queryParams.append('voting_type', filters.voting_type);
//       if (filters.limit) queryParams.append('limit', filters.limit);
//       if (filters.offset) queryParams.append('offset', filters.offset);

//       const response = await apiClient.request('election', `/api/elections/my?${queryParams.toString()}`, {
//         method: 'GET'
//       });

//       if (!response.success) {
//         throw new Error(response.message || 'Failed to fetch elections');
//       }

//       return response.data;
//     } catch (error) {
//       console.error('Error fetching my elections:', error);
//       throw new Error(error.message || 'Failed to fetch elections');
//     }
//   }

//   // Get public elections
//   async getPublicElections(filters = {}) {
//     try {
//       const queryParams = new URLSearchParams();
      
//       if (filters.voting_type) queryParams.append('voting_type', filters.voting_type);
//       if (filters.search) queryParams.append('search', filters.search);
//       if (filters.limit) queryParams.append('limit', filters.limit);
//       if (filters.offset) queryParams.append('offset', filters.offset);

//       const response = await apiClient.request('election', `/api/elections/public?${queryParams.toString()}`, {
//         method: 'GET'
//       });

//       if (!response.success) {
//         throw new Error(response.message || 'Failed to fetch public elections');
//       }

//       return response.data;
//     } catch (error) {
//       console.error('Error fetching public elections:', error);
//       throw new Error(error.message || 'Failed to fetch public elections');
//     }
//   }

//   // Get specific election
//   async getElection(electionId) {
//     try {
//       const response = await apiClient.request('election', `/api/elections/${electionId}`, {
//         method: 'GET'
//       });

//       if (!response.success) {
//         throw new Error(response.message || 'Failed to fetch election');
//       }

//       return response.data;
//     } catch (error) {
//       console.error('Error fetching election:', error);
//       throw new Error(error.message || 'Election not found');
//     }
//   }

//   // Update election
//   async updateElection(electionId, formData) {
//     try {
//       const electionData = this.transformElectionData(formData);
      
//       const response = await apiClient.request('election', `/api/elections/${electionId}`, {
//         method: 'PUT',
//         body: electionData
//       });

//       if (!response.success) {
//         throw new Error(response.message || 'Failed to update election');
//       }

//       return response.data;
//     } catch (error) {
//       console.error('Error updating election:', error);
//       throw new Error(error.message || 'Failed to update election');
//     }
//   }

//   // Delete election
//   async deleteElection(electionId) {
//     try {
//       const response = await apiClient.request('election', `/api/elections/${electionId}`, {
//         method: 'DELETE'
//       });

//       if (!response.success) {
//         throw new Error(response.message || 'Failed to delete election');
//       }

//       return response.data;
//     } catch (error) {
//       console.error('Error deleting election:', error);
//       throw new Error(error.message || 'Failed to delete election');
//     }
//   }

//   // Change election state
//   async changeElectionState(electionId, state) {
//     try {
//       const response = await apiClient.request('election', `/api/elections/${electionId}/state`, {
//         method: 'PATCH',
//         body: { state }
//       });

//       if (!response.success) {
//         throw new Error(response.message || 'Failed to change election state');
//       }

//       return response.data;
//     } catch (error) {
//       console.error('Error changing election state:', error);
//       throw new Error(error.message || 'Failed to change election state');
//     }
//   }
// }

// // Create singleton instance
// export const electionService = new ElectionService();
// export default electionService;
// import BaseService from "../core/BaseService";

// class ElectionService extends BaseService {
//   constructor() {
//     super('election');
//   }

//   async getElections(filters = {}, page = 1, limit = 20) {
//     return this.getPaginated('/api/elections', page, limit, { filters });
//   }

//   async createElection(electionData) {
//     return this.post('/api/elections', electionData);
//   }

//   async updateElection(electionId, updates) {
//     return this.patch(`/api/elections/${electionId}`, updates);
//   }

//   async deleteElection(electionId) {
//     return this.delete(`/api/elections/${electionId}`);
//   }

//   async getElectionResults(electionId) {
//     return this.get(`/api/elections/${electionId}/results`);
//   }

//   async getElectionAnalytics(electionId) {
//     return this.get(`/api/elections/${electionId}/analytics`);
//   }
// }

// export const electionService = new ElectionService();
