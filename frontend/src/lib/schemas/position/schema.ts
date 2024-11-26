import { z } from 'zod';

// Base schema for common position fields
export const positionSchema = z.object({
	id: z.number().int(),
	nature_of_work_id: z.number().int(),
	name: z.string().max(100)
});

// Schema for creating new positions
export const createPositionSchema = z.object({
	nature_of_work_id: z.number().int().positive('Please select a nature of work'),
	name: z.string().refine((value) => value.length >= 3 && value.length <= 100, {
		message: 'Name not valid'
	})
});

// Schema for updating positions
export const updatePositionSchema = z.object({
	id: z.number().int(),
	nature_of_work_id: z
		.number()
		.int()
		.positive('Nature of work ID must be a positive number')
		.optional(),
	name: z.string().min(3).max(100).optional()
});

// Schema for deleting positions
export const deletePositionSchema = z.object({
	confirmation: z.string().refine((val) => val?.toLowerCase() === 'delete', {
		message: 'Please type "delete" to confirm'
	}),
	id: z.number().int(),
	name: z.string().optional()
});

// Type definitions
export type positionSchema = typeof positionSchema;
export type CreatePosition = z.infer<typeof createPositionSchema>;
export type UpdatePosition = z.infer<typeof updatePositionSchema>;
export type DeletePosition = z.infer<typeof deletePositionSchema>;
