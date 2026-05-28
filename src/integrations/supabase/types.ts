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
      tripsheets: {
        Row: {
          address: string | null
          bulk_demand_number: string | null
          buyer_name: string | null
          buyer_name_parcel_no: string | null
          created_at: string
          created_by: string | null
          destination_address: string | null
          distance: string | null
          district: string | null
          driver_name_licence_no: string | null
          grade: string | null
          id: string
          issue_date: string | null
          issued_by: string | null
          journey_start_date: string | null
          lease_holder_code_name: string | null
          lease_name_lease_code: string | null
          lease_validity_ibm_mine_code: string | null
          mineral_name_grade: string | null
          mode_of_transport: string | null
          net_weight_mt: number | null
          region: string | null
          route: string | null
          route_destination: string | null
          tahsil_village_syno: string | null
          transit_pass_number: string | null
          transit_pass_purpose: string | null
          transporter_name: string | null
          tripsheet_code: string
          tripsheet_generate_datetime: string | null
          updated_at: string
          vehicle_number: string | null
          weigh_bridge_name: string | null
        }
        Insert: {
          address?: string | null
          bulk_demand_number?: string | null
          buyer_name?: string | null
          buyer_name_parcel_no?: string | null
          created_at?: string
          created_by?: string | null
          destination_address?: string | null
          distance?: string | null
          district?: string | null
          driver_name_licence_no?: string | null
          grade?: string | null
          id?: string
          issue_date?: string | null
          issued_by?: string | null
          journey_start_date?: string | null
          lease_holder_code_name?: string | null
          lease_name_lease_code?: string | null
          lease_validity_ibm_mine_code?: string | null
          mineral_name_grade?: string | null
          mode_of_transport?: string | null
          net_weight_mt?: number | null
          region?: string | null
          route?: string | null
          route_destination?: string | null
          tahsil_village_syno?: string | null
          transit_pass_number?: string | null
          transit_pass_purpose?: string | null
          transporter_name?: string | null
          tripsheet_code: string
          tripsheet_generate_datetime?: string | null
          updated_at?: string
          vehicle_number?: string | null
          weigh_bridge_name?: string | null
        }
        Update: {
          address?: string | null
          bulk_demand_number?: string | null
          buyer_name?: string | null
          buyer_name_parcel_no?: string | null
          created_at?: string
          created_by?: string | null
          destination_address?: string | null
          distance?: string | null
          district?: string | null
          driver_name_licence_no?: string | null
          grade?: string | null
          id?: string
          issue_date?: string | null
          issued_by?: string | null
          journey_start_date?: string | null
          lease_holder_code_name?: string | null
          lease_name_lease_code?: string | null
          lease_validity_ibm_mine_code?: string | null
          mineral_name_grade?: string | null
          mode_of_transport?: string | null
          net_weight_mt?: number | null
          region?: string | null
          route?: string | null
          route_destination?: string | null
          tahsil_village_syno?: string | null
          transit_pass_number?: string | null
          transit_pass_purpose?: string | null
          transporter_name?: string | null
          tripsheet_code?: string
          tripsheet_generate_datetime?: string | null
          updated_at?: string
          vehicle_number?: string | null
          weigh_bridge_name?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
