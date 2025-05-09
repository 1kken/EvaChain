// See https://svelte.dev/docs/kit/types#app.d.ts
import type { Session, SupabaseClient, User } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database.types';
import type { Tables } from '$lib/types/database.types';

export type ProfileWithJoins = Tables<'profiles'> & {
	position: { name: string } | null;
	nature_of_work: { type: string } | null;
	employee_status: { type: string } | null;
};
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			profile: ProfileWithJoins | null;
			supabase: SupabaseClient<Database>;
			safeGetSession: () => Promise<{ session: Session | null; user: User | null }>;
			session: Session | null;
			user: User | null;
			getUserRolesAndPermissions: (userId?: string) => Promise<{
				roles: Tables<'roles'>[];
				permissions: Tables<'permissions'>[];
			}>;
			hasRole: (roleName: string, userId?: string) => Promise<boolean>;
			hasPermission: (permissionName: string, userId?: string) => Promise<boolean>;
			isSuperAdmin: (userId?: string) => Promise<boolean>;
			clearUserCache: (userId: string) => void;
		}
		interface PageData {
			session: Session | null;
		}
		namespace Superforms {
			type Message = {
				status: 'error' | 'success' | 'warning';
				text: string;
			};
		}
	}
}

export {}; // for information about these interfaces
