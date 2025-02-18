import { z } from 'zod';

const MAX_FILE_SIZE = 45 * 1024 * 1024;
const percentageRegex = /^-?\d+(\.\d+)?%$/;
const numberRegex = /^-?\d+(\.\d+)?$/;
const ratioRegex = /^\d+(\.\d+)?\/\d*[1-9]\d*(\.\d+)?$/;

const fieldsToValidate = ['quantity'];

export const createAccomplishmentSchema = z
	.object({
		ipcr_indicator_id: z.string().uuid('Invalid Indicator ID'),
		actual_accomplishments: z.string().min(10, 'IPCR must have at least 10 characters'),
		accomplishment_date: z.string().datetime({
			message: 'Please provide a valid date'
		}),
		input_type: z.enum(['percentage', 'number', 'ratio', 'text']),
		quantity: z.string().min(1, 'Quantity is required'),
		pdf_evidence: z
			.instanceof(File, { message: 'Please upload a file.' })
			.refine((f) => f.size < MAX_FILE_SIZE, 'Max 45mb upload size.')
	})
	.superRefine((data: { [key: string]: any }, ctx) => {
		if (data.input_type === 'text') return;

		if (data.input_type === 'percentage') {
			fieldsToValidate.forEach((field) => {
				if (!percentageRegex.test(data[field])) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Must be in percentage format (e.g., 50% or -50.5%)',
						path: [field]
					});
				}
			});
		}

		if (data.input_type === 'number') {
			fieldsToValidate.forEach((field) => {
				if (!numberRegex.test(data[field])) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Must be a valid number (e.g., 123 or -123.45)',
						path: [field]
					});
				}
			});
		}

		if (data.input_type === 'ratio') {
			fieldsToValidate.forEach((field) => {
				const value = data[field];
				if (!ratioRegex.test(value)) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Must be in ratio format (e.g., 3/5 or 1.5/2.5)',
						path: [field]
					});
				} else {
					const [numerator, denominator] = value.split('/').map(Number);
					if (denominator === 0) {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: 'Denominator cannot be zero',
							path: [field]
						});
					}
				}
			});
		}
	});

export const updateAccomplishmentSchema = z
	.object({
		id: z.string().uuid('Invalid Accomplishment ID'),
		actual_accomplishments: z.string().min(10, 'IPCR must have at least 10 characters'),
		accomplishment_date: z.string().datetime({
			message: 'Please provide a valid date'
		}),
		input_type: z.enum(['percentage', 'number', 'ratio', 'text']),
		quantity: z.string().min(1, 'Quantity is required'),
		pdf_evidence: z
			.instanceof(File, { message: 'Please upload a file.' })
			.refine((f) => f.size < MAX_FILE_SIZE, 'Max 45mb upload size.')
	})
	.superRefine((data: { [key: string]: any }, ctx) => {
		if (data.input_type === 'percentage') {
			fieldsToValidate.forEach((field) => {
				if (!percentageRegex.test(data[field])) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Must be in percentage format (e.g., 50% or -50.5%)',
						path: [field]
					});
				}
			});
		}

		if (data.input_type === 'number') {
			fieldsToValidate.forEach((field) => {
				if (!numberRegex.test(data[field])) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Must be a valid number (e.g., 123 or -123.45)',
						path: [field]
					});
				}
			});
		}

		if (data.input_type === 'ratio') {
			fieldsToValidate.forEach((field) => {
				const value = data[field];
				if (!ratioRegex.test(value)) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Must be in ratio format (e.g., 3/5 or 1.5/2.5)',
						path: [field]
					});
				} else {
					const [numerator, denominator] = value.split('/').map(Number);
					if (denominator === 0) {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: 'Denominator cannot be zero',
							path: [field]
						});
					}
				}
			});
		}
	});

export type CreateAccomplishmentSchema = typeof createAccomplishmentSchema;
export type UpdateAccomplishmentSchema = typeof updateAccomplishmentSchema;
