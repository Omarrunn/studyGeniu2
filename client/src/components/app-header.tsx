import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

interface SearchResult {
  type: "question" | "secret";
  id: number;
  title: string;
  content: string;
  topicLabel?: string;
}

export default function AppHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  const { data: searchResults = [], isLoading } = useQuery({
    queryKey: ["/api/search/questions", searchQuery],
    enabled: searchQuery.length > 2,
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowResults(query.length > 2);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <i className="fas fa-stethoscope text-primary text-2xl mr-3"></i>
              <div>
                <h1 className="text-xl font-bold text-gray-900">MedQuiz Pro</h1>
                <p className="text-xs text-gray-500">Designed by: Dr. Omar Al-humaidy</p>
              </div>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8 relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Search questions, topics, or secrets..."
                value={searchQuery}
                onChange={handleSearch}
                onBlur={() => setTimeout(() => setShowResults(false), 200)}
                onFocus={() => searchQuery.length > 2 && setShowResults(true)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              
              {/* Search Results Dropdown */}
              {showResults && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                  {isLoading ? (
                    <div className="p-4 text-center text-gray-500">Searching...</div>
                  ) : searchResults.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {searchResults.slice(0, 10).map((result: any, index: number) => (
                        <div key={index} className="p-3 hover:bg-gray-50 cursor-pointer">
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              <i className="fas fa-question text-primary text-sm"></i>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {result.topicLabel}
                              </p>
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                {result.question_text?.substring(0, 100)}...
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">No results found</div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
              <i className="fas fa-bell text-lg"></i>
            </button>
            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-medium">
              <span>JS</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
