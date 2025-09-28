// contexts/ElectionContext/useElection.js
import { useContext } from 'react';
import  ElectionContext  from './ElectionContext';

export const useElection = () => {
  const context = useContext(ElectionContext);
  
  if (!context) {
    throw new Error('useElection must be used within an ElectionProvider');
  }
  
  // Extract questions and provide question management functions
  const questions = context.election.questions || [];
  
  const addQuestion = (questionData) => {
    const newQuestion = {
      id: `question_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...questionData
    };
    
    const updatedQuestions = [...questions, newQuestion];
    context.updateElectionField({ questions: updatedQuestions });
    return newQuestion.id;
  };
  
  const updateQuestion = (questionId, updates) => {
    const updatedQuestions = questions.map(q => 
      q.id === questionId ? { ...q, ...updates } : q
    );
    context.updateElectionField({ questions: updatedQuestions });
  };
  
  const deleteQuestion = (questionId) => {
    const updatedQuestions = questions.filter(q => q.id !== questionId);
    context.updateElectionField({ questions: updatedQuestions });
  };
  
  const addAnswer = (questionId, answerData) => {
    const newAnswer = {
      id: `answer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...answerData
    };
    
    const updatedQuestions = questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          answers: [...(q.answers || []), newAnswer]
        };
      }
      return q;
    });
    
    context.updateElectionField({ questions: updatedQuestions });
    return newAnswer.id;
  };
  
  const updateAnswer = (questionId, answerId, updates) => {
    const updatedQuestions = questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          answers: (q.answers || []).map(a => 
            a.id === answerId ? { ...a, ...updates } : a
          )
        };
      }
      return q;
    });
    
    context.updateElectionField({ questions: updatedQuestions });
  };
  
  const deleteAnswer = (questionId, answerId) => {
    const updatedQuestions = questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          answers: (q.answers || []).filter(a => a.id !== answerId)
        };
      }
      return q;
    });
    
    context.updateElectionField({ questions: updatedQuestions });
  };
  
  return {
    ...context,
    questions,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    addAnswer,
    updateAnswer,
    deleteAnswer
  };
};
// // contexts/ElectionContext/useElection.js
// import { useContext } from 'react';
// import { ElectionContext } from './ElectionContext';

// export const useElection = () => {
//   const context = useContext(ElectionContext);
  
//   if (!context) {
//     throw new Error('useElection must be used within an ElectionProvider');
//   }
  
//   return context;
// };