import { z } from 'zod';

// Schema for creating a new accomplishment annual plan
export const createAccomplishmentAnnualPlanSchema = z.object({
	accomplishment_header_id: z.string().uuid('Invalid Accomplishment Header ID format'),
	description: z.string().min(1, 'Description is required'),
	position: z.number().int().positive('Position must be a positive integer')
});

// Schema for updating an accomplishment annual plan
export const updateAccomplishmentAnnualPlanSchema = z
	.object({
		id: z.string().uuid('Invalid Annual Plan ID format'),
		description: z.string().min(1, 'Description is required')
	})
	.refine((data) => Object.keys(data).length > 1, {
		message: 'At least one field must be provided for update besides id'
	});

// Type definitions for TypeScript
export type CreateAccomplishmentAnnualPlanSchema = typeof createAccomplishmentAnnualPlanSchema;
export type UpdateAccomplishmentAnnualPlanSchema = typeof updateAccomplishmentAnnualPlanSchema;
