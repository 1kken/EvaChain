import { z } from 'zod';

// Schema for creating a new indicator
export const createIndicatorSchema = z.object({
	indicator: z
		.string()
		.min(1, 'Indicator is required')
		.max(1000, 'Indicator must be less than 1000 characters'),
	core_function_id: z.string().uuid('Invalid Core Function ID').nullable(),
	sub_core_function_id: z.string().uuid('Invalid Core Function ID').nullable(),
	position: z.number().min(0)
});

// Schema for updating an indicator
export const updateIndicatorSchema = z.object({
	id: z.string().uuid('Invalid Indicator ID'),
	indicator: z
		.string()
		.min(1, 'Indicator is required')
		.max(1000, 'Indicator must be less than 1000 characters'),
	accomplishment: z.string().nullable(),
	accomplishment_date: z.string().nullable()
});

// Export types
export type CreateIndicatorSchema = typeof createIndicatorSchema;
export type CreateIndicatorInput = z.infer<typeof createIndicatorSchema>;
export type UpdateIndicatorSchema = typeof updateIndicatorSchema;
export type UpdateIndicatorInput = z.infer<typeof updateIndicatorSchema>;
