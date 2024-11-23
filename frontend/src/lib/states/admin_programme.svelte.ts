import type { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';
import type { Tables } from '$lib/types/database.types';

// Type for the raw database record
type DatabaseProgramme = Tables<'programme'>;

// Type for the transformed data with joined unit and office
export type Programme = {
	id: number;
	name: string;
	unit: {
		id: number;
		code: string;
		name: string;
	} | null;
	office: {
		id: number;
		unit_id: number;
		code: string;
		name: string;
	} | null;
};

export const programme = $state<{
	programmes: Programme[];
	channel: RealtimeChannel | null;
	handler: ((payload: any) => void) | null;
	fetch: (supabase: SupabaseClient) => Promise<void>;
	set: (programmes: Programme[]) => void;
	subscribe: (supabase: SupabaseClient) => void;
	unsubscribe: () => void;
}>({
	programmes: [],
	channel: null,
	handler: null,

	async fetch(supabase: SupabaseClient) {
		const { data, error } = await supabase
			.from('programme')
			.select(
				`
                id,
                name,
                unit:unit_id (
                    id,
                    code,
                    name
                ),
                office:office_id (
                    id,
                    unit_id,
                    code,
                    name
                )
            `
			)
			.order('created_at', { ascending: false });

		if (error) {
			console.error('Error fetching programmes:', error);
			return;
		}

		this.programmes = (data ?? []).map(
			(item: any): Programme => ({
				id: item.id,
				name: item.name,
				unit: item.unit
					? {
							id: item.unit.id,
							code: item.unit.code,
							name: item.unit.name
						}
					: null,
				office: item.office
					? {
							id: item.office.id,
							unit_id: item.office.unit_id,
							code: item.office.code,
							name: item.office.name
						}
					: null
			})
		);
	},

	set(programmes: Programme[] | DatabaseProgramme[]) {
		if (programmes.length === 0) {
			this.programmes = [];
			return;
		}

		if ('unit_id' in programmes[0] || 'office_id' in programmes[0]) {
			this.programmes = (programmes as DatabaseProgramme[]).map((item) => ({
				id: item.id,
				name: item.name,
				unit: null, // You might want to fetch the unit data here
				office: null // You might want to fetch the office data here
			}));
		} else {
			// These are already transformed records
			this.programmes = programmes as Programme[];
		}
	},

	subscribe(supabase: SupabaseClient) {
		this.handler = (payload) => {
			if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
				// Refetch to get the joined data
				this.fetch(supabase);
			} else if (payload.eventType === 'DELETE') {
				this.programmes = this.programmes.filter((programme) => programme.id !== payload.old.id);
			}
		};

		this.channel = supabase
			.channel('programmes-changes')
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'programme'
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
