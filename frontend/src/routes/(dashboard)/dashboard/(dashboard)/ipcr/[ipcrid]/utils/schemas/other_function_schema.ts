import { z } from 'zod';

// Schema for creating a new other function
export const createOtherFunctionSchema = z.object({
	name: z.string().min(1, 'Name is required').max(1000, 'Name must be less than 1000 characters'),

	ipcr_id: z.string().uuid('Invalid IPCR Teaching ID format'),

	unit: z.number().multipleOf(0.01).min(1, 'Unit must be greater than zero').nullable(),
	position: z.number().min(0),
	reviewer_id: z.string().uuid('Invalid User').nullable()
});

export const updateOtherFunctionSchema = z
	.object({
		id: z.string(),
		name: z
			.string()
			.min(1, 'Name is required')
			.max(1000, 'Name must be less than 1000 characters')
			.optional(),

		unit: z
			.number()
			.multipleOf(0.01)
			.min(1, 'Unit must be greater than zero')
			.optional()
			.nullable(),

		reviewer_id: z.string().uuid('Invalid User').optional()
	})
	.refine((data) => Object.keys(data).length > 0, {
		message: 'At least one field must be provided for update'
	});

export type CreateOtherFunctionSchema = typeof createOtherFunctionSchema;
export type UpdateOtherFunctionSchema = typeof updateOtherFunctionSchema;
