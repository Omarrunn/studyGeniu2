# Overview

This is a medical quiz application called "MedQuiz Pro" that provides multiple choice questions (MCQs) and surgery secrets for medical students and professionals. The application features a comprehensive question bank organized by medical topics (like Breast, Neurosurgery, etc.) and a collection of surgery secrets with search functionality. Users can practice questions, track their progress, and access curated medical knowledge in an interactive format.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend is built with React and TypeScript using Vite as the build tool. It follows a component-based architecture with:

- **UI Framework**: React with TypeScript for type safety
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Form Handling**: React Hook Form with Zod for validation

## Backend Architecture
The backend is an Express.js REST API with:

- **Framework**: Express.js with TypeScript
- **Data Layer**: In-memory storage implementation with interfaces for future database integration
- **Validation**: Zod schemas for type-safe data validation
- **Development**: Vite middleware for hot reloading in development

## Data Storage Solutions
Currently uses in-memory storage with a well-defined interface:

- **Storage Interface**: `IStorage` interface allows for easy migration to persistent storage
- **Data Sources**: JSON files for MCQ data and hardcoded surgery secrets
- **Schema Validation**: Drizzle-Zod integration ready for PostgreSQL migration
- **Database Ready**: Drizzle ORM configured with PostgreSQL dialect

## Core Features
- **MCQ System**: Topic-based question organization with progress tracking
- **Surgery Secrets**: Searchable collection of medical facts and tips
- **Search Functionality**: Full-text search across questions and secrets
- **Progress Tracking**: User progress storage with completion and accuracy metrics
- **Responsive Design**: Mobile-first design with Tailwind CSS

## External Dependencies

- **Database**: Configured for PostgreSQL with Neon serverless (@neondatabase/serverless)
- **ORM**: Drizzle ORM for type-safe database operations
- **UI Components**: shadcn/ui built on Radix UI primitives
- **Icons**: Font Awesome for iconography
- **Fonts**: Google Fonts (Inter, Architects Daughter, DM Sans, Fira Code, Geist Mono)
- **Development Tools**: Replit integration for development environment
- **Build Tools**: Vite for fast development and optimized builds
- **Deployment**: ESBuild for server bundling in production

The application is designed with modularity in mind, making it easy to extend with additional medical topics, implement user authentication, or migrate to a persistent database solution.