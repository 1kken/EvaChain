import { read } from '$app/server';
import dmmmsuLogo from '$lib/assets/pdf/images/dmmmsu-logo.png';
import type { Database } from '$lib/types/database.types';
import type { TDocumentDefinitions, TFontDictionary } from 'pdfmake/interfaces';
import PdfPrinter from 'pdfmake';
import type { SupabaseClient } from '@supabase/supabase-js';
import { generateHeader } from './parts/header';
import { fetchObjectives, fetchStrategicPlan } from './helper';
import { generateBody } from './parts/body';

// Configure fonts
const fonts: TFontDictionary = {
	Helvetica: {
		normal: 'Helvetica',
		bold: 'Helvetica-Bold',
		italics: 'Helvetica-Oblique',
		bolditalics: 'Helvetica-BoldOblique'
	}
};
const printer = new PdfPrinter(fonts);
export async function generatePDF(
	supabase: SupabaseClient<Database>,
	strategicPlanId: string
): Promise<Blob> {
	const logo = await read(dmmmsuLogo).arrayBuffer();
	const buffer = Buffer.from(logo);
	const logoBase64 = buffer.toString('base64');
	const MARGIN_PER_ELEMENT = 10;

	const strategicPlan = await fetchStrategicPlan(strategicPlanId, supabase);
	const objectives = await fetchObjectives(strategicPlanId, supabase);

	// Define the document definition
	const docDefinition: TDocumentDefinitions = {
		pageOrientation: 'landscape',
		pageMargins: [20, 20, 20, 40],
		pageSize: 'LEGAL',
		pageBreakBefore: function (currentNode, followingNodesOnPage) {
			return currentNode.headlineLevel === 1 && followingNodesOnPage.length <= 1;
		},
		// footer: function () {
		// 	return {
		// 		text: 'DMMMSU-PRD-FOO1 \n Rev. No.00 (10-28-2020)',
		// 		alignment: 'left',
		// 		margin: [20, 10, 0, 0],
		// 		fontSize: 8
		// 	};
		// },
		content: [
			//ulo ulo hahahahaha
			...generateHeader(logoBase64, strategicPlan, objectives),
			await generateBody(strategicPlan, supabase)
		],

		styles: {
			header: {
				fontSize: 8,
				bold: true,
				alignment: 'center' as const,
				marginTop: 7
			},
			ratings: {
				fontSize: 9,
				alignment: 'center' as const,
				margin: [0, 0]
			}
		},
		defaultStyle: {
			font: 'Helvetica',
			lineHeight: 1.2,
			fontSize: 9
		}
	};

	return new Promise((resolve, reject) => {
		try {
			const pdfDoc = printer.createPdfKitDocument(docDefinition);
			const chunks: Uint8Array[] = [];

			pdfDoc.on('data', (chunk) => {
				chunks.push(chunk);
			});

			pdfDoc.on('end', () => {
				const result = Buffer.concat(chunks);
				resolve(new Blob([result], { type: 'application/pdf' }));
			});

			pdfDoc.on('error', (error) => {
				reject(error);
			});

			// End the document
			pdfDoc.end();
		} catch (error) {
			reject(error);
		}
	});
}
