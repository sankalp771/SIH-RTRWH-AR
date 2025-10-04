# Overview

RTRWH/AR is a comprehensive rainwater harvesting and artificial recharge assistant web application designed specifically for Indian conditions. The application helps homeowners and communities calculate rainwater harvesting potential, design storage systems, assess artificial recharge feasibility, and analyze cost-benefit scenarios. It features a multi-step user journey from educational landing pages through data input forms to detailed technical results with downloadable PDF reports.

# Replit Environment Setup (Completed)

**Status**: ✅ Successfully configured and running

**Database**: PostgreSQL database provisioned and schema deployed via `npm run db:push`

**Workflow Configuration**:
- Workflow name: "Start application"
- Command: `npm run dev`
- Port: 5000
- Output type: webview
- Status: Running successfully with HMR enabled

**Deployment Configuration**:
- Target: autoscale (stateless web application)
- Build command: `npm run build`
- Run command: `npm run start`

**Environment Variables**:
- DATABASE_URL, PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE (automatically configured)

**Vite Configuration**:
- Host: 0.0.0.0 (correctly configured for Replit proxy)
- Port: 5000
- HMR: WebSocket on port 443 with WSS protocol
- Allowed hosts: true (enables Replit iframe proxy access)

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type safety and modern development patterns
- Vite as the build tool for fast development server and optimized production builds
- Single-page application with client-side routing via Wouter (lightweight alternative to React Router)

**UI & Styling System**
- Shadcn/ui component library built on Radix UI primitives for accessible, composable components
- Tailwind CSS v4 with custom design tokens following environmental/utility app aesthetics
- HSL-based color system supporting light/dark modes with CSS variables
- Inter font family via Google Fonts for professional typography
- Custom design system emphasizing trust and professionalism for technical calculations

**State & Data Management**
- React Hook Form with Zod validation for type-safe form processing and runtime validation
- TanStack Query (React Query) for server state management and API caching
- Local component state via React hooks for UI interactions
- No global state management library needed due to simple data flow

**Component Architecture**
- Card-based layouts with consistent spacing (Tailwind's 4/6/8/12/16 scale)
- Multi-step form flow: Landing → Calculator Type Selection → Input Form → Results
- Reusable UI primitives from Shadcn/ui (buttons, cards, forms, dialogs, progress indicators)
- Accessibility-first design with ARIA labels and keyboard navigation
- Interactive map component using Leaflet and OpenStreetMap for location selection with auto-fill functionality

## Backend Architecture

**Server Framework**
- Node.js runtime with Express.js for RESTful API endpoints
- TypeScript throughout for type safety across frontend and backend
- ESM (ES Modules) for modern JavaScript module system
- Custom error handling middleware for consistent API responses

**API Design**
- RESTful endpoints with clear separation of concerns
- POST `/api/calculate` - Main calculation endpoint accepting user inputs and calculation type
- POST `/api/download-pdf` - PDF report generation endpoint
- GET `/api/cities` - Returns static city data with rainfall patterns and geographic information
- JSON request/response format with Zod validation
- Comprehensive error handling with appropriate HTTP status codes

**Calculation Engine**
- Scientific computation module implementing CGWB (Central Ground Water Board) guidelines
- Region-specific calculations using Indian rainfall patterns and hydrological formulas
- Modular calculation functions for rainwater harvesting potential, storage sizing, recharge volume
- Cost analysis incorporating Indian material costs and regional variations
- Feasibility scoring algorithm combining technical and economic factors

**Data Processing**
- Real-time calculations performed server-side for accuracy and security
- Input validation using shared Zod schemas between frontend and backend
- Static data files (JSON) for cities, coefficients, and calculation parameters
- Server-side PDF generation using jsPDF library

## Data Storage Solutions

**Database Configuration**
- Drizzle ORM configured for PostgreSQL with type-safe database operations
- Schema definitions in TypeScript with automatic type inference
- Database credentials via `DATABASE_URL` environment variable
- Migration system via Drizzle Kit (`db:push` script)

**Schema Design**
- `userSubmissions` table storing calculation history
- JSONB columns for flexible storage of user inputs and calculation results
- Timestamp tracking for submission history
- UUID-based primary keys for distributed system compatibility

**Data Models**
- User input schema with comprehensive validation rules (pincode format, numeric ranges, enum constraints)
- Calculation results schema with nested objects for complex data structures
- Shared schemas between frontend and backend for type consistency
- Zod-based validation with automatic TypeScript type generation

**Static Data Files**
- `cities.json` - 50+ Indian cities with monthly rainfall, groundwater depth, aquifer types
- `coefficients.json` - Runoff coefficients, infiltration rates, cost factors, seasonal multipliers
- Region-specific evaporation loss factors and quality adjustment factors

## Component Design System

**Theme Architecture**
- Dual theme system (light/dark) with HSL color variables
- Primary colors: Deep blue-green (195 65% 25%) for headers and CTAs
- Accent colors: Water blue (205 85% 55%), earth green (145 40% 45%), warning amber
- Subtle gradients for hero sections and card backgrounds
- Consistent elevation system using opacity-based shadows

**Layout Patterns**
- Responsive mobile-first design with breakpoint-based layouts
- Container max-widths for optimal reading experience
- Card-based content grouping with consistent padding (p-6, p-8)
- Section spacing using my-12, my-16 for visual rhythm
- Sticky header navigation with backdrop blur effect

**Interactive Elements**
- Hover states using elevation effects (hover-elevate classes)
- Active states with deeper elevation (active-elevate-2)
- Focus indicators following WCAG accessibility guidelines
- Progress indicators for multi-step forms
- Toast notifications for user feedback

**Typography System**
- Semantic heading hierarchy (text-3xl to text-7xl)
- Font weights: Regular (400) for body, Medium (500) for emphasis, Semi-bold (600) for headings
- Tabular figures for numerical data display
- Consistent line heights for readability
- Text color hierarchy using muted-foreground for secondary content

## Calculation Architecture

**Scientific Methodology**
- Rainwater harvesting potential: `Catchment Area × Runoff Coefficient × Rainfall × Collection Efficiency`
- Roof type runoff coefficients: RCC (0.85), GI (0.90), Asbestos (0.80), Tiles (0.75)
- First flush calculation: 2-3mm of first rainfall diverted for quality
- Monthly rainfall distribution for seasonal analysis

**Regional Data Integration**
- City-specific rainfall patterns from meteorological data
- Groundwater depth variations across Indian regions
- Aquifer type classification (Coastal, Alluvial, Hard Rock)
- Soil infiltration rates: Sandy (100 mm/hr), Loamy (25 mm/hr), Clayey (5 mm/hr)
- Regional evaporation loss factors

**Multi-factor Analysis**
- Household demand calculation based on dwellers and consumption patterns (135 L/person/day)
- Seasonal demand multipliers for different water purposes (Domestic, Irrigation, Industrial)
- Environmental quality factors (Residential, Industrial, Agricultural)
- Bird nesting impact on water quality (0.92 multiplier)
- Storage optimization considering dry period requirements

**Cost Modeling**
- Budget-based system recommendations (Low/Medium/High tiers)
- Base cost per square meter (₹400) with regional variations
- Budget multipliers: Low (0.65), Medium (1.0), High (1.6)
- Annual savings calculation based on municipal water rates (₹0.025/L)
- ROI and payback period analysis for economic feasibility

**Feasibility Scoring**
- Algorithmic assessment combining technical viability and economic factors
- Coverage percentage (harvested vs. demand)
- Cost-effectiveness ratio
- Groundwater recharge potential
- Soil permeability considerations
- Overall feasibility levels: High (>75), Medium (50-75), Low (<50)

# External Dependencies

## Frontend Libraries
- **@tanstack/react-query** v5.60.5 - Server state management and caching
- **@hookform/resolvers** v3.10.0 - Form validation resolver for React Hook Form
- **react-hook-form** - Form state management with performance optimization
- **zod** - Runtime type validation and schema definition
- **wouter** - Lightweight client-side routing
- **react-leaflet** v4.2.1 - React components for Leaflet maps
- **leaflet** - Interactive map library for location visualization and selection

## UI Component Libraries
- **@radix-ui/* packages** - Accessible component primitives (dialogs, dropdowns, popovers, etc.)
- **class-variance-authority** v0.7.1 - Type-safe component variants
- **clsx** v2.1.1 & **tailwind-merge** - Conditional className utilities
- **lucide-react** - Icon library
- **cmdk** v1.1.1 - Command palette component

## Backend Dependencies
- **express** - Web application framework
- **drizzle-orm** v0.39.1 - Type-safe ORM for database operations
- **@neondatabase/serverless** v0.10.4 - Neon PostgreSQL serverless driver
- **pg** (node-postgres) - PostgreSQL client
- **jspdf** - Client and server-side PDF generation
- **date-fns** v3.6.0 - Date utility library

## Development Tools
- **vite** v7.1.7 - Build tool and development server
- **typescript** - Static type checking
- **tsx** - TypeScript execution for Node.js
- **esbuild** - JavaScript bundler for server code
- **tailwindcss** v4.1.14 - Utility-first CSS framework
- **postcss** & **autoprefixer** - CSS processing

## Database
- **PostgreSQL** - Primary database (via Neon serverless or standard PostgreSQL)
- **Drizzle Kit** - Database migration and schema management tool
- Connection via `DATABASE_URL` environment variable

## Static Data Sources
- Indian Meteorological Department rainfall data (embedded in cities.json)
- CGWB (Central Ground Water Board) guidelines for calculations
- Regional groundwater and soil data for 50+ major Indian cities