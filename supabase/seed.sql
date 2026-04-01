-- HomebaseED Sample Data / Seed File
-- Contains sample states, resources, curricula, and events for testing

-- ============================================================================
-- STATES (Sample - Full list can be populated separately)
-- ============================================================================

INSERT INTO states (name, abbreviation, slug, regulation_level) VALUES
('California', 'CA', 'california', 'moderate'),
('Texas', 'TX', 'texas', 'low'),
('Florida', 'FL', 'florida', 'moderate'),
('New York', 'NY', 'new-york', 'high'),
('Pennsylvania', 'PA', 'pennsylvania', 'moderate'),
('Ohio', 'OH', 'ohio', 'moderate'),
('Illinois', 'IL', 'illinois', 'moderate'),
('North Carolina', 'NC', 'north-carolina', 'low'),
('Colorado', 'CO', 'colorado', 'low'),
('Washington', 'WA', 'washington', 'moderate'),
('Massachusetts', 'MA', 'massachusetts', 'high'),
('Georgia', 'GA', 'georgia', 'low'),
('Virginia', 'VA', 'virginia', 'moderate'),
('Tennessee', 'TN', 'tennessee', 'low'),
('Arizona', 'AZ', 'arizona', 'low');

-- ============================================================================
-- SAMPLE RESOURCES (10 local homeschool resources)
-- ============================================================================

-- Get CA state id for resources
WITH ca_state AS (
  SELECT id FROM states WHERE abbreviation = 'CA'
),
tx_state AS (
  SELECT id FROM states WHERE abbreviation = 'TX'
),
ny_state AS (
  SELECT id FROM states WHERE abbreviation = 'NY'
),
fl_state AS (
  SELECT id FROM states WHERE abbreviation = 'FL'
),
pa_state AS (
  SELECT id FROM states WHERE abbreviation = 'PA'
)

INSERT INTO resources (
  name, type, description, website, email, phone,
  city, state_id, zip_code, latitude, longitude,
  age_range, meeting_schedule, cost, religious_affiliation,
  features, verified
) VALUES

-- 1. Silicon Valley Homeschool Co-op
(
  'Silicon Valley Homeschool Co-op',
  'co-op',
  'Multi-family co-operative providing math, science, and literature classes for elementary and middle school students. Focus on STEM and classical education methods.',
  'https://svhomeschoolcoop.org',
  'info@svhomeschoolcoop.org',
  '(408) 555-0101',
  'San Jose',
  (SELECT id FROM ca_state),
  '95110',
  37.3382,
  -121.8863,
  '6-14 years',
  'Tuesday & Thursday mornings, 9am-12pm',
  '$150-200/month',
  'Secular',
  ARRAY['STEM-focused', 'Classical approach', 'Small groups', 'Experienced instructors'],
  true
),

-- 2. Dallas Christian Homeschool Tutorial
(
  'Dallas Christian Homeschool Tutorial',
  'tutor',
  'Individual and small group tutoring for all subjects. Certified teachers with 15+ years experience. Specializing in math remediation and college prep.',
  'https://dallaschristiantutor.com',
  'tutors@dallaschristiantutor.com',
  '(214) 555-0202',
  'Dallas',
  (SELECT id FROM tx_state),
  '75201',
  32.7767,
  -96.7970,
  '1-18 years',
  'Flexible scheduling',
  '$40-75/hour',
  'Christian',
  ARRAY['Certified teachers', 'One-on-one available', 'SAT/ACT prep', 'Flexible hours'],
  true
),

-- 3. NYC Homeschool Support Network
(
  'NYC Homeschool Support Network',
  'support-group',
  'Monthly gatherings for homeschooling parents to share resources, discuss challenges, and build community. Field trips and group activities included.',
  'https://nychomeschoolnetwork.org',
  'connect@nychomeschoolnetwork.org',
  '(212) 555-0303',
  'New York',
  (SELECT id FROM ny_state),
  '10001',
  40.7128,
  -74.0060,
  'All ages',
  'First Saturday of each month, 10am',
  'Free (donations welcome)',
  'Interfaith',
  ARRAY['Community-driven', 'Monthly meetings', 'Field trips', 'Parent support'],
  true
),

-- 4. Miami STEM Enrichment Center
(
  'Miami STEM Enrichment Center',
  'enrichment',
  'After-school and summer programs featuring robotics, coding, engineering challenges, and scientific experimentation. Hand-on learning environment.',
  'https://miamistem.edu',
  'programs@miamistem.edu',
  '(305) 555-0404',
  'Miami',
  (SELECT id FROM fl_state),
  '33101',
  25.7617,
  -80.1918,
  '8-16 years',
  'After-school: Mon-Fri 3-5pm; Summer camps',
  '$200-500/session',
  'Secular',
  ARRAY['Robotics', 'Coding', 'Engineering', 'Summer camps', 'Small class sizes'],
  true
),

-- 5. Philadelphia Youth Basketball League
(
  'Philadelphia Youth Basketball League',
  'sports',
  'Recreational and competitive basketball leagues for homeschooled youth. Focus on skill development, teamwork, and physical fitness. Co-ed leagues.',
  'https://phillyhoopsleague.com',
  'register@phillyhoopsleague.com',
  '(215) 555-0505',
  'Philadelphia',
  (SELECT id FROM pa_state),
  '19102',
  39.9526,
  -75.1652,
  '10-18 years',
  'Winter season: Dec-Feb; Spring: Apr-May',
  '$75-150/season',
  'Secular',
  ARRAY['Recreational & competitive', 'Co-ed', 'Skill development', 'Community focus'],
  false
),

-- 6. Boston Museum Co-Op Program
(
  'Boston Museum Co-Op Program',
  'field-trip',
  'Structured field trip program visiting Boston museums, historical sites, and cultural institutions. Includes curriculum guides and educator-led activities.',
  'https://bostonmuseum-coop.org',
  'fieldtrips@bostonmuseum-coop.org',
  '(617) 555-0606',
  'Boston',
  (SELECT id FROM pa_state),
  '02101',
  42.3601,
  -71.0589,
  '6-18 years',
  'Monthly field trips, flexible scheduling',
  '$25-40/trip',
  'Secular',
  ARRAY['Museum visits', 'Historical sites', 'Curriculum guides', 'Educator-led'],
  true
),

-- 7. Texas Online Learning Academy
(
  'Texas Online Learning Academy',
  'online-community',
  'Virtual homeschool community with live online classes, discussion forums, resource library, and synchronous learning opportunities across time zones.',
  'https://texasonlineacademy.com',
  'support@texasonlineacademy.com',
  '(512) 555-0707',
  'Austin',
  (SELECT id FROM tx_state),
  '78701',
  30.2672,
  -97.7431,
  '9-18 years',
  'Ongoing - Asynchronous and live classes',
  '$99-299/month',
  'Secular',
  ARRAY['Live classes', 'Discussion forums', 'Resource library', 'Virtual community'],
  true
),

-- 8. California Testing & Evaluation Center
(
  'California Testing & Evaluation Center',
  'testing-center',
  'Standardized testing administration for homeschoolers. Offers PSAT, SAT, ACT, and other assessments in a professional testing environment.',
  'https://catestingcenter.com',
  'testing@catestingcenter.com',
  '(510) 555-0808',
  'Oakland',
  (SELECT id FROM ca_state),
  '94607',
  37.8044,
  -122.2712,
  '13-18 years',
  'Testing dates throughout year, by appointment',
  '$50-150/test',
  'Secular',
  ARRAY['SAT/ACT', 'PSAT', 'Professional proctoring', 'Accessible location'],
  true
),

-- 9. Houston Homeschool Arts Collective
(
  'Houston Homeschool Arts Collective',
  'enrichment',
  'Visual arts, performing arts, and creative writing programs for homeschooled students. Studio-based learning with professional artist instructors.',
  'https://houstonartscollective.org',
  'classes@houstoncollective.org',
  '(713) 555-0909',
  'Houston',
  (SELECT id FROM tx_state),
  '77001',
  29.7604,
  -95.3698,
  '7-18 years',
  'Semester classes: Fall & Spring',
  '$120-180/class',
  'Secular',
  ARRAY['Visual arts', 'Performing arts', 'Creative writing', 'Professional instructors'],
  true
),

-- 10. Florida Outdoor Education Association
(
  'Florida Outdoor Education Association',
  'enrichment',
  'Wilderness skills, nature studies, and outdoor adventure programs. Activities include kayaking, hiking, environmental science, and survival skills.',
  'https://floutdooredu.org',
  'info@floutdooredu.org',
  '(850) 555-1010',
  'Tallahassee',
  (SELECT id FROM fl_state),
  '32301',
  30.4383,
  -84.2807,
  '8-17 years',
  'Seasonal programs, weekend trips',
  '$30-100/trip',
  'Secular',
  ARRAY['Outdoor skills', 'Nature studies', 'Adventure activities', 'Environmental science'],
  false
);

-- ============================================================================
-- SAMPLE CURRICULA (5 popular curriculum programs)
-- ============================================================================

INSERT INTO curricula (
  name, publisher, subjects, grade_range,
  approach, format, price_range, religious_affiliation,
  description, website, features, verified
) VALUES

-- 1. The Well-Trained Mind Classical Curriculum
(
  'The Well-Trained Mind Classical Curriculum',
  'Well-Trained Mind Press',
  ARRAY['Literature', 'History', 'Latin', 'Logic', 'Rhetoric'],
  'K-12',
  'classical',
  'physical',
  '$400-800/year',
  'Secular',
  'Comprehensive classical education curriculum based on the Trivium model (grammar, logic, rhetoric). Extensive reading lists and structured progression through history cycles.',
  'https://www.welltrainedmind.com',
  ARRAY['Classical approach', 'Trivium model', 'Rich literature', 'History-centered', 'Independent study'],
  true
),

-- 2. Charlotte Mason Nature Study Curriculum
(
  'Charlotte Mason Nature Study Curriculum',
  'Peace Hill Press',
  ARRAY['Science', 'Nature Studies', 'Literature', 'History'],
  '1-12',
  'charlotte-mason',
  'hybrid',
  '$200-500/year',
  'Christian',
  'Nature-focused curriculum emphasizing observation, sketching, and narration. Combines nature studies with literature and history in an integrated approach.',
  'https://www.peacehillpress.com',
  ARRAY['Nature-focused', 'Narration method', 'Art integration', 'Living books', 'Observation-based'],
  true
),

-- 3. Saxon Math
(
  'Saxon Math',
  'Saxon Publishers',
  ARRAY['Mathematics'],
  'K-12',
  'traditional',
  'physical',
  '$80-150/year',
  'Secular',
  'Incremental and spiral approach to math instruction with daily problem sets and assessments. Comprehensive coverage with emphasis on problem-solving strategies.',
  'https://www.saxonmath.com',
  ARRAY['Spiral approach', 'Daily practice', 'Problem-solving', 'Comprehensive', 'Assessment tools'],
  true
),

-- 4. Khan Academy Online Learning
(
  'Khan Academy',
  'Khan Academy',
  ARRAY['Math', 'Science', 'History', 'ELA', 'Computing'],
  '1-12',
  'online',
  'digital',
  'Free (premium available)',
  'Secular',
  'Free online video lessons and practice exercises. Comprehensive coverage across subjects with flexible pacing. Excellent for self-paced learning and supplementation.',
  'https://www.khanacademy.org',
  ARRAY['Free', 'Video lessons', 'Interactive practice', 'Self-paced', 'Comprehensive', 'Flexible'],
  true
),

-- 5. Montessori at Home Curriculum
(
  'Montessori at Home Curriculum',
  'Montessori for Everyone',
  ARRAY['Life Skills', 'Mathematics', 'Language', 'Sensorial', 'Cultural Studies'],
  'Preschool-Elementary',
  'montessori',
  'hybrid',
  '$300-600/year',
  'Secular',
  'Child-centered Montessori approach adapted for home learning. Includes materials lists, activity guides, and philosophy overview for parent-led instruction.',
  'https://www.montessoriforeveryone.com',
  ARRAY['Child-centered', 'Hands-on materials', 'Life skills', 'Montessori method', 'Parent-friendly'],
  false
);

-- ============================================================================
-- SAMPLE EVENTS (3 homeschool events)
-- ============================================================================

WITH ca_state AS (
  SELECT id FROM states WHERE abbreviation = 'CA'
),
tx_state AS (
  SELECT id FROM states WHERE abbreviation = 'TX'
),
ny_state AS (
  SELECT id FROM states WHERE abbreviation = 'NY'
)

INSERT INTO events (
  title, description, event_type,
  start_date, end_date, recurring,
  city, state_id, zip_code, venue_name, address,
  latitude, longitude,
  website, contact_email, cost, age_range
) VALUES

-- 1. California Homeschool Convention
(
  'California Homeschool Convention 2026',
  'Annual statewide homeschool convention featuring keynote speakers, vendor hall, workshops, and networking opportunities for homeschooling families.',
  'conference',
  '2026-05-15',
  '2026-05-17',
  true,
  'Pasadena',
  (SELECT id FROM ca_state),
  '91101',
  'Pasadena Convention Center',
  '131 N. Euclid Ave, Pasadena, CA 91101',
  34.1478,
  -118.1445,
  'https://cahomeschoolconvention.com',
  'info@cahomeschoolconvention.com',
  '$45-80 per person',
  'All ages'
),

-- 2. Texas Co-Op Day Workshop
(
  'Texas Homeschool Co-Op Day Workshop',
  'Interactive workshops for co-op leaders and homeschooling families. Topics include co-op management, curriculum selection, socialization strategies, and parent encouragement.',
  'workshop',
  '2026-04-10',
  '2026-04-10',
  false,
  'Austin',
  (SELECT id FROM tx_state),
  '78701',
  'Austin Convention Center',
  '500 E. Cesar Chavez St, Austin, TX 78701',
  30.2668,
  -97.7396,
  'https://texashomeschoolcoop.org',
  'register@texashomeschoolcoop.org',
  '$25-40 per person',
  'Parents and educators'
),

-- 3. NYC Spring Homeschool Field Trip Day
(
  'NYC Spring Homeschool Field Trip Day',
  'Organized group field trip to the American Museum of Natural History with included curriculum guide. Group rates and educator-led exploration available.',
  'field-trip',
  '2026-05-02',
  '2026-05-02',
  false,
  'New York',
  (SELECT id FROM ny_state),
  '10024',
  'American Museum of Natural History',
  'Central Park West at 79th St, New York, NY 10024',
  40.7813,
  -73.9740,
  'https://nycfieldtrips.org',
  'trips@nycfieldtrips.org',
  '$18-25 per student',
  '6-18 years'
);

-- ============================================================================
-- SAMPLE CURRICULUM REVIEWS
-- ============================================================================

-- Note: Requires existing profiles and curricula
-- Add sample reviews once user profiles are created in the application
-- Example structure (commented out - requires valid profile IDs):

-- INSERT INTO curriculum_reviews (
--   curriculum_id, user_id, rating, title, body,
--   grade_used, years_used, pros, cons
-- ) VALUES
-- (
--   (SELECT id FROM curricula WHERE name = 'Saxon Math' LIMIT 1),
--   (SELECT id FROM profiles LIMIT 1),
--   5,
--   'Excellent incremental approach',
--   'Saxon Math has been wonderful for our students. The incremental spiral approach allows mastery of concepts before moving on. Daily practice builds confidence.',
--   '8-10',
--   '3 years',
--   ARRAY['Incremental approach', 'Daily practice', 'Well-organized', 'Excellent support'],
--   ARRAY['Expensive', 'Can feel tedious for advanced students']
-- );

-- ============================================================================
-- DATA VALIDATION & SUMMARY
-- ============================================================================

-- You can run these SELECT statements to verify the seed data was inserted correctly:

-- SELECT 'States' as table_name, COUNT(*) as record_count FROM states
-- UNION ALL SELECT 'Resources', COUNT(*) FROM resources
-- UNION ALL SELECT 'Curricula', COUNT(*) FROM curricula
-- UNION ALL SELECT 'Events', COUNT(*) FROM events;
