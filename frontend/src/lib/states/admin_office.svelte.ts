import type { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';
import type { Tables } from '$lib/types/database.types';

// Type for the raw database record
type DatabaseOffice = Tables<'office'>;

// Type for the transformed data with joined unit
export type Office = {
	id: number;
	code: string;
	name: string;
	unit: {
		id: number;
		code: string;
		name: string;
	} | null;
};

export const office = $state<{
	offices: Office[];
	channel: RealtimeChannel | null;
	handler: ((payload: any) => void) | null;
	fetch: (supabase: SupabaseClient) => Promise<void>;
	set: (offices: Office[]) => void;
	subscribe: (supabase: SupabaseClient) => void;
	unsubscribe: () => void;
}>({
	offices: [],
	channel: null,
	handler: null,

	async fetch(supabase: SupabaseClient) {
		const { data, error } = await supabase
			.from('office')
			.select(
				`
                id,
                code,
                name,
                unit:unit_id (
                    id,
                    code,
                    name
                )
            `
			)
			.order('created_at', { ascending: false });

		if (error) {
			console.error('Error fetching offices:', error);
			return;
		}

		this.offices = (data ?? []).map(
			(item: any): Office => ({
				id: item.id,
				code: item.code,
				name: item.name,
				unit: item.unit
					? {
							id: item.unit.id,
							code: item.unit.code,
							name: item.unit.name
						}
					: null
			})
		);
	},

	// Update the set method to accept either type and transform as needed
	set(offices: Office[] | DatabaseOffice[]) {
		if (offices.length === 0) {
			this.offices = [];
			return;
		}

		// Check if we're dealing with raw database records or already transformed records
		if ('unit_id' in offices[0]) {
			// These are database records, need to fetch unit data
			// In practice, you might want to fetch the unit data here
			this.offices = (offices as DatabaseOffice[]).map((item) => ({
				id: item.id,
				code: item.code,
				name: item.name,
				unit: null // You might want to fetch the unit data here
			}));
		} else {
			// These are already transformed records
			this.offices = offices as Office[];
		}
	},

	subscribe(supabase: SupabaseClient) {
		this.handler = (payload) => {
			if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
				// Refetch to get the joined data
				this.fetch(supabase);
			} else if (payload.eventType === 'DELETE') {
				this.offices = this.offices.filter((office) => office.id !== payload.old.id);
			}
		};

		this.channel = supabase
			.channel('offices-changes')
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'office'
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
