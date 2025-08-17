import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { type SurgerySecret } from "@shared/schema";

export default function SecretsSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");

  const { data: secrets = [], isLoading } = useQuery<SurgerySecret[]>({
    queryKey: ["/api/secrets"],
  });

  const { data: searchResults = [] } = useQuery({
    queryKey: ["/api/search/secrets", searchQuery],
    enabled: searchQuery.length > 2,
  });

  const filteredSecrets = searchQuery.length > 2 ? searchResults : secrets;

  const getSecretBgColor = (number: number) => {
    const colors = [
      "bg-primary/10",
      "bg-emerald-100", 
      "bg-purple-100",
      "bg-blue-100",
      "bg-orange-100",
      "bg-pink-100",
      "bg-indigo-100",
      "bg-green-100"
    ];
    return colors[number % colors.length];
  };

  const getSecretTextColor = (number: number) => {
    const colors = [
      "text-primary",
      "text-emerald-600",
      "text-purple-600", 
      "text-blue-600",
      "text-orange-600",
      "text-pink-600",
      "text-indigo-600",
      "text-green-600"
    ];
    return colors[number % colors.length];
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-96"></div>
          </div>
        </div>
        <div className="grid gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">100 Surgery Secrets</h1>
            <p className="text-gray-600">Essential surgical knowledge points for medical professionals</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">{secrets.length}</div>
            <p className="text-sm text-gray-500">Total Secrets</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search surgery secrets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {filteredSecrets.length} surgery secrets
          </div>
        </div>
      </div>

      {/* Secrets Grid */}
      <div className="grid gap-4">
        {filteredSecrets.length > 0 ? (
          filteredSecrets.map((secret) => (
            <div
              key={secret.number}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 ${getSecretBgColor(secret.number)} rounded-xl flex items-center justify-center`}>
                    <span className={`text-lg font-bold ${getSecretTextColor(secret.number)}`}>
                      {secret.number}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-gray-800 leading-relaxed mb-4">{secret.point}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Surgery Secret #{secret.number}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="text-gray-400 hover:text-primary transition-colors">
                        <i className="far fa-bookmark"></i>
                      </button>
                      <button className="text-gray-400 hover:text-primary transition-colors">
                        <i className="fas fa-share"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-search text-gray-400 text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Secrets Found</h3>
              <p className="text-gray-600">
                Try adjusting your search query or selected specialty filter.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
