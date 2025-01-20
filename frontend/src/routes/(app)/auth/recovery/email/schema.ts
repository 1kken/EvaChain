import { z } from 'zod';

export const emailSchema = z.object({
	email: z
		.string({
			required_error: 'Email is required',
			invalid_type_error: 'Email must be a string'
		})
		.email('Please enter a valid email address')
		.min(5, 'Email must be at least 5 characters')
		.trim()
		.toLowerCase()
});

export type EmailSchema = typeof emailSchema;
