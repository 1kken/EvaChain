import { read } from '$app/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import dmmmsuLogo from '$lib/assets/pdf/images/dmmmsu-logo.png';
import type { Database } from '$lib/types/database.types';
import type { TDocumentDefinitions, TFontDictionary } from 'pdfmake/interfaces';
import PdfPrinter from 'pdfmake';
import {
	fetchIPCR,
	fetchIPCRImmediateSupervisors,
	fetchProfile,
	formatSemesterRange,
	generateFullName
} from './helper';
import { titleCase } from 'title-case';
import { CenteredLayout } from '$lib/assets/pdf/helper/centerLayout';
import { createSignatureBlock } from './pdf_gen_helper';

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
		pageMargins: [40, 20, 40, 40],
		pageSize: 'A4',
		content: [
			//ulo ulo hahahahaha
			{
				table: {
					headerRows: 1,
					widths: ['*', 'auto'],
					heights: [30, 30],
					body: [
						[
							{
								image: `data:image/png;base64,${logoBase64}`,
								width: 70,
								height: 65
							},
							{
								text: 'INDIVIDUAL PERFORMANCE COMMITMENT AND REVIEW (IPCR)',
								bold: true
							}
						]
					]
				},
				layout: CenteredLayout,
				style: 'header'
			},
			//panunumpa
			{
				text: [
					{ text: '\u200B\tI, ', bold: true },
					//name
					{ text: fullName + ', ', bold: true, decoration: 'underline' },
					//position
					{
						text: titleCase(profile.position.name),
						bold: true,
						decoration: 'underline'
					},
					{ text: '\u0020of the ', fontSize: 12 },
					//office or program
					{
						text: profile.program.name ?? profile.office.name,
						bold: true,
						decoration: 'underline'
					},
					{
						text: ', Don Mariano Marcos Memorial State University - ' + profile.unit.name,
						bold: true,
						decoration: 'underline'
					},
					{
						text: ' commit to deliver and agree to be rated on the attainment of the following targets in accordance with the indicated measures for the period '
					},
					{
						text: formatSemesterRange(ipcr.created_at),
						bold: true,
						decoration: 'underline'
					},
					{ text: '.' }
				],
				style: {
					fontSize: 10
				},
				margin: [0, 10]
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
							widths: [50, 'auto', '*', '*'],
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
							fontSize: 8
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
				columnGap: 50
			},
			// margin: [left, top, right, bottom]
			{ text: 'Reviewed by:', alignment: 'left', margin: [0, 10, 0, 0] },
			//supervisors
			{
				columns: [
					...immediateSupervisors.map((supervisor, index) => {
						return createSignatureBlock(supervisor);
					})
				],
				columnGap: 10,
				//horizontal,vertical
				margin: [0, 5]
			},
			//start of ipcr
			{
				table: {
					widths: ['*', '*', '*', '*', '*'],
					headerRows: 1,
					body: [
						[
							[
								{ text: 'Major Final Output \n', bold: true, alignment: 'center' },
								{ text: '(Workload Units)', alignment: 'center', italics: true }
							],
							[
								{ text: 'Success Indicators', bold: true, alignment: 'center' },
								{ text: '(Targets + Measures)', alignment: 'center', italics: true }
							],
							{ text: 'Actual Accomplishments', bold: true, alignment: 'center' },
							[
								{ text: 'Rating', bold: true, alignment: 'center' },
								{
									table: {
										widths: ['*', '*', '*', '*'],
										body: [
											[
												{
													text: [
														{ text: 'Q', style: 'normalText' },
														{ text: '1', sup: true }
													],
													alignment: 'center',
													border: [false, true, true, true]
												},
												{
													text: [
														{ text: 'E', style: 'normalText' },
														{ text: '2', sup: true }
													],
													alignment: 'center'
												},
												{
													text: [
														{ text: 'T', style: 'normalText' },
														{ text: '3', sup: true }
													],
													alignment: 'center'
												},
												{
													text: [
														{ text: 'A', style: 'normalText' },
														{ text: '4', sup: true }
													],
													alignment: 'center',
													border: [true, true, false, true]
												}
											]
										],
										margin: [0, 0, 0, 0],
										layout: {
											hLineWidth: function () {
												return 1;
											},
											vLineWidth: function () {
												return 1;
											},
											paddingLeft: function () {
												return 0;
											},
											paddingRight: function () {
												return 0;
											},
											paddingTop: function () {
												return 0;
											},
											paddingBottom: function () {
												return 0;
											}
										}
									}
								}
							],
							{ text: 'Remarks', bold: true, alignment: 'center' }
						]
					]
				},
				style: {
					fontSize: 8
				},
				margin: [0, 5, 0, 0],
				layout: {
					...CenteredLayout,
					paddingLeft: function (i, node) {
						const cell = node.table.body[0][i];
						console.log(cell);
						return typeof cell === 'object' && 'table' in cell ? 0 : 4;
					},
					paddingRight: function (i, node) {
						const cell = node.table.body[0][i];
						return typeof cell === 'object' && 'table' in cell ? 0 : 4;
					},
					paddingTop: function (i, node) {
						const cell = node.table.body[0][i];
						return typeof cell === 'object' && 'table' in cell ? 0 : 4;
					},
					paddingBottom: function (i, node) {
						const cell = node.table.body[0][i];
						return typeof cell === 'object' && 'table' in cell ? 0 : 4;
					}
				}
			}
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
