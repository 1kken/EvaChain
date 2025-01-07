import { z } from 'zod';

// Schema for creating a new accomplishment program project
export const createAccomplishmentProgramProjectSchema = z.object({
	accomplishment_report_id: z.string().uuid('Invalid Accomplishment Report ID format'),
	program_project: z.string().min(1, 'Program/Project name is required'),
	position: z.number().int().positive('Position must be a positive integer')
});

// Schema for updating an accomplishment program project
export const updateAccomplishmentProgramProjectSchema = z
	.object({
		id: z.string().uuid('Invalid Program/Project ID format'),
		program_project: z.string().min(1, 'Program/Project name is required')
	})
	.refine((data) => Object.keys(data).length > 1, {
		message: 'At least one field must be provided for update besides id'
	});

export const toggleIsIncludeProgramProjectSchema = z.object({
	id: z.string().uuid('Invalid Metric ID format')
});

export type ToggleIsIncludeProgramProjectSchema = typeof toggleIsIncludeProgramProjectSchema;
export type CreateAccomplishmentProgramProjectSchema =
	typeof createAccomplishmentProgramProjectSchema;
export type UpdateAccomplishmentProgramProjectSchema =
	typeof updateAccomplishmentProgramProjectSchema;
