import { z } from 'zod';

export const createOpcrFunctionSchema = z.object({
	opcr_id: z.string().uuid('Invalid OPCR ID format'),
	title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
	position: z.number().int().positive('Position must be a positive integer')
});

export const updateOpcrFunctionSchema = z
	.object({
		id: z.string().uuid('Invalid OPCR Function ID format'),
		title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters')
	})
	.refine((data) => Object.keys(data).length > 1, {
		message: 'At least one field must be provided for update besides id'
	});

export type CreateOpcrFunctionSchema = typeof createOpcrFunctionSchema;
export type UpdateOpcrFunctionSchema = typeof updateOpcrFunctionSchema;
