import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const IPCR_STATE_KEY = Symbol('IPCR_STATE_KEY');

type IPCRStatus = 'draft' | 'submitted' | 'reviewing' | 'revision' | 'approved';

type IpcrState = {
	currentIpcr: Writable<Tables<'ipcr'> | null>;
	updateIpcr: (updates: Partial<Tables<'ipcr'>>) => void;
	setIpcr: (ipcr: Tables<'ipcr'>) => void;
	clearIpcr: () => void;
	canEdit: Writable<boolean>;
	isDraft: Writable<boolean>;
	isSubmitted: Writable<boolean>;
	isReviewing: Writable<boolean>;
	isRevision: Writable<boolean>;
	isApproved: Writable<boolean>;
};

function createIpcrStore(initialData?: Tables<'ipcr'> | null): IpcrState {
	const currentIpcr = writable<Tables<'ipcr'> | null>(initialData || null);

	// Initialize status stores with initial state
	const canEdit = writable<boolean>(
		initialData?.status === 'draft' || initialData?.status === 'revision' || false
	);
	const isDraft = writable<boolean>(initialData?.status === 'draft' || false);
	const isSubmitted = writable<boolean>(initialData?.status === 'submitted' || false);
	const isReviewing = writable<boolean>(initialData?.status === 'reviewing' || false);
	const isRevision = writable<boolean>(initialData?.status === 'revision' || false);
	const isApproved = writable<boolean>(initialData?.status === 'approved' || false);

	function setIpcr(ipcr: Tables<'ipcr'>) {
		currentIpcr.set(ipcr);
		// Update all status stores
		canEdit.set(ipcr.status === 'draft' || ipcr.status === 'revision');
		isDraft.set(ipcr.status === 'draft');
		isSubmitted.set(ipcr.status === 'submitted');
		isReviewing.set(ipcr.status === 'reviewing');
		isRevision.set(ipcr.status === 'revision');
		isApproved.set(ipcr.status === 'approved');
	}

	function updateIpcr(updates: Partial<Tables<'ipcr'>>) {
		currentIpcr.update((ipcr) => {
			if (!ipcr) return null;
			const updatedIpcr = { ...ipcr, ...updates };

			// Update status stores if status changes
			if (updates.status) {
				canEdit.set(updates.status === 'draft' || updates.status === 'revision');
				isDraft.set(updates.status === 'draft');
				isSubmitted.set(updates.status === 'submitted');
				isReviewing.set(updates.status === 'reviewing');
				isRevision.set(updates.status === 'revision');
				isApproved.set(updates.status === 'approved');
			}

			return updatedIpcr;
		});
	}

	function clearIpcr() {
		currentIpcr.set(null);
		canEdit.set(false);
		isDraft.set(false);
		isSubmitted.set(false);
		isReviewing.set(false);
		isRevision.set(false);
		isApproved.set(false);
	}

	return {
		currentIpcr,
		updateIpcr,
		setIpcr,
		clearIpcr,
		canEdit,
		isDraft,
		isSubmitted,
		isReviewing,
		isRevision,
		isApproved
	};
}

export function getIpcrStore(): IpcrState {
	const store = getContext<IpcrState>(IPCR_STATE_KEY);
	if (!store) {
		throw new Error('IPCR store not found in context');
	}
	return store;
}

export function setIpcrStore(initialData?: Tables<'ipcr'> | null): IpcrState {
	const store = createIpcrStore(initialData);
	setContext(IPCR_STATE_KEY, store);
	return store;
}

export type { IpcrState, IPCRStatus };
