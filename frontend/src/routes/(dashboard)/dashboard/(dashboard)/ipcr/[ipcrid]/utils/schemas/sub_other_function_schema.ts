import { z } from 'zod';

// Schema for creating a new sub other function
export const createSubOtherFunctionSchema = z.object({
	name: z.string().min(1, 'Name is required').max(1000, 'Name must be less than 1000 characters'),
	other_function_id: z.string().uuid('Invalid Other Function ID format'),
	position: z.number().int('Position must be an integer').min(0)
});

// Schema for updating a sub other function
export const updateSubOtherFunctionSchema = z
	.object({
		id: z.string().uuid('Invalid ID format'),
		name: z
			.string()
			.min(1, 'Name is required')
			.max(1000, 'Name must be less than 1000 characters')
			.optional()
	})
	.refine((data) => Object.keys(data).length > 1, {
		message: 'At least one field must be provided for update'
	});

// Schema for updating positions of multiple sub other functions
export const updatePositionsSchema = z.array(
	z.object({
		id: z.string().uuid('Invalid ID format'),
		position: z.number().int('Position must be an integer').min(0)
	})
);

// Export types
export type CreateSubOtherFunctionSchema = typeof createSubOtherFunctionSchema;
export type UpdateSubOtherFunctionSchema = typeof updateSubOtherFunctionSchema;
export type UpdatePositionsSchema = typeof updatePositionsSchema;
