import { read } from '$app/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import dmmmsuLogo from '$lib/assets/pdf/images/dmmmsu-logo.png';
import type { Database } from '$lib/types/database.types';
import type { TDocumentDefinitions, TFontDictionary } from 'pdfmake/interfaces';
import PdfPrinter from 'pdfmake';
import { fetchIPCR, fetchIPCRImmediateSupervisors, fetchProfile, generateFullName } from './helper';
import { generateHeader } from './parts/header';
import { generateProfile } from './parts/profile';
import { generateSupervisor } from './parts/supervisors';
import { generateSubHeader } from './parts/sub_header';
import { generateIPCRTable } from './parts/ipcr';
import { generateIPCRSummary } from './parts/ipcr_summary_helper';
import { generateComments } from './parts/ipcr_comments_helper';
import { generateFooter } from './parts/ipcr_footer';

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
	ipcrId: string
): Promise<Blob> {
	const logo = await read(dmmmsuLogo).arrayBuffer();
	const buffer = Buffer.from(logo);
	const logoBase64 = buffer.toString('base64');

	//fetch ipcr
	const { ipcr, ipcrError } = await fetchIPCR(ipcrId, supabase);
	if (ipcrError) {
		throw new Error(ipcrError.message);
	}
	if (!ipcr?.owner_id) {
		throw new Error('IPCR owner not found');
	}
	if (!ipcr) {
		throw new Error('IPCR not found');
	}

	//fetch profile
	const { profile, profileError } = await fetchProfile(ipcr.owner_id, supabase);
	if (profileError) {
		throw new Error(profileError.message);
	}
	if (!profile) {
		throw new Error('Profile not found');
	}
	//immediate supervisors
	const immediateSupervisors = await fetchIPCRImmediateSupervisors(ipcrId, supabase);
	if (!immediateSupervisors) {
		throw new Error('Immediate supervisors not found');
	}

	const fullName = generateFullName(profile);
	let date = new Date(Date.now())
		.toLocaleDateString('en-US', {
			month: 'long',
			day: 'numeric',
			year: 'numeric'
		})
		.toUpperCase();

	// Define the document definition
	const { table: ipcrBody, categories } = await generateIPCRTable(ipcrId, supabase);
	const docDefinition: TDocumentDefinitions = {
		pageOrientation: 'landscape',
		pageMargins: [40, 20, 40, 40],
		pageSize: 'A4',
		pageBreakBefore: function (currentNode, followingNodesOnPage) {
			return currentNode.headlineLevel === 1 && followingNodesOnPage.length <= 1;
		},
		footer: function () {
			return {
				text: 'DMMMSU-PRD-FOO3 \n Rev 00 (10-10-2020)',
				alignment: 'left',
				margin: [40, 10, 0, 0]
			};
		},
		content: [
			//ulo ulo hahahahaha
			generateHeader(logoBase64),
			//panunumpa
			generateProfile(profile, fullName, ipcr),
			generateSubHeader(date, profile),
			{ text: 'Reviewed by:', alignment: 'left', margin: [0, 10, 0, 0] },
			//supervisors
			generateSupervisor(immediateSupervisors, ipcr),
			ipcrBody,
			generateIPCRSummary(categories),
			generateComments(),
			generateFooter(ipcr, profile)
		],

		styles: {
			header: {
				fontSize: 12,
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
