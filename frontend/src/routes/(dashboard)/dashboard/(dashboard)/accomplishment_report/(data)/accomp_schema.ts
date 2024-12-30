import { z } from 'zod';

// Enum for accomplishment report status
export const accomplishmentStatusEnum = z.enum([
	'draft',
	'submitted',
	'reviewing',
	'revision',
	'approved'
]);

// Schema for creating a new accomplishment report
export const createAccomplishmentReportSchema = z.object({
	implementing_unit: z
		.string()
		.min(1, 'Implementing unit is required')
		.max(500, 'Implementing unit must be less than 500 characters'),
	title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters')
});

// Schema for updating an accomplishment report
export const updateAccomplishmentReportSchema = z
	.object({
		id: z.string().uuid('Invalid Accomplishment Report ID format'),
		implementing_unit: z
			.string()
			.min(1, 'Implementing unit is required')
			.max(500, 'Implementing unit must be less than 500 characters'),
		title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters')
	})
	.refine((data) => Object.keys(data).length > 1, {
		message: 'At least one field must be provided for update besides id'
	});

// Export type definitions
export type CreateAccomplishmentReportSchema = typeof createAccomplishmentReportSchema;
export type UpdateAccomplishmentReportSchema = typeof updateAccomplishmentReportSchema;
export type CreateAccomplishmentReportInput = z.infer<typeof createAccomplishmentReportSchema>;
export type UpdateAccomplishmentReportInput = z.infer<typeof updateAccomplishmentReportSchema>;
