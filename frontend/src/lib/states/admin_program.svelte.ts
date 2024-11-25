import type { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';
import type { Tables } from '$lib/types/database.types';

// Type for the raw database record
type DatabaseProgram = Tables<'program'>;

// Type for the transformed data with joined unit and office
export type Program = {
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

export const program = $state<{
	programs: Program[];
	channel: RealtimeChannel | null;
	handler: ((payload: any) => void) | null;
	fetch: (supabase: SupabaseClient) => Promise<void>;
	set: (programs: Program[]) => void;
	subscribe: (supabase: SupabaseClient) => void;
	unsubscribe: () => void;
}>({
	programs: [],
	channel: null,
	handler: null,

	async fetch(supabase: SupabaseClient) {
		const { data, error } = await supabase
			.from('program')
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
			console.error('Error fetching programs:', error);
			return;
		}

		this.programs = (data ?? []).map(
			(item: any): Program => ({
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

	set(programs: Program[] | DatabaseProgram[]) {
		if (programs.length === 0) {
			this.programs = [];
			return;
		}

		if ('unit_id' in programs[0] || 'office_id' in programs[0]) {
			this.programs = (programs as DatabaseProgram[]).map((item) => ({
				id: item.id,
				name: item.name,
				unit: null, // You might want to fetch the unit data here
				office: null // You might want to fetch the office data here
			}));
		} else {
			// These are already transformed records
			this.programs = programs as Program[];
		}
	},

	subscribe(supabase: SupabaseClient) {
		this.handler = (payload) => {
			if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
				// Refetch to get the joined data
				this.fetch(supabase);
			} else if (payload.eventType === 'DELETE') {
				this.programs = this.programs.filter((program) => program.id !== payload.old.id);
			}
		};

		this.channel = supabase
			.channel('programs-changes')
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'program'
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
