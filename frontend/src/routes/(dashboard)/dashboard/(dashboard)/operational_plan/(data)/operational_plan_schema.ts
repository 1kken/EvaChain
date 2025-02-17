import { z } from 'zod';

// Schema for creating a new operational plan
export const createOperationalPlanSchema = z.object({
	title: z.string().min(1, 'Title is required').max(500, 'Title must be less than 500 characters'),
	implementing_unit: z
		.string()
		.min(1, 'Implementing unit is required')
		.max(500, 'Implementing unit must be less than 500 characters'),
	approve_by: z
		.string()
		.min(1, 'Approver name is required')
		.max(255, 'Approver name must be less than 255 characters'),
	approver_position: z
		.string()
		.min(1, 'Approver position is required')
		.max(255, 'Approver position must be less than 255 characters'),
	review_by: z
		.string()
		.min(1, 'Reviewer name is required')
		.max(255, 'Reviewer name must be less than 255 characters'),
	reviewer_position: z
		.string()
		.min(1, 'Reviewer position is required')
		.max(255, 'Reviewer position must be less than 255 characters')
});

// Schema for updating an operational plan
export const updateOperationalPlanSchema = z
	.object({
		id: z.string().uuid('Invalid Operational Plan ID format'),
		title: z
			.string()
			.min(1, 'Title is required')
			.max(500, 'Title must be less than 500 characters'),
		implementing_unit: z
			.string()
			.min(1, 'Implementing unit is required')
			.max(500, 'Implementing unit must be less than 500 characters'),
		approve_by: z
			.string()
			.min(1, 'Approver name is required')
			.max(255, 'Approver name must be less than 255 characters'),
		approver_position: z
			.string()
			.min(1, 'Approver position is required')
			.max(255, 'Approver position must be less than 255 characters'),
		review_by: z
			.string()
			.min(1, 'Reviewer name is required')
			.max(255, 'Reviewer name must be less than 255 characters'),
		reviewer_position: z
			.string()
			.min(1, 'Reviewer position is required')
			.max(255, 'Reviewer position must be less than 255 characters')
	})
	.refine((data) => Object.keys(data).length > 1, {
		message: 'At least one field must be provided for update besides id'
	});

export const submitOPschema = z.object({
	operationalPlanID: z.string().uuid()
});

export type SubmitOPSchema = typeof submitOPschema;
export type CreateOperationalPlanSchema = typeof createOperationalPlanSchema;
export type UpdateOperationalPlanSchema = typeof updateOperationalPlanSchema;
export type UpdateOperationalPlanInput = z.infer<UpdateOperationalPlanSchema>;
