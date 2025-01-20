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
      accomplishment_metrics: {
        Row: {
          accomplishment_program_project_id: string
          annual_target: string | null
          created_at: string
          former_state: string | null
          id: string
          input_type: Database["public"]["Enums"]["input_type"]
          is_included: boolean
          metrics: string
          position: number
          quarter_1_accomplishment: string | null
          quarter_2_accomplishment: string | null
          quarter_3_accomplishment: string | null
          quarter_4_accomplishment: string | null
          remarks: string | null
          total_accomplishment: string | null
          updated_at: string
          variance: string | null
        }
        Insert: {
          accomplishment_program_project_id: string
          annual_target?: string | null
          created_at?: string
          former_state?: string | null
          id?: string
          input_type?: Database["public"]["Enums"]["input_type"]
          is_included?: boolean
          metrics: string
          position: number
          quarter_1_accomplishment?: string | null
          quarter_2_accomplishment?: string | null
          quarter_3_accomplishment?: string | null
          quarter_4_accomplishment?: string | null
          remarks?: string | null
          total_accomplishment?: string | null
          updated_at?: string
          variance?: string | null
        }
        Update: {
          accomplishment_program_project_id?: string
          annual_target?: string | null
          created_at?: string
          former_state?: string | null
          id?: string
          input_type?: Database["public"]["Enums"]["input_type"]
          is_included?: boolean
          metrics?: string
          position?: number
          quarter_1_accomplishment?: string | null
          quarter_2_accomplishment?: string | null
          quarter_3_accomplishment?: string | null
          quarter_4_accomplishment?: string | null
          remarks?: string | null
          total_accomplishment?: string | null
          updated_at?: string
          variance?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accomplishment_metrics_accomplishment_program_project_id_fkey"
            columns: ["accomplishment_program_project_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_program_project"
            referencedColumns: ["id"]
          },
        ]
      }
      accomplishment_program_project: {
        Row: {
          accomplishment_report_id: string
          created_at: string
          id: string
          is_included: boolean
          position: number
          program_project: string
          updated_at: string
        }
        Insert: {
          accomplishment_report_id: string
          created_at?: string
          id?: string
          is_included?: boolean
          position: number
          program_project: string
          updated_at?: string
        }
        Update: {
          accomplishment_report_id?: string
          created_at?: string
          id?: string
          is_included?: boolean
          position?: number
          program_project?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "accomplishment_program_project_accomplishment_report_id_fkey"
            columns: ["accomplishment_report_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report"
            referencedColumns: ["id"]
          },
        ]
      }
      accomplishment_report: {
        Row: {
          created_at: string
          head_of_operating_unit: string
          id: string
          implementing_unit: string
          office_id: number | null
          owner_id: string
          program_id: number | null
          status: Database["public"]["Enums"]["accomplishment_status"]
          title: string
          unit_id: number | null
          updated_at: string
          using_template: boolean
        }
        Insert: {
          created_at?: string
          head_of_operating_unit: string
          id?: string
          implementing_unit: string
          office_id?: number | null
          owner_id: string
          program_id?: number | null
          status?: Database["public"]["Enums"]["accomplishment_status"]
          title: string
          unit_id?: number | null
          updated_at?: string
          using_template?: boolean
        }
        Update: {
          created_at?: string
          head_of_operating_unit?: string
          id?: string
          implementing_unit?: string
          office_id?: number | null
          owner_id?: string
          program_id?: number | null
          status?: Database["public"]["Enums"]["accomplishment_status"]
          title?: string
          unit_id?: number | null
          updated_at?: string
          using_template?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "accomplishment_report_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "office"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accomplishment_report_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "program"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accomplishment_report_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "unit"
            referencedColumns: ["id"]
          },
        ]
      }
      accomplishment_report_template: {
        Row: {
          created_at: string
          id: string
          is_published: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_published?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_published?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      accomplishment_template_metrics: {
        Row: {
          accomplishment_template_program_project_id: string
          annual_target: string | null
          created_at: string
          former_state: string | null
          id: string
          metrics: string
          position: number
          updated_at: string
        }
        Insert: {
          accomplishment_template_program_project_id: string
          annual_target?: string | null
          created_at?: string
          former_state?: string | null
          id?: string
          metrics: string
          position: number
          updated_at?: string
        }
        Update: {
          accomplishment_template_program_project_id?: string
          annual_target?: string | null
          created_at?: string
          former_state?: string | null
          id?: string
          metrics?: string
          position?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "accomplishment_template_metri_accomplishment_template_prog_fkey"
            columns: ["accomplishment_template_program_project_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_template_program_project"
            referencedColumns: ["id"]
          },
        ]
      }
      accomplishment_template_program_project: {
        Row: {
          accomplishment_report_template_id: string
          created_at: string
          id: string
          position: number
          program_project: string
          updated_at: string
        }
        Insert: {
          accomplishment_report_template_id: string
          created_at?: string
          id?: string
          position: number
          program_project: string
          updated_at?: string
        }
        Update: {
          accomplishment_report_template_id?: string
          created_at?: string
          id?: string
          position?: number
          program_project?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "accomplishment_template_progr_accomplishment_report_templa_fkey"
            columns: ["accomplishment_report_template_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_template"
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
      ipcr: {
        Row: {
          created_at: string
          dean: string | null
          head_of_operating_unit: string | null
          id: string
          immediate_supervisor: string | null
          office_id: number | null
          owner_id: string | null
          program_chair: string | null
          program_id: number | null
          status: Database["public"]["Enums"]["ipcr_status"]
          title: string
          unit_id: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          dean?: string | null
          head_of_operating_unit?: string | null
          id?: string
          immediate_supervisor?: string | null
          office_id?: number | null
          owner_id?: string | null
          program_chair?: string | null
          program_id?: number | null
          status?: Database["public"]["Enums"]["ipcr_status"]
          title: string
          unit_id?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          dean?: string | null
          head_of_operating_unit?: string | null
          id?: string
          immediate_supervisor?: string | null
          office_id?: number | null
          owner_id?: string | null
          program_chair?: string | null
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
      ipcr_function: {
        Row: {
          created_at: string
          id: string
          ipcr_id: string
          percentage: number
          position: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          ipcr_id: string
          percentage: number
          position: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          ipcr_id?: string
          percentage?: number
          position?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ipcr_function_ipcr_id_fkey"
            columns: ["ipcr_id"]
            isOneToOne: false
            referencedRelation: "ipcr"
            referencedColumns: ["id"]
          },
        ]
      }
      ipcr_function_category: {
        Row: {
          category: string
          created_at: string
          id: string
          immediate_supervisor_id: string | null
          ipcr_function_id: string
          position: number
          unit: number | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          immediate_supervisor_id?: string | null
          ipcr_function_id: string
          position: number
          unit?: number | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          immediate_supervisor_id?: string | null
          ipcr_function_id?: string
          position?: number
          unit?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ipcr_function_category_ipcr_function_id_fkey"
            columns: ["ipcr_function_id"]
            isOneToOne: false
            referencedRelation: "ipcr_function"
            referencedColumns: ["id"]
          },
        ]
      }
      ipcr_function_sub_category: {
        Row: {
          created_at: string
          id: string
          ipcr_function_category_id: string
          position: number
          sub_category: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          ipcr_function_category_id: string
          position: number
          sub_category: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          ipcr_function_category_id?: string
          position?: number
          sub_category?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ipcr_function_sub_category_ipcr_function_category_id_fkey"
            columns: ["ipcr_function_category_id"]
            isOneToOne: false
            referencedRelation: "ipcr_function_category"
            referencedColumns: ["id"]
          },
        ]
      }
      ipcr_indicator: {
        Row: {
          accomplishment_date: string | null
          actual_accomplishments: string | null
          average_rating: number | null
          created_at: string
          efficiency_rating: number | null
          final_output: string
          id: string
          immediate_supervisor_id: string | null
          ipcr_function_category_id: string | null
          ipcr_function_id: string | null
          ipcr_function_sub_category_id: string | null
          op_activity_id: string
          position: number
          quality_rating: number | null
          remarks: string | null
          status: Database["public"]["Enums"]["ipcr_indicator_status"]
          success_indicator: string
          timeliness_rating: number | null
          units: number | null
          updated_at: string
        }
        Insert: {
          accomplishment_date?: string | null
          actual_accomplishments?: string | null
          average_rating?: number | null
          created_at?: string
          efficiency_rating?: number | null
          final_output: string
          id?: string
          immediate_supervisor_id?: string | null
          ipcr_function_category_id?: string | null
          ipcr_function_id?: string | null
          ipcr_function_sub_category_id?: string | null
          op_activity_id: string
          position: number
          quality_rating?: number | null
          remarks?: string | null
          status?: Database["public"]["Enums"]["ipcr_indicator_status"]
          success_indicator: string
          timeliness_rating?: number | null
          units?: number | null
          updated_at?: string
        }
        Update: {
          accomplishment_date?: string | null
          actual_accomplishments?: string | null
          average_rating?: number | null
          created_at?: string
          efficiency_rating?: number | null
          final_output?: string
          id?: string
          immediate_supervisor_id?: string | null
          ipcr_function_category_id?: string | null
          ipcr_function_id?: string | null
          ipcr_function_sub_category_id?: string | null
          op_activity_id?: string
          position?: number
          quality_rating?: number | null
          remarks?: string | null
          status?: Database["public"]["Enums"]["ipcr_indicator_status"]
          success_indicator?: string
          timeliness_rating?: number | null
          units?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ipcr_indicator_ipcr_function_category_id_fkey"
            columns: ["ipcr_function_category_id"]
            isOneToOne: false
            referencedRelation: "ipcr_function_category"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ipcr_indicator_ipcr_function_id_fkey"
            columns: ["ipcr_function_id"]
            isOneToOne: false
            referencedRelation: "ipcr_function"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ipcr_indicator_ipcr_function_sub_category_id_fkey"
            columns: ["ipcr_function_sub_category_id"]
            isOneToOne: false
            referencedRelation: "ipcr_function_sub_category"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ipcr_indicator_op_activity_id_fkey"
            columns: ["op_activity_id"]
            isOneToOne: false
            referencedRelation: "op_activity"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ipcr_indicator_op_activity_id_fkey"
            columns: ["op_activity_id"]
            isOneToOne: false
            referencedRelation: "operational_plan_activities"
            referencedColumns: ["activity_id"]
          },
        ]
      }
      ipcr_indicator_evidence: {
        Row: {
          created_at: string
          file_path: string
          id: string
          ipcr_indicator_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          file_path: string
          id?: string
          ipcr_indicator_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          file_path?: string
          id?: string
          ipcr_indicator_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ipcr_indicator_evidence_ipcr_indicator_id_fkey"
            columns: ["ipcr_indicator_id"]
            isOneToOne: false
            referencedRelation: "ipcr_indicator"
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
      op_activity: {
        Row: {
          activity: string
          created_at: string
          former_state: string
          id: string
          input_type: Database["public"]["Enums"]["input_type_op"]
          op_annual_plan_id: string
          performance_indicator: string
          position: number
          q1_target: string | null
          q2_target: string | null
          q3_target: string | null
          q4_target: string | null
          responsible_officer_unit: string
          total: string | null
          total_budgetary_requirements: string
          updated_at: string
        }
        Insert: {
          activity: string
          created_at?: string
          former_state: string
          id?: string
          input_type?: Database["public"]["Enums"]["input_type_op"]
          op_annual_plan_id: string
          performance_indicator: string
          position: number
          q1_target?: string | null
          q2_target?: string | null
          q3_target?: string | null
          q4_target?: string | null
          responsible_officer_unit: string
          total?: string | null
          total_budgetary_requirements: string
          updated_at?: string
        }
        Update: {
          activity?: string
          created_at?: string
          former_state?: string
          id?: string
          input_type?: Database["public"]["Enums"]["input_type_op"]
          op_annual_plan_id?: string
          performance_indicator?: string
          position?: number
          q1_target?: string | null
          q2_target?: string | null
          q3_target?: string | null
          q4_target?: string | null
          responsible_officer_unit?: string
          total?: string | null
          total_budgetary_requirements?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "op_activity_op_annual_plan_id_fkey"
            columns: ["op_annual_plan_id"]
            isOneToOne: false
            referencedRelation: "op_annual_plan"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "op_activity_op_annual_plan_id_fkey"
            columns: ["op_annual_plan_id"]
            isOneToOne: false
            referencedRelation: "operational_plan_activities"
            referencedColumns: ["annual_plan_id"]
          },
        ]
      }
      op_annual_plan: {
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
            foreignKeyName: "op_annual_plan_op_header_id_fkey"
            columns: ["op_header_id"]
            isOneToOne: false
            referencedRelation: "op_header"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "op_annual_plan_op_header_id_fkey"
            columns: ["op_header_id"]
            isOneToOne: false
            referencedRelation: "operational_plan_activities"
            referencedColumns: ["header_id"]
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
          {
            foreignKeyName: "op_header_operational_plan_id_fkey"
            columns: ["operational_plan_id"]
            isOneToOne: false
            referencedRelation: "operational_plan_activities"
            referencedColumns: ["operational_plan_id"]
          },
        ]
      }
      operational_plan: {
        Row: {
          approve_by: string | null
          approver_position: string | null
          created_at: string
          creator_id: string
          id: string
          implementing_unit: string
          office_id: number | null
          program_id: number | null
          review_by: string | null
          reviewer_position: string | null
          title: string
          unit_id: number
          updated_at: string
        }
        Insert: {
          approve_by?: string | null
          approver_position?: string | null
          created_at?: string
          creator_id: string
          id?: string
          implementing_unit: string
          office_id?: number | null
          program_id?: number | null
          review_by?: string | null
          reviewer_position?: string | null
          title: string
          unit_id: number
          updated_at?: string
        }
        Update: {
          approve_by?: string | null
          approver_position?: string | null
          created_at?: string
          creator_id?: string
          id?: string
          implementing_unit?: string
          office_id?: number | null
          program_id?: number | null
          review_by?: string | null
          reviewer_position?: string | null
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
      ipcr_supervisors: {
        Row: {
          full_name: string | null
          id: string | null
          ipcr_id: string | null
          position: string | null
        }
        Relationships: []
      }
      operational_plan_activities: {
        Row: {
          activity: string | null
          activity_created_at: string | null
          activity_id: string | null
          activity_position: number | null
          activity_updated_at: string | null
          annual_plan_description: string | null
          annual_plan_id: string | null
          annual_plan_position: number | null
          approve_by: string | null
          approver_position: string | null
          creator_id: string | null
          former_state: string | null
          header_id: string | null
          header_position: number | null
          header_title: string | null
          implementing_unit: string | null
          input_type: Database["public"]["Enums"]["input_type_op"] | null
          office_id: number | null
          operational_plan_id: string | null
          operational_plan_title: string | null
          performance_indicator: string | null
          program_id: number | null
          q1_target: string | null
          q2_target: string | null
          q3_target: string | null
          q4_target: string | null
          responsible_officer_unit: string | null
          review_by: string | null
          reviewer_position: string | null
          total: string | null
          total_budgetary_requirements: string | null
          unit_id: number | null
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
      create_accomplishment_report_from_template: {
        Args: {
          p_implementing_unit: string
          p_title: string
          p_head_of_operating_unit: string
          p_owner_id: string
          p_unit_id: number
          p_office_id?: number
          p_program_id?: number
        }
        Returns: string
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
      toggle_metrics_inclusion: {
        Args: {
          metrics_id: string
        }
        Returns: {
          id: string
          is_included: boolean
          accomplishment_program_project_id: string
          metrics: string
          former_state: string
          annual_target: string
          quarter_1_accomplishment: string
          quarter_2_accomplishment: string
          quarter_3_accomplishment: string
          quarter_4_accomplishment: string
          total_accomplishment: string
          variance: string
          remarks: string
          position: number
          created_at: string
          updated_at: string
        }[]
      }
      toggle_program_project_inclusion: {
        Args: {
          program_project_id: string
        }
        Returns: {
          id: string
          is_included: boolean
          accomplishment_report_id: string
          program_project: string
          position: number
          created_at: string
          updated_at: string
        }[]
      }
      validate_ipcr: {
        Args: {
          p_ipcr_id: string
        }
        Returns: Database["public"]["CompositeTypes"]["validation_result"]
      }
    }
    Enums: {
      accomplishment_status:
        | "draft"
        | "submitted"
        | "reviewing"
        | "revision"
        | "approved"
      input_type: "percentage" | "number" | "ratio" | "text"
      input_type_op: "percentage" | "number" | "ratio" | "text"
      ipcr_indicator_status:
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

