import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const IPCR_STATE_KEY = Symbol('IPCR_STATE_KEY');

type IPCRStatus = 'draft' | 'submitted' | 'reviewing' | 'revision' | 'approved';

type IPCRState = {
	currentIPCR: Writable<Tables<'ipcr'> | null>;
	setIPCR: (ipcr: Tables<'ipcr'>) => void;
	canEdit: Writable<boolean>;
	isDraft: Writable<boolean>;
	isSubmitted: Writable<boolean>;
	isReviewing: Writable<boolean>;
	isRevision: Writable<boolean>;
	isApproved: Writable<boolean>;
};

function createIPCRStore(initialData?: Tables<'ipcr'>): IPCRState {
	const currentIPCR = writable<Tables<'ipcr'> | null>(initialData || null);
	const canEdit = writable(false);
	const isDraft = writable(initialData?.status === 'draft');
	const isSubmitted = writable(initialData?.status === 'submitted');
	const isReviewing = writable(initialData?.status === 'reviewing');
	const isRevision = writable(initialData?.status === 'revision');
	const isApproved = writable(initialData?.status === 'approved');

	// Compute editable state based on IPCR status
	function computeCanEdit(status: IPCRStatus | undefined): boolean {
		return status === 'draft' || status === 'revision';
	}

	// Update all status stores when IPCR changes
	currentIPCR.subscribe(($ipcr) => {
		const status = $ipcr?.status;
		isDraft.set(status === 'draft');
		isSubmitted.set(status === 'submitted');
		isReviewing.set(status === 'reviewing');
		isRevision.set(status === 'revision');
		isApproved.set(status === 'approved');
		canEdit.set(computeCanEdit(status));
	});

	function setIPCR(ipcr: Tables<'ipcr'>) {
		currentIPCR.set(ipcr);
	}

	return {
		currentIPCR,
		setIPCR,
		canEdit,
		isDraft,
		isSubmitted,
		isReviewing,
		isRevision,
		isApproved
	};
}

export function getSingleIPCRStore(): IPCRState {
	const store = getContext<IPCRState>(IPCR_STATE_KEY);
	if (!store) {
		throw new Error('IPCR store not found in context');
	}
	return store;
}

export function setSingleIPCRStore(initialData?: Tables<'ipcr'>): IPCRState {
	const store = createIPCRStore(initialData);
	setContext(IPCR_STATE_KEY, store);
	return store;
}

export type { IPCRState, IPCRStatus };
