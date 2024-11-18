import { z } from 'zod';

export const profileSchema = z.object({
	avatar_url: z.string().nullable().optional(),
	created_at: z.string().nullable().optional(),
	email: z.string().email('Invalid email address').nullable(),
	employee_id: z.string().min(1, 'Employee ID is required').nullable(),
	employee_status_id: z
		.number()
		.int('Must be an integer')
		.positive('Must be a positive number')
		.nullable(),
	first_name: z
		.string()
		.min(2, 'First name must be at least 2 characters')
		.regex(/^[A-Za-z\s]+$/, 'First name can only contain letters and spaces')
		.nullable(),
	id: z.string().min(1, 'ID is required').optional(),
	last_name: z
		.string()
		.min(2, 'Last name must be at least 2 characters')
		.regex(/^[A-Za-z\s]+$/, 'Last name can only contain letters and spaces')
		.nullable(),
	middle_name: z
		.string()
		.regex(/^[A-Za-z\s]*$/, 'Middle name can only contain letters and spaces')
		.nullable(),
	nature_of_work_id: z
		.number()
		.int('Must be an integer')
		.positive('Must be a positive number')
		.nullable(),
	office_id: z.number().int('Must be an integer').positive('Must be a positive number').nullable(),
	position_id: z
		.number()
		.int('Must be an integer')
		.positive('Must be a positive number')
		.nullable(),
	programme_id: z
		.number()
		.int('Must be an integer')
		.positive('Must be a positive number')
		.nullable(),
	unit_id: z.number().int('Must be an integer').positive('Must be a positive number').nullable(),
	updated_at: z.string().nullable().optional()
});
// Stricter schema for form submission
export const profileSubmitSchema = profileSchema.extend({
	employee_id: z.string().min(3, 'Employee ID is required'),
	first_name: z
		.string()
		.refine(
			(val) => val.length >= 2 && /^[A-Za-z\s]+$/.test(val),
			'First name must be at least 2 characters and contain only letters and spaces'
		),
	last_name: z
		.string()
		.refine(
			(val) => val.length >= 2 && /^[A-Za-z\s]+$/.test(val),
			'Last name must be at least 2 characters and contain only letters'
		),
	unit_id: z.number().positive(),
	office_id: z.number().positive()
	// Add other required fields here
});

export type ProfileSubmitSchema = typeof profileSubmitSchema;
export type ProfileSchema = typeof profileSchema;
