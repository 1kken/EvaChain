import { z } from 'zod';

// Define the IPCR status enum with updated values
const IPCRStatus = z.enum(['draft', 'submitted', 'reviewing', 'approved']);

// Schema for creating new IPCR (without auto-generated fields)
export const createIPCRSchema = z.object({
	title: z.string().min(1).max(255),
	owner_id: z.string().uuid(),
	supervisor_id: z.string().uuid().nullable(),
	office_id: z.number().int().positive(),
	unit_id: z.number().int().positive(),
	program_id: z.number().int().positive().nullable(),
	status: IPCRStatus.default('draft'),
	higher_education_units: z.number().min(0).max(999.99).multipleOf(0.01).nullable(),
	advanced_education_units: z.number().min(0).max(999.99).multipleOf(0.01).nullable(),
	research_units: z.number().min(0).max(999.99).multipleOf(0.01).nullable(),
	technical_extension_units: z.number().min(0).max(999.99).multipleOf(0.01).nullable()
});

export type CreateIPCRSchema = typeof createIPCRSchema;
