import { z } from 'zod';

// Schema for creating a new IPCR function
export const createIpcrFunctionSchema = z.object({
	title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
	ipcr_id: z.string().uuid('Invalid IPCR ID format'),
	position: z
		.number()
		.int('Position must be an integer')
		.positive('Position must be a positive integer')
});

// Schema for updating an IPCR function
export const updateIpcrFunctionSchema = z
	.object({
		id: z.string().uuid('Invalid IPCR Function ID format'),
		title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters')
	})
	.refine((data) => Object.keys(data).length > 1, {
		message: 'At least one field must be provided for update besides id'
	});

// Type exports
export type CreateIpcrFunctionSchema = typeof createIpcrFunctionSchema;
export type UpdateIpcrFunctionSchema = typeof updateIpcrFunctionSchema;
