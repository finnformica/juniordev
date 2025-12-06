# Project Requirements - Junior Jobs Board

## Project Vision

A minimal job board platform connecting junior developers seeking experience with small businesses needing help on projects. Think remoteok.com but for unpaid/low-paid junior opportunities.

## Core Value Proposition

- **For Juniors**: Gain real-world project experience, build portfolio, get references
- **For Businesses**: Get help with tasks they don't have time for, mentor emerging talent
- **No Complex Application System**: Direct contact between parties (email/phone)

## User Stories

### As a Junior Developer

- I can browse all active job opportunities without friction
- I can filter jobs by skills, role, or title to find relevant opportunities
- I can view full job details including required skills and business contact info
- I can contact businesses directly via the email shown on the posting
- I must create an account to view full job details

### As a Business Owner

- I can post job opportunities with title, role, description, and required skills
- I can edit or close my job postings
- I can see who contacts me through the email I provide
- I must verify I'm a business when signing up

### As an Admin

- I can view all jobs (active and closed)
- I can view all users (businesses and juniors)
- I can delete inappropriate jobs or ban users
- I have full system access for moderation

## Design Philosophy

- **Brutally Simple**: No landing page, no hero sections, no marketing fluff
- **Content First**: Root page immediately shows job listings
- **Fast to Jobs**: 1 click from homepage to seeing full job details
- **remoteok.com Aesthetic**: Plain, functional, fast-loading

## Technical Requirements

### Performance

- Jobs listing page loads in < 1 second
- No unnecessary JavaScript
- Server-side rendering for SEO
- Mobile-first responsive design

### Security

- Row-level security on all database tables
- Role-based access control via middleware
- XSS protection on all user inputs
- CSRF protection on forms

### Data Requirements

- All user data stored in Supabase
- Real-time updates not required (polling acceptable)
- Data retention: indefinite (may add archival later)

## Out of Scope (Phase 1)

- Payment processing
- In-app messaging/chat
- Application tracking system
- Notifications (email or push)
- Saved jobs / favourites
- Company profiles beyond basic info
- Junior developer profiles/portfolios
- Reviews or ratings
- Advanced search with boolean operators

## Future Considerations (Not Now)

- Email notifications when new jobs match skills
- "Apply" button that tracks applications
- Business dashboard with applicant tracking
- Junior portfolio pages
- Payment for featured job listings
- Job expiration dates
