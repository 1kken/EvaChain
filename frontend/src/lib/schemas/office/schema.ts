// lib/schemas/office/schema.ts
import { message } from 'sveltekit-superforms';
import { z } from 'zod';

// Base schema for common office fields
export const officeSchema = z.object({
	id: z.number().int(),
	unit_id: z.number().int(),
	code: z.string().max(50),
	name: z.string().max(200),
	created_at: z.string().datetime(), // for ISO date strings
	updated_at: z.string().datetime() // for ISO date strings
});

// Schema for creating new offices (without id and timestamps)
export const createOfficeSchema = z.object({
	unit_id: z.number().int().positive('Please Select a unit id'),
	code: z.string().refine((value) => value.length >= 2 && value.length <= 50, {
		message: 'Code must be a valid name minimum 2 characters'
	}),
	name: z.string().refine((value) => value.length >= 4 && value.length <= 200, {
		message: 'Name must be a valid name minimum 4 characters'
	})
});

// Schema for updating offices
export const updateOfficeSchema = z.object({
	id: z.number().int(),
	unit_id: z.number().int().positive('Unit ID must be a positive number').optional(),
	name: z.string().min(2).max(200).optional(),
	code: z.string().min(2).max(50).optional()
});

// Schema for deleting offices
export const deleteOfficeSchema = z.object({
	confirmation: z.string().refine((val) => val?.toLowerCase() === 'delete', {
		message: 'Please type "delete" to confirm'
	}),
	id: z.number().int(),
	name: z.string().optional()
});

// Type definitions
export type OfficeSchema = typeof officeSchema;
export type CreateOffice = z.infer<typeof createOfficeSchema>;
export type UpdateOffice = z.infer<typeof updateOfficeSchema>;
export type DeleteOffice = z.infer<typeof deleteOfficeSchema>;
