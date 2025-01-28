import { z } from 'zod';

const majorOutputEnum = z.enum([
	'instruction',
	'research',
	'extension',
	'governance_and_management'
]);

export const createStrategicPlanSchema = z
	.object({
		title: z
			.string()
			.min(1, 'Title is required')
			.max(255, 'Title must be less than 255 characters'),
		major_output: majorOutputEnum,
		goal: z.string().min(1, 'Goal is required'),
		start_year: z
			.number()
			.int()
			.min(new Date().getFullYear(), 'Start year cannot be less than current year'),
		end_year: z
			.number()
			.int()
			.min(new Date().getFullYear(), 'End year cannot be less than current year'),
		objectives: z.array(
			z.object({
				objective: z.string().min(1, 'Objective is required'),
				position: z.number().int().min(0)
			})
		)
	})
	.refine((data) => data.end_year >= data.start_year, {
		message: 'End year must be greater than or equal to start year',
		path: ['end_year'] // This shows the error on the end_year field
	});

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
		start_year: z
			.number()
			.int()
			.min(new Date().getFullYear(), 'Start year cannot be less than current year')
			.optional(),
		end_year: z
			.number()
			.int()
			.min(new Date().getFullYear(), 'End year cannot be less than current year')
			.optional(),
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
	})
	.refine(
		(data) => {
			// Only validate if both years are provided
			if (data.start_year && data.end_year) {
				return data.end_year >= data.start_year;
			}
			return true;
		},
		{
			message: 'End year must be greater than or equal to start year',
			path: ['end_year']
		}
	);

export type CreateStratPlanSchema = typeof createStrategicPlanSchema;
export type UpdateStratPlanSchema = typeof updateStrategicPlanSchema;

export type CreateStratPlanInput = z.infer<CreateStratPlanSchema>;
export type UpdateStratPlanInput = z.infer<UpdateStratPlanSchema>;
