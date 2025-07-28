# PriestConnect - Diocese Management System

## Overview
PriestConnect is a web application designed to facilitate connections between priests and institutions within the Diocese of Mangalore. The platform allows institutions to find and book priests for various religious services, while enabling priests to manage their availability and service offerings.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Full-Stack Application Structure
The application follows a monorepo structure with clear separation between client and server components:

- **Frontend**: React with TypeScript using Vite as the build tool
- **Backend**: Express.js server with TypeScript
- **Database**: Configured for PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Authentication**: Firebase Authentication
- **Data Storage**: Firebase Firestore for real-time data management

### Directory Structure
```
├── client/           # React frontend application
├── server/           # Express.js backend
├── shared/           # Shared schemas and types
├── migrations/       # Database migration files
└── attached_assets/  # Static assets
```

## Key Components

### Frontend Architecture
- **React Router**: Uses wouter for client-side routing
- **State Management**: React Query for server state, React hooks for local state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Form Handling**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with custom design system variables

### Backend Architecture
- **Express.js**: RESTful API server with middleware for logging and error handling
- **Database Layer**: Drizzle ORM configured for PostgreSQL
- **Storage Interface**: Abstracted storage layer with in-memory implementation for development
- **Development**: Vite integration for hot module replacement in development

### Authentication & Authorization
- **Firebase Auth**: Handles user authentication with email/password
- **Role-based Access**: Two user roles - 'priest' and 'institution'
- **Session Management**: Firebase session tokens with automatic refresh

## Data Flow

### User Management
1. User registration creates Firebase auth account and user profile in Firestore
2. Role-based routing directs users to appropriate dashboard
3. User profiles stored with role, name, email, and creation timestamp

### Priest Profile Management
- Priests can create detailed profiles including parish, location, services offered
- Service types: Mass, Confession, Prayer/Blessings, Recollection/Retreat
- Profile includes bio, contact information, and availability

### Booking System
1. Institutions search for priests by service type, date, and location
2. Booking requests created with status tracking (pending, accepted, declined, completed)
3. Real-time updates through Firestore subscriptions
4. Calendar integration for availability management

### Real-time Data Synchronization
- Firestore real-time listeners for instant updates
- Custom React hooks for data fetching and caching
- Optimistic updates for better user experience

## External Dependencies

### Core Technologies
- **Firebase**: Authentication, Firestore database, real-time subscriptions
- **Drizzle**: Database ORM and query builder (configured for PostgreSQL)
- **React Query**: Server state management and caching
- **Radix UI**: Accessible component primitives
- **Zod**: Runtime type validation and schema definition

### Development Tools
- **Vite**: Fast development server and build tool
- **TypeScript**: Type safety across the application
- **Tailwind CSS**: Utility-first CSS framework
- **ESBuild**: Fast JavaScript bundler for production

### Database Configuration
- Primary database: PostgreSQL via Drizzle ORM
- Schema definitions shared between client and server
- Migration system for database versioning
- Environment-based configuration with DATABASE_URL

## Deployment Strategy

### Build Process
1. **Frontend**: Vite builds optimized React application to `dist/public`
2. **Backend**: ESBuild bundles Node.js server to `dist/index.js`
3. **Database**: Drizzle migrations applied via `db:push` command

### Environment Configuration
- Development: Uses Vite dev server with HMR and Express API
- Production: Serves static frontend files from Express server
- Database: PostgreSQL connection via environment variable

### Development Workflow
- `npm run dev`: Starts development server with hot reloading
- `npm run build`: Creates production build
- `npm run start`: Runs production server
- `npm run db:push`: Applies database schema changes

### Service Integration
- Firebase project configuration via environment variables
- PostgreSQL database provisioning required
- Real-time capabilities through Firestore
- Session management via Firebase Auth tokens

The application is designed to be deployment-ready with proper environment handling, production builds, and scalable architecture supporting the Diocese of Mangalore's priest-institution coordination needs.