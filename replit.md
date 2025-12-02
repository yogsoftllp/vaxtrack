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
- Mobile-first responsive design (native app UI)
- Service worker ready (configured for offline capability)
- Push notifications with Web Push API

**Pages & Features**:
- Parent Dashboard - Cards-based with Actions Required section
- Children Management - Searchable list with progress tracking
- Vaccination Schedule - Tabbed view (Upcoming/All) with color-coded status
- Notifications Center - Stacked cards with read/unread indicators
- Clinic Dashboard - Stats overview with patient management
- Clinic Analytics - Performance metrics and trends
- Appointment Booking - Date/time selection with nearby clinics
- Push Notifications Setup - Web Push API subscription
- Referral Rewards Dashboard - Progress tracking with gift rewards
- FAQ Section - Collapsible FAQs on landing page

**Accessibility Features**:
- ARIA labels on interactive elements
- Role attributes for dynamic content
- Semantic HTML structure
- Keyboard navigation support
- High contrast color schemes

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
- Database indexes on frequently queried columns (users, children, vaccinations, appointments, notifications)

**Business Logic Organization**:
- Storage interface pattern (`server/storage.ts`) abstracting data operations
- Vaccination schedule seeding from WHO-recommended data
- Dashboard statistics aggregation
- Notification management system
- Clinic verification workflow
- Referral system tracking

### Database Schema

**Technology**: PostgreSQL (via Neon serverless)

**Core Tables**:

1. **users** - User accounts with role-based access
   - Supports parent, clinic, and admin roles
   - Subscription tiers (free, family, clinic)
   - Notification preferences (SMS, push, email with customizable reminder days)
   - Location data (country, city) for schedule localization
   - Referral code and successful referral tracking

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
   - Verification status (pending/approved/rejected)
   - Verification notes and verified by admin

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

10. **phone_otps** - OTP tracking for SMS/WhatsApp authentication
    - Phone number, OTP code, expiry time
    - Status tracking (pending, verified)

**Performance Optimizations**:
- Indexes on frequently queried columns (userId, childId, clinicId, status fields)
- Session expiry index for cleanup
- Email and phone number indexes for uniqueness

**Schema Patterns**:
- UUID primary keys with PostgreSQL `gen_random_uuid()`
- Timestamps for created/updated tracking
- JSONB for flexible metadata storage (notification preferences)
- Foreign key relationships with referential integrity

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

**Email/SMS/Push Notifications**:
- Twilio (SMS/WhatsApp) - Ready for setup
- Firebase Cloud Messaging (FCM) - Default SMS provider
- Web Push API (Notifications) - Native browser support
- Email (Nodemailer) - Ready for configuration

**Vaccination Data**:
- WHO-recommended schedules embedded in application (`shared/vaccinationData.ts`)
- Supports 100+ countries with localized vaccine schedules
- Seeded into database on initialization

**Frontend Dependencies**:
- Google Fonts (Inter, Poppins) loaded via CDN
- Radix UI primitives for accessible components
- React Hook Form with Zod validation
- Lucide React icons for consistent visual language

**Build & Development**:
- Vite for frontend bundling and HMR
- esbuild for server-side bundling (production)
- TypeScript compilation with shared types
- Replit-specific plugins for development experience

## Recent Features (Current Session)

### Phase 1: Foundation & Authentication
- Quick Authentication System (Gmail OAuth, SMS OTP, WhatsApp OTP)
- Clinic Verification Workflow with admin approval
- Referral System with Family Plan rewards
- AI Clinic Advertisements targeting location-based parents

### Phase 2: Mobile UI Transformation
- **5 Critical Pages Redesigned** - Dashboard, children, schedule, notifications, clinic dashboard
- Native app UI with Material Design 3 principles
- Sticky headers, card-based layouts, color-coded status
- Mobile-first responsive design optimized for one-handed use

### Phase 3: Feature Enhancements (Current)
- ✅ **Vaccination Export & Sharing** - PDF download and social sharing for records
- ✅ **Clinic Analytics Dashboard** - Performance metrics (completion rate, overdue tracking)
- ✅ **Appointment Booking System** - Date/time selection with nearby clinic discovery
- ✅ **Push Notifications Setup** - Web Push API integration for device notifications
- ✅ **Referral Rewards Dashboard** - Progress visualization with gift incentives
- ✅ **FAQ Section** - Collapsible FAQs on landing page
- ✅ **Enhanced Settings** - Better notification preference controls
- ✅ **Loading States** - Skeleton loaders for all data-fetching sections
- ✅ **Accessibility** - ARIA labels, keyboard navigation, error boundaries
- ✅ **Database Optimization** - Indexes for performance, pagination-ready

### Remaining/Planned Improvements
- ⏳ Full Twilio integration setup (SMS/WhatsApp OTP)
- ⏳ Code splitting for bundle optimization (currently 601KB)
- ⏳ Sentry error tracking for production
- ⏳ SMS campaign management for clinics
- ⏳ Vaccine inventory management UI
- ⏳ Email campaign templates

## Testing Features
- SMS/WhatsApp OTP: Currently logs code to console (demo mode)
- For actual SMS/WhatsApp: Complete Twilio integration setup
- Clinic verification: Admin approves/rejects from dashboard
- Referral codes: Copy from referral card, share with friends
- Push notifications: Subscribe via settings or notifications page
- Appointment booking: Browse clinics, select date/time

## Production Readiness
- ✅ All TypeScript errors resolved
- ✅ Database migrations applied
- ✅ Zero build errors
- ✅ App running on port 5000
- ✅ Mobile-first UI complete
- ✅ Core features implemented
- ⏳ Twilio SMS/WhatsApp (waiting for user setup)
- ⏳ Production error tracking (Sentry setup)
