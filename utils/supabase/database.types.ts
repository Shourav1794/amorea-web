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
      customer_cart_items: {
        Row: {
          user_id: string;
          product_id: number;
          size: string;
          quantity: number;
        };
        Insert: {
          user_id: string;
          product_id: number;
          size?: string;
          quantity: number;
        };
        Update: {
          quantity?: number;
        };
        Relationships: [];
      };
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
      product_inventory: {
        Row: {
          product_id: number;
          size: string;
          stock: number;
        };
        Insert: {
          product_id: number;
          size?: string;
          stock?: number;
        };
        Update: {
          stock?: number;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
