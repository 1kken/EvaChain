import { z } from 'zod';

// Schema for creating a new accomplishment metric
export const createAccomplishmentMetricSchemaTemplate = z.object({
	accomplishment_template_program_project_id: z.string().uuid('Invalid Program/Project ID format'),
	metrics: z.string().min(1, 'Metrics description is required'),
	position: z.number().int().positive('Position must be a positive integer'),
	former_state: z.string().nullable(),
	annual_target: z.string().nullable()
});

// Schema for updating an accomplishment metric
export const updateAccomplishmentMetricSchemaTemplate = z
	.object({
		id: z.string().uuid('Invalid Metric ID format'),
		metrics: z.string().min(1, 'Metrics description is required').optional(),
		former_state: z.string().nullable().optional(),
		annual_target: z.string().nullable().optional()
	})
	.refine((data) => Object.keys(data).length > 1, {
		message: 'At least one field must be provided for update besides id'
	});

export type CreateAccomplishmentMetricSchemaTemplate =
	typeof createAccomplishmentMetricSchemaTemplate;
export type UpdateAccomplishmentMetricSchemaTemplate =
	typeof updateAccomplishmentMetricSchemaTemplate;
