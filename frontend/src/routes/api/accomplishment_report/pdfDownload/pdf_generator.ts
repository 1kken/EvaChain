import { read } from '$app/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import dmmmsuLogo from '$lib/assets/pdf/images/dmmmsu-logo.png';
import type { Database, Tables } from '$lib/types/database.types';
import type { TDocumentDefinitions, TFontDictionary } from 'pdfmake/interfaces';
import PdfPrinter from 'pdfmake';
import { generateHeader } from './parts/header';
import { generateBody } from './parts/body';
import { fetchAccomplishmentProgramProjectById, fetchProfileById } from './helper';
import { generateFooter } from './parts/footer';
import { error } from '@sveltejs/kit';

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
	accomplishmentReport: Tables<'accomplishment_report'>,
	ipcrId: string
): Promise<Blob> {
	const logo = await read(dmmmsuLogo).arrayBuffer();
	const buffer = Buffer.from(logo);
	const logoBase64 = buffer.toString('base64');

	const accProgramProject = await fetchAccomplishmentProgramProjectById(ipcrId, supabase);
	const profile = await fetchProfileById(accomplishmentReport.owner_id, supabase);

	if (!profile) {
		error(404, { message: 'Profile not found' });
	}

	const docDefinition: TDocumentDefinitions = {
		pageOrientation: 'landscape',
		pageMargins: [40, 20, 40, 40],
		pageSize: 'LEGAL',
		pageBreakBefore: function (currentNode, followingNodesOnPage) {
			return currentNode.headlineLevel === 1 && followingNodesOnPage.length <= 1;
		},
		footer: function () {
			return {
				text: 'DMMMSU-PRD-FOO2 Rev. No.00 (10-28-2020)',
				alignment: 'left',
				margin: [40, 10, 0, 0]
			};
		},
		content: [
			generateHeader(
				logoBase64,
				10,
				accomplishmentReport.implementing_unit,
				accomplishmentReport.created_at
			),
			await generateBody(accProgramProject, supabase),
			generateFooter(profile, accomplishmentReport)
		],

		styles: {
			header: {
				fontSize: 8,
				bold: true,
				alignment: 'center' as const,
				margin: [0, 0]
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
