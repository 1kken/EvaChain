import { z } from 'zod';

export const createDpcrCategorySchema = z.object({
	dpcr_function_id: z.string().uuid('Invalid DPCR Function ID format'),
	category: z
		.string()
		.min(1, 'Category is required')
		.max(255, 'Category must be less than 255 characters'),
	position: z.number().int().positive('Position must be a positive integer')
});

export const updateDpcrCategorySchema = z
	.object({
		id: z.string().uuid('Invalid DPCR Category ID format'),
		category: z
			.string()
			.min(1, 'Category is required')
			.max(255, 'Category must be less than 255 characters')
	})
	.refine((data) => Object.keys(data).length > 1, {
		message: 'At least one field must be provided for update besides id'
	});

export type CreateDpcrCategorySchema = typeof createDpcrCategorySchema;
export type UpdateDpcrCategorySchema = typeof updateDpcrCategorySchema;
