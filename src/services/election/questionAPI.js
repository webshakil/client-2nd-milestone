//to solve error as i delete files
// Complete Voting Types Comparison Configuration

// Add the missing votingTypeConfigs
export const votingTypeConfigs = {
  plurality: {
    title: 'Plurality Voting',
    description: 'Traditional voting where each voter selects one option and the option with the most votes wins.',
    icon: '🗳️',
    votingBehavior: 'Voters select exactly one option per question',
    resultCalculation: 'Simple majority - most votes wins'
  },
  ranked_choice: {
    title: 'Ranked Choice Voting (RCV)',
    description: 'Voters rank all options in order of preference. If no option gets majority, elimination rounds occur.',
    icon: '📊',
    votingBehavior: 'Voters rank all options from most to least preferred',
    resultCalculation: 'Instant runoff with elimination rounds until majority achieved'
  },
  approval: {
    title: 'Approval Voting',
    description: 'Voters can approve of multiple options. The option with the most approvals wins.',
    icon: '✅',
    votingBehavior: 'Voters can select multiple options they approve of',
    resultCalculation: 'Most approvals wins - no elimination needed'
  }
};

export const questionTypeConfigs = {
  multiple_choice: {
    name: 'Multiple Choice Questions (MCQ)',
    icon: '📋',
    description: 'Traditional multiple choice questions with predefined answer options',
    
    // Voting method support
    supportedVotingTypes: ['plurality', 'ranked_choice', 'approval'],
    
    // Answer requirements
    requiresAnswers: true,
    minAnswers: 2,
    maxAnswers: 100,
    
    // Voting behavior by type (React-safe strings)
    votingBehavior: {
      plurality: 'Single selection voting - pick ONE option only',
      ranked_choice: 'Preference ranking voting - rank ALL options in order', 
      approval: 'Multiple approval voting - pick ALL options you approve'
    },
    
    // Detailed voting specifications (for programmatic use)
    votingSpecs: {
      plurality: {
        description: 'Single selection voting - pick ONE option only',
        howVotersAnswer: 'Select 1 option only',
        exampleAction: 'Pick: "Alice Johnson"',
        validationRule: 'Exactly 1 selection per question',
        storageFormat: 'Simple option_id',
        resultCalculation: 'Count votes for each option'
      },
      ranked_choice: {
        description: 'Preference ranking voting - rank ALL options in order',
        howVotersAnswer: 'Rank all options (1st, 2nd, 3rd...)',
        exampleAction: 'Rank: 1st=Alice, 2nd=Bob, 3rd=Carol',
        validationRule: 'All options must be ranked',
        storageFormat: 'Array of ranked option_ids',
        resultCalculation: 'Elimination rounds with transfers'
      },
      approval: {
        description: 'Multiple approval voting - pick ALL options you approve',
        howVotersAnswer: 'Select multiple options they like',
        exampleAction: 'Approve: Alice ✓, Bob ✓, Carol ✗',
        validationRule: 'At least 1 selection per question',
        storageFormat: 'Array of approved option_ids',
        resultCalculation: 'Count approvals for each option'
      }
    },
    
    example: {
      question: 'Who should be university president?',
      answers: ['Alice Johnson', 'Bob Smith', 'Carol Williams']
    }
  },

  open_answer: {
    name: 'Open-Ended Text Questions',
    icon: '✍️',
    description: 'Free-form text response questions where users write their own answers',
    
    // Voting method support
    supportedVotingTypes: ['plurality', 'ranked_choice', 'approval'],
    
    // Answer requirements
    requiresAnswers: false,
    minAnswers: 0,
    maxAnswers: 0,
    characterLimits: { min: 1, max: 5000 },
    
    // Voting behavior by type (React-safe strings)
    votingBehavior: {
      plurality: 'Type their own response - no voting method effect',
      ranked_choice: 'Type their own response - no voting method effect',
      approval: 'Type their own response - no voting method effect'
    },
    
    // Detailed voting specifications (for programmatic use)
    votingSpecs: {
      plurality: {
        description: 'Single selection voting - pick ONE option only',
        howVotersAnswer: 'Type their own response',
        exampleAction: '"I want better healthcare..."',
        validationRule: 'None - text is text',
        storageFormat: 'Text string',
        resultCalculation: 'Text responses (may be categorized)'
      },
      ranked_choice: {
        description: 'Preference ranking voting - rank ALL options in order',
        howVotersAnswer: 'Type their own response',
        exampleAction: '"I want better healthcare..."',
        validationRule: 'None - text is text',
        storageFormat: 'Text string',
        resultCalculation: 'Text responses (may be ranked if similar)'
      },
      approval: {
        description: 'Multiple approval voting - pick ALL options you approve',
        howVotersAnswer: 'Type their own response',
        exampleAction: '"I want better healthcare..."',
        validationRule: 'None - text is text',
        storageFormat: 'Text string',
        resultCalculation: 'Text responses (individual evaluation)'
      }
    },
    
    example: {
      question: 'What is your top concern for the university?',
      answers: []
    }
  },

  image_based: {
    name: 'Image-Based Questions',
    icon: '🖼️',
    description: 'Visual choice questions where users select from image options',
    
    // Voting method support
    supportedVotingTypes: ['plurality', 'ranked_choice', 'approval'],
    
    // Answer requirements
    requiresAnswers: true,
    requiresImages: true,
    minAnswers: 2,
    maxAnswers: 50,
    
    // Voting behavior by type (React-safe strings)
    votingBehavior: {
      plurality: 'Click 1 image only - single selection voting',
      ranked_choice: 'Drag images to rank order - preference ranking voting',
      approval: 'Click multiple images you approve - multiple approval voting'
    },
    
    // Detailed voting specifications (for programmatic use)
    votingSpecs: {
      plurality: {
        description: 'Single selection voting - pick ONE option only',
        howVotersAnswer: 'Click 1 image only',
        exampleAction: 'Click: Logo A',
        validationRule: 'Exactly 1 selection per question',
        storageFormat: 'Simple option_id',
        resultCalculation: 'Count votes for each image'
      },
      ranked_choice: {
        description: 'Preference ranking voting - rank ALL options in order',
        howVotersAnswer: 'Drag images to rank order',
        exampleAction: 'Rank: 1st=Logo A, 2nd=Logo B, 3rd=Logo C',
        validationRule: 'All images must be ranked',
        storageFormat: 'Array of ranked option_ids',
        resultCalculation: 'Elimination rounds with transfers'
      },
      approval: {
        description: 'Multiple approval voting - pick ALL options you approve',
        howVotersAnswer: 'Click multiple images they like',
        exampleAction: 'Approve: Logo A ✓, Logo C ✓',
        validationRule: 'At least 1 selection per question',
        storageFormat: 'Array of approved option_ids',
        resultCalculation: 'Count approvals for each image'
      }
    },
    
    example: {
      question: 'Which university logo design do you prefer?',
      answers: ['Logo Design A', 'Logo Design B', 'Logo Design C']
    }
  },

  comparison: {
    name: 'Comparison Questions',
    icon: '⚖️',
    description: 'Side-by-side comparison questions for evaluating multiple items',
    
    // Voting method support
    supportedVotingTypes: ['plurality', 'ranked_choice', 'approval'],
    
    // Answer requirements
    requiresAnswers: true,
    minAnswers: 2,
    maxAnswers: 20,
    
    // Voting behavior by type (React-safe strings)
    votingBehavior: {
      plurality: 'Pick winner of each pair - single selection voting',
      ranked_choice: 'Rank all items across pairs - preference ranking voting',
      approval: 'Approve multiple items you like - multiple approval voting'
    },
    
    // Detailed voting specifications (for programmatic use)
    votingSpecs: {
      plurality: {
        description: 'Single selection voting - pick ONE option only',
        howVotersAnswer: 'Pick winner of each pair',
        exampleAction: 'iPhone vs Samsung: Pick "iPhone"',
        validationRule: 'Exactly 1 selection per question',
        storageFormat: 'Simple option_id',
        resultCalculation: 'Count votes for each option'
      },
      ranked_choice: {
        description: 'Preference ranking voting - rank ALL options in order',
        howVotersAnswer: 'Rank all items across pairs',
        exampleAction: 'Rank: 1st=iPhone, 2nd=Google, 3rd=Samsung',
        validationRule: 'All options must be ranked',
        storageFormat: 'Array of ranked option_ids',
        resultCalculation: 'Elimination rounds with transfers'
      },
      approval: {
        description: 'Multiple approval voting - pick ALL options you approve',
        howVotersAnswer: 'Approve multiple items they like',
        exampleAction: 'Approve: iPhone ✓, Samsung ✓, Google ✗',
        validationRule: 'At least 1 selection per question',
        storageFormat: 'Array of approved option_ids',
        resultCalculation: 'Count approvals for each option'
      }
    },
    
    example: {
      question: 'Compare these mobile phone options',
      answers: ['iPhone', 'Samsung Galaxy', 'Google Pixel']
    }
  }
};

// Add the missing questionService
export const questionService = {
  async createQuestion(electionId, questionData) {
    try {
      const response = await fetch(`/api/elections/${electionId}/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(questionData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create question');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating question:', error);
      throw error;
    }
  },

  async updateQuestion(questionId, questionData) {
    try {
      const response = await fetch(`/api/questions/${questionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(questionData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update question');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating question:', error);
      throw error;
    }
  },

  async deleteQuestion(questionId) {
    try {
      const response = await fetch(`/api/questions/${questionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete question');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting question:', error);
      throw error;
    }
  },

  async getQuestions(electionId) {
    try {
      const response = await fetch(`/api/elections/${electionId}/questions`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch questions');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  }
};

// Technical specifications summary
export const technicalSpecs = {
  totalQuestionTypes: 4,
  questionsRequiringPreAnswers: 3, // MCQ, Image, Comparison
  questionsNotRequiringPreAnswers: 1, // Text only
  
  supportMatrix: {
    plurality: {
      supportedTypes: ['multiple_choice', 'open_answer', 'image_based', 'comparison'],
      totalSupported: 4
    },
    ranked_choice: {
      supportedTypes: ['multiple_choice', 'open_answer', 'image_based', 'comparison'],
      totalSupported: 4
    },
    approval: {
      supportedTypes: ['multiple_choice', 'open_answer', 'image_based', 'comparison'],
      totalSupported: 4
    }
  }
};

// Real-world example configuration
export const exampleElection = {
  title: "University President Election",
  questions: [
    {
      id: 'q1',
      type: 'multiple_choice',
      question: 'Who should be university president?',
      answers: ['Alice Johnson', 'Bob Smith', 'Carol Williams'],
      exampleVoting: {
        plurality: 'Selects: "Alice"',
        ranked_choice: 'Ranks: 1st=Alice, 2nd=Carol, 3rd=Bob',
        approval: 'Approves: Alice ✓, Carol ✓'
      }
    },
    {
      id: 'q2',
      type: 'open_answer',
      question: 'What is your top concern for the university?',
      exampleVoting: {
        plurality: 'Types: "Better dining halls"',
        ranked_choice: 'Types: "Better dining halls"',
        approval: 'Types: "Better dining halls"'
      }
    },
    {
      id: 'q3',
      type: 'image_based',
      question: 'Which university logo design do you prefer?',
      answers: ['Logo Design #1', 'Logo Design #2', 'Logo Design #3'],
      exampleVoting: {
        plurality: 'Clicks: Logo #2',
        ranked_choice: 'Ranks: 1st=Logo #2, 2nd=Logo #1, 3rd=Logo #3',
        approval: 'Clicks: Logo #1 ✓, Logo #2 ✓'
      }
    },
    {
      id: 'q4',
      type: 'comparison',
      question: 'Compare these mobile phone options',
      answers: ['iPhone', 'Samsung Galaxy', 'Google Pixel'],
      exampleVoting: {
        plurality: 'Picks winners in each pair',
        ranked_choice: 'Ranks all: 1st=iPhone, 2nd=Google, 3rd=Samsung',
        approval: 'Approves: iPhone ✓, Google ✓'
      }
    }
  ]
};

// Question Helper Functions (Updated)
export const questionHelpers = {
  // Get default question template for a given type and voting method
  /*eslint-disable*/
  getDefaultQuestion: (questionType, votingType) => {
    const config = questionTypeConfigs[questionType];
    if (!config) return null;
    
    let defaultAnswers = [];
    
    if (config.requiresAnswers) {
      if (questionType === 'multiple_choice') {
        // Default for multiple choice
        for (let i = 0; i < config.minAnswers; i++) {
          defaultAnswers.push({
            id: `option_${i + 1}`,
            text: `Option ${i + 1}`,
            imageUrl: null
          });
        }
      } else if (questionType === 'image_based') {
        // Default for image-based questions
        for (let i = 0; i < config.minAnswers; i++) {
          defaultAnswers.push({
            id: `image_${i + 1}`,
            text: `Image Option ${i + 1}`,
            imageUrl: null // Will need to be populated
          });
        }
      } else if (questionType === 'comparison') {
        // Default for comparison questions
        for (let i = 0; i < config.minAnswers; i++) {
          defaultAnswers.push({
            id: `compare_${i + 1}`,
            text: `Option ${i + 1}`,
            imageUrl: null
          });
        }
      }
    }
    
    return {
      questionText: config.example?.question || '',
      questionType: questionType,
      questionImageUrl: null,
      answers: defaultAnswers,
      isRequired: true,
      allowOtherOption: questionType !== 'open_answer' && !config.requiresImages,
      characterLimit: questionType === 'open_answer' ? 500 : null
    };
  },

  // Get voting behavior for specific question type and voting method (React-safe string)
  getVotingBehavior: (questionType, votingType) => {
    const config = questionTypeConfigs[questionType];
    if (!config || !config.votingBehavior || !config.votingBehavior[votingType]) {
      return null;
    }
    return config.votingBehavior[votingType];
  },

  // Get detailed voting specifications for programmatic use
  getVotingSpecs: (questionType, votingType) => {
    const config = questionTypeConfigs[questionType];
    if (!config || !config.votingSpecs || !config.votingSpecs[votingType]) {
      return null;
    }
    return config.votingSpecs[votingType];
  },

  // Validate question configuration
  validateQuestion: (votingType, questionType, questionText, answers) => {
    const config = questionTypeConfigs[questionType];
    const errors = {};
    
    if (!config) {
      return { isValid: false, errors: { type: 'Invalid question type' } };
    }
    
    if (!questionText || questionText.trim() === '') {
      errors.questionText = 'Question text is required';
    }
    
    if (config.requiresAnswers) {
      if (!answers || answers.length < config.minAnswers) {
        errors.answers = `At least ${config.minAnswers} answers required for ${config.name}`;
      }
      
      if (answers && answers.length > config.maxAnswers) {
        errors.answers = `Maximum ${config.maxAnswers} answers allowed for ${config.name}`;
      }
      
      // Check if all answers have text
      if (answers) {
        const emptyAnswers = answers.filter(answer => !answer.text || answer.text.trim() === '');
        if (emptyAnswers.length > 0) {
          errors.answers = 'All answer options must have text';
        }
        
        // Special validation for image-based questions
        if (questionType === 'image_based') {
          const answersWithoutImages = answers.filter(answer => !answer.imageUrl);
          if (answersWithoutImages.length > 0) {
            errors.answers = 'All options must have images for image-based questions';
          }
        }
      }
    }
    
    return { 
      isValid: Object.keys(errors).length === 0, 
      errors 
    };
  },

  // Create question data for API
  createQuestionData: (votingType, questionType, questionText, answers, options = {}) => {
    return {
      questionType,
      questionText: questionText.trim(),
      answers: answers || [],
      questionImageUrl: options.questionImageUrl || null,
      questionOrder: options.questionOrder || 1,
      isRequired: options.isRequired !== undefined ? options.isRequired : true,
      allowOtherOption: options.allowOtherOption || false,
      characterLimit: options.characterLimit || null,
      votingType
    };
  },

  // Get question statistics
  getQuestionStats: (questions) => {
    const stats = {
      total: questions.length,
      required: 0,
      optional: 0,
      withImages: 0,
      byType: {}
    };
    
    Object.keys(questionTypeConfigs).forEach(type => {
      stats.byType[type] = 0;
    });
    
    questions.forEach(question => {
      if (question.isRequired) stats.required++;
      else stats.optional++;
      
      if (question.questionImageUrl) stats.withImages++;
      /*eslint-disable*/
      if (stats.byType.hasOwnProperty(question.questionType)) {
        stats.byType[question.questionType]++;
      }
    });
    
    return stats;
  },

  // Generate unique question ID
  generateQuestionId: () => {
    return 'q_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  },

  // Generate unique answer ID
  generateAnswerId: () => {
    return 'a_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  },

  // Check if question type supports images
  supportsImages: (questionType) => {
    const config = questionTypeConfigs[questionType];
    return config && (questionType === 'image_based' || questionType === 'comparison');
  },

  // Check if question type requires images
  requiresImages: (questionType) => {
    const config = questionTypeConfigs[questionType];
    return config && config.requiresImages === true;
  },

  // Get recommended question types for voting method
  getRecommendedTypes: (votingType) => {
    const recommendations = {
      plurality: ['multiple_choice', 'open_answer', 'image_based', 'comparison'],
      ranked_choice: ['multiple_choice', 'open_answer', 'image_based', 'comparison'],
      approval: ['multiple_choice', 'open_answer', 'image_based', 'comparison']
    };
    
    return recommendations[votingType] || Object.keys(questionTypeConfigs);
  },

  // Check if question type supports specific voting method
  supportsVotingMethod: (questionType, votingType) => {
    const config = questionTypeConfigs[questionType];
    return config && config.supportedVotingTypes.includes(votingType);
  },

  // Get all supported voting methods for question type
  getSupportedVotingMethods: (questionType) => {
    const config = questionTypeConfigs[questionType];
    return config ? config.supportedVotingTypes : [];
  },

  // Generate comparison table data
  generateComparisonTable: () => {
    const table = {
      headers: ['Question Type', 'Plurality Voting', 'Ranked Choice Voting', 'Approval Voting'],
      rows: []
    };
/*eslint-disable*/
    Object.entries(questionTypeConfigs).forEach(([key, config]) => {
      const row = {
        questionType: config.name,
        plurality: config.votingBehavior.plurality,
        ranked_choice: config.votingBehavior.ranked_choice,
        approval: config.votingBehavior.approval,
        // Include detailed specs for programmatic access
        pluralitySpecs: config.votingSpecs.plurality,
        rankedChoiceSpecs: config.votingSpecs.ranked_choice,
        approvalSpecs: config.votingSpecs.approval
      };
      table.rows.push(row);
    });

    return table;
  },

  // Validate question based on voting method
  validateQuestionForVotingMethod: (question, votingMethod) => {
    const config = questionTypeConfigs[question.questionType];
    
    if (!config) {
      return { isValid: false, error: 'Invalid question type' };
    }

    if (!config.supportedVotingTypes.includes(votingMethod)) {
      return { 
        isValid: false, 
        error: `${config.name} does not support ${votingMethod} voting` 
      };
    }

    // Additional validation based on voting method
    const specs = config.votingSpecs[votingMethod];
    if (!specs) {
      return { 
        isValid: false, 
        error: `No specifications defined for ${votingMethod} with ${config.name}` 
      };
    }

    return { isValid: true };
  }
};

export default { 
  questionTypeConfigs, 
  votingTypeConfigs,
  questionService,
  technicalSpecs, 
  exampleElection, 
  questionHelpers 
};
//This is the last workable code
// Complete Voting Types Comparison Configuration
// export const questionTypeConfigs = {
//   multiple_choice: {
//     name: 'Multiple Choice Questions (MCQ)',
//     icon: '📋',
//     description: 'Traditional multiple choice questions with predefined answer options',
    
//     // Voting method support
//     supportedVotingTypes: ['plurality', 'ranked_choice', 'approval'],
    
//     // Answer requirements
//     requiresAnswers: true,
//     minAnswers: 2,
//     maxAnswers: 100,
    
//     // Voting behavior by type (React-safe strings)
//     votingBehavior: {
//       plurality: 'Single selection voting - pick ONE option only',
//       ranked_choice: 'Preference ranking voting - rank ALL options in order', 
//       approval: 'Multiple approval voting - pick ALL options you approve'
//     },
    
//     // Detailed voting specifications (for programmatic use)
//     votingSpecs: {
//       plurality: {
//         description: 'Single selection voting - pick ONE option only',
//         howVotersAnswer: 'Select 1 option only',
//         exampleAction: 'Pick: "Alice Johnson"',
//         validationRule: 'Exactly 1 selection per question',
//         storageFormat: 'Simple option_id',
//         resultCalculation: 'Count votes for each option'
//       },
//       ranked_choice: {
//         description: 'Preference ranking voting - rank ALL options in order',
//         howVotersAnswer: 'Rank all options (1st, 2nd, 3rd...)',
//         exampleAction: 'Rank: 1st=Alice, 2nd=Bob, 3rd=Carol',
//         validationRule: 'All options must be ranked',
//         storageFormat: 'Array of ranked option_ids',
//         resultCalculation: 'Elimination rounds with transfers'
//       },
//       approval: {
//         description: 'Multiple approval voting - pick ALL options you approve',
//         howVotersAnswer: 'Select multiple options they like',
//         exampleAction: 'Approve: Alice ✓, Bob ✓, Carol ✗',
//         validationRule: 'At least 1 selection per question',
//         storageFormat: 'Array of approved option_ids',
//         resultCalculation: 'Count approvals for each option'
//       }
//     },
    
//     example: {
//       question: 'Who should be university president?',
//       answers: ['Alice Johnson', 'Bob Smith', 'Carol Williams']
//     }
//   },

//   open_answer: {
//     name: 'Open-Ended Text Questions',
//     icon: '✍️',
//     description: 'Free-form text response questions where users write their own answers',
    
//     // Voting method support
//     supportedVotingTypes: ['plurality', 'ranked_choice', 'approval'],
    
//     // Answer requirements
//     requiresAnswers: false,
//     minAnswers: 0,
//     maxAnswers: 0,
//     characterLimits: { min: 1, max: 5000 },
    
//     // Voting behavior by type (React-safe strings)
//     votingBehavior: {
//       plurality: 'Type their own response - no voting method effect',
//       ranked_choice: 'Type their own response - no voting method effect',
//       approval: 'Type their own response - no voting method effect'
//     },
    
//     // Detailed voting specifications (for programmatic use)
//     votingSpecs: {
//       plurality: {
//         description: 'Single selection voting - pick ONE option only',
//         howVotersAnswer: 'Type their own response',
//         exampleAction: '"I want better healthcare..."',
//         validationRule: 'None - text is text',
//         storageFormat: 'Text string',
//         resultCalculation: 'Text responses (may be categorized)'
//       },
//       ranked_choice: {
//         description: 'Preference ranking voting - rank ALL options in order',
//         howVotersAnswer: 'Type their own response',
//         exampleAction: '"I want better healthcare..."',
//         validationRule: 'None - text is text',
//         storageFormat: 'Text string',
//         resultCalculation: 'Text responses (may be ranked if similar)'
//       },
//       approval: {
//         description: 'Multiple approval voting - pick ALL options you approve',
//         howVotersAnswer: 'Type their own response',
//         exampleAction: '"I want better healthcare..."',
//         validationRule: 'None - text is text',
//         storageFormat: 'Text string',
//         resultCalculation: 'Text responses (individual evaluation)'
//       }
//     },
    
//     example: {
//       question: 'What is your top concern for the university?',
//       answers: []
//     }
//   },

//   image_based: {
//     name: 'Image-Based Questions',
//     icon: '🖼️',
//     description: 'Visual choice questions where users select from image options',
    
//     // Voting method support
//     supportedVotingTypes: ['plurality', 'ranked_choice', 'approval'],
    
//     // Answer requirements
//     requiresAnswers: true,
//     requiresImages: true,
//     minAnswers: 2,
//     maxAnswers: 50,
    
//     // Voting behavior by type (React-safe strings)
//     votingBehavior: {
//       plurality: 'Click 1 image only - single selection voting',
//       ranked_choice: 'Drag images to rank order - preference ranking voting',
//       approval: 'Click multiple images you approve - multiple approval voting'
//     },
    
//     // Detailed voting specifications (for programmatic use)
//     votingSpecs: {
//       plurality: {
//         description: 'Single selection voting - pick ONE option only',
//         howVotersAnswer: 'Click 1 image only',
//         exampleAction: 'Click: Logo A',
//         validationRule: 'Exactly 1 selection per question',
//         storageFormat: 'Simple option_id',
//         resultCalculation: 'Count votes for each image'
//       },
//       ranked_choice: {
//         description: 'Preference ranking voting - rank ALL options in order',
//         howVotersAnswer: 'Drag images to rank order',
//         exampleAction: 'Rank: 1st=Logo A, 2nd=Logo B, 3rd=Logo C',
//         validationRule: 'All images must be ranked',
//         storageFormat: 'Array of ranked option_ids',
//         resultCalculation: 'Elimination rounds with transfers'
//       },
//       approval: {
//         description: 'Multiple approval voting - pick ALL options you approve',
//         howVotersAnswer: 'Click multiple images they like',
//         exampleAction: 'Approve: Logo A ✓, Logo C ✓',
//         validationRule: 'At least 1 selection per question',
//         storageFormat: 'Array of approved option_ids',
//         resultCalculation: 'Count approvals for each image'
//       }
//     },
    
//     example: {
//       question: 'Which university logo design do you prefer?',
//       answers: ['Logo Design A', 'Logo Design B', 'Logo Design C']
//     }
//   },

//   comparison: {
//     name: 'Comparison Questions',
//     icon: '⚖️',
//     description: 'Side-by-side comparison questions for evaluating multiple items',
    
//     // Voting method support
//     supportedVotingTypes: ['plurality', 'ranked_choice', 'approval'],
    
//     // Answer requirements
//     requiresAnswers: true,
//     minAnswers: 2,
//     maxAnswers: 20,
    
//     // Voting behavior by type (React-safe strings)
//     votingBehavior: {
//       plurality: 'Pick winner of each pair - single selection voting',
//       ranked_choice: 'Rank all items across pairs - preference ranking voting',
//       approval: 'Approve multiple items you like - multiple approval voting'
//     },
    
//     // Detailed voting specifications (for programmatic use)
//     votingSpecs: {
//       plurality: {
//         description: 'Single selection voting - pick ONE option only',
//         howVotersAnswer: 'Pick winner of each pair',
//         exampleAction: 'iPhone vs Samsung: Pick "iPhone"',
//         validationRule: 'Exactly 1 selection per question',
//         storageFormat: 'Simple option_id',
//         resultCalculation: 'Count votes for each option'
//       },
//       ranked_choice: {
//         description: 'Preference ranking voting - rank ALL options in order',
//         howVotersAnswer: 'Rank all items across pairs',
//         exampleAction: 'Rank: 1st=iPhone, 2nd=Google, 3rd=Samsung',
//         validationRule: 'All options must be ranked',
//         storageFormat: 'Array of ranked option_ids',
//         resultCalculation: 'Elimination rounds with transfers'
//       },
//       approval: {
//         description: 'Multiple approval voting - pick ALL options you approve',
//         howVotersAnswer: 'Approve multiple items they like',
//         exampleAction: 'Approve: iPhone ✓, Samsung ✓, Google ✗',
//         validationRule: 'At least 1 selection per question',
//         storageFormat: 'Array of approved option_ids',
//         resultCalculation: 'Count approvals for each option'
//       }
//     },
    
//     example: {
//       question: 'Compare these mobile phone options',
//       answers: ['iPhone', 'Samsung Galaxy', 'Google Pixel']
//     }
//   }
// };

// // Technical specifications summary
// export const technicalSpecs = {
//   totalQuestionTypes: 4,
//   questionsRequiringPreAnswers: 3, // MCQ, Image, Comparison
//   questionsNotRequiringPreAnswers: 1, // Text only
  
//   supportMatrix: {
//     plurality: {
//       supportedTypes: ['multiple_choice', 'open_answer', 'image_based', 'comparison'],
//       totalSupported: 4
//     },
//     ranked_choice: {
//       supportedTypes: ['multiple_choice', 'open_answer', 'image_based', 'comparison'],
//       totalSupported: 4
//     },
//     approval: {
//       supportedTypes: ['multiple_choice', 'open_answer', 'image_based', 'comparison'],
//       totalSupported: 4
//     }
//   }
// };

// // Real-world example configuration
// export const exampleElection = {
//   title: "University President Election",
//   questions: [
//     {
//       id: 'q1',
//       type: 'multiple_choice',
//       question: 'Who should be university president?',
//       answers: ['Alice Johnson', 'Bob Smith', 'Carol Williams'],
//       exampleVoting: {
//         plurality: 'Selects: "Alice"',
//         ranked_choice: 'Ranks: 1st=Alice, 2nd=Carol, 3rd=Bob',
//         approval: 'Approves: Alice ✓, Carol ✓'
//       }
//     },
//     {
//       id: 'q2',
//       type: 'open_answer',
//       question: 'What is your top concern for the university?',
//       exampleVoting: {
//         plurality: 'Types: "Better dining halls"',
//         ranked_choice: 'Types: "Better dining halls"',
//         approval: 'Types: "Better dining halls"'
//       }
//     },
//     {
//       id: 'q3',
//       type: 'image_based',
//       question: 'Which university logo design do you prefer?',
//       answers: ['Logo Design #1', 'Logo Design #2', 'Logo Design #3'],
//       exampleVoting: {
//         plurality: 'Clicks: Logo #2',
//         ranked_choice: 'Ranks: 1st=Logo #2, 2nd=Logo #1, 3rd=Logo #3',
//         approval: 'Clicks: Logo #1 ✓, Logo #2 ✓'
//       }
//     },
//     {
//       id: 'q4',
//       type: 'comparison',
//       question: 'Compare these mobile phone options',
//       answers: ['iPhone', 'Samsung Galaxy', 'Google Pixel'],
//       exampleVoting: {
//         plurality: 'Picks winners in each pair',
//         ranked_choice: 'Ranks all: 1st=iPhone, 2nd=Google, 3rd=Samsung',
//         approval: 'Approves: iPhone ✓, Google ✓'
//       }
//     }
//   ]
// };

// // Question Helper Functions (Updated)
// export const questionHelpers = {
//   // Get default question template for a given type and voting method
//   /*eslint-disable*/
//   getDefaultQuestion: (questionType, votingType) => {
//     const config = questionTypeConfigs[questionType];
//     if (!config) return null;
    
//     let defaultAnswers = [];
    
//     if (config.requiresAnswers) {
//       if (questionType === 'multiple_choice') {
//         // Default for multiple choice
//         for (let i = 0; i < config.minAnswers; i++) {
//           defaultAnswers.push({
//             id: `option_${i + 1}`,
//             text: `Option ${i + 1}`,
//             imageUrl: null
//           });
//         }
//       } else if (questionType === 'image_based') {
//         // Default for image-based questions
//         for (let i = 0; i < config.minAnswers; i++) {
//           defaultAnswers.push({
//             id: `image_${i + 1}`,
//             text: `Image Option ${i + 1}`,
//             imageUrl: null // Will need to be populated
//           });
//         }
//       } else if (questionType === 'comparison') {
//         // Default for comparison questions
//         for (let i = 0; i < config.minAnswers; i++) {
//           defaultAnswers.push({
//             id: `compare_${i + 1}`,
//             text: `Option ${i + 1}`,
//             imageUrl: null
//           });
//         }
//       }
//     }
    
//     return {
//       questionText: config.example?.question || '',
//       questionType: questionType,
//       questionImageUrl: null,
//       answers: defaultAnswers,
//       isRequired: true,
//       allowOtherOption: questionType !== 'open_answer' && !config.requiresImages,
//       characterLimit: questionType === 'open_answer' ? 500 : null
//     };
//   },

//   // Get voting behavior for specific question type and voting method (React-safe string)
//   getVotingBehavior: (questionType, votingType) => {
//     const config = questionTypeConfigs[questionType];
//     if (!config || !config.votingBehavior || !config.votingBehavior[votingType]) {
//       return null;
//     }
//     return config.votingBehavior[votingType];
//   },

//   // Get detailed voting specifications for programmatic use
//   getVotingSpecs: (questionType, votingType) => {
//     const config = questionTypeConfigs[questionType];
//     if (!config || !config.votingSpecs || !config.votingSpecs[votingType]) {
//       return null;
//     }
//     return config.votingSpecs[votingType];
//   },

//   // Validate question configuration
//   validateQuestion: (question) => {
//     const config = questionTypeConfigs[question.questionType];
//     if (!config) {
//       return { isValid: false, error: 'Invalid question type' };
//     }
    
//     if (!question.questionText || question.questionText.trim() === '') {
//       return { isValid: false, error: 'Question text is required' };
//     }
    
//     if (config.requiresAnswers) {
//       if (!question.answers || question.answers.length < config.minAnswers) {
//         return { 
//           isValid: false, 
//           error: `At least ${config.minAnswers} answers required for ${config.name}` 
//         };
//       }
      
//       if (question.answers.length > config.maxAnswers) {
//         return { 
//           isValid: false, 
//           error: `Maximum ${config.maxAnswers} answers allowed for ${config.name}` 
//         };
//       }
      
//       // Check if all answers have text
//       const emptyAnswers = question.answers.filter(answer => !answer.text || answer.text.trim() === '');
//       if (emptyAnswers.length > 0) {
//         return { isValid: false, error: 'All answer options must have text' };
//       }
      
//       // Special validation for image-based questions
//       if (question.questionType === 'image_based') {
//         const answersWithoutImages = question.answers.filter(answer => !answer.imageUrl);
//         if (answersWithoutImages.length > 0) {
//           return { isValid: false, error: 'All options must have images for image-based questions' };
//         }
//       }
//     }
    
//     // Validate character limit for open answers
//     if (question.questionType === 'open_answer') {
//       if (!question.characterLimit || question.characterLimit < 1 || question.characterLimit > 5000) {
//         return { isValid: false, error: 'Character limit must be between 1 and 5000' };
//       }
//     }
    
//     return { isValid: true };
//   },

//   // Get question statistics
//   getQuestionStats: (questions) => {
//     const stats = {
//       total: questions.length,
//       required: 0,
//       optional: 0,
//       withImages: 0,
//       byType: {}
//     };
    
//     Object.keys(questionTypeConfigs).forEach(type => {
//       stats.byType[type] = 0;
//     });
    
//     questions.forEach(question => {
//       if (question.isRequired) stats.required++;
//       else stats.optional++;
      
//       if (question.questionImageUrl) stats.withImages++;
//       /*eslint-disable*/
//       if (stats.byType.hasOwnProperty(question.questionType)) {
//         stats.byType[question.questionType]++;
//       }
//     });
    
//     return stats;
//   },

//   // Generate unique question ID
//   generateQuestionId: () => {
//     return 'q_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
//   },

//   // Generate unique answer ID
//   generateAnswerId: () => {
//     return 'a_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
//   },

//   // Check if question type supports images
//   supportsImages: (questionType) => {
//     const config = questionTypeConfigs[questionType];
//     return config && (questionType === 'image_based' || questionType === 'comparison');
//   },

//   // Check if question type requires images
//   requiresImages: (questionType) => {
//     const config = questionTypeConfigs[questionType];
//     return config && config.requiresImages === true;
//   },

//   // Get recommended question types for voting method
//   getRecommendedTypes: (votingType) => {
//     const recommendations = {
//       plurality: ['multiple_choice', 'open_answer', 'image_based', 'comparison'],
//       ranked_choice: ['multiple_choice', 'open_answer', 'image_based', 'comparison'],
//       approval: ['multiple_choice', 'open_answer', 'image_based', 'comparison']
//     };
    
//     return recommendations[votingType] || Object.keys(questionTypeConfigs);
//   },

//   // Check if question type supports specific voting method
//   supportsVotingMethod: (questionType, votingType) => {
//     const config = questionTypeConfigs[questionType];
//     return config && config.supportedVotingTypes.includes(votingType);
//   },

//   // Get all supported voting methods for question type
//   getSupportedVotingMethods: (questionType) => {
//     const config = questionTypeConfigs[questionType];
//     return config ? config.supportedVotingTypes : [];
//   },

//   // Generate comparison table data
//   generateComparisonTable: () => {
//     const table = {
//       headers: ['Question Type', 'Plurality Voting', 'Ranked Choice Voting', 'Approval Voting'],
//       rows: []
//     };
// /*eslint-disable*/
//     Object.entries(questionTypeConfigs).forEach(([key, config]) => {
//       const row = {
//         questionType: config.name,
//         plurality: config.votingBehavior.plurality,
//         ranked_choice: config.votingBehavior.ranked_choice,
//         approval: config.votingBehavior.approval,
//         // Include detailed specs for programmatic access
//         pluralitySpecs: config.votingSpecs.plurality,
//         rankedChoiceSpecs: config.votingSpecs.ranked_choice,
//         approvalSpecs: config.votingSpecs.approval
//       };
//       table.rows.push(row);
//     });

//     return table;
//   },

//   // Validate question based on voting method
//   validateQuestionForVotingMethod: (question, votingMethod) => {
//     const config = questionTypeConfigs[question.questionType];
    
//     if (!config) {
//       return { isValid: false, error: 'Invalid question type' };
//     }

//     if (!config.supportedVotingTypes.includes(votingMethod)) {
//       return { 
//         isValid: false, 
//         error: `${config.name} does not support ${votingMethod} voting` 
//       };
//     }

//     // Additional validation based on voting method
//     const specs = config.votingSpecs[votingMethod];
//     if (!specs) {
//       return { 
//         isValid: false, 
//         error: `No specifications defined for ${votingMethod} with ${config.name}` 
//       };
//     }

//     return { isValid: true };
//   }
// };

// export default { 
//   questionTypeConfigs, 
//   technicalSpecs, 
//   exampleElection, 
//   questionHelpers 
// };










// // Complete Voting Types Comparison Configuration
// export const questionTypeConfigs = {
//   multiple_choice: {
//     name: 'Multiple Choice Questions (MCQ)',
//     icon: '📋',
//     description: 'Traditional multiple choice questions with predefined answer options',
    
//     // Voting method support
//     supportedVotingTypes: ['plurality', 'ranked_choice', 'approval'],
    
//     // Answer requirements
//     requiresAnswers: true,
//     minAnswers: 2,
//     maxAnswers: 100,
    
//     // Voting behavior by type (React-safe strings)
//     votingBehavior: {
//       plurality: 'Single selection voting - pick ONE option only',
//       ranked_choice: 'Preference ranking voting - rank ALL options in order', 
//       approval: 'Multiple approval voting - pick ALL options you approve'
//     },
    
//     // Detailed voting specifications (for programmatic use)
//     votingSpecs: {
//       plurality: {
//         description: 'Single selection voting - pick ONE option only',
//         howVotersAnswer: 'Select 1 option only',
//         exampleAction: 'Pick: "Alice Johnson"',
//         validationRule: 'Exactly 1 selection per question',
//         storageFormat: 'Simple option_id',
//         resultCalculation: 'Count votes for each option'
//       },
//       ranked_choice: {
//         description: 'Preference ranking voting - rank ALL options in order',
//         howVotersAnswer: 'Rank all options (1st, 2nd, 3rd...)',
//         exampleAction: 'Rank: 1st=Alice, 2nd=Bob, 3rd=Carol',
//         validationRule: 'All options must be ranked',
//         storageFormat: 'Array of ranked option_ids',
//         resultCalculation: 'Elimination rounds with transfers'
//       },
//       approval: {
//         description: 'Multiple approval voting - pick ALL options you approve',
//         howVotersAnswer: 'Select multiple options they like',
//         exampleAction: 'Approve: Alice ✓, Bob ✓, Carol ✗',
//         validationRule: 'At least 1 selection per question',
//         storageFormat: 'Array of approved option_ids',
//         resultCalculation: 'Count approvals for each option'
//       }
//     },
    
//     example: {
//       question: 'Who should be university president?',
//       answers: ['Alice Johnson', 'Bob Smith', 'Carol Williams']
//     }
//   },

//   open_answer: {
//     name: 'Open-Ended Text Questions',
//     icon: '✍️',
//     description: 'Free-form text response questions where users write their own answers',
    
//     // Voting method support
//     supportedVotingTypes: ['plurality', 'ranked_choice', 'approval'],
    
//     // Answer requirements
//     requiresAnswers: false,
//     minAnswers: 0,
//     maxAnswers: 0,
//     characterLimits: { min: 1, max: 5000 },
    
//     // Voting behavior by type (React-safe strings)
//     votingBehavior: {
//       plurality: 'Type their own response - no voting method effect',
//       ranked_choice: 'Type their own response - no voting method effect',
//       approval: 'Type their own response - no voting method effect'
//     },
    
//     // Detailed voting specifications (for programmatic use)
//     votingSpecs: {
//       plurality: {
//         description: 'Single selection voting - pick ONE option only',
//         howVotersAnswer: 'Type their own response',
//         exampleAction: '"I want better healthcare..."',
//         validationRule: 'None - text is text',
//         storageFormat: 'Text string',
//         resultCalculation: 'Text responses (may be categorized)'
//       },
//       ranked_choice: {
//         description: 'Preference ranking voting - rank ALL options in order',
//         howVotersAnswer: 'Type their own response',
//         exampleAction: '"I want better healthcare..."',
//         validationRule: 'None - text is text',
//         storageFormat: 'Text string',
//         resultCalculation: 'Text responses (may be ranked if similar)'
//       },
//       approval: {
//         description: 'Multiple approval voting - pick ALL options you approve',
//         howVotersAnswer: 'Type their own response',
//         exampleAction: '"I want better healthcare..."',
//         validationRule: 'None - text is text',
//         storageFormat: 'Text string',
//         resultCalculation: 'Text responses (individual evaluation)'
//       }
//     },
    
//     example: {
//       question: 'What is your top concern for the university?',
//       answers: []
//     }
//   },

//   image_based: {
//     name: 'Image-Based Questions',
//     icon: '🖼️',
//     description: 'Visual choice questions where users select from image options',
    
//     // Voting method support
//     supportedVotingTypes: ['plurality', 'ranked_choice', 'approval'],
    
//     // Answer requirements
//     requiresAnswers: true,
//     requiresImages: true,
//     minAnswers: 2,
//     maxAnswers: 50,
    
//     // Voting behavior by type (React-safe strings)
//     votingBehavior: {
//       plurality: 'Click 1 image only - single selection voting',
//       ranked_choice: 'Drag images to rank order - preference ranking voting',
//       approval: 'Click multiple images you approve - multiple approval voting'
//     },
    
//     // Detailed voting specifications (for programmatic use)
//     votingSpecs: {
//       plurality: {
//         description: 'Single selection voting - pick ONE option only',
//         howVotersAnswer: 'Click 1 image only',
//         exampleAction: 'Click: Logo A',
//         validationRule: 'Exactly 1 selection per question',
//         storageFormat: 'Simple option_id',
//         resultCalculation: 'Count votes for each image'
//       },
//       ranked_choice: {
//         description: 'Preference ranking voting - rank ALL options in order',
//         howVotersAnswer: 'Drag images to rank order',
//         exampleAction: 'Rank: 1st=Logo A, 2nd=Logo B, 3rd=Logo C',
//         validationRule: 'All images must be ranked',
//         storageFormat: 'Array of ranked option_ids',
//         resultCalculation: 'Elimination rounds with transfers'
//       },
//       approval: {
//         description: 'Multiple approval voting - pick ALL options you approve',
//         howVotersAnswer: 'Click multiple images they like',
//         exampleAction: 'Approve: Logo A ✓, Logo C ✓',
//         validationRule: 'At least 1 selection per question',
//         storageFormat: 'Array of approved option_ids',
//         resultCalculation: 'Count approvals for each image'
//       }
//     },
    
//     example: {
//       question: 'Which university logo design do you prefer?',
//       answers: ['Logo Design A', 'Logo Design B', 'Logo Design C']
//     }
//   },

//   comparison: {
//     name: 'Comparison Questions',
//     icon: '⚖️',
//     description: 'Side-by-side comparison questions for evaluating multiple items',
    
//     // Voting method support
//     supportedVotingTypes: ['plurality', 'ranked_choice', 'approval'],
    
//     // Answer requirements
//     requiresAnswers: true,
//     minAnswers: 2,
//     maxAnswers: 20,
    
//     // Voting behavior by type (React-safe strings)
//     votingBehavior: {
//       plurality: 'Pick winner of each pair - single selection voting',
//       ranked_choice: 'Rank all items across pairs - preference ranking voting',
//       approval: 'Approve multiple items you like - multiple approval voting'
//     },
    
//     // Detailed voting specifications (for programmatic use)
//     votingSpecs: {
//       plurality: {
//         description: 'Single selection voting - pick ONE option only',
//         howVotersAnswer: 'Pick winner of each pair',
//         exampleAction: 'iPhone vs Samsung: Pick "iPhone"',
//         validationRule: 'Exactly 1 selection per question',
//         storageFormat: 'Simple option_id',
//         resultCalculation: 'Count votes for each option'
//       },
//       ranked_choice: {
//         description: 'Preference ranking voting - rank ALL options in order',
//         howVotersAnswer: 'Rank all items across pairs',
//         exampleAction: 'Rank: 1st=iPhone, 2nd=Google, 3rd=Samsung',
//         validationRule: 'All options must be ranked',
//         storageFormat: 'Array of ranked option_ids',
//         resultCalculation: 'Elimination rounds with transfers'
//       },
//       approval: {
//         description: 'Multiple approval voting - pick ALL options you approve',
//         howVotersAnswer: 'Approve multiple items they like',
//         exampleAction: 'Approve: iPhone ✓, Samsung ✓, Google ✗',
//         validationRule: 'At least 1 selection per question',
//         storageFormat: 'Array of approved option_ids',
//         resultCalculation: 'Count approvals for each option'
//       }
//     },
    
//     example: {
//       question: 'Compare these mobile phone options',
//       answers: ['iPhone', 'Samsung Galaxy', 'Google Pixel']
//     }
//   }
// };

// // Technical specifications summary
// export const technicalSpecs = {
//   totalQuestionTypes: 4,
//   questionsRequiringPreAnswers: 3, // MCQ, Image, Comparison
//   questionsNotRequiringPreAnswers: 1, // Text only
  
//   supportMatrix: {
//     plurality: {
//       supportedTypes: ['multiple_choice', 'open_answer', 'image_based', 'comparison'],
//       totalSupported: 4
//     },
//     ranked_choice: {
//       supportedTypes: ['multiple_choice', 'open_answer', 'image_based', 'comparison'],
//       totalSupported: 4
//     },
//     approval: {
//       supportedTypes: ['multiple_choice', 'open_answer', 'image_based', 'comparison'],
//       totalSupported: 4
//     }
//   }
// };

// // Real-world example configuration
// export const exampleElection = {
//   title: "University President Election",
//   questions: [
//     {
//       id: 'q1',
//       type: 'multiple_choice',
//       question: 'Who should be university president?',
//       answers: ['Alice Johnson', 'Bob Smith', 'Carol Williams'],
//       exampleVoting: {
//         plurality: 'Selects: "Alice"',
//         ranked_choice: 'Ranks: 1st=Alice, 2nd=Carol, 3rd=Bob',
//         approval: 'Approves: Alice ✓, Carol ✓'
//       }
//     },
//     {
//       id: 'q2',
//       type: 'open_answer',
//       question: 'What is your top concern for the university?',
//       exampleVoting: {
//         plurality: 'Types: "Better dining halls"',
//         ranked_choice: 'Types: "Better dining halls"',
//         approval: 'Types: "Better dining halls"'
//       }
//     },
//     {
//       id: 'q3',
//       type: 'image_based',
//       question: 'Which university logo design do you prefer?',
//       answers: ['Logo Design #1', 'Logo Design #2', 'Logo Design #3'],
//       exampleVoting: {
//         plurality: 'Clicks: Logo #2',
//         ranked_choice: 'Ranks: 1st=Logo #2, 2nd=Logo #1, 3rd=Logo #3',
//         approval: 'Clicks: Logo #1 ✓, Logo #2 ✓'
//       }
//     },
//     {
//       id: 'q4',
//       type: 'comparison',
//       question: 'Compare these mobile phone options',
//       answers: ['iPhone', 'Samsung Galaxy', 'Google Pixel'],
//       exampleVoting: {
//         plurality: 'Picks winners in each pair',
//         ranked_choice: 'Ranks all: 1st=iPhone, 2nd=Google, 3rd=Samsung',
//         approval: 'Approves: iPhone ✓, Google ✓'
//       }
//     }
//   ]
// };

// // Question Helper Functions (Updated)
// export const questionHelpers = {
//   // Get voting behavior for specific question type and voting method (React-safe string)
//   getVotingBehavior: (questionType, votingType) => {
//     const config = questionTypeConfigs[questionType];
//     if (!config || !config.votingBehavior || !config.votingBehavior[votingType]) {
//       return null;
//     }
//     return config.votingBehavior[votingType];
//   },

//   // Get detailed voting specifications for programmatic use
//   getVotingSpecs: (questionType, votingType) => {
//     const config = questionTypeConfigs[questionType];
//     if (!config || !config.votingSpecs || !config.votingSpecs[votingType]) {
//       return null;
//     }
//     return config.votingSpecs[votingType];
//   },

//   // Check if question type supports specific voting method
//   supportsVotingMethod: (questionType, votingType) => {
//     const config = questionTypeConfigs[questionType];
//     return config && config.supportedVotingTypes.includes(votingType);
//   },

//   // Get all supported voting methods for question type
//   getSupportedVotingMethods: (questionType) => {
//     const config = questionTypeConfigs[questionType];
//     return config ? config.supportedVotingTypes : [];
//   },

//   // Generate comparison table data
//   generateComparisonTable: () => {
//     const table = {
//       headers: ['Question Type', 'Plurality Voting', 'Ranked Choice Voting', 'Approval Voting'],
//       rows: []
//     };
// /*eslint-disable*/
//     Object.entries(questionTypeConfigs).forEach(([key, config]) => {
//       const row = {
//         questionType: config.name,
//         plurality: config.votingBehavior.plurality,
//         ranked_choice: config.votingBehavior.ranked_choice,
//         approval: config.votingBehavior.approval,
//         // Include detailed specs for programmatic access
//         pluralitySpecs: config.votingSpecs.plurality,
//         rankedChoiceSpecs: config.votingSpecs.ranked_choice,
//         approvalSpecs: config.votingSpecs.approval
//       };
//       table.rows.push(row);
//     });

//     return table;
//   },

//   // Validate question based on voting method
//   validateQuestionForVotingMethod: (question, votingMethod) => {
//     const config = questionTypeConfigs[question.questionType];
    
//     if (!config) {
//       return { isValid: false, error: 'Invalid question type' };
//     }

//     if (!config.supportedVotingTypes.includes(votingMethod)) {
//       return { 
//         isValid: false, 
//         error: `${config.name} does not support ${votingMethod} voting` 
//       };
//     }

//     // Additional validation based on voting method
//     const specs = config.votingSpecs[votingMethod];
//     if (!specs) {
//       return { 
//         isValid: false, 
//         error: `No specifications defined for ${votingMethod} with ${config.name}` 
//       };
//     }

//     return { isValid: true };
//   }
// };

// export default { 
//   questionTypeConfigs, 
//   technicalSpecs, 
//   exampleElection, 
//   questionHelpers 
// };
// // Question Type Configurations
// export const questionTypeConfigs = {
//   multiple_choice: {
//     name: 'Multiple Choice',
//     description: 'Traditional multiple choice with single or multiple selection',
//     icon: '🔘',
//     requiresAnswers: true,
//     minAnswers: 2,
//     maxAnswers: 10,
//     votingBehavior: {
//       plurality: 'Choose one option',
//       ranked_choice: 'Rank all or some options in order of preference',
//       approval: 'Select all options you approve of'
//     },
//     example: {
//       question: 'Which candidate do you prefer?',
//       answers: ['Option A', 'Option B', 'Option C']
//     }
//   },
  
//   yes_no: {
//     name: 'Yes/No',
//     description: 'Simple binary choice question',
//     icon: '✅',
//     requiresAnswers: true,
//     minAnswers: 2,
//     maxAnswers: 2,
//     votingBehavior: {
//       plurality: 'Choose Yes or No',
//       ranked_choice: 'Rank Yes vs No (limited usefulness)',
//       approval: 'Approve Yes, No, or both'
//     },
//     example: {
//       question: 'Do you support this proposal?',
//       answers: ['Yes', 'No']
//     }
//   },
  
//   rating_scale: {
//     name: 'Rating Scale',
//     description: 'Rate options on a numerical scale',
//     icon: '⭐',
//     requiresAnswers: true,
//     minAnswers: 3,
//     maxAnswers: 10,
//     votingBehavior: {
//       plurality: 'Choose your preferred rating level',
//       ranked_choice: 'Rank rating levels in preference order',
//       approval: 'Select all acceptable rating levels'
//     },
//     example: {
//       question: 'Rate this proposal from 1-5',
//       answers: ['1 - Strongly Disagree', '2 - Disagree', '3 - Neutral', '4 - Agree', '5 - Strongly Agree']
//     }
//   },
  
//   ranking: {
//     name: 'Ranking',
//     description: 'Rank items in order of preference',
//     icon: '📊',
//     requiresAnswers: true,
//     minAnswers: 2,
//     maxAnswers: 15,
//     votingBehavior: {
//       plurality: 'Choose your top preference from the list',
//       ranked_choice: 'Rank all or some items in preference order',
//       approval: 'Select all items you find acceptable'
//     },
//     example: {
//       question: 'Rank these priorities in order of importance',
//       answers: ['Economic Growth', 'Environmental Protection', 'Education', 'Healthcare']
//     }
//   },
  
//   image_based: {
//     name: 'Image Choice',
//     description: 'Choose between visual options',
//     icon: '🖼️',
//     requiresAnswers: true,
//     minAnswers: 2,
//     maxAnswers: 8,
//     votingBehavior: {
//       plurality: 'Choose one image option',
//       ranked_choice: 'Rank image options in preference order',
//       approval: 'Select all image options you approve of'
//     },
//     example: {
//       question: 'Which design do you prefer?',
//       answers: ['Design A', 'Design B', 'Design C']
//     }
//   },
  
//   comparison: {
//     name: 'Comparison',
//     description: 'Compare two or more items side by side',
//     icon: '⚖️',
//     requiresAnswers: true,
//     minAnswers: 2,
//     maxAnswers: 5,
//     votingBehavior: {
//       plurality: 'Choose your preferred option from the comparison',
//       ranked_choice: 'Rank compared items in preference order',
//       approval: 'Select all compared items you find acceptable'
//     },
//     example: {
//       question: 'Compare these budget proposals',
//       answers: ['Proposal A: Focus on Infrastructure', 'Proposal B: Focus on Social Programs']
//     }
//   },
  
//   open_answer: {
//     name: 'Open Text',
//     description: 'Free-form text response',
//     icon: '📝',
//     requiresAnswers: false,
//     minAnswers: 0,
//     maxAnswers: 0,
//     votingBehavior: {
//       plurality: 'Provide written response (responses may be categorized for voting)',
//       ranked_choice: 'Provide written response (responses may be ranked if multiple similar)',
//       approval: 'Provide written response (individual evaluation of responses)'
//     },
//     example: {
//       question: 'What is your opinion on the new policy?',
//       answers: []
//     }
//   }
// };

// // Question Helper Functions
// export const questionHelpers = {
//   // Get default question template for a given type and voting method
//   /*eslint-disable*/
//   getDefaultQuestion: (questionType, votingType) => {
//     const config = questionTypeConfigs[questionType];
//     if (!config) return null;
    
//     let defaultAnswers = [];
    
//     if (config.requiresAnswers) {
//       if (questionType === 'yes_no') {
//         defaultAnswers = [
//           { id: 'yes', text: 'Yes', imageUrl: null },
//           { id: 'no', text: 'No', imageUrl: null }
//         ];
//       } else if (questionType === 'rating_scale') {
//         defaultAnswers = [
//           { id: 'rating1', text: '1 - Strongly Disagree', imageUrl: null },
//           { id: 'rating2', text: '2 - Disagree', imageUrl: null },
//           { id: 'rating3', text: '3 - Neutral', imageUrl: null },
//           { id: 'rating4', text: '4 - Agree', imageUrl: null },
//           { id: 'rating5', text: '5 - Strongly Agree', imageUrl: null }
//         ];
//       } else {
//         // Default for multiple_choice, ranking, image_based, comparison
//         for (let i = 0; i < config.minAnswers; i++) {
//           defaultAnswers.push({
//             id: `option_${i + 1}`,
//             text: `Option ${i + 1}`,
//             imageUrl: null
//           });
//         }
//       }
//     }
    
//     return {
//       questionText: config.example?.question || '',
//       questionType: questionType,
//       questionImageUrl: null,
//       answers: defaultAnswers,
//       isRequired: true,
//       allowOtherOption: questionType !== 'yes_no' && questionType !== 'open_answer',
//       characterLimit: questionType === 'open_answer' ? 5000 : null
//     };
//   },
  
//   // Get voting behavior description for a question type and voting method
//   getVotingBehavior: (questionType, votingType) => {
//     const config = questionTypeConfigs[questionType];
//     if (!config || !config.votingBehavior) return 'Standard voting behavior';
    
//     return config.votingBehavior[votingType] || 'Standard voting behavior';
//   },
  
//   // Validate question configuration
//   validateQuestion: (question) => {
//     const config = questionTypeConfigs[question.questionType];
//     if (!config) {
//       return { isValid: false, error: 'Invalid question type' };
//     }
    
//     if (!question.questionText || question.questionText.trim() === '') {
//       return { isValid: false, error: 'Question text is required' };
//     }
    
//     if (config.requiresAnswers) {
//       if (!question.answers || question.answers.length < config.minAnswers) {
//         return { 
//           isValid: false, 
//           error: `At least ${config.minAnswers} answers required for ${config.name}` 
//         };
//       }
      
//       if (question.answers.length > config.maxAnswers) {
//         return { 
//           isValid: false, 
//           error: `Maximum ${config.maxAnswers} answers allowed for ${config.name}` 
//         };
//       }
      
//       // Check if all answers have text
//       const emptyAnswers = question.answers.filter(answer => !answer.text || answer.text.trim() === '');
//       if (emptyAnswers.length > 0) {
//         return { isValid: false, error: 'All answer options must have text' };
//       }
      
//       // Special validation for image-based questions
//       if (question.questionType === 'image_based') {
//         const answersWithoutImages = question.answers.filter(answer => !answer.imageUrl);
//         if (answersWithoutImages.length > 0) {
//           return { isValid: false, error: 'All options must have images for image-based questions' };
//         }
//       }
//     }
    
//     // Validate character limit for open answers
//     if (question.questionType === 'open_answer') {
//       if (!question.characterLimit || question.characterLimit < 1 || question.characterLimit > 5000) {
//         return { isValid: false, error: 'Character limit must be between 1 and 5000' };
//       }
//     }
    
//     return { isValid: true };
//   },
  
//   // Get question statistics
//   getQuestionStats: (questions) => {
//     const stats = {
//       total: questions.length,
//       required: 0,
//       optional: 0,
//       withImages: 0,
//       byType: {}
//     };
    
//     Object.keys(questionTypeConfigs).forEach(type => {
//       stats.byType[type] = 0;
//     });
    
//     questions.forEach(question => {
//       if (question.isRequired) stats.required++;
//       else stats.optional++;
      
//       if (question.questionImageUrl) stats.withImages++;
//       /*eslint-disable*/
//       if (stats.byType.hasOwnProperty(question.questionType)) {
//         stats.byType[question.questionType]++;
//       }
//     });
    
//     return stats;
//   },
  
//   // Generate unique question ID
//   generateQuestionId: () => {
//     return 'q_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
//   },
  
//   // Generate unique answer ID
//   generateAnswerId: () => {
//     return 'a_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
//   },
  
//   // Check if question type supports images
//   supportsImages: (questionType) => {
//     return ['image_based', 'comparison'].includes(questionType);
//   },
  
//   // Check if question type requires images
//   requiresImages: (questionType) => {
//     return questionType === 'image_based';
//   },
  
//   // Get recommended question types for voting method
//   getRecommendedTypes: (votingType) => {
//     const recommendations = {
//       plurality: ['multiple_choice', 'yes_no', 'image_based', 'comparison'],
//       ranked_choice: ['multiple_choice', 'ranking', 'image_based', 'comparison'],
//       approval: ['multiple_choice', 'rating_scale', 'image_based', 'comparison']
//     };
    
//     return recommendations[votingType] || Object.keys(questionTypeConfigs);
//   }
// };

// // Export question service integration
// export class QuestionAPI {
//   constructor(questionService) {
//     this.service = questionService;
//   }
  
//   // Create questions with validation
//   async createQuestions(electionId, questions) {
//     // Validate all questions
//     const validationErrors = [];
//     questions.forEach((question, index) => {
//       const validation = questionHelpers.validateQuestion(question);
//       if (!validation.isValid) {
//         validationErrors.push(`Question ${index + 1}: ${validation.error}`);
//       }
//     });
    
//     if (validationErrors.length > 0) {
//       throw new Error('Validation failed:\n' + validationErrors.join('\n'));
//     }
    
//     // Create questions via service
//     return await this.service.createQuestions({
//       election_id: electionId,
//       questions: questions
//     });
//   }
  
//   // Get questions with enriched metadata
//   async getQuestions(electionId) {
//     const response = await this.service.getQuestionsByElection(electionId);
    
//     // Enrich questions with metadata
//     if (response.data && response.data.questions) {
//       response.data.questions = response.data.questions.map(question => ({
//         ...question,
//         config: questionTypeConfigs[question.questionType],
//         stats: this.getQuestionAnswerStats(question)
//       }));
//     }
    
//     return response;
//   }
  
//   // Get answer statistics for a question
//   getQuestionAnswerStats(question) {
//     if (!question.answers) return null;
    
//     return {
//       totalAnswers: question.answers.length,
//       answersWithImages: question.answers.filter(a => a.imageUrl).length,
//       answersWithoutText: question.answers.filter(a => !a.text || a.text.trim() === '').length,
//       isValid: questionHelpers.validateQuestion(question).isValid
//     };
//   }
// }

// export default { questionTypeConfigs, questionHelpers, QuestionAPI };