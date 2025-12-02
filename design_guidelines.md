# Design Guidelines: VaxTrack Child Vaccination SaaS Platform

## Design Approach

**System Selected**: Material Design 3 + Healthcare UI Patterns
**Rationale**: Healthcare SaaS requires trust through consistency, clear information hierarchy, and accessibility. Material Design 3 provides robust patterns for data-heavy interfaces while maintaining warmth appropriate for a child-focused application.

**Key References**: 
- Google Health studies for medical UI patterns
- Zocdoc for appointment scheduling patterns
- Headspace for friendly, approachable healthcare UX

## Core Design Principles

1. **Trust Through Clarity**: Medical information must be immediately scannable with zero ambiguity
2. **Mobile-First PWA**: Optimized for one-handed phone use (parents are often multitasking)
3. **Gentle Professionalism**: Friendly without being childish, professional without being cold
4. **Status-Driven Design**: Vaccination status (overdue/upcoming/complete) should be instantly recognizable

## Typography

**Font Family**: 
- Primary: 'Inter' (Google Fonts) - clean, highly legible for medical data
- Accent: 'Poppins' (Google Fonts) - friendly roundedness for headings

**Hierarchy**:
- H1: 2.5rem (40px), Poppins SemiBold - Marketing pages only
- H2: 1.875rem (30px), Poppins SemiBold - Dashboard section headers
- H3: 1.25rem (20px), Inter SemiBold - Card titles, vaccine names
- Body: 1rem (16px), Inter Regular - All content, forms
- Small: 0.875rem (14px), Inter Regular - Metadata, timestamps
- Caption: 0.75rem (12px), Inter Medium - Status badges, labels

## Layout System

**Spacing Primitives**: Tailwind units of **2, 4, 6, 8, 12, 16**
- Micro spacing (gaps, padding): 2, 4
- Component spacing: 6, 8
- Section spacing: 12, 16

**Grid System**:
- Marketing pages: 12-column responsive grid
- Dashboard: Flexible card-based layout with consistent gaps (gap-6)
- Mobile: Single column, max-w-md centered
- Tablet: 2-column grids for cards
- Desktop: 3-column for dashboards, 2-column for forms

**Container Strategy**:
- Marketing: max-w-7xl with px-4
- Dashboards: max-w-6xl with px-6
- Forms: max-w-2xl centered

## Component Library

### Navigation
**Marketing Header**: 
- Sticky navigation with logo left, links center, "Login" and "Get Started" buttons right
- Mobile: Hamburger menu with full-screen overlay

**App Navigation**:
- Parent Dashboard: Bottom tab bar (Home, Schedule, Children, Notifications, Settings) with icons from Heroicons
- Clinic Dashboard: Side navigation (Desktop) / Bottom tabs (Mobile) with sections: Dashboard, Patients, Appointments, Records, Settings

### Cards & Containers
**Vaccination Card**:
- Elevated card (shadow-md) with border-l-4 status indicator
- Header: Vaccine name (H3) + age/date (small text)
- Body: Next dose date, clinic name
- Footer: Status badge + action button
- Spacing: p-6 internal padding

**Child Profile Card**:
- Compact card with avatar placeholder, name (H3), age, location
- Quick stats: Total vaccines, completed, upcoming
- Internal spacing: p-4

**Clinic Patient Card**:
- List item with avatar, patient name, last visit, status indicator
- Hover state with elevated shadow
- Click expands to show full vaccination record

### Forms
**Input Fields**:
- Floating labels (Material Design pattern)
- Focus state: border accent with label color transition
- Error state: red border with error message below
- All inputs: h-12, px-4, rounded-lg

**Date Pickers**: Native HTML5 with fallback to custom calendar for better mobile UX

**Dropdowns**: 
- Country/City selectors with search functionality
- Custom styled with Heroicons chevron-down
- Max height with scroll for long lists

### Status System
**Vaccination Status Badges**:
- Overdue: Red badge, font-medium, px-3 py-1, rounded-full
- Due Soon: Orange badge (within 2 weeks)
- Upcoming: Blue badge
- Completed: Green badge with checkmark icon

**Visual Indicators**:
- Border-left accent on cards (4px width)
- Icon + text combination for clarity
- Consistent badge sizing: text-sm, px-3, py-1

### Calendar/Schedule View
**Month View**:
- Grid layout with vaccine markers on due dates
- Color-coded dots for status
- Click date to see details

**Timeline View** (Alternative):
- Vertical timeline with past/future vaccines
- Connected with dotted line
- Status icons at each milestone

### Notifications
**In-App Notification Center**:
- Dropdown from bell icon
- List of recent notifications with timestamp
- Unread count badge
- Mark as read functionality

**Notification Cards**:
- Icon (vaccine syringe for dose reminders)
- Bold title + description
- Timestamp (relative: "2 hours ago")
- Action button if applicable

### Pricing Page
**Tier Cards**:
- Three tiers: Free, Family ($9/mo), Clinic ($49/mo)
- Featured tier (Family) with elevated design and "Most Popular" badge
- Features list with checkmark icons
- Clear CTA buttons
- Annual/Monthly toggle

**Layout**: 3-column grid on desktop, stacked on mobile

### Dashboard Widgets
**Quick Stats** (Clinic):
- 4-column grid: Total Patients, Today's Appointments, Overdue Vaccines, Completion Rate
- Large number (text-3xl), label below, icon top-right

**Upcoming Vaccines** (Parent):
- List of next 3-5 vaccines with countdown days
- Visual progress indicator
- "Add to Calendar" quick action

## Images

**Hero Section** (Marketing Landing Page):
- Large hero image: Happy parent holding smiling baby/toddler in medical setting (bright, professional, diverse)
- Position: Background with overlay gradient for text readability
- Buttons: Blurred background (backdrop-blur-md with semi-transparent bg)

**Feature Sections**:
- Illustration of mobile phone showing app interface
- Photo of clinic setting (professional, clean)
- Image of diverse children/families (trust building)

**Dashboard**:
- Placeholder avatars for children profiles (circular, soft pastel backgrounds)
- No decorative images in data-heavy areas

## Accessibility

**Focus Management**:
- Clear focus rings (2px solid, offset by 2px) on all interactive elements
- Keyboard navigation for all dashboard functions
- Skip to main content link

**ARIA Labels**:
- All status badges and icons include descriptive text
- Form inputs properly labeled
- Notification count announced to screen readers

**Contrast**:
- All text meets WCAG AA standards (4.5:1 minimum)
- Status indicators use both color and icons/text

## Responsive Behavior

**Breakpoints**:
- Mobile: < 768px - Single column, bottom nav
- Tablet: 768px - 1024px - 2-column grids
- Desktop: > 1024px - Full layouts with side nav

**Touch Targets**: Minimum 44x44px for all interactive elements

## Animation (Minimal)

- Page transitions: Subtle fade (200ms)
- Card hover: Gentle lift with shadow increase (150ms ease)
- Loading states: Skeleton screens (no spinners)
- Success confirmations: Checkmark icon scale animation (300ms)
- **No auto-playing animations, no distracting scroll effects**

## PWA-Specific Elements

**Install Prompt**: Banner at top of app with "Install App" CTA and close button
**Offline Indicator**: Toast notification when offline, showing cached data notice
**Update Available**: Non-intrusive notification with "Refresh to Update" button