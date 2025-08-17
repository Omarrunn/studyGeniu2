import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { type Topic } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import TopicSidebar from "./topic-sidebar";
import QuestionCard from "./question-card";

export default function McqSection() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { toast } = useToast();

  const { data: topics = [] } = useQuery<Topic[]>({
    queryKey: ["/api/topics"],
  });

  const { data: currentTopic } = useQuery<Topic>({
    queryKey: ["/api/topics", selectedTopic],
    enabled: !!selectedTopic,
  });

  const resetProgressMutation = useMutation({
    mutationFn: () => apiRequest("DELETE", "/api/progress"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress"] });
      toast({
        title: "Progress Reset",
        description: "All question progress has been reset successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to reset progress. Please try again.",
        variant: "destructive",
      });
    },
  });

  const totalQuestions = topics.reduce((sum, topic) => sum + topic.questions.length, 0);
  const completedQuestions = Math.floor(totalQuestions * 0.26); // Mock data
  const accuracy = 87; // Mock data
  const masteredTopics = Math.floor(topics.length * 0.6); // Mock data

  const handleTopicSelect = (topicLabel: string) => {
    setSelectedTopic(topicLabel);
    setCurrentQuestionIndex(0);
    setTimeout(scrollToTop, 100); // Scroll to top when selecting new topic
  };

  const scrollToTop = () => {
    // Smooth scroll to top for mobile users
    if (window.innerWidth < 768) { // Mobile breakpoint
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextQuestion = () => {
    if (currentTopic && currentQuestionIndex < currentTopic.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeout(scrollToTop, 100); // Small delay to ensure state update
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setTimeout(scrollToTop, 100); // Small delay to ensure state update
    }
  };

  const handleResetProgress = () => {
    if (window.confirm("Are you sure you want to reset all your progress? This action cannot be undone.")) {
      resetProgressMutation.mutate();
    }
  };

  return (
    <div className="space-y-6">
      {/* Reset Button */}
      <div className="flex justify-end">
        <button
          onClick={handleResetProgress}
          disabled={resetProgressMutation.isPending}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors flex items-center space-x-2"
        >
          {resetProgressMutation.isPending ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              <span>Resetting...</span>
            </>
          ) : (
            <>
              <i className="fas fa-redo"></i>
              <span>Reset All Progress</span>
            </>
          )}
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-primary/10 rounded-lg">
              <i className="fas fa-question text-primary"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Questions</p>
              <p className="text-2xl font-bold text-gray-900">{totalQuestions.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-success/10 rounded-lg">
              <i className="fas fa-check text-success"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedQuestions}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-accent/10 rounded-lg">
              <i className="fas fa-percentage text-accent"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Accuracy</p>
              <p className="text-2xl font-bold text-gray-900">{accuracy}%</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <i className="fas fa-trophy text-orange-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Topics Mastered</p>
              <p className="text-2xl font-bold text-gray-900">{masteredTopics}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Topics Sidebar */}
        <div className="lg:col-span-1">
          <TopicSidebar 
            selectedTopic={selectedTopic}
            onTopicSelect={handleTopicSelect}
          />
        </div>

        {/* Question Area */}
        <div className="lg:col-span-2">
          {selectedTopic && currentTopic ? (
            <QuestionCard
              question={currentTopic.questions[currentQuestionIndex]}
              currentIndex={currentQuestionIndex}
              totalQuestions={currentTopic.questions.length}
              topicLabel={currentTopic.label}
              onNext={handleNextQuestion}
              onPrevious={handlePreviousQuestion}
            />
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-arrow-left text-gray-400 text-xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Topic</h3>
                <p className="text-gray-600">
                  Choose a medical topic from the sidebar to start practicing questions.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
