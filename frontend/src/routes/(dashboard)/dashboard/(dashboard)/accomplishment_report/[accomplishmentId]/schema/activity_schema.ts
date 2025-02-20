import { z } from 'zod';

// Base Activity Schemas
export const createAccomplishmentActivitySchema = z.object({
	accomplishment_annual_plan_id: z.string().uuid('Invalid Annual Plan ID format'),
	activity: z.string().min(1, 'Activity description is required'),
	position: z.number().int().positive('Position must be a positive integer')
});

export const updateAccomplishmentActivitySchema = z
	.object({
		id: z.string().uuid('Invalid Activity ID format'),
		activity: z.string().min(1, 'Activity description is required').optional(),
		position: z.number().int().positive('Position must be a positive integer').optional()
	})
	.refine((data) => Object.keys(data).length > 1, {
		message: 'At least one field must be provided for update besides id'
	});

export type CreateAccomplishmentActivitySchema = typeof createAccomplishmentActivitySchema;
export type UpdateAccomplishmentActivitySchema = typeof updateAccomplishmentActivitySchema;
