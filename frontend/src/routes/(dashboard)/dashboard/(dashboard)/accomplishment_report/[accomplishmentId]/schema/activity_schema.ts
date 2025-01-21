import { z } from 'zod';

const percentageRegex = /^-?\d+(\.\d+)?%$/;
const numberRegex = /^-?\d+(\.\d+)?$/;
const ratioRegex = /^\d+(\.\d+)?:\d+(\.\d+)?$/;

// Fields that need validation
const fieldsToValidate = [
	'annual_target',
	'q1_accomplishment',
	'q2_accomplishment',
	'q3_accomplishment',
	'q4_accomplishment',
	'accomplishment_rate'
] as const;

// Schema for creating a new accomplishment activity
export const createAccomplishmentActivitySchema = z
	.object({
		accomplishment_annual_plan_id: z.string().uuid('Invalid Annual Plan ID format'),
		activity: z.string().min(1, 'Activity description is required'),
		input_type: z.enum(['percentage', 'number', 'ratio', 'text']),
		performance_indicator: z.string().min(1, 'Performance indicator is required'),
		annual_target: z.string().min(1, 'Annual target is required'),
		q1_accomplishment: z.string().nullable(),
		q2_accomplishment: z.string().nullable(),
		q3_accomplishment: z.string().nullable(),
		q4_accomplishment: z.string().nullable(),
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

// Schema for updating an accomplishment activity
export const updateAccomplishmentActivitySchema = z
	.object({
		id: z.string().uuid('Invalid Activity ID format'),
		activity: z.string().min(1, 'Activity description is required').optional(),
		input_type: z.enum(['percentage', 'number', 'ratio', 'text']).optional(),
		performance_indicator: z.string().min(1, 'Performance indicator is required').optional(),
		annual_target: z.string().min(1, 'Annual target is required').optional(),
		q1_accomplishment: z.string().nullable().optional(),
		q2_accomplishment: z.string().nullable().optional(),
		q3_accomplishment: z.string().nullable().optional(),
		q4_accomplishment: z.string().nullable().optional(),
		accomplishment_rate: z.string().nullable().optional(),
		responsible_officer_unit: z.string().min(1, 'Responsible officer/unit is required').optional(),
		remarks: z.string().min(1, 'Remarks is required').optional()
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

// Type definitions for TypeScript
export type CreateAccomplishmentActivitySchema = typeof createAccomplishmentActivitySchema;
export type UpdateAccomplishmentActivitySchema = typeof updateAccomplishmentActivitySchema;
