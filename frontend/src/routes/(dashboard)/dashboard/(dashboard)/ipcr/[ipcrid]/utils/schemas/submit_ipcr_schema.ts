import { z } from 'zod';

// Schema for creating a new indicator
export const submitIPCRschema = z.object({
	ipcrID: z.string().uuid('invalid_uuid')
});

export type SubmitIPCRSchema = typeof submitIPCRschema;
