import { z } from 'zod';

export const createOpcrIndicatorSchema = z
	.object({
		opcr_function_id: z.string().uuid('Invalid OPCR Function ID format').nullable(),
		opcr_function_category_id: z.string().uuid('Invalid OPCR Category ID format').nullable(),
		success_indicator: z.string().min(1, 'Success indicator is required'),
		alloted_budget: z.string(),
		division_individuals_accountable: z.string(),
		actual_accomplishments: z.string(),
		quality_rating: z
			.number({ invalid_type_error: 'Quality rating must be a number' })
			.min(0)
			.max(5),
		efficiency_rating: z
			.number({ invalid_type_error: 'Efficiency rating must be a number' })
			.min(0)
			.max(5),
		timeliness_rating: z
			.number({ invalid_type_error: 'Timeliness rating must be a number' })
			.min(0)
			.max(5),
		average_rating: z
			.number({ invalid_type_error: 'Average rating must be a number' })
			.min(0)
			.max(5),
		remarks: z.string().nullable(),
		position: z.number().int().positive('Position must be a positive integer')
	})
	.refine((data) => data.opcr_function_id || data.opcr_function_category_id, {
		message: 'Either opcr_function_id or opcr_function_category_id must be provided'
	});

export const updateOpcrIndicatorSchema = z
	.object({
		id: z.string().uuid('Invalid OPCR Indicator ID format'),
		success_indicator: z.string().min(1, 'Success indicator is required'),
		alloted_budget: z.string(),
		division_individuals_accountable: z.string(),
		actual_accomplishments: z.string(),
		quality_rating: z
			.number({ invalid_type_error: 'Quality rating must be a number' })
			.min(0)
			.max(5),
		efficiency_rating: z
			.number({ invalid_type_error: 'Efficiency rating must be a number' })
			.min(0)
			.max(5),
		timeliness_rating: z
			.number({ invalid_type_error: 'Timeliness rating must be a number' })
			.min(0)
			.max(5),
		average_rating: z
			.number({ invalid_type_error: 'Average rating must be a number' })
			.min(0)
			.max(5),
		remarks: z.string().nullable()
	})
	.refine((data) => Object.keys(data).length > 1, {
		message: 'At least one field must be provided for update besides id'
	});

export type CreateOpcrIndicatorSchema = typeof createOpcrIndicatorSchema;
export type UpdateOpcrIndicatorSchema = typeof updateOpcrIndicatorSchema;
