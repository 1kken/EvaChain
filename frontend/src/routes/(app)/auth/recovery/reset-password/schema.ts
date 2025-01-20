import { z } from 'zod';

export const passwordRecoverySchema = z
	.object({
		password: z
			.string()
			.min(8, 'Password must be at least 8 characters')
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
				'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
			),
		passwordConfirm: z.string().min(8, 'Password confirmation must be at least 8 characters')
	})
	.refine((data) => data.password === data.passwordConfirm, {
		message: "Passwords don't match",
		path: ['passwordConfirm'] // This shows the error on the confirm field
	});

export type PasswordRecoverySchema = typeof passwordRecoverySchema;
