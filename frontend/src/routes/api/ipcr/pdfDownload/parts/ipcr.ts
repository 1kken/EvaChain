import type { Database } from '$lib/types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { generateIPCRBody } from './ipcr_body_helper';
import { getIPCRFunctionsById } from '../helper';
import type { Content } from 'pdfmake/interfaces';
import type { CategoryStore } from './ipcr_utils';

type BodyResult = {
	table: Content;
	categories: CategoryStore;
};

export const generateIPCRTable = async (
	ipcrId: string,
	supabase: SupabaseClient<Database>
): Promise<BodyResult> => {
	const marginTop = 10;
	const ratingWidth = 20;
	const { ipcrFunctions } = await getIPCRFunctionsById(ipcrId, supabase);
	const { table, categories } = await generateIPCRBody(ipcrFunctions, ipcrId, supabase);

	return {
		table: {
			table: {
				dontBreakRows: true,
				widths: ['*', '*', '*', ratingWidth, ratingWidth, ratingWidth, ratingWidth, '*'],
				headerRows: 1,
				body: [
					[
						// Major Final Output
						{
							stack: [
								{
									text: 'Major Final Output',
									bold: true,
									alignment: 'center',
									marginTop: marginTop / 2
								},
								{
									text: '(Workload Units)',
									alignment: 'center',
									italics: true
								}
							]
						},
						// Success Indicators
						{
							stack: [
								{
									text: 'Success Indicators',
									bold: true,
									alignment: 'center',
									marginTop: marginTop / 2
								},
								{
									text: '(Targets + Measures)',
									alignment: 'center',
									italics: true
								}
							]
						},
						// Actual Accomplishments
						{
							text: 'Actual Accomplishments',
							bold: true,
							alignment: 'center',
							marginTop: marginTop
						},
						// Rating with colspan: 4
						{
							colSpan: 4,
							stack: [
								{
									text: 'Rating',
									bold: true,
									alignment: 'center'
								},
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
													border: [false, true, true, false]
												},
												{
													text: [
														{ text: 'E', style: 'normalText' },
														{ text: '2', sup: true }
													],
													alignment: 'center',
													border: [true, true, true, false]
												},
												{
													text: [
														{ text: 'T', style: 'normalText' },
														{ text: '3', sup: true }
													],
													alignment: 'center',
													border: [true, true, true, false]
												},
												{
													text: [
														{ text: 'A', style: 'normalText' },
														{ text: '4', sup: true }
													],
													alignment: 'center',
													border: [true, true, false, false]
												}
											]
										]
									}
								}
							]
						},
						{}, // Empty cells for colspan
						{}, // Empty cells for colspan
						{}, // Empty cells for colspan
						// Remarks
						{
							text: 'Remarks',
							bold: true,
							alignment: 'center',
							marginTop: marginTop
						}
					],
					...(ipcrFunctions
						? table
						: [
								[
									{
										text: 'No Data Available',
										colSpan: 8,
										alignment: 'center',
										bold: true,
										margin: [0, 10]
									},
									...Array(7).fill({ text: '' })
								]
							])
				]
			}
		},
		categories
	};
};
