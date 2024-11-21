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
export const updateUnitSchema = createUnitSchema.partial();

// Type definitions if needed
export type Unit = typeof unitSchema;
export type CreateUnit = typeof createUnitSchema;
export type UpdateUnit = typeof updateUnitSchema;
