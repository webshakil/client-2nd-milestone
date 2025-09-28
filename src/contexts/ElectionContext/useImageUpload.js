import { useCallback } from 'react';
import { useElection } from './useElection';

export const useImageUpload = () => {
  const { setUploadedFiles, uploadedFiles } = useElection();
  
  const uploadImage = useCallback((file, type, questionId, answerId = null) => {
    // Store the file for later upload
    const fileKey = answerId ? `${type}_${questionId}_${answerId}` : `${type}_${questionId}`;
    
    setUploadedFiles({
      [fileKey]: file
    });
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    
    // Update the appropriate image URL in the election data
    // This would need to be implemented based on your specific requirements
    console.log('Image uploaded:', { file, type, questionId, answerId, previewUrl });
    
  }, [setUploadedFiles]);
  
  const removeImage = useCallback((type, questionId, answerId = null) => {
    const fileKey = answerId ? `${type}_${questionId}_${answerId}` : `${type}_${questionId}`;
    
    // Remove from uploaded files
    const newFiles = { ...uploadedFiles };
    delete newFiles[fileKey];
    setUploadedFiles(newFiles);
    
    console.log('Image removed:', { type, questionId, answerId });
  }, [uploadedFiles, setUploadedFiles]);
  
  return {
    uploadImage,
    removeImage,
    isUploading: false // You can add actual loading state here
  };
};
// // contexts/ElectionContext/useImageUpload.js
// import { useCallback } from 'react';
// import { useElection } from './useElection';

// export const useImageUpload = () => {
//   const { setUploadedFiles } = useElection();
  
//   const uploadImage = useCallback((fileType, file) => {
//     setUploadedFiles({ [fileType]: file });
//   }, [setUploadedFiles]);
  
//   return { uploadImage };
// };