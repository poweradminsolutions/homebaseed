# Supabase Setup for HomebaseED

## Completed Steps

The following setup steps have been completed:

### 1. Installed @supabase/supabase-js
- Package installed with `--legacy-peer-deps` flag
- Version: 2.101.1

### 2. Created Environment Variables
- File: `.env.local`
- Contains:
  - `NEXT_PUBLIC_SUPABASE_URL=https://dapvmhwqbvfwuibbbogm.supabase.co`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_7fT1QnT07BkqIdWH8WC6kA_wAX6Fqrz`
- Already covered by `.gitignore` (pattern: `.env*`)

### 3. Created Supabase Client Utility
- File: `src/lib/supabase.ts`
- Exports: `supabase` client instance
- Ready for use throughout the Next.js application

### 4. Created TypeScript Database Types
- File: `src/lib/database.types.ts`
- Comprehensive type definitions for all tables:
  - States
  - Profiles
  - Resources
  - Curricula
  - Curriculum Reviews
  - Events
  - Submissions
- Includes all enums and relationships
- Follows Supabase conventions with Row, Insert, and Update types

## Remaining Steps

### Execute Database Schema (Manual)

Due to network restrictions in the build environment, the database schema must be executed manually using one of these methods:

#### Option 1: Using Supabase Dashboard (Recommended)
1. Go to https://app.supabase.com
2. Sign in to your project (dapvmhwqbvfwuibbbogm)
3. Navigate to SQL Editor
4. Click "New Query"
5. Copy and paste the contents of `supabase/schema.sql`
6. Click "Run" to execute
7. Repeat the process with `supabase/seed.sql` to add sample data

#### Option 2: Using psql Command Line
```bash
PGPASSWORD='@3SMd?C@+&UcGgN' psql -h db.dapvmhwqbvfwuibbbogm.supabase.co -p 5432 -U postgres -d postgres -f supabase/schema.sql
PGPASSWORD='@3SMd?C@+&UcGgN' psql -h db.dapvmhwqbvfwuibbbogm.supabase.co -p 5432 -U postgres -d postgres -f supabase/seed.sql
```

Requires `postgresql-client` to be installed.

#### Option 3: Using Python Script
```bash
python3 << 'EOF'
import psycopg2

conn = psycopg2.connect(
    host="db.dapvmhwqbvfwuibbbogm.supabase.co",
    port=5432,
    user="postgres",
    password="@3SMd?C@+&UcGgN",
    database="postgres"
)
cursor = conn.cursor()

# Execute schema
with open('supabase/schema.sql', 'r') as f:
    cursor.execute(f.read())

# Execute seed data
with open('supabase/seed.sql', 'r') as f:
    cursor.execute(f.read())

conn.commit()
cursor.close()
conn.close()
print("Database setup complete!")
EOF
```

Requires `psycopg2-binary` package.

## Database Schema Overview

### Enums
- `regulation_level`: none, low, moderate, high
- `resource_type`: co-op, tutor, support-group, enrichment, sports, field-trip, online-community, testing-center
- `curriculum_approach`: classical, charlotte-mason, traditional, montessori, unschooling, eclectic, online, unit-study
- `curriculum_format`: physical, digital, hybrid
- `user_role`: parent, educator, admin, contributor
- `event_type`: field-trip, workshop, meetup, conference, co-op-day, testing
- `submission_type`: resource, curriculum, event
- `submission_status`: pending, approved, rejected

### Tables
1. **states**: All 50 US states with homeschooling regulation levels
2. **profiles**: Extended user profiles linked to auth.users
3. **resources**: Local homeschooling resources (co-ops, tutors, etc.)
4. **curricula**: Homeschool curriculum programs
5. **curriculum_reviews**: User reviews and ratings for curricula
6. **events**: Homeschool events and gatherings
7. **submissions**: Queue for pending resource/curriculum/event submissions

All tables include:
- UUID primary keys
- Timestamp tracking (created_at, updated_at)
- Comprehensive indexes for common queries
- Full-text search indexes where applicable
- Row-level security (RLS) policies

## Usage in Next.js

### Import the Supabase client:
```typescript
import { supabase } from '@/lib/supabase';
```

### Import database types:
```typescript
import type { Database, Tables, TablesInsert, TablesUpdate } from '@/lib/database.types';

// Get a single resource
type Resource = Tables<'resources'>;

// For inserting a new resource
type ResourceInsert = TablesInsert<'resources'>;

// For updating a resource
type ResourceUpdate = TablesUpdate<'resources'>;
```

### Example query:
```typescript
const { data, error } = await supabase
  .from('resources')
  .select('*')
  .eq('state_id', stateId)
  .eq('verified', true);
```

## Next Steps

1. Execute the database schema using one of the methods above
2. Verify the schema was created by checking the Supabase dashboard
3. Start building Next.js components that use the `supabase` client
4. Implement RLS policies for proper security
5. Add authentication flow for users

## Notes

- The `.env.local` file is already in `.gitignore`, so credentials won't be committed
- The database uses Row-Level Security (RLS) for fine-grained access control
- All user-submitted data goes through a submissions queue for admin approval
- The schema includes comprehensive indexes for optimal query performance
