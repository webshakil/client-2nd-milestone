import { BaseService } from "../core/BaseService";

class QuestionService extends BaseService {
  constructor() {
    super('election');
  }

  // Create questions for an election
  async createQuestions(questionsData) {
    try {
      const response = await this.post('/api/v1/questions/', questionsData);
      return response;
    } catch (error) {
      console.error('Failed to create questions:', error);
      throw error;
    }
  }

  // Get questions by election ID
  async getQuestionsByElection(electionId) {
    try {
      const response = await this.get(`/api/v1/questions/?election_id=${electionId}`);
      return response;
    } catch (error) {
      console.error('Failed to get questions:', error);
      throw error;
    }
  }

  // Update question
  async updateQuestion(questionId, questionData) {
    try {
      const response = await this.put(`/api/v1/questions/${questionId}`, questionData);
      return response;
    } catch (error) {
      console.error('Failed to update question:', error);
      throw error;
    }
  }

  // Delete question
  async deleteQuestion(questionId) {
    try {
      const response = await this.delete(`/api/v1/questions/${questionId}`);
      return response;
    } catch (error) {
      console.error('Failed to delete question:', error);
      throw error;
    }
  }

  // Bulk update questions
  async updateQuestions(questionsData) {
    try {
      const response = await this.put('/api/v1/questions/', questionsData);
      return response;
    } catch (error) {
      console.error('Failed to update questions:', error);
      throw error;
    }
  }
}