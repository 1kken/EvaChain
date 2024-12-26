import { z } from 'zod';

// Schema for creating a new IPCR function sub-category
export const createIpcrFunctionSubCategorySchema = z.object({
	ipcr_function_category_id: z.string().uuid('Invalid IPCR Function Category ID format'),
	sub_category: z
		.string()
		.min(1, 'Sub-category is required')
		.max(255, 'Sub-category must be less than 255 characters'),
	position: z
		.number()
		.int('Position must be an integer')
		.positive('Position must be a positive integer')
});

// Schema for updating an IPCR function sub-category
export const updateIpcrFunctionSubCategorySchema = z
	.object({
		id: z.string().uuid('Invalid IPCR Function Sub-Category ID format'),
		sub_category: z
			.string()
			.min(1, 'Sub-category is required')
			.max(255, 'Sub-category must be less than 255 characters')
	})
	.refine((data) => Object.keys(data).length > 1, {
		message: 'At least one field must be provided for update besides id'
	});

// Type exports
export type CreateIpcrFunctionSubCategorySchema = typeof createIpcrFunctionSubCategorySchema;
export type UpdateIpcrFunctionSubCategorySchema = typeof updateIpcrFunctionSubCategorySchema;
