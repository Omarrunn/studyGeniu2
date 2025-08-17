import { useState } from "react";
import AppHeader from "@/components/app-header";
import McqSection from "@/components/mcq-section";
import SecretsSection from "@/components/secrets-section";

export default function Home() {
  const [activeSection, setActiveSection] = useState<"mcq" | "secrets">("mcq");

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      
      {/* Main Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveSection("mcq")}
              className={`py-4 px-1 border-b-2 font-medium text-sm focus:outline-none transition-colors ${
                activeSection === "mcq"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <i className="fas fa-question-circle mr-2"></i>
              Multiple Choice Questions
            </button>
            <button
              onClick={() => setActiveSection("secrets")}
              className={`py-4 px-1 border-b-2 font-medium text-sm focus:outline-none transition-colors ${
                activeSection === "secrets"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <i className="fas fa-lightbulb mr-2"></i>
              Surgery Secrets
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeSection === "mcq" ? <McqSection /> : <SecretsSection />}
      </main>

      {/* Floating Action Buttons - Adjusted for mobile */}
      <div className="fixed bottom-6 right-6 flex flex-col space-y-3 z-40 md:z-50">
        {/* Only show scroll button on mobile when needed, hide on MCQ section */}
        {activeSection !== "mcq" && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-12 h-12 bg-white text-gray-600 rounded-full shadow-lg hover:shadow-xl transition-all border border-gray-200 hover:bg-gray-50"
          >
            <i className="fas fa-chevron-up"></i>
          </button>
        )}
        {/* Help button - only on desktop or on secrets section */}
        <div className="hidden md:block">
          <button className="w-12 h-12 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:bg-primary/90">
            <i className="fas fa-question"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
