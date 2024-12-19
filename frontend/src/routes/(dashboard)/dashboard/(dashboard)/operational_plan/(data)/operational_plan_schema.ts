import { z } from 'zod';

// Schema for creating a new operational plan
export const createOperationalPlanSchema = z.object({
	title: z.string().min(1, 'Title is required').max(500, 'Title must be less than 500 characters'),
	implementing_unit: z
		.string()
		.min(1, 'Implementing unit is required')
		.max(500, 'Implementing unit must be less than 500 characters')
});

// Schema for updating an operational plan
export const updateOperationalPlanSchema = z
	.object({
		id: z.string().uuid('Invalid Operational Plan ID format'),
		title: z
			.string()
			.min(1, 'Title is required')
			.max(500, 'Title must be less than 500 characters'),
		implementing_unit: z
			.string()
			.min(1, 'Implementing unit is required')
			.max(500, 'Implementing unit must be less than 500 characters')
	})
	.refine((data) => Object.keys(data).length > 1, {
		message: 'At least one field must be provided for update besides id'
	});

export type CreateOperationalPlanSchema = typeof createOperationalPlanSchema;
export type UpdateOperationalPlanSchema = typeof updateOperationalPlanSchema;
export type UpdateOperationalPlanInput = z.infer<UpdateOperationalPlanSchema>;
