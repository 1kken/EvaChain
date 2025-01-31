import { z } from 'zod';

export const createOpcrCategorySchema = z.object({
	opcr_function_id: z.string().uuid('Invalid OPCR Function ID format'),
	category: z
		.string()
		.min(1, 'Category is required')
		.max(255, 'Category must be less than 255 characters'),
	position: z.number().int().positive('Position must be a positive integer')
});

export const updateOpcrCategorySchema = z
	.object({
		id: z.string().uuid('Invalid OPCR Category ID format'),
		category: z
			.string()
			.min(1, 'Category is required')
			.max(255, 'Category must be less than 255 characters')
	})
	.refine((data) => Object.keys(data).length > 1, {
		message: 'At least one field must be provided for update besides id'
	});

export type CreateOpcrCategorySchema = typeof createOpcrCategorySchema;
export type UpdateOpcrCategorySchema = typeof updateOpcrCategorySchema;
