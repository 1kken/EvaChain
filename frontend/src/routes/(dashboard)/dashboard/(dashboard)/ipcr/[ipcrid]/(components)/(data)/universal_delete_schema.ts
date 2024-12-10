import { z } from 'zod';

export const universalDeleteSchema = z
	.object({
		id: z.string(),
		confirmText: z.string().min(1, 'Please fill in the necessary field'),
		expectedText: z.string()
	})
	.refine((data) => data.confirmText === data.expectedText, {
		message: "The confirm text doesn't match",
		path: ['confirmText']
	});

export type UniversalDeleteSchema = typeof universalDeleteSchema;
export type UniversalDeleteInput = z.infer<typeof universalDeleteSchema>;
