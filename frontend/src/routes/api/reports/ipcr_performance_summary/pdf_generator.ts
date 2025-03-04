import { read } from '$app/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import dmmmsuLogo from '$lib/assets/pdf/images/dmmmsu-logo.png';
import type { Database } from '$lib/types/database.types';
import type { TDocumentDefinitions, TFontDictionary } from 'pdfmake/interfaces';
import PdfPrinter from 'pdfmake';
import {
	fetchPerformanceSummary,
	type PerformanceSummaryWithDerivedData,
	type PerformanceSummaryWithOwner
} from './helper';
import { generateHeader } from './body/header';
import { generateBody } from './body/body';

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
	performanceSummary: PerformanceSummaryWithDerivedData[]
): Promise<Blob> {
	const logo = await read(dmmmsuLogo).arrayBuffer();
	const buffer = Buffer.from(logo);
	const logoBase64 = buffer.toString('base64');

	const docDefinition: TDocumentDefinitions = {
		pageOrientation: 'portrait',
		pageMargins: [40, 20, 40, 40],
		pageSize: 'A4',
		pageBreakBefore: function (currentNode, followingNodesOnPage) {
			return currentNode.headlineLevel === 1 && followingNodesOnPage.length <= 1;
		},
		footer: function () {
			return {
				text: 'Printed on: ' + new Date().toLocaleString(),
				alignment: 'left',
				margin: [40, 10, 0, 0]
			};
		},
		content: [
			generateHeader(
				logoBase64,
				performanceSummary[0].derivedPeriod,
				performanceSummary[0].derivedYear
			),
			generateBody(performanceSummary)
		],

		styles: {
			header: {
				fontSize: 12,
				bold: true,
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
