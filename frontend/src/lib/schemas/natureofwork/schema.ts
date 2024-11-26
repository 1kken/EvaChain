// lib/schemas/nature-of-work/schema.ts
import { z } from 'zod';

// Base schema for common nature of work fields
export const natureOfWorkSchema = z.object({
	id: z.number().int(),
	type: z.string().max(100),
	created_at: z.string().datetime(), // for ISO date strings
	updated_at: z.string().datetime() // for ISO date strings
});

// Schema for creating new nature of work (without id and timestamps)
export const createNatureOfWorkSchema = z.object({
	type: z
		.string()
		.min(2, 'Type must be at least 2 characters')
		.max(100, 'Type must not exceed 100 characters')
		.refine((value) => /^[a-zA-Z\s-]+$/.test(value), {
			message: 'Type must contain only letters, spaces, and hyphens'
		})
});

// Schema for updating nature of work
export const updateNatureOfWorkSchema = z.object({
	id: z.number().int(),
	type: z
		.string()
		.min(2, 'Type must be at least 2 characters')
		.max(100, 'Type must not exceed 100 characters')
		.refine((value) => /^[a-zA-Z\s-]+$/.test(value), {
			message: 'Type must contain only letters, spaces, and hyphens'
		})
		.optional()
});

// Schema for deleting nature of work
export const deleteNatureOfWorkSchema = z.object({
	confirmation: z.string().refine((val) => val?.toLowerCase() === 'delete', {
		message: 'Please type "delete" to confirm'
	}),
	id: z.number().int(),
	type: z.string().optional()
});

// Type definitions
export type NatureOfWork = z.infer<typeof natureOfWorkSchema>;
export type CreateNatureOfWork = z.infer<typeof createNatureOfWorkSchema>;
export type UpdateNatureOfWork = z.infer<typeof updateNatureOfWorkSchema>;
export type DeleteNatureOfWork = z.infer<typeof deleteNatureOfWorkSchema>;
