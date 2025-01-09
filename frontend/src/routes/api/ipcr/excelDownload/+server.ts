// src/routes/api/ipcr/[id]/download/+server.ts
// import { error } from '@sveltejs/kit';
// import type { RequestHandler } from './$types';
// import ExcelJS from 'exceljs';
// import type { SupabaseClient } from '@supabase/supabase-js';
// import type { Database } from '$lib/types/database.types';

// type IPCRData = Database['public']['Tables']['ipcr']['Row'] & {
// 	ipcr_function: Array<{
// 		title: string;
// 		ipcr_indicator: Array<IndicatorType>;
// 		ipcr_function_category: Array<{
// 			category: string;
// 			ipcr_indicator: Array<IndicatorType>;
// 			ipcr_function_sub_category: Array<{
// 				sub_category: string;
// 				ipcr_indicator: Array<IndicatorType>;
// 			}>;
// 		}>;
// 	}>;
// };

// type IndicatorType = {
// 	final_output: string;
// 	success_indicator: string;
// 	actual_accomplishments: string | null;
// 	quality_rating: number | null;
// 	efficiency_rating: number | null;
// 	timeliness_rating: number | null;
// 	average_rating: number | null;
// 	remarks: string | null;
// };

// // const EXCEL_COLUMNS = [
// // 	{ header: 'Function', key: 'function', width: 20 },
// // 	{ header: 'Category', key: 'category', width: 20 },
// // 	{ header: 'Sub Category', key: 'subCategory', width: 20 },
// // 	{ header: 'Final Output', key: 'finalOutput', width: 30 },
// // 	{ header: 'Success Indicator', key: 'successIndicator', width: 30 },
// // 	{ header: 'Actual Accomplishments', key: 'actualAccomplishments', width: 30 },
// // 	{ header: 'Quality', key: 'quality', width: 10 },
// // 	{ header: 'Efficiency', key: 'efficiency', width: 10 },
// // 	{ header: 'Timeliness', key: 'timeliness', width: 10 },
// // 	{ header: 'Average', key: 'average', width: 10 },
// // 	{ header: 'Remarks', key: 'remarks', width: 20 }
// // ];

// async function fetchIPCRData(supabase: SupabaseClient<Database>, id: string): Promise<IPCRData> {
// 	const { data, error: ipcrError } = await supabase
// 		.from('ipcr')
// 		.select(
// 			`
//             *,
//             ipcr_function:ipcr_function(
//                 *,
//                 ipcr_function_category:ipcr_function_category(
//                     *,
//                     ipcr_function_sub_category:ipcr_function_sub_category(
//                         *,
//                         ipcr_indicator:ipcr_indicator(*)
//                     ),
//                     ipcr_indicator:ipcr_indicator(*)
//                 ),
//                 ipcr_indicator:ipcr_indicator(*)
//             )
//         `
// 		)
// 		.eq('id', id)
// 		.single();

// 	if (ipcrError) {
// 		throw error(500, 'Error fetching IPCR data');
// 	}

// 	return data;
// }

// // function addIndicatorRow(
// // 	worksheet: ExcelJS.Worksheet,
// // 	functionTitle: string,
// // 	category: string,
// // 	subCategory: string,
// // 	indicator: IndicatorType
// // ) {
// // 	worksheet.addRow({
// // 		function: functionTitle,
// // 		category,
// // 		subCategory,
// // 		finalOutput: indicator.final_output,
// // 		successIndicator: indicator.success_indicator,
// // 		actualAccomplishments: indicator.actual_accomplishments || '',
// // 		quality: indicator.quality_rating || '',
// // 		efficiency: indicator.efficiency_rating || '',
// // 		timeliness: indicator.timeliness_rating || '',
// // 		average: indicator.average_rating || '',
// // 		remarks: indicator.remarks || ''
// // 	});
// // }

// // function populateWorksheet(worksheet: ExcelJS.Worksheet, ipcr: IPCRData) {
// // 	for (const func of ipcr.ipcr_function) {
// // 		// Function-level indicators
// // 		func.ipcr_indicator.forEach((indicator) =>
// // 			addIndicatorRow(worksheet, func.title, '', '', indicator)
// // 		);

// // 		// Category-level data
// // 		for (const category of func.ipcr_function_category) {
// // 			// Category-level indicators
// // 			category.ipcr_indicator.forEach((indicator) =>
// // 				addIndicatorRow(worksheet, func.title, category.category, '', indicator)
// // 			);

// // 			// Sub-category level data
// // 			for (const subCategory of category.ipcr_function_sub_category) {
// // 				subCategory.ipcr_indicator.forEach((indicator) =>
// // 					addIndicatorRow(
// // 						worksheet,
// // 						func.title,
// // 						category.category,
// // 						subCategory.sub_category,
// // 						indicator
// // 					)
// // 				);
// // 			}
// // 		}
// // 	}

// // 	// Format columns
// // 	worksheet.columns.forEach((column) => {
// // 		column.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
// // 	});
// // }

// function setupWorksheetHeader(workbook: ExcelJS.Workbook): ExcelJS.Worksheet {
// 	try {
// 		const worksheet = workbook.addWorksheet('IPCR');

// 		// Define header config
// 		const HEADER = {
// 			logoArea: 'A1:B6',
// 			titleArea: 'C1:H6',
// 			logoCell: 'A1:B1',
// 			titleCell: 'C1',
// 			rowHeight: 45,
// 			logoPath: 'static/dmmmsu-logo.png'
// 		} as const;

// 		//set the width of column A and B
// 		worksheet.getColumn('A').width = 34;
// 		worksheet.getColumn('B').width = 34;

// 		// 1. Merge cells
// 		worksheet.mergeCells(HEADER.logoArea);
// 		//design header cell
// 		const headerLogoCells = worksheet.getCell(HEADER.logoArea);
// 		headerLogoCells.border = {
// 			top: { style: 'thin', color: { argb: '00000000' } },
// 			left: { style: 'thin', color: { argb: '00000000' } },
// 			bottom: { style: 'thin', color: { argb: '00000000' } },
// 			right: { style: 'thin', color: { argb: '00000000' } }
// 		};

// 		//set the alignment of the header
// 		headerLogoCells.alignment = {
// 			vertical: 'middle',
// 			horizontal: 'center'
// 		};

// 		//header title
// 		worksheet.mergeCells(HEADER.titleArea);
// 		const headerTitleCells = worksheet.getCell(HEADER.titleArea);
// 		headerTitleCells.border = {
// 			top: { style: 'thin', color: { argb: '00000000' } },
// 			left: { style: 'thin', color: { argb: '00000000' } },
// 			bottom: { style: 'thin', color: { argb: '00000000' } },
// 			right: { style: 'thin', color: { argb: '00000000' } }
// 		};

// 		// 2. Set row height
// 		worksheet.getRow(1).height = HEADER.rowHeight;

// 		// 3. Add and format title
// 		const titleCell = worksheet.getCell(HEADER.titleCell);
// 		titleCell.value = 'INDIVIDUAL PERFORMANCE COMMITMENT AND REVIEW (IPCR)';
// 		titleCell.font = {
// 			name: 'Trebuchet MS',
// 			bold: true,
// 			size: 14
// 		};
// 		titleCell.alignment = {
// 			vertical: 'middle',
// 			horizontal: 'center',
// 			wrapText: true
// 		};

// 		// 4. Add and position logo
// 		const imageId = workbook.addImage({
// 			filename: HEADER.logoPath,
// 			extension: 'png'
// 		});

// 		worksheet.addImage(imageId, {
// 			tl: { col: 0.5, row: 0.5, nativeColOff: 0 },
// 			br: { col: 6, row: 6 },
// 			editAs: 'absolute'
// 		});
// 		// worksheet.addImage(imageId, {
// 		// 	tl: { col: 0.8, row: 0.5 },
// 		// 	ext: { width: 102, height: 94 },
// 		// 	editAs: 'absolute'
// 		// });
// 		// worksheet.addImage(imageId, { // br: { col: 2, row: 6 }, editAs: 'oneCell',
// 		// });

// 		return worksheet;
// 	} catch (error) {
// 		console.error('Error setting up worksheet header:', error);
// 		throw error;
// 	}
// }

// export const POST: RequestHandler = async ({ url, locals: { supabase } }) => {
// 	const id = url.searchParams.get('id');
// 	if (!id) throw error(400, 'IPCR ID is required');

// 	const ipcr = await fetchIPCRData(supabase, id);

// 	const workbook = new ExcelJS.Workbook();
// 	const worksheet = setupWorksheetHeader(workbook);

// 	// const worksheet = setupWorksheet(workbook);
// 	// populateWorksheet(worksheet, ipcr);

// 	const buffer = await workbook.xlsx.writeBuffer();

// 	return new Response(buffer, {
// 		headers: {
// 			'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
// 			'Content-Disposition': `attachment; filename="IPCR_${ipcr.title}.xlsx"`,
// 			'Cache-Control': 'no-cache',
// 			Pragma: 'no-cache',
// 			Expires: '0'
// 		}
// 	});
// };
