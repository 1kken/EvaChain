import { z } from 'zod';

// Schema for creating a new objective
export const createOpObjectiveSchema = z.object({
	op_program_project_id: z.string().uuid('Invalid Program Project ID format'),
	objective: z.string().min(1, 'Objective is required'),
	activity: z.string().min(1, 'Activity is required'),
	indicator: z.string().min(1, 'Indicator is required'),
	former_state: z
		.string()
		.min(1, 'Former state is required')
		.max(255, 'Former state must be less than 255 characters'),
	desired_state: z
		.string()
		.min(1, 'Desired state is required')
		.max(255, 'Desired state must be less than 255 characters'),
	q1: z.boolean().default(false),
	q2: z.boolean().default(false),
	q3: z.boolean().default(false),
	q4: z.boolean().default(false),
	item: z.string().nullable().optional(),
	qty: z.string().nullable().optional(),
	unit: z.string().nullable().optional(),
	unit_cost: z.string().nullable().optional(),
	amount: z.string().nullable().optional(),
	fund_source: z.string().nullable().optional(),
	entity_responsible: z.string().min(1, 'Entity responsible is required'),
	position: z.number().int().positive('Position must be a positive integer')
});

// Schema for updating an objective
export const updateOpObjectiveSchema = z
	.object({
		id: z.string().uuid('Invalid Objective ID format'),
		objective: z.string().min(1, 'Objective is required'),
		activity: z.string().min(1, 'Activity is required'),
		indicator: z.string().min(1, 'Indicator is required'),
		former_state: z
			.string()
			.min(1, 'Former state is required')
			.max(255, 'Former state must be less than 255 characters'),
		desired_state: z
			.string()
			.min(1, 'Desired state is required')
			.max(255, 'Desired state must be less than 255 characters'),
		q1: z.boolean(),
		q2: z.boolean(),
		q3: z.boolean(),
		q4: z.boolean(),
		item: z.string().nullable(),
		qty: z.string().nullable(),
		unit: z.string().nullable(),
		unit_cost: z.string().nullable(),
		amount: z.string().nullable(),
		fund_source: z.string().nullable(),
		entity_responsible: z.string().min(1, 'Entity responsible is required')
	})
	.refine((data) => Object.keys(data).length > 1, {
		message: 'At least one field must be provided for update besides id'
	});

export type CreateOpObjectiveSchema = typeof createOpObjectiveSchema;
export type UpdateOpObjectiveSchema = typeof updateOpObjectiveSchema;
