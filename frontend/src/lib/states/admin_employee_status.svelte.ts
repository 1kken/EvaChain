// lib/states/employee_status.svelte.ts
import type { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';
import type { Tables } from '$lib/types/database.types';

// Type for the raw database record
type DatabaseEmployeeStatus = Tables<'employee_status'>;

// Type for the transformed data
export type EmployeeStatus = {
	id: number;
	type: string;
};

export const employeeStatus = $state<{
	employeeStatuses: EmployeeStatus[];
	channel: RealtimeChannel | null;
	handler: ((payload: any) => void) | null;
	fetch: (supabase: SupabaseClient) => Promise<void>;
	set: (statuses: EmployeeStatus[]) => void;
	subscribe: (supabase: SupabaseClient) => void;
	unsubscribe: () => void;
}>({
	employeeStatuses: [],
	channel: null,
	handler: null,

	async fetch(supabase: SupabaseClient) {
		const { data, error } = await supabase
			.from('employee_status')
			.select('*')
			.order('created_at', { ascending: false });

		if (error) {
			console.error('Error fetching employee statuses:', error);
			return;
		}

		this.employeeStatuses = (data ?? []).map(
			(item: DatabaseEmployeeStatus): EmployeeStatus => ({
				id: item.id,
				type: item.type
			})
		);
	},

	set(statuses: EmployeeStatus[] | DatabaseEmployeeStatus[]) {
		if (statuses.length === 0) {
			this.employeeStatuses = [];
			return;
		}

		// Check if we're dealing with raw database records or already transformed records
		if ('created_at' in statuses[0]) {
			// These are database records
			this.employeeStatuses = (statuses as DatabaseEmployeeStatus[]).map((item) => ({
				id: item.id,
				type: item.type
			}));
		} else {
			// These are already transformed records
			this.employeeStatuses = statuses as EmployeeStatus[];
		}
	},

	subscribe(supabase: SupabaseClient) {
		this.handler = (payload) => {
			if (payload.eventType === 'INSERT') {
				const newStatus: EmployeeStatus = {
					id: payload.new.id,
					type: payload.new.type
				};
				this.employeeStatuses = [newStatus, ...this.employeeStatuses];
			} else if (payload.eventType === 'UPDATE') {
				this.employeeStatuses = this.employeeStatuses.map((status) =>
					status.id === payload.new.id
						? {
								id: payload.new.id,
								type: payload.new.type
							}
						: status
				);
			} else if (payload.eventType === 'DELETE') {
				this.employeeStatuses = this.employeeStatuses.filter(
					(status) => status.id !== payload.old.id
				);
			}
		};

		this.channel = supabase
			.channel('employee-status-changes')
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'employee_status'
				},
				this.handler
			)
			.subscribe();
	},

	unsubscribe() {
		if (this.channel) {
			this.channel.unsubscribe();
			this.channel = null;
			this.handler = null;
		}
	}
});
