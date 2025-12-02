# VaxTrack - Child Vaccination Management Platform

## Overview

VaxTrack is a mobile-first Progressive Web Application (PWA) designed to help parents track their children's vaccination schedules and enable clinics to manage patient immunization records. The platform provides automated scheduling based on WHO-recommended vaccination guidelines for 100+ countries, intelligent reminders via SMS/push/email, and comprehensive record management.

**Core Purpose**: Simplify vaccination tracking for families while providing clinics with tools to manage patient immunization data efficiently.

**Target Users**:
- Parents managing vaccination schedules for their children
- Healthcare clinics tracking patient immunization records

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack Query (React Query) for server state
- **Build Tool**: Vite for development and production builds

**UI System**:
- **Component Library**: Shadcn/ui (Radix UI primitives with custom styling)
- **Design System**: Material Design 3 principles with healthcare-focused patterns
- **Styling**: Tailwind CSS with custom theme variables
- **Typography**: Inter (body/data) and Poppins (headings) from Google Fonts
- **Theme Support**: Dark/light modes with system preference detection

**PWA Features**:
- Installable web app with manifest configuration
- Mobile-first responsive design
- Service worker ready (configured for offline capability)

**Key Design Decisions**:
- Mobile-first approach optimized for one-handed use
- Status-driven UI where vaccination status (overdue/upcoming/complete) is instantly recognizable
- Card-based layouts with consistent spacing (Tailwind units: 2, 4, 6, 8, 12, 16)

### Backend Architecture

**Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **Server**: HTTP server with WebSocket support capability

**Authentication**:
- Replit Auth integration using OpenID Connect (OIDC)
- Passport.js for authentication strategy management
- Session-based authentication with secure HTTP-only cookies
- Session storage in PostgreSQL using connect-pg-simple

**API Design**:
- RESTful API structure under `/api` namespace
- Role-based access control (parent/clinic/admin roles)
- Middleware for authentication enforcement on protected routes

**Data Access Layer**:
- Drizzle ORM for type-safe database queries
- Schema-first approach with TypeScript type inference
- Connection pooling via @neondatabase/serverless

**Business Logic Organization**:
- Storage interface pattern (`server/storage.ts`) abstracting data operations
- Vaccination schedule seeding from WHO-recommended data
- Dashboard statistics aggregation
- Notification management system

### Database Schema

**Technology**: PostgreSQL (via Neon serverless)

**Core Tables**:

1. **users** - User accounts with role-based access
   - Supports parent, clinic, and admin roles
   - Subscription tiers (free, family, clinic)
   - Notification preferences (SMS, push, email with customizable reminder days)
   - Location data (country, city) for schedule localization

2. **children** - Child profiles
   - Belongs to parent users
   - Medical metadata (blood type, allergies, notes)
   - Location inheritance from parent or override

3. **vaccination_schedules** - WHO-recommended vaccination timelines
   - Country-specific schedules
   - Vaccine metadata (name, code, dose number, age requirements)
   - Mandatory vs. optional vaccine flags

4. **vaccination_records** - Individual vaccination tracking
   - Links children to scheduled vaccines
   - Status tracking (scheduled, completed, skipped)
   - Clinic and administrator tracking
   - Date management (scheduled vs. administered)

5. **clinics** - Healthcare provider profiles
   - Belongs to clinic-role users
   - Operating hours and location data
   - Verification status

6. **appointments** - Scheduled clinic visits
   - Links children, clinics, and vaccination records
   - Status workflow (scheduled, confirmed, completed, cancelled)

7. **notifications** - Multi-channel notification system
   - Type categorization (reminder, appointment, overdue, system)
   - Read/unread tracking
   - Metadata storage for notification context

8. **push_subscriptions** - Web Push API subscriptions
   - Device-specific push notification endpoints

9. **sessions** - Authentication session storage
   - Required for Replit Auth integration

**Schema Patterns**:
- UUID primary keys with PostgreSQL `gen_random_uuid()`
- Timestamps for created/updated tracking
- JSONB for flexible metadata storage (notification preferences)
- Foreign key relationships with referential integrity
- Indexes on frequently queried columns (session expiration, user lookups)

### External Dependencies

**Authentication Service**:
- Replit Auth (OpenID Connect provider)
- Handles user identity management and OAuth flows

**Database**:
- Neon PostgreSQL serverless database
- WebSocket-based connection pooling
- Environment variable: `DATABASE_URL`

**Session Management**:
- PostgreSQL-backed session store
- Environment variable: `SESSION_SECRET`

**Email/SMS/Push Notifications** (infrastructure ready):
- Schema supports multi-channel notifications
- Implementation extensible for services like Twilio (SMS), SendGrid (email), Web Push API

**Vaccination Data**:
- WHO-recommended schedules embedded in application (`shared/vaccinationData.ts`)
- Supports 100+ countries with localized vaccine schedules
- Seeded into database on initialization

**Frontend Dependencies**:
- Google Fonts (Inter, Poppins) loaded via CDN
- Radix UI primitives for accessible components
- React Hook Form with Zod validation

**Build & Development**:
- Vite for frontend bundling and HMR
- esbuild for server-side bundling (production)
- TypeScript compilation with shared types
- Replit-specific plugins for development experience

**Deployment Considerations**:
- Production build bundles allowed server dependencies to reduce cold start times
- Static assets served from `dist/public`
- Environment-based configuration (NODE_ENV)