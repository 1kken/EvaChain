import { message } from 'sveltekit-superforms';
import { z } from 'zod';

// Base schema for common programme fields
export const programmeSchema = z.object({
	id: z.number().int(),
	unit_id: z.number().int(),
	office_id: z.number().int(),
	name: z.string().max(200),
	created_at: z.string().datetime(), // for ISO date strings
	updated_at: z.string().datetime() // for ISO date strings
});

// Schema for creating new programmes (without id and timestamps)
export const createProgrammeSchema = z.object({
	unit_id: z.number().int().positive('Please select a unit'),
	office_id: z.number().int().positive('Please select an office'),
	name: z.string().refine((value) => value.length >= 4 && value.length <= 200, {
		message: 'Name not valid'
	})
});

// Schema for updating programmes
export const updateProgrammeSchema = z.object({
	id: z.number().int(),
	unit_id: z.number().int().positive('Unit ID must be a positive number').optional(),
	office_id: z.number().int().positive('Office ID must be a positive number').optional(),
	name: z.string().min(4).max(200).optional()
});

// Schema for deleting programmes
export const deleteProgrammeSchema = z.object({
	confirmation: z.string().refine((val) => val?.toLowerCase() === 'delete', {
		message: 'Please type "delete" to confirm'
	}),
	id: z.number().int(),
	name: z.string().optional()
});

// Type definitions
export type ProgrammeSchema = typeof programmeSchema;
export type CreateProgramme = z.infer<typeof createProgrammeSchema>;
export type UpdateProgramme = z.infer<typeof updateProgrammeSchema>;
export type DeleteProgramme = z.infer<typeof deleteProgrammeSchema>;
