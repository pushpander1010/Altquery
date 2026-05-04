# AltQuery - Complete Page List

This document lists all pages available on AltQuery.

## Main Pages

### 1. Homepage (`/`)
- **Purpose:** Browse and filter 1050+ SQL practice questions
- **Features:**
  - Search functionality
  - Filter by difficulty (Easy, Medium, Hard)
  - Filter by topic (SELECT, JOINs, Window Functions, etc.)
  - Filter by SQL dialect (SQLite, MySQL, PostgreSQL)
  - Question cards with descriptions
- **Priority:** High (1.0 in sitemap)

### 2. Question Pages (`/question/[id]`)
- **Purpose:** Practice individual SQL questions
- **Features:**
  - Detailed question description
  - Database schema display
  - Expected output (show/hide)
  - Monaco Editor with autocomplete
  - Instant answer validation
  - AI assistant for help
  - Hints
  - SQL dialect selector
- **Count:** 1050+ pages (q1 through q1050)
- **Priority:** High (0.9 in sitemap)

## Information Pages

### 3. About Page (`/about`)
- **Purpose:** Learn about AltQuery platform
- **Sections:**
  - Mission statement
  - Key features (6 feature cards)
  - How it works (5-step guide)
  - Topics covered (Fundamentals & Advanced)
  - Technology stack
  - Tips for success
  - Call-to-action
- **Priority:** Medium-High (0.8 in sitemap)

### 4. Contact Page (`/contact`)
- **Purpose:** Get in touch with AltQuery team
- **Sections:**
  - General inquiries email
  - Bug reports email
  - Feature requests email
  - Business inquiries email
  - Social media links (GitHub, Twitter)
  - FAQ section
- **Priority:** Medium (0.7 in sitemap)

## Legal Pages

### 5. Privacy Policy (`/privacy`)
- **Purpose:** Explain data collection and privacy practices
- **Sections:**
  - Data we collect (and don't collect)
  - Cookies & local storage
  - Third-party services (Google Analytics, Together AI, AdSense)
  - User rights
  - Data security
  - Children's privacy
  - Changes to policy
  - Contact information
- **Priority:** Low-Medium (0.5 in sitemap)

### 6. Terms of Service (`/terms`)
- **Purpose:** Define terms and conditions of use
- **Sections:**
  - Agreement to terms
  - Use of service (allowed & prohibited)
  - Intellectual property
  - User-generated content
  - Disclaimer of warranties
  - Limitation of liability
  - Third-party services
  - Termination
  - Changes to terms
  - Governing law
  - Contact information
- **Priority:** Low-Medium (0.5 in sitemap)

## Technical Pages

### 7. Sitemap (`/sitemap.xml`)
- **Purpose:** Help search engines discover all pages
- **Includes:**
  - Homepage
  - About page
  - Contact page
  - Privacy policy
  - Terms of service
  - All 1050+ question pages
- **Format:** XML (auto-generated)

### 8. Robots.txt (`/robots.txt`)
- **Purpose:** Guide search engine crawlers
- **Configuration:**
  - Allow all pages
  - Reference sitemap location

## API Routes

### 9. AI Assistant API (`/api/ai-assistant`)
- **Purpose:** Process AI assistant requests
- **Method:** POST
- **Features:**
  - Context-aware responses
  - Question-specific hints
  - Error explanations
  - SQL concept teaching
- **Model:** LiquidAI/LFM2-24B-A2B (via Together AI)

## Page Count Summary

| Type | Count |
|------|-------|
| Main Pages | 2 (Homepage + Question template) |
| Question Pages | 1050+ |
| Information Pages | 2 (About, Contact) |
| Legal Pages | 2 (Privacy, Terms) |
| Technical Pages | 2 (Sitemap, Robots) |
| API Routes | 1 |
| **Total** | **1059+** |

## Sitemap Priority

| Priority | Pages |
|----------|-------|
| 1.0 | Homepage |
| 0.9 | Question pages (1050+) |
| 0.8 | About |
| 0.7 | Contact |
| 0.5 | Privacy, Terms |

## Update Frequency

| Frequency | Pages |
|-----------|-------|
| Daily | Homepage |
| Weekly | Question pages |
| Monthly | About, Contact, Privacy, Terms |

## Footer Links

All pages include a footer with links to:
- Topics (SELECT Basics, JOINs, Window Functions, CTEs)
- Difficulty levels (Easy, Medium, Hard)
- Resources (About, Contact, Privacy, Terms)

## Header Navigation

All pages include a header with:
- AltQuery logo (links to homepage)
- Questions link
- About link

## SEO Optimization

All pages include:
- Unique meta titles
- Unique meta descriptions
- Open Graph tags
- Twitter Card tags
- Canonical URLs
- Structured data (JSON-LD) where applicable

## Accessibility

All pages follow accessibility best practices:
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus indicators
- Alt text for images
- Proper heading hierarchy

---

**Last Updated:** {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
