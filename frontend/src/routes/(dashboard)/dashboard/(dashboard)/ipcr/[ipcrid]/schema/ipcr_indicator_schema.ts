import { z } from 'zod';

// Enum for IPCR indicator status
const ipcrIndicatorStatusEnum = z.enum(['draft', 'submitted', 'reviewing', 'revision', 'approved']);

// Schema for creating a new IPCR indicator
export const createIpcrIndicatorSchema = z.object({
	ipcr_function_id: z.string().uuid('Invalid IPCR Function ID').nullable().optional(),
	ipcr_function_category_id: z
		.string()
		.uuid('Invalid IPCR Function Category ID')
		.nullable()
		.optional(),
	ipcr_function_sub_category_id: z
		.string()
		.uuid('Invalid IPCR Function Sub Category ID')
		.nullable(),
	final_output: z.string().min(1, 'Final output is required'),
	success_indicator: z.string().min(1, 'Success indicator is required'),
	op_activity_indicator_id: z.string().uuid('Invalid OP Activity ID'),
	position: z
		.number()
		.int('Position must be an integer')
		.nonnegative('Position cannot be negative'),
	immediate_supervisor_id: z.string().uuid('Invalid supervisor ID').nullable().optional(),
	units: z
		.number()
		.min(0.01, 'Units must be greater than 0')
		.max(99.99, 'Units cannot exceed 99.99')
		.nullable()
});

// Schema for updating an IPCR indicator
export const updateIpcrIndicatorSchema = z
	.object({
		id: z.string().uuid('Invalid ID'),
		final_output: z.string().min(1, 'Final output is required'),
		success_indicator: z.string().min(1, 'Success indicator is required'),
		op_activity_indicator_id: z.string().uuid('Invalid OP Activity Indicator ID'),
		immediate_supervisor_id: z.string().uuid('Invalid supervisor ID').nullable().optional(),
		units: z
			.number()
			.min(0.01, 'Units must be greater than 0')
			.max(99.99, 'Units cannot exceed 99.99')
			.nullable(),
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

export const ipcrIndicatorDoneSchema = z.object({
	id: z.string().uuid('Invalid ID')
});

// Type exports
export type CreateIpcrIndicatorSchema = typeof createIpcrIndicatorSchema;
export type UpdateIpcrIndicatorSchema = typeof updateIpcrIndicatorSchema;
// Helper type for the status enum
export type IpcrIndicatorStatus = z.infer<typeof ipcrIndicatorStatusEnum>;
