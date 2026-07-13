export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      api_configs: {
        Row: {
          config: Json
          id: string
          is_active: boolean
          provider: string
          updated_at: string
        }
        Insert: {
          config?: Json
          id?: string
          is_active?: boolean
          provider: string
          updated_at?: string
        }
        Update: {
          config?: Json
          id?: string
          is_active?: boolean
          provider?: string
          updated_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          entity: string | null
          entity_id: string | null
          id: string
          ip: unknown
          metadata: Json | null
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          entity?: string | null
          entity_id?: string | null
          id?: string
          ip?: unknown
          metadata?: Json | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          entity?: string | null
          entity_id?: string | null
          id?: string
          ip?: unknown
          metadata?: Json | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      beneficiaries: {
        Row: {
          account_number: string
          bank_name: string | null
          created_at: string
          id: string
          ifsc: string
          mobile: string | null
          name: string
          user_id: string
          verified: boolean
        }
        Insert: {
          account_number: string
          bank_name?: string | null
          created_at?: string
          id?: string
          ifsc: string
          mobile?: string | null
          name: string
          user_id: string
          verified?: boolean
        }
        Update: {
          account_number?: string
          bank_name?: string | null
          created_at?: string
          id?: string
          ifsc?: string
          mobile?: string | null
          name?: string
          user_id?: string
          verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "beneficiaries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      commission_plans: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          operator_id: string | null
          rate_flat: number
          rate_percent: number
          role: Database["public"]["Enums"]["app_role"]
          service: Database["public"]["Enums"]["txn_service"]
          slab_max: number | null
          slab_min: number
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          operator_id?: string | null
          rate_flat?: number
          rate_percent?: number
          role: Database["public"]["Enums"]["app_role"]
          service: Database["public"]["Enums"]["txn_service"]
          slab_max?: number | null
          slab_min?: number
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          operator_id?: string | null
          rate_flat?: number
          rate_percent?: number
          role?: Database["public"]["Enums"]["app_role"]
          service?: Database["public"]["Enums"]["txn_service"]
          slab_max?: number | null
          slab_min?: number
        }
        Relationships: [
          {
            foreignKeyName: "commission_plans_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "operators"
            referencedColumns: ["id"]
          },
        ]
      }
      kyc_documents: {
        Row: {
          created_at: string
          doc_type: string
          file_url: string
          id: string
          remarks: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["kyc_status"]
          user_id: string
        }
        Insert: {
          created_at?: string
          doc_type: string
          file_url: string
          id?: string
          remarks?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["kyc_status"]
          user_id: string
        }
        Update: {
          created_at?: string
          doc_type?: string
          file_url?: string
          id?: string
          remarks?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["kyc_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "kyc_documents_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kyc_documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mobile_otps: {
        Row: {
          attempts: number
          code_hash: string
          consumed_at: string | null
          created_at: string
          expires_at: string
          id: string
          last_sent_at: string
          mobile: string
        }
        Insert: {
          attempts?: number
          code_hash: string
          consumed_at?: string | null
          created_at?: string
          expires_at: string
          id?: string
          last_sent_at?: string
          mobile: string
        }
        Update: {
          attempts?: number
          code_hash?: string
          consumed_at?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          last_sent_at?: string
          mobile?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          kind: string
          read_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          kind?: string
          read_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          kind?: string
          read_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      operators: {
        Row: {
          category: string
          code: string
          created_at: string
          id: string
          is_active: boolean
          logo_url: string | null
          name: string
        }
        Insert: {
          category: string
          code: string
          created_at?: string
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name: string
        }
        Update: {
          category?: string
          code?: string
          created_at?: string
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          aadhaar_last4: string | null
          address: string | null
          avatar_url: string | null
          business_name: string | null
          city: string | null
          created_at: string
          email: string | null
          full_name: string
          gst_number: string | null
          id: string
          kyc_status: Database["public"]["Enums"]["kyc_status"]
          last_login_at: string | null
          mobile: string
          pan_number: string | null
          parent_id: string | null
          pincode: string | null
          state: string | null
          status: Database["public"]["Enums"]["user_status"]
          updated_at: string
          username: string | null
        }
        Insert: {
          aadhaar_last4?: string | null
          address?: string | null
          avatar_url?: string | null
          business_name?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          gst_number?: string | null
          id: string
          kyc_status?: Database["public"]["Enums"]["kyc_status"]
          last_login_at?: string | null
          mobile: string
          pan_number?: string | null
          parent_id?: string | null
          pincode?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string
          username?: string | null
        }
        Update: {
          aadhaar_last4?: string | null
          address?: string | null
          avatar_url?: string | null
          business_name?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          gst_number?: string | null
          id?: string
          kyc_status?: Database["public"]["Enums"]["kyc_status"]
          last_login_at?: string | null
          mobile?: string
          pan_number?: string | null
          parent_id?: string | null
          pincode?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      settlements: {
        Row: {
          amount: number
          bank_account: string | null
          id: string
          ifsc: string | null
          processed_at: string | null
          remarks: string | null
          requested_at: string
          status: Database["public"]["Enums"]["txn_status"]
          user_id: string
          utr: string | null
        }
        Insert: {
          amount: number
          bank_account?: string | null
          id?: string
          ifsc?: string | null
          processed_at?: string | null
          remarks?: string | null
          requested_at?: string
          status?: Database["public"]["Enums"]["txn_status"]
          user_id: string
          utr?: string | null
        }
        Update: {
          amount?: number
          bank_account?: string | null
          id?: string
          ifsc?: string | null
          processed_at?: string | null
          remarks?: string | null
          requested_at?: string
          status?: Database["public"]["Enums"]["txn_status"]
          user_id?: string
          utr?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "settlements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          assigned_to: string | null
          category: string | null
          created_at: string
          description: string | null
          id: string
          priority: Database["public"]["Enums"]["ticket_priority"]
          status: Database["public"]["Enums"]["ticket_status"]
          subject: string
          transaction_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["ticket_priority"]
          status?: Database["public"]["Enums"]["ticket_status"]
          subject: string
          transaction_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["ticket_priority"]
          status?: Database["public"]["Enums"]["ticket_status"]
          subject?: string
          transaction_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tickets_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          charge: number
          commission: number
          created_at: string
          customer_ref: string | null
          device_info: Json | null
          device_ip: unknown
          failure_reason: string | null
          gst: number
          id: string
          idempotency_key: string | null
          metadata: Json | null
          operator_id: string | null
          operator_ref: string | null
          provider_ref: string | null
          reference_no: string | null
          service: Database["public"]["Enums"]["txn_service"]
          status: Database["public"]["Enums"]["txn_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          charge?: number
          commission?: number
          created_at?: string
          customer_ref?: string | null
          device_info?: Json | null
          device_ip?: unknown
          failure_reason?: string | null
          gst?: number
          id?: string
          idempotency_key?: string | null
          metadata?: Json | null
          operator_id?: string | null
          operator_ref?: string | null
          provider_ref?: string | null
          reference_no?: string | null
          service: Database["public"]["Enums"]["txn_service"]
          status?: Database["public"]["Enums"]["txn_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          charge?: number
          commission?: number
          created_at?: string
          customer_ref?: string | null
          device_info?: Json | null
          device_ip?: unknown
          failure_reason?: string | null
          gst?: number
          id?: string
          idempotency_key?: string | null
          metadata?: Json | null
          operator_id?: string | null
          operator_ref?: string | null
          provider_ref?: string | null
          reference_no?: string | null
          service?: Database["public"]["Enums"]["txn_service"]
          status?: Database["public"]["Enums"]["txn_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "operators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wallet_ledger: {
        Row: {
          amount: number
          balance_after: number
          created_at: string
          description: string | null
          direction: Database["public"]["Enums"]["ledger_direction"]
          id: string
          reference_id: string | null
          reference_type: string | null
          user_id: string
          wallet_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          created_at?: string
          description?: string | null
          direction: Database["public"]["Enums"]["ledger_direction"]
          id?: string
          reference_id?: string | null
          reference_type?: string | null
          user_id: string
          wallet_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          created_at?: string
          description?: string | null
          direction?: Database["public"]["Enums"]["ledger_direction"]
          id?: string
          reference_id?: string | null
          reference_type?: string | null
          user_id?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_ledger_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wallet_ledger_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          balance: number
          created_at: string
          currency: string
          hold: number
          id: string
          kind: Database["public"]["Enums"]["wallet_kind"]
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          currency?: string
          hold?: number
          id?: string
          kind: Database["public"]["Enums"]["wallet_kind"]
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          currency?: string
          hold?: number
          id?: string
          kind?: Database["public"]["Enums"]["wallet_kind"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      wallet_move: {
        Args: {
          _amount: number
          _description: string
          _direction: Database["public"]["Enums"]["ledger_direction"]
          _kind: Database["public"]["Enums"]["wallet_kind"]
          _reference_id: string
          _reference_type: string
          _user_id: string
        }
        Returns: {
          amount: number
          balance_after: number
          created_at: string
          description: string | null
          direction: Database["public"]["Enums"]["ledger_direction"]
          id: string
          reference_id: string | null
          reference_type: string | null
          user_id: string
          wallet_id: string
        }
        SetofOptions: {
          from: "*"
          to: "wallet_ledger"
          isOneToOne: true
          isSetofReturn: false
        }
      }
    }
    Enums: {
      app_role:
        | "super_admin"
        | "master_distributor"
        | "distributor"
        | "retailer"
        | "agent"
        | "support"
        | "auditor"
      kyc_status: "not_started" | "pending" | "approved" | "rejected"
      ledger_direction: "credit" | "debit"
      ticket_priority: "low" | "medium" | "high" | "urgent"
      ticket_status: "open" | "in_progress" | "resolved" | "closed" | "reopened"
      txn_service:
        | "recharge_mobile"
        | "recharge_dth"
        | "recharge_fastag"
        | "bbps"
        | "aeps"
        | "dmt"
        | "wallet_transfer"
        | "settlement"
        | "commission"
        | "refund"
        | "adjustment"
      txn_status:
        | "initiated"
        | "pending"
        | "success"
        | "failed"
        | "refunded"
        | "requery"
      user_status: "active" | "inactive" | "suspended" | "deleted"
      wallet_kind: "main" | "commission" | "hold"
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
      app_role: [
        "super_admin",
        "master_distributor",
        "distributor",
        "retailer",
        "agent",
        "support",
        "auditor",
      ],
      kyc_status: ["not_started", "pending", "approved", "rejected"],
      ledger_direction: ["credit", "debit"],
      ticket_priority: ["low", "medium", "high", "urgent"],
      ticket_status: ["open", "in_progress", "resolved", "closed", "reopened"],
      txn_service: [
        "recharge_mobile",
        "recharge_dth",
        "recharge_fastag",
        "bbps",
        "aeps",
        "dmt",
        "wallet_transfer",
        "settlement",
        "commission",
        "refund",
        "adjustment",
      ],
      txn_status: [
        "initiated",
        "pending",
        "success",
        "failed",
        "refunded",
        "requery",
      ],
      user_status: ["active", "inactive", "suspended", "deleted"],
      wallet_kind: ["main", "commission", "hold"],
    },
  },
} as const
