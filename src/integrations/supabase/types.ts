export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      material_requests: {
        Row: {
          created_at: string
          description: string | null
          edt: string | null
          id: string
          items: Json
          mrc_number: string | null
          received_at: string | null
          request_type: string
          requested_by: string
          requester_email: string | null
          requester_id: string | null
          sent_at: string | null
          status: string
          ticket_number: string | null
          title: string
          tracking_no: string | null
          transport_mode: string | null
          updated_at: string
          zone: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          edt?: string | null
          id?: string
          items?: Json
          mrc_number?: string | null
          received_at?: string | null
          request_type?: string
          requested_by: string
          requester_email?: string | null
          requester_id?: string | null
          sent_at?: string | null
          status?: string
          ticket_number?: string | null
          title: string
          tracking_no?: string | null
          transport_mode?: string | null
          updated_at?: string
          zone?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          edt?: string | null
          id?: string
          items?: Json
          mrc_number?: string | null
          received_at?: string | null
          request_type?: string
          requested_by?: string
          requester_email?: string | null
          requester_id?: string | null
          sent_at?: string | null
          status?: string
          ticket_number?: string | null
          title?: string
          tracking_no?: string | null
          transport_mode?: string | null
          updated_at?: string
          zone?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          department: Database["public"]["Enums"]["app_department"]
          email: string | null
          id: string
          mobile: string | null
          updated_at: string
          username: string | null
          zone: string | null
        }
        Insert: {
          created_at?: string
          department?: Database["public"]["Enums"]["app_department"]
          email?: string | null
          id: string
          mobile?: string | null
          updated_at?: string
          username?: string | null
          zone?: string | null
        }
        Update: {
          created_at?: string
          department?: Database["public"]["Enums"]["app_department"]
          email?: string | null
          id?: string
          mobile?: string | null
          updated_at?: string
          username?: string | null
          zone?: string | null
        }
        Relationships: []
      }
      tickets: {
        Row: {
          assignee_id: string | null
          attachments: string[]
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          priority: Database["public"]["Enums"]["ticket_priority"]
          status: Database["public"]["Enums"]["ticket_status"]
          tags: string[]
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assignee_id?: string | null
          attachments?: string[]
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["ticket_priority"]
          status?: Database["public"]["Enums"]["ticket_status"]
          tags?: string[]
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assignee_id?: string | null
          attachments?: string[]
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["ticket_priority"]
          status?: Database["public"]["Enums"]["ticket_status"]
          tags?: string[]
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_emails_by_department: {
        Args: {
          _department: Database["public"]["Enums"]["app_department"]
          _zone?: string
        }
        Returns: string[]
      }
      is_regional_manager: {
        Args: { _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_department:
        | "engineer"
        | "regional_manager"
        | "store_manager"
        | "admin"
      ticket_priority: "low" | "medium" | "high" | "critical"
      ticket_status: "open" | "in-progress" | "resolved" | "closed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_department: [
        "engineer",
        "regional_manager",
        "store_manager",
        "admin",
      ],
      ticket_priority: ["low", "medium", "high", "critical"],
      ticket_status: ["open", "in-progress", "resolved", "closed"],
    },
  },
} as const
