import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      cards: {
        Row: {
          id: string;
          user_id: string;
          card_company: string;
          card_name: string;
          card_network: string;
          anniversary_month: number;
          billing_date: number;
          due_date: number;
          annual_fee: number;
          milestone_amount: number;
          card_limit: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          card_company: string;
          card_name: string;
          card_network: string;
          anniversary_month: number;
          billing_date: number;
          due_date: number;
          annual_fee?: number;
          milestone_amount?: number;
          card_limit?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          card_company?: string;
          card_name?: string;
          card_network?: string;
          anniversary_month?: number;
          billing_date?: number;
          due_date?: number;
          annual_fee?: number;
          milestone_amount?: number;
          card_limit?: number | null;
          created_at?: string;
        };
      };
      monthly_spends: {
        Row: {
          id: string;
          card_id: string;
          month: string;
          year: number;
          amount_spent: number;
        };
        Insert: {
          id?: string;
          card_id: string;
          month: string;
          year: number;
          amount_spent?: number;
        };
        Update: {
          id?: string;
          card_id?: string;
          month?: string;
          year?: number;
          amount_spent?: number;
        };
      };
    };
  };
};