import { z } from 'zod';

const percentageRegex = /^-?\d+(\.\d+)?%$/;
const numberRegex = /^-?\d+(\.\d+)?$/;
const ratioRegex = /^\d+(\.\d+)?:\d+(\.\d+)?$/;

// Schema for creating a new accomplishment metric
// Fields that need validation
const fieldsToValidate = [
	'former_state',
	'annual_target',
	'quarter_1_accomplishment',
	'quarter_2_accomplishment',
	'quarter_3_accomplishment',
	'quarter_4_accomplishment',
	'total_accomplishment',
	'variance'
] as const;

// Schema for creating a new accomplishment metric
export const createAccomplishmentMetricSchema = z
	.object({
		accomplishment_program_project_id: z.string().uuid('Invalid Program/Project ID format'),
		metrics: z.string().min(1, 'Metrics description is required'),
		position: z.number().int().positive('Position must be a positive integer'),
		input_type: z.enum(['percentage', 'number', 'ratio', 'text']),
		former_state: z.string().nullable(),
		annual_target: z.string().nullable(),
		quarter_1_accomplishment: z.string().nullable(),
		quarter_2_accomplishment: z.string().nullable(),
		quarter_3_accomplishment: z.string().nullable(),
		quarter_4_accomplishment: z.string().nullable(),
		total_accomplishment: z.string().nullable(),
		variance: z.string().nullable(),
		remarks: z.string().nullable()
	})
	.superRefine((data, ctx) => {
		if (data.input_type === 'percentage') {
			fieldsToValidate.forEach((field) => {
				const value = data[field];
				if (value !== null && !percentageRegex.test(value)) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: `Must be in percentage format (e.g., 50% or -50.5%)`,
						path: [field]
					});
				}
			});
		}

		if (data.input_type === 'number') {
			fieldsToValidate.forEach((field) => {
				const value = data[field];
				if (value !== null && !numberRegex.test(value)) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: `Must be a valid number (e.g., 123 or -123.45)`,
						path: [field]
					});
				}
			});
		}

		if (data.input_type === 'ratio') {
			fieldsToValidate.forEach((field) => {
				const value = data[field];
				if (value !== null && !ratioRegex.test(value)) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: `Must be in ratio format (e.g., 16:9 or 1.5:2.5)`,
						path: [field]
					});
				}
			});
		}
	});

// Schema for updating an accomplishment metric
export const updateAccomplishmentMetricSchema = z
	.object({
		id: z.string().uuid('Invalid Metric ID format'),
		metrics: z.string().min(1, 'Metrics description is required').optional(),
		input_type: z.enum(['percentage', 'number', 'ratio', 'text']).optional(),
		former_state: z.string().nullable().optional(),
		annual_target: z.string().nullable().optional(),
		quarter_1_accomplishment: z.string().nullable().optional(),
		quarter_2_accomplishment: z.string().nullable().optional(),
		quarter_3_accomplishment: z.string().nullable().optional(),
		quarter_4_accomplishment: z.string().nullable().optional(),
		total_accomplishment: z.string().nullable().optional(),
		variance: z.string().nullable().optional(),
		remarks: z.string().nullable().optional()
	})
	.refine((data) => Object.keys(data).length > 1, {
		message: 'At least one field must be provided for update besides id'
	})
	.superRefine((data, ctx) => {
		if (data.input_type === 'percentage') {
			fieldsToValidate.forEach((field) => {
				const value = data[field];
				if (value !== undefined && value !== null && !percentageRegex.test(value)) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: `Must be in percentage format (e.g., 50% or -50.5%)`,
						path: [field]
					});
				}
			});
		}

		if (data.input_type === 'number') {
			fieldsToValidate.forEach((field) => {
				const value = data[field];
				if (value !== undefined && value !== null && !numberRegex.test(value)) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: `Must be a valid number (e.g., 123 or -123.45)`,
						path: [field]
					});
				}
			});
		}

		if (data.input_type === 'ratio') {
			fieldsToValidate.forEach((field) => {
				const value = data[field];
				if (value !== undefined && value !== null && !ratioRegex.test(value)) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: `Must be in ratio format (e.g., 16:9 or 1.5:2.5)`,
						path: [field]
					});
				}
			});
		}
	});

export const toggleIsIncludeMetricsSchema = z.object({
	id: z.string().uuid('Invalid Metric ID format')
});

const fieldsToValidateUsingTemplate = [
	'quarter_1_accomplishment',
	'quarter_2_accomplishment',
	'quarter_3_accomplishment',
	'quarter_4_accomplishment',
	'total_accomplishment',
	'variance'
] as const;

export const updateAccomplishmentMetricWithTemplateSchema = z
	.object({
		id: z.string().uuid('Invalid Metric ID format'),
		input_type: z.enum(['percentage', 'number', 'ratio', 'text']),
		quarter_1_accomplishment: z.string().nullable().optional(),
		quarter_2_accomplishment: z.string().nullable().optional(),
		quarter_3_accomplishment: z.string().nullable().optional(),
		quarter_4_accomplishment: z.string().nullable().optional(),
		total_accomplishment: z.string().nullable().optional(),
		variance: z.string().nullable().optional(),
		remarks: z.string().nullable().optional()
	})
	.refine((data) => Object.keys(data).length > 1, {
		message: 'At least one field must be provided for update besides id'
	})
	.superRefine((data, ctx) => {
		if (data.input_type === 'percentage') {
			fieldsToValidateUsingTemplate.forEach((field) => {
				const value = data[field];
				if (value !== undefined && value !== null && !percentageRegex.test(value)) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: `Must be in percentage format (e.g., 50% or -50.5%)`,
						path: [field]
					});
				}
			});
		}

		if (data.input_type === 'number') {
			fieldsToValidateUsingTemplate.forEach((field) => {
				const value = data[field];
				if (value !== undefined && value !== null && !numberRegex.test(value)) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: `Must be a valid number (e.g., 123 or -123.45)`,
						path: [field]
					});
				}
			});
		}

		if (data.input_type === 'ratio') {
			fieldsToValidateUsingTemplate.forEach((field) => {
				const value = data[field];
				if (value !== undefined && value !== null && !ratioRegex.test(value)) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: `Must be in ratio format (e.g., 16:9 or 1.5:2.5)`,
						path: [field]
					});
				}
			});
		}
	});

export type ToggleIsIncludeMetricsSchema = typeof toggleIsIncludeMetricsSchema;
export type CreateAccomplishmentMetricSchema = typeof createAccomplishmentMetricSchema;
export type UpdateAccomplishmentMetricSchema = typeof updateAccomplishmentMetricSchema;
