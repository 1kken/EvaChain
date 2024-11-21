import type { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';
import type { Tables } from '$lib/types/database.types';

export const unit = $state<{
	units: Tables<'unit'>[];
	channel: RealtimeChannel | null;
	handler: ((payload: any) => void) | null;
	fetch: (supabase: SupabaseClient) => Promise<void>;
	set: (units: Tables<'unit'>[]) => void;
	subscribe: (supabase: SupabaseClient) => void;
	unsubscribe: () => void;
}>({
	units: [],
	channel: null,
	handler: null,

	async fetch(supabase: SupabaseClient) {
		const { data, error } = await supabase.from('unit').select();
		console.log(error);
		this.units = data ?? [];
	},

	set(units: Tables<'unit'>[]) {
		this.units = units;
	},

	subscribe(supabase: SupabaseClient) {
		// Define the handler
		this.handler = (payload) => {
			if (payload.eventType === 'INSERT') {
				this.units = [payload.new, ...this.units];
			} else if (payload.eventType === 'DELETE') {
				this.units = this.units.filter((unit) => unit.id !== payload.old.id);
			} else if (payload.eventType === 'UPDATE') {
				this.units = this.units.map((unit) => (unit.id === payload.new.id ? payload.new : unit));
			}
		};

		// Create and subscribe to the channel
		this.channel = supabase
			.channel('units-changes')
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'unit'
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
