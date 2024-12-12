import { z } from 'zod';

// Schema for creating a new sub support function
export const createSubSupportFunctionSchema = z.object({
	name: z.string().min(1, 'Name is required').max(1000, 'Name must be less than 1000 characters'),
	support_function_id: z.string().uuid('Invalid Support Function ID format'),
	position: z.number().int('Position must be an integer').min(0)
});

// Schema for updating a sub support function
export const updateSubSupportFunctionSchema = z
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

// Schema for updating positions of multiple sub support functions
export const updatePositionsSchema = z.array(
	z.object({
		id: z.string().uuid('Invalid ID format'),
		position: z.number().int('Position must be an integer').min(0)
	})
);

// Export types
export type CreateSubSupportFunctionSchema = typeof createSubSupportFunctionSchema;
export type UpdateSubSupportFunctionSchema = typeof updateSubSupportFunctionSchema;
export type UpdatePositionsSchema = typeof updatePositionsSchema;
