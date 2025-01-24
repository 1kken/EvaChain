import { updated } from '$app/stores';
import { z } from 'zod';

// Schema for creating a new DPCR
export const createDpcrSchema = z.object({
	title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
	review_by: z
		.string()
		.min(1, 'Reviewer name is required')
		.max(255, 'Reviewer name must be less than 255 characters'),
	reviewer_position: z
		.string()
		.min(1, 'Reviewer position is required')
		.max(255, 'Reviewer position must be less than 255 characters'),
	assessors: z.array(
		z.object({
			name: z.string().min(1, 'Assessor name is required').max(255),
			position: z.string().min(1, 'Assessor position is required').max(255),
			sequence: z.number().int().min(0)
		})
	)
});

// Schema for updating a DPCR
export const updateDpcrSchema = z
	.object({
		id: z.string().uuid('Invalid DPCR ID format'),
		title: z
			.string()
			.min(1, 'Title is required')
			.max(255, 'Title must be less than 255 characters')
			.optional(),
		review_by: z
			.string()
			.min(1, 'Reviewer name is required')
			.max(255, 'Reviewer name must be less than 255 characters')
			.optional(),
		reviewer_position: z
			.string()
			.min(1, 'Reviewer position is required')
			.max(255, 'Reviewer position must be less than 255 characters')
			.optional(),
		assessors: z.array(
			z.object({
				id: z.string().uuid('Invalid Assessor ID format'),
				dpcr_id: z.string().uuid('Invalid DPCR ID format'),
				created_at: z.string().min(1),
				updated_at: z.string().min(1),
				name: z.string().min(1, 'Assessor name is required').max(255),
				position: z.string().min(1, 'Assessor position is required').max(255),
				sequence: z.number().int().min(0)
			})
		)
	})
	.refine((data) => Object.keys(data).length > 1, {
		message: 'At least one field must be provided for update besides id'
	});

export type CreateDpcrSchema = typeof createDpcrSchema;
export type UpdateDpcrSchema = typeof updateDpcrSchema;

export type CreateDpcrInput = z.infer<CreateDpcrSchema>;
export type UpdateDpcrInput = z.infer<UpdateDpcrSchema>;
