import { z } from 'zod';

// Schema for creating a new sub core function
export const createSubCoreFunctionSchema = z.object({
	name: z.string().min(1, 'Name is required').max(1000, 'Name must be less than 1000 characters'),
	core_function_id: z.string().uuid('Invalid Core Function ID format')
});

// Schema for updating a sub core function
export const updateSubCoreFunctionSchema = z
	.object({
		id: z.string(),
		name: z
			.string()
			.min(1, 'Name is required')
			.max(1000, 'Name must be less than 1000 characters')
			.optional()
	})
	.refine((data) => Object.keys(data).length > 1, {
		message: 'At least one field must be provided for update'
	});

// Schema for deleting a sub core function
export const deleteSubCoreFunctionSchema = z
	.object({
		id: z.string(),
		confirmTitle: z.string().min(1, 'Please fill in the necessary field'),
		owner_id: z.string(),
		expectedTitle: z.string()
	})
	.refine((data) => data.confirmTitle === data.expectedTitle, {
		message: "The title doesn't match",
		path: ['confirmTitle']
	});

// Export types
export type DeleteSubCoreFunctionSchema = typeof deleteSubCoreFunctionSchema;
export type DeleteSubCoreFunctionInput = z.infer<typeof deleteSubCoreFunctionSchema>;
export type CreateSubCoreFunctionSchema = typeof createSubCoreFunctionSchema;
export type CreateSubCoreFunctionInput = z.infer<typeof createSubCoreFunctionSchema>;
export type UpdateSubCoreFunctionSchema = typeof updateSubCoreFunctionSchema;
export type UpdateSubCoreFunctionInput = z.infer<typeof updateSubCoreFunctionSchema>;
