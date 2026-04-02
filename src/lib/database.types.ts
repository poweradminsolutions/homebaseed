export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      curricula: {
        Row: {
          id: string
          name: string
          publisher: string | null
          subjects: string[] | null
          grade_range: string | null
          approach: Database["public"]["Enums"]["curriculum_approach"] | null
          format: Database["public"]["Enums"]["curriculum_format"]
          price_range: string | null
          religious_affiliation: string | null
          description: string | null
          website: string | null
          features: string[] | null
          verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          publisher?: string | null
          subjects?: string[] | null
          grade_range?: string | null
          approach?: Database["public"]["Enums"]["curriculum_approach"] | null
          format: Database["public"]["Enums"]["curriculum_format"]
          price_range?: string | null
          religious_affiliation?: string | null
          description?: string | null
          website?: string | null
          features?: string[] | null
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          publisher?: string | null
          subjects?: string[] | null
          grade_range?: string | null
          approach?: Database["public"]["Enums"]["curriculum_approach"] | null
          format?: Database["public"]["Enums"]["curriculum_format"]
          price_range?: string | null
          religious_affiliation?: string | null
          description?: string | null
          website?: string | null
          features?: string[] | null
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      curriculum_reviews: {
        Row: {
          id: string
          curriculum_id: string
          user_id: string
          rating: number
          title: string | null
          body: string | null
          grade_used: string | null
          years_used: string | null
          pros: string[] | null
          cons: string[] | null
          helpful_count: number
          created_at: string
        }
        Insert: {
          id?: string
          curriculum_id: string
          user_id: string
          rating: number
          title?: string | null
          body?: string | null
          grade_used?: string | null
          years_used?: string | null
          pros?: string[] | null
          cons?: string[] | null
          helpful_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          curriculum_id?: string
          user_id?: string
          rating?: number
          title?: string | null
          body?: string | null
          grade_used?: string | null
          years_used?: string | null
          pros?: string[] | null
          cons?: string[] | null
          helpful_count?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "curriculum_reviews_curriculum_id_fkey"
            columns: ["curriculum_id"]
            isOneToOne: false
            referencedRelation: "curricula"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "curriculum_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          event_type: Database["public"]["Enums"]["event_type"]
          start_date: string
          end_date: string | null
          recurring: boolean
          city: string
          state_id: string
          zip_code: string | null
          venue_name: string | null
          address: string | null
          latitude: number | null
          longitude: number | null
          website: string | null
          contact_email: string | null
          cost: string | null
          age_range: string | null
          submitted_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          event_type: Database["public"]["Enums"]["event_type"]
          start_date: string
          end_date?: string | null
          recurring?: boolean
          city: string
          state_id: string
          zip_code?: string | null
          venue_name?: string | null
          address?: string | null
          latitude?: number | null
          longitude?: number | null
          website?: string | null
          contact_email?: string | null
          cost?: string | null
          age_range?: string | null
          submitted_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          event_type?: Database["public"]["Enums"]["event_type"]
          start_date?: string
          end_date?: string | null
          recurring?: boolean
          city?: string
          state_id?: string
          zip_code?: string | null
          venue_name?: string | null
          address?: string | null
          latitude?: number | null
          longitude?: number | null
          website?: string | null
          contact_email?: string | null
          cost?: string | null
          age_range?: string | null
          submitted_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_state_id_fkey"
            columns: ["state_id"]
            isOneToOne: false
            referencedRelation: "states"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          id: string
          display_name: string | null
          email: string
          state_id: string | null
          city: string | null
          role: Database["public"]["Enums"]["user_role"]
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name?: string | null
          email: string
          state_id?: string | null
          city?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          display_name?: string | null
          email?: string
          state_id?: string | null
          city?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_state_id_fkey"
            columns: ["state_id"]
            isOneToOne: false
            referencedRelation: "states"
            referencedColumns: ["id"]
          },
        ]
      }
      resources: {
        Row: {
          id: string
          name: string
          type: Database["public"]["Enums"]["resource_type"]
          description: string | null
          website: string | null
          email: string | null
          phone: string | null
          city: string
          state_id: string
          zip_code: string | null
          latitude: number | null
          longitude: number | null
          age_range: string | null
          meeting_schedule: string | null
          cost: string | null
          religious_affiliation: string | null
          features: string[] | null
          submitted_by: string | null
          verified: boolean
          created_at: string
          updated_at: string
          google_rating: number | null
          google_review_count: number | null
          google_place_id: string | null
          primary_categories: string[] | null
          activity_types: string[] | null
          setting_tags: string[] | null
          age_range_tags: string[] | null
          cost_tag: string | null
          enrollment_status: string | null
          curriculum_approach: string | null
          parent_involvement: string | null
          accredited: boolean | null
          group_size_range: string | null
          booking_url: string | null
          has_online_enrollment: boolean | null
          image_url: string | null
          thumbnail_url: string | null
          editorial_summary: string | null
          what_to_expect: string | null
          best_for_text: string | null
          seo_title: string | null
          seo_description: string | null
          last_verified: string | null
          data_source: string | null
        }
        Insert: {
          id?: string
          name: string
          type: Database["public"]["Enums"]["resource_type"]
          description?: string | null
          website?: string | null
          email?: string | null
          phone?: string | null
          city: string
          state_id: string
          zip_code?: string | null
          latitude?: number | null
          longitude?: number | null
          age_range?: string | null
          meeting_schedule?: string | null
          cost?: string | null
          religious_affiliation?: string | null
          features?: string[] | null
          submitted_by?: string | null
          verified?: boolean
          created_at?: string
          updated_at?: string
          google_rating?: number | null
          google_review_count?: number | null
          google_place_id?: string | null
          primary_categories?: string[] | null
          activity_types?: string[] | null
          setting_tags?: string[] | null
          age_range_tags?: string[] | null
          cost_tag?: string | null
          enrollment_status?: string | null
          curriculum_approach?: string | null
          parent_involvement?: string | null
          accredited?: boolean | null
          group_size_range?: string | null
          booking_url?: string | null
          has_online_enrollment?: boolean | null
          image_url?: string | null
          thumbnail_url?: string | null
          editorial_summary?: string | null
          what_to_expect?: string | null
          best_for_text?: string | null
          seo_title?: string | null
          seo_description?: string | null
          last_verified?: string | null
          data_source?: string | null
        }
        Update: {
          id?: string
          name?: string
          type?: Database["public"]["Enums"]["resource_type"]
          description?: string | null
          website?: string | null
          email?: string | null
          phone?: string | null
          city?: string
          state_id?: string
          zip_code?: string | null
          latitude?: number | null
          longitude?: number | null
          age_range?: string | null
          meeting_schedule?: string | null
          cost?: string | null
          religious_affiliation?: string | null
          features?: string[] | null
          submitted_by?: string | null
          verified?: boolean
          created_at?: string
          updated_at?: string
          google_rating?: number | null
          google_review_count?: number | null
          google_place_id?: string | null
          primary_categories?: string[] | null
          activity_types?: string[] | null
          setting_tags?: string[] | null
          age_range_tags?: string[] | null
          cost_tag?: string | null
          enrollment_status?: string | null
          curriculum_approach?: string | null
          parent_involvement?: string | null
          accredited?: boolean | null
          group_size_range?: string | null
          booking_url?: string | null
          has_online_enrollment?: boolean | null
          image_url?: string | null
          thumbnail_url?: string | null
          editorial_summary?: string | null
          what_to_expect?: string | null
          best_for_text?: string | null
          seo_title?: string | null
          seo_description?: string | null
          last_verified?: string | null
          data_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resources_state_id_fkey"
            columns: ["state_id"]
            isOneToOne: false
            referencedRelation: "states"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resources_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      states: {
        Row: {
          id: string
          name: string
          abbreviation: string
          slug: string
          regulation_level: Database["public"]["Enums"]["regulation_level"]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          abbreviation: string
          slug: string
          regulation_level?: Database["public"]["Enums"]["regulation_level"]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          abbreviation?: string
          slug?: string
          regulation_level?: Database["public"]["Enums"]["regulation_level"]
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          resource_type: string
          resource_id: string
          collection_name: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          resource_type: string
          resource_id: string
          collection_name?: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          resource_type?: string
          resource_id?: string
          collection_name?: string
          notes?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      resource_reviews: {
        Row: {
          id: string
          resource_type: string
          resource_id: string
          user_id: string
          rating: number
          title: string | null
          body: string | null
          created_at: string
        }
        Insert: {
          id?: string
          resource_type: string
          resource_id: string
          user_id: string
          rating: number
          title?: string | null
          body?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          resource_type?: string
          resource_id?: string
          user_id?: string
          rating?: number
          title?: string | null
          body?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "resource_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_posts: {
        Row: {
          id: string
          title: string
          body: string
          category: string
          author_id: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          body: string
          category: string
          author_id: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          body?: string
          category?: string
          author_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_replies: {
        Row: {
          id: string
          post_id: string
          body: string
          author_id: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          body: string
          author_id: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          body?: string
          author_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_replies_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_replies_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_likes: {
        Row: {
          id: string
          post_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_reply_likes: {
        Row: {
          id: string
          reply_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          reply_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          reply_id?: string
          user_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_reply_likes_reply_id_fkey"
            columns: ["reply_id"]
            isOneToOne: false
            referencedRelation: "forum_replies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_reply_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      digest_preferences: {
        Row: {
          id: string
          user_id: string
          weekly_digest: boolean
          new_listing_alerts: boolean
          forum_reply_alerts: boolean
          state_filter: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          weekly_digest?: boolean
          new_listing_alerts?: boolean
          forum_reply_alerts?: boolean
          state_filter?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          weekly_digest?: boolean
          new_listing_alerts?: boolean
          forum_reply_alerts?: boolean
          state_filter?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "digest_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      submissions: {
        Row: {
          id: string
          type: Database["public"]["Enums"]["submission_type"]
          data: Json
          submitter_name: string | null
          submitter_email: string | null
          status: Database["public"]["Enums"]["submission_status"]
          reviewer_notes: string | null
          created_at: string
          reviewed_at: string | null
        }
        Insert: {
          id?: string
          type: Database["public"]["Enums"]["submission_type"]
          data: Json
          submitter_name?: string | null
          submitter_email?: string | null
          status?: Database["public"]["Enums"]["submission_status"]
          reviewer_notes?: string | null
          created_at?: string
          reviewed_at?: string | null
        }
        Update: {
          id?: string
          type?: Database["public"]["Enums"]["submission_type"]
          data?: Json
          submitter_name?: string | null
          submitter_email?: string | null
          status?: Database["public"]["Enums"]["submission_status"]
          reviewer_notes?: string | null
          created_at?: string
          reviewed_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Enums: {
      curriculum_approach:
        | "classical"
        | "charlotte-mason"
        | "traditional"
        | "montessori"
        | "unschooling"
        | "eclectic"
        | "online"
        | "unit-study"
      curriculum_format: "physical" | "digital" | "hybrid"
      event_type:
        | "field-trip"
        | "workshop"
        | "meetup"
        | "conference"
        | "co-op-day"
        | "testing"
      regulation_level: "low" | "moderate" | "high"
      resource_type:
        | "co-op"
        | "tutor"
        | "support-group"
        | "enrichment"
        | "sports"
        | "field-trip"
        | "online-community"
        | "testing-center"
      submission_status: "pending" | "approved" | "rejected"
      submission_type: "resource" | "curriculum" | "event"
      user_role: "parent" | "educator" | "admin" | "contributor"
    }
    Functions: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & { schema: "public" })
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        { schema: "public" })
    ? (PublicSchema["Tables"] & {
        schema: "public"
      })[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & { schema: "public" })
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        { schema: "public" })
    ? (PublicSchema["Tables"] & {
        schema: "public"
      })[PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & { schema: "public" })
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        { schema: "public" })
    ? (PublicSchema["Tables"] & {
        schema: "public"
      })[PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<EnumName extends keyof (PublicSchema["Enums"] & {
  schema: "public"
})> = (PublicSchema["Enums"] & {
  schema: "public"
})[EnumName]
