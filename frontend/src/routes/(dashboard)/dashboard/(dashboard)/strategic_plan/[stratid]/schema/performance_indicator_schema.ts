import { z } from 'zod';

// Sub-schema for yearly plan
const yearlyPlanSchema = z.object({
	year: z.number().int().min(new Date().getFullYear(), 'Year cannot be less than current year'),
	target: z.string().min(1, 'Target is required'),
	budget: z.string().min(1, 'Budget is required')
});

// Sub-schema for SDG alignments
const sdgAlignmentSchema = z.object({
	strat_plan_objective_id: z.string().uuid('Invalid Strategic Plan Objective ID format')
});

export const createStrategyPlanPerformanceIndicatorSchema = z.object({
	strategy_plan_id: z.string().uuid('Invalid Strategy Plan ID format'),
	performance_indicator: z.string().min(1, 'Performance indicator is required'),
	base_target: z.string().min(1, 'Base target is required'),
	actual_target: z.string().min(1, 'Actual target is required'),
	concerned_offices: z.string().nullable(),
	remarks: z.string().nullable(),
	position: z.number().int().min(0, 'Position must be a non-negative number'),
	yearly_plans: z.array(yearlyPlanSchema),
	sdg_alignments: z.array(sdgAlignmentSchema)
});

export const updateStrategyPlanPerformanceIndicatorSchema = z
	.object({
		id: z.string().uuid('Invalid Performance Indicator ID format'),
		strategy_plan_id: z.string().uuid('Invalid Strategy Plan ID format').optional(),
		performance_indicator: z.string().min(1, 'Performance indicator is required').optional(),
		base_target: z.string().min(1, 'Base target is required').optional(),
		actual_target: z.string().min(1, 'Actual target is required').optional(),
		concerned_offices: z.string().nullable().optional(),
		remarks: z.string().nullable().optional(),
		position: z.number().int().min(0, 'Position must be a non-negative number').optional(),
		yearly_plans: z.array(yearlyPlanSchema).optional(),
		sdg_alignments: z.array(sdgAlignmentSchema).optional()
	})
	.refine((data) => Object.keys(data).length > 1, {
		message: 'At least one field must be provided for update besides id'
	});

export type CreateStrategyPlanPerformanceIndicatorSchema =
	typeof createStrategyPlanPerformanceIndicatorSchema;
export type UpdateStrategyPlanPerformanceIndicatorSchema =
	typeof updateStrategyPlanPerformanceIndicatorSchema;
