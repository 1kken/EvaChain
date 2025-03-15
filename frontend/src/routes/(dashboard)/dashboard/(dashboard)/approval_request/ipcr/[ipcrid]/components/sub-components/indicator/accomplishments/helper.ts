type SignedUrlResponse = { signedUrl: string; confidenceLevel: number };

export const getIpcrIndicatorEvidence = async (
	accomplishmentId: string
): Promise<SignedUrlResponse> => {
	try {
		const response = await fetch(`/api/ipcr/evidence?accomplishment_id=${accomplishmentId}`);

		if (!response.ok) {
			if (response.status === 404) {
				return { signedUrl: '', confidenceLevel: 0 };
			}
			const errorData = await response.json();
			throw new Error(errorData.error || 'Failed to fetch evidence records');
		}

		const { data } = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching IPCR indicator evidence:', error);
		return { signedUrl: '', confidenceLevel: 0 };
	}
};
