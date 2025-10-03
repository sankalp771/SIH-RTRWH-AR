# Overview

RTRWH/AR is a comprehensive rainwater harvesting and artificial recharge assistant web application designed specifically for Indian conditions. The application helps homeowners and communities calculate rainwater harvesting potential, design appropriate storage systems, evaluate artificial recharge feasibility, and perform cost-benefit analysis. Built with scientific methodologies following Central Ground Water Board (CGWB) guidelines, it incorporates region-specific rainfall data, soil characteristics, and groundwater conditions to provide accurate recommendations tailored to Indian climate patterns.

The application features a multi-step user journey: landing page education, calculation type selection (rainwater harvesting or artificial recharge), comprehensive data input forms, and detailed results with feasibility analysis, cost breakdowns, and downloadable reports.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript for type safety and developer experience
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Components**: Shadcn/ui component library built on Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with custom design system based on environmental/utility app aesthetics
- **State Management**: React hooks with TanStack Query for server state management
- **Form Handling**: React Hook Form with Zod validation for type-safe form processing
- **Routing**: Wouter for lightweight client-side routing

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **API Design**: RESTful API with clear endpoint structure for calculations and data persistence
- **Calculation Engine**: Scientific computation module implementing CGWB guidelines and hydrological formulas
- **Data Processing**: Real-time calculations for rainwater potential, storage requirements, and cost analysis
- **File Generation**: Server-side PDF generation for downloadable reports

## Data Storage Solutions
- **Database ORM**: Drizzle ORM configured for PostgreSQL with type-safe database operations
- **Schema Management**: Centralized schema definitions in TypeScript with Zod validation
- **Storage Strategy**: Submission-based data storage for calculation history and user tracking
- **Static Data**: JSON files for cities rainfall data, soil coefficients, and calculation parameters

## Component Design System
- **Theme System**: Dual light/dark mode with HSL color variables for consistent theming
- **Layout Patterns**: Card-based layouts with consistent spacing using Tailwind's spacing scale
- **Typography**: Inter font family with semantic text sizing and weight hierarchy
- **Interactive Elements**: Hover and active states with elevation effects for better user feedback
- **Responsive Design**: Mobile-first approach with breakpoint-based layouts

## Calculation Architecture
- **Scientific Methodology**: Implementation of hydrological formulas for rainwater harvesting potential
- **Regional Data Integration**: City-specific rainfall patterns, groundwater depths, and soil characteristics
- **Multi-factor Analysis**: Roof area, roof type coefficients, household demand, and storage optimization
- **Cost Modeling**: Budget-based system recommendations with ROI and payback period calculations
- **Feasibility Scoring**: Algorithmic assessment combining technical and economic factors

# External Dependencies

## Core Framework Dependencies
- **React Ecosystem**: React 18 with TypeScript, React Hook Form, TanStack Query for modern React patterns
- **UI Framework**: Radix UI primitives providing accessible, unstyled components as foundation
- **Styling**: Tailwind CSS with PostCSS for utility-first styling approach
- **Build Tools**: Vite with ESBuild for development and production optimization

## Database and ORM
- **Drizzle ORM**: Type-safe PostgreSQL ORM with migration support
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Schema Validation**: Zod for runtime type checking and validation

## Utility Libraries
- **Form Validation**: Hookform/resolvers with Zod integration for type-safe form handling
- **Date Handling**: date-fns for date manipulation and formatting
- **PDF Generation**: jsPDF for client and server-side report generation
- **Class Management**: clsx and class-variance-authority for conditional styling
- **Icons**: Lucide React for consistent iconography

## Development and Deployment
- **TypeScript**: Full TypeScript implementation with strict type checking
- **Session Management**: connect-pg-simple for PostgreSQL-backed sessions
- **Development Tools**: Replit-specific plugins for development environment integration
- **Build Optimization**: esbuild for server bundling and Vite for client optimization

## Regional Data Sources
- **Rainfall Data**: Static JSON datasets with monthly rainfall patterns for major Indian cities
- **Soil Classifications**: Predefined infiltration rates and characteristics for Indian soil types
- **Cost Factors**: Regional pricing data and budget multipliers for system recommendations
- **Technical Coefficients**: CGWB-compliant runoff coefficients and calculation parameters