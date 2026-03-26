export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      vyve_users: {
        Row: {
          id: string;
          phone: string | null;
          country_code: string;
          city: string | null;
          age: number | null;
          subscription_tier: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          phone?: string | null;
          country_code?: string;
          city?: string | null;
          age?: number | null;
          subscription_tier?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          phone?: string | null;
          country_code?: string;
          city?: string | null;
          age?: number | null;
          subscription_tier?: string;
          updated_at?: string;
        };
      };
      vyve_quiz_responses: {
        Row: {
          id: string;
          user_id: string | null;
          session_id: string;
          country_code: string;
          answers: Json;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          session_id: string;
          country_code?: string;
          answers: Json;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          user_id?: string | null;
          answers?: Json;
          completed_at?: string | null;
        };
      };
      vyve_scores: {
        Row: {
          id: string;
          user_id: string | null;
          session_id: string;
          quiz_response_id: string;
          financial_score: number;
          career_score: number;
          health_score: number;
          emotional_state: string;
          composite_score: number;
          cohort_key: string;
          cohort_size: number;
          financial_percentile: number;
          career_percentile: number;
          health_percentile: number;
          confidence: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          session_id: string;
          quiz_response_id: string;
          financial_score: number;
          career_score: number;
          health_score: number;
          emotional_state: string;
          composite_score: number;
          cohort_key: string;
          cohort_size?: number;
          financial_percentile?: number;
          career_percentile?: number;
          health_percentile?: number;
          confidence?: string;
          created_at?: string;
        };
        Update: {
          user_id?: string | null;
        };
      };
      vyve_actions: {
        Row: {
          id: string;
          user_id: string | null;
          session_id: string;
          action_key: string;
          pillar: string;
          title: string;
          description: string;
          status: string;
          recommended_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          session_id: string;
          action_key: string;
          pillar: string;
          title: string;
          description: string;
          status?: string;
          recommended_at?: string;
          completed_at?: string | null;
        };
        Update: {
          status?: string;
          completed_at?: string | null;
          user_id?: string | null;
        };
      };
      vyve_country_configs: {
        Row: {
          country_code: string;
          quiz_schema: Json;
          scoring_weights: Json;
          action_library: Json;
          pricing: Json;
          cultural_framing: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          country_code: string;
          quiz_schema: Json;
          scoring_weights: Json;
          action_library: Json;
          pricing: Json;
          cultural_framing: Json;
        };
        Update: {
          quiz_schema?: Json;
          scoring_weights?: Json;
          action_library?: Json;
          pricing?: Json;
          cultural_framing?: Json;
          updated_at?: string;
        };
      };
      vyve_benchmarks: {
        Row: {
          id: string;
          country_code: string;
          pillar: string;
          cohort_key: string;
          metric: string;
          value: number;
          sample_size: number;
          data_source: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          country_code?: string;
          pillar: string;
          cohort_key: string;
          metric: string;
          value: number;
          sample_size?: number;
          data_source?: string;
        };
        Update: {
          value?: number;
          sample_size?: number;
          data_source?: string;
        };
      };
      vyve_monday_briefs: {
        Row: {
          id: string;
          user_id: string;
          week_number: number;
          score_change: number | null;
          brief_body: string;
          delivered_at: string | null;
          opened_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          week_number: number;
          score_change?: number | null;
          brief_body: string;
          delivered_at?: string | null;
        };
        Update: {
          opened_at?: string | null;
        };
      };
      vyve_engagement_events: {
        Row: {
          id: string;
          session_id: string;
          user_id: string | null;
          event_type: string;
          event_data: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          user_id?: string | null;
          event_type: string;
          event_data?: Json;
        };
        Update: never;
      };
      vyve_action_interest: {
        Row: {
          id: string;
          session_id: string;
          action_key: string;
          action_title: string;
          pillar: string;
          name: string | null;
          email: string | null;
          phone: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          action_key: string;
          action_title: string;
          pillar: string;
          name?: string | null;
          email?: string | null;
          phone?: string | null;
          created_at?: string;
        };
        Update: never;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
