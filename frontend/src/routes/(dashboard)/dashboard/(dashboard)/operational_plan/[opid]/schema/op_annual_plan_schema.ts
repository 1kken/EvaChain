import { z } from 'zod';

// Schema for creating a new objective
export const createOpAnnualPlanSchema = z.object({
	op_header_id: z.string().uuid('Invalid Program Project ID format'),
	description: z.string().min(1, 'Objective is required'),
	position: z.number().int().positive('Position must be a positive integer')
});

// Schema for updating an objective
export const updateOpAnnualPlanSchema = z
	.object({
		id: z.string().uuid('Invalid Objective ID format'),
		description: z.string().min(1, 'Objective is required')
	})
	.refine((data) => Object.keys(data).length > 1, {
		message: 'At least one field must be provided for update besides id'
	});

export type CreateOpAnnualPlanSchema = typeof createOpAnnualPlanSchema;
export type UpdateOpAnnualPlanSchema = typeof updateOpAnnualPlanSchema;
