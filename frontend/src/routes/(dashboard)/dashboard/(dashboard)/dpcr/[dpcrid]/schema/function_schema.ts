import { z } from 'zod';

// Schema for creating a new DPCR function
export const createDpcrFunctionSchema = z.object({
	dpcr_id: z.string().uuid('Invalid DPCR ID format'),
	title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
	position: z.number().int().positive('Position must be a positive integer')
});

// Schema for updating a DPCR function
export const updateDpcrFunctionSchema = z
	.object({
		id: z.string().uuid('Invalid DPCR Function ID format'),
		title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters')
	})
	.refine((data) => Object.keys(data).length > 1, {
		message: 'At least one field must be provided for update besides id'
	});

export type CreateDpcrFunctionSchema = typeof createDpcrFunctionSchema;
export type UpdateDpcrFunctionSchema = typeof updateDpcrFunctionSchema;
