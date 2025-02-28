import { z } from 'zod';

// Schema for creating a new strategy plan
export const publishStratPlanSchema = z.object({
	id: z.string().uuid('Invalid Strategic Plan ID format')
});

export type PublishStratPlanSchema = typeof publishStratPlanSchema;
