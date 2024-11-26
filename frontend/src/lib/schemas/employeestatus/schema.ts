// lib/schemas/employee-status/schema.ts
import { z } from 'zod';

// Base schema for common employee status fields
export const employeeStatusSchema = z.object({
	id: z.number().int(),
	type: z.string().max(100),
	created_at: z.string().datetime(), // for ISO date strings
	updated_at: z.string().datetime() // for ISO date strings
});

// Schema for creating new employee status (without id and timestamps)
export const createEmployeeStatusSchema = z.object({
	type: z
		.string()
		.min(2, 'Type must be at least 2 characters')
		.max(100, 'Type must not exceed 100 characters')
		.refine((value) => /^[a-zA-Z\s-]+$/.test(value), {
			message: 'Type must contain only letters, spaces, and hyphens'
		})
});

// Schema for updating employee status
export const updateEmployeeStatusSchema = z.object({
	id: z.number().int(),
	type: z
		.string()
		.min(2, 'Type must be at least 2 characters')
		.max(100, 'Type must not exceed 100 characters')
		.refine((value) => /^[a-zA-Z\s-]+$/.test(value), {
			message: 'Type must contain only letters, spaces, and hyphens'
		})
		.optional()
});

// Schema for deleting employee status
export const deleteEmployeeStatusSchema = z.object({
	confirmation: z.string().refine((val) => val?.toLowerCase() === 'delete', {
		message: 'Please type "delete" to confirm'
	}),
	id: z.number().int(),
	type: z.string().optional()
});

// Type definitions
export type EmployeeStatus = z.infer<typeof employeeStatusSchema>;
export type CreateEmployeeStatus = z.infer<typeof createEmployeeStatusSchema>;
export type UpdateEmployeeStatus = z.infer<typeof updateEmployeeStatusSchema>;
export type DeleteEmployeeStatus = z.infer<typeof deleteEmployeeStatusSchema>;
