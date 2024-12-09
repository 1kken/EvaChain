import { z } from 'zod';

export const universalDeleteSchema = z
	.object({
		id: z.string(),
		confirmText: z.string().min(1, 'Please fill in the necessary field'),
		owner_id: z.string(),
		expectedText: z.string()
	})
	.refine((data) => data.confirmText === data.expectedText, {
		message: "The title doesn't match",
		path: ['confirmTitle']
	});

export type UniversalDeleteSchema = typeof universalDeleteSchema;
export type UniversalDeleteInput = z.infer<typeof universalDeleteSchema>;
