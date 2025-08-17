import { useQuery } from "@tanstack/react-query";
import { type Topic } from "@shared/schema";

interface TopicSidebarProps {
  selectedTopic: string | null;
  onTopicSelect: (topic: string) => void;
}

export default function TopicSidebar({ selectedTopic, onTopicSelect }: TopicSidebarProps) {
  const { data: topics = [], isLoading } = useQuery<Topic[]>({
    queryKey: ["/api/topics"],
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Topics</h3>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-20 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getTopicIcon = (label: string) => {
    if (label.toLowerCase().includes("breast")) return "fas fa-heartbeat";
    if (label.toLowerCase().includes("neuro")) return "fas fa-brain";
    if (label.toLowerCase().includes("cardiac") || label.toLowerCase().includes("heart")) return "fas fa-lungs";
    if (label.toLowerCase().includes("trauma")) return "fas fa-ambulance";
    return "fas fa-stethoscope";
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-success";
    if (progress >= 60) return "bg-yellow-500";
    if (progress >= 40) return "bg-orange-500";
    return "bg-gray-300";
  };

  const getScoreColor = (progress: number) => {
    if (progress >= 80) return "bg-success/10 text-success";
    if (progress >= 60) return "bg-yellow-100 text-yellow-600";
    if (progress >= 40) return "bg-orange-100 text-orange-600";
    return "bg-gray-100 text-gray-500";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Topics</h3>
      <div className="space-y-2">
        {topics.map((topic) => {
          const questionCount = topic.questions.length;
          const mockProgress = Math.floor(Math.random() * 100); // In real app, calculate from user progress
          const isSelected = selectedTopic === topic.label;

          return (
            <div
              key={topic.label}
              onClick={() => onTopicSelect(topic.label)}
              className={`cursor-pointer p-3 rounded-lg transition-all border ${
                isSelected
                  ? "bg-primary/5 border-primary"
                  : "hover:bg-gray-50 border-transparent hover:border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                    <i className={`${getTopicIcon(topic.label)} text-white text-sm`}></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {topic.label.replace("MCQ : ", "")}
                    </h4>
                    <p className="text-sm text-gray-500">{questionCount} questions</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getScoreColor(mockProgress)}`}>
                    <span className="text-xs font-medium">{mockProgress}%</span>
                  </div>
                  <i className="fas fa-chevron-right text-gray-400 text-sm"></i>
                </div>
              </div>
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${getProgressColor(mockProgress)}`}
                    style={{ width: `${mockProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
