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
      core_function: {
        Row: {
          created_at: string
          id: string
          ipcr_id: string
          name: string
          position: number
          reviewer_id: string | null
          unit: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          ipcr_id: string
          name: string
          position: number
          reviewer_id?: string | null
          unit?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          ipcr_id?: string
          name?: string
          position?: number
          reviewer_id?: string | null
          unit?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "core_function_ipcr_id_fkey"
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
      indicator: {
        Row: {
          accomplishment: string | null
          accomplishment_date: string | null
          average_rating: number | null
          core_function_id: string | null
          created_at: string
          efficiency_rating: number | null
          id: string
          indicator: string
          indicator_date: string | null
          other_function_id: string | null
          position: number
          quality_rating: number | null
          status: Database["public"]["Enums"]["indicator_status"]
          sub_core_function_id: string | null
          sub_other_function_id: string | null
          sub_support_function_id: string | null
          support_function_id: string | null
          timeliness_rating: number | null
          updated_at: string
        }
        Insert: {
          accomplishment?: string | null
          accomplishment_date?: string | null
          average_rating?: number | null
          core_function_id?: string | null
          created_at?: string
          efficiency_rating?: number | null
          id?: string
          indicator: string
          indicator_date?: string | null
          other_function_id?: string | null
          position: number
          quality_rating?: number | null
          status?: Database["public"]["Enums"]["indicator_status"]
          sub_core_function_id?: string | null
          sub_other_function_id?: string | null
          sub_support_function_id?: string | null
          support_function_id?: string | null
          timeliness_rating?: number | null
          updated_at?: string
        }
        Update: {
          accomplishment?: string | null
          accomplishment_date?: string | null
          average_rating?: number | null
          core_function_id?: string | null
          created_at?: string
          efficiency_rating?: number | null
          id?: string
          indicator?: string
          indicator_date?: string | null
          other_function_id?: string | null
          position?: number
          quality_rating?: number | null
          status?: Database["public"]["Enums"]["indicator_status"]
          sub_core_function_id?: string | null
          sub_other_function_id?: string | null
          sub_support_function_id?: string | null
          support_function_id?: string | null
          timeliness_rating?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "indicator_core_function_id_fkey"
            columns: ["core_function_id"]
            isOneToOne: false
            referencedRelation: "core_function"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "indicator_other_function_id_fkey"
            columns: ["other_function_id"]
            isOneToOne: false
            referencedRelation: "other_function"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "indicator_sub_core_function_id_fkey"
            columns: ["sub_core_function_id"]
            isOneToOne: false
            referencedRelation: "sub_core_function"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "indicator_sub_other_function_id_fkey"
            columns: ["sub_other_function_id"]
            isOneToOne: false
            referencedRelation: "sub_other_function"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "indicator_sub_support_function_id_fkey"
            columns: ["sub_support_function_id"]
            isOneToOne: false
            referencedRelation: "sub_support_function"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "indicator_support_function_id_fkey"
            columns: ["support_function_id"]
            isOneToOne: false
            referencedRelation: "support_function"
            referencedColumns: ["id"]
          },
        ]
      }
      indicator_evidence: {
        Row: {
          created_at: string
          file_path: string
          id: string
          indicator_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          file_path: string
          id?: string
          indicator_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          file_path?: string
          id?: string
          indicator_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "indicator_evidence_indicator_id_fkey"
            columns: ["indicator_id"]
            isOneToOne: false
            referencedRelation: "indicator"
            referencedColumns: ["id"]
          },
        ]
      }
      ipcr: {
        Row: {
          created_at: string
          id: string
          office_id: number | null
          owner_id: string | null
          program_id: number | null
          status: Database["public"]["Enums"]["ipcr_status"]
          title: string
          unit_id: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          office_id?: number | null
          owner_id?: string | null
          program_id?: number | null
          status?: Database["public"]["Enums"]["ipcr_status"]
          title: string
          unit_id?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          office_id?: number | null
          owner_id?: string | null
          program_id?: number | null
          status?: Database["public"]["Enums"]["ipcr_status"]
          title?: string
          unit_id?: number | null
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
      op_header: {
        Row: {
          created_at: string
          id: string
          operational_plan_id: string
          position: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          operational_plan_id: string
          position: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          operational_plan_id?: string
          position?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "op_header_operational_plan_id_fkey"
            columns: ["operational_plan_id"]
            isOneToOne: false
            referencedRelation: "operational_plan"
            referencedColumns: ["id"]
          },
        ]
      }
      op_objectives: {
        Row: {
          activity: string
          amount: string | null
          created_at: string
          desired_state: string
          entity_responsible: string
          former_state: string
          fund_source: string | null
          id: string
          indicator: string
          item: string | null
          objective: string
          op_program_project_id: string
          position: number
          q1: boolean
          q2: boolean
          q3: boolean
          q4: boolean
          qty: string | null
          unit: string | null
          unit_cost: string | null
          updated_at: string
        }
        Insert: {
          activity: string
          amount?: string | null
          created_at?: string
          desired_state: string
          entity_responsible: string
          former_state: string
          fund_source?: string | null
          id?: string
          indicator: string
          item?: string | null
          objective: string
          op_program_project_id: string
          position: number
          q1?: boolean
          q2?: boolean
          q3?: boolean
          q4?: boolean
          qty?: string | null
          unit?: string | null
          unit_cost?: string | null
          updated_at?: string
        }
        Update: {
          activity?: string
          amount?: string | null
          created_at?: string
          desired_state?: string
          entity_responsible?: string
          former_state?: string
          fund_source?: string | null
          id?: string
          indicator?: string
          item?: string | null
          objective?: string
          op_program_project_id?: string
          position?: number
          q1?: boolean
          q2?: boolean
          q3?: boolean
          q4?: boolean
          qty?: string | null
          unit?: string | null
          unit_cost?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "op_objectives_op_program_project_id_fkey"
            columns: ["op_program_project_id"]
            isOneToOne: false
            referencedRelation: "op_program_project"
            referencedColumns: ["id"]
          },
        ]
      }
      op_program_project: {
        Row: {
          created_at: string
          description: string
          id: string
          op_header_id: string
          position: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          op_header_id: string
          position: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          op_header_id?: string
          position?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "op_program_project_op_header_id_fkey"
            columns: ["op_header_id"]
            isOneToOne: false
            referencedRelation: "op_header"
            referencedColumns: ["id"]
          },
        ]
      }
      operational_plan: {
        Row: {
          created_at: string
          creator_id: string
          id: string
          implementing_unit: string
          office_id: number
          program_id: number
          title: string
          unit_id: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          creator_id: string
          id?: string
          implementing_unit: string
          office_id: number
          program_id: number
          title: string
          unit_id: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          creator_id?: string
          id?: string
          implementing_unit?: string
          office_id?: number
          program_id?: number
          title?: string
          unit_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "operational_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "office"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "operational_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "program"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "operational_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "unit"
            referencedColumns: ["id"]
          },
        ]
      }
      other_function: {
        Row: {
          created_at: string
          id: string
          ipcr_id: string
          name: string
          position: number
          reviewer_id: string | null
          unit: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          ipcr_id: string
          name: string
          position: number
          reviewer_id?: string | null
          unit?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          ipcr_id?: string
          name?: string
          position?: number
          reviewer_id?: string | null
          unit?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "other_function_ipcr_id_fkey"
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
      sub_core_function: {
        Row: {
          core_function_id: string
          created_at: string
          id: string
          name: string
          position: number
          updated_at: string
        }
        Insert: {
          core_function_id: string
          created_at?: string
          id?: string
          name: string
          position: number
          updated_at?: string
        }
        Update: {
          core_function_id?: string
          created_at?: string
          id?: string
          name?: string
          position?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sub_core_function_core_function_id_fkey"
            columns: ["core_function_id"]
            isOneToOne: false
            referencedRelation: "core_function"
            referencedColumns: ["id"]
          },
        ]
      }
      sub_other_function: {
        Row: {
          created_at: string
          id: string
          name: string
          other_function_id: string
          position: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          other_function_id: string
          position: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          other_function_id?: string
          position?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sub_other_function_other_function_id_fkey"
            columns: ["other_function_id"]
            isOneToOne: false
            referencedRelation: "other_function"
            referencedColumns: ["id"]
          },
        ]
      }
      sub_support_function: {
        Row: {
          created_at: string
          id: string
          name: string
          position: number
          support_function_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          position: number
          support_function_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          position?: number
          support_function_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sub_support_function_support_function_id_fkey"
            columns: ["support_function_id"]
            isOneToOne: false
            referencedRelation: "support_function"
            referencedColumns: ["id"]
          },
        ]
      }
      support_function: {
        Row: {
          created_at: string
          id: string
          ipcr_id: string
          name: string
          position: number
          reviewer_id: string | null
          unit: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          ipcr_id: string
          name: string
          position: number
          reviewer_id?: string | null
          unit?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          ipcr_id?: string
          name?: string
          position?: number
          reviewer_id?: string | null
          unit?: number | null
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
      validate_ipcr: {
        Args: {
          p_ipcr_id: string
        }
        Returns: Database["public"]["CompositeTypes"]["validation_result"]
      }
    }
    Enums: {
      indicator_status:
        | "draft"
        | "submitted"
        | "reviewing"
        | "revision"
        | "approved"
      ipcr_status: "draft" | "submitted" | "reviewing" | "revision" | "approved"
      scope_type: "all" | "office" | "program" | "unit"
    }
    CompositeTypes: {
      validation_result: {
        is_valid: boolean | null
        validation_message: string | null
      }
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

