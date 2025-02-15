import { z } from 'zod';

// Define the scope type enum to match the database enum
const ScopeEnum = z.enum(['all', 'office', 'program', 'unit']);

// Schema for creating a role with selected permission IDs
export const createRoleWithPermissionsSchema = z.object({
	// Role name validation
	name: z
		.string()
		.min(3, {
			message: 'Role name must be at least 3 characters long'
		})
		.max(100, {
			message: 'Role name cannot exceed 100 characters'
		})
		.regex(/^[a-zA-Z0-9_\s]+$/, {
			message: 'Role name can only contain letters, numbers, spaces, and underscores'
		}),

	// Array of permission IDs from checkboxes
	selectedPermissions: z
		.array(
			z.number().int().positive({
				message: 'Permission ID must be a positive integer'
			})
		)
		.min(1, {
			message: 'At least one permission must be selected'
		}),

	// Default scope for all permissions
	scope: ScopeEnum.default('office')
});

// Export the type
export type CreateRoleWithPermissionsInput = typeof createRoleWithPermissionsSchema;

// Schema for updating a role with selected permission IDs
export const updateRoleWithPermissionsSchema = z.object({
	// Role ID is required for updates
	id: z.number().int().positive({
		message: 'Role ID must be a positive integer'
	}),

	// Role name validation
	name: z
		.string()
		.min(3, {
			message: 'Role name must be at least 3 characters long'
		})
		.max(100, {
			message: 'Role name cannot exceed 100 characters'
		})
		.regex(/^[a-zA-Z0-9_\s]+$/, {
			message: 'Role name can only contain letters, numbers, spaces, and underscores'
		}),

	// Array of permission IDs from checkboxes
	selectedPermissions: z
		.array(
			z.number().int().positive({
				message: 'Permission ID must be a positive integer'
			})
		)
		.min(1, {
			message: 'At least one permission must be selected'
		}),

	// Default scope for all permissions
	scope: ScopeEnum.default('unit')
});

// Export the type
export type UpdateRoleWithPermissionsInput = z.infer<typeof updateRoleWithPermissionsSchema>;
