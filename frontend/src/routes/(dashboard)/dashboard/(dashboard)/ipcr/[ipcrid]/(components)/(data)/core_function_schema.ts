import { z } from 'zod';

// Schema for creating a new core function
export const createCoreFunctionSchema = z.object({
	name: z.string().min(1, 'Name is required').max(1000, 'Name must be less than 1000 characters'),

	ipcr_teaching_id: z.string().uuid('Invalid IPCR Teaching ID format'),

	unit: z.number().min(1, 'Unit must be greater than zero'),

	reviewer_id: z.string().uuid('Invalid User')
});

export const deleteCoreFunctionSchema = z
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

export type DeleteCoreFunctionSchema = typeof deleteCoreFunctionSchema;

export type DeleteCoreFunctionInput = z.infer<typeof deleteCoreFunctionSchema>;
// Export types
export type CreateCoreFunctionSchema = typeof createCoreFunctionSchema;
export type CreateCoreFunctionInput = z.infer<typeof createCoreFunctionSchema>;
