// Client function
export type SignedUrlResponse = {
	signedUrl: string;
};

export async function getIpcrIndicatorEvidence(
	ipcrIndicatorId: string
): Promise<SignedUrlResponse> {
	try {
		const response = await fetch(`/api/ipcr/evidence?ipcr_indicator_id=${ipcrIndicatorId}`);

		if (!response.ok) {
			if (response.status === 404) {
				return { signedUrl: '' };
			}
			const error = await response.json();
			throw new Error(error.error || 'Failed to fetch evidence records');
		}

		const { data } = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching IPCR indicator evidence:', error);
		return { signedUrl: '' }; // Return empty string URL on any error
	}
}
