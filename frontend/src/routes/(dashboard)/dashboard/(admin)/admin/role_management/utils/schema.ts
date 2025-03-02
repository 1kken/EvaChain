import { z } from 'zod';

export const updateUserRoleSchema = z.object({
	userId: z.string().uuid('User ID must be a valid UUID'),
	role: z.string().min(1, 'Role is required')
});

export type UpdateUserRoleSchema = typeof updateUserRoleSchema;
export type UpdateUserRoleSchemaInput = z.infer<typeof updateUserRoleSchema>;
