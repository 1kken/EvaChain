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
      accomplishment_activity: {
        Row: {
          accomplishment_annual_plan_id: string
          activity: string
          created_at: string
          id: string
          position: number
          updated_at: string
        }
        Insert: {
          accomplishment_annual_plan_id: string
          activity: string
          created_at?: string
          id?: string
          position: number
          updated_at?: string
        }
        Update: {
          accomplishment_annual_plan_id?: string
          activity?: string
          created_at?: string
          id?: string
          position?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "accomplishment_activity_accomplishment_annual_plan_id_fkey"
            columns: ["accomplishment_annual_plan_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_annual_plan"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accomplishment_activity_accomplishment_annual_plan_id_fkey"
            columns: ["accomplishment_annual_plan_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["annual_plan_id"]
          },
        ]
      }
      accomplishment_activity_indicator: {
        Row: {
          accomplishment_activity_id: string
          accomplishment_rate: string | null
          annual_target: string
          created_at: string
          id: string
          input_type: Database["public"]["Enums"]["input_type_accomplishment"]
          performance_indicator: string
          position: number
          q1_accomplishment: string | null
          q2_accomplishment: string | null
          q3_accomplishment: string | null
          q4_accomplishment: string | null
          remarks: string | null
          responsible_officer_unit: string
          total: string | null
          updated_at: string
        }
        Insert: {
          accomplishment_activity_id: string
          accomplishment_rate?: string | null
          annual_target: string
          created_at?: string
          id?: string
          input_type?: Database["public"]["Enums"]["input_type_accomplishment"]
          performance_indicator: string
          position: number
          q1_accomplishment?: string | null
          q2_accomplishment?: string | null
          q3_accomplishment?: string | null
          q4_accomplishment?: string | null
          remarks?: string | null
          responsible_officer_unit: string
          total?: string | null
          updated_at?: string
        }
        Update: {
          accomplishment_activity_id?: string
          accomplishment_rate?: string | null
          annual_target?: string
          created_at?: string
          id?: string
          input_type?: Database["public"]["Enums"]["input_type_accomplishment"]
          performance_indicator?: string
          position?: number
          q1_accomplishment?: string | null
          q2_accomplishment?: string | null
          q3_accomplishment?: string | null
          q4_accomplishment?: string | null
          remarks?: string | null
          responsible_officer_unit?: string
          total?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "accomplishment_activity_indicat_accomplishment_activity_id_fkey"
            columns: ["accomplishment_activity_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_activity"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accomplishment_activity_indicat_accomplishment_activity_id_fkey"
            columns: ["accomplishment_activity_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["activity_id"]
          },
        ]
      }
      accomplishment_annual_plan: {
        Row: {
          accomplishment_header_id: string
          created_at: string
          description: string
          id: string
          position: number
          updated_at: string
        }
        Insert: {
          accomplishment_header_id: string
          created_at?: string
          description: string
          id?: string
          position: number
          updated_at?: string
        }
        Update: {
          accomplishment_header_id?: string
          created_at?: string
          description?: string
          id?: string
          position?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "accomplishment_annual_plan_accomplishment_header_id_fkey"
            columns: ["accomplishment_header_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_header"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accomplishment_annual_plan_accomplishment_header_id_fkey"
            columns: ["accomplishment_header_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["header_id"]
          },
        ]
      }
      accomplishment_header: {
        Row: {
          accomplishment_report_id: string
          created_at: string
          id: string
          position: number
          title: string
          updated_at: string
        }
        Insert: {
          accomplishment_report_id: string
          created_at?: string
          id?: string
          position: number
          title: string
          updated_at?: string
        }
        Update: {
          accomplishment_report_id?: string
          created_at?: string
          id?: string
          position?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "accomplishment_header_accomplishment_report_id_fkey"
            columns: ["accomplishment_report_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accomplishment_header_accomplishment_report_id_fkey"
            columns: ["accomplishment_report_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["accomplishment_report_id"]
          },
          {
            foreignKeyName: "accomplishment_header_accomplishment_report_id_fkey"
            columns: ["accomplishment_report_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_category_avg"
            referencedColumns: ["id"]
          },
        ]
      }
      accomplishment_history: {
        Row: {
          created_at: string
          id: string
          input_value: string
          ipcr_indicator_accomplishment_id: string
          quarter: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          input_value: string
          ipcr_indicator_accomplishment_id: string
          quarter: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          input_value?: string
          ipcr_indicator_accomplishment_id?: string
          quarter?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "accomplishment_history_ipcr_indicator_accomplishment_id_fkey"
            columns: ["ipcr_indicator_accomplishment_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["accomplishment_id"]
          },
          {
            foreignKeyName: "accomplishment_history_ipcr_indicator_accomplishment_id_fkey"
            columns: ["ipcr_indicator_accomplishment_id"]
            isOneToOne: false
            referencedRelation: "ipcr_indicator_accomplishment"
            referencedColumns: ["id"]
          },
        ]
      }
      accomplishment_report: {
        Row: {
          approve_by: string
          approver_position: string
          created_at: string
          id: string
          implementing_unit: string
          office_id: number | null
          owner_id: string
          program_id: number | null
          review_by: string
          reviewer_position: string
          title: string
          unit_id: number | null
          updated_at: string
        }
        Insert: {
          approve_by: string
          approver_position: string
          created_at?: string
          id?: string
          implementing_unit: string
          office_id?: number | null
          owner_id: string
          program_id?: number | null
          review_by: string
          reviewer_position: string
          title: string
          unit_id?: number | null
          updated_at?: string
        }
        Update: {
          approve_by?: string
          approver_position?: string
          created_at?: string
          id?: string
          implementing_unit?: string
          office_id?: number | null
          owner_id?: string
          program_id?: number | null
          review_by?: string
          reviewer_position?: string
          title?: string
          unit_id?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "accomplishment_report_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["ar_office_id"]
          },
          {
            foreignKeyName: "accomplishment_report_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "accomplishment_report_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "accomplishment_report_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["dpcr_office_id"]
          },
          {
            foreignKeyName: "accomplishment_report_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "accomplishment_report_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["ipcr_office_id"]
          },
          {
            foreignKeyName: "accomplishment_report_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "ipcr_owner_details"
            referencedColumns: ["office_id"]
          },
          {
            foreignKeyName: "accomplishment_report_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "office"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accomplishment_report_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["opcr_office_id"]
          },
          {
            foreignKeyName: "accomplishment_report_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "accomplishment_report_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "profile_details_view"
            referencedColumns: ["office_id"]
          },
          {
            foreignKeyName: "accomplishment_report_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "accomplishment_report_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["sp_office_id"]
          },
          {
            foreignKeyName: "accomplishment_report_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "accomplishment_report_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["ar_program_id"]
          },
          {
            foreignKeyName: "accomplishment_report_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["dpcr_program_id"]
          },
          {
            foreignKeyName: "accomplishment_report_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "accomplishment_report_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "accomplishment_report_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["ipcr_program_id"]
          },
          {
            foreignKeyName: "accomplishment_report_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "ipcr_owner_details"
            referencedColumns: ["program_id"]
          },
          {
            foreignKeyName: "accomplishment_report_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["opcr_program_id"]
          },
          {
            foreignKeyName: "accomplishment_report_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "accomplishment_report_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "profile_details_view"
            referencedColumns: ["program_id"]
          },
          {
            foreignKeyName: "accomplishment_report_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "program"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accomplishment_report_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "accomplishment_report_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["sp_program_id"]
          },
          {
            foreignKeyName: "accomplishment_report_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "accomplishment_report_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["ar_unit_id"]
          },
          {
            foreignKeyName: "accomplishment_report_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "accomplishment_report_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["dpcr_unit_id"]
          },
          {
            foreignKeyName: "accomplishment_report_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "accomplishment_report_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["ipcr_unit_id"]
          },
          {
            foreignKeyName: "accomplishment_report_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "ipcr_owner_details"
            referencedColumns: ["unit_id"]
          },
          {
            foreignKeyName: "accomplishment_report_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["opcr_unit_id"]
          },
          {
            foreignKeyName: "accomplishment_report_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "accomplishment_report_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "profile_details_view"
            referencedColumns: ["unit_id"]
          },
          {
            foreignKeyName: "accomplishment_report_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["sp_unit_id"]
          },
          {
            foreignKeyName: "accomplishment_report_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["owner_unit_id"]
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
      blockchain_data: {
        Row: {
          action: string
          blockchain_hash: string
          created_at: string
          file_cid: string
          file_name: string
          id: string
          type: string
          updated_at: string
        }
        Insert: {
          action?: string
          blockchain_hash: string
          created_at?: string
          file_cid: string
          file_name: string
          id?: string
          type?: string
          updated_at?: string
        }
        Update: {
          action?: string
          blockchain_hash?: string
          created_at?: string
          file_cid?: string
          file_name?: string
          id?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      dpcr: {
        Row: {
          created_at: string
          id: string
          office_id: number | null
          owner_id: string
          program_id: number | null
          review_by: string
          reviewer_position: string
          status: Database["public"]["Enums"]["dpcr_status"]
          title: string
          unit_id: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          office_id?: number | null
          owner_id: string
          program_id?: number | null
          review_by: string
          reviewer_position: string
          status?: Database["public"]["Enums"]["dpcr_status"]
          title: string
          unit_id?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          office_id?: number | null
          owner_id?: string
          program_id?: number | null
          review_by?: string
          reviewer_position?: string
          status?: Database["public"]["Enums"]["dpcr_status"]
          title?: string
          unit_id?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dpcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["ar_office_id"]
          },
          {
            foreignKeyName: "dpcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "dpcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "dpcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["dpcr_office_id"]
          },
          {
            foreignKeyName: "dpcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "dpcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["ipcr_office_id"]
          },
          {
            foreignKeyName: "dpcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "ipcr_owner_details"
            referencedColumns: ["office_id"]
          },
          {
            foreignKeyName: "dpcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "office"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dpcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["opcr_office_id"]
          },
          {
            foreignKeyName: "dpcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "dpcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "profile_details_view"
            referencedColumns: ["office_id"]
          },
          {
            foreignKeyName: "dpcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "dpcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["sp_office_id"]
          },
          {
            foreignKeyName: "dpcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "dpcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["ar_program_id"]
          },
          {
            foreignKeyName: "dpcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["dpcr_program_id"]
          },
          {
            foreignKeyName: "dpcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "dpcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "dpcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["ipcr_program_id"]
          },
          {
            foreignKeyName: "dpcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "ipcr_owner_details"
            referencedColumns: ["program_id"]
          },
          {
            foreignKeyName: "dpcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["opcr_program_id"]
          },
          {
            foreignKeyName: "dpcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "dpcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "profile_details_view"
            referencedColumns: ["program_id"]
          },
          {
            foreignKeyName: "dpcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "program"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dpcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "dpcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["sp_program_id"]
          },
          {
            foreignKeyName: "dpcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "dpcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["ar_unit_id"]
          },
          {
            foreignKeyName: "dpcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "dpcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["dpcr_unit_id"]
          },
          {
            foreignKeyName: "dpcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "dpcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["ipcr_unit_id"]
          },
          {
            foreignKeyName: "dpcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "ipcr_owner_details"
            referencedColumns: ["unit_id"]
          },
          {
            foreignKeyName: "dpcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["opcr_unit_id"]
          },
          {
            foreignKeyName: "dpcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "dpcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "profile_details_view"
            referencedColumns: ["unit_id"]
          },
          {
            foreignKeyName: "dpcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["sp_unit_id"]
          },
          {
            foreignKeyName: "dpcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "dpcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "unit"
            referencedColumns: ["id"]
          },
        ]
      }
      dpcr_assessor: {
        Row: {
          created_at: string
          dpcr_id: string
          id: string
          name: string
          position: string
          sequence: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          dpcr_id: string
          id?: string
          name: string
          position: string
          sequence?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          dpcr_id?: string
          id?: string
          name?: string
          position?: string
          sequence?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dpcr_assessor_dpcr_id_fkey"
            columns: ["dpcr_id"]
            isOneToOne: false
            referencedRelation: "dpcr"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dpcr_assessor_dpcr_id_fkey"
            columns: ["dpcr_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["dpcr_id"]
          },
        ]
      }
      dpcr_function: {
        Row: {
          created_at: string
          dpcr_id: string
          id: string
          position: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          dpcr_id: string
          id?: string
          position: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          dpcr_id?: string
          id?: string
          position?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dpcr_function_dpcr_id_fkey"
            columns: ["dpcr_id"]
            isOneToOne: false
            referencedRelation: "dpcr"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dpcr_function_dpcr_id_fkey"
            columns: ["dpcr_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["dpcr_id"]
          },
        ]
      }
      dpcr_function_category: {
        Row: {
          category: string
          created_at: string
          dpcr_function_id: string
          id: string
          position: number
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          dpcr_function_id: string
          id?: string
          position: number
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          dpcr_function_id?: string
          id?: string
          position?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dpcr_function_category_dpcr_function_id_fkey"
            columns: ["dpcr_function_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["function_id"]
          },
          {
            foreignKeyName: "dpcr_function_category_dpcr_function_id_fkey"
            columns: ["dpcr_function_id"]
            isOneToOne: false
            referencedRelation: "dpcr_function"
            referencedColumns: ["id"]
          },
        ]
      }
      dpcr_indicator: {
        Row: {
          actual_accomplishments: string | null
          alloted_budget: string | null
          average_rating: number | null
          created_at: string
          division_individuals_accountable: string | null
          dpcr_function_category_id: string | null
          dpcr_function_id: string | null
          efficiency_rating: number | null
          id: string
          physical_targets: string | null
          position: number
          quality_rating: number | null
          remarks: string | null
          success_indicator: string
          timeliness_rating: number | null
          updated_at: string
        }
        Insert: {
          actual_accomplishments?: string | null
          alloted_budget?: string | null
          average_rating?: number | null
          created_at?: string
          division_individuals_accountable?: string | null
          dpcr_function_category_id?: string | null
          dpcr_function_id?: string | null
          efficiency_rating?: number | null
          id?: string
          physical_targets?: string | null
          position: number
          quality_rating?: number | null
          remarks?: string | null
          success_indicator: string
          timeliness_rating?: number | null
          updated_at?: string
        }
        Update: {
          actual_accomplishments?: string | null
          alloted_budget?: string | null
          average_rating?: number | null
          created_at?: string
          division_individuals_accountable?: string | null
          dpcr_function_category_id?: string | null
          dpcr_function_id?: string | null
          efficiency_rating?: number | null
          id?: string
          physical_targets?: string | null
          position?: number
          quality_rating?: number | null
          remarks?: string | null
          success_indicator?: string
          timeliness_rating?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dpcr_indicator_dpcr_function_category_id_fkey"
            columns: ["dpcr_function_category_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "dpcr_indicator_dpcr_function_category_id_fkey"
            columns: ["dpcr_function_category_id"]
            isOneToOne: false
            referencedRelation: "dpcr_function_category"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dpcr_indicator_dpcr_function_id_fkey"
            columns: ["dpcr_function_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["function_id"]
          },
          {
            foreignKeyName: "dpcr_indicator_dpcr_function_id_fkey"
            columns: ["dpcr_function_id"]
            isOneToOne: false
            referencedRelation: "dpcr_function"
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
          immediate_supervisor_position: string | null
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
          immediate_supervisor_position?: string | null
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
          immediate_supervisor_position?: string | null
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
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["ar_office_id"]
          },
          {
            foreignKeyName: "ipcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "ipcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "ipcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["dpcr_office_id"]
          },
          {
            foreignKeyName: "ipcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "ipcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["ipcr_office_id"]
          },
          {
            foreignKeyName: "ipcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "ipcr_owner_details"
            referencedColumns: ["office_id"]
          },
          {
            foreignKeyName: "ipcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "office"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ipcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["opcr_office_id"]
          },
          {
            foreignKeyName: "ipcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "ipcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "profile_details_view"
            referencedColumns: ["office_id"]
          },
          {
            foreignKeyName: "ipcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "ipcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["sp_office_id"]
          },
          {
            foreignKeyName: "ipcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "ipcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["ar_program_id"]
          },
          {
            foreignKeyName: "ipcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["dpcr_program_id"]
          },
          {
            foreignKeyName: "ipcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "ipcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "ipcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["ipcr_program_id"]
          },
          {
            foreignKeyName: "ipcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "ipcr_owner_details"
            referencedColumns: ["program_id"]
          },
          {
            foreignKeyName: "ipcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["opcr_program_id"]
          },
          {
            foreignKeyName: "ipcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "ipcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "profile_details_view"
            referencedColumns: ["program_id"]
          },
          {
            foreignKeyName: "ipcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "program"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ipcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "ipcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["sp_program_id"]
          },
          {
            foreignKeyName: "ipcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "ipcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["ar_unit_id"]
          },
          {
            foreignKeyName: "ipcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "ipcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["dpcr_unit_id"]
          },
          {
            foreignKeyName: "ipcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "ipcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["ipcr_unit_id"]
          },
          {
            foreignKeyName: "ipcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "ipcr_owner_details"
            referencedColumns: ["unit_id"]
          },
          {
            foreignKeyName: "ipcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["opcr_unit_id"]
          },
          {
            foreignKeyName: "ipcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "ipcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "profile_details_view"
            referencedColumns: ["unit_id"]
          },
          {
            foreignKeyName: "ipcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["sp_unit_id"]
          },
          {
            foreignKeyName: "ipcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["owner_unit_id"]
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
          {
            foreignKeyName: "ipcr_function_ipcr_id_fkey"
            columns: ["ipcr_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["ipcr_id"]
          },
          {
            foreignKeyName: "ipcr_function_ipcr_id_fkey"
            columns: ["ipcr_id"]
            isOneToOne: false
            referencedRelation: "ipcr_owner_details"
            referencedColumns: ["ipcr_id"]
          },
          {
            foreignKeyName: "ipcr_function_ipcr_id_fkey"
            columns: ["ipcr_id"]
            isOneToOne: false
            referencedRelation: "ipcr_performance_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ipcr_function_ipcr_id_fkey"
            columns: ["ipcr_id"]
            isOneToOne: false
            referencedRelation: "ipcr_supervisor_details_view"
            referencedColumns: ["ipcr_id"]
          },
          {
            foreignKeyName: "ipcr_function_ipcr_id_fkey"
            columns: ["ipcr_id"]
            isOneToOne: false
            referencedRelation: "ipcr_supervisor_status_view"
            referencedColumns: ["ipcr_id"]
          },
          {
            foreignKeyName: "ipcr_function_ipcr_id_fkey"
            columns: ["ipcr_id"]
            isOneToOne: false
            referencedRelation: "ipcr_teaching_effectiveness_avg"
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
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["function_id"]
          },
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
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "ipcr_function_sub_category_ipcr_function_category_id_fkey"
            columns: ["ipcr_function_category_id"]
            isOneToOne: false
            referencedRelation: "ipcr_function_category"
            referencedColumns: ["id"]
          },
        ]
      }
      ipcr_immediate_supervisor: {
        Row: {
          created_at: string
          id: string
          ipcr_id: string
          status: Database["public"]["Enums"]["ipcr_supervisor_status"] | null
          supervisor_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          ipcr_id: string
          status?: Database["public"]["Enums"]["ipcr_supervisor_status"] | null
          supervisor_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          ipcr_id?: string
          status?: Database["public"]["Enums"]["ipcr_supervisor_status"] | null
          supervisor_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ipcr_immediate_supervisor_ipcr_id_fkey"
            columns: ["ipcr_id"]
            isOneToOne: false
            referencedRelation: "ipcr"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ipcr_immediate_supervisor_ipcr_id_fkey"
            columns: ["ipcr_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["ipcr_id"]
          },
          {
            foreignKeyName: "ipcr_immediate_supervisor_ipcr_id_fkey"
            columns: ["ipcr_id"]
            isOneToOne: false
            referencedRelation: "ipcr_owner_details"
            referencedColumns: ["ipcr_id"]
          },
          {
            foreignKeyName: "ipcr_immediate_supervisor_ipcr_id_fkey"
            columns: ["ipcr_id"]
            isOneToOne: false
            referencedRelation: "ipcr_performance_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ipcr_immediate_supervisor_ipcr_id_fkey"
            columns: ["ipcr_id"]
            isOneToOne: false
            referencedRelation: "ipcr_supervisor_details_view"
            referencedColumns: ["ipcr_id"]
          },
          {
            foreignKeyName: "ipcr_immediate_supervisor_ipcr_id_fkey"
            columns: ["ipcr_id"]
            isOneToOne: false
            referencedRelation: "ipcr_supervisor_status_view"
            referencedColumns: ["ipcr_id"]
          },
          {
            foreignKeyName: "ipcr_immediate_supervisor_ipcr_id_fkey"
            columns: ["ipcr_id"]
            isOneToOne: false
            referencedRelation: "ipcr_teaching_effectiveness_avg"
            referencedColumns: ["id"]
          },
        ]
      }
      ipcr_indicator: {
        Row: {
          average_rating: number | null
          created_at: string
          efficiency_rating: number | null
          final_output: string
          id: string
          immediate_supervisor_id: string | null
          ipcr_function_category_id: string | null
          ipcr_function_id: string | null
          ipcr_function_sub_category_id: string | null
          op_activity_indicator_id: string
          position: number
          quality_rating: number | null
          remarks: string | null
          success_indicator: string
          timeliness_rating: number | null
          units: number | null
          updated_at: string
        }
        Insert: {
          average_rating?: number | null
          created_at?: string
          efficiency_rating?: number | null
          final_output: string
          id?: string
          immediate_supervisor_id?: string | null
          ipcr_function_category_id?: string | null
          ipcr_function_id?: string | null
          ipcr_function_sub_category_id?: string | null
          op_activity_indicator_id: string
          position: number
          quality_rating?: number | null
          remarks?: string | null
          success_indicator: string
          timeliness_rating?: number | null
          units?: number | null
          updated_at?: string
        }
        Update: {
          average_rating?: number | null
          created_at?: string
          efficiency_rating?: number | null
          final_output?: string
          id?: string
          immediate_supervisor_id?: string | null
          ipcr_function_category_id?: string | null
          ipcr_function_id?: string | null
          ipcr_function_sub_category_id?: string | null
          op_activity_indicator_id?: string
          position?: number
          quality_rating?: number | null
          remarks?: string | null
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
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["category_id"]
          },
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
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["function_id"]
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
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["subcategory_id"]
          },
          {
            foreignKeyName: "ipcr_indicator_ipcr_function_sub_category_id_fkey"
            columns: ["ipcr_function_sub_category_id"]
            isOneToOne: false
            referencedRelation: "ipcr_function_sub_category"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ipcr_indicator_op_activity_indicator_id_fkey"
            columns: ["op_activity_indicator_id"]
            isOneToOne: false
            referencedRelation: "op_activity_indicator"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ipcr_indicator_op_activity_indicator_id_fkey"
            columns: ["op_activity_indicator_id"]
            isOneToOne: false
            referencedRelation: "op_header_indicators"
            referencedColumns: ["indicator_id"]
          },
          {
            foreignKeyName: "ipcr_indicator_op_activity_indicator_id_fkey"
            columns: ["op_activity_indicator_id"]
            isOneToOne: false
            referencedRelation: "operational_backup_view"
            referencedColumns: ["indicator_id"]
          },
          {
            foreignKeyName: "ipcr_indicator_op_activity_indicator_id_fkey"
            columns: ["op_activity_indicator_id"]
            isOneToOne: false
            referencedRelation: "operational_plan_activities"
            referencedColumns: ["indicator_id"]
          },
        ]
      }
      ipcr_indicator_accomplishment: {
        Row: {
          accomplishment_date: string
          actual_accomplishments: string
          created_at: string
          id: string
          ipcr_indicator_id: string
          quantity: string
          updated_at: string
        }
        Insert: {
          accomplishment_date: string
          actual_accomplishments: string
          created_at?: string
          id?: string
          ipcr_indicator_id: string
          quantity: string
          updated_at?: string
        }
        Update: {
          accomplishment_date?: string
          actual_accomplishments?: string
          created_at?: string
          id?: string
          ipcr_indicator_id?: string
          quantity?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ipcr_indicator_accomplishment_ipcr_indicator_id_fkey"
            columns: ["ipcr_indicator_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["indicator_id"]
          },
          {
            foreignKeyName: "ipcr_indicator_accomplishment_ipcr_indicator_id_fkey"
            columns: ["ipcr_indicator_id"]
            isOneToOne: false
            referencedRelation: "ipcr_indicator"
            referencedColumns: ["id"]
          },
        ]
      }
      ipcr_indicator_evidence: {
        Row: {
          created_at: string
          file_path: string
          id: string
          ipcr_indicator_accomplishment_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          file_path: string
          id?: string
          ipcr_indicator_accomplishment_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          file_path?: string
          id?: string
          ipcr_indicator_accomplishment_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ipcr_indicator_evidence_ipcr_indicator_accomplishment_id_fkey"
            columns: ["ipcr_indicator_accomplishment_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["accomplishment_id"]
          },
          {
            foreignKeyName: "ipcr_indicator_evidence_ipcr_indicator_accomplishment_id_fkey"
            columns: ["ipcr_indicator_accomplishment_id"]
            isOneToOne: false
            referencedRelation: "ipcr_indicator_accomplishment"
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
      notifications: {
        Row: {
          created_at: string
          id: string
          is_global: boolean
          is_read: boolean | null
          message: string | null
          receiver_id: string | null
          sender_id: string
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_global?: boolean
          is_read?: boolean | null
          message?: string | null
          receiver_id?: string | null
          sender_id: string
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_global?: boolean
          is_read?: boolean | null
          message?: string | null
          receiver_id?: string | null
          sender_id?: string
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
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
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "office_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["ar_unit_id"]
          },
          {
            foreignKeyName: "office_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "office_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["dpcr_unit_id"]
          },
          {
            foreignKeyName: "office_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "office_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["ipcr_unit_id"]
          },
          {
            foreignKeyName: "office_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "ipcr_owner_details"
            referencedColumns: ["unit_id"]
          },
          {
            foreignKeyName: "office_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["opcr_unit_id"]
          },
          {
            foreignKeyName: "office_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "office_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "profile_details_view"
            referencedColumns: ["unit_id"]
          },
          {
            foreignKeyName: "office_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["sp_unit_id"]
          },
          {
            foreignKeyName: "office_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "office_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "unit"
            referencedColumns: ["id"]
          },
        ]
      }
      op_acc_indicators: {
        Row: {
          accomplishment_activity_indicator_id: string
          accomplishment_report_id: string
          created_at: string
          id: string
          op_activity_indicator_id: string
          operational_plan_id: string
          updated_at: string
        }
        Insert: {
          accomplishment_activity_indicator_id: string
          accomplishment_report_id: string
          created_at?: string
          id?: string
          op_activity_indicator_id: string
          operational_plan_id: string
          updated_at?: string
        }
        Update: {
          accomplishment_activity_indicator_id?: string
          accomplishment_report_id?: string
          created_at?: string
          id?: string
          op_activity_indicator_id?: string
          operational_plan_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "op_acc_indicators_accomplishment_activity_indicator_id_fkey"
            columns: ["accomplishment_activity_indicator_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_activity_indicator"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "op_acc_indicators_accomplishment_activity_indicator_id_fkey"
            columns: ["accomplishment_activity_indicator_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["indicator_id"]
          },
          {
            foreignKeyName: "op_acc_indicators_accomplishment_report_id_fkey"
            columns: ["accomplishment_report_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "op_acc_indicators_accomplishment_report_id_fkey"
            columns: ["accomplishment_report_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["accomplishment_report_id"]
          },
          {
            foreignKeyName: "op_acc_indicators_accomplishment_report_id_fkey"
            columns: ["accomplishment_report_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_category_avg"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "op_acc_indicators_op_activity_indicator_id_fkey"
            columns: ["op_activity_indicator_id"]
            isOneToOne: false
            referencedRelation: "op_activity_indicator"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "op_acc_indicators_op_activity_indicator_id_fkey"
            columns: ["op_activity_indicator_id"]
            isOneToOne: false
            referencedRelation: "op_header_indicators"
            referencedColumns: ["indicator_id"]
          },
          {
            foreignKeyName: "op_acc_indicators_op_activity_indicator_id_fkey"
            columns: ["op_activity_indicator_id"]
            isOneToOne: false
            referencedRelation: "operational_backup_view"
            referencedColumns: ["indicator_id"]
          },
          {
            foreignKeyName: "op_acc_indicators_op_activity_indicator_id_fkey"
            columns: ["op_activity_indicator_id"]
            isOneToOne: false
            referencedRelation: "operational_plan_activities"
            referencedColumns: ["indicator_id"]
          },
          {
            foreignKeyName: "op_acc_indicators_operational_plan_id_fkey"
            columns: ["operational_plan_id"]
            isOneToOne: false
            referencedRelation: "operational_backup_view"
            referencedColumns: ["operational_plan_id"]
          },
          {
            foreignKeyName: "op_acc_indicators_operational_plan_id_fkey"
            columns: ["operational_plan_id"]
            isOneToOne: false
            referencedRelation: "operational_plan"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "op_acc_indicators_operational_plan_id_fkey"
            columns: ["operational_plan_id"]
            isOneToOne: false
            referencedRelation: "operational_plan_activities"
            referencedColumns: ["operational_plan_id"]
          },
          {
            foreignKeyName: "op_acc_indicators_operational_plan_id_fkey"
            columns: ["operational_plan_id"]
            isOneToOne: false
            referencedRelation: "operational_plan_budget_summary"
            referencedColumns: ["operational_plan_id"]
          },
          {
            foreignKeyName: "op_acc_indicators_operational_plan_id_fkey"
            columns: ["operational_plan_id"]
            isOneToOne: false
            referencedRelation: "operational_plan_of_heads"
            referencedColumns: ["id"]
          },
        ]
      }
      op_activity: {
        Row: {
          activity: string
          created_at: string
          id: string
          op_annual_plan_id: string
          position: number
          updated_at: string
        }
        Insert: {
          activity: string
          created_at?: string
          id?: string
          op_annual_plan_id: string
          position: number
          updated_at?: string
        }
        Update: {
          activity?: string
          created_at?: string
          id?: string
          op_annual_plan_id?: string
          position?: number
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
            referencedRelation: "op_header_indicators"
            referencedColumns: ["annual_plan_id"]
          },
          {
            foreignKeyName: "op_activity_op_annual_plan_id_fkey"
            columns: ["op_annual_plan_id"]
            isOneToOne: false
            referencedRelation: "operational_backup_view"
            referencedColumns: ["annual_plan_id"]
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
      op_activity_indicator: {
        Row: {
          created_at: string
          former_state: string
          id: string
          input_type: Database["public"]["Enums"]["input_type_op"]
          op_activity_id: string
          performance_indicator: string
          position: number
          q1_target: string | null
          q2_target: string | null
          q3_target: string | null
          q4_target: string | null
          remarks: string | null
          responsible_officer_unit: string
          total: string | null
          total_budgetary_requirements: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          former_state: string
          id?: string
          input_type?: Database["public"]["Enums"]["input_type_op"]
          op_activity_id: string
          performance_indicator: string
          position: number
          q1_target?: string | null
          q2_target?: string | null
          q3_target?: string | null
          q4_target?: string | null
          remarks?: string | null
          responsible_officer_unit: string
          total?: string | null
          total_budgetary_requirements: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          former_state?: string
          id?: string
          input_type?: Database["public"]["Enums"]["input_type_op"]
          op_activity_id?: string
          performance_indicator?: string
          position?: number
          q1_target?: string | null
          q2_target?: string | null
          q3_target?: string | null
          q4_target?: string | null
          remarks?: string | null
          responsible_officer_unit?: string
          total?: string | null
          total_budgetary_requirements?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "op_activity_indicator_op_activity_id_fkey"
            columns: ["op_activity_id"]
            isOneToOne: false
            referencedRelation: "op_activity"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "op_activity_indicator_op_activity_id_fkey"
            columns: ["op_activity_id"]
            isOneToOne: false
            referencedRelation: "op_header_indicators"
            referencedColumns: ["activity_id"]
          },
          {
            foreignKeyName: "op_activity_indicator_op_activity_id_fkey"
            columns: ["op_activity_id"]
            isOneToOne: false
            referencedRelation: "operational_backup_view"
            referencedColumns: ["activity_id"]
          },
          {
            foreignKeyName: "op_activity_indicator_op_activity_id_fkey"
            columns: ["op_activity_id"]
            isOneToOne: false
            referencedRelation: "operational_plan_activities"
            referencedColumns: ["activity_id"]
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
            referencedRelation: "op_header_indicators"
            referencedColumns: ["header_id"]
          },
          {
            foreignKeyName: "op_annual_plan_op_header_id_fkey"
            columns: ["op_header_id"]
            isOneToOne: false
            referencedRelation: "operational_backup_view"
            referencedColumns: ["header_id"]
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
            referencedRelation: "operational_backup_view"
            referencedColumns: ["operational_plan_id"]
          },
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
          {
            foreignKeyName: "op_header_operational_plan_id_fkey"
            columns: ["operational_plan_id"]
            isOneToOne: false
            referencedRelation: "operational_plan_budget_summary"
            referencedColumns: ["operational_plan_id"]
          },
          {
            foreignKeyName: "op_header_operational_plan_id_fkey"
            columns: ["operational_plan_id"]
            isOneToOne: false
            referencedRelation: "operational_plan_of_heads"
            referencedColumns: ["id"]
          },
        ]
      }
      opcr: {
        Row: {
          administrative_officer: string
          created_at: string
          human_resource: string
          id: string
          office_id: number | null
          owner_id: string
          planning_officer: string
          program_id: number | null
          review_by: string
          reviewer_position: string
          title: string
          unit_id: number | null
          updated_at: string
        }
        Insert: {
          administrative_officer: string
          created_at?: string
          human_resource: string
          id?: string
          office_id?: number | null
          owner_id: string
          planning_officer: string
          program_id?: number | null
          review_by: string
          reviewer_position: string
          title: string
          unit_id?: number | null
          updated_at?: string
        }
        Update: {
          administrative_officer?: string
          created_at?: string
          human_resource?: string
          id?: string
          office_id?: number | null
          owner_id?: string
          planning_officer?: string
          program_id?: number | null
          review_by?: string
          reviewer_position?: string
          title?: string
          unit_id?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "opcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["ar_office_id"]
          },
          {
            foreignKeyName: "opcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "opcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "opcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["dpcr_office_id"]
          },
          {
            foreignKeyName: "opcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "opcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["ipcr_office_id"]
          },
          {
            foreignKeyName: "opcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "ipcr_owner_details"
            referencedColumns: ["office_id"]
          },
          {
            foreignKeyName: "opcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "office"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["opcr_office_id"]
          },
          {
            foreignKeyName: "opcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "opcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "profile_details_view"
            referencedColumns: ["office_id"]
          },
          {
            foreignKeyName: "opcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "opcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["sp_office_id"]
          },
          {
            foreignKeyName: "opcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "opcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["ar_program_id"]
          },
          {
            foreignKeyName: "opcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["dpcr_program_id"]
          },
          {
            foreignKeyName: "opcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "opcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "opcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["ipcr_program_id"]
          },
          {
            foreignKeyName: "opcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "ipcr_owner_details"
            referencedColumns: ["program_id"]
          },
          {
            foreignKeyName: "opcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["opcr_program_id"]
          },
          {
            foreignKeyName: "opcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "opcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "profile_details_view"
            referencedColumns: ["program_id"]
          },
          {
            foreignKeyName: "opcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "program"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "opcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["sp_program_id"]
          },
          {
            foreignKeyName: "opcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "opcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["ar_unit_id"]
          },
          {
            foreignKeyName: "opcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "opcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["dpcr_unit_id"]
          },
          {
            foreignKeyName: "opcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "opcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["ipcr_unit_id"]
          },
          {
            foreignKeyName: "opcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "ipcr_owner_details"
            referencedColumns: ["unit_id"]
          },
          {
            foreignKeyName: "opcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["opcr_unit_id"]
          },
          {
            foreignKeyName: "opcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "opcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "profile_details_view"
            referencedColumns: ["unit_id"]
          },
          {
            foreignKeyName: "opcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["sp_unit_id"]
          },
          {
            foreignKeyName: "opcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "opcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "unit"
            referencedColumns: ["id"]
          },
        ]
      }
      opcr_function: {
        Row: {
          created_at: string
          id: string
          opcr_id: string
          position: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          opcr_id: string
          position: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          opcr_id?: string
          position?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "opcr_function_opcr_id_fkey"
            columns: ["opcr_id"]
            isOneToOne: false
            referencedRelation: "opcr"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opcr_function_opcr_id_fkey"
            columns: ["opcr_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["opcr_id"]
          },
        ]
      }
      opcr_function_category: {
        Row: {
          category: string
          created_at: string
          id: string
          opcr_function_id: string
          position: number
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          opcr_function_id: string
          position: number
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          opcr_function_id?: string
          position?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "opcr_function_category_opcr_function_id_fkey"
            columns: ["opcr_function_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["function_id"]
          },
          {
            foreignKeyName: "opcr_function_category_opcr_function_id_fkey"
            columns: ["opcr_function_id"]
            isOneToOne: false
            referencedRelation: "opcr_function"
            referencedColumns: ["id"]
          },
        ]
      }
      opcr_indicator: {
        Row: {
          actual_accomplishments: string | null
          alloted_budget: string | null
          average_rating: number | null
          created_at: string
          division_individuals_accountable: string | null
          efficiency_rating: number | null
          id: string
          opcr_function_category_id: string | null
          opcr_function_id: string | null
          position: number
          quality_rating: number | null
          remarks: string | null
          success_indicator: string
          timeliness_rating: number | null
          updated_at: string
        }
        Insert: {
          actual_accomplishments?: string | null
          alloted_budget?: string | null
          average_rating?: number | null
          created_at?: string
          division_individuals_accountable?: string | null
          efficiency_rating?: number | null
          id?: string
          opcr_function_category_id?: string | null
          opcr_function_id?: string | null
          position: number
          quality_rating?: number | null
          remarks?: string | null
          success_indicator: string
          timeliness_rating?: number | null
          updated_at?: string
        }
        Update: {
          actual_accomplishments?: string | null
          alloted_budget?: string | null
          average_rating?: number | null
          created_at?: string
          division_individuals_accountable?: string | null
          efficiency_rating?: number | null
          id?: string
          opcr_function_category_id?: string | null
          opcr_function_id?: string | null
          position?: number
          quality_rating?: number | null
          remarks?: string | null
          success_indicator?: string
          timeliness_rating?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "opcr_indicator_opcr_function_category_id_fkey"
            columns: ["opcr_function_category_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "opcr_indicator_opcr_function_category_id_fkey"
            columns: ["opcr_function_category_id"]
            isOneToOne: false
            referencedRelation: "opcr_function_category"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opcr_indicator_opcr_function_id_fkey"
            columns: ["opcr_function_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["function_id"]
          },
          {
            foreignKeyName: "opcr_indicator_opcr_function_id_fkey"
            columns: ["opcr_function_id"]
            isOneToOne: false
            referencedRelation: "opcr_function"
            referencedColumns: ["id"]
          },
        ]
      }
      operational_plan: {
        Row: {
          approve_by: string
          approver_position: string
          created_at: string
          creator_id: string
          id: string
          implementing_unit: string
          office_id: number | null
          program_id: number | null
          review_by: string
          reviewer_position: string
          status: Database["public"]["Enums"]["op_status"]
          title: string
          unit_id: number
          updated_at: string
        }
        Insert: {
          approve_by: string
          approver_position: string
          created_at?: string
          creator_id: string
          id?: string
          implementing_unit: string
          office_id?: number | null
          program_id?: number | null
          review_by: string
          reviewer_position: string
          status?: Database["public"]["Enums"]["op_status"]
          title: string
          unit_id: number
          updated_at?: string
        }
        Update: {
          approve_by?: string
          approver_position?: string
          created_at?: string
          creator_id?: string
          id?: string
          implementing_unit?: string
          office_id?: number | null
          program_id?: number | null
          review_by?: string
          reviewer_position?: string
          status?: Database["public"]["Enums"]["op_status"]
          title?: string
          unit_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "operational_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["ar_office_id"]
          },
          {
            foreignKeyName: "operational_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "operational_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "operational_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["dpcr_office_id"]
          },
          {
            foreignKeyName: "operational_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "operational_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["ipcr_office_id"]
          },
          {
            foreignKeyName: "operational_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "ipcr_owner_details"
            referencedColumns: ["office_id"]
          },
          {
            foreignKeyName: "operational_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "office"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "operational_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["opcr_office_id"]
          },
          {
            foreignKeyName: "operational_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "operational_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "profile_details_view"
            referencedColumns: ["office_id"]
          },
          {
            foreignKeyName: "operational_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "operational_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["sp_office_id"]
          },
          {
            foreignKeyName: "operational_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "operational_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["ar_program_id"]
          },
          {
            foreignKeyName: "operational_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["dpcr_program_id"]
          },
          {
            foreignKeyName: "operational_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "operational_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "operational_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["ipcr_program_id"]
          },
          {
            foreignKeyName: "operational_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "ipcr_owner_details"
            referencedColumns: ["program_id"]
          },
          {
            foreignKeyName: "operational_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["opcr_program_id"]
          },
          {
            foreignKeyName: "operational_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "operational_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "profile_details_view"
            referencedColumns: ["program_id"]
          },
          {
            foreignKeyName: "operational_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "program"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "operational_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "operational_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["sp_program_id"]
          },
          {
            foreignKeyName: "operational_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "operational_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["ar_unit_id"]
          },
          {
            foreignKeyName: "operational_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "operational_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["dpcr_unit_id"]
          },
          {
            foreignKeyName: "operational_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "operational_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["ipcr_unit_id"]
          },
          {
            foreignKeyName: "operational_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "ipcr_owner_details"
            referencedColumns: ["unit_id"]
          },
          {
            foreignKeyName: "operational_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["opcr_unit_id"]
          },
          {
            foreignKeyName: "operational_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "operational_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "profile_details_view"
            referencedColumns: ["unit_id"]
          },
          {
            foreignKeyName: "operational_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["sp_unit_id"]
          },
          {
            foreignKeyName: "operational_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["owner_unit_id"]
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
            referencedRelation: "ipcr_owner_details"
            referencedColumns: ["nature_of_work_id"]
          },
          {
            foreignKeyName: "position_nature_of_work_id_fkey"
            columns: ["nature_of_work_id"]
            isOneToOne: false
            referencedRelation: "nature_of_work"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "position_nature_of_work_id_fkey"
            columns: ["nature_of_work_id"]
            isOneToOne: false
            referencedRelation: "profile_details_view"
            referencedColumns: ["nature_of_work_id"]
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
          gender: Database["public"]["Enums"]["user_gender"]
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
          gender?: Database["public"]["Enums"]["user_gender"]
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
          gender?: Database["public"]["Enums"]["user_gender"]
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
            foreignKeyName: "profiles_employee_status_id_fkey"
            columns: ["employee_status_id"]
            isOneToOne: false
            referencedRelation: "ipcr_owner_details"
            referencedColumns: ["employee_status_id"]
          },
          {
            foreignKeyName: "profiles_employee_status_id_fkey"
            columns: ["employee_status_id"]
            isOneToOne: false
            referencedRelation: "profile_details_view"
            referencedColumns: ["employee_status_id"]
          },
          {
            foreignKeyName: "profiles_nature_of_work_id_fkey"
            columns: ["nature_of_work_id"]
            isOneToOne: false
            referencedRelation: "ipcr_owner_details"
            referencedColumns: ["nature_of_work_id"]
          },
          {
            foreignKeyName: "profiles_nature_of_work_id_fkey"
            columns: ["nature_of_work_id"]
            isOneToOne: false
            referencedRelation: "nature_of_work"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_nature_of_work_id_fkey"
            columns: ["nature_of_work_id"]
            isOneToOne: false
            referencedRelation: "profile_details_view"
            referencedColumns: ["nature_of_work_id"]
          },
          {
            foreignKeyName: "profiles_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["ar_office_id"]
          },
          {
            foreignKeyName: "profiles_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "profiles_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "profiles_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["dpcr_office_id"]
          },
          {
            foreignKeyName: "profiles_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "profiles_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["ipcr_office_id"]
          },
          {
            foreignKeyName: "profiles_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "ipcr_owner_details"
            referencedColumns: ["office_id"]
          },
          {
            foreignKeyName: "profiles_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "office"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["opcr_office_id"]
          },
          {
            foreignKeyName: "profiles_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "profiles_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "profile_details_view"
            referencedColumns: ["office_id"]
          },
          {
            foreignKeyName: "profiles_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "profiles_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["sp_office_id"]
          },
          {
            foreignKeyName: "profiles_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "position"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "profile_details_view"
            referencedColumns: ["position_id"]
          },
          {
            foreignKeyName: "profiles_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "profiles_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["ar_program_id"]
          },
          {
            foreignKeyName: "profiles_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["dpcr_program_id"]
          },
          {
            foreignKeyName: "profiles_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "profiles_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "profiles_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["ipcr_program_id"]
          },
          {
            foreignKeyName: "profiles_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "ipcr_owner_details"
            referencedColumns: ["program_id"]
          },
          {
            foreignKeyName: "profiles_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["opcr_program_id"]
          },
          {
            foreignKeyName: "profiles_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "profiles_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "profile_details_view"
            referencedColumns: ["program_id"]
          },
          {
            foreignKeyName: "profiles_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "program"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "profiles_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["sp_program_id"]
          },
          {
            foreignKeyName: "profiles_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "profiles_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["ar_unit_id"]
          },
          {
            foreignKeyName: "profiles_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "profiles_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["dpcr_unit_id"]
          },
          {
            foreignKeyName: "profiles_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "profiles_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["ipcr_unit_id"]
          },
          {
            foreignKeyName: "profiles_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "ipcr_owner_details"
            referencedColumns: ["unit_id"]
          },
          {
            foreignKeyName: "profiles_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["opcr_unit_id"]
          },
          {
            foreignKeyName: "profiles_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "profiles_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "profile_details_view"
            referencedColumns: ["unit_id"]
          },
          {
            foreignKeyName: "profiles_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["sp_unit_id"]
          },
          {
            foreignKeyName: "profiles_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["owner_unit_id"]
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
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["ar_office_id"]
          },
          {
            foreignKeyName: "program_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "program_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "program_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["dpcr_office_id"]
          },
          {
            foreignKeyName: "program_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "program_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["ipcr_office_id"]
          },
          {
            foreignKeyName: "program_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "ipcr_owner_details"
            referencedColumns: ["office_id"]
          },
          {
            foreignKeyName: "program_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "office"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["opcr_office_id"]
          },
          {
            foreignKeyName: "program_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "program_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "profile_details_view"
            referencedColumns: ["office_id"]
          },
          {
            foreignKeyName: "program_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "program_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["sp_office_id"]
          },
          {
            foreignKeyName: "program_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "program_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["ar_unit_id"]
          },
          {
            foreignKeyName: "program_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "program_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["dpcr_unit_id"]
          },
          {
            foreignKeyName: "program_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "program_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["ipcr_unit_id"]
          },
          {
            foreignKeyName: "program_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "ipcr_owner_details"
            referencedColumns: ["unit_id"]
          },
          {
            foreignKeyName: "program_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["opcr_unit_id"]
          },
          {
            foreignKeyName: "program_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "program_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "profile_details_view"
            referencedColumns: ["unit_id"]
          },
          {
            foreignKeyName: "program_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["sp_unit_id"]
          },
          {
            foreignKeyName: "program_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["owner_unit_id"]
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
      sdg_alignment: {
        Row: {
          created_at: string
          id: string
          strat_plan_objective_id: string
          strat_plan_performance_indicator_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          strat_plan_objective_id: string
          strat_plan_performance_indicator_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          strat_plan_objective_id?: string
          strat_plan_performance_indicator_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sdg_alignment_strat_plan_objective_id_fkey"
            columns: ["strat_plan_objective_id"]
            isOneToOne: false
            referencedRelation: "sdg_alignment_view"
            referencedColumns: ["objective_id"]
          },
          {
            foreignKeyName: "sdg_alignment_strat_plan_objective_id_fkey"
            columns: ["strat_plan_objective_id"]
            isOneToOne: false
            referencedRelation: "strat_plan_objective"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sdg_alignment_strat_plan_objective_id_fkey"
            columns: ["strat_plan_objective_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["objective_id"]
          },
          {
            foreignKeyName: "sdg_alignment_strat_plan_performance_indicator_id_fkey"
            columns: ["strat_plan_performance_indicator_id"]
            isOneToOne: false
            referencedRelation: "sdg_alignment_view"
            referencedColumns: ["performance_indicator_id"]
          },
          {
            foreignKeyName: "sdg_alignment_strat_plan_performance_indicator_id_fkey"
            columns: ["strat_plan_performance_indicator_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["performance_indicator_id"]
          },
          {
            foreignKeyName: "sdg_alignment_strat_plan_performance_indicator_id_fkey"
            columns: ["strat_plan_performance_indicator_id"]
            isOneToOne: false
            referencedRelation: "strategy_plan_performance_indicator"
            referencedColumns: ["id"]
          },
        ]
      }
      strat_plan_objective: {
        Row: {
          created_at: string
          id: string
          objective: string
          position: number
          strategic_plan_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          objective: string
          position: number
          strategic_plan_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          objective?: string
          position?: number
          strategic_plan_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "strat_plan_objective_strategic_plan_id_fkey"
            columns: ["strategic_plan_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["strategic_plan_id"]
          },
          {
            foreignKeyName: "strat_plan_objective_strategic_plan_id_fkey"
            columns: ["strategic_plan_id"]
            isOneToOne: false
            referencedRelation: "sdg_alignment_view"
            referencedColumns: ["strategic_plan_id"]
          },
          {
            foreignKeyName: "strat_plan_objective_strategic_plan_id_fkey"
            columns: ["strategic_plan_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "strat_plan_objective_strategic_plan_id_fkey"
            columns: ["strategic_plan_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["strategic_plan_id"]
          },
        ]
      }
      strat_plan_yearly_plan: {
        Row: {
          budget: number
          created_at: string
          id: string
          strategy_plan_performance_indicator_id: string
          target: string
          updated_at: string
          year: number
        }
        Insert: {
          budget: number
          created_at?: string
          id?: string
          strategy_plan_performance_indicator_id: string
          target: string
          updated_at?: string
          year: number
        }
        Update: {
          budget?: number
          created_at?: string
          id?: string
          strategy_plan_performance_indicator_id?: string
          target?: string
          updated_at?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "strat_plan_yearly_plan_strategy_plan_performance_indicator_fkey"
            columns: ["strategy_plan_performance_indicator_id"]
            isOneToOne: false
            referencedRelation: "sdg_alignment_view"
            referencedColumns: ["performance_indicator_id"]
          },
          {
            foreignKeyName: "strat_plan_yearly_plan_strategy_plan_performance_indicator_fkey"
            columns: ["strategy_plan_performance_indicator_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["performance_indicator_id"]
          },
          {
            foreignKeyName: "strat_plan_yearly_plan_strategy_plan_performance_indicator_fkey"
            columns: ["strategy_plan_performance_indicator_id"]
            isOneToOne: false
            referencedRelation: "strategy_plan_performance_indicator"
            referencedColumns: ["id"]
          },
        ]
      }
      strategic_plan: {
        Row: {
          created_at: string
          end_year: number
          goal: string
          id: string
          major_output: Database["public"]["Enums"]["strategic_major_output"]
          office_id: number | null
          owner_id: string
          program_id: number | null
          start_year: number
          status: Database["public"]["Enums"]["strat_plan_status"]
          title: string
          unit_id: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_year: number
          goal: string
          id?: string
          major_output: Database["public"]["Enums"]["strategic_major_output"]
          office_id?: number | null
          owner_id: string
          program_id?: number | null
          start_year: number
          status?: Database["public"]["Enums"]["strat_plan_status"]
          title: string
          unit_id?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_year?: number
          goal?: string
          id?: string
          major_output?: Database["public"]["Enums"]["strategic_major_output"]
          office_id?: number | null
          owner_id?: string
          program_id?: number | null
          start_year?: number
          status?: Database["public"]["Enums"]["strat_plan_status"]
          title?: string
          unit_id?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "strategic_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["ar_office_id"]
          },
          {
            foreignKeyName: "strategic_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "strategic_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "strategic_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["dpcr_office_id"]
          },
          {
            foreignKeyName: "strategic_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "strategic_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["ipcr_office_id"]
          },
          {
            foreignKeyName: "strategic_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "ipcr_owner_details"
            referencedColumns: ["office_id"]
          },
          {
            foreignKeyName: "strategic_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "office"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "strategic_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["opcr_office_id"]
          },
          {
            foreignKeyName: "strategic_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "strategic_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "profile_details_view"
            referencedColumns: ["office_id"]
          },
          {
            foreignKeyName: "strategic_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "strategic_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["sp_office_id"]
          },
          {
            foreignKeyName: "strategic_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "strategic_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["ar_program_id"]
          },
          {
            foreignKeyName: "strategic_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["dpcr_program_id"]
          },
          {
            foreignKeyName: "strategic_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "strategic_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "strategic_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["ipcr_program_id"]
          },
          {
            foreignKeyName: "strategic_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "ipcr_owner_details"
            referencedColumns: ["program_id"]
          },
          {
            foreignKeyName: "strategic_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["opcr_program_id"]
          },
          {
            foreignKeyName: "strategic_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "strategic_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "profile_details_view"
            referencedColumns: ["program_id"]
          },
          {
            foreignKeyName: "strategic_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "program"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "strategic_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "strategic_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["sp_program_id"]
          },
          {
            foreignKeyName: "strategic_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "strategic_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["ar_unit_id"]
          },
          {
            foreignKeyName: "strategic_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "strategic_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["dpcr_unit_id"]
          },
          {
            foreignKeyName: "strategic_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "strategic_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["ipcr_unit_id"]
          },
          {
            foreignKeyName: "strategic_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "ipcr_owner_details"
            referencedColumns: ["unit_id"]
          },
          {
            foreignKeyName: "strategic_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["opcr_unit_id"]
          },
          {
            foreignKeyName: "strategic_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "strategic_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "profile_details_view"
            referencedColumns: ["unit_id"]
          },
          {
            foreignKeyName: "strategic_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["sp_unit_id"]
          },
          {
            foreignKeyName: "strategic_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "strategic_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "unit"
            referencedColumns: ["id"]
          },
        ]
      }
      strategy_plan: {
        Row: {
          created_at: string
          description: string
          id: string
          position: number
          strat_plan_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          position: number
          strat_plan_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          position?: number
          strat_plan_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "strategy_plan_strat_plan_id_fkey"
            columns: ["strat_plan_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["strategic_plan_id"]
          },
          {
            foreignKeyName: "strategy_plan_strat_plan_id_fkey"
            columns: ["strat_plan_id"]
            isOneToOne: false
            referencedRelation: "sdg_alignment_view"
            referencedColumns: ["strategic_plan_id"]
          },
          {
            foreignKeyName: "strategy_plan_strat_plan_id_fkey"
            columns: ["strat_plan_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "strategy_plan_strat_plan_id_fkey"
            columns: ["strat_plan_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["strategic_plan_id"]
          },
        ]
      }
      strategy_plan_performance_indicator: {
        Row: {
          actual_target: string
          base_target: string
          concerned_offices: string | null
          created_at: string
          id: string
          input_type: Database["public"]["Enums"]["input_type_strategic_plan"]
          performance_indicator: string
          position: number
          remarks: string | null
          strategy_plan_id: string
          updated_at: string
        }
        Insert: {
          actual_target: string
          base_target: string
          concerned_offices?: string | null
          created_at?: string
          id?: string
          input_type?: Database["public"]["Enums"]["input_type_strategic_plan"]
          performance_indicator: string
          position: number
          remarks?: string | null
          strategy_plan_id: string
          updated_at?: string
        }
        Update: {
          actual_target?: string
          base_target?: string
          concerned_offices?: string | null
          created_at?: string
          id?: string
          input_type?: Database["public"]["Enums"]["input_type_strategic_plan"]
          performance_indicator?: string
          position?: number
          remarks?: string | null
          strategy_plan_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "strategy_plan_performance_indicator_strategy_plan_id_fkey"
            columns: ["strategy_plan_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["strategy_id"]
          },
          {
            foreignKeyName: "strategy_plan_performance_indicator_strategy_plan_id_fkey"
            columns: ["strategy_plan_id"]
            isOneToOne: false
            referencedRelation: "strategy_plan"
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
      accomplishment_report_backup_view: {
        Row: {
          accomplishment_rate: string | null
          accomplishment_report_id: string | null
          accomplishment_report_title: string | null
          activity: string | null
          activity_id: string | null
          activity_position: number | null
          annual_plan_description: string | null
          annual_plan_id: string | null
          annual_plan_position: number | null
          annual_target: string | null
          approve_by: string | null
          approver_position: string | null
          ar_office_code: string | null
          ar_office_id: number | null
          ar_office_name: string | null
          ar_program_id: number | null
          ar_program_name: string | null
          ar_unit_code: string | null
          ar_unit_id: number | null
          ar_unit_name: string | null
          created_at: string | null
          header_id: string | null
          header_position: number | null
          header_title: string | null
          implementing_unit: string | null
          indicator_id: string | null
          indicator_position: number | null
          indicator_remarks: string | null
          input_type:
            | Database["public"]["Enums"]["input_type_accomplishment"]
            | null
          owner_email: string | null
          owner_employee_id: string | null
          owner_employee_status: string | null
          owner_first_name: string | null
          owner_id: string | null
          owner_last_name: string | null
          owner_middle_name: string | null
          owner_nature_of_work: string | null
          owner_office_code: string | null
          owner_office_id: number | null
          owner_office_name: string | null
          owner_position_name: string | null
          owner_program_id: number | null
          owner_program_name: string | null
          owner_unit_code: string | null
          owner_unit_id: number | null
          owner_unit_name: string | null
          performance_indicator: string | null
          q1_accomplishment: string | null
          q2_accomplishment: string | null
          q3_accomplishment: string | null
          q4_accomplishment: string | null
          related_ipcr_indicators: Json | null
          responsible_officer_unit: string | null
          review_by: string | null
          reviewer_position: string | null
          total: string | null
          updated_at: string | null
        }
        Relationships: []
      }
      accomplishment_report_category_avg: {
        Row: {
          approve_by: string | null
          approver_position: string | null
          created_at: string | null
          extension_avg: number | null
          governance_management_avg: number | null
          id: string | null
          implementing_unit: string | null
          instruction_avg: number | null
          office_id: number | null
          owner_id: string | null
          program_id: number | null
          research_avg: number | null
          review_by: string | null
          reviewer_position: string | null
          title: string | null
          unit_id: number | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accomplishment_report_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["ar_office_id"]
          },
          {
            foreignKeyName: "accomplishment_report_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "accomplishment_report_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "accomplishment_report_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["dpcr_office_id"]
          },
          {
            foreignKeyName: "accomplishment_report_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "accomplishment_report_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["ipcr_office_id"]
          },
          {
            foreignKeyName: "accomplishment_report_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "ipcr_owner_details"
            referencedColumns: ["office_id"]
          },
          {
            foreignKeyName: "accomplishment_report_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "office"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accomplishment_report_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["opcr_office_id"]
          },
          {
            foreignKeyName: "accomplishment_report_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "accomplishment_report_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "profile_details_view"
            referencedColumns: ["office_id"]
          },
          {
            foreignKeyName: "accomplishment_report_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "accomplishment_report_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["sp_office_id"]
          },
          {
            foreignKeyName: "accomplishment_report_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "accomplishment_report_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["ar_program_id"]
          },
          {
            foreignKeyName: "accomplishment_report_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["dpcr_program_id"]
          },
          {
            foreignKeyName: "accomplishment_report_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "accomplishment_report_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "accomplishment_report_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["ipcr_program_id"]
          },
          {
            foreignKeyName: "accomplishment_report_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "ipcr_owner_details"
            referencedColumns: ["program_id"]
          },
          {
            foreignKeyName: "accomplishment_report_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["opcr_program_id"]
          },
          {
            foreignKeyName: "accomplishment_report_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "accomplishment_report_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "profile_details_view"
            referencedColumns: ["program_id"]
          },
          {
            foreignKeyName: "accomplishment_report_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "program"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accomplishment_report_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "accomplishment_report_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["sp_program_id"]
          },
          {
            foreignKeyName: "accomplishment_report_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "accomplishment_report_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["ar_unit_id"]
          },
          {
            foreignKeyName: "accomplishment_report_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "accomplishment_report_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["dpcr_unit_id"]
          },
          {
            foreignKeyName: "accomplishment_report_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "accomplishment_report_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["ipcr_unit_id"]
          },
          {
            foreignKeyName: "accomplishment_report_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "ipcr_owner_details"
            referencedColumns: ["unit_id"]
          },
          {
            foreignKeyName: "accomplishment_report_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["opcr_unit_id"]
          },
          {
            foreignKeyName: "accomplishment_report_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "accomplishment_report_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "profile_details_view"
            referencedColumns: ["unit_id"]
          },
          {
            foreignKeyName: "accomplishment_report_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["sp_unit_id"]
          },
          {
            foreignKeyName: "accomplishment_report_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["owner_unit_id"]
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
      dpcr_backup_view: {
        Row: {
          actual_accomplishments: string | null
          alloted_budget: string | null
          assessors: Json | null
          average_rating: number | null
          category: string | null
          category_id: string | null
          category_position: number | null
          created_at: string | null
          division_individuals_accountable: string | null
          dpcr_id: string | null
          dpcr_office_code: string | null
          dpcr_office_id: number | null
          dpcr_office_name: string | null
          dpcr_program_id: number | null
          dpcr_program_name: string | null
          dpcr_title: string | null
          dpcr_unit_code: string | null
          dpcr_unit_id: number | null
          dpcr_unit_name: string | null
          efficiency_rating: number | null
          function_id: string | null
          function_position: number | null
          function_title: string | null
          indicator_id: string | null
          indicator_position: number | null
          owner_email: string | null
          owner_employee_id: string | null
          owner_employee_status: string | null
          owner_first_name: string | null
          owner_id: string | null
          owner_last_name: string | null
          owner_middle_name: string | null
          owner_nature_of_work: string | null
          owner_office_code: string | null
          owner_office_id: number | null
          owner_office_name: string | null
          owner_position_name: string | null
          owner_program_id: number | null
          owner_program_name: string | null
          owner_unit_code: string | null
          owner_unit_id: number | null
          owner_unit_name: string | null
          physical_targets: string | null
          quality_rating: number | null
          remarks: string | null
          review_by: string | null
          reviewer_position: string | null
          success_indicator: string | null
          timeliness_rating: number | null
          updated_at: string | null
        }
        Relationships: []
      }
      ipcr_backup_view: {
        Row: {
          accomplishment_date: string | null
          accomplishment_id: string | null
          actual_accomplishments: string | null
          average_rating: number | null
          category: string | null
          category_id: string | null
          category_position: number | null
          category_supervisor_employee_id: string | null
          category_supervisor_first_name: string | null
          category_supervisor_last_name: string | null
          category_supervisor_middle_name: string | null
          category_supervisor_position: string | null
          category_unit: number | null
          created_at: string | null
          dean: string | null
          efficiency_rating: number | null
          evidence_files: Json | null
          final_output: string | null
          function_id: string | null
          function_percentage: number | null
          function_position: number | null
          function_title: string | null
          head_of_operating_unit: string | null
          immediate_supervisor: string | null
          immediate_supervisor_position: string | null
          indicator_id: string | null
          indicator_position: number | null
          indicator_remarks: string | null
          indicator_supervisor_employee_id: string | null
          indicator_supervisor_first_name: string | null
          indicator_supervisor_last_name: string | null
          indicator_supervisor_middle_name: string | null
          indicator_supervisor_position: string | null
          indicator_units: number | null
          ipcr_id: string | null
          ipcr_office_code: string | null
          ipcr_office_id: number | null
          ipcr_office_name: string | null
          ipcr_program_id: number | null
          ipcr_program_name: string | null
          ipcr_status: Database["public"]["Enums"]["ipcr_status"] | null
          ipcr_title: string | null
          ipcr_unit_code: string | null
          ipcr_unit_id: number | null
          ipcr_unit_name: string | null
          op_activity: string | null
          op_former_state: string | null
          op_input_type: Database["public"]["Enums"]["input_type_op"] | null
          op_performance_indicator: string | null
          op_q1_target: string | null
          op_q2_target: string | null
          op_q3_target: string | null
          op_q4_target: string | null
          op_responsible_officer_unit: string | null
          op_total: string | null
          op_total_budgetary_requirements: string | null
          owner_email: string | null
          owner_employee_id: string | null
          owner_employee_status: string | null
          owner_first_name: string | null
          owner_id: string | null
          owner_last_name: string | null
          owner_middle_name: string | null
          owner_nature_of_work: string | null
          owner_office_code: string | null
          owner_office_id: number | null
          owner_office_name: string | null
          owner_position_name: string | null
          owner_program_id: number | null
          owner_program_name: string | null
          owner_unit_code: string | null
          owner_unit_id: number | null
          owner_unit_name: string | null
          program_chair: string | null
          quality_rating: number | null
          quantity: string | null
          sub_category: string | null
          subcategory_id: string | null
          subcategory_position: number | null
          success_indicator: string | null
          timeliness_rating: number | null
          updated_at: string | null
        }
        Relationships: []
      }
      ipcr_owner_details: {
        Row: {
          created_at: string | null
          email: string | null
          employee_id: string | null
          employee_status: string | null
          employee_status_id: number | null
          full_name: string | null
          ipcr_id: string | null
          ipcr_status: Database["public"]["Enums"]["ipcr_status"] | null
          ipcr_title: string | null
          nature_of_work: string | null
          nature_of_work_id: number | null
          office_code: string | null
          office_id: number | null
          office_name: string | null
          owner_id: string | null
          position_name: string | null
          program_id: number | null
          program_name: string | null
          unit_code: string | null
          unit_id: number | null
          unit_name: string | null
          updated_at: string | null
        }
        Relationships: []
      }
      ipcr_performance_summary: {
        Row: {
          created_at: string | null
          dean: string | null
          head_of_operating_unit: string | null
          id: string | null
          immediate_supervisor: string | null
          immediate_supervisor_position: string | null
          office_id: number | null
          owner_id: string | null
          program_chair: string | null
          program_id: number | null
          status: Database["public"]["Enums"]["ipcr_status"] | null
          title: string | null
          unit_id: number | null
          updated_at: string | null
          weighted_average: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ipcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["ar_office_id"]
          },
          {
            foreignKeyName: "ipcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "ipcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "ipcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["dpcr_office_id"]
          },
          {
            foreignKeyName: "ipcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "ipcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["ipcr_office_id"]
          },
          {
            foreignKeyName: "ipcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "ipcr_owner_details"
            referencedColumns: ["office_id"]
          },
          {
            foreignKeyName: "ipcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "office"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ipcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["opcr_office_id"]
          },
          {
            foreignKeyName: "ipcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "ipcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "profile_details_view"
            referencedColumns: ["office_id"]
          },
          {
            foreignKeyName: "ipcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "ipcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["sp_office_id"]
          },
          {
            foreignKeyName: "ipcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "ipcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["ar_program_id"]
          },
          {
            foreignKeyName: "ipcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["dpcr_program_id"]
          },
          {
            foreignKeyName: "ipcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "ipcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "ipcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["ipcr_program_id"]
          },
          {
            foreignKeyName: "ipcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "ipcr_owner_details"
            referencedColumns: ["program_id"]
          },
          {
            foreignKeyName: "ipcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["opcr_program_id"]
          },
          {
            foreignKeyName: "ipcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "ipcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "profile_details_view"
            referencedColumns: ["program_id"]
          },
          {
            foreignKeyName: "ipcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "program"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ipcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "ipcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["sp_program_id"]
          },
          {
            foreignKeyName: "ipcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "ipcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["ar_unit_id"]
          },
          {
            foreignKeyName: "ipcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "ipcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["dpcr_unit_id"]
          },
          {
            foreignKeyName: "ipcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "ipcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["ipcr_unit_id"]
          },
          {
            foreignKeyName: "ipcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "ipcr_owner_details"
            referencedColumns: ["unit_id"]
          },
          {
            foreignKeyName: "ipcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["opcr_unit_id"]
          },
          {
            foreignKeyName: "ipcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "ipcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "profile_details_view"
            referencedColumns: ["unit_id"]
          },
          {
            foreignKeyName: "ipcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["sp_unit_id"]
          },
          {
            foreignKeyName: "ipcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["owner_unit_id"]
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
      ipcr_supervisor_details_view: {
        Row: {
          dean: string | null
          designated_supervisor_name: string | null
          designated_supervisor_position: string | null
          ipcr_id: string | null
          ipcr_status: Database["public"]["Enums"]["ipcr_status"] | null
          ipcr_title: string | null
          owner_email: string | null
          owner_employee_id: string | null
          owner_employment_status: string | null
          owner_full_name: string | null
          owner_id: string | null
          owner_nature_of_work: string | null
          owner_office_code: string | null
          owner_office_name: string | null
          owner_position: string | null
          owner_program_name: string | null
          owner_unit_code: string | null
          owner_unit_name: string | null
          program_chair: string | null
          supervisor_assignment_date: string | null
          supervisor_email: string | null
          supervisor_employee_id: string | null
          supervisor_full_name: string | null
          supervisor_id: string | null
          supervisor_position: string | null
          supervisor_relationship_id: string | null
          supervisor_review_status:
            | Database["public"]["Enums"]["ipcr_supervisor_status"]
            | null
        }
        Relationships: []
      }
      ipcr_supervisor_status_view: {
        Row: {
          consensus_status: string | null
          has_action_required_status: boolean | null
          ipcr_id: string | null
          ipcr_status: Database["public"]["Enums"]["ipcr_status"] | null
          supervisors: Json | null
          total_supervisors: number | null
          unique_statuses: number | null
        }
        Relationships: []
      }
      ipcr_supervisors: {
        Row: {
          full_name: string | null
          id: string | null
          ipcr_id: string | null
          position: string | null
        }
        Relationships: []
      }
      ipcr_teaching_effectiveness_avg: {
        Row: {
          created_at: string | null
          dean: string | null
          head_of_operating_unit: string | null
          id: string | null
          immediate_supervisor: string | null
          immediate_supervisor_position: string | null
          office_id: number | null
          owner_id: string | null
          program_chair: string | null
          program_id: number | null
          status: Database["public"]["Enums"]["ipcr_status"] | null
          teaching_effectiveness_avg: number | null
          title: string | null
          unit_id: number | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ipcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["ar_office_id"]
          },
          {
            foreignKeyName: "ipcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "ipcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "ipcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["dpcr_office_id"]
          },
          {
            foreignKeyName: "ipcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "ipcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["ipcr_office_id"]
          },
          {
            foreignKeyName: "ipcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "ipcr_owner_details"
            referencedColumns: ["office_id"]
          },
          {
            foreignKeyName: "ipcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "office"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ipcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["opcr_office_id"]
          },
          {
            foreignKeyName: "ipcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "ipcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "profile_details_view"
            referencedColumns: ["office_id"]
          },
          {
            foreignKeyName: "ipcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "ipcr_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["sp_office_id"]
          },
          {
            foreignKeyName: "ipcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "ipcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["ar_program_id"]
          },
          {
            foreignKeyName: "ipcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["dpcr_program_id"]
          },
          {
            foreignKeyName: "ipcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "ipcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "ipcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["ipcr_program_id"]
          },
          {
            foreignKeyName: "ipcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "ipcr_owner_details"
            referencedColumns: ["program_id"]
          },
          {
            foreignKeyName: "ipcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["opcr_program_id"]
          },
          {
            foreignKeyName: "ipcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "ipcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "profile_details_view"
            referencedColumns: ["program_id"]
          },
          {
            foreignKeyName: "ipcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "program"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ipcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "ipcr_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["sp_program_id"]
          },
          {
            foreignKeyName: "ipcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "ipcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["ar_unit_id"]
          },
          {
            foreignKeyName: "ipcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "ipcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["dpcr_unit_id"]
          },
          {
            foreignKeyName: "ipcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "ipcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["ipcr_unit_id"]
          },
          {
            foreignKeyName: "ipcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "ipcr_owner_details"
            referencedColumns: ["unit_id"]
          },
          {
            foreignKeyName: "ipcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["opcr_unit_id"]
          },
          {
            foreignKeyName: "ipcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "ipcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "profile_details_view"
            referencedColumns: ["unit_id"]
          },
          {
            foreignKeyName: "ipcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["sp_unit_id"]
          },
          {
            foreignKeyName: "ipcr_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["owner_unit_id"]
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
      op_header_indicators: {
        Row: {
          activity: string | null
          activity_id: string | null
          activity_position: number | null
          annual_plan_description: string | null
          annual_plan_id: string | null
          annual_plan_position: number | null
          former_state: string | null
          header_id: string | null
          header_position: number | null
          header_title: string | null
          indicator_id: string | null
          indicator_position: number | null
          input_type: Database["public"]["Enums"]["input_type_op"] | null
          performance_indicator: string | null
          q1_target: string | null
          q2_target: string | null
          q3_target: string | null
          q4_target: string | null
          responsible_officer_unit: string | null
          total: string | null
          total_budgetary_requirements: string | null
        }
        Relationships: []
      }
      opcr_backup_view: {
        Row: {
          actual_accomplishments: string | null
          administrative_officer: string | null
          alloted_budget: string | null
          average_rating: number | null
          category: string | null
          category_id: string | null
          category_position: number | null
          created_at: string | null
          division_individuals_accountable: string | null
          efficiency_rating: number | null
          function_id: string | null
          function_position: number | null
          function_title: string | null
          human_resource: string | null
          indicator_id: string | null
          indicator_position: number | null
          opcr_id: string | null
          opcr_office_code: string | null
          opcr_office_id: number | null
          opcr_office_name: string | null
          opcr_program_id: number | null
          opcr_program_name: string | null
          opcr_title: string | null
          opcr_unit_code: string | null
          opcr_unit_id: number | null
          opcr_unit_name: string | null
          owner_email: string | null
          owner_employee_id: string | null
          owner_employee_status: string | null
          owner_first_name: string | null
          owner_id: string | null
          owner_last_name: string | null
          owner_middle_name: string | null
          owner_nature_of_work: string | null
          owner_office_code: string | null
          owner_office_id: number | null
          owner_office_name: string | null
          owner_position_name: string | null
          owner_program_id: number | null
          owner_program_name: string | null
          owner_unit_code: string | null
          owner_unit_id: number | null
          owner_unit_name: string | null
          planning_officer: string | null
          quality_rating: number | null
          remarks: string | null
          review_by: string | null
          reviewer_position: string | null
          strategic_plan_end_year: number | null
          strategic_plan_goal: string | null
          strategic_plan_id: string | null
          strategic_plan_major_output:
            | Database["public"]["Enums"]["strategic_major_output"]
            | null
          strategic_plan_start_year: number | null
          strategic_plan_title: string | null
          success_indicator: string | null
          timeliness_rating: number | null
          updated_at: string | null
        }
        Relationships: []
      }
      operational_backup_view: {
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
          created_at: string | null
          creator_email: string | null
          creator_employee_id: string | null
          creator_employee_status: string | null
          creator_first_name: string | null
          creator_id: string | null
          creator_last_name: string | null
          creator_middle_name: string | null
          creator_nature_of_work: string | null
          creator_office_code: string | null
          creator_office_name: string | null
          creator_position_name: string | null
          creator_program_name: string | null
          creator_unit_code: string | null
          creator_unit_name: string | null
          former_state: string | null
          header_id: string | null
          header_position: number | null
          header_title: string | null
          implementing_unit: string | null
          indicator_created_at: string | null
          indicator_id: string | null
          indicator_position: number | null
          indicator_updated_at: string | null
          input_type: Database["public"]["Enums"]["input_type_op"] | null
          op_office_code: string | null
          op_office_name: string | null
          op_program_name: string | null
          op_unit_code: string | null
          op_unit_name: string | null
          operational_plan_id: string | null
          operational_plan_title: string | null
          performance_indicator: string | null
          q1_target: string | null
          q2_target: string | null
          q3_target: string | null
          q4_target: string | null
          responsible_officer_unit: string | null
          review_by: string | null
          reviewer_position: string | null
          total: string | null
          total_budgetary_requirements: string | null
          updated_at: string | null
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
          indicator_created_at: string | null
          indicator_id: string | null
          indicator_position: number | null
          indicator_updated_at: string | null
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
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["ar_office_id"]
          },
          {
            foreignKeyName: "operational_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "operational_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "operational_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["dpcr_office_id"]
          },
          {
            foreignKeyName: "operational_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "operational_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["ipcr_office_id"]
          },
          {
            foreignKeyName: "operational_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "ipcr_owner_details"
            referencedColumns: ["office_id"]
          },
          {
            foreignKeyName: "operational_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "office"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "operational_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["opcr_office_id"]
          },
          {
            foreignKeyName: "operational_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "operational_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "profile_details_view"
            referencedColumns: ["office_id"]
          },
          {
            foreignKeyName: "operational_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "operational_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["sp_office_id"]
          },
          {
            foreignKeyName: "operational_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "operational_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["ar_program_id"]
          },
          {
            foreignKeyName: "operational_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["dpcr_program_id"]
          },
          {
            foreignKeyName: "operational_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "operational_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "operational_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["ipcr_program_id"]
          },
          {
            foreignKeyName: "operational_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "ipcr_owner_details"
            referencedColumns: ["program_id"]
          },
          {
            foreignKeyName: "operational_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["opcr_program_id"]
          },
          {
            foreignKeyName: "operational_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "operational_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "profile_details_view"
            referencedColumns: ["program_id"]
          },
          {
            foreignKeyName: "operational_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "program"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "operational_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "operational_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["sp_program_id"]
          },
          {
            foreignKeyName: "operational_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "operational_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["ar_unit_id"]
          },
          {
            foreignKeyName: "operational_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "operational_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["dpcr_unit_id"]
          },
          {
            foreignKeyName: "operational_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "operational_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["ipcr_unit_id"]
          },
          {
            foreignKeyName: "operational_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "ipcr_owner_details"
            referencedColumns: ["unit_id"]
          },
          {
            foreignKeyName: "operational_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["opcr_unit_id"]
          },
          {
            foreignKeyName: "operational_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "operational_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "profile_details_view"
            referencedColumns: ["unit_id"]
          },
          {
            foreignKeyName: "operational_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["sp_unit_id"]
          },
          {
            foreignKeyName: "operational_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["owner_unit_id"]
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
      operational_plan_budget_summary: {
        Row: {
          approve_by: string | null
          approver_position: string | null
          created_at: string | null
          implementing_unit: string | null
          office_id: number | null
          operational_plan_id: string | null
          operational_plan_title: string | null
          program_id: number | null
          review_by: string | null
          reviewer_position: string | null
          status: Database["public"]["Enums"]["op_status"] | null
          total_budget_requirements: number | null
          unit_id: number | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "operational_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["ar_office_id"]
          },
          {
            foreignKeyName: "operational_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "operational_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "operational_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["dpcr_office_id"]
          },
          {
            foreignKeyName: "operational_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "operational_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["ipcr_office_id"]
          },
          {
            foreignKeyName: "operational_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "ipcr_owner_details"
            referencedColumns: ["office_id"]
          },
          {
            foreignKeyName: "operational_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "office"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "operational_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["opcr_office_id"]
          },
          {
            foreignKeyName: "operational_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "operational_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "profile_details_view"
            referencedColumns: ["office_id"]
          },
          {
            foreignKeyName: "operational_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "operational_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["sp_office_id"]
          },
          {
            foreignKeyName: "operational_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "operational_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["ar_program_id"]
          },
          {
            foreignKeyName: "operational_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["dpcr_program_id"]
          },
          {
            foreignKeyName: "operational_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "operational_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "operational_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["ipcr_program_id"]
          },
          {
            foreignKeyName: "operational_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "ipcr_owner_details"
            referencedColumns: ["program_id"]
          },
          {
            foreignKeyName: "operational_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["opcr_program_id"]
          },
          {
            foreignKeyName: "operational_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "operational_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "profile_details_view"
            referencedColumns: ["program_id"]
          },
          {
            foreignKeyName: "operational_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "program"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "operational_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "operational_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["sp_program_id"]
          },
          {
            foreignKeyName: "operational_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "operational_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["ar_unit_id"]
          },
          {
            foreignKeyName: "operational_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "operational_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["dpcr_unit_id"]
          },
          {
            foreignKeyName: "operational_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "operational_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["ipcr_unit_id"]
          },
          {
            foreignKeyName: "operational_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "ipcr_owner_details"
            referencedColumns: ["unit_id"]
          },
          {
            foreignKeyName: "operational_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["opcr_unit_id"]
          },
          {
            foreignKeyName: "operational_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "operational_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "profile_details_view"
            referencedColumns: ["unit_id"]
          },
          {
            foreignKeyName: "operational_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["sp_unit_id"]
          },
          {
            foreignKeyName: "operational_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["owner_unit_id"]
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
      operational_plan_of_heads: {
        Row: {
          approve_by: string | null
          approver_position: string | null
          created_at: string | null
          creator_id: string | null
          id: string | null
          implementing_unit: string | null
          office_id: number | null
          program_id: number | null
          review_by: string | null
          reviewer_position: string | null
          status: Database["public"]["Enums"]["op_status"] | null
          title: string | null
          unit_id: number | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "operational_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["ar_office_id"]
          },
          {
            foreignKeyName: "operational_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "operational_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "operational_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["dpcr_office_id"]
          },
          {
            foreignKeyName: "operational_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "operational_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["ipcr_office_id"]
          },
          {
            foreignKeyName: "operational_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "ipcr_owner_details"
            referencedColumns: ["office_id"]
          },
          {
            foreignKeyName: "operational_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "office"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "operational_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["opcr_office_id"]
          },
          {
            foreignKeyName: "operational_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "operational_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "profile_details_view"
            referencedColumns: ["office_id"]
          },
          {
            foreignKeyName: "operational_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["owner_office_id"]
          },
          {
            foreignKeyName: "operational_plan_office_id_fkey"
            columns: ["office_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["sp_office_id"]
          },
          {
            foreignKeyName: "operational_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "operational_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["ar_program_id"]
          },
          {
            foreignKeyName: "operational_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["dpcr_program_id"]
          },
          {
            foreignKeyName: "operational_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "operational_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "operational_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["ipcr_program_id"]
          },
          {
            foreignKeyName: "operational_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "ipcr_owner_details"
            referencedColumns: ["program_id"]
          },
          {
            foreignKeyName: "operational_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["opcr_program_id"]
          },
          {
            foreignKeyName: "operational_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "operational_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "profile_details_view"
            referencedColumns: ["program_id"]
          },
          {
            foreignKeyName: "operational_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "program"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "operational_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["owner_program_id"]
          },
          {
            foreignKeyName: "operational_plan_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["sp_program_id"]
          },
          {
            foreignKeyName: "operational_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "operational_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "accomplishment_report_backup_view"
            referencedColumns: ["ar_unit_id"]
          },
          {
            foreignKeyName: "operational_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "operational_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "dpcr_backup_view"
            referencedColumns: ["dpcr_unit_id"]
          },
          {
            foreignKeyName: "operational_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "operational_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "ipcr_backup_view"
            referencedColumns: ["ipcr_unit_id"]
          },
          {
            foreignKeyName: "operational_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "ipcr_owner_details"
            referencedColumns: ["unit_id"]
          },
          {
            foreignKeyName: "operational_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["opcr_unit_id"]
          },
          {
            foreignKeyName: "operational_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "opcr_backup_view"
            referencedColumns: ["owner_unit_id"]
          },
          {
            foreignKeyName: "operational_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "profile_details_view"
            referencedColumns: ["unit_id"]
          },
          {
            foreignKeyName: "operational_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["sp_unit_id"]
          },
          {
            foreignKeyName: "operational_plan_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "strategic_plan_backup_view"
            referencedColumns: ["owner_unit_id"]
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
      profile_details_view: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          employee_id: string | null
          employee_status_id: number | null
          employee_status_type: string | null
          first_name: string | null
          full_name: string | null
          id: string | null
          last_name: string | null
          middle_name: string | null
          nature_of_work_id: number | null
          nature_of_work_type: string | null
          office_code: string | null
          office_id: number | null
          office_name: string | null
          position_id: number | null
          position_name: string | null
          program_id: number | null
          program_name: string | null
          role_id: number | null
          role_name: string | null
          unit_code: string | null
          unit_id: number | null
          unit_name: string | null
          updated_at: string | null
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
      sdg_alignment_view: {
        Row: {
          actual_target: string | null
          alignment_created_at: string | null
          alignment_id: string | null
          alignment_updated_at: string | null
          base_target: string | null
          concerned_offices: string | null
          major_output:
            | Database["public"]["Enums"]["strategic_major_output"]
            | null
          objective: string | null
          objective_id: string | null
          objective_position: number | null
          performance_indicator_id: string | null
          performance_indicator_position: number | null
          performance_indicator_remarks: string | null
          strategic_plan_goal: string | null
          strategic_plan_id: string | null
          strategic_plan_title: string | null
        }
        Relationships: []
      }
      strategic_plan_backup_view: {
        Row: {
          actual_target: string | null
          base_target: string | null
          concerned_offices: string | null
          created_at: string | null
          end_year: number | null
          goal: string | null
          input_type:
            | Database["public"]["Enums"]["input_type_strategic_plan"]
            | null
          major_output:
            | Database["public"]["Enums"]["strategic_major_output"]
            | null
          objective: string | null
          objective_id: string | null
          objective_position: number | null
          owner_email: string | null
          owner_employee_id: string | null
          owner_employee_status: string | null
          owner_first_name: string | null
          owner_id: string | null
          owner_last_name: string | null
          owner_middle_name: string | null
          owner_nature_of_work: string | null
          owner_office_code: string | null
          owner_office_id: number | null
          owner_office_name: string | null
          owner_position_name: string | null
          owner_program_id: number | null
          owner_program_name: string | null
          owner_unit_code: string | null
          owner_unit_id: number | null
          owner_unit_name: string | null
          performance_indicator: string | null
          performance_indicator_id: string | null
          pi_position: number | null
          pi_remarks: string | null
          related_opcrs: Json | null
          sdg_alignments: Json | null
          sp_office_code: string | null
          sp_office_id: number | null
          sp_office_name: string | null
          sp_program_id: number | null
          sp_program_name: string | null
          sp_unit_code: string | null
          sp_unit_id: number | null
          sp_unit_name: string | null
          start_year: number | null
          strategic_plan_id: string | null
          strategic_plan_title: string | null
          strategy_description: string | null
          strategy_id: string | null
          strategy_position: number | null
          updated_at: string | null
          yearly_plans: Json | null
        }
        Relationships: []
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
      get_employee_nature_of_work: {
        Args: {
          p_unit_id: number
        }
        Returns: Json
      }
      get_employee_status_count: {
        Args: {
          p_unit_id?: number
          p_office_id?: number
        }
        Returns: Json
      }
      get_ipcr_functions_by_supervisor: {
        Args: {
          p_ipcr_id: string
          p_supervisor_id: string
        }
        Returns: {
          created_at: string
          id: string
          ipcr_id: string
          percentage: number
          position: number
          title: string
          updated_at: string
        }[]
      }
      get_ipcr_id_from_indicator: {
        Args: {
          p_indicator_id: string
        }
        Returns: string
      }
      get_population_stats: {
        Args: {
          filter_unit_id?: number
          filter_office_id?: number
        }
        Returns: {
          total_population: number
          male_population: number
          female_population: number
        }[]
      }
      get_supervisor_consensus_status: {
        Args: {
          p_ipcr_id: string
        }
        Returns: Database["public"]["Enums"]["ipcr_supervisor_status"]
      }
      get_user_role: {
        Args: Record<PropertyKey, never>
        Returns: {
          role_name: string
          role_id: number
        }[]
      }
      is_consensus_required_status: {
        Args: {
          p_status: Database["public"]["Enums"]["ipcr_supervisor_status"]
        }
        Returns: boolean
      }
      is_immediate_sync_status: {
        Args: {
          p_status: Database["public"]["Enums"]["ipcr_supervisor_status"]
        }
        Returns: boolean
      }
      is_system_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      return_ipcr_function_category_if_immediate_supervisor_same: {
        Args: {
          p_ipcr_function_id: string
          p_supervisor_id: string
        }
        Returns: {
          category: string
          created_at: string
          id: string
          immediate_supervisor_id: string | null
          ipcr_function_id: string
          position: number
          unit: number | null
          updated_at: string
        }[]
      }
      return_ipcr_indicator_if_immediate_supervisor_same: {
        Args: {
          p_ipcr_function_id: string
          p_supervisor_id: string
        }
        Returns: {
          average_rating: number | null
          created_at: string
          efficiency_rating: number | null
          final_output: string
          id: string
          immediate_supervisor_id: string | null
          ipcr_function_category_id: string | null
          ipcr_function_id: string | null
          ipcr_function_sub_category_id: string | null
          op_activity_indicator_id: string
          position: number
          quality_rating: number | null
          remarks: string | null
          success_indicator: string
          timeliness_rating: number | null
          units: number | null
          updated_at: string
        }[]
      }
      sync_ipcr_status: {
        Args: {
          p_ipcr_id: string
        }
        Returns: undefined
      }
      sync_ipcr_supervisors: {
        Args: {
          p_ipcr_id: string
        }
        Returns: {
          sup_id: string
          sup_action: string
        }[]
      }
      validate_ipcr: {
        Args: {
          p_ipcr_id: string
        }
        Returns: Database["public"]["CompositeTypes"]["validation_result"]
      }
      validate_operational_plan: {
        Args: {
          p_operational_plan_id: string
        }
        Returns: Database["public"]["CompositeTypes"]["validation_result"]
      }
    }
    Enums: {
      dpcr_status: "draft" | "submitted" | "reviewing" | "revision" | "approved"
      input_type_accomplishment: "percentage" | "number" | "ratio" | "text"
      input_type_op: "percentage" | "number" | "ratio" | "text"
      input_type_strategic_plan: "percentage" | "number" | "ratio" | "text"
      ipcr_status:
        | "draft"
        | "submitted_raw"
        | "under_review_raw"
        | "revision_raw"
        | "reviewed_raw"
        | "submitted"
        | "under_review"
        | "revision"
        | "approved"
      ipcr_supervisor_status:
        | "under_review_raw"
        | "revision_raw"
        | "reviewed_raw"
        | "under_review"
        | "revision"
        | "approved"
      notification_type: "success" | "warning" | "fail" | "notification"
      op_status: "draft" | "submitted" | "reviewing" | "revision" | "approved"
      scope_type: "all" | "office" | "program" | "unit"
      strat_plan_status: "draft" | "published"
      strategic_major_output:
        | "instruction"
        | "research"
        | "extension"
        | "governance_and_management"
      user_gender: "male" | "female"
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

