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
	title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
	unit_id: z.number().int('Unit ID must be an integer').positive('Unit ID must be positive'),
	office_id: z
		.number()
		.int('Office ID must be an integer')
		.positive('Office ID must be positive')
		.nullable(),
	program_id: z
		.number()
		.int('Program ID must be an integer')
		.positive('Program ID must be positive')
		.nullable()
});

// Schema for updating an accomplishment report
export const updateAccomplishmentReportSchema = z
	.object({
		id: z.string().uuid('Invalid Accomplishment Report ID format'),
		implementing_unit: z
			.string()
			.min(1, 'Implementing unit is required')
			.max(500, 'Implementing unit must be less than 500 characters')
			.optional(),
		title: z
			.string()
			.min(1, 'Title is required')
			.max(255, 'Title must be less than 255 characters')
			.optional(),
		status: accomplishmentStatusEnum.optional(),
		unit_id: z
			.number()
			.int('Unit ID must be an integer')
			.positive('Unit ID must be positive')
			.optional(),
		office_id: z
			.number()
			.int('Office ID must be an integer')
			.positive('Office ID must be positive')
			.nullable()
			.optional(),
		program_id: z
			.number()
			.int('Program ID must be an integer')
			.positive('Program ID must be positive')
			.nullable()
			.optional()
	})
	.refine((data) => Object.keys(data).length > 1, {
		message: 'At least one field must be provided for update besides id'
	});

// Export type definitions
export type CreateAccomplishmentReportSchema = typeof createAccomplishmentReportSchema;
export type UpdateAccomplishmentReportSchema = typeof updateAccomplishmentReportSchema;
export type CreateAccomplishmentReportInput = z.infer<typeof createAccomplishmentReportSchema>;
export type UpdateAccomplishmentReportInput = z.infer<typeof updateAccomplishmentReportSchema>;
