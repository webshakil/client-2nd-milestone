import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Image as ImageIcon, 
  Type, 
  List, 
  Upload,
  X,
  Save,
  HelpCircle,
  Scale
} from 'lucide-react';
import { questionHelpers, questionService, questionTypeConfigs, votingTypeConfigs } from '../../../services/election/questionAPI';

const QuestionCreator = ({ 
  electionId, 
  votingType, 
  questions, 
  setQuestions, 
  updateFormData, 
  errors = {},
  /*eslint-disable*/
  uploadedFiles = [],
  setUploadedFiles = null
}) => {
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [savingQuestion, setSavingQuestion] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Sync questions to parent formData whenever questions change
  useEffect(() => {
    updateFormData({ questions: questions });
  }, [questions]);

  const addQuestion = () => {
    const newQuestion = {
      id: `temp_${Date.now()}`,
      questionText: '',
      questionType: 'multiple_choice', // Default type
      questionImageUrl: null,
      answers: [],
      isRequired: true,
      allowOtherOption: false,
      characterLimit: 5000,
      isNew: true
    };
    
    const updatedQuestions = [...questions, newQuestion];
    setQuestions(updatedQuestions);
    setEditingQuestion(newQuestion.id);
  };

  const updateQuestion = (questionId, updates) => {
    const updatedQuestions = questions.map(q => 
      q.id === questionId ? { ...q, ...updates } : q
    );
    setQuestions(updatedQuestions);
  };

  const deleteQuestion = (questionId) => {
    if (questions.length <= 1) {
      alert('At least one question is required');
      return;
    }
    
    const updatedQuestions = questions.filter(q => q.id !== questionId);
    setQuestions(updatedQuestions);
    if (editingQuestion === questionId) {
      setEditingQuestion(null);
    }

    // Remove associated uploaded files
    if (setUploadedFiles) {
      setUploadedFiles(prev => prev.filter(f => f.questionId !== questionId));
    }
  };

  const addAnswer = (questionId) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;
    
    const config = questionTypeConfigs[question.questionType];
    if (question.answers.length >= config.maxAnswers) {
      alert(`Maximum ${config.maxAnswers} answers allowed for ${config.name}`);
      return;
    }

    const newAnswer = {
      id: `answer_${Date.now()}`,
      text: '',
      imageUrl: null
    };
    
    updateQuestion(questionId, {
      answers: [...question.answers, newAnswer]
    });
  };

  const updateAnswer = (questionId, answerId, field, value) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;
    
    const updatedAnswers = question.answers.map(answer =>
      answer.id === answerId ? { ...answer, [field]: value } : answer
    );
    
    updateQuestion(questionId, { answers: updatedAnswers });
  };

  const deleteAnswer = (questionId, answerId) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;
    
    const config = questionTypeConfigs[question.questionType];
    if (question.answers.length <= config.minAnswers) {
      alert(`Minimum ${config.minAnswers} answers required for ${config.name}`);
      return;
    }
    
    const updatedAnswers = question.answers.filter(answer => answer.id !== answerId);
    updateQuestion(questionId, { answers: updatedAnswers });

    // Remove associated uploaded file
    if (setUploadedFiles) {
      setUploadedFiles(prev => prev.filter(f => !(f.fieldName === 'answerImage' && f.answerId === answerId)));
    }
  };

  const handleImageUpload = async (file, questionId, answerId = null) => {
    setUploadingImage(true);
    try {
      // Create file data object like your ImageUploader does
      const fileData = {
        file: file,
        previewUrl: URL.createObjectURL(file),
        fieldName: answerId ? 'answerImage' : 'questionImage',
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        questionId: questionId,
        answerId: answerId
      };

      if (answerId) {
        // Update answer image with preview URL
        updateAnswer(questionId, answerId, 'imageUrl', fileData.previewUrl);
        
        // Add to uploadedFiles array
        if (setUploadedFiles) {
          setUploadedFiles(prev => [
            ...prev.filter(f => !(f.fieldName === 'answerImage' && f.answerId === answerId)),
            fileData
          ]);
        }
      } else {
        // Update question image with preview URL
        updateQuestion(questionId, { questionImageUrl: fileData.previewUrl });
        
        // Add to uploadedFiles array
        if (setUploadedFiles) {
          setUploadedFiles(prev => [
            ...prev.filter(f => !(f.fieldName === 'questionImage' && f.questionId === questionId)),
            fileData
          ]);
        }
      }
      
    } catch (error) {
      alert('Failed to upload image: ' + error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const saveQuestion = async (questionId) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;

    // Validate question
    const validation = questionHelpers.validateQuestion(
      votingType, 
      question.questionType,
      question.questionText, 
      question.answers
    );

    if (!validation.isValid) {
      alert(Object.values(validation.errors)[0]);
      return;
    }

    setSavingQuestion(true);
    try {
      const questionData = questionHelpers.createQuestionData(
        votingType,
        question.questionType,
        question.questionText,
        question.answers,
        {
          questionImageUrl: question.questionImageUrl,
          questionOrder: questions.findIndex(q => q.id === questionId) + 1,
          isRequired: question.isRequired,
          allowOtherOption: question.allowOtherOption,
          characterLimit: question.characterLimit
        }
      );

      if (question.isNew) {
        const response = await questionService.createQuestion(electionId, questionData);
        updateQuestion(questionId, {
          ...response.data,
          isNew: false
        });
      } else {
        await questionService.updateQuestion(question.id, questionData);
      }

      setEditingQuestion(null);
      updateFormData({ questions: questions });
      
    } catch (error) {
      alert(error.message);
    } finally {
      setSavingQuestion(false);
    }
  };

  const handleQuestionTypeChange = (questionId, newType) => {
    const defaultQuestion = questionHelpers.getDefaultQuestion(newType, votingType);
    updateQuestion(questionId, {
      questionType: newType,
      questionText: defaultQuestion.questionText,
      answers: defaultQuestion.answers
    });
  };

  const votingConfig = votingTypeConfigs[votingType];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <span className="text-3xl">
            {votingType === 'plurality' && '🗳️'}
            {votingType === 'ranked_choice' && '📊'}
            {votingType === 'approval' && '✅'}
          </span>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{votingConfig?.title}</h2>
            <p className="text-gray-600">{votingConfig?.description}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-md p-4 border border-blue-200">
          <div className="flex items-start space-x-2">
            <HelpCircle className="w-5 h-5 text-blue-500 mt-0.5" />
            <div className="text-sm text-blue-700">
              <strong>Supported Question Types (All Compatible):</strong>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                {Object.entries(questionTypeConfigs).map(([key, config]) => (
                  <div key={key} className="bg-blue-50 rounded px-2 py-1">
                    <span className="mr-1">{config.icon}</span>
                    <span className="text-xs font-medium">{config.name.split(' ')[0]} {config.name.split(' ')[1]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((question, index) => {
          const questionConfig = questionTypeConfigs[question.questionType] || questionTypeConfigs.multiple_choice;
          
          return (
            <div key={question.id} className="bg-white rounded-lg border border-gray-200 shadow-sm">
              {/* Question Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {question.questionText || 'Untitled Question'}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded flex items-center">
                        <span className="mr-1">{questionConfig.icon}</span>
                        {questionConfig.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {questionHelpers.getVotingBehavior(question.questionType, votingType)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setEditingQuestion(
                      editingQuestion === question.id ? null : question.id
                    )}
                    className="p-2 rounded-md text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  
                  {questions.length > 1 && (
                    <button
                      onClick={() => deleteQuestion(question.id)}
                      className="p-2 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Question Content */}
              <div className="p-6">
                {editingQuestion === question.id ? (
                  // Edit Mode
                  <div className="space-y-6">
                    {/* Question Type Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Question Type *
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {Object.entries(questionTypeConfigs).map(([typeKey, typeConfig]) => (
                          <div
                            key={typeKey}
                            className={`relative rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                              question.questionType === typeKey
                                ? 'border-purple-500 bg-purple-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => handleQuestionTypeChange(question.id, typeKey)}
                          >
                            <div className="p-4">
                              <div className="flex items-center space-x-3 mb-2">
                                <span className="text-xl">{typeConfig.icon}</span>
                                <h4 className="font-medium text-gray-900 text-sm">{typeConfig.name}</h4>
                              </div>
                              <p className="text-xs text-gray-600 mb-2">{typeConfig.description}</p>
                              <p className="text-xs font-medium text-purple-700">
                                {typeConfig.votingBehavior[votingType]}
                              </p>
                            </div>
                            
                            {question.questionType === typeKey && (
                              <div className="absolute top-2 right-2">
                                <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Question Text */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Question Text *
                      </label>
                      <input
                        type="text"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500"
                        placeholder={questionConfig.example.question || "Enter your question..."}
                        value={question.questionText || ''}
                        onChange={(e) => updateQuestion(question.id, { questionText: e.target.value })}
                      />
                    </div>

                    {/* Question Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Question Image (Optional)
                      </label>
                      <div className="flex items-center space-x-4">
                        {question.questionImageUrl ? (
                          <div className="relative">
                            <img 
                              src={question.questionImageUrl} 
                              alt="Question" 
                              className="w-24 h-24 object-cover rounded-lg"
                            />
                            <button
                              onClick={() => {
                                updateQuestion(question.id, { questionImageUrl: null });
                                if (setUploadedFiles) {
                                  setUploadedFiles(prev => prev.filter(f => !(f.fieldName === 'questionImage' && f.questionId === question.id)));
                                }
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-500">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files[0]) {
                                  handleImageUpload(e.target.files[0], question.id);
                                }
                              }}
                            />
                            <Upload className="w-6 h-6 text-gray-400" />
                          </label>
                        )}
                        <div className="text-sm text-gray-500">
                          Upload an image to accompany this question
                        </div>
                      </div>
                    </div>

                    {/* Type-Specific Content */}
                    {questionConfig.requiresAnswers && (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="block text-sm font-medium text-gray-700">
                            Answer Options * 
                            <span className="text-gray-500">
                              (Min: {questionConfig.minAnswers}, Max: {questionConfig.maxAnswers})
                            </span>
                          </label>
                          <button
                            onClick={() => addAnswer(question.id)}
                            disabled={question.answers?.length >= questionConfig.maxAnswers}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-purple-600 bg-purple-100 hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add Option
                          </button>
                        </div>

                        <div className="space-y-3">
                          {(question.answers || []).map((answer, answerIndex) => (
                            <div key={answer.id} className="bg-gray-50 rounded-lg p-4">
                              <div className="flex items-start space-x-3">
                                <span className="text-sm text-gray-500 mt-3 w-8">
                                  {votingType === 'ranked_choice' ? `${answerIndex + 1}.` : '•'}
                                </span>
                                
                                <div className="flex-1 space-y-3">
                                  <input
                                    type="text"
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500"
                                    placeholder={`Option ${answerIndex + 1}`}
                                    value={answer.text || ''}
                                    onChange={(e) => updateAnswer(question.id, answer.id, 'text', e.target.value)}
                                  />
                                  
                                  {/* Image Upload for Options */}
                                  {(question.questionType === 'image_based' || question.questionType === 'comparison') && (
                                    <div className="flex items-center space-x-3">
                                      {answer.imageUrl ? (
                                        <div className="relative">
                                          <img 
                                            src={answer.imageUrl} 
                                            alt={answer.text} 
                                            className="w-16 h-16 object-cover rounded-lg"
                                          />
                                          <button
                                            onClick={() => {
                                              updateAnswer(question.id, answer.id, 'imageUrl', null);
                                              if (setUploadedFiles) {
                                                setUploadedFiles(prev => prev.filter(f => !(f.fieldName === 'answerImage' && f.answerId === answer.id)));
                                              }
                                            }}
                                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1"
                                          >
                                            <X className="w-2 h-2" />
                                          </button>
                                        </div>
                                      ) : (
                                        <label className="flex items-center justify-center w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-500">
                                          <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                              if (e.target.files[0]) {
                                                handleImageUpload(e.target.files[0], question.id, answer.id);
                                              }
                                            }}
                                          />
                                          <ImageIcon className="w-4 h-4 text-gray-400" />
                                        </label>
                                      )}
                                      <span className="text-xs text-gray-500">
                                        {question.questionType === 'image_based' ? 'Required image' : 'Optional image'}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                
                                {question.answers.length > questionConfig.minAnswers && (
                                  <button
                                    onClick={() => deleteAnswer(question.id, answer.id)}
                                    className="p-2 text-gray-400 hover:text-red-600 mt-1"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Open Answer Configuration */}
                    {question.questionType === 'open_answer' && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                        <div className="flex items-start space-x-2 mb-3">
                          <Type className="w-5 h-5 text-yellow-600 mt-1" />
                          <div className="flex-1">
                            <h4 className="font-medium text-yellow-800">Open-Ended Text Question</h4>
                            <p className="text-sm text-yellow-700 mt-1">
                              Voters will type their own response. No predefined answers needed.
                              Voting behavior: {questionHelpers.getVotingBehavior(question.questionType, votingType)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <label className="block text-sm font-medium text-yellow-800 mb-2">
                            Character Limit
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="5000"
                            className="block w-32 rounded-md border-yellow-300 shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                            value={question.characterLimit || 5000}
                            onChange={(e) => updateQuestion(question.id, { characterLimit: parseInt(e.target.value) || 5000 })}
                          />
                          <p className="text-xs text-yellow-600 mt-1">Maximum characters: 1-5000</p>
                        </div>
                      </div>
                    )}

                    {/* Additional Options */}
                    <div className="space-y-3 border-t border-gray-200 pt-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`required-${question.id}`}
                          checked={question.isRequired}
                          onChange={(e) => updateQuestion(question.id, { isRequired: e.target.checked })}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`required-${question.id}`} className="ml-2 text-sm text-gray-700">
                          This question is required
                        </label>
                      </div>

                      {questionConfig.requiresAnswers && (
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`other-${question.id}`}
                            checked={question.allowOtherOption}
                            onChange={(e) => updateQuestion(question.id, { allowOtherOption: e.target.checked })}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`other-${question.id}`} className="ml-2 text-sm text-gray-700">
                            Allow "Other" option with text input
                          </label>
                        </div>
                      )}
                    </div>

                    {/* Voting Behavior Preview */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-md p-4">
                      <h5 className="font-medium text-gray-800 mb-2">How Voters Will Interact:</h5>
                      <div className="text-sm text-gray-700">
                        <strong>{votingType.charAt(0).toUpperCase() + votingType.slice(1).replace('_', ' ')} Voting:</strong>{' '}
                        {questionHelpers.getVotingBehavior(question.questionType, votingType)}
                      </div>
                    </div>

                    {/* Save/Cancel Buttons */}
                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => setEditingQuestion(null)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => saveQuestion(question.id)}
                        disabled={savingQuestion || uploadingImage}
                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 flex items-center"
                      >
                        {savingQuestion ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Question
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="space-y-4">
                    {question.questionImageUrl && (
                      <img 
                        src={question.questionImageUrl} 
                        alt="Question" 
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    )}

                    {/* Question Type Display */}
                    <div className="bg-gray-50 rounded-md p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{questionConfig.icon}</span>
                          <span className="font-medium text-gray-800">{questionConfig.name}</span>
                        </div>
                        <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
                          {questionHelpers.getVotingBehavior(question.questionType, votingType)}
                        </span>
                      </div>
                    </div>

                    {/* Answers Display */}
                    {questionConfig.requiresAnswers && (
                      <div className="space-y-2">
                        {(question.answers || []).map((answer, answerIndex) => (
                          <div key={answer.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                            <span className="text-sm font-medium text-gray-500 w-8">
                              {votingType === 'ranked_choice' ? `${answerIndex + 1}.` : '•'}
                            </span>
                            {answer.imageUrl && (
                              <img 
                                src={answer.imageUrl} 
                                alt={answer.text} 
                                className="w-8 h-8 object-cover rounded"
                              />
                            )}
                            <span className="text-gray-700">
                              {answer.text || `Option ${answerIndex + 1}`}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {question.questionType === 'open_answer' && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                        <p className="text-sm text-yellow-700">
                          📝 Text input field - max {question.characterLimit || 5000} characters
                        </p>
                      </div>
                    )}

                    {/* Question Settings */}
                    <div className="flex items-center space-x-4 text-xs">
                      {question.isRequired && (
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">Required</span>
                      )}
                      {question.allowOtherOption && (
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">Allow Other</span>
                      )}
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                        {votingType === 'plurality' ? 'Single Selection' : 
                         votingType === 'ranked_choice' ? 'Ranking Required' : 
                         'Multiple Selection'}
                      </span>
                      {questionConfig.requiresAnswers && (
                        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
                          {question.answers?.length || 0} Options
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Question Button */}
      <div className="flex justify-center">
        <button
          onClick={addQuestion}
          className="inline-flex items-center px-6 py-3 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:text-purple-600 hover:border-purple-300 hover:bg-purple-50 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Question
        </button>
      </div>

      {/* Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Question Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {Object.entries(questionTypeConfigs).map(([key, config]) => {
            const count = questions.filter(q => q.questionType === key).length;
            return (
              <div key={key} className="text-center">
                <div className="text-xl mb-1">{config.icon}</div>
                <div className="font-medium">{count}</div>
                <div className="text-gray-500 text-xs">{config.name.split(' ')[0]}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Validation Errors */}
      {errors.questions && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-700">{errors.questions}</p>
        </div>
      )}
    </div>
  );
};

export default QuestionCreator;





// //this is the last working version
// // //to get question preview
// import React, { useState, useEffect } from 'react';
// import { 
//   Plus, 
//   Trash2, 
//   Edit3, 
//   Image as ImageIcon, 
//   Type, 
//   List, 
//   Upload,
//   X,
//   Save,
//   HelpCircle,
//   Scale
// } from 'lucide-react';
// import { questionHelpers, questionService, questionTypeConfigs, votingTypeConfigs } from '../../../services/election/questionAPI';
// //import { questionService, votingTypeConfigs, questionTypeConfigs, questionHelpers } from '../../../services/election-2/questionAPI';

// const QuestionCreator = ({ 
//   electionId, 
//   votingType, 
//   questions, 
//   setQuestions, 
//   updateFormData, 
//   errors = {} 
// }) => {
//   const [editingQuestion, setEditingQuestion] = useState(null);
//   const [savingQuestion, setSavingQuestion] = useState(false);
//   const [uploadingImage, setUploadingImage] = useState(false);

//   // Sync questions to parent formData whenever questions change
//   useEffect(() => {
//     updateFormData({ questions: questions });
//   }, [questions]);

//   const addQuestion = () => {
//     const newQuestion = {
//       id: `temp_${Date.now()}`,
//       questionText: '',
//       questionType: 'multiple_choice', // Default type
//       questionImageUrl: null,
//       answers: [],
//       isRequired: true,
//       allowOtherOption: false,
//       characterLimit: 5000,
//       isNew: true
//     };
    
//     const updatedQuestions = [...questions, newQuestion];
//     setQuestions(updatedQuestions);
//     setEditingQuestion(newQuestion.id);
//   };

//   const updateQuestion = (questionId, updates) => {
//     const updatedQuestions = questions.map(q => 
//       q.id === questionId ? { ...q, ...updates } : q
//     );
//     setQuestions(updatedQuestions);
//   };

//   const deleteQuestion = (questionId) => {
//     if (questions.length <= 1) {
//       alert('At least one question is required');
//       return;
//     }
    
//     const updatedQuestions = questions.filter(q => q.id !== questionId);
//     setQuestions(updatedQuestions);
//     if (editingQuestion === questionId) {
//       setEditingQuestion(null);
//     }
//   };

//   const addAnswer = (questionId) => {
//     const question = questions.find(q => q.id === questionId);
//     if (!question) return;
    
//     const config = questionTypeConfigs[question.questionType];
//     if (question.answers.length >= config.maxAnswers) {
//       alert(`Maximum ${config.maxAnswers} answers allowed for ${config.name}`);
//       return;
//     }

//     const newAnswer = {
//       id: `answer_${Date.now()}`,
//       text: '',
//       imageUrl: null
//     };
    
//     updateQuestion(questionId, {
//       answers: [...question.answers, newAnswer]
//     });
//   };

//   const updateAnswer = (questionId, answerId, field, value) => {
//     const question = questions.find(q => q.id === questionId);
//     if (!question) return;
    
//     const updatedAnswers = question.answers.map(answer =>
//       answer.id === answerId ? { ...answer, [field]: value } : answer
//     );
    
//     updateQuestion(questionId, { answers: updatedAnswers });
//   };

//   const deleteAnswer = (questionId, answerId) => {
//     const question = questions.find(q => q.id === questionId);
//     if (!question) return;
    
//     const config = questionTypeConfigs[question.questionType];
//     if (question.answers.length <= config.minAnswers) {
//       alert(`Minimum ${config.minAnswers} answers required for ${config.name}`);
//       return;
//     }
    
//     const updatedAnswers = question.answers.filter(answer => answer.id !== answerId);
//     updateQuestion(questionId, { answers: updatedAnswers });
//   };

// const handleImageUpload = async (file, questionId, answerId = null) => {
//   setUploadingImage(true);
//   try {
//     const formData = new FormData();
//     formData.append('image', file);
    
//     // TODO: Call your image upload API here
//     // const response = await fetch('/api/upload/image', {
//     //   method: 'POST',
//     //   headers: {
//     //     'Authorization': `Bearer ${localStorage.getItem('authToken')}`
//     //   },
//     //   body: formData
//     // });
//     // 
//     // const data = await response.json();
    
//     // For now, create a temporary URL for preview
//     const tempImageUrl = URL.createObjectURL(file);
    
//     if (answerId) {
//       // Update answer image
//       updateAnswer(questionId, answerId, 'imageUrl', tempImageUrl);
//     } else {
//       // Update question image
//       updateQuestion(questionId, { questionImageUrl: tempImageUrl });
//     }
    
//   } catch (error) {
//     alert('Failed to upload image: ' + error.message);
//   } finally {
//     setUploadingImage(false);
//   }
// };
//   // const handleImageUpload = async (file, questionId, answerId = null) => {
//   //   setUploadingImage(true);
//   //   try {
//   //     const formData = new FormData();
//   //     formData.append('image', file);
      
//   //     // Call your image upload API here
//   //     const response = await fetch('/api/upload/image', {
//   //       method: 'POST',
//   //       headers: {
//   //         'Authorization': `Bearer ${localStorage.getItem('authToken')}`
//   //       },
//   //       body: formData
//   //     });
      
//   //     const data = await response.json();
      
//   //     if (answerId) {
//   //       // Update answer image
//   //       updateAnswer(questionId, answerId, 'imageUrl', data.imageUrl);
//   //     } else {
//   //       // Update question image
//   //       updateQuestion(questionId, { questionImageUrl: data.imageUrl });
//   //     }
      
//   //   } catch (error) {
//   //     alert('Failed to upload image: ' + error.message);
//   //   } finally {
//   //     setUploadingImage(false);
//   //   }
//   // };

//   const saveQuestion = async (questionId) => {
//     const question = questions.find(q => q.id === questionId);
//     if (!question) return;

//     // Validate question
//     const validation = questionHelpers.validateQuestion(
//       votingType, 
//       question.questionType,
//       question.questionText, 
//       question.answers
//     );

//     if (!validation.isValid) {
//       alert(Object.values(validation.errors)[0]);
//       return;
//     }

//     setSavingQuestion(true);
//     try {
//       const questionData = questionHelpers.createQuestionData(
//         votingType,
//         question.questionType,
//         question.questionText,
//         question.answers,
//         {
//           questionImageUrl: question.questionImageUrl,
//           questionOrder: questions.findIndex(q => q.id === questionId) + 1,
//           isRequired: question.isRequired,
//           allowOtherOption: question.allowOtherOption,
//           characterLimit: question.characterLimit
//         }
//       );

//       if (question.isNew) {
//         const response = await questionService.createQuestion(electionId, questionData);
//         updateQuestion(questionId, {
//           ...response.data,
//           isNew: false
//         });
//       } else {
//         await questionService.updateQuestion(question.id, questionData);
//       }

//       setEditingQuestion(null);
//       updateFormData({ questions: questions });
      
//     } catch (error) {
//       alert(error.message);
//     } finally {
//       setSavingQuestion(false);
//     }
//   };

//   const handleQuestionTypeChange = (questionId, newType) => {
//     const defaultQuestion = questionHelpers.getDefaultQuestion(newType, votingType);
//     updateQuestion(questionId, {
//       questionType: newType,
//       questionText: defaultQuestion.questionText,
//       answers: defaultQuestion.answers
//     });
//   };

//   const votingConfig = votingTypeConfigs[votingType];

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
//         <div className="flex items-center space-x-3 mb-4">
//           <span className="text-3xl">
//             {votingType === 'plurality' && '🗳️'}
//             {votingType === 'ranked_choice' && '📊'}
//             {votingType === 'approval' && '✅'}
//           </span>
//           <div>
//             <h2 className="text-xl font-bold text-gray-900">{votingConfig?.title}</h2>
//             <p className="text-gray-600">{votingConfig?.description}</p>
//           </div>
//         </div>
        
//         <div className="bg-white rounded-md p-4 border border-blue-200">
//           <div className="flex items-start space-x-2">
//             <HelpCircle className="w-5 h-5 text-blue-500 mt-0.5" />
//             <div className="text-sm text-blue-700">
//               <strong>Supported Question Types (All Compatible):</strong>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
//                 {Object.entries(questionTypeConfigs).map(([key, config]) => (
//                   <div key={key} className="bg-blue-50 rounded px-2 py-1">
//                     <span className="mr-1">{config.icon}</span>
//                     <span className="text-xs font-medium">{config.name.split(' ')[0]} {config.name.split(' ')[1]}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Questions List */}
//       <div className="space-y-4">
//         {questions.map((question, index) => {
//           const questionConfig = questionTypeConfigs[question.questionType] || questionTypeConfigs.multiple_choice;
          
//           return (
//             <div key={question.id} className="bg-white rounded-lg border border-gray-200 shadow-sm">
//               {/* Question Header */}
//               <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
//                 <div className="flex items-center space-x-3">
//                   <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
//                     {index + 1}
//                   </span>
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900">
//                       {question.questionText || 'Untitled Question'}
//                     </h3>
//                     <div className="flex items-center space-x-2 mt-1">
//                       <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded flex items-center">
//                         <span className="mr-1">{questionConfig.icon}</span>
//                         {questionConfig.name}
//                       </span>
//                       <span className="text-xs text-gray-500">
//                         {questionHelpers.getVotingBehavior(question.questionType, votingType)}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="flex items-center space-x-2">
//                   <button
//                     onClick={() => setEditingQuestion(
//                       editingQuestion === question.id ? null : question.id
//                     )}
//                     className="p-2 rounded-md text-gray-500 hover:text-blue-600 hover:bg-blue-50"
//                   >
//                     <Edit3 className="w-4 h-4" />
//                   </button>
                  
//                   {questions.length > 1 && (
//                     <button
//                       onClick={() => deleteQuestion(question.id)}
//                       className="p-2 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                   )}
//                 </div>
//               </div>

//               {/* Question Content */}
//               <div className="p-6">
//                 {editingQuestion === question.id ? (
//                   // Edit Mode
//                   <div className="space-y-6">
//                     {/* Question Type Selection */}
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-3">
//                         Question Type *
//                       </label>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                         {Object.entries(questionTypeConfigs).map(([typeKey, typeConfig]) => (
//                           <div
//                             key={typeKey}
//                             className={`relative rounded-lg border-2 cursor-pointer transition-all duration-200 ${
//                               question.questionType === typeKey
//                                 ? 'border-purple-500 bg-purple-50'
//                                 : 'border-gray-200 hover:border-gray-300'
//                             }`}
//                             onClick={() => handleQuestionTypeChange(question.id, typeKey)}
//                           >
//                             <div className="p-4">
//                               <div className="flex items-center space-x-3 mb-2">
//                                 <span className="text-xl">{typeConfig.icon}</span>
//                                 <h4 className="font-medium text-gray-900 text-sm">{typeConfig.name}</h4>
//                               </div>
//                               <p className="text-xs text-gray-600 mb-2">{typeConfig.description}</p>
//                               <p className="text-xs font-medium text-purple-700">
//                                 {typeConfig.votingBehavior[votingType]}
//                               </p>
//                             </div>
                            
//                             {question.questionType === typeKey && (
//                               <div className="absolute top-2 right-2">
//                                 <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
//                                   <div className="w-2 h-2 bg-white rounded-full"></div>
//                                 </div>
//                               </div>
//                             )}
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     {/* Question Text */}
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Question Text *
//                       </label>
//                       <input
//                         type="text"
//                         className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500"
//                         placeholder={questionConfig.example.question || "Enter your question..."}
//                         value={question.questionText || ''}
//                         onChange={(e) => updateQuestion(question.id, { questionText: e.target.value })}
//                       />
//                     </div>

//                     {/* Question Image Upload */}
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Question Image (Optional)
//                       </label>
//                       <div className="flex items-center space-x-4">
//                         {question.questionImageUrl ? (
//                           <div className="relative">
//                             <img 
//                               src={question.questionImageUrl} 
//                               alt="Question" 
//                               className="w-24 h-24 object-cover rounded-lg"
//                             />
//                             <button
//                               onClick={() => updateQuestion(question.id, { questionImageUrl: null })}
//                               className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
//                             >
//                               <X className="w-3 h-3" />
//                             </button>
//                           </div>
//                         ) : (
//                           <label className="flex items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-500">
//                             <input
//                               type="file"
//                               accept="image/*"
//                               className="hidden"
//                               onChange={(e) => {
//                                 if (e.target.files[0]) {
//                                   handleImageUpload(e.target.files[0], question.id);
//                                 }
//                               }}
//                             />
//                             <Upload className="w-6 h-6 text-gray-400" />
//                           </label>
//                         )}
//                         <div className="text-sm text-gray-500">
//                           Upload an image to accompany this question
//                         </div>
//                       </div>
//                     </div>

//                     {/* Type-Specific Content */}
//                     {questionConfig.requiresAnswers && (
//                       <div>
//                         <div className="flex items-center justify-between mb-3">
//                           <label className="block text-sm font-medium text-gray-700">
//                             Answer Options * 
//                             <span className="text-gray-500">
//                               (Min: {questionConfig.minAnswers}, Max: {questionConfig.maxAnswers})
//                             </span>
//                           </label>
//                           <button
//                             onClick={() => addAnswer(question.id)}
//                             disabled={question.answers?.length >= questionConfig.maxAnswers}
//                             className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-purple-600 bg-purple-100 hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                           >
//                             <Plus className="w-4 h-4 mr-1" />
//                             Add Option
//                           </button>
//                         </div>

//                         <div className="space-y-3">
//                           {(question.answers || []).map((answer, answerIndex) => (
//                             <div key={answer.id} className="bg-gray-50 rounded-lg p-4">
//                               <div className="flex items-start space-x-3">
//                                 <span className="text-sm text-gray-500 mt-3 w-8">
//                                   {votingType === 'ranked_choice' ? `${answerIndex + 1}.` : '•'}
//                                 </span>
                                
//                                 <div className="flex-1 space-y-3">
//                                   <input
//                                     type="text"
//                                     className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500"
//                                     placeholder={`Option ${answerIndex + 1}`}
//                                     value={answer.text || ''}
//                                     onChange={(e) => updateAnswer(question.id, answer.id, 'text', e.target.value)}
//                                   />
                                  
//                                   {/* Image Upload for Options */}
//                                   {(question.questionType === 'image_based' || question.questionType === 'comparison') && (
//                                     <div className="flex items-center space-x-3">
//                                       {answer.imageUrl ? (
//                                         <div className="relative">
//                                           <img 
//                                             src={answer.imageUrl} 
//                                             alt={answer.text} 
//                                             className="w-16 h-16 object-cover rounded-lg"
//                                           />
//                                           <button
//                                             className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1"
//                                           >
//                                             <X className="w-2 h-2" />
//                                           </button>
//                                         </div>
//                                       ) : (
//                                         <label className="flex items-center justify-center w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-500">
//                                           <input
//                                             type="file"
//                                             accept="image/*"
//                                             className="hidden"
//                                             onChange={(e) => {
//                                               if (e.target.files[0]) {
//                                                 handleImageUpload(e.target.files[0], question.id, answer.id);
//                                               }
//                                             }}
//                                           />
//                                           <ImageIcon className="w-4 h-4 text-gray-400" />
//                                         </label>
//                                       )}
//                                       <span className="text-xs text-gray-500">
//                                         {question.questionType === 'image_based' ? 'Required image' : 'Optional image'}
//                                       </span>
//                                     </div>
//                                   )}
//                                 </div>
                                
//                                 {question.answers.length > questionConfig.minAnswers && (
//                                   <button
//                                     onClick={() => deleteAnswer(question.id, answer.id)}
//                                     className="p-2 text-gray-400 hover:text-red-600 mt-1"
//                                   >
//                                     <Trash2 className="w-4 h-4" />
//                                   </button>
//                                 )}
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}

//                     {/* Open Answer Configuration */}
//                     {question.questionType === 'open_answer' && (
//                       <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
//                         <div className="flex items-start space-x-2 mb-3">
//                           <Type className="w-5 h-5 text-yellow-600 mt-1" />
//                           <div className="flex-1">
//                             <h4 className="font-medium text-yellow-800">Open-Ended Text Question</h4>
//                             <p className="text-sm text-yellow-700 mt-1">
//                               Voters will type their own response. No predefined answers needed.
//                               Voting behavior: {questionHelpers.getVotingBehavior(question.questionType, votingType)}
//                             </p>
//                           </div>
//                         </div>
                        
//                         <div className="mt-3">
//                           <label className="block text-sm font-medium text-yellow-800 mb-2">
//                             Character Limit
//                           </label>
//                           <input
//                             type="number"
//                             min="1"
//                             max="5000"
//                             className="block w-32 rounded-md border-yellow-300 shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
//                             value={question.characterLimit || 5000}
//                             onChange={(e) => updateQuestion(question.id, { characterLimit: parseInt(e.target.value) || 5000 })}
//                           />
//                           <p className="text-xs text-yellow-600 mt-1">Maximum characters: 1-5000</p>
//                         </div>
//                       </div>
//                     )}

//                     {/* Additional Options */}
//                     <div className="space-y-3 border-t border-gray-200 pt-4">
//                       <div className="flex items-center">
//                         <input
//                           type="checkbox"
//                           id={`required-${question.id}`}
//                           checked={question.isRequired}
//                           onChange={(e) => updateQuestion(question.id, { isRequired: e.target.checked })}
//                           className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
//                         />
//                         <label htmlFor={`required-${question.id}`} className="ml-2 text-sm text-gray-700">
//                           This question is required
//                         </label>
//                       </div>

//                       {questionConfig.requiresAnswers && (
//                         <div className="flex items-center">
//                           <input
//                             type="checkbox"
//                             id={`other-${question.id}`}
//                             checked={question.allowOtherOption}
//                             onChange={(e) => updateQuestion(question.id, { allowOtherOption: e.target.checked })}
//                             className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
//                           />
//                           <label htmlFor={`other-${question.id}`} className="ml-2 text-sm text-gray-700">
//                             Allow "Other" option with text input
//                           </label>
//                         </div>
//                       )}
//                     </div>

//                     {/* Voting Behavior Preview */}
//                     <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-md p-4">
//                       <h5 className="font-medium text-gray-800 mb-2">How Voters Will Interact:</h5>
//                       <div className="text-sm text-gray-700">
//                         <strong>{votingType.charAt(0).toUpperCase() + votingType.slice(1).replace('_', ' ')} Voting:</strong>{' '}
//                         {questionHelpers.getVotingBehavior(question.questionType, votingType)}
//                       </div>
//                     </div>

//                     {/* Save/Cancel Buttons */}
//                     <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
//                       <button
//                         onClick={() => setEditingQuestion(null)}
//                         className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         onClick={() => saveQuestion(question.id)}
//                         disabled={savingQuestion || uploadingImage}
//                         className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 flex items-center"
//                       >
//                         {savingQuestion ? (
//                           <>
//                             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                             Saving...
//                           </>
//                         ) : (
//                           <>
//                             <Save className="w-4 h-4 mr-2" />
//                             Save Question
//                           </>
//                         )}
//                       </button>
//                     </div>
//                   </div>
//                 ) : (
//                   // View Mode
//                   <div className="space-y-4">
//                     {question.questionImageUrl && (
//                       <img 
//                         src={question.questionImageUrl} 
//                         alt="Question" 
//                         className="w-32 h-32 object-cover rounded-lg"
//                       />
//                     )}

//                     {/* Question Type Display */}
//                     <div className="bg-gray-50 rounded-md p-3">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center space-x-2">
//                           <span className="text-lg">{questionConfig.icon}</span>
//                           <span className="font-medium text-gray-800">{questionConfig.name}</span>
//                         </div>
//                         <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
//                           {questionHelpers.getVotingBehavior(question.questionType, votingType)}
//                         </span>
//                       </div>
//                     </div>

//                     {/* Answers Display */}
//                     {questionConfig.requiresAnswers && (
//                       <div className="space-y-2">
//                         {(question.answers || []).map((answer, answerIndex) => (
//                           <div key={answer.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
//                             <span className="text-sm font-medium text-gray-500 w-8">
//                               {votingType === 'ranked_choice' ? `${answerIndex + 1}.` : '•'}
//                             </span>
//                             {answer.imageUrl && (
//                               <img 
//                                 src={answer.imageUrl} 
//                                 alt={answer.text} 
//                                 className="w-8 h-8 object-cover rounded"
//                               />
//                             )}
//                             <span className="text-gray-700">
//                               {answer.text || `Option ${answerIndex + 1}`}
//                             </span>
//                           </div>
//                         ))}
//                       </div>
//                     )}

//                     {question.questionType === 'open_answer' && (
//                       <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
//                         <p className="text-sm text-yellow-700">
//                           📝 Text input field - max {question.characterLimit || 5000} characters
//                         </p>
//                       </div>
//                     )}

//                     {/* Question Settings */}
//                     <div className="flex items-center space-x-4 text-xs">
//                       {question.isRequired && (
//                         <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">Required</span>
//                       )}
//                       {question.allowOtherOption && (
//                         <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">Allow Other</span>
//                       )}
//                       <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
//                         {votingType === 'plurality' ? 'Single Selection' : 
//                          votingType === 'ranked_choice' ? 'Ranking Required' : 
//                          'Multiple Selection'}
//                       </span>
//                       {questionConfig.requiresAnswers && (
//                         <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
//                           {question.answers?.length || 0} Options
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Add Question Button */}
//       <div className="flex justify-center">
//         <button
//           onClick={addQuestion}
//           className="inline-flex items-center px-6 py-3 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:text-purple-600 hover:border-purple-300 hover:bg-purple-50 transition-colors"
//         >
//           <Plus className="w-5 h-5 mr-2" />
//           Add Question
//         </button>
//       </div>

//       {/* Summary */}
//       <div className="bg-white border border-gray-200 rounded-lg p-4">
//         <h3 className="font-semibold text-gray-900 mb-3">Question Summary</h3>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//           {Object.entries(questionTypeConfigs).map(([key, config]) => {
//             const count = questions.filter(q => q.questionType === key).length;
//             return (
//               <div key={key} className="text-center">
//                 <div className="text-xl mb-1">{config.icon}</div>
//                 <div className="font-medium">{count}</div>
//                 <div className="text-gray-500 text-xs">{config.name.split(' ')[0]}</div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Validation Errors */}
//       {errors.questions && (
//         <div className="bg-red-50 border border-red-200 rounded-md p-4">
//           <p className="text-red-700">{errors.questions}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default QuestionCreator;








// // import React, { useState } from 'react';
// // import { 
// //   Plus, 
// //   Trash2, 
// //   Edit3, 
// //   Image as ImageIcon, 
// //   Type, 
// //   List, 
// //   Upload,
// //   X,
// //   Save,
// //   HelpCircle,
// //   Scale
// // } from 'lucide-react';
// // //import { questionService, votingTypeConfigs, questionTypeConfigs, questionHelpers } from '../services/election-2/questionAPI';
// // import questionService, { questionHelpers, questionTypeConfigs, votingTypeConfigs } from '../../../services/election-2/questionAPI';

// // const QuestionCreator = ({ 
// //   electionId, 
// //   votingType, 
// //   questions, 
// //   setQuestions, 
// //   updateFormData, 
// //   errors = {} 
// // }) => {
// //   const [editingQuestion, setEditingQuestion] = useState(null);
// //   const [savingQuestion, setSavingQuestion] = useState(false);
// //   const [uploadingImage, setUploadingImage] = useState(false);

// //   const addQuestion = () => {
// //     const newQuestion = {
// //       id: `temp_${Date.now()}`,
// //       questionText: '',
// //       questionType: 'multiple_choice', // Default type
// //       questionImageUrl: null,
// //       answers: [],
// //       isRequired: true,
// //       allowOtherOption: false,
// //       characterLimit: 5000,
// //       isNew: true
// //     };
    
// //     setQuestions(prev => [...prev, newQuestion]);
// //     setEditingQuestion(newQuestion.id);
// //   };

// //   const updateQuestion = (questionId, updates) => {
// //     setQuestions(prev => prev.map(q => 
// //       q.id === questionId ? { ...q, ...updates } : q
// //     ));
// //   };

// //   const deleteQuestion = (questionId) => {
// //     if (questions.length <= 1) {
// //       alert('At least one question is required');
// //       return;
// //     }
    
// //     setQuestions(prev => prev.filter(q => q.id !== questionId));
// //     if (editingQuestion === questionId) {
// //       setEditingQuestion(null);
// //     }
// //   };

// //   const addAnswer = (questionId) => {
// //     const question = questions.find(q => q.id === questionId);
// //     if (!question) return;
// //     /*eslint-disable*/
// //     const config = questionTypeConfigs[question.questionType];
// //     if (question.answers.length >= config.maxAnswers) {
// //       alert(`Maximum ${config.maxAnswers} answers allowed for ${config.name}`);
// //       return;
// //     }

// //     const newAnswer = {
// //       id: `answer_${Date.now()}`,
// //       text: '',
// //       imageUrl: null
// //     };
    
// //     updateQuestion(questionId, {
// //       answers: [...question.answers, newAnswer]
// //     });
// //   };

// //   const updateAnswer = (questionId, answerId, field, value) => {
// //     const question = questions.find(q => q.id === questionId);
// //     if (!question) return;
    
// //     const updatedAnswers = question.answers.map(answer =>
// //       answer.id === answerId ? { ...answer, [field]: value } : answer
// //     );
    
// //     updateQuestion(questionId, { answers: updatedAnswers });
// //   };

// //   const deleteAnswer = (questionId, answerId) => {
// //     const question = questions.find(q => q.id === questionId);
// //     if (!question) return;
    
// //     const config = questionTypeConfigs[question.questionType];
// //     if (question.answers.length <= config.minAnswers) {
// //       alert(`Minimum ${config.minAnswers} answers required for ${config.name}`);
// //       return;
// //     }
    
// //     const updatedAnswers = question.answers.filter(answer => answer.id !== answerId);
// //     updateQuestion(questionId, { answers: updatedAnswers });
// //   };

// //   const handleImageUpload = async (file, questionId, answerId = null) => {
// //     setUploadingImage(true);
// //     try {
// //       const formData = new FormData();
// //       formData.append('image', file);
      
// //       // Call your image upload API here
// //       const response = await fetch('/api/upload/image', {
// //         method: 'POST',
// //         headers: {
// //           'Authorization': `Bearer ${localStorage.getItem('authToken')}`
// //         },
// //         body: formData
// //       });
      
// //       const data = await response.json();
      
// //       if (answerId) {
// //         // Update answer image
// //         updateAnswer(questionId, answerId, 'imageUrl', data.imageUrl);
// //       } else {
// //         // Update question image
// //         updateQuestion(questionId, { questionImageUrl: data.imageUrl });
// //       }
      
// //     } catch (error) {
// //       alert('Failed to upload image: ' + error.message);
// //     } finally {
// //       setUploadingImage(false);
// //     }
// //   };

// //   const saveQuestion = async (questionId) => {
// //     const question = questions.find(q => q.id === questionId);
// //     if (!question) return;

// //     // Validate question
// //     const validation = questionHelpers.validateQuestion(
// //       votingType, 
// //       question.questionType,
// //       question.questionText, 
// //       question.answers
// //     );

// //     if (!validation.isValid) {
// //       alert(Object.values(validation.errors)[0]);
// //       return;
// //     }

// //     setSavingQuestion(true);
// //     try {
// //       const questionData = questionHelpers.createQuestionData(
// //         votingType,
// //         question.questionType,
// //         question.questionText,
// //         question.answers,
// //         {
// //           questionImageUrl: question.questionImageUrl,
// //           questionOrder: questions.findIndex(q => q.id === questionId) + 1,
// //           isRequired: question.isRequired,
// //           allowOtherOption: question.allowOtherOption,
// //           characterLimit: question.characterLimit
// //         }
// //       );

// //       if (question.isNew) {
// //         const response = await questionService.createQuestion(electionId, questionData);
// //         updateQuestion(questionId, {
// //           ...response.data,
// //           isNew: false
// //         });
// //       } else {
// //         await questionService.updateQuestion(question.id, questionData);
// //       }

// //       setEditingQuestion(null);
// //       updateFormData({ questions: questions });
      
// //     } catch (error) {
// //       alert(error.message);
// //     } finally {
// //       setSavingQuestion(false);
// //     }
// //   };

// //   const handleQuestionTypeChange = (questionId, newType) => {
// //     const defaultQuestion = questionHelpers.getDefaultQuestion(newType, votingType);
// //     updateQuestion(questionId, {
// //       questionType: newType,
// //       questionText: defaultQuestion.questionText,
// //       answers: defaultQuestion.answers
// //     });
// //   };

// //   const votingConfig = votingTypeConfigs[votingType];

// //   return (
// //     <div className="space-y-6">
// //       {/* Header */}
// //       <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
// //         <div className="flex items-center space-x-3 mb-4">
// //           <span className="text-3xl">
// //             {votingType === 'plurality' && '🗳️'}
// //             {votingType === 'ranked_choice' && '📊'}
// //             {votingType === 'approval' && '✅'}
// //           </span>
// //           <div>
// //             <h2 className="text-xl font-bold text-gray-900">{votingConfig?.title}</h2>
// //             <p className="text-gray-600">{votingConfig?.description}</p>
// //           </div>
// //         </div>
        
// //         <div className="bg-white rounded-md p-4 border border-blue-200">
// //           <div className="flex items-start space-x-2">
// //             <HelpCircle className="w-5 h-5 text-blue-500 mt-0.5" />
// //             <div className="text-sm text-blue-700">
// //               <strong>Supported Question Types (All Compatible):</strong>
// //               <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
// //                 {Object.entries(questionTypeConfigs).map(([key, config]) => (
// //                   <div key={key} className="bg-blue-50 rounded px-2 py-1">
// //                     <span className="mr-1">{config.icon}</span>
// //                     <span className="text-xs font-medium">{config.name.split(' ')[0]} {config.name.split(' ')[1]}</span>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Questions List */}
// //       <div className="space-y-4">
// //         {questions.map((question, index) => {
// //           const questionConfig = questionTypeConfigs[question.questionType] || questionTypeConfigs.multiple_choice;
          
// //           return (
// //             <div key={question.id} className="bg-white rounded-lg border border-gray-200 shadow-sm">
// //               {/* Question Header */}
// //               <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
// //                 <div className="flex items-center space-x-3">
// //                   <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
// //                     {index + 1}
// //                   </span>
// //                   <div>
// //                     <h3 className="text-lg font-semibold text-gray-900">
// //                       {question.questionText || 'Untitled Question'}
// //                     </h3>
// //                     <div className="flex items-center space-x-2 mt-1">
// //                       <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded flex items-center">
// //                         <span className="mr-1">{questionConfig.icon}</span>
// //                         {questionConfig.name}
// //                       </span>
// //                       <span className="text-xs text-gray-500">
// //                         {questionHelpers.getVotingBehavior(question.questionType, votingType)}
// //                       </span>
// //                     </div>
// //                   </div>
// //                 </div>
                
// //                 <div className="flex items-center space-x-2">
// //                   <button
// //                     onClick={() => setEditingQuestion(
// //                       editingQuestion === question.id ? null : question.id
// //                     )}
// //                     className="p-2 rounded-md text-gray-500 hover:text-blue-600 hover:bg-blue-50"
// //                   >
// //                     <Edit3 className="w-4 h-4" />
// //                   </button>
                  
// //                   {questions.length > 1 && (
// //                     <button
// //                       onClick={() => deleteQuestion(question.id)}
// //                       className="p-2 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50"
// //                     >
// //                       <Trash2 className="w-4 h-4" />
// //                     </button>
// //                   )}
// //                 </div>
// //               </div>

// //               {/* Question Content */}
// //               <div className="p-6">
// //                 {editingQuestion === question.id ? (
// //                   // Edit Mode
// //                   <div className="space-y-6">
// //                     {/* Question Type Selection */}
// //                     <div>
// //                       <label className="block text-sm font-medium text-gray-700 mb-3">
// //                         Question Type *
// //                       </label>
// //                       <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
// //                         {Object.entries(questionTypeConfigs).map(([typeKey, typeConfig]) => (
// //                           <div
// //                             key={typeKey}
// //                             className={`relative rounded-lg border-2 cursor-pointer transition-all duration-200 ${
// //                               question.questionType === typeKey
// //                                 ? 'border-purple-500 bg-purple-50'
// //                                 : 'border-gray-200 hover:border-gray-300'
// //                             }`}
// //                             onClick={() => handleQuestionTypeChange(question.id, typeKey)}
// //                           >
// //                             <div className="p-4">
// //                               <div className="flex items-center space-x-3 mb-2">
// //                                 <span className="text-xl">{typeConfig.icon}</span>
// //                                 <h4 className="font-medium text-gray-900 text-sm">{typeConfig.name}</h4>
// //                               </div>
// //                               <p className="text-xs text-gray-600 mb-2">{typeConfig.description}</p>
// //                               <p className="text-xs font-medium text-purple-700">
// //                                 {typeConfig.votingBehavior[votingType]}
// //                               </p>
// //                             </div>
                            
// //                             {question.questionType === typeKey && (
// //                               <div className="absolute top-2 right-2">
// //                                 <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
// //                                   <div className="w-2 h-2 bg-white rounded-full"></div>
// //                                 </div>
// //                               </div>
// //                             )}
// //                           </div>
// //                         ))}
// //                       </div>
// //                     </div>

// //                     {/* Question Text */}
// //                     <div>
// //                       <label className="block text-sm font-medium text-gray-700 mb-2">
// //                         Question Text *
// //                       </label>
// //                       <input
// //                         type="text"
// //                         className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500"
// //                         placeholder={questionConfig.example.question || "Enter your question..."}
// //                         value={question.questionText || ''}
// //                         onChange={(e) => updateQuestion(question.id, { questionText: e.target.value })}
// //                       />
// //                     </div>

// //                     {/* Question Image Upload */}
// //                     <div>
// //                       <label className="block text-sm font-medium text-gray-700 mb-2">
// //                         Question Image (Optional)
// //                       </label>
// //                       <div className="flex items-center space-x-4">
// //                         {question.questionImageUrl ? (
// //                           <div className="relative">
// //                             <img 
// //                               src={question.questionImageUrl} 
// //                               alt="Question" 
// //                               className="w-24 h-24 object-cover rounded-lg"
// //                             />
// //                             <button
// //                               onClick={() => updateQuestion(question.id, { questionImageUrl: null })}
// //                               className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
// //                             >
// //                               <X className="w-3 h-3" />
// //                             </button>
// //                           </div>
// //                         ) : (
// //                           <label className="flex items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-500">
// //                             <input
// //                               type="file"
// //                               accept="image/*"
// //                               className="hidden"
// //                               onChange={(e) => {
// //                                 if (e.target.files[0]) {
// //                                   handleImageUpload(e.target.files[0], question.id);
// //                                 }
// //                               }}
// //                             />
// //                             <Upload className="w-6 h-6 text-gray-400" />
// //                           </label>
// //                         )}
// //                         <div className="text-sm text-gray-500">
// //                           Upload an image to accompany this question
// //                         </div>
// //                       </div>
// //                     </div>

// //                     {/* Type-Specific Content */}
// //                     {questionConfig.requiresAnswers && (
// //                       <div>
// //                         <div className="flex items-center justify-between mb-3">
// //                           <label className="block text-sm font-medium text-gray-700">
// //                             Answer Options * 
// //                             <span className="text-gray-500">
// //                               (Min: {questionConfig.minAnswers}, Max: {questionConfig.maxAnswers})
// //                             </span>
// //                           </label>
// //                           <button
// //                             onClick={() => addAnswer(question.id)}
// //                             disabled={question.answers?.length >= questionConfig.maxAnswers}
// //                             className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-purple-600 bg-purple-100 hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
// //                           >
// //                             <Plus className="w-4 h-4 mr-1" />
// //                             Add Option
// //                           </button>
// //                         </div>

// //                         <div className="space-y-3">
// //                           {(question.answers || []).map((answer, answerIndex) => (
// //                             <div key={answer.id} className="bg-gray-50 rounded-lg p-4">
// //                               <div className="flex items-start space-x-3">
// //                                 <span className="text-sm text-gray-500 mt-3 w-8">
// //                                   {votingType === 'ranked_choice' ? `${answerIndex + 1}.` : '•'}
// //                                 </span>
                                
// //                                 <div className="flex-1 space-y-3">
// //                                   <input
// //                                     type="text"
// //                                     className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500"
// //                                     placeholder={`Option ${answerIndex + 1}`}
// //                                     value={answer.text || ''}
// //                                     onChange={(e) => updateAnswer(question.id, answer.id, 'text', e.target.value)}
// //                                   />
                                  
// //                                   {/* Image Upload for Options */}
// //                                   {(question.questionType === 'image_based' || question.questionType === 'comparison') && (
// //                                     <div className="flex items-center space-x-3">
// //                                       {answer.imageUrl ? (
// //                                         <div className="relative">
// //                                           <img 
// //                                             src={answer.imageUrl} 
// //                                             alt={answer.text} 
// //                                             className="w-16 h-16 object-cover rounded-lg"
// //                                           />
// //                                           <button
// //                                             className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1"
// //                                           >
// //                                             <X className="w-2 h-2" />
// //                                           </button>
// //                                         </div>
// //                                       ) : (
// //                                         <label className="flex items-center justify-center w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-500">
// //                                           <input
// //                                             type="file"
// //                                             accept="image/*"
// //                                             className="hidden"
// //                                             onChange={(e) => {
// //                                               if (e.target.files[0]) {
// //                                                 handleImageUpload(e.target.files[0], question.id, answer.id);
// //                                               }
// //                                             }}
// //                                           />
// //                                           <ImageIcon className="w-4 h-4 text-gray-400" />
// //                                         </label>
// //                                       )}
// //                                       <span className="text-xs text-gray-500">
// //                                         {question.questionType === 'image_based' ? 'Required image' : 'Optional image'}
// //                                       </span>
// //                                     </div>
// //                                   )}
// //                                 </div>
                                
// //                                 {question.answers.length > questionConfig.minAnswers && (
// //                                   <button
// //                                     onClick={() => deleteAnswer(question.id, answer.id)}
// //                                     className="p-2 text-gray-400 hover:text-red-600 mt-1"
// //                                   >
// //                                     <Trash2 className="w-4 h-4" />
// //                                   </button>
// //                                 )}
// //                               </div>
// //                             </div>
// //                           ))}
// //                         </div>
// //                       </div>
// //                     )}

// //                     {/* Open Answer Configuration */}
// //                     {question.questionType === 'open_answer' && (
// //                       <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
// //                         <div className="flex items-start space-x-2 mb-3">
// //                           <Type className="w-5 h-5 text-yellow-600 mt-1" />
// //                           <div className="flex-1">
// //                             <h4 className="font-medium text-yellow-800">Open-Ended Text Question</h4>
// //                             <p className="text-sm text-yellow-700 mt-1">
// //                               Voters will type their own response. No predefined answers needed.
// //                               Voting behavior: {questionHelpers.getVotingBehavior(question.questionType, votingType)}
// //                             </p>
// //                           </div>
// //                         </div>
                        
// //                         <div className="mt-3">
// //                           <label className="block text-sm font-medium text-yellow-800 mb-2">
// //                             Character Limit
// //                           </label>
// //                           <input
// //                             type="number"
// //                             min="1"
// //                             max="5000"
// //                             className="block w-32 rounded-md border-yellow-300 shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
// //                             value={question.characterLimit || 5000}
// //                             onChange={(e) => updateQuestion(question.id, { characterLimit: parseInt(e.target.value) || 5000 })}
// //                           />
// //                           <p className="text-xs text-yellow-600 mt-1">Maximum characters: 1-5000</p>
// //                         </div>
// //                       </div>
// //                     )}

// //                     {/* Additional Options */}
// //                     <div className="space-y-3 border-t border-gray-200 pt-4">
// //                       <div className="flex items-center">
// //                         <input
// //                           type="checkbox"
// //                           id={`required-${question.id}`}
// //                           checked={question.isRequired}
// //                           onChange={(e) => updateQuestion(question.id, { isRequired: e.target.checked })}
// //                           className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
// //                         />
// //                         <label htmlFor={`required-${question.id}`} className="ml-2 text-sm text-gray-700">
// //                           This question is required
// //                         </label>
// //                       </div>

// //                       {questionConfig.requiresAnswers && (
// //                         <div className="flex items-center">
// //                           <input
// //                             type="checkbox"
// //                             id={`other-${question.id}`}
// //                             checked={question.allowOtherOption}
// //                             onChange={(e) => updateQuestion(question.id, { allowOtherOption: e.target.checked })}
// //                             className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
// //                           />
// //                           <label htmlFor={`other-${question.id}`} className="ml-2 text-sm text-gray-700">
// //                             Allow "Other" option with text input
// //                           </label>
// //                         </div>
// //                       )}
// //                     </div>

// //                     {/* Voting Behavior Preview */}
// //                     <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-md p-4">
// //                       <h5 className="font-medium text-gray-800 mb-2">How Voters Will Interact:</h5>
// //                       <div className="text-sm text-gray-700">
// //                         <strong>{votingType.charAt(0).toUpperCase() + votingType.slice(1).replace('_', ' ')} Voting:</strong>{' '}
// //                         {questionHelpers.getVotingBehavior(question.questionType, votingType)}
// //                       </div>
// //                     </div>

// //                     {/* Save/Cancel Buttons */}
// //                     <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
// //                       <button
// //                         onClick={() => setEditingQuestion(null)}
// //                         className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
// //                       >
// //                         Cancel
// //                       </button>
// //                       <button
// //                         onClick={() => saveQuestion(question.id)}
// //                         disabled={savingQuestion || uploadingImage}
// //                         className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 flex items-center"
// //                       >
// //                         {savingQuestion ? (
// //                           <>
// //                             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
// //                             Saving...
// //                           </>
// //                         ) : (
// //                           <>
// //                             <Save className="w-4 h-4 mr-2" />
// //                             Save Question
// //                           </>
// //                         )}
// //                       </button>
// //                     </div>
// //                   </div>
// //                 ) : (
// //                   // View Mode
// //                   <div className="space-y-4">
// //                     {question.questionImageUrl && (
// //                       <img 
// //                         src={question.questionImageUrl} 
// //                         alt="Question" 
// //                         className="w-32 h-32 object-cover rounded-lg"
// //                       />
// //                     )}

// //                     {/* Question Type Display */}
// //                     <div className="bg-gray-50 rounded-md p-3">
// //                       <div className="flex items-center justify-between">
// //                         <div className="flex items-center space-x-2">
// //                           <span className="text-lg">{questionConfig.icon}</span>
// //                           <span className="font-medium text-gray-800">{questionConfig.name}</span>
// //                         </div>
// //                         <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
// //                           {questionHelpers.getVotingBehavior(question.questionType, votingType)}
// //                         </span>
// //                       </div>
// //                     </div>

// //                     {/* Answers Display */}
// //                     {questionConfig.requiresAnswers && (
// //                       <div className="space-y-2">
// //                         {(question.answers || []).map((answer, answerIndex) => (
// //                           <div key={answer.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
// //                             <span className="text-sm font-medium text-gray-500 w-8">
// //                               {votingType === 'ranked_choice' ? `${answerIndex + 1}.` : '•'}
// //                             </span>
// //                             {answer.imageUrl && (
// //                               <img 
// //                                 src={answer.imageUrl} 
// //                                 alt={answer.text} 
// //                                 className="w-8 h-8 object-cover rounded"
// //                               />
// //                             )}
// //                             <span className="text-gray-700">
// //                               {answer.text || `Option ${answerIndex + 1}`}
// //                             </span>
// //                           </div>
// //                         ))}
// //                       </div>
// //                     )}

// //                     {question.questionType === 'open_answer' && (
// //                       <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
// //                         <p className="text-sm text-yellow-700">
// //                           📝 Text input field - max {question.characterLimit || 5000} characters
// //                         </p>
// //                       </div>
// //                     )}

// //                     {/* Question Settings */}
// //                     <div className="flex items-center space-x-4 text-xs">
// //                       {question.isRequired && (
// //                         <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">Required</span>
// //                       )}
// //                       {question.allowOtherOption && (
// //                         <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">Allow Other</span>
// //                       )}
// //                       <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
// //                         {votingType === 'plurality' ? 'Single Selection' : 
// //                          votingType === 'ranked_choice' ? 'Ranking Required' : 
// //                          'Multiple Selection'}
// //                       </span>
// //                       {questionConfig.requiresAnswers && (
// //                         <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
// //                           {question.answers?.length || 0} Options
// //                         </span>
// //                       )}
// //                     </div>
// //                   </div>
// //                 )}
// //               </div>
// //             </div>
// //           );
// //         })}
// //       </div>

// //       {/* Add Question Button */}
// //       <div className="flex justify-center">
// //         <button
// //           onClick={addQuestion}
// //           className="inline-flex items-center px-6 py-3 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:text-purple-600 hover:border-purple-300 hover:bg-purple-50 transition-colors"
// //         >
// //           <Plus className="w-5 h-5 mr-2" />
// //           Add Question
// //         </button>
// //       </div>

// //       {/* Summary */}
// //       <div className="bg-white border border-gray-200 rounded-lg p-4">
// //         <h3 className="font-semibold text-gray-900 mb-3">Question Summary</h3>
// //         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
// //           {Object.entries(questionTypeConfigs).map(([key, config]) => {
// //             const count = questions.filter(q => q.questionType === key).length;
// //             return (
// //               <div key={key} className="text-center">
// //                 <div className="text-xl mb-1">{config.icon}</div>
// //                 <div className="font-medium">{count}</div>
// //                 <div className="text-gray-500 text-xs">{config.name.split(' ')[0]}</div>
// //               </div>
// //             );
// //           })}
// //         </div>
// //       </div>

// //       {/* Validation Errors */}
// //       {errors.questions && (
// //         <div className="bg-red-50 border border-red-200 rounded-md p-4">
// //           <p className="text-red-700">{errors.questions}</p>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default QuestionCreator;








// // import React, { useState } from 'react';
// // import { 
// //   Plus, 
// //   Trash2, 
// //   Edit3, 
// //   Image as ImageIcon, 
// //   Type, 
// //   List, 
// //   Upload,
// //   X,
// //   Save,
// //   HelpCircle
// // } from 'lucide-react';
// // import questionService, { questionHelpers, votingTypeConfigs } from '../../../services/election-2/questionAPI';
// // //import { questionService, votingTypeConfigs, questionHelpers } from '../services/election-2/questionAPI';

// // const QuestionCreator = ({ 
// //   electionId, 
// //   votingType, 
// //   questions, 
// //   setQuestions, 
// //   updateFormData, 
// //   errors = {} 
// // }) => {
// //   const [editingQuestion, setEditingQuestion] = useState(null);
// //   const [savingQuestion, setSavingQuestion] = useState(false);
// //   const [uploadingImage, setUploadingImage] = useState(false);

// //   // Question format options
// //   const questionFormats = [
// //     {
// //       id: 'multiple_choice',
// //       name: 'Multiple Choice',
// //       description: 'Standard candidate/option selection',
// //       icon: <List className="w-5 h-5" />,
// //       example: 'Select one candidate from the list'
// //     },
// //     {
// //       id: 'open_answer',
// //       name: 'Open Answer',
// //       description: 'Free text single line input',
// //       icon: <Type className="w-5 h-5" />,
// //       example: 'Write-in candidate or feedback'
// //     },
// //     {
// //       id: 'image_based',
// //       name: 'Image-Based',
// //       description: 'Visual options with images',
// //       icon: <ImageIcon className="w-5 h-5" />,
// //       example: 'Candidate photos or visual choices'
// //     }
// //   ];

// //   const addQuestion = () => {
// //     const defaultQuestion = questionHelpers.getDefaultQuestion(votingType);
    
// //     const newQuestion = {
// //       id: `temp_${Date.now()}`,
// //       questionText: '',
// //       questionFormat: 'multiple_choice', // Default format
// //       questionImageUrl: null,
// //       candidates: defaultQuestion.candidates,
// //       isRequired: true,
// //       allowOtherOption: false,
// //       isNew: true
// //     };
    
// //     setQuestions(prev => [...prev, newQuestion]);
// //     setEditingQuestion(newQuestion.id);
// //   };

// //   const updateQuestion = (questionId, updates) => {
// //     setQuestions(prev => prev.map(q => 
// //       q.id === questionId ? { ...q, ...updates } : q
// //     ));
// //   };

// //   const deleteQuestion = (questionId) => {
// //     if (questions.length <= 1) {
// //       alert('At least one question is required');
// //       return;
// //     }
    
// //     setQuestions(prev => prev.filter(q => q.id !== questionId));
// //     if (editingQuestion === questionId) {
// //       setEditingQuestion(null);
// //     }
// //   };

// //   const addCandidate = (questionId) => {
// //     const question = questions.find(q => q.id === questionId);
// //     if (!question) return;
    
// //     const config = votingTypeConfigs[votingType];
// //     if (question.candidates.length >= config.maxCandidates) {
// //       alert(`Maximum ${config.maxCandidates} ${config.terminology} allowed for ${votingType.replace('_', ' ')} voting`);
// //       return;
// //     }

// //     const newCandidate = {
// //       id: `candidate_${Date.now()}`,
// //       name: '',
// //       imageUrl: null
// //     };
    
// //     updateQuestion(questionId, {
// //       candidates: [...question.candidates, newCandidate]
// //     });
// //   };

// //   const updateCandidate = (questionId, candidateId, field, value) => {
// //     const question = questions.find(q => q.id === questionId);
// //     if (!question) return;
    
// //     const updatedCandidates = question.candidates.map(candidate =>
// //       candidate.id === candidateId ? { ...candidate, [field]: value } : candidate
// //     );
    
// //     updateQuestion(questionId, { candidates: updatedCandidates });
// //   };

// //   const deleteCandidate = (questionId, candidateId) => {
// //     const question = questions.find(q => q.id === questionId);
// //     if (!question) return;
    
// //     const config = votingTypeConfigs[votingType];
// //     if (question.candidates.length <= config.minCandidates) {
// //       alert(`Minimum ${config.minCandidates} ${config.terminology} required for ${votingType.replace('_', ' ')} voting`);
// //       return;
// //     }
    
// //     const updatedCandidates = question.candidates.filter(candidate => candidate.id !== candidateId);
// //     updateQuestion(questionId, { candidates: updatedCandidates });
// //   };

// //   const handleImageUpload = async (file, questionId, candidateId = null) => {
// //     setUploadingImage(true);
// //     try {
// //       const formData = new FormData();
// //       formData.append('image', file);
      
// //       // Call your image upload API here
// //       const response = await fetch('/api/upload/image', {
// //         method: 'POST',
// //         headers: {
// //           'Authorization': `Bearer ${localStorage.getItem('authToken')}`
// //         },
// //         body: formData
// //       });
      
// //       const data = await response.json();
      
// //       if (candidateId) {
// //         // Update candidate image
// //         updateCandidate(questionId, candidateId, 'imageUrl', data.imageUrl);
// //       } else {
// //         // Update question image
// //         updateQuestion(questionId, { questionImageUrl: data.imageUrl });
// //       }
      
// //     } catch (error) {
// //       alert('Failed to upload image: ' + error.message);
// //     } finally {
// //       setUploadingImage(false);
// //     }
// //   };

// //   const saveQuestion = async (questionId) => {
// //     const question = questions.find(q => q.id === questionId);
// //     if (!question) return;

// //     // Validate based on question format
// //     let validationErrors = {};

// //     if (!question.questionText?.trim()) {
// //       validationErrors.questionText = 'Question text is required';
// //     }

// //     if (question.questionFormat === 'multiple_choice') {
// //       const validation = questionHelpers.validateQuestion(
// //         votingType, 
// //         question.questionText, 
// //         question.candidates
// //       );
// //       validationErrors = { ...validationErrors, ...validation.errors };
// //     }

// //     if (Object.keys(validationErrors).length > 0) {
// //       alert(Object.values(validationErrors)[0]);
// //       return;
// //     }

// //     setSavingQuestion(true);
// //     try {
// //       if (question.isNew) {
// //         // Create new question
// //         const questionData = {
// //           questionText: question.questionText,
// //           questionFormat: question.questionFormat,
// //           questionImageUrl: question.questionImageUrl,
// //           questionOrder: questions.findIndex(q => q.id === questionId) + 1,
// //           isRequired: question.isRequired,
// //           maxSelections: votingType === 'plurality' ? 1 : 
// //                         votingType === 'ranked_choice' ? question.candidates?.length || 0 :
// //                         null,
// //           allowOtherOption: question.allowOtherOption,
// //           otherOptionText: question.otherOptionText || 'Other',
// //           translations: null,
// //           answerChoices: question.questionFormat === 'multiple_choice' 
// //             ? question.candidates.map((candidate, index) => ({
// //                 choiceText: candidate.name,
// //                 choiceImageUrl: candidate.imageUrl,
// //                 choiceOrder: index + 1,
// //                 isCorrect: false,
// //                 translations: null
// //               }))
// //             : []
// //         };

// //         const response = await questionService.createQuestion(electionId, questionData);
        
// //         // Update the question with server response
// //         updateQuestion(questionId, {
// //           ...response.data,
// //           isNew: false
// //         });
// //       } else {
// //         // Update existing question - similar structure
// //         const questionData = {
// //           questionText: question.questionText,
// //           questionFormat: question.questionFormat,
// //           questionImageUrl: question.questionImageUrl,
// //           isRequired: question.isRequired,
// //           maxSelections: votingType === 'plurality' ? 1 : 
// //                         votingType === 'ranked_choice' ? question.candidates?.length || 0 :
// //                         null,
// //           allowOtherOption: question.allowOtherOption,
// //           otherOptionText: question.otherOptionText || 'Other',
// //           answerChoices: question.questionFormat === 'multiple_choice' 
// //             ? question.candidates.map((candidate, index) => ({
// //                 choiceText: candidate.name,
// //                 choiceImageUrl: candidate.imageUrl,
// //                 choiceOrder: index + 1,
// //                 isCorrect: false,
// //                 translations: null
// //               }))
// //             : []
// //         };

// //         await questionService.updateQuestion(question.id, questionData);
// //       }

// //       setEditingQuestion(null);
// //       updateFormData({ questions: questions });
      
// //     } catch (error) {
// //       alert(error.message);
// //     } finally {
// //       setSavingQuestion(false);
// //     }
// //   };

// //   const config = votingTypeConfigs[votingType];

// //   return (
// //     <div className="space-y-6">
// //       {/* Header */}
// //       <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
// //         <div className="flex items-center space-x-3 mb-3">
// //           <span className="text-3xl">
// //             {votingType === 'plurality' && '🗳️'}
// //             {votingType === 'ranked_choice' && '📊'}
// //             {votingType === 'approval' && '✅'}
// //           </span>
// //           <div>
// //             <h2 className="text-xl font-bold text-gray-900">{config?.title}</h2>
// //             <p className="text-gray-600">{config?.description}</p>
// //           </div>
// //         </div>
        
// //         <div className="bg-white rounded-md p-4 border border-blue-200">
// //           <div className="flex items-start space-x-2">
// //             <HelpCircle className="w-5 h-5 text-blue-500 mt-0.5" />
// //             <div className="text-sm text-blue-700">
// //               <strong>Requirements:</strong>
// //               <ul className="mt-1 space-y-1">
// //                 <li>• Minimum {config?.minCandidates} {config?.terminology} per multiple choice question</li>
// //                 <li>• Maximum {config?.maxCandidates} {config?.terminology} per multiple choice question</li>
// //                 <li>• Support for multiple question formats: multiple choice, open answer, image-based</li>
// //                 <li>• {config?.instruction}</li>
// //               </ul>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Questions List */}
// //       <div className="space-y-4">
// //         {questions.map((question, index) => (
// //           <div key={question.id} className="bg-white rounded-lg border border-gray-200 shadow-sm">
// //             {/* Question Header */}
// //             <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
// //               <div className="flex items-center space-x-3">
// //                 <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
// //                   {index + 1}
// //                 </span>
// //                 <div>
// //                   <h3 className="text-lg font-semibold text-gray-900">
// //                     {question.questionText || 'Untitled Question'}
// //                   </h3>
// //                   <div className="flex items-center space-x-2 mt-1">
// //                     <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
// //                       {questionFormats.find(f => f.id === question.questionFormat)?.name || 'Multiple Choice'}
// //                     </span>
// //                     {question.questionFormat === 'multiple_choice' && (
// //                       <span className="text-xs text-gray-500">
// //                         {question.candidates?.length || 0} {config?.terminology}
// //                       </span>
// //                     )}
// //                   </div>
// //                 </div>
// //               </div>
              
// //               <div className="flex items-center space-x-2">
// //                 <button
// //                   onClick={() => setEditingQuestion(
// //                     editingQuestion === question.id ? null : question.id
// //                   )}
// //                   className="p-2 rounded-md text-gray-500 hover:text-blue-600 hover:bg-blue-50"
// //                 >
// //                   <Edit3 className="w-4 h-4" />
// //                 </button>
                
// //                 {questions.length > 1 && (
// //                   <button
// //                     onClick={() => deleteQuestion(question.id)}
// //                     className="p-2 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50"
// //                   >
// //                     <Trash2 className="w-4 h-4" />
// //                   </button>
// //                 )}
// //               </div>
// //             </div>

// //             {/* Question Content */}
// //             <div className="p-6">
// //               {editingQuestion === question.id ? (
// //                 // Edit Mode
// //                 <div className="space-y-6">
// //                   {/* Question Text */}
// //                   <div>
// //                     <label className="block text-sm font-medium text-gray-700 mb-2">
// //                       Question Text *
// //                     </label>
// //                     <input
// //                       type="text"
// //                       className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
// //                       placeholder="Enter your question..."
// //                       value={question.questionText || ''}
// //                       onChange={(e) => updateQuestion(question.id, { questionText: e.target.value })}
// //                     />
// //                   </div>

// //                   {/* Question Format Selection */}
// //                   <div>
// //                     <label className="block text-sm font-medium text-gray-700 mb-3">
// //                       Question Format *
// //                     </label>
// //                     <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
// //                       {questionFormats.map((format) => (
// //                         <div
// //                           key={format.id}
// //                           className={`relative rounded-lg border-2 cursor-pointer transition-all duration-200 ${
// //                             question.questionFormat === format.id
// //                               ? 'border-blue-500 bg-blue-50'
// //                               : 'border-gray-200 hover:border-gray-300'
// //                           }`}
// //                           onClick={() => updateQuestion(question.id, { questionFormat: format.id })}
// //                         >
// //                           <div className="p-4">
// //                             <div className="flex items-center space-x-3 mb-2">
// //                               {format.icon}
// //                               <h4 className="font-medium text-gray-900">{format.name}</h4>
// //                             </div>
// //                             <p className="text-sm text-gray-600 mb-2">{format.description}</p>
// //                             <p className="text-xs text-gray-500">{format.example}</p>
// //                           </div>
                          
// //                           {question.questionFormat === format.id && (
// //                             <div className="absolute top-2 right-2">
// //                               <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
// //                                 <div className="w-2 h-2 bg-white rounded-full"></div>
// //                               </div>
// //                             </div>
// //                           )}
// //                         </div>
// //                       ))}
// //                     </div>
// //                   </div>

// //                   {/* Question Image Upload */}
// //                   <div>
// //                     <label className="block text-sm font-medium text-gray-700 mb-2">
// //                       Question Image (Optional)
// //                     </label>
// //                     <div className="flex items-center space-x-4">
// //                       {question.questionImageUrl ? (
// //                         <div className="relative">
// //                           <img 
// //                             src={question.questionImageUrl} 
// //                             alt="Question" 
// //                             className="w-24 h-24 object-cover rounded-lg"
// //                           />
// //                           <button
// //                             onClick={() => updateQuestion(question.id, { questionImageUrl: null })}
// //                             className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
// //                           >
// //                             <X className="w-3 h-3" />
// //                           </button>
// //                         </div>
// //                       ) : (
// //                         <label className="flex items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
// //                           <input
// //                             type="file"
// //                             accept="image/*"
// //                             className="hidden"
// //                             onChange={(e) => {
// //                               if (e.target.files[0]) {
// //                                 handleImageUpload(e.target.files[0], question.id);
// //                               }
// //                             }}
// //                           />
// //                           <Upload className="w-6 h-6 text-gray-400" />
// //                         </label>
// //                       )}
// //                       <div className="text-sm text-gray-500">
// //                         Upload an image to accompany this question
// //                       </div>
// //                     </div>
// //                   </div>

// //                   {/* Format-Specific Content */}
// //                   {question.questionFormat === 'multiple_choice' && (
// //                     <div>
// //                       <div className="flex items-center justify-between mb-3">
// //                         <label className="block text-sm font-medium text-gray-700">
// //                           {config?.terminology === 'candidates' ? 'Candidates' : 'Options'} * 
// //                           <span className="text-gray-500">
// //                             (Min: {config?.minCandidates}, Max: {config?.maxCandidates})
// //                           </span>
// //                         </label>
// //                         <button
// //                           onClick={() => addCandidate(question.id)}
// //                           disabled={question.candidates?.length >= config?.maxCandidates}
// //                           className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
// //                         >
// //                           <Plus className="w-4 h-4 mr-1" />
// //                           Add {config?.terminology === 'candidates' ? 'Candidate' : 'Option'}
// //                         </button>
// //                       </div>

// //                       <div className="space-y-3">
// //                         {(question.candidates || []).map((candidate, candidateIndex) => (
// //                           <div key={candidate.id} className="bg-gray-50 rounded-lg p-4">
// //                             <div className="flex items-start space-x-3">
// //                               <span className="text-sm text-gray-500 mt-3 w-8">
// //                                 {votingType === 'ranked_choice' ? `${candidateIndex + 1}.` : '•'}
// //                               </span>
                              
// //                               <div className="flex-1 space-y-3">
// //                                 <input
// //                                   type="text"
// //                                   className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
// //                                   placeholder={`${config?.terminology === 'candidates' ? 'Candidate' : 'Option'} ${candidateIndex + 1} name`}
// //                                   value={candidate.name || ''}
// //                                   onChange={(e) => updateCandidate(question.id, candidate.id, 'name', e.target.value)}
// //                                 />
                                
// //                                 {/* Candidate Image Upload */}
// //                                 <div className="flex items-center space-x-3">
// //                                   {candidate.imageUrl ? (
// //                                     <div className="relative">
// //                                       <img 
// //                                         src={candidate.imageUrl} 
// //                                         alt={candidate.name} 
// //                                         className="w-16 h-16 object-cover rounded-lg"
// //                                       />
// //                                       <button
// //                                         onClick={() => updateCandidate(question.id, candidate.id, 'imageUrl', null)}
// //                                         className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1"
// //                                       >
// //                                         <X className="w-2 h-2" />
// //                                       </button>
// //                                     </div>
// //                                   ) : (
// //                                     <label className="flex items-center justify-center w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
// //                                       <input
// //                                         type="file"
// //                                         accept="image/*"
// //                                         className="hidden"
// //                                         onChange={(e) => {
// //                                           if (e.target.files[0]) {
// //                                             handleImageUpload(e.target.files[0], question.id, candidate.id);
// //                                           }
// //                                         }}
// //                                       />
// //                                       <ImageIcon className="w-4 h-4 text-gray-400" />
// //                                     </label>
// //                                   )}
// //                                   <span className="text-xs text-gray-500">
// //                                     {config?.terminology === 'candidates' ? 'Candidate' : 'Option'} photo (optional)
// //                                   </span>
// //                                 </div>
// //                               </div>
                              
// //                               {question.candidates.length > config?.minCandidates && (
// //                                 <button
// //                                   onClick={() => deleteCandidate(question.id, candidate.id)}
// //                                   className="p-2 text-gray-400 hover:text-red-600 mt-1"
// //                                 >
// //                                   <Trash2 className="w-4 h-4" />
// //                                 </button>
// //                               )}
// //                             </div>
// //                           </div>
// //                         ))}
// //                       </div>
// //                     </div>
// //                   )}

// //                   {question.questionFormat === 'open_answer' && (
// //                     <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
// //                       <div className="flex items-center space-x-2">
// //                         <Type className="w-5 h-5 text-yellow-600" />
// //                         <div>
// //                           <h4 className="font-medium text-yellow-800">Open Answer Question</h4>
// //                           <p className="text-sm text-yellow-700">
// //                             Voters will see a text input field to write their response. 
// //                             Useful for write-in candidates or feedback collection.
// //                           </p>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   )}

// //                   {question.questionFormat === 'image_based' && (
// //                     <div className="bg-purple-50 border border-purple-200 rounded-md p-4">
// //                       <div className="flex items-center space-x-2">
// //                         <ImageIcon className="w-5 h-5 text-purple-600" />
// //                         <div>
// //                           <h4 className="font-medium text-purple-800">Image-Based Question</h4>
// //                           <p className="text-sm text-purple-700">
// //                             Question and answers will be displayed as images. 
// //                             Make sure to upload a question image and candidate images above.
// //                           </p>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   )}

// //                   {/* Additional Options */}
// //                   <div className="space-y-3">
// //                     <div className="flex items-center">
// //                       <input
// //                         type="checkbox"
// //                         id={`required-${question.id}`}
// //                         checked={question.isRequired}
// //                         onChange={(e) => updateQuestion(question.id, { isRequired: e.target.checked })}
// //                         className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
// //                       />
// //                       <label htmlFor={`required-${question.id}`} className="ml-2 text-sm text-gray-700">
// //                         This question is required
// //                       </label>
// //                     </div>

// //                     {question.questionFormat === 'multiple_choice' && (
// //                       <div className="flex items-center">
// //                         <input
// //                           type="checkbox"
// //                           id={`other-${question.id}`}
// //                           checked={question.allowOtherOption}
// //                           onChange={(e) => updateQuestion(question.id, { allowOtherOption: e.target.checked })}
// //                           className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
// //                         />
// //                         <label htmlFor={`other-${question.id}`} className="ml-2 text-sm text-gray-700">
// //                           Allow "Other" option
// //                         </label>
// //                       </div>
// //                     )}
// //                   </div>

// //                   {/* Voting Type Indicator */}
// //                   <div className="bg-gray-50 rounded-md p-3">
// //                     <p className="text-sm text-gray-600">
// //                       {votingType === 'plurality' && '🗳️ Voters will select one option from this question'}
// //                       {votingType === 'ranked_choice' && '📊 Voters will rank options in order of preference'}
// //                       {votingType === 'approval' && '✅ Voters can approve multiple options they support'}
// //                     </p>
// //                   </div>

// //                   {/* Save/Cancel Buttons */}
// //                   <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
// //                     <button
// //                       onClick={() => setEditingQuestion(null)}
// //                       className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
// //                     >
// //                       Cancel
// //                     </button>
// //                     <button
// //                       onClick={() => saveQuestion(question.id)}
// //                       disabled={savingQuestion || uploadingImage}
// //                       className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
// //                     >
// //                       {savingQuestion ? (
// //                         <>
// //                           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
// //                           Saving...
// //                         </>
// //                       ) : (
// //                         <>
// //                           <Save className="w-4 h-4 mr-2" />
// //                           Save Question
// //                         </>
// //                       )}
// //                     </button>
// //                   </div>
// //                 </div>
// //               ) : (
// //                 // View Mode
// //                 <div className="space-y-4">
// //                   {question.questionImageUrl && (
// //                     <img 
// //                       src={question.questionImageUrl} 
// //                       alt="Question" 
// //                       className="w-32 h-32 object-cover rounded-lg"
// //                     />
// //                   )}

// //                   {question.questionFormat === 'multiple_choice' && (
// //                     <div className="space-y-2">
// //                       {(question.candidates || []).map((candidate, candidateIndex) => (
// //                         <div key={candidate.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
// //                           <span className="text-sm font-medium text-gray-500 w-8">
// //                             {votingType === 'ranked_choice' ? `${candidateIndex + 1}.` : '•'}
// //                           </span>
// //                           {candidate.imageUrl && (
// //                             <img 
// //                               src={candidate.imageUrl} 
// //                               alt={candidate.name} 
// //                               className="w-8 h-8 object-cover rounded"
// //                             />
// //                           )}
// //                           <span className="text-gray-700">
// //                             {candidate.name || `${config?.terminology === 'candidates' ? 'Candidate' : 'Option'} ${candidateIndex + 1}`}
// //                           </span>
// //                         </div>
// //                       ))}
// //                     </div>
// //                   )}

// //                   {question.questionFormat === 'open_answer' && (
// //                     <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
// //                       <p className="text-sm text-yellow-700">
// //                         📝 Open text input - voters can write their own response
// //                       </p>
// //                     </div>
// //                   )}

// //                   {question.questionFormat === 'image_based' && (
// //                     <div className="bg-purple-50 border border-purple-200 rounded-md p-3">
// //                       <p className="text-sm text-purple-700">
// //                         🖼️ Image-based question - visual options for voting
// //                       </p>
// //                     </div>
// //                   )}

// //                   {/* Question Settings */}
// //                   <div className="flex items-center space-x-4 text-xs text-gray-500">
// //                     {question.isRequired && <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">Required</span>}
// //                     {question.allowOtherOption && <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">Allow Other</span>}
// //                     <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
// //                       {votingType === 'plurality' ? 'Single Selection' : 
// //                        votingType === 'ranked_choice' ? 'Ranking' : 
// //                        'Multiple Selection'}
// //                     </span>
// //                   </div>
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         ))}
// //       </div>

// //       {/* Add Question Button */}
// //       <div className="flex justify-center">
// //         <button
// //           onClick={addQuestion}
// //           className="inline-flex items-center px-6 py-3 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-colors"
// //         >
// //           <Plus className="w-5 h-5 mr-2" />
// //           Add Question
// //         </button>
// //       </div>

// //       {/* Validation Errors */}
// //       {errors.questions && (
// //         <div className="bg-red-50 border border-red-200 rounded-md p-4">
// //           <p className="text-red-700">{errors.questions}</p>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default QuestionCreator;