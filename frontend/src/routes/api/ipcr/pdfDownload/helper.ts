import type { PostgrestError, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from 'lucide-svelte';
import type { TDocumentDefinitions, TFontDictionary } from 'pdfmake/interfaces';
import dmmmsuLogo from '$lib/assets/pdf/images/dmmmsu-logo.png';

import PdfPrinter from 'pdfmake';
// Configure fonts
const fonts: TFontDictionary = {
	Helvetica: {
		normal: 'Helvetica',
		bold: 'Helvetica-Bold',
		italics: 'Helvetica-Oblique',
		bolditalics: 'Helvetica-BoldOblique'
	}
};
console.log();
const printer = new PdfPrinter(fonts);
import type { Tables } from '$lib/types/database.types';
import { titleCase } from 'title-case';
import { read } from '$app/server';

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

	const fullName = generateFullName(profile);

	// Define the document definition
	const docDefinition: TDocumentDefinitions = {
		pageOrientation: 'landscape',
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
								height: 94
							},
							{
								text: 'INDIVIDUAL PERFORMANCE COMMITMENT AND REVIEW (IPCR)',
								bold: true,
								margin: [0, 37.5]
							}
						]
					]
				},
				style: 'header'
			},
			//panunumpa
			{
				text: generateInformation(profile, ipcr),
				bold: true,
				margin: [0, 15]
			}
		],
		styles: {
			header: {
				fontSize: 14,
				bold: true,
				alignment: 'center' as const,
				margin: [0, 0]
			}
		},
		defaultStyle: {
			font: 'Helvetica',
			lineHeight: 1.5
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

//UTILS
interface ProfileResult {
	profile:
		| (Tables<'profiles'> & {
				office: Tables<'office'>;
				unit: Tables<'unit'>;
				position: Tables<'position'>;
				employee_status: Tables<'employee_status'>;
				program: Tables<'program'>;
		  })
		| null;
	profileError: PostgrestError | null;
}

async function fetchProfile(
	owner_id: string,
	supabase: SupabaseClient<Database>
): Promise<ProfileResult> {
	const { data, error } = await supabase
		.from('profiles')
		.select(
			`
            *,
            office:office_id(*),
            unit:unit_id(*),
            position:position_id(*),
            employee_status:employee_status_id(*),
            program:program_id(*)
        `
		)
		.eq('id', owner_id)
		.single();

	return {
		profile: data,
		profileError: error
	};
}

async function fetchIPCR(ipcrId: string, supabase: SupabaseClient<Database>) {
	const { data, error } = await supabase.from('ipcr').select().eq('id', ipcrId).single();

	return { ipcr: data, ipcrError: error };
}

//title case
function generateFullName(profile: Tables<'profiles'>): string {
	const { first_name, middle_name, last_name } = profile;
	return titleCase(`${first_name} ${middle_name} ${last_name}`);
}

function generateInformation(
	profile: Tables<'profiles'> & {
		office: Tables<'office'>;
		unit: Tables<'unit'>;
		position: Tables<'position'>;
		employee_status: Tables<'employee_status'>;
		program: Tables<'program'>;
	},
	ipcr: Tables<'ipcr'>
): string {
	//get position
	const position = profile.position;
	const office = profile.office;
	const unit = profile.unit;

	const semesterRange = formatSemesterRange(ipcr.created_at);

	return `I, ${position.name}, of the ${office.name ?? ''}, Don Mariano Marcos Memorial State University -  ${unit.name}
    commit to deliver and agree to be rated on the attainment of the following targets in accordance with the indicated measures for the period ${semesterRange}.`;
}

function formatSemesterRange(isoDateString: string): string {
	const date = new Date(isoDateString);
	const year = date.getFullYear();
	const month = date.getMonth(); // 0-11

	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];

	// First or second semester
	if (month <= 5) {
		// January-June
		return `${months[0]}-${months[5]} ${year}`;
	} else {
		// July-December
		return `${months[6]}-${months[11]} ${year}`;
	}
}
