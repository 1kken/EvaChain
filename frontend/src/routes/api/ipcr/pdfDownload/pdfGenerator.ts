import { read } from '$app/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import dmmmsuLogo from '$lib/assets/pdf/images/dmmmsu-logo.png';
import type { Database } from '$lib/types/database.types';
import type { TDocumentDefinitions, TFontDictionary } from 'pdfmake/interfaces';
import PdfPrinter from 'pdfmake';
import {
	createSignatureBlock,
	fetchIPCR,
	fetchIPCRImmediateSupervisors,
	fetchProfile,
	formatSemesterRange,
	generateFullName
} from './helper';
import { titleCase } from 'title-case';

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
	const docDefinition: TDocumentDefinitions = {
		pageOrientation: 'landscape',
		pageSize: 'LEGAL',
		content: [
			//ulo ulo hahahahaha
			{
				table: {
					headerRows: 1,
					widths: ['*', 'auto'],
					heights: [75, 75],
					body: [
						[
							{
								image: `data:image/png;base64,${logoBase64}`,
								width: 104,
								height: 95
							},
							{
								text: 'INDIVIDUAL PERFORMANCE COMMITMENT AND REVIEW (IPCR)',
								bold: true,
								margin: [0, 40]
							}
						]
					]
				},
				style: 'header'
			},
			//panunumpa
			{
				text: [
					{ text: '\u200B\tI, ', fontSize: 12, bold: true },
					//name
					{ text: fullName + ', ', bold: true, fontSize: 12, decoration: 'underline' },
					//position
					{
						text: titleCase(profile.position.name),
						bold: true,
						fontSize: 12,
						decoration: 'underline'
					},
					{ text: '\u0020of the ', fontSize: 12 },
					//office or program
					{
						text: profile.program.name ?? profile.office.name,
						bold: true,
						fontSize: 12,
						decoration: 'underline'
					},
					{
						text: ', Don Mariano Marcos Memorial State University - ' + profile.unit.name,
						bold: true,
						fontSize: 12,
						decoration: 'underline'
					},
					{
						text: ' commit to deliver and agree to be rated on the attainment of the following targets in accordance with the indicated measures for the period ',
						fontSize: 12
					},
					{
						text: formatSemesterRange(ipcr.created_at),
						bold: true,
						fontSize: 12,
						decoration: 'underline'
					},
					{ text: '.', fontSize: 12 }
				],
				margin: [0, 20]
			},
			//Ratings Range Adjectival & prepared by
			{
				columns: [
					{
						width: 'auto',
						table: {
							widths: [150, 150, 150],
							heights: [10, 10],
							body: [
								[
									{
										text: 'Ratings',
										bold: true
									},
									{ text: 'Range', bold: true },
									{ text: 'Adjectival Ratings', bold: true }
								],
								[{ text: '5' }, { text: '130% and above' }, { text: 'Outstanding' }],
								[{ text: '4' }, { text: '115% - 129%' }, { text: 'Very Satisfactory' }],
								[{ text: '3' }, { text: '90% - 114%' }, { text: 'Satisfactory' }],
								[{ text: '2' }, { text: '51% - 89%' }, { text: 'Unsatisfactory' }],
								[{ text: '1' }, { text: '50% and below' }, { text: 'Poor' }]
							]
						},
						style: 'ratings',
						layout: {
							hLineWidth: function (i, node) {
								return i === 0 || i === node.table.body.length ? 1 : 0;
							},
							vLineWidth: function (i, node) {
								return i === 0 || (node.table.widths && i === node.table.widths.length) ? 1 : 0;
							}
						}
					},
					{
						table: {
							widths: [80, 'auto', '*', '*'],
							body: [
								[{ text: 'Prepared by:', colSpan: 4, alignment: 'left' }, {}, {}, {}],
								[
									{ text: '' },
									{ text: 'Signature', alignment: 'left' },
									{
										text: '',
										alignment: 'justify',
										border: [false, false, false, true],
										colSpan: 2,
										margin: [0, 0, 0, 0]
									},
									{}
								],
								[
									{ text: '' },
									{ text: 'Name', alignment: 'left' },
									{
										text: generateFullName(profile).toUpperCase(),
										alignment: 'center',
										border: [false, false, false, true],
										colSpan: 2,
										bold: true,
										margin: [0, 0, 0, 0]
									},
									{}
								],
								[
									{ text: '' },
									{ text: 'Position', alignment: 'left' },
									{
										text: profile.position.name.toUpperCase(),
										alignment: 'center',
										border: [false, false, false, true],
										colSpan: 2,
										bold: true,
										margin: [0, 0, 0, 0]
									},
									{}
								],
								[
									{ text: '' },
									{ text: 'Date', alignment: 'left' },
									{
										text: date.toUpperCase(),
										alignment: 'center',
										border: [false, false, false, true],
										colSpan: 2,
										bold: true,
										margin: [0, 0, 0, 0]
									},
									{}
								]
							]
						},
						style: {
							fontSize: 11
						},
						layout: {
							defaultBorder: false,
							paddingLeft: function (i, node) {
								return 0;
							},
							paddingRight: function (i, node) {
								return 0;
							}
						}
					}
				],
				columnGap: 100
			},
			//supervisors
			{
				columns: [
					...immediateSupervisors.map((supervisor) => {
						return createSignatureBlock(supervisor);
					})
				],
				columnGap: 10,
				margin: [0, 20]
			}
		],

		styles: {
			header: {
				fontSize: 14,
				bold: true,
				alignment: 'center' as const,
				margin: [0, 0]
			},
			ratings: {
				fontSize: 11,
				alignment: 'center' as const,
				margin: [0, 0]
			}
		},
		defaultStyle: {
			font: 'Helvetica',
			lineHeight: 1.5,
			fontSize: 12
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
