// Schema for creating new IPCR (without auto-generated fields)
import { z } from 'zod';

// Define the IPCR status enum
const IPCRStatus = z.enum(['draft', 'submitted', 'reviewing', 'approved']);

// Schema for creating new IPCR
export const createIPCRSchema = z.object({
	owner_id: z.string().uuid('Invalid owner ID'),
	head_of_operating_unit: z.string().min(1, 'Head of operation unit name is required'),
	immediate_supervisor: z.string().min(1, 'Immediate supervisor name is required').optional(),
	immediate_supervisor_position: z
		.string()
		.min(1, 'Immediate supervisor position is required')
		.optional(),
	program_chair: z.string().min(1, 'Program chair name is required').optional(),
	dean: z.string().min(1, 'Dean name is required').optional()
});

export const updateIPCRSchema = z.object({
	id: z.string().uuid('Invalid IPCR ID'),
	head_of_operating_unit: z.string().min(1, 'Head of operation unit name is required'),
	immediate_supervisor: z.string().min(1, 'Immediate supervisor name is required').optional(),
	immediate_supervisor_position: z
		.string()
		.min(1, 'Immediate supervisor position is required')
		.optional(),
	program_chair: z.string().min(1, 'Program chair name is required').optional(),
	dean: z.string().min(1, 'Dean name is required').optional()
});

export type CreateIPCRSchema = typeof createIPCRSchema;
export type UpdateIPCRSchema = z.infer<typeof updateIPCRSchema>;
export type UpdateIPCRSchemaType = typeof updateIPCRSchema;

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
