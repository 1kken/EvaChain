import { z } from 'zod';

// Schema for creating a new indicator
export const createIndicatorSchema = z.object({
	indicator: z
		.string()
		.min(1, 'Indicator is required')
		.max(1000, 'Indicator must be less than 1000 characters')
		.optional(),
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
		.max(1000, 'Indicator must be less than 1000 characters')
		.optional()
});

// First, define your schema (in schema file)
export const markIndicatorDoneSchema = z.object({
	id: z.string().uuid('Invalid Indicator ID'),
	accomplishment: z.string().min(10, 'IPCR must have atleast 10 charactes'),
	accomplishment_date: z.string().refine((v) => v, { message: 'Accomplishment date is required.' })
});

export type MarkIndicatorDoneSchema = typeof markIndicatorDoneSchema;
export type CreateIndicatorSchema = typeof createIndicatorSchema;
export type UpdateIndicatorSchema = typeof updateIndicatorSchema;
