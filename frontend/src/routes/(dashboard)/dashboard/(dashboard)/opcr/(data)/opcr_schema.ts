import { z } from 'zod';

// Schema for creating a new OPCR
export const createOpcrSchema = z.object({
	title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
	review_by: z
		.string()
		.min(1, 'Review by is required')
		.max(255, 'Review by must be less than 255 characters'),
	reviewer_position: z
		.string()
		.min(1, 'Reviewer position is required')
		.max(255, 'Reviewer position must be less than 255 characters'),
	administrative_officer: z
		.string()
		.min(1, 'Administrative officer is required')
		.max(255, 'Administrative officer must be less than 255 characters'),
	planning_officer: z
		.string()
		.min(1, 'Planning officer is required')
		.max(255, 'Planning officer must be less than 255 characters'),
	human_resource: z
		.string()
		.min(1, 'Human resource is required')
		.max(255, 'Human resource must be less than 255 characters')
});

// Schema for updating an OPCR
export const updateOpcrSchema = z
	.object({
		id: z.string().uuid('Invalid OPCR ID format'),
		title: z
			.string()
			.min(1, 'Title is required')
			.max(255, 'Title must be less than 255 characters')
			.optional(),
		review_by: z
			.string()
			.min(1, 'Review by is required')
			.max(255, 'Review by must be less than 255 characters')
			.optional(),
		reviewer_position: z
			.string()
			.min(1, 'Reviewer position is required')
			.max(255, 'Reviewer position must be less than 255 characters'),
		administrative_officer: z
			.string()
			.min(1, 'Administrative officer is required')
			.max(255, 'Administrative officer must be less than 255 characters')
			.optional(),
		planning_officer: z
			.string()
			.min(1, 'Planning officer is required')
			.max(255, 'Planning officer must be less than 255 characters')
			.optional(),
		human_resource: z
			.string()
			.min(1, 'Human resource is required')
			.max(255, 'Human resource must be less than 255 characters')
			.optional()
	})
	.refine((data) => Object.keys(data).length > 1, {
		message: 'At least one field must be provided for update besides id'
	});

export type CreateOpcrSchema = typeof createOpcrSchema;
export type UpdateOpcrSchema = typeof updateOpcrSchema;

export type CreateOpcrInput = z.infer<CreateOpcrSchema>;
export type UpdateOpcrInput = z.infer<UpdateOpcrSchema>;
