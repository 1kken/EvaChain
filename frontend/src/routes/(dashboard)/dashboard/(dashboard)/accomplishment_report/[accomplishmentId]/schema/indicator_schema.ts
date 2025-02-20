import { z } from 'zod';

// Utility regex patterns
const percentageRegex = /^-?\d+(\.\d+)?%$/;
const numberRegex = /^-?\d+(\.\d+)?$/;
const ratioRegex = /^\d+(\.\d+)?:\d+(\.\d+)?$/;

// Fields that need validation for indicator
const fieldsToValidate = [
	'annual_target',
	'q1_accomplishment',
	'q2_accomplishment',
	'q3_accomplishment',
	'q4_accomplishment',
	'total',
	'accomplishment_rate'
] as const;

export const createAccomplishmentActivityIndicatorSchema = z
	.object({
		accomplishment_activity_id: z.string().uuid('Invalid Activity ID format'),
		input_type: z.enum(['percentage', 'number', 'ratio', 'text']),
		performance_indicator: z.string().min(1, 'Performance indicator is required'),
		annual_target: z.string().min(1, 'Annual target is required'),
		q1_accomplishment: z.string().nullable(),
		q2_accomplishment: z.string().nullable(),
		q3_accomplishment: z.string().nullable(),
		q4_accomplishment: z.string().nullable(),
		total: z.string().nullable(),
		accomplishment_rate: z.string().nullable(),
		responsible_officer_unit: z.string().min(1, 'Responsible officer/unit is required'),
		remarks: z.string().min(1, 'Remarks is required'),
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

export const updateAccomplishmentActivityIndicatorSchema = z
	.object({
		id: z.string().uuid('Invalid Indicator ID format'),
		input_type: z.enum(['percentage', 'number', 'ratio', 'text']).optional(),
		performance_indicator: z.string().min(1, 'Performance indicator is required').optional(),
		annual_target: z.string().min(1, 'Annual target is required').optional(),
		q1_accomplishment: z.string().nullish(),
		q2_accomplishment: z.string().nullish(),
		q3_accomplishment: z.string().nullish(),
		q4_accomplishment: z.string().nullish(),
		total: z.string().nullish(),
		accomplishment_rate: z.string().nullish(),
		responsible_officer_unit: z.string().min(1, 'Responsible officer/unit is required').optional(),
		remarks: z.string().nullish(),
		position: z.number().int().positive('Position must be a positive integer').optional()
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

export type CreateAccomplishmentActivityIndicatorSchema =
	typeof createAccomplishmentActivityIndicatorSchema;
export type UpdateAccomplishmentActivityIndicatorSchema =
	typeof updateAccomplishmentActivityIndicatorSchema;
