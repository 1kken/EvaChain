import { z } from 'zod';

// Schema for publishing/unpublishing templates
export const templatePublishSchema = z.object({
	template_id: z.string().uuid({
		message: 'Invalid template ID format'
	})
});

// Type inference
export type TemplatePublishAction = typeof templatePublishSchema;
