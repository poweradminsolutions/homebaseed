-- HomebaseED Supabase Database Schema
-- Comprehensive homeschooling directory platform

-- ============================================================================
-- ENUMS
-- ============================================================================

-- Regulation levels for states
CREATE TYPE regulation_level AS ENUM ('none', 'low', 'moderate', 'high');

-- Types of local resources
CREATE TYPE resource_type AS ENUM (
  'co-op',
  'tutor',
  'support-group',
  'enrichment',
  'sports',
  'field-trip',
  'online-community',
  'testing-center'
);

-- Curriculum teaching approaches
CREATE TYPE curriculum_approach AS ENUM (
  'classical',
  'charlotte-mason',
  'traditional',
  'montessori',
  'unschooling',
  'eclectic',
  'online',
  'unit-study'
);

-- Curriculum format types
CREATE TYPE curriculum_format AS ENUM ('physical', 'digital', 'hybrid');

-- User roles
CREATE TYPE user_role AS ENUM ('parent', 'educator', 'admin', 'contributor');

-- Event types
CREATE TYPE event_type AS ENUM (
  'field-trip',
  'workshop',
  'meetup',
  'conference',
  'co-op-day',
  'testing'
);

-- Submission types
CREATE TYPE submission_type AS ENUM ('resource', 'curriculum', 'event');

-- Submission status
CREATE TYPE submission_status AS ENUM ('pending', 'approved', 'rejected');

-- ============================================================================
-- TABLES
-- ============================================================================

-- 1. STATES TABLE
-- All 50 US states with regulatory information
CREATE TABLE states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,
  abbreviation VARCHAR(2) NOT NULL UNIQUE,
  slug VARCHAR(50) NOT NULL UNIQUE,
  regulation_level regulation_level NOT NULL DEFAULT 'moderate',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE states IS 'All 50 US states with homeschooling regulation levels';
COMMENT ON COLUMN states.regulation_level IS 'Regulatory stringency: none (no notification), low (notification required), moderate (notification + records), high (approval required)';

CREATE INDEX idx_states_abbreviation ON states(abbreviation);
CREATE INDEX idx_states_slug ON states(slug);

-- 2. PROFILES TABLE
-- Extended user profiles (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  state_id UUID REFERENCES states(id) ON DELETE SET NULL,
  city VARCHAR(100),
  role user_role NOT NULL DEFAULT 'parent',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE profiles IS 'User profiles extending Supabase authentication with homeschooling-specific info';

CREATE INDEX idx_profiles_state_id ON profiles(state_id);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_created_at ON profiles(created_at);

-- 3. RESOURCES TABLE
-- Local resources (co-ops, tutors, support groups, etc.)
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  type resource_type NOT NULL,
  description TEXT,
  website VARCHAR(500),
  email VARCHAR(255),
  phone VARCHAR(20),
  city VARCHAR(100) NOT NULL,
  state_id UUID NOT NULL REFERENCES states(id) ON DELETE CASCADE,
  zip_code VARCHAR(10),
  latitude NUMERIC(10, 8),
  longitude NUMERIC(11, 8),
  age_range VARCHAR(100),
  meeting_schedule VARCHAR(255),
  cost VARCHAR(100),
  religious_affiliation VARCHAR(255),
  features TEXT[],
  submitted_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE resources IS 'Local homeschooling resources including co-ops, tutors, support groups, and enrichment programs';
COMMENT ON COLUMN resources.features IS 'Array of feature tags like ''wheelchair-accessible'', ''Spanish-speaking'', ''STEM-focused''';
COMMENT ON COLUMN resources.verified IS 'Whether resource has been verified by admin';

CREATE INDEX idx_resources_state_id ON resources(state_id);
CREATE INDEX idx_resources_type ON resources(type);
CREATE INDEX idx_resources_verified ON resources(verified);
CREATE INDEX idx_resources_created_at ON resources(created_at);
CREATE INDEX idx_resources_city_state ON resources(city, state_id);
CREATE INDEX idx_resources_coordinates ON resources(latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Full-text search index
CREATE INDEX idx_resources_fts ON resources USING GIN(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- 4. CURRICULA TABLE
-- Curriculum program listings
CREATE TABLE curricula (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  publisher VARCHAR(255),
  subjects TEXT[],
  grade_range VARCHAR(100),
  approach curriculum_approach,
  format curriculum_format NOT NULL,
  price_range VARCHAR(100),
  religious_affiliation VARCHAR(255),
  description TEXT,
  website VARCHAR(500),
  features TEXT[],
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE curricula IS 'Homeschool curriculum programs with teaching approaches and formats';
COMMENT ON COLUMN curricula.subjects IS 'Array of subjects like ''Math'', ''Science'', ''Language Arts''';
COMMENT ON COLUMN curricula.features IS 'Array of features like ''Charlotte Mason method'', ''Interactive lessons'', ''Teacher support''';
COMMENT ON COLUMN curricula.verified IS 'Whether curriculum info has been verified';

CREATE INDEX idx_curricula_verified ON curricula(verified);
CREATE INDEX idx_curricula_created_at ON curricula(created_at);
CREATE INDEX idx_curricula_approach ON curricula(approach);
CREATE INDEX idx_curricula_format ON curricula(format);
CREATE INDEX idx_curricula_name ON curricula(name);

-- Full-text search index
CREATE INDEX idx_curricula_fts ON curricula USING GIN(to_tsvector('english', name || ' ' || COALESCE(description, '') || ' ' || COALESCE(publisher, '')));

-- 5. CURRICULUM_REVIEWS TABLE
-- User reviews of curricula
CREATE TABLE curriculum_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  curriculum_id UUID NOT NULL REFERENCES curricula(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  body TEXT,
  grade_used VARCHAR(50),
  years_used VARCHAR(50),
  pros TEXT[],
  cons TEXT[],
  helpful_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE curriculum_reviews IS 'User reviews and ratings for curricula';
COMMENT ON COLUMN curriculum_reviews.rating IS 'Rating out of 5 stars';
COMMENT ON COLUMN curriculum_reviews.pros IS 'Array of positive aspects mentioned in review';
COMMENT ON COLUMN curriculum_reviews.cons IS 'Array of negative aspects mentioned in review';

CREATE INDEX idx_curriculum_reviews_curriculum_id ON curriculum_reviews(curriculum_id);
CREATE INDEX idx_curriculum_reviews_user_id ON curriculum_reviews(user_id);
CREATE INDEX idx_curriculum_reviews_rating ON curriculum_reviews(rating);
CREATE INDEX idx_curriculum_reviews_created_at ON curriculum_reviews(created_at);

-- 6. EVENTS TABLE
-- Homeschool events and gatherings
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_type event_type NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  recurring BOOLEAN NOT NULL DEFAULT FALSE,
  city VARCHAR(100) NOT NULL,
  state_id UUID NOT NULL REFERENCES states(id) ON DELETE CASCADE,
  zip_code VARCHAR(10),
  venue_name VARCHAR(255),
  address VARCHAR(500),
  latitude NUMERIC(10, 8),
  longitude NUMERIC(11, 8),
  website VARCHAR(500),
  contact_email VARCHAR(255),
  cost VARCHAR(100),
  age_range VARCHAR(100),
  submitted_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE events IS 'Homeschool events including field trips, workshops, conferences, and meetups';
COMMENT ON COLUMN events.recurring IS 'Whether this is a recurring event';

CREATE INDEX idx_events_state_id ON events(state_id);
CREATE INDEX idx_events_event_type ON events(event_type);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_created_at ON events(created_at);
CREATE INDEX idx_events_city_state ON events(city, state_id);
CREATE INDEX idx_events_coordinates ON events(latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Full-text search index
CREATE INDEX idx_events_fts ON events USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- 7. SUBMISSIONS TABLE
-- Queue for pending resource, curriculum, and event submissions
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type submission_type NOT NULL,
  data JSONB NOT NULL,
  submitter_name VARCHAR(255),
  submitter_email VARCHAR(255),
  status submission_status NOT NULL DEFAULT 'pending',
  reviewer_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE submissions IS 'Queue for pending submissions of resources, curricula, and events awaiting admin approval';
COMMENT ON COLUMN submissions.data IS 'JSON object containing the submitted data (resource, curriculum, or event details)';
COMMENT ON COLUMN submissions.status IS 'Review status: pending (awaiting review), approved (created record), or rejected';

CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_type ON submissions(type);
CREATE INDEX idx_submissions_created_at ON submissions(created_at);
CREATE INDEX idx_submissions_reviewed_at ON submissions(reviewed_at);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- ============================================================================

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for states
CREATE TRIGGER states_update_updated_at BEFORE UPDATE ON states
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for profiles
CREATE TRIGGER profiles_update_updated_at BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for resources
CREATE TRIGGER resources_update_updated_at BEFORE UPDATE ON resources
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for curricula
CREATE TRIGGER curricula_update_updated_at BEFORE UPDATE ON curricula
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for events
CREATE TRIGGER events_update_updated_at BEFORE UPDATE ON events
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE states ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE curricula ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- ===== STATES POLICIES =====
-- States are public read-only
CREATE POLICY "Allow public read access to states"
ON states FOR SELECT USING (true);

CREATE POLICY "Allow admin insert/update states"
ON states FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);

CREATE POLICY "Allow admin update states"
ON states FOR UPDATE USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);

-- ===== PROFILES POLICIES =====
-- Users can read all profiles (public profiles)
CREATE POLICY "Allow public read access to profiles"
ON profiles FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE USING (auth.uid() = id);

-- Only admins can delete profiles
CREATE POLICY "Admins can delete profiles"
ON profiles FOR DELETE USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);

-- ===== RESOURCES POLICIES =====
-- Anyone can read verified resources
CREATE POLICY "Allow public read of verified resources"
ON resources FOR SELECT USING (verified = true);

-- Authenticated users can read all resources (for editing/moderation)
CREATE POLICY "Authenticated users can read all resources"
ON resources FOR SELECT USING (auth.role() = 'authenticated');

-- Authenticated users can create resources
CREATE POLICY "Authenticated users can create resources"
ON resources FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Users can update their own submissions
CREATE POLICY "Users can update their own resource submissions"
ON resources FOR UPDATE USING (submitted_by = auth.uid());

-- Only admins can update verified status
CREATE POLICY "Only admins can verify resources"
ON resources FOR UPDATE USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);

-- ===== CURRICULA POLICIES =====
-- Anyone can read verified curricula
CREATE POLICY "Allow public read of verified curricula"
ON curricula FOR SELECT USING (verified = true);

-- Authenticated users can read all curricula
CREATE POLICY "Authenticated users can read all curricula"
ON curricula FOR SELECT USING (auth.role() = 'authenticated');

-- Authenticated users can create curricula
CREATE POLICY "Authenticated users can create curricula"
ON curricula FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Only admins can verify curricula
CREATE POLICY "Only admins can verify curricula"
ON curricula FOR UPDATE USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);

-- ===== CURRICULUM_REVIEWS POLICIES =====
-- Anyone can read reviews for public curricula
CREATE POLICY "Allow public read of curriculum reviews"
ON curriculum_reviews FOR SELECT USING (
  curriculum_id IN (SELECT id FROM curricula WHERE verified = true)
);

-- Authenticated users can create reviews
CREATE POLICY "Authenticated users can create curriculum reviews"
ON curriculum_reviews FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Users can update/delete their own reviews
CREATE POLICY "Users can update their own reviews"
ON curriculum_reviews FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own reviews"
ON curriculum_reviews FOR DELETE USING (user_id = auth.uid());

-- ===== EVENTS POLICIES =====
-- Anyone can read verified events
CREATE POLICY "Allow public read of verified events"
ON events FOR SELECT USING (true);

-- Authenticated users can create events
CREATE POLICY "Authenticated users can create events"
ON events FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Users can update their own event submissions
CREATE POLICY "Users can update their own event submissions"
ON events FOR UPDATE USING (submitted_by = auth.uid());

-- ===== SUBMISSIONS POLICIES =====
-- Authenticated users can create submissions
CREATE POLICY "Authenticated users can create submissions"
ON submissions FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Users can read their own submissions
CREATE POLICY "Users can read their own submissions"
ON submissions FOR SELECT USING (
  submitter_email = (SELECT email FROM profiles WHERE id = auth.uid())
);

-- Admins can read all submissions
CREATE POLICY "Admins can read all submissions"
ON submissions FOR SELECT USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);

-- Only admins can update submissions
CREATE POLICY "Only admins can update submissions"
ON submissions FOR UPDATE USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);

-- ============================================================================
-- SCHEMA DOCUMENTATION
-- ============================================================================

COMMENT ON SCHEMA public IS 'HomebaseED - Homeschooling Directory Platform';

-- ============================================================================
-- MIGRATION: Add Rich Listing Data Support (Pipeline Integration)
-- ============================================================================
-- This migration adds columns to support data from scraping pipelines and
-- enriched directory listings with additional metadata, ratings, and tagging.

ALTER TABLE resources
ADD COLUMN IF NOT EXISTS google_rating NUMERIC(3, 2),
ADD COLUMN IF NOT EXISTS google_review_count INTEGER,
ADD COLUMN IF NOT EXISTS google_place_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS primary_categories TEXT[],
ADD COLUMN IF NOT EXISTS activity_types TEXT[],
ADD COLUMN IF NOT EXISTS setting_tags TEXT[],
ADD COLUMN IF NOT EXISTS age_range_tags TEXT[],
ADD COLUMN IF NOT EXISTS cost_tag VARCHAR(50),
ADD COLUMN IF NOT EXISTS enrollment_status VARCHAR(50),
ADD COLUMN IF NOT EXISTS curriculum_approach VARCHAR(255),
ADD COLUMN IF NOT EXISTS parent_involvement VARCHAR(50),
ADD COLUMN IF NOT EXISTS accredited BOOLEAN,
ADD COLUMN IF NOT EXISTS group_size_range VARCHAR(50),
ADD COLUMN IF NOT EXISTS booking_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS has_online_enrollment BOOLEAN,
ADD COLUMN IF NOT EXISTS image_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS thumbnail_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS editorial_summary TEXT,
ADD COLUMN IF NOT EXISTS what_to_expect TEXT,
ADD COLUMN IF NOT EXISTS best_for_text TEXT,
ADD COLUMN IF NOT EXISTS seo_title VARCHAR(500),
ADD COLUMN IF NOT EXISTS seo_description VARCHAR(500),
ADD COLUMN IF NOT EXISTS last_verified DATE,
ADD COLUMN IF NOT EXISTS data_source VARCHAR(50);

COMMENT ON COLUMN resources.google_rating IS 'Google Places rating (0-5)';
COMMENT ON COLUMN resources.google_review_count IS 'Number of Google Places reviews';
COMMENT ON COLUMN resources.google_place_id IS 'Google Places ID for data syncing';
COMMENT ON COLUMN resources.primary_categories IS 'Array of primary category tags from taxonomy';
COMMENT ON COLUMN resources.activity_types IS 'Array of specific activity types (e.g., "Classical Education", "STEM Classes")';
COMMENT ON COLUMN resources.setting_tags IS 'Array of delivery settings: "In-person", "Online", "Hybrid", "Outdoor"';
COMMENT ON COLUMN resources.age_range_tags IS 'Array of age groups served: "PreK (3-5)", "Elementary (6-10)", etc.';
COMMENT ON COLUMN resources.cost_tag IS 'Cost categorization: Free, Low, Moderate, Premium, Varies';
COMMENT ON COLUMN resources.enrollment_status IS 'Current enrollment: Open, Waitlist, Closed, Seasonal, Unknown';
COMMENT ON COLUMN resources.curriculum_approach IS 'Primary curriculum approach (e.g., "Classical", "Montessori", "Charlotte Mason")';
COMMENT ON COLUMN resources.parent_involvement IS 'Level of parent involvement: Required, Optional, None, Unknown';
COMMENT ON COLUMN resources.accredited IS 'Whether the resource is accredited';
COMMENT ON COLUMN resources.group_size_range IS 'Typical group size range (e.g., "10-25")';
COMMENT ON COLUMN resources.booking_url IS 'Direct booking/enrollment URL';
COMMENT ON COLUMN resources.has_online_enrollment IS 'Whether online enrollment is available';
COMMENT ON COLUMN resources.image_url IS 'Primary image URL for listing card';
COMMENT ON COLUMN resources.thumbnail_url IS 'Thumbnail image URL for search results';
COMMENT ON COLUMN resources.editorial_summary IS 'AI-generated editorial summary of the resource';
COMMENT ON COLUMN resources.what_to_expect IS 'AI-generated description of what families can expect';
COMMENT ON COLUMN resources.best_for_text IS 'AI-generated text describing which families would benefit most';
COMMENT ON COLUMN resources.seo_title IS 'SEO-optimized title for search engines';
COMMENT ON COLUMN resources.seo_description IS 'SEO-optimized meta description';
COMMENT ON COLUMN resources.last_verified IS 'Date when resource information was last verified';
COMMENT ON COLUMN resources.data_source IS 'Source of the data: "outscraper", "manual", "submitted", "crawled"';

-- Add indexes for new searchable columns
CREATE INDEX IF NOT EXISTS idx_resources_cost_tag ON resources(cost_tag);
CREATE INDEX IF NOT EXISTS idx_resources_enrollment_status ON resources(enrollment_status);
CREATE INDEX IF NOT EXISTS idx_resources_has_online_enrollment ON resources(has_online_enrollment);
CREATE INDEX IF NOT EXISTS idx_resources_data_source ON resources(data_source);
CREATE INDEX IF NOT EXISTS idx_resources_last_verified ON resources(last_verified);
CREATE INDEX IF NOT EXISTS idx_resources_google_rating ON resources(google_rating DESC);
CREATE INDEX IF NOT EXISTS idx_resources_primary_categories ON resources USING GIN(primary_categories);
CREATE INDEX IF NOT EXISTS idx_resources_activity_types ON resources USING GIN(activity_types);
CREATE INDEX IF NOT EXISTS idx_resources_setting_tags ON resources USING GIN(setting_tags);
CREATE INDEX IF NOT EXISTS idx_resources_age_range_tags ON resources USING GIN(age_range_tags);
