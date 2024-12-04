import { z } from 'zod';
export const logInSchema = z.object({
	email: z
		.string()
		.email()
		.regex(/^[a-zA-Z0-9._%+-]+@dmmmsu\.edu\.ph$/, 'Only dmmmsu.edu.ph email is allowed'),
	password: z.string().min(6)
});

export const signupSchema = z
	.object({
		firstName: z
			.string()
			.regex(/^[A-Za-z\s]+$/)
			.transform((s) => s.trim())
			.refine(
				(s) => s.length >= 3,
				'First name must contain at least 3 letters and can include spaces'
			),
		lastName: z
			.string()
			.regex(/^[A-Za-z\s]+$/)
			.transform((s) => s.trim())
			.refine(
				(s) => s.length >= 3,
				'Last name must contain at least 3 letters and can include spaces'
			),
		email: z
			.string()
			.email()
			.regex(/^[a-zA-Z0-9._%+-]+@dmmmsu\.edu\.ph$/, 'Only dmmmsu.edu.ph email is allowed'),
		password: z.string().min(6),
		passwordRepeat: z.string().min(6),
		agree: z.literal(true, {
			errorMap: () => ({ message: 'You must agree to the terms and conditions' })
		})
	})
	.refine((data) => data.password === data.passwordRepeat, {
		message: "Passwords don't match",
		path: ['passwordRepeat']
	});

export type LogInSchema = typeof logInSchema;
export type LogInSchemaInferred = z.infer<typeof logInSchema>;

export type SignupSchema = typeof signupSchema;
export type SignupSchemaInferred = z.infer<typeof signupSchema>;
