import { z } from 'zod';

// Define the IPCR status enum with updated values
const IPCRStatus = z.enum(['draft', 'submitted', 'reviewing', 'approved']);

// Define the IPCR schema
const IPCRSchema = z.object({
	id: z.string().uuid(),
	title: z.string().min(1).max(255),
	owner_id: z.string().uuid(),
	supervisor_id: z.string().uuid().nullable(),
	office_id: z.number().int().positive(),
	unit_id: z.number().int().positive(),
	program_id: z.number().int().positive().nullable(),
	status: IPCRStatus.default('draft'),
	higher_education_units: z
		.number()
		.nullable()
		.refine((val) => val === null || (val >= 0 && val <= 999.99), {
			message: 'Higher education units must be between 0 and 999.99'
		}),
	advanced_education_units: z
		.number()
		.nullable()
		.refine((val) => val === null || (val >= 0 && val <= 999.99), {
			message: 'Advanced education units must be between 0 and 999.99'
		}),
	research_units: z
		.number()
		.nullable()
		.refine((val) => val === null || (val >= 0 && val <= 999.99), {
			message: 'Research units must be between 0 and 999.99'
		}),
	technical_extension_units: z
		.number()
		.nullable()
		.refine((val) => val === null || (val >= 0 && val <= 999.99), {
			message: 'Technical extension units must be between 0 and 999.99'
		}),
	created_at: z.date().default(() => new Date()),
	updated_at: z.date().default(() => new Date())
});

// Type for TypeScript usage
type IPCR = z.infer<typeof IPCRSchema>;

// Schema for creating new IPCR (without auto-generated fields)
const CreateIPCRSchema = IPCRSchema.omit({
	id: true,
	created_at: true,
	updated_at: true
}).partial({
	supervisor_id: true,
	program_id: true,
	higher_education_units: true,
	advanced_education_units: true,
	research_units: true,
	technical_extension_units: true
});

// Schema for updating existing IPCR
const UpdateIPCRSchema = CreateIPCRSchema.partial();

export { IPCRSchema, IPCRStatus, CreateIPCRSchema, UpdateIPCRSchema, type IPCR };
