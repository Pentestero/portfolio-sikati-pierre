import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          location: string | null;
          created_at: string;
          cv_url: string | null;
          vision_text: string | null;
          projects_count: string | null;
          technologies_count: string | null;
          years_experience: string | null;
          certifications_count: string | null;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          location?: string | null;
          created_at?: string;
          cv_url?: string | null;
          vision_text?: string | null;
          projects_count?: string | null;
          technologies_count?: string | null;
          years_experience?: string | null;
          certifications_count?: string | null;
        };
        Update: {
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          location?: string | null;
          created_at?: string;
          cv_url?: string | null;
          vision_text?: string | null;
          projects_count?: string | null;
          technologies_count?: string | null;
          years_experience?: string | null;
          certifications_count?: string | null;
        };
      };
      projects: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          image_url: string | null;
          technologies: string[] | null;
          category: string | null;
          github_url: string | null;
          demo_url: string | null;
          featured: boolean;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          image_url?: string | null;
          technologies?: string[] | null;
          category?: string | null;
          github_url?: string | null;
          demo_url?: string | null;
          featured?: boolean;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string | null;
          image_url?: string | null;
          technologies?: string[] | null;
          category?: string | null;
          github_url?: string | null;
          demo_url?: string | null;
          featured?: boolean;
          order_index?: number;
          updated_at?: string;
        };
      };
      skills: {
        Row: {
          id: string;
          category: string;
          icon: string | null;
          level: string | null;
          technologies: object | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          category: string;
          icon?: string | null;
          level?: string | null;
          technologies?: object | null;
          created_at?: string;
        };
        Update: {
          category?: string;
          icon?: string | null;
          level?: string | null;
          technologies?: object | null;
        };
      };
      contact_info: {
        Row: {
          id: string;
          email: string | null;
          phone: string | null;
          linkedin_url: string | null;
          github_url: string | null;
          location: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email?: string | null;
          phone?: string | null;
          linkedin_url?: string | null;
          github_url?: string | null;
          location?: string | null;
          updated_at?: string;
        };
        Update: {
          email?: string | null;
          phone?: string | null;
          linkedin_url?: string | null;
          github_url?: string | null;
          location?: string | null;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          created_at: string;
          name: string; // Changed from string | null
          email: string; // Changed from string | null
          subject: string; // Changed from string | null
          message: string; // Changed from string | null
          is_read: boolean; // New column
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string; // Changed from string | null
          email: string; // Changed from string | null
          subject: string; // Changed from string | null
          message: string; // Changed from string | null
          is_read?: boolean; // New optional column on insert
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string; // Changed from string | null
          email?: string; // Changed from string | null
          subject?: string; // Changed from string | null
          message?: string; // Changed from string | null
          is_read?: boolean; // New optional column on update
        };
      };
    };
  };
}
