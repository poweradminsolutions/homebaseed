# HomebaseED Supabase Database Schema

Comprehensive database schema for HomebaseED, a homeschooling directory and resource platform.

## Files

- **schema.sql** - Complete database schema with all tables, enums, constraints, indexes, and RLS policies
- **seed.sql** - Sample data for testing (15 states, 10 resources, 5 curricula, 3 events)

## Schema Overview

### Enums (8 types)
- `regulation_level` - State homeschooling regulation stringency
- `resource_type` - Types of local resources
- `curriculum_approach` - Teaching methodologies
- `curriculum_format` - Curriculum delivery formats
- `user_role` - User account roles
- `event_type` - Event categories
- `submission_type` - Submission object types
- `submission_status` - Submission review status

### Tables (7 core tables)

#### 1. states
All US states with homeschooling regulation levels.
- Primary features: abbreviation & slug (unique), regulation_level enum
- Indexes: abbreviation, slug
- RLS: Public read, admin write

#### 2. profiles
User profiles extending Supabase auth.users.
- Primary features: display_name, role, state_id, city
- Indexes: state_id, role, created_at
- RLS: Public read, self-update, admin delete

#### 3. resources
Local homeschooling resources (co-ops, tutors, support groups, enrichment, etc.).
- Primary features: type enum, verified flag, geographic coordinates
- Features array for tags (wheelchair-accessible, Spanish-speaking, etc.)
- Indexes: state_id, type, verified, created_at, city_state, coordinates
- Full-text search: name + description
- RLS: Public read (verified only), authenticated create, self-update, admin verify

#### 4. curricula
Homeschool curriculum programs.
- Primary features: approach enum, format enum, subjects array
- Verified flag, religious_affiliation tracking
- Indexes: verified, created_at, approach, format, name
- Full-text search: name + description + publisher
- RLS: Public read (verified only), authenticated create, admin verify

#### 5. curriculum_reviews
User reviews and ratings for curricula.
- Primary features: rating (1-5), pros/cons arrays, helpful_count
- Links to curriculum and user profile
- Indexes: curriculum_id, user_id, rating, created_at
- RLS: Public read (verified curricula), authenticated create, self-update/delete

#### 6. events
Homeschool events (conferences, workshops, field trips, meetups, etc.).
- Primary features: event_type enum, recurring flag, geographic coordinates
- Start/end dates with optional venue information
- Indexes: state_id, event_type, start_date, created_at, city_state, coordinates
- Full-text search: title + description
- RLS: Public read, authenticated create, self-update

#### 7. submissions
Queue for pending submissions (resources, curricula, events).
- Primary features: type enum, status enum, JSONB data field
- Submitter email tracking and reviewer notes
- Indexes: status, type, created_at, reviewed_at
- RLS: Authenticated create, submitter read own, admin full access

### Features

#### Row Level Security (RLS)
- 26 granular policies across all tables
- Public read access for verified content
- Authenticated users can submit resources, curricula, events, and reviews
- Users can update their own profile and submissions
- Only admins can verify content and manage submissions

#### Indexes
- 35+ indexes for query optimization
- Foreign key indexes for relational integrity
- Full-text search indexes for resource discovery
- Spatial indexes for geographic queries (coordinates)
- Compound indexes for common filter combinations

#### Triggers
- Automatic updated_at timestamp on all mutable tables
- Using reusable `update_updated_at_column()` function

#### Data Integrity
- UUID primary keys for distributed systems
- Foreign key constraints with appropriate ON DELETE behavior
- Check constraints (e.g., rating 1-5)
- Unique constraints on natural keys (state abbreviations, slugs)
- Type safety with enums throughout

#### Full-Text Search
- resources: search on name + description
- curricula: search on name + description + publisher
- events: search on title + description

## Setup Instructions

1. Create a new Supabase project
2. Open the SQL editor in Supabase dashboard
3. Copy and paste the entire contents of `schema.sql`
4. Execute the SQL
5. (Optional) Run `seed.sql` to populate sample data for testing

## Sample Data

### States (15 populated for testing)
California, Texas, Florida, New York, Pennsylvania, Ohio, Illinois, North Carolina, Colorado, Washington, Massachusetts, Georgia, Virginia, Tennessee, Arizona

### Resources (10 samples)
- Co-ops: Silicon Valley Homeschool Co-op
- Tutors: Dallas Christian Homeschool Tutorial
- Support Groups: NYC Homeschool Support Network
- Enrichment: Miami STEM, Houston Arts Collective, Florida Outdoor Education
- Sports: Philadelphia Youth Basketball League
- Field Trips: Boston Museum Co-Op Program
- Online: Texas Online Learning Academy
- Testing: California Testing & Evaluation Center

### Curricula (5 samples)
- Well-Trained Mind (Classical)
- Charlotte Mason Nature Study (Charlotte Mason)
- Saxon Math (Traditional)
- Khan Academy (Online)
- Montessori at Home (Montessori)

### Events (3 samples)
- California Homeschool Convention (May 15-17, 2026)
- Texas Co-Op Day Workshop (April 10, 2026)
- NYC Spring Homeschool Field Trip (May 2, 2026)

## Common Queries

### Find verified resources in a state
```sql
SELECT * FROM resources 
WHERE state_id = (SELECT id FROM states WHERE abbreviation = 'CA')
AND verified = TRUE
ORDER BY created_at DESC;
```

### Search resources by location and type
```sql
SELECT * FROM resources 
WHERE type = 'co-op'
AND state_id = (SELECT id FROM states WHERE abbreviation = 'TX')
AND verified = TRUE
LIMIT 20;
```

### Full-text search resources
```sql
SELECT * FROM resources 
WHERE to_tsvector('english', name || ' ' || COALESCE(description, '')) 
@@ plainto_tsquery('english', 'STEM math tutoring')
AND verified = TRUE;
```

### Get high-rated curricula
```sql
SELECT c.*, AVG(cr.rating) as avg_rating, COUNT(cr.id) as review_count
FROM curricula c
LEFT JOIN curriculum_reviews cr ON c.id = cr.curriculum_id
WHERE c.verified = TRUE
GROUP BY c.id
HAVING AVG(cr.rating) >= 4.0
ORDER BY avg_rating DESC;
```

## Expansion Ideas

- Add comments/discussions table for community feedback
- Implement messaging between users
- Add curriculum comparison features
- Create resource ratings/reviews
- Implement favorites/bookmarks for users
- Add newsletter/subscription management
- Create analytics for popular resources and curricula
- Implement admin moderation queue for content
- Add resource images/media storage
