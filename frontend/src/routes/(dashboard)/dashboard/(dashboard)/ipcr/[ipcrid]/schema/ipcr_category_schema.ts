import { z } from 'zod';

// Schema for creating a new IPCR function category
export const createIpcrFunctionCategorySchema = z.object({
	category: z
		.string()
		.min(1, 'Category is required')
		.max(255, 'Category must be less than 255 characters'),
	ipcr_function_id: z.string().uuid('Invalid IPCR Function ID format'),
	unit: z
		.number()
		.min(0, 'Unit must be greater than or equal to 0')
		.max(100, 'Unit must be less than or equal to 100')
		.multipleOf(0.01, 'Unit must have at most 2 decimal places')
		.nullable(),
	immediate_supervisor_id: z.string().uuid('Invalid Supervisor ID format').nullable(),
	position: z
		.number()
		.int('Position must be an integer')
		.positive('Position must be a positive integer')
});

// Schema for updating an IPCR function category
export const updateIpcrFunctionCategorySchema = z
	.object({
		id: z.string().uuid('Invalid IPCR Function Category ID format'),
		category: z
			.string()
			.min(1, 'Category is required')
			.max(255, 'Category must be less than 255 characters'),
		unit: z
			.number()
			.min(0, 'Unit must be greater than or equal to 0')
			.max(100, 'Unit must be less than or equal to 100')
			.multipleOf(0.01, 'Unit must have at most 2 decimal places')
			.nullable(),
		immediate_supervisor_id: z.string().uuid('Invalid Supervisor ID format').nullable()
	})
	.refine((data) => Object.keys(data).length > 1, {
		message: 'At least one field must be provided for update besides id'
	});

// Type exports
export type CreateIpcrFunctionCategorySchema = typeof createIpcrFunctionCategorySchema;
export type UpdateIpcrFunctionCategorySchema = typeof updateIpcrFunctionCategorySchema;
