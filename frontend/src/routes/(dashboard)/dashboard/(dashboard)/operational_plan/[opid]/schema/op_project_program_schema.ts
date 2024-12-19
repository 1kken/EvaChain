import { z } from 'zod';

// Schema for creating a new program project
export const createOpProgramProjectSchema = z.object({
	op_header_id: z.string().uuid('Invalid Header ID format'),
	description: z
		.string()
		.min(1, 'Description is required')
		.max(1000, 'Description must be less than 1000 characters'),
	position: z.number().int().positive('Position must be a positive integer')
});

// Schema for updating a program project
export const updateOpProgramProjectSchema = z
	.object({
		id: z.string().uuid('Invalid Program Project ID format'),
		description: z
			.string()
			.min(1, 'Description is required')
			.max(1000, 'Description must be less than 1000 characters')
	})
	.refine((data) => Object.keys(data).length > 1, {
		message: 'At least one field must be provided for update besides id'
	});

export type CreateOpProgramProjectSchema = typeof createOpProgramProjectSchema;
export type UpdateOpProgramProjectSchema = typeof updateOpProgramProjectSchema;
