import { z } from 'zod';

const percentageRegex = /^-?\d+(\.\d+)?%$/;
const numberRegex = /^-?\d+(\.\d+)?$/;
const ratioRegex = /^\d+(\.\d+)?:\d+(\.\d+)?$/;

// Sub-schema for yearly plans
const yearlyPlanSchema = z.object({
	year: z.number().int().min(new Date().getFullYear(), 'Year cannot be less than current year'),
	target: z.string().min(1, 'Target is required'),
	budget: z.number().min(0, 'Budget must be a non-negative number')
});

// Sub-schema for SDG alignments
const sdgAlignmentSchema = z.object({
	strat_plan_objective_id: z.string().uuid('Invalid Strategic Plan Objective ID format')
});

export const createStrategyPlanPerformanceIndicatorSchema = z
	.object({
		strategy_plan_id: z.string().uuid('Invalid Strategy Plan ID format'),
		performance_indicator: z.string().min(1, 'Performance indicator is required'),
		input_type: z.enum(['percentage', 'number', 'ratio', 'text']),
		base_target: z.string().min(1, 'Base target is required'),
		actual_target: z.string().min(1, 'Actual target is required'),
		concerned_offices: z.string(),
		remarks: z.string(),
		position: z.number().int().min(0, 'Position must be a non-negative number'),
		yearly_plans: z.array(yearlyPlanSchema),
		sdg_alignments: z.array(sdgAlignmentSchema).min(1, 'At least one SDG alignment is required')
	})
	.superRefine((data, ctx) => {
		const fieldsToValidate = [
			'base_target',
			'actual_target',
			...data.yearly_plans.map((_, idx) => `yearly_plans.${idx}.target`)
		];

		if (data.input_type === 'percentage') {
			fieldsToValidate.forEach((field) => {
				const value = field.includes('.')
					? field.split('.').reduce((obj: any, key) => obj?.[key], data)
					: (data as any)[field];

				if (value !== undefined && value !== null && !percentageRegex.test(value)) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: `Must be in percentage format (e.g., 50% or -50.5%)`,
						path: field.split('.')
					});
				}
			});
		}

		if (data.input_type === 'number') {
			fieldsToValidate.forEach((field) => {
				const value = field.includes('.')
					? field.split('.').reduce((obj: any, key) => obj?.[key], data)
					: (data as any)[field];

				if (value !== undefined && value !== null && !numberRegex.test(value)) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: `Must be a valid number (e.g., 123 or -123.45)`,
						path: field.split('.')
					});
				}
			});
		}

		if (data.input_type === 'ratio') {
			fieldsToValidate.forEach((field) => {
				const value = field.includes('.')
					? field.split('.').reduce((obj: any, key) => obj?.[key], data)
					: (data as any)[field];

				if (value !== undefined && value !== null && !ratioRegex.test(value)) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: `Must be in ratio format (e.g., 16:9 or 1.5:2.5)`,
						path: field.split('.')
					});
				}
			});
		}
	});

export const updateStrategyPlanPerformanceIndicatorSchema = z
	.object({
		id: z.string().uuid('Invalid Performance Indicator ID format'),
		performance_indicator: z.string().min(1, 'Performance indicator is required'),
		input_type: z.enum(['percentage', 'number', 'ratio', 'text']).optional(),
		base_target: z.string().min(1, 'Base target is required').optional(),
		actual_target: z.string().min(1, 'Actual target is required').optional(),
		concerned_offices: z.string().optional().nullable(),
		remarks: z.string().optional().nullable(),
		yearly_plans: z.array(yearlyPlanSchema).optional(),
		sdg_alignments: z
			.array(sdgAlignmentSchema)
			.min(1, 'At least one SDG alignment is required')
			.optional()
	})
	.refine((data) => Object.keys(data).length > 1, {
		message: 'At least one field must be provided for update besides id'
	})
	.superRefine((data, ctx) => {
		if (!data.input_type) return;

		const fieldsToValidate = [
			'base_target',
			'actual_target',
			...(data.yearly_plans?.map((_, idx) => `yearly_plans.${idx}.target`) || [])
		];

		if (data.input_type === 'percentage') {
			fieldsToValidate.forEach((field) => {
				const value = field.includes('.')
					? field.split('.').reduce((obj: any, key) => obj?.[key], data)
					: (data as any)[field];

				if (value !== undefined && value !== null && !percentageRegex.test(value)) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: `Must be in percentage format (e.g., 50% or -50.5%)`,
						path: field.split('.')
					});
				}
			});
		}

		if (data.input_type === 'number') {
			fieldsToValidate.forEach((field) => {
				const value = field.includes('.')
					? field.split('.').reduce((obj: any, key) => obj?.[key], data)
					: (data as any)[field];

				if (value !== undefined && value !== null && !numberRegex.test(value)) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: `Must be a valid number (e.g., 123 or -123.45)`,
						path: field.split('.')
					});
				}
			});
		}

		if (data.input_type === 'ratio') {
			fieldsToValidate.forEach((field) => {
				const value = field.includes('.')
					? field.split('.').reduce((obj: any, key) => obj?.[key], data)
					: (data as any)[field];

				if (value !== undefined && value !== null && !ratioRegex.test(value)) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: `Must be in ratio format (e.g., 16:9 or 1.5:2.5)`,
						path: field.split('.')
					});
				}
			});
		}
	});

export type CreateStrategyPlanPerformanceIndicatorSchema =
	typeof createStrategyPlanPerformanceIndicatorSchema;
export type UpdateStrategyPlanPerformanceIndicatorSchema =
	typeof updateStrategyPlanPerformanceIndicatorSchema;
