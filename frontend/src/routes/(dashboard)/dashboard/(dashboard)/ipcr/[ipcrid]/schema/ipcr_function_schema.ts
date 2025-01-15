import { z } from 'zod';

// Schema for creating a new IPCR function
export const createIpcrFunctionSchema = z
	.object({
		title: z
			.string()
			.min(1, 'Title is required')
			.max(255, 'Title must be less than 255 characters'),
		percentage: z
			.number()
			.int('Percentage must be an integer')
			.min(0, 'Percentage cannot be negative')
			.max(100, 'Percentage cannot exceed 100'),
		ipcr_id: z.string().uuid('Invalid IPCR ID format'),
		position: z
			.number()
			.int('Position must be an integer')
			.positive('Position must be a positive integer'),
		remainingPercentage: z.number().optional()
	})
	.refine(
		(data) => {
			if (data.remainingPercentage === undefined || !data.percentage) return true;
			return data.percentage <= data.remainingPercentage;
		},
		(data) => ({
			message: `Percentage cannot exceed the remaining available percentage (${data.remainingPercentage}%)`,
			path: ['percentage']
		})
	);

// Schema for updating an IPCR function
export const updateIpcrFunctionSchema = z
	.object({
		id: z.string().uuid('Invalid IPCR Function ID format'),
		title: z
			.string()
			.min(1, 'Title is required')
			.max(255, 'Title must be less than 255 characters'),
		percentage: z
			.number()
			.int('Percentage must be an integer')
			.min(0, 'Percentage cannot be negative')
			.max(100, 'Percentage cannot exceed 100'),
		remainingPercentage: z.number().optional()
	})
	.refine((data) => Object.keys(data).length > 1, {
		message: 'At least one field must be provided for update besides id'
	})
	.refine(
		(data) => {
			if (data.remainingPercentage === undefined || !data.percentage) return true;
			return data.percentage <= data.remainingPercentage;
		},
		(data) => ({
			message: `Percentage cannot exceed the remaining available percentage (${data.remainingPercentage}%)`,
			path: ['percentage']
		})
	);

// Type exports
export type CreateIpcrFunctionSchema = typeof createIpcrFunctionSchema;
export type UpdateIpcrFunctionSchema = typeof updateIpcrFunctionSchema;
