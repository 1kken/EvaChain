import { z } from 'zod';

// Schema for creating a new accomplishment header
export const createAccomplishmentHeaderSchema = z.object({
	accomplishment_report_id: z.string().uuid('Invalid Accomplishment Report ID format'),
	title: z.string().min(1, 'Title is required'),
	position: z.number().int().positive('Position must be a positive integer')
});

// Schema for updating an accomplishment header
export const updateAccomplishmentHeaderSchema = z
	.object({
		id: z.string().uuid('Invalid Header ID format'),
		title: z.string().min(1, 'Title is required')
	})
	.refine((data) => Object.keys(data).length > 1, {
		message: 'At least one field must be provided for update besides id'
	});

// Type definitions for TypeScript
export type CreateAccomplishmentHeaderSchema = typeof createAccomplishmentHeaderSchema;
export type UpdateAccomplishmentHeaderSchema = typeof updateAccomplishmentHeaderSchema;
