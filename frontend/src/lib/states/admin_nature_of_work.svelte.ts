// lib/states/nature_of_work.svelte.ts
import type { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';
import type { Tables } from '$lib/types/database.types';

// Type for the raw database record
type DatabaseNatureOfWork = Tables<'nature_of_work'>;

// Type for the transformed data
export type NatureOfWork = {
	id: number;
	type: string;
};

export const natureOfWork = $state<{
	natureOfWorks: NatureOfWork[];
	channel: RealtimeChannel | null;
	handler: ((payload: any) => void) | null;
	fetch: (supabase: SupabaseClient) => Promise<void>;
	set: (types: NatureOfWork[]) => void;
	subscribe: (supabase: SupabaseClient) => void;
	unsubscribe: () => void;
}>({
	natureOfWorks: [],
	channel: null,
	handler: null,

	async fetch(supabase: SupabaseClient) {
		const { data, error } = await supabase
			.from('nature_of_work')
			.select('*')
			.order('created_at', { ascending: false });

		if (error) {
			console.error('Error fetching nature of work:', error);
			return;
		}

		this.natureOfWorks = (data ?? []).map(
			(item: DatabaseNatureOfWork): NatureOfWork => ({
				id: item.id,
				type: item.type
			})
		);
	},

	set(types: NatureOfWork[] | DatabaseNatureOfWork[]) {
		if (types.length === 0) {
			this.natureOfWorks = [];
			return;
		}

		// Check if we're dealing with raw database records or already transformed records
		if ('created_at' in types[0]) {
			// These are database records
			this.natureOfWorks = (types as DatabaseNatureOfWork[]).map((item) => ({
				id: item.id,
				type: item.type
			}));
		} else {
			// These are already transformed records
			this.natureOfWorks = types as NatureOfWork[];
		}
	},

	subscribe(supabase: SupabaseClient) {
		this.handler = (payload) => {
			if (payload.eventType === 'INSERT') {
				const newType: NatureOfWork = {
					id: payload.new.id,
					type: payload.new.type
				};
				this.natureOfWorks = [newType, ...this.natureOfWorks];
			} else if (payload.eventType === 'UPDATE') {
				this.natureOfWorks = this.natureOfWorks.map((type) =>
					type.id === payload.new.id
						? {
								id: payload.new.id,
								type: payload.new.type
							}
						: type
				);
			} else if (payload.eventType === 'DELETE') {
				this.natureOfWorks = this.natureOfWorks.filter((type) => type.id !== payload.old.id);
			}
		};

		this.channel = supabase
			.channel('nature-of-work-changes')
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'nature_of_work'
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
