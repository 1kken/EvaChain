import { z } from 'zod';

// Schema for creating a new strategy plan
export const createStrategyPlanSchema = z.object({
	strat_plan_id: z.string().uuid('Invalid Strategic Plan ID format'),
	description: z.string().min(1, 'Description is required'),
	position: z.number().int().positive('Position must be a positive integer')
});

// Schema for updating a strategy plan
export const updateStrategyPlanSchema = z
	.object({
		id: z.string().uuid('Invalid Strategy Plan ID format'),
		description: z.string().min(1, 'Description is required')
	})
	.refine((data) => Object.keys(data).length > 1, {
		message: 'At least one field must be provided for update besides id'
	});

export type CreateStrategyPlanSchema = typeof createStrategyPlanSchema;
export type UpdateStrategyPlanSchema = typeof updateStrategyPlanSchema;
