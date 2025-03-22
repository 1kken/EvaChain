import { STATUS } from '$env/static/private';

// Define the response type from the server
export interface Base64Evidence {
	page: number;
	base64: string;
}

// Define the response type from the server
export interface ConversionResponse {
	success: boolean;
	images: Base64Evidence[];
}

const url =
	STATUS === 'DEV'
		? 'https://evachainfrauddetector-production.up.railway.app/convert'
		: 'https://evachainfrauddetector-production.up.railway.app/convert';

// Function to send PDF evidence to your Express server
export async function sendPdfToServer(pdfFile: File): Promise<ConversionResponse> {
	try {
		const formData = new FormData();
		formData.append('pdfFile', pdfFile); // 'pdfFile' must match the field name in your Express route

		const response = await fetch(url, {
			method: 'POST',
			body: formData
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || 'Error uploading PDF');
		}

		const result = (await response.json()) as ConversionResponse;
		return result;
	} catch (error) {
		console.error('Error sending PDF to server:', error);
		throw error;
	}
}
