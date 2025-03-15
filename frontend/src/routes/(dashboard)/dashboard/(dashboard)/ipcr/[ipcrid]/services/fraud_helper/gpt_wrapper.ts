import OpenAI from 'openai';
import { OPEN_AI_API_KEY } from '$env/static/private';

interface Base64Evidence {
	page: number;
	base64: string;
}

/**
 * Analyzes PDF images with OpenAI and compares them to reference text, returning the average confidence score
 * @param base64Evidences Array of base64-encoded image data
 * @param referenceText The text to compare against
 * @returns Average confidence score across all pages (0-100)
 */
export async function analyzeDocumentImages(
	base64Evidences: Base64Evidence[],
	referenceText: string
): Promise<number> {
	try {
		const openai = new OpenAI({ apiKey: OPEN_AI_API_KEY });
		let totalScore = 0;

		// Process each page individually
		for (const evidence of base64Evidences) {
			// Make sure the base64 data doesn't have any prefix
			const base64Image = evidence.base64?.replace(/^data:image\/[^;]+;base64,/, '') || '';

			const response = await openai.chat.completions.create({
				model: 'gpt-4o',
				messages: [
					{
						role: 'system',
						content: `
						 You are an expert in document verification. Analyze the provided image and compare its content with the given reference text. Consider all relevant factors that contribute to overall similarity.
						 Return only a numerical confidence score from 0 to 100, where 100 means a perfect match and 0 means completely different content.
						`
					},
					{
						role: 'user',
						content: [
							{
								type: 'text',
								text: `Compare the provided document image with the following reference text:\n\n---\nReference Text:\n${referenceText}\n---\n\nAssess how closely they match overall. Return only a confidence score between 0 and 100.`
							},
							{
								type: 'image_url',
								image_url: {
									url: `data:image/png;base64,${base64Image}`
								}
							}
						]
					}
				],
				max_tokens: 100
			});

			// Extract the confidence score from the response
			const content = response.choices[0]?.message?.content?.trim() || '0';
			const score = parseInt(content, 10);
			const validScore = isNaN(score) ? 0 : Math.max(0, Math.min(100, score));

			// Add to total score
			totalScore += validScore;
		}

		// Calculate and return the average score
		return base64Evidences.length > 0 ? Math.round(totalScore / base64Evidences.length) : 0;
	} catch (error) {
		console.error('Error analyzing documents with OpenAI:', error);
		throw error;
	}
}
