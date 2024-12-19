import { z } from 'zod';

// Schema for creating a new op header
export const createOpHeaderSchema = z.object({
	operational_plan_id: z.string().uuid('Invalid Operational Plan ID format'),
	position: z.number().int().positive('Position must be a positive integer'),
	title: z.string().min(1, 'Title is required').max(500, 'Title must be less than 500 characters')
});

// Schema for updating an op header
export const updateOpHeaderSchema = z
	.object({
		id: z.string().uuid('Invalid Op Header ID format'),
		title: z.string().min(1, 'Title is required').max(500, 'Title must be less than 500 characters')
	})
	.refine((data) => Object.keys(data).length > 1, {
		message: 'At least one field must be provided for update besides id'
	});

export type CreateOpHeaderSchema = typeof createOpHeaderSchema;
export type UpdateOpHeaderSchema = typeof updateOpHeaderSchema;
