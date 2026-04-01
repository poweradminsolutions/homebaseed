-- Favorites/Collections Table
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_type VARCHAR(50) NOT NULL, -- 'resource', 'curriculum', 'co-op'
  resource_id VARCHAR(255) NOT NULL,  -- Can reference any type of listing
  collection_name VARCHAR(100) DEFAULT 'Saved',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, resource_type, resource_id)
);

-- Resource Reviews Table (for co-ops, local resources, and curricula)
CREATE TABLE resource_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_type VARCHAR(50) NOT NULL,
  resource_id VARCHAR(255) NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  body TEXT,
  helpful_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, resource_type, resource_id)
);

-- Forum Posts Table
CREATE TABLE forum_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  category VARCHAR(50) NOT NULL, -- 'general', 'curriculum', 'co-ops', 'state-laws', 'special-needs', 'getting-started'
  state VARCHAR(50),
  reply_count INT NOT NULL DEFAULT 0,
  like_count INT NOT NULL DEFAULT 0,
  pinned BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Forum Replies Table
CREATE TABLE forum_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  like_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Forum Likes Table
CREATE TABLE forum_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  reply_id UUID REFERENCES forum_replies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, post_id),
  CHECK (post_id IS NOT NULL OR reply_id IS NOT NULL)
);

-- Email Digest Preferences Table
CREATE TABLE digest_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  weekly_digest BOOLEAN NOT NULL DEFAULT TRUE,
  new_listings_alerts BOOLEAN NOT NULL DEFAULT FALSE,
  forum_reply_alerts BOOLEAN NOT NULL DEFAULT TRUE,
  state_filter VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_resource_type ON favorites(resource_type, resource_id);
CREATE INDEX idx_resource_reviews_user_id ON resource_reviews(user_id);
CREATE INDEX idx_resource_reviews_resource ON resource_reviews(resource_type, resource_id);
CREATE INDEX idx_forum_posts_user_id ON forum_posts(user_id);
CREATE INDEX idx_forum_posts_category ON forum_posts(category);
CREATE INDEX idx_forum_posts_created_at ON forum_posts(created_at DESC);
CREATE INDEX idx_forum_replies_post_id ON forum_replies(post_id);
CREATE INDEX idx_forum_replies_user_id ON forum_replies(user_id);
CREATE INDEX idx_forum_likes_post_id ON forum_likes(post_id);
CREATE INDEX idx_forum_likes_reply_id ON forum_likes(reply_id);

-- Enable RLS (Row Level Security)
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE digest_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for favorites
CREATE POLICY "Users can view their own favorites"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own favorites"
  ON favorites FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for resource_reviews
CREATE POLICY "Everyone can view reviews"
  ON resource_reviews FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON resource_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON resource_reviews FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
  ON resource_reviews FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for forum_posts
CREATE POLICY "Everyone can view forum posts"
  ON forum_posts FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create forum posts"
  ON forum_posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own forum posts"
  ON forum_posts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own forum posts"
  ON forum_posts FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for forum_replies
CREATE POLICY "Everyone can view forum replies"
  ON forum_replies FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create forum replies"
  ON forum_replies FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own forum replies"
  ON forum_replies FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own forum replies"
  ON forum_replies FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for forum_likes
CREATE POLICY "Everyone can view forum likes"
  ON forum_likes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create forum likes"
  ON forum_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own forum likes"
  ON forum_likes FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for digest_preferences
CREATE POLICY "Users can view their own digest preferences"
  ON digest_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own digest preferences"
  ON digest_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own digest preferences"
  ON digest_preferences FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Trigger to update forum_posts updated_at
CREATE OR REPLACE FUNCTION update_forum_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER forum_posts_updated_at_trigger
BEFORE UPDATE ON forum_posts
FOR EACH ROW
EXECUTE FUNCTION update_forum_posts_updated_at();

-- Trigger to update digest_preferences updated_at
CREATE OR REPLACE FUNCTION update_digest_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER digest_preferences_updated_at_trigger
BEFORE UPDATE ON digest_preferences
FOR EACH ROW
EXECUTE FUNCTION update_digest_preferences_updated_at();
