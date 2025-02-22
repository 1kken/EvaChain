import type { Tables } from '$lib/types/database.types';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const IPCR_STATE_KEY = Symbol('IPCR_STATE_KEY');

type IPCRStatus =
	| 'draft'
	| 'submitted_raw'
	| 'under_review_raw'
	| 'revision_raw'
	| 'reviewed_raw'
	| 'submitted'
	| 'under_review'
	| 'revision'
	| 'approved';

type IpcrState = {
	currentIpcr: Writable<Tables<'ipcr'> | null>;
	updateIpcr: (updates: Partial<Tables<'ipcr'>>) => void;
	setIpcr: (ipcr: Tables<'ipcr'>) => void;
	clearIpcr: () => void;
	canEdit: Writable<boolean>;
	isDraft: Writable<boolean>;
	isSubmittedRaw: Writable<boolean>;
	isUnderReviewRaw: Writable<boolean>;
	isRevisionRaw: Writable<boolean>;
	isReviewedRaw: Writable<boolean>;
	isSubmitted: Writable<boolean>;
	isUnderReview: Writable<boolean>;
	isRevision: Writable<boolean>;
	isApproved: Writable<boolean>;
};

function createIpcrStore(initialData?: Tables<'ipcr'> | null): IpcrState {
	const currentIpcr = writable<Tables<'ipcr'> | null>(initialData || null);

	// Initialize status stores with initial state
	const canEdit = writable<boolean>(initialData?.status === 'draft' || false);

	const isDraft = writable<boolean>(initialData?.status === 'draft' || false);
	const isSubmittedRaw = writable<boolean>(initialData?.status === 'submitted_raw' || false);
	const isUnderReviewRaw = writable<boolean>(initialData?.status === 'under_review_raw' || false);
	const isRevisionRaw = writable<boolean>(initialData?.status === 'revision_raw' || false);
	const isReviewedRaw = writable<boolean>(initialData?.status === 'reviewed_raw' || false);
	const isSubmitted = writable<boolean>(initialData?.status === 'submitted' || false);
	const isUnderReview = writable<boolean>(initialData?.status === 'under_review' || false);
	const isRevision = writable<boolean>(initialData?.status === 'revision' || false);
	const isApproved = writable<boolean>(initialData?.status === 'approved' || false);

	function setIpcr(ipcr: Tables<'ipcr'>) {
		currentIpcr.set(ipcr);
		// Update all status stores
		canEdit.set(
			ipcr.status === 'draft' || ipcr.status === 'revision_raw' || ipcr.status === 'revision'
		);
		isDraft.set(ipcr.status === 'draft');
		isSubmittedRaw.set(ipcr.status === 'submitted_raw');
		isUnderReviewRaw.set(ipcr.status === 'under_review_raw');
		isRevisionRaw.set(ipcr.status === 'revision_raw');
		isReviewedRaw.set(ipcr.status === 'reviewed_raw');
		isSubmitted.set(ipcr.status === 'submitted');
		isUnderReview.set(ipcr.status === 'under_review');
		isRevision.set(ipcr.status === 'revision');
		isApproved.set(ipcr.status === 'approved');
	}

	function updateIpcr(updates: Partial<Tables<'ipcr'>>) {
		currentIpcr.update((ipcr) => {
			if (!ipcr) return null;
			const updatedIpcr = { ...ipcr, ...updates };

			// Update status stores if status changes
			if (updates.status) {
				canEdit.set(
					updates.status === 'draft' ||
						updates.status === 'revision_raw' ||
						updates.status === 'revision'
				);
				isDraft.set(updates.status === 'draft');
				isSubmittedRaw.set(updates.status === 'submitted_raw');
				isUnderReviewRaw.set(updates.status === 'under_review_raw');
				isRevisionRaw.set(updates.status === 'revision_raw');
				isReviewedRaw.set(updates.status === 'reviewed_raw');
				isSubmitted.set(updates.status === 'submitted');
				isUnderReview.set(updates.status === 'under_review');
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
		isSubmittedRaw.set(false);
		isUnderReviewRaw.set(false);
		isRevisionRaw.set(false);
		isReviewedRaw.set(false);
		isSubmitted.set(false);
		isUnderReview.set(false);
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
		isSubmittedRaw,
		isUnderReviewRaw,
		isRevisionRaw,
		isReviewedRaw,
		isSubmitted,
		isUnderReview,
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
