// Schema for creating new IPCR (without auto-generated fields)
import { z } from 'zod';

// Define the IPCR status enum
const IPCRStatus = z.enum(['draft', 'submitted', 'reviewing', 'approved']);

// Schema for creating new IPCR
export const createIPCRSchema = z.object({
	owner_id: z.string().uuid()
});

export type CreateIPCRSchema = typeof createIPCRSchema;

export const deleteIPCRSchema = z
	.object({
		id: z.string(),
		confirmTitle: z.string().min(1, 'Please fill in the necessary field'),
		owner_id: z.string(),
		expectedTitle: z.string()
	})
	.refine((data) => data.confirmTitle === data.expectedTitle, {
		message: "The title doesn't match",
		path: ['confirmTitle']
	});

export type DeleteIPCRSchema = z.infer<typeof deleteIPCRSchema>;
export type DeleteIPCRSchemanType = typeof deleteIPCRSchema;
