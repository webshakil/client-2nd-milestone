import { BaseService } from "../core/BaseService";

class UploadService extends BaseService {
  constructor() {
    super('election');
  }

  // Upload single file
  async uploadFile(file, metadata = {}) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Add metadata
      Object.keys(metadata).forEach(key => {
        formData.append(key, metadata[key]);
      });

      const response = await this.request('/api/v1/uploads/', {
        method: 'POST',
        body: formData,
        headers: {
          // Remove Content-Type header to let browser set boundary for FormData
          ...this.getHeaders(),
          'Content-Type': undefined
        }
      });

      return response;
    } catch (error) {
      console.error('Failed to upload file:', error);
      throw error;
    }
  }

  // Upload multiple files
  async uploadFiles(files, metadata = {}) {
    try {
      const formData = new FormData();
      
      // Add files
      files.forEach((file) => {
        formData.append(`files`, file);
      });

      // Add metadata
      Object.keys(metadata).forEach(key => {
        formData.append(key, metadata[key]);
      });

      const response = await this.request('/api/v1/uploads/', {
        method: 'POST',
        body: formData,
        headers: {
          ...this.getHeaders(),
          'Content-Type': undefined
        }
      });

      return response;
    } catch (error) {
      console.error('Failed to upload files:', error);
      throw error;
    }
  }

  // Upload image with specific metadata for questions/answers
  async uploadQuestionImage(file, questionId, answerId = null) {
    const metadata = {
      questionId,
      type: answerId ? 'answer' : 'question'
    };

    if (answerId) {
      metadata.answerId = answerId;
    }

    return this.uploadFile(file, metadata);
  }

  // Upload election topic image
  async uploadTopicImage(file, electionId) {
    return this.uploadFile(file, {
      electionId,
      type: 'topic'
    });
  }

  // Upload logo branding image
  async uploadBrandingLogo(file, electionId) {
    return this.uploadFile(file, {
      electionId,
      type: 'branding'
    });
  }

  // Get upload status
  async getUploadStatus(uploadId) {
    try {
      const response = await this.get(`/api/v1/uploads/${uploadId}/status`);
      return response;
    } catch (error) {
      console.error('Failed to get upload status:', error);
      throw error;
    }
  }

  // Delete uploaded file
  async deleteUpload(uploadId) {
    try {
      const response = await this.delete(`/api/v1/uploads/${uploadId}`);
      return response;
    } catch (error) {
      console.error('Failed to delete upload:', error);
      throw error;
    }
  }
}