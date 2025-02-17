import { z } from 'zod';

// Schema for creating a new operational activity
export const createOpActivitySchema = z.object({
	op_annual_plan_id: z.string().uuid('Invalid Annual Plan ID format'),
	activity: z.string().min(1, 'Activity description is required'),
	position: z.number().int().positive('Position must be a positive integer')
});

// Schema for updating an operational activity
export const updateOpActivitySchema = z
	.object({
		id: z.string().uuid('Invalid Activity ID format'),
		activity: z.string().min(1, 'Activity description is required').optional()
	})
	.refine((data) => Object.keys(data).length > 1, {
		message: 'At least one field must be provided for update besides id'
	});

// Type definitions
export type CreateOpActivitySchema = typeof createOpActivitySchema;
export type UpdateOpActivitySchema = typeof updateOpActivitySchema;

// Infer types from schemas
export type CreateOpActivity = z.infer<typeof createOpActivitySchema>;
export type UpdateOpActivity = z.infer<typeof updateOpActivitySchema>;
