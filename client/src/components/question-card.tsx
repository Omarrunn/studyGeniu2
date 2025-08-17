import { useState, useEffect } from "react";
import { type Question } from "@shared/schema";

interface QuestionCardProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  topicLabel: string;
  onNext: () => void;
  onPrevious: () => void;
}

export default function QuestionCard({
  question,
  currentIndex,
  totalQuestions,
  topicLabel,
  onNext,
  onPrevious,
}: QuestionCardProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const isMultipleChoice = question.correct.length > 1;
  const progressPercentage = ((currentIndex + 1) / totalQuestions) * 100;

  // Reset state when question changes
  useEffect(() => {
    setSelectedAnswers([]);
    setIsSubmitted(false);
    setShowExplanation(false);
  }, [question.qid]);

  const handleAnswerSelect = (optionKey: string) => {
    if (isSubmitted) return;

    let newSelectedAnswers: string[];

    if (isMultipleChoice) {
      // Multiple choice: toggle selection
      if (selectedAnswers.includes(optionKey)) {
        newSelectedAnswers = selectedAnswers.filter(key => key !== optionKey);
      } else {
        newSelectedAnswers = [...selectedAnswers, optionKey];
      }
    } else {
      // Single choice: replace selection
      newSelectedAnswers = [optionKey];
    }

    setSelectedAnswers(newSelectedAnswers);

    // Auto-submit logic
    if (!isMultipleChoice) {
      // Single choice: submit immediately
      setTimeout(() => {
        setIsSubmitted(true);
        setShowExplanation(true);
      }, 300);
    } else if (newSelectedAnswers.length === question.correct.length) {
      // Multiple choice: submit when exact number of required answers selected
      setTimeout(() => {
        setIsSubmitted(true);
        setShowExplanation(true);
      }, 500); // Slightly longer delay for multiple choice
    }
  };

  const getOptionStyle = (optionKey: string) => {
    const isSelected = selectedAnswers.includes(optionKey);
    const isCorrect = question.correct.includes(optionKey);

    if (!isSubmitted) {
      // Before submission
      if (isSelected) {
        return "border-primary bg-primary/5";
      }
      return "border-gray-200 hover:border-primary/30 hover:bg-gray-50";
    } else {
      // After submission
      if (isCorrect) {
        return "border-success bg-success/5";
      }
      if (isSelected && !isCorrect) {
        return "border-error bg-error/5";
      }
      return "border-gray-200";
    }
  };

  const getOptionCircleStyle = (optionKey: string) => {
    const isSelected = selectedAnswers.includes(optionKey);
    const isCorrect = question.correct.includes(optionKey);

    if (!isSubmitted) {
      // Before submission
      if (isSelected) {
        return "border-primary bg-primary text-white";
      }
      return "border-gray-300 bg-white";
    } else {
      // After submission
      if (isCorrect) {
        return "border-success bg-success text-white";
      }
      if (isSelected && !isCorrect) {
        return "border-error bg-error text-white";
      }
      return "border-gray-300 bg-white";
    }
  };

  const getOptionIcon = (optionKey: string) => {
    const isCorrect = question.correct.includes(optionKey);
    const isSelected = selectedAnswers.includes(optionKey);

    if (isSubmitted && isCorrect) {
      return <i className="fas fa-check text-xs"></i>;
    }
    if (isSubmitted && isSelected && !isCorrect) {
      return <i className="fas fa-times text-xs"></i>;
    }
    return optionKey;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      {/* Question Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
            {topicLabel.replace("MCQ : ", "")}
          </span>
          <span className="text-sm text-gray-500">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-6 h-6 bg-accent/10 text-accent rounded-full flex items-center justify-center text-xs font-medium">
            {isMultipleChoice ? question.correct.length : "1"}
          </span>
          <span className="text-sm font-medium text-gray-700">
            {isMultipleChoice 
              ? `Select ${question.correct.length} answers` 
              : "Select 1 answer"
            }
          </span>
        </div>
      </div>

      {/* Question Progress */}
      <div className="mb-8">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Question Content */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 leading-relaxed mb-4">
          {question.question_text}
        </h2>
        
        {/* Selection Progress for Multiple Choice */}
        {isMultipleChoice && !isSubmitted && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">
                Selected: {selectedAnswers.length} of {question.correct.length} required
              </span>
              {selectedAnswers.length === question.correct.length ? (
                <span className="text-sm text-green-600 font-medium">
                  <i className="fas fa-check mr-1"></i>
                  Ready to submit
                </span>
              ) : (
                <span className="text-sm text-blue-600">
                  Select {question.correct.length - selectedAnswers.length} more
                </span>
              )}
            </div>
            <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(selectedAnswers.length / question.correct.length) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Answer Options */}
        <div className="space-y-3">
          {Object.entries(question.options).map(([optionKey, optionValue]) => (
            <label key={optionKey} className="block cursor-pointer">
              <div
                onClick={() => handleAnswerSelect(optionKey)}
                className={`p-4 border-2 rounded-lg transition-all ${getOptionStyle(optionKey)}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 border-2 ${isMultipleChoice ? 'rounded-md' : 'rounded-full'} flex items-center justify-center text-sm font-medium ${getOptionCircleStyle(optionKey)}`}>
                    {getOptionIcon(optionKey)}
                  </div>
                  <span className="text-gray-800 flex-1">{optionValue}</span>
                </div>
              </div>
            </label>
          ))}
        </div>

        {/* Manual Submit Button for Multiple Choice */}
        {isMultipleChoice && !isSubmitted && selectedAnswers.length > 0 && (
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSubmitted(true);
                setShowExplanation(true);
              }}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Submit {selectedAnswers.length} Answer{selectedAnswers.length !== 1 ? 's' : ''}
            </button>
            <p className="text-sm text-gray-500 mt-2">
              Or select {question.correct.length} answers for auto-submit
            </p>
          </div>
        )}
      </div>

      {/* Explanation */}
      {showExplanation && (
        <div className="border-t pt-6">
          <div className="flex items-start space-x-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
              <i className="fas fa-info text-blue-600"></i>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Explanation</h3>
              <p className="text-gray-700 leading-relaxed">{question.explanation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="pt-6 border-t mb-20 md:mb-4">
        {/* Mobile Layout */}
        <div className="md:hidden space-y-4">
          <div className="flex justify-center space-x-4">
            <button className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors border border-gray-300 rounded-lg">
              <i className="far fa-bookmark mr-2"></i>
              Save
            </button>
            <button className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors border border-gray-300 rounded-lg">
              <i className="far fa-flag mr-2"></i>
              Flag
            </button>
          </div>
          <div className="flex justify-between items-center">
            <button
              onClick={onPrevious}
              disabled={currentIndex === 0}
              className="flex items-center space-x-2 px-6 py-3 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 rounded-lg"
            >
              <i className="fas fa-chevron-left"></i>
              <span>Previous</span>
            </button>
            
            <button
              onClick={onNext}
              disabled={currentIndex === totalQuestions - 1}
              className="flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Next Question</span>
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex justify-between items-center">
          <button
            onClick={onPrevious}
            disabled={currentIndex === 0}
            className="flex items-center space-x-2 px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fas fa-chevron-left"></i>
            <span>Previous</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors">
              <i className="far fa-bookmark"></i>
            </button>
            <button className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors">
              <i className="far fa-flag"></i>
            </button>
          </div>
          
          <button
            onClick={onNext}
            disabled={currentIndex === totalQuestions - 1}
            className="flex items-center space-x-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Next Question</span>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
