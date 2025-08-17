import { type Question, type Topic } from "@shared/schema";

// MCQ utility functions and constants
export const MCQ_CONSTANTS = {
  AUTO_SUBMIT_DELAY: 300, // milliseconds
  SEARCH_MIN_LENGTH: 3,
  PROGRESS_STORAGE_KEY: "medquiz_progress",
} as const;

// Question type helpers
export const isMultipleChoiceQuestion = (question: Question): boolean => {
  return question.correct.length > 1;
};

export const isSingleChoiceQuestion = (question: Question): boolean => {
  return question.correct.length === 1;
};

// Answer validation
export const validateAnswers = (
  selectedAnswers: string[],
  correctAnswers: string[]
): {
  isCorrect: boolean;
  correctCount: number;
  totalRequired: number;
} => {
  const correctCount = selectedAnswers.filter(answer => 
    correctAnswers.includes(answer)
  ).length;
  
  const isCorrect = correctCount === correctAnswers.length && 
                   selectedAnswers.length === correctAnswers.length;
  
  return {
    isCorrect,
    correctCount,
    totalRequired: correctAnswers.length,
  };
};

// Progress calculation
export const calculateTopicProgress = (
  completedQuestions: number[],
  totalQuestions: number
): number => {
  if (totalQuestions === 0) return 0;
  return Math.round((completedQuestions.length / totalQuestions) * 100);
};

export const calculateOverallProgress = (topics: Topic[]): {
  totalQuestions: number;
  completedQuestions: number;
  accuracy: number;
  masteredTopics: number;
} => {
  const totalQuestions = topics.reduce((sum, topic) => sum + topic.questions.length, 0);
  
  // In a real implementation, this would come from user progress data
  // For now, using mock calculations based on the design reference
  const completedQuestions = Math.floor(totalQuestions * 0.26);
  const accuracy = 87;
  const masteredTopics = Math.floor(topics.length * 0.6);
  
  return {
    totalQuestions,
    completedQuestions,
    accuracy,
    masteredTopics,
  };
};

// Local storage helpers for progress tracking
export const saveProgress = (topicLabel: string, questionId: number, isCorrect: boolean): void => {
  const stored = localStorage.getItem(MCQ_CONSTANTS.PROGRESS_STORAGE_KEY);
  const progress = stored ? JSON.parse(stored) : {};
  
  if (!progress[topicLabel]) {
    progress[topicLabel] = {
      completed: [],
      correct: [],
    };
  }
  
  if (!progress[topicLabel].completed.includes(questionId)) {
    progress[topicLabel].completed.push(questionId);
  }
  
  if (isCorrect && !progress[topicLabel].correct.includes(questionId)) {
    progress[topicLabel].correct.push(questionId);
  }
  
  localStorage.setItem(MCQ_CONSTANTS.PROGRESS_STORAGE_KEY, JSON.stringify(progress));
};

export const getProgress = (topicLabel: string): { completed: number[]; correct: number[] } => {
  const stored = localStorage.getItem(MCQ_CONSTANTS.PROGRESS_STORAGE_KEY);
  const progress = stored ? JSON.parse(stored) : {};
  
  return progress[topicLabel] || { completed: [], correct: [] };
};

// Question filtering and search
export const filterQuestionsByDifficulty = (questions: Question[], difficulty: "easy" | "medium" | "hard"): Question[] => {
  // This could be enhanced with actual difficulty scoring based on answer statistics
  // For now, returning all questions as the JSON doesn't include difficulty levels
  return questions;
};

export const searchQuestionsInTopic = (topic: Topic, query: string): Question[] => {
  const lowerQuery = query.toLowerCase();
  
  return topic.questions.filter(question =>
    question.question_text.toLowerCase().includes(lowerQuery) ||
    question.explanation.toLowerCase().includes(lowerQuery) ||
    Object.values(question.options).some(option =>
      option.toLowerCase().includes(lowerQuery)
    )
  );
};

// Topic categorization helpers
export const getTopicCategory = (label: string): string => {
  const lowerLabel = label.toLowerCase();
  
  if (lowerLabel.includes("breast")) return "Oncology";
  if (lowerLabel.includes("neuro")) return "Neurosurgery";
  if (lowerLabel.includes("cardiac") || lowerLabel.includes("heart")) return "Cardiothoracic";
  if (lowerLabel.includes("trauma")) return "Trauma Surgery";
  if (lowerLabel.includes("pediatric")) return "Pediatric Surgery";
  if (lowerLabel.includes("vascular")) return "Vascular Surgery";
  
  return "General Surgery";
};

export const getTopicIcon = (label: string): string => {
  const lowerLabel = label.toLowerCase();
  
  if (lowerLabel.includes("breast")) return "fas fa-heartbeat";
  if (lowerLabel.includes("neuro")) return "fas fa-brain";
  if (lowerLabel.includes("cardiac") || lowerLabel.includes("heart")) return "fas fa-lungs";
  if (lowerLabel.includes("trauma")) return "fas fa-ambulance";
  if (lowerLabel.includes("pediatric")) return "fas fa-baby";
  if (lowerLabel.includes("vascular")) return "fas fa-heart-pulse";
  
  return "fas fa-stethoscope";
};

// Statistics helpers
export const calculateAccuracy = (correctAnswers: number, totalAnswers: number): number => {
  if (totalAnswers === 0) return 0;
  return Math.round((correctAnswers / totalAnswers) * 100);
};

export const getPerformanceLevel = (accuracy: number): "excellent" | "good" | "fair" | "needs-improvement" => {
  if (accuracy >= 90) return "excellent";
  if (accuracy >= 80) return "good";
  if (accuracy >= 70) return "fair";
  return "needs-improvement";
};

// Time tracking helpers
export const formatStudyTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

export const trackQuestionTime = (questionId: number, startTime: number): void => {
  const timeSpent = Date.now() - startTime;
  const stored = localStorage.getItem("medquiz_time_tracking");
  const timeData = stored ? JSON.parse(stored) : {};
  
  timeData[questionId] = (timeData[questionId] || 0) + timeSpent;
  localStorage.setItem("medquiz_time_tracking", JSON.stringify(timeData));
};
