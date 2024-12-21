import { z } from 'zod';

// Schema for creating a new objective
export const createOpObjectiveSchema = z.object({
	op_program_project_id: z.string().uuid('Invalid Program Project ID format'),
	objective: z.string().min(1, 'Objective is required'),
	position: z.number().int().positive('Position must be a positive integer')
});

// Schema for updating an objective
export const updateOpObjectiveSchema = z
	.object({
		id: z.string().uuid('Invalid Objective ID format'),
		objective: z.string().min(1, 'Objective is required')
	})
	.refine((data) => Object.keys(data).length > 1, {
		message: 'At least one field must be provided for update besides id'
	});

export type CreateOpObjectiveSchema = typeof createOpObjectiveSchema;
export type UpdateOpObjectiveSchema = typeof updateOpObjectiveSchema;
