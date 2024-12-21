import { z } from 'zod';

// Schema for creating a new activity
export const createOpActivitySchema = z.object({
	op_objective_id: z.string().uuid('Invalid Objective ID format'),
	activity: z.string().min(1, 'Activity description is required'),
	indicator: z.string().min(1, 'Indicator is required'),
	former_state: z.string().min(1, 'Former state is required'),
	desired_state: z.string().min(1, 'Desired state is required'),
	q1: z.boolean(),
	q2: z.boolean(),
	q3: z.boolean(),
	q4: z.boolean(),
	item: z.string().optional().nullable(),
	qty: z.string().optional().nullable(),
	unit: z.string().optional().nullable(),
	unit_cost: z.string().optional().nullable(),
	amount: z.string().optional().nullable(),
	fund_source: z.string().optional().nullable(),
	entity_responsible: z.string().min(1, 'Entity responsible is required'),
	position: z.number().int().positive('Position must be a positive integer')
});

// Schema for updating an activity
export const updateOpActivitySchema = z
	.object({
		id: z.string().uuid('Invalid Activity ID format'),
		activity: z.string().min(1, 'Activity description is required').optional(),
		indicator: z.string().min(1, 'Indicator is required').optional(),
		former_state: z.string().min(1, 'Former state is required').optional(),
		desired_state: z.string().min(1, 'Desired state is required').optional(),
		q1: z.boolean().optional(),
		q2: z.boolean().optional(),
		q3: z.boolean().optional(),
		q4: z.boolean().optional(),
		item: z.string().optional().nullable(),
		qty: z.string().optional().nullable(),
		unit: z.string().optional().nullable(),
		unit_cost: z.string().optional().nullable(),
		amount: z.string().optional().nullable(),
		fund_source: z.string().optional().nullable(),
		entity_responsible: z.string().min(1, 'Entity responsible is required').optional()
	})
	.refine((data) => Object.keys(data).length > 1, {
		message: 'At least one field must be provided for update besides id'
	});

// Type definitions
export type CreateOpActivitySchema = typeof createOpActivitySchema;
export type UpdateOpActivitySchema = typeof updateOpActivitySchema;
