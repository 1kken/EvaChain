import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const SUPERVISOR_STATE_KEY = Symbol('SUPERVISOR_STATE_KEY');

type SupervisorState = {
	supervisorId: Writable<string | null>;
	setSupervisorId: (id: string | null) => void;
	clearSupervisorId: () => void;
};

function createSupervisorStore(initialId: string | null = null): SupervisorState {
	const supervisorId = writable<string | null>(initialId);

	function setSupervisorId(id: string | null) {
		supervisorId.set(id);
	}

	function clearSupervisorId() {
		supervisorId.set(null);
	}

	return {
		supervisorId,
		setSupervisorId,
		clearSupervisorId
	};
}

export function getSupervisorStore(): SupervisorState {
	const store = getContext<SupervisorState>(SUPERVISOR_STATE_KEY);
	if (!store) {
		throw new Error('Supervisor store not found in context');
	}
	return store;
}

export function setSupervisorStore(initialId: string | null = null): SupervisorState {
	const store = createSupervisorStore(initialId);
	setContext(SUPERVISOR_STATE_KEY, store);
	return store;
}

export type { SupervisorState };
