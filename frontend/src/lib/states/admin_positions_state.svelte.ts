import type { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';
import type { Tables } from '$lib/types/database.types';

// Type for the raw database record
type DatabasePosition = Tables<'position'>;
type DatabaseNatureOfWork = Tables<'nature_of_work'>;

// Type for the transformed data
export type Position = {
	id: number;
	name: string;
	nature_of_work: {
		id: number;
		type: string;
	} | null;
};

export const position = $state<{
	positions: Position[];
	channel: RealtimeChannel | null;
	handler: ((payload: any) => void) | null;
	fetch: (supabase: SupabaseClient) => Promise<void>;
	set: (positions: Position[]) => void;
	subscribe: (supabase: SupabaseClient) => void;
	unsubscribe: () => void;
}>({
	positions: [],
	channel: null,
	handler: null,

	async fetch(supabase: SupabaseClient) {
		const { data, error } = await supabase
			.from('position')
			.select(
				`
                *,
                nature_of_work (
                    id,
                    type
                )
            `
			)
			.order('created_at', { ascending: false });

		if (error) {
			console.error('Error fetching positions:', error);
			return;
		}

		this.positions = (data ?? []).map(
			(
				item: DatabasePosition & {
					nature_of_work: DatabaseNatureOfWork;
				}
			): Position => ({
				id: item.id,
				name: item.name,
				nature_of_work: item.nature_of_work
					? {
							id: item.nature_of_work.id,
							type: item.nature_of_work.type
						}
					: null
			})
		);
	},

	set(positions: Position[]) {
		this.positions = positions;
	},

	subscribe(supabase: SupabaseClient) {
		this.handler = async (payload) => {
			// For inserts and updates, we need to fetch the complete position data
			// including the nature_of_work relation
			if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
				const { data: positionData } = await supabase
					.from('position')
					.select(
						`
                        *,
                        nature_of_work (
                            id,
                            type
                        )
                    `
					)
					.eq('id', payload.new.id)
					.single();

				if (positionData) {
					const newPosition: Position = {
						id: positionData.id,
						name: positionData.name,
						nature_of_work: positionData.nature_of_work
							? {
									id: positionData.nature_of_work.id,
									type: positionData.nature_of_work.type
								}
							: null
					};

					if (payload.eventType === 'INSERT') {
						this.positions = [newPosition, ...this.positions];
					} else {
						this.positions = this.positions.map((pos) =>
							pos.id === newPosition.id ? newPosition : pos
						);
					}
				}
			} else if (payload.eventType === 'DELETE') {
				this.positions = this.positions.filter((pos) => pos.id !== payload.old.id);
			}
		};

		this.channel = supabase
			.channel('positions-changes')
			.on(
				'postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'position'
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
