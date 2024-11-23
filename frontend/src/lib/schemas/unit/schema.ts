import { z } from 'zod';

export const unitSchema = z.object({
	id: z.number().int(),
	code: z.string().max(50),
	name: z.string(),
	created_at: z.string().datetime(), // for ISO date strings
	updated_at: z.string().datetime() // for ISO date strings
});

// If you need a schema for creating new units (without id and timestamps)
export const createUnitSchema = z.object({
	code: z.string().min(3).max(50),
	name: z.string().min(3)
});

// If you need a schema for updating units
export const updateUnitSchema = z.object({
	id: z.number().int(),
	name: z.string().optional(),
	code: z.string().optional()
});

// If need to delete
export const deleteUnitSchema = z.object({
	confirmation: z.string().refine((val) => val?.toLowerCase() === 'delete', {
		message: 'Please type "delete" to confirm'
	}),
	id: z.number().int(),
	name: z.string().optional()
});

// Type definitions if needed
export type Unit = typeof unitSchema;
export type CreateUnit = typeof createUnitSchema;

export type UpdateUnitSchema = typeof updateUnitSchema;
export type UpdateUnit = z.infer<typeof updateUnitSchema>;

export type DeleteUnitSchema = typeof deleteUnitSchema;
export type DeleteUnit = z.infer<typeof deleteUnitSchema>;
