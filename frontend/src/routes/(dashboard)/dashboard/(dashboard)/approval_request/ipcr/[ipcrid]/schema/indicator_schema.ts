import { z } from 'zod';

export const updateIpcrIndicatorSchema = z
	.object({
		id: z.string().uuid('Invalid ID'),
		quality_rating: z
			.number()
			.min(1, 'Quality rating must be at least 1')
			.max(5, 'Quality rating cannot exceed 5')
			.nullable(),
		efficiency_rating: z
			.number()
			.min(1, 'Efficiency rating must be at least 1')
			.max(5, 'Efficiency rating cannot exceed 5')
			.nullable(),
		timeliness_rating: z
			.number()
			.min(1, 'Timeliness rating must be at least 1')
			.max(5, 'Timeliness rating cannot exceed 5')
			.nullable(),
		average_rating: z
			.number()
			.min(1, 'Average rating must be at least 1')
			.max(5, 'Average rating cannot exceed 5')
			.nullable(),
		remarks: z.string().nullable().optional()
	})
	.refine((data) => Object.keys(data).length > 1, {
		message: 'At least one field must be provided for update besides id'
	});

export type UpdateIpcrIndicatorSchema = typeof updateIpcrIndicatorSchema;
