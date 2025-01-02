import { z } from 'zod';

// Schema for creating a new accomplishment metric
export const createAccomplishmentMetricSchema = z.object({
	accomplishment_program_project_id: z.string().uuid('Invalid Program/Project ID format'),
	metrics: z.string().min(1, 'Metrics description is required'),
	position: z.number().int().positive('Position must be a positive integer'),
	former_state: z.string().nullable(),
	annual_target: z.string().nullable(),
	quarter_1_accomplishment: z.string().nullable(),
	quarter_2_accomplishment: z.string().nullable(),
	quarter_3_accomplishment: z.string().nullable(),
	quarter_4_accomplishment: z.string().nullable(),
	total_accomplishment: z.string().nullable(),
	variance: z.string().nullable(),
	remarks: z.string().nullable()
});

// Schema for updating an accomplishment metric
export const updateAccomplishmentMetricSchema = z
	.object({
		id: z.string().uuid('Invalid Metric ID format'),
		metrics: z.string().min(1, 'Metrics description is required').optional(),
		former_state: z.string().nullable().optional(),
		annual_target: z.string().nullable().optional(),
		quarter_1_accomplishment: z.string().nullable().optional(),
		quarter_2_accomplishment: z.string().nullable().optional(),
		quarter_3_accomplishment: z.string().nullable().optional(),
		quarter_4_accomplishment: z.string().nullable().optional(),
		total_accomplishment: z.string().nullable().optional(),
		variance: z.string().nullable().optional(),
		remarks: z.string().nullable().optional()
	})
	.refine((data) => Object.keys(data).length > 1, {
		message: 'At least one field must be provided for update besides id'
	});

export type CreateAccomplishmentMetricSchema = typeof createAccomplishmentMetricSchema;
export type UpdateAccomplishmentMetricSchema = typeof updateAccomplishmentMetricSchema;
