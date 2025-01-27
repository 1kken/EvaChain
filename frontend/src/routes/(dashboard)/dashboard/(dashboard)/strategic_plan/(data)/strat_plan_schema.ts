import { z } from 'zod';

const majorOutputEnum = z.enum([
	'instruction',
	'research',
	'extension',
	'governance_and_management'
]);

// Schema for creating a new Strategic Plan
export const createStrategicPlanSchema = z.object({
	title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
	major_output: majorOutputEnum,
	goal: z.string().min(1, 'Goal is required'),
	objectives: z.array(
		z.object({
			objective: z.string().min(1, 'Objective is required'),
			position: z.number().int().min(0)
		})
	)
});

// Schema for updating a Strategic Plan
export const updateStrategicPlanSchema = z
	.object({
		id: z.string().uuid('Invalid Strategic Plan ID format'),
		title: z
			.string()
			.min(1, 'Title is required')
			.max(255, 'Title must be less than 255 characters')
			.optional(),
		major_output: majorOutputEnum.optional(),
		goal: z.string().min(1, 'Goal is required').optional(),
		objectives: z
			.array(
				z.object({
					id: z.string().uuid('Invalid Objective ID format'),
					strategic_plan_id: z.string().uuid('Invalid Strategic Plan ID format'),
					objective: z.string().min(1, 'Objective is required'),
					position: z.number().int().min(0),
					created_at: z.string().min(1),
					updated_at: z.string().min(1)
				})
			)
			.optional()
	})
	.refine((data) => Object.keys(data).length > 1, {
		message: 'At least one field must be provided for update besides id'
	});
export type CreateStratPlanSchema = typeof createStrategicPlanSchema;
export type UpdateStratPlanSchema = typeof updateStrategicPlanSchema;

export type CreateStratPlanInput = z.infer<CreateStratPlanSchema>;
export type UpdateStratPlanInput = z.infer<UpdateStratPlanSchema>;
