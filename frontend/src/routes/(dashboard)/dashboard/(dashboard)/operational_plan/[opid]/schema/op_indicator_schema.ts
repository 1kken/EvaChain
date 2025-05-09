import { z } from 'zod';

const percentageRegex = /^-?\d+(\.\d+)?%$/;
const numberRegex = /^-?\d+(\.\d+)?$/;
const ratioRegex = /^\d+(\.\d+)?:\d+(\.\d+)?$/;

// Fields that need validation based on input_type
const fieldsToValidate = [
	'former_state',
	'q1_target',
	'q2_target',
	'q3_target',
	'q4_target',
	'total'
] as const;

// Schema for creating a new operational activity indicator
export const createOpActivityIndicatorSchema = z
	.object({
		op_activity_id: z.string().uuid('Invalid Activity ID format'),
		input_type: z.enum(['percentage', 'number', 'ratio', 'text']),
		performance_indicator: z.string().min(1, 'Performance indicator is required'),
		former_state: z.string().min(1, 'Former state is required'),
		q1_target: z.string().nullable(),
		q2_target: z.string().nullable(),
		q3_target: z.string().nullable(),
		q4_target: z.string().nullable(),
		total: z.string().nullable(),
		responsible_officer_unit: z.string(),
		total_budgetary_requirements: z
			.string()
			.regex(
				/^(\d{1,3})(,\d{3})*(\.\d{1,2})?$/,
				'Must be a valid currency format (e.g., 1,000.00)'
			),
		remarks: z.string().nullable(),
		position: z.number().int().positive('Position must be a positive integer')
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

// Schema for updating an operational activity indicator
export const updateOpActivityIndicatorSchema = z
	.object({
		id: z.string().uuid('Invalid Indicator ID format'),
		input_type: z.enum(['percentage', 'number', 'ratio', 'text']),
		performance_indicator: z.string().min(1, 'Performance indicator is required').optional(),
		former_state: z.string().min(1, 'Former state is required').optional(),
		q1_target: z.string().nullable(),
		q2_target: z.string().nullable(),
		q3_target: z.string().nullable(),
		q4_target: z.string().nullable(),
		total: z.string().nullable(),
		responsible_officer_unit: z.string().optional(),
		total_budgetary_requirements: z
			.string()
			.regex(/^(\d{1,3})(,\d{3})*(\.\d{1,2})?$/, 'Must be a valid currency format (e.g., 1,000.00)')
			.optional(),
		remarks: z.string().nullable().optional()
	})
	.refine((data) => Object.keys(data).length > 1, {
		message: 'At least one field must be provided for update besides id'
	})
	.superRefine((data, ctx) => {
		if (data.input_type === 'percentage') {
			fieldsToValidate.forEach((field) => {
				const value = data[field as keyof typeof data];
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
				const value = data[field as keyof typeof data];
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
				const value = data[field as keyof typeof data];
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

// Type definitions
export type CreateOpActivityIndicatorSchema = typeof createOpActivityIndicatorSchema;
export type UpdateOpActivityIndicatorSchema = typeof updateOpActivityIndicatorSchema;

// Infer types from schemas
export type CreateOpActivityIndicator = z.infer<typeof createOpActivityIndicatorSchema>;
export type UpdateOpActivityIndicator = z.infer<typeof updateOpActivityIndicatorSchema>;
