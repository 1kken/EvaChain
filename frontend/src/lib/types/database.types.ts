export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      administrative_designation: {
        Row: {
          actual_accomplishments: string | null
          created_at: string
          evidence_img_urls: string[] | null
          id: number
          ipcr_id: string
          rating_a: number
          rating_e: number
          rating_q: number
          rating_t: number
          remarks: string | null
          success_indicators: string
          updated_at: string
        }
        Insert: {
          actual_accomplishments?: string | null
          created_at?: string
          evidence_img_urls?: string[] | null
          id?: number
          ipcr_id: string
          rating_a: number
          rating_e: number
          rating_q: number
          rating_t: number
          remarks?: string | null
          success_indicators: string
          updated_at?: string
        }
        Update: {
          actual_accomplishments?: string | null
          created_at?: string
          evidence_img_urls?: string[] | null
          id?: number
          ipcr_id?: string
          rating_a?: number
          rating_e?: number
          rating_q?: number
          rating_t?: number
          remarks?: string | null
          success_indicators?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "administrative_designation_ipcr_id_fkey"
            columns: ["ipcr_id"]
            isOneToOne: false
            referencedRelation: "ipcr"
            referencedColumns: ["id"]
          },
        ]
      }
      advance_education_service: {
        Row: {
          actual_accomplishments: string | null
          created_at: string
          evidence_img_urls: string[] | null
          id: number
          ipcr_id: string
          rating_a: number
          rating_e: number
          rating_q: number
          rating_t: number
          remarks: string | null
          success_indicators: string
          updated_at: string
        }
        Insert: {
          actual_accomplishments?: string | null
          created_at?: string
          evidence_img_urls?: string[] | null
          id?: number
          ipcr_id: string
          rating_a: number
          rating_e: number
          rating_q: number
          rating_t: number
          remarks?: string | null
          success_indicators: string
          updated_at?: string
        }
        Update: {
          actual_accomplishments?: string | null
          created_at?: string
          evidence_img_urls?: string[] | null
          id?: number
          ipcr_id?: string
          rating_a?: number
          rating_e?: number
          rating_q?: number
          rating_t?: number
          remarks?: string | null
          success_indicators?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "advance_education_service_ipcr_id_fkey"
            columns: ["ipcr_id"]
            isOneToOne: false
            referencedRelation: "ipcr"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_status: {
        Row: {
          created_at: string
          id: number
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      instructional_imperative: {
        Row: {
          actual_accomplishments: string | null
          created_at: string
          evidence_img_urls: string[] | null
          id: number
          ipcr_id: string
          rating_a: number
          rating_e: number
          rating_q: number
          rating_t: number
          remarks: string | null
          success_indicators: string
          updated_at: string
        }
        Insert: {
          actual_accomplishments?: string | null
          created_at?: string
          evidence_img_urls?: string[] | null
          id?: number
          ipcr_id: string
          rating_a: number
          rating_e: number
          rating_q: number
          rating_t: number
          remarks?: string | null
          success_indicators: string
          updated_at?: string
        }
        Update: {
          actual_accomplishments?: string | null
          created_at?: string
          evidence_img_urls?: string[] | null
          id?: number
          ipcr_id?: string
          rating_a?: number
          rating_e?: number
          rating_q?: number
          rating_t?: number
          remarks?: string | null
          success_indicators?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "instructional_imperative_ipcr_id_fkey"
            columns: ["ipcr_id"]
            isOneToOne: false
            referencedRelation: "ipcr"
            referencedColumns: ["id"]
          },
        ]
      }
      ipcr: {
        Row: {
          advanced_education_units: number | null
          created_at: string
          higher_education_units: number | null
          id: string
          office_id: number
          owner_id: string
          program_id: number | null
          research_units: number | null
          status: Database["public"]["Enums"]["ipcr_status"]
          supervisor_id: string | null
          technical_extension_units: number | null
          title: string
          unit_id: number
          updated_at: string
        }
        Insert: {
          advanced_education_units?: number | null
          created_at?: string
          higher_education_units?: number | null
          id?: string
          office_id: number
          owner_id: string
          program_id?: number | null
          research_units?: number | null
          status?: Database["public"]["Enums"]["ipcr_status"]
          supervisor_id?: string | null
          technical_extension_units?: number | null
          title: string
          unit_id: number
          updated_at?: string
        }
        Update: {
          advanced_education_units?: number | null
          created_at?: string
          higher_education_units?: number | null
          id?: string
          office_id?: number
          owner_id?: string
          program_id?: number | null
          research_units?: number | null
          status?: Database["public"]["Enums"]["ipcr_status"]
          supervisor_id?: string | null
          technical_extension_units?: number | null
          title?: string
          unit_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ipcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "office"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ipcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "program"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ipcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "unit"
            referencedColumns: ["id"]
          },
        ]
      }
      nature_of_work: {
        Row: {
          created_at: string
          id: number
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      office: {
        Row: {
          code: string
          created_at: string
          id: number
          name: string
          unit_id: number
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: number
          name: string
          unit_id: number
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: number
          name?: string
          unit_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "office_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "unit"
            referencedColumns: ["id"]
          },
        ]
      }
      other_activities: {
        Row: {
          actual_accomplishments: string | null
          created_at: string
          evidence_img_urls: string[] | null
          id: number
          ipcr_id: string
          rating_a: number
          rating_e: number
          rating_q: number
          rating_t: number
          remarks: string | null
          success_indicators: string
          updated_at: string
        }
        Insert: {
          actual_accomplishments?: string | null
          created_at?: string
          evidence_img_urls?: string[] | null
          id?: number
          ipcr_id: string
          rating_a: number
          rating_e: number
          rating_q: number
          rating_t: number
          remarks?: string | null
          success_indicators: string
          updated_at?: string
        }
        Update: {
          actual_accomplishments?: string | null
          created_at?: string
          evidence_img_urls?: string[] | null
          id?: number
          ipcr_id?: string
          rating_a?: number
          rating_e?: number
          rating_q?: number
          rating_t?: number
          remarks?: string | null
          success_indicators?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "other_activities_ipcr_id_fkey"
            columns: ["ipcr_id"]
            isOneToOne: false
            referencedRelation: "ipcr"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          created_at: string
          description: string | null
          id: number
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      position: {
        Row: {
          created_at: string
          id: number
          name: string
          nature_of_work_id: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          nature_of_work_id: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          nature_of_work_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "position_nature_of_work_id_fkey"
            columns: ["nature_of_work_id"]
            isOneToOne: false
            referencedRelation: "nature_of_work"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          employee_id: string | null
          employee_status_id: number | null
          first_name: string | null
          id: string
          last_name: string | null
          middle_name: string | null
          nature_of_work_id: number | null
          office_id: number | null
          position_id: number | null
          program_id: number | null
          unit_id: number | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          employee_id?: string | null
          employee_status_id?: number | null
          first_name?: string | null
          id: string
          last_name?: string | null
          middle_name?: string | null
          nature_of_work_id?: number | null
          office_id?: number | null
          position_id?: number | null
          program_id?: number | null
          unit_id?: number | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          employee_id?: string | null
          employee_status_id?: number | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          middle_name?: string | null
          nature_of_work_id?: number | null
          office_id?: number | null
          position_id?: number | null
          program_id?: number | null
          unit_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_employee_status_id_fkey"
            columns: ["employee_status_id"]
            isOneToOne: false
            referencedRelation: "employee_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_nature_of_work_id_fkey"
            columns: ["nature_of_work_id"]
            isOneToOne: false
            referencedRelation: "nature_of_work"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "office"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "position"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "program"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "unit"
            referencedColumns: ["id"]
          },
        ]
      }
      program: {
        Row: {
          created_at: string
          id: number
          name: string
          office_id: number
          unit_id: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          office_id: number
          unit_id: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          office_id?: number
          unit_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "program_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "office"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "unit"
            referencedColumns: ["id"]
          },
        ]
      }
      required_activity: {
        Row: {
          actual_accomplishments: string | null
          created_at: string
          evidence_img_urls: string[] | null
          id: number
          ipcr_id: string
          rating_a: number
          rating_e: number
          rating_q: number
          rating_t: number
          remarks: string | null
          success_indicators: string
          updated_at: string
        }
        Insert: {
          actual_accomplishments?: string | null
          created_at?: string
          evidence_img_urls?: string[] | null
          id?: number
          ipcr_id: string
          rating_a: number
          rating_e: number
          rating_q: number
          rating_t: number
          remarks?: string | null
          success_indicators: string
          updated_at?: string
        }
        Update: {
          actual_accomplishments?: string | null
          created_at?: string
          evidence_img_urls?: string[] | null
          id?: number
          ipcr_id?: string
          rating_a?: number
          rating_e?: number
          rating_q?: number
          rating_t?: number
          remarks?: string | null
          success_indicators?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "required_activity_ipcr_id_fkey"
            columns: ["ipcr_id"]
            isOneToOne: false
            referencedRelation: "ipcr"
            referencedColumns: ["id"]
          },
        ]
      }
      research_service: {
        Row: {
          actual_accomplishments: string | null
          created_at: string
          evidence_img_urls: string[] | null
          id: number
          ipcr_id: string
          rating_a: number
          rating_e: number
          rating_q: number
          rating_t: number
          remarks: string | null
          success_indicators: string
          updated_at: string
        }
        Insert: {
          actual_accomplishments?: string | null
          created_at?: string
          evidence_img_urls?: string[] | null
          id?: number
          ipcr_id: string
          rating_a: number
          rating_e: number
          rating_q: number
          rating_t: number
          remarks?: string | null
          success_indicators: string
          updated_at?: string
        }
        Update: {
          actual_accomplishments?: string | null
          created_at?: string
          evidence_img_urls?: string[] | null
          id?: number
          ipcr_id?: string
          rating_a?: number
          rating_e?: number
          rating_q?: number
          rating_t?: number
          remarks?: string | null
          success_indicators?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "research_service_ipcr_id_fkey"
            columns: ["ipcr_id"]
            isOneToOne: false
            referencedRelation: "ipcr"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          created_at: string
          id: number
          permission_id: number | null
          role_id: number | null
          scope: Database["public"]["Enums"]["scope_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          permission_id?: number | null
          role_id?: number | null
          scope?: Database["public"]["Enums"]["scope_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          permission_id?: number | null
          role_id?: number | null
          scope?: Database["public"]["Enums"]["scope_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "user_role_view"
            referencedColumns: ["role_id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          id: number
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      support_function: {
        Row: {
          actual_accomplishments: string | null
          created_at: string
          evidence_img_urls: string[] | null
          id: number
          ipcr_id: string
          rating_a: number
          rating_e: number
          rating_q: number
          rating_t: number
          remarks: string | null
          success_indicators: string
          support_function_header_id: string
          updated_at: string
        }
        Insert: {
          actual_accomplishments?: string | null
          created_at?: string
          evidence_img_urls?: string[] | null
          id?: number
          ipcr_id: string
          rating_a: number
          rating_e: number
          rating_q: number
          rating_t: number
          remarks?: string | null
          success_indicators: string
          support_function_header_id: string
          updated_at?: string
        }
        Update: {
          actual_accomplishments?: string | null
          created_at?: string
          evidence_img_urls?: string[] | null
          id?: number
          ipcr_id?: string
          rating_a?: number
          rating_e?: number
          rating_q?: number
          rating_t?: number
          remarks?: string | null
          success_indicators?: string
          support_function_header_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_function_ipcr_id_fkey"
            columns: ["ipcr_id"]
            isOneToOne: false
            referencedRelation: "ipcr"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_function_support_function_header_id_fkey"
            columns: ["support_function_header_id"]
            isOneToOne: false
            referencedRelation: "support_function_header"
            referencedColumns: ["id"]
          },
        ]
      }
      support_function_header: {
        Row: {
          created_at: string
          id: string
          ipcr_id: string
          title: string
          units: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          ipcr_id: string
          title: string
          units?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          ipcr_id?: string
          title?: string
          units?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_function_header_ipcr_id_fkey"
            columns: ["ipcr_id"]
            isOneToOne: false
            referencedRelation: "ipcr"
            referencedColumns: ["id"]
          },
        ]
      }
      teaching_effectiveness: {
        Row: {
          actual_accomplishments: string | null
          created_at: string
          evidence_img_urls: string[] | null
          id: number
          ipcr_id: string
          rating_a: number
          rating_e: number
          rating_q: number
          rating_t: number
          remarks: string | null
          success_indicators: string
          updated_at: string
        }
        Insert: {
          actual_accomplishments?: string | null
          created_at?: string
          evidence_img_urls?: string[] | null
          id?: number
          ipcr_id: string
          rating_a: number
          rating_e: number
          rating_q: number
          rating_t: number
          remarks?: string | null
          success_indicators: string
          updated_at?: string
        }
        Update: {
          actual_accomplishments?: string | null
          created_at?: string
          evidence_img_urls?: string[] | null
          id?: number
          ipcr_id?: string
          rating_a?: number
          rating_e?: number
          rating_q?: number
          rating_t?: number
          remarks?: string | null
          success_indicators?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teaching_effectiveness_ipcr_id_fkey"
            columns: ["ipcr_id"]
            isOneToOne: false
            referencedRelation: "ipcr"
            referencedColumns: ["id"]
          },
        ]
      }
      technical_extension_service: {
        Row: {
          actual_accomplishments: string | null
          created_at: string
          evidence_img_urls: string[] | null
          id: number
          ipcr_id: string
          rating_a: number
          rating_e: number
          rating_q: number
          rating_t: number
          remarks: string | null
          success_indicators: string
          updated_at: string
        }
        Insert: {
          actual_accomplishments?: string | null
          created_at?: string
          evidence_img_urls?: string[] | null
          id?: number
          ipcr_id: string
          rating_a: number
          rating_e: number
          rating_q: number
          rating_t: number
          remarks?: string | null
          success_indicators: string
          updated_at?: string
        }
        Update: {
          actual_accomplishments?: string | null
          created_at?: string
          evidence_img_urls?: string[] | null
          id?: number
          ipcr_id?: string
          rating_a?: number
          rating_e?: number
          rating_q?: number
          rating_t?: number
          remarks?: string | null
          success_indicators?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "technical_extension_service_ipcr_id_fkey"
            columns: ["ipcr_id"]
            isOneToOne: false
            referencedRelation: "ipcr"
            referencedColumns: ["id"]
          },
        ]
      }
      unit: {
        Row: {
          code: string
          created_at: string
          id: number
          name: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: number
          name: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: number
          role_id: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          role_id: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          role_id?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "user_role_view"
            referencedColumns: ["role_id"]
          },
        ]
      }
    }
    Views: {
      user_role_view: {
        Row: {
          role_id: number | null
          role_name: string | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      check_permission: {
        Args: {
          required_permission: string
          target_office_id?: number
          target_unit_id?: number
          target_program_id?: number
        }
        Returns: boolean
      }
      get_user_role: {
        Args: Record<PropertyKey, never>
        Returns: {
          role_name: string
          role_id: number
        }[]
      }
      is_system_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      ipcr_status: "draft" | "submit" | "review" | "passed"
      scope_type: "all" | "office" | "program" | "unit"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

