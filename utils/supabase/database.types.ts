export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      customer_orders: {
        Row: {
          id: string;
          user_id: string;
          customer_name: string;
          phone: string;
          address: string;
          delivery_zone: 'inside' | 'outside';
          items: Json;
          subtotal: number;
          delivery_charge: number;
          total: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          customer_name: string;
          phone: string;
          address: string;
          delivery_zone: 'inside' | 'outside';
          items: Json;
          subtotal: number;
          delivery_charge: number;
          total: number;
          created_at?: string;
        };
        Update: never;
        Relationships: [];
      };
      customer_chat_messages: {
        Row: {
          id: string;
          user_id: string;
          sender: 'user' | 'assistant';
          content: string;
          language: 'en' | 'bn';
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          sender: 'user' | 'assistant';
          content: string;
          language: 'en' | 'bn';
          created_at?: string;
        };
        Update: never;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
