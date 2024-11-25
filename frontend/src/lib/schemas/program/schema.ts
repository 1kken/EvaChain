import { message } from 'sveltekit-superforms';
import { z } from 'zod';

// Base schema for common program fields
export const programSchema = z.object({
	id: z.number().int(),
	unit_id: z.number().int(),
	office_id: z.number().int(),
	name: z.string().max(200),
	created_at: z.string().datetime(), // for ISO date strings
	updated_at: z.string().datetime() // for ISO date strings
});

// Schema for creating new programs (without id and timestamps)
export const createProgramSchema = z.object({
	unit_id: z.number().int().positive('Please select a unit'),
	office_id: z.number().int().positive('Please select an office'),
	name: z.string().refine((value) => value.length >= 4 && value.length <= 200, {
		message: 'Name not valid'
	})
});

// Schema for updating programs
export const updateProgramSchema = z.object({
	id: z.number().int(),
	unit_id: z.number().int().positive('Unit ID must be a positive number').optional(),
	office_id: z.number().int().positive('Office ID must be a positive number').optional(),
	name: z.string().min(4).max(200).optional()
});

// Schema for deleting programs
export const deleteProgramSchema = z.object({
	confirmation: z.string().refine((val) => val?.toLowerCase() === 'delete', {
		message: 'Please type "delete" to confirm'
	}),
	id: z.number().int(),
	name: z.string().optional()
});

// Type definitions
export type programSchema = typeof programSchema;
export type CreateProgram = z.infer<typeof createProgramSchema>;
export type UpdateProgram = z.infer<typeof updateProgramSchema>;
export type DeleteProgram = z.infer<typeof deleteProgramSchema>;
