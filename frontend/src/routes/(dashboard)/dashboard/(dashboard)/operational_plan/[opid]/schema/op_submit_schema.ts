import { z } from 'zod';

export const submitOPschema = z.object({
	operationalPlanID: z.string().uuid()
});

export type SubmitOPSchema = typeof submitOPschema;
