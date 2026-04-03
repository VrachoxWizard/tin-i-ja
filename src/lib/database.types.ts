/**
 * Repo-tracked Supabase contract for the public schema.
 * Refresh from the target Supabase project with:
 * `npm run supabase:types`
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      audit_logs: {
        Row: {
          id: string;
          actor_id: string;
          action: string;
          entity_type: string;
          entity_id: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_id: string;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          actor_id?: string;
          action?: string;
          entity_type?: string;
          entity_id?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
      buyer_profiles: {
        Row: {
          created_at: string;
          id: string;
          investment_thesis: string | null;
          target_ev_max: number | null;
          target_ev_min: number | null;
          target_industries: string[];
          target_regions: string[];
          target_revenue_max: number | null;
          target_revenue_min: number | null;
          transaction_type: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          investment_thesis?: string | null;
          target_ev_max?: number | null;
          target_ev_min?: number | null;
          target_industries: string[];
          target_regions: string[];
          target_revenue_max?: number | null;
          target_revenue_min?: number | null;
          transaction_type: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          investment_thesis?: string | null;
          target_ev_max?: number | null;
          target_ev_min?: number | null;
          target_industries?: string[];
          target_regions?: string[];
          target_revenue_max?: number | null;
          target_revenue_min?: number | null;
          transaction_type?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      deal_room_files: {
        Row: {
          doc_type: string;
          file_path: string;
          file_url: string | null;
          id: string;
          listing_id: string;
          uploaded_at: string;
        };
        Insert: {
          doc_type: string;
          file_path: string;
          file_url?: string | null;
          id?: string;
          listing_id: string;
          uploaded_at?: string;
        };
        Update: {
          doc_type?: string;
          file_path?: string;
          file_url?: string | null;
          id?: string;
          listing_id?: string;
          uploaded_at?: string;
        };
        Relationships: [];
      };
      listings: {
        Row: {
          asking_price_eur: number;
          blind_teaser: string | null;
          broker_id: string | null;
          company_name: string;
          created_at: string;
          digital_maturity: number;
          employees: number;
          ebitda_eur: number;
          id: string;
          industry_nkd: string;
          is_exclusive: boolean;
          owner_dependency_score: number;
          owner_id: string;
          public_code: string;
          reason_for_sale: string | null;
          revenue_eur: number;
          region: string;
          sde_eur: number;
          status: string;
          transition_support: string | null;
          updated_at: string;
          year_founded: number;
        };
        Insert: {
          asking_price_eur: number;
          blind_teaser?: string | null;
          broker_id?: string | null;
          company_name: string;
          created_at?: string;
          digital_maturity: number;
          employees: number;
          ebitda_eur: number;
          id?: string;
          industry_nkd: string;
          is_exclusive?: boolean;
          owner_dependency_score: number;
          owner_id: string;
          public_code?: string;
          reason_for_sale?: string | null;
          revenue_eur: number;
          region: string;
          sde_eur: number;
          status?: string;
          transition_support?: string | null;
          updated_at?: string;
          year_founded: number;
        };
        Update: {
          asking_price_eur?: number;
          blind_teaser?: string | null;
          broker_id?: string | null;
          company_name?: string;
          created_at?: string;
          digital_maturity?: number;
          employees?: number;
          ebitda_eur?: number;
          id?: string;
          industry_nkd?: string;
          is_exclusive?: boolean;
          owner_dependency_score?: number;
          owner_id?: string;
          public_code?: string;
          reason_for_sale?: string | null;
          revenue_eur?: number;
          region?: string;
          sde_eur?: number;
          status?: string;
          transition_support?: string | null;
          updated_at?: string;
          year_founded?: number;
        };
        Relationships: [];
      };
      matches: {
        Row: {
          ai_narrative: string;
          buyer_profile_id: string;
          created_at: string;
          id: string;
          listing_id: string;
          match_score: number;
          status: string;
          updated_at: string;
        };
        Insert: {
          ai_narrative: string;
          buyer_profile_id: string;
          created_at?: string;
          id?: string;
          listing_id: string;
          match_score: number;
          status?: string;
          updated_at?: string;
        };
        Update: {
          ai_narrative?: string;
          buyer_profile_id?: string;
          created_at?: string;
          id?: string;
          listing_id?: string;
          match_score?: number;
          status?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      ndas: {
        Row: {
          buyer_id: string;
          created_at: string;
          id: string;
          listing_id: string;
          signed_at: string | null;
          status: string;
          updated_at: string;
        };
        Insert: {
          buyer_id: string;
          created_at?: string;
          id?: string;
          listing_id: string;
          signed_at?: string | null;
          status?: string;
          updated_at?: string;
        };
        Update: {
          buyer_id?: string;
          created_at?: string;
          id?: string;
          listing_id?: string;
          signed_at?: string | null;
          status?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      users: {
        Row: {
          created_at: string;
          email: string;
          full_name: string;
          id: string;
          role: string;
          suspended_at: string | null;
        };
        Insert: {
          created_at?: string;
          email: string;
          full_name: string;
          id: string;
          role: string;
          suspended_at?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string;
          full_name?: string;
          id?: string;
          role?: string;
          suspended_at?: string | null;
        };
        Relationships: [];
      };
      rate_limits: {
        Row: {
          key_hash: string;
          route: string;
          window_started_at: string;
          request_count: number;
          updated_at: string;
        };
        Insert: {
          key_hash: string;
          route: string;
          request_count?: number;
          updated_at?: string;
          window_started_at?: string;
        };
        Update: {
          key_hash?: string;
          route?: string;
          request_count?: number;
          updated_at?: string;
          window_started_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      admin_overview: {
        Args: Record<PropertyKey, never>;
        Returns: Json;
      };
      check_rate_limit: {
        Args: {
          p_key_hash: string;
          p_route: string;
          p_limit: number;
          p_window_seconds: number;
        };
        Returns: boolean;
      };
      get_active_teasers: {
        Args: Record<PropertyKey, never>;
        Returns: {
          asking_price_eur: number;
          blind_teaser: string | null;
          ebitda_eur: number;
          industry_nkd: string;
          listing_id: string;
          public_code: string;
          region: string;
          revenue_eur: number;
          updated_at: string;
        }[];
      };
      log_audit_event: {
        Args: {
          p_action: string;
          p_entity_type: string;
          p_entity_id?: string | null;
          p_metadata?: Json;
        };
        Returns: undefined;
      };
      admin_update_user: {
        Args: {
          p_user_id: string;
          p_full_name?: string | null;
          p_email?: string | null;
          p_role?: string | null;
        };
        Returns: undefined;
      };
      admin_toggle_suspend_user: {
        Args: {
          p_user_id: string;
          p_suspend: boolean;
        };
        Returns: undefined;
      };
      admin_delete_user: {
        Args: {
          p_user_id: string;
        };
        Returns: undefined;
      };
      admin_update_listing_status: {
        Args: {
          p_listing_id: string;
          p_status: string;
        };
        Returns: undefined;
      };
      admin_delete_listing: {
        Args: {
          p_listing_id: string;
        };
        Returns: undefined;
      };
      admin_manage_nda: {
        Args: {
          p_nda_id: string;
          p_status: string;
        };
        Returns: undefined;
      };
      broker_overview: {
        Args: Record<PropertyKey, never>;
        Returns: Json;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
