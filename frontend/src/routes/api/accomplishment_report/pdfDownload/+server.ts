import { error, type RequestHandler } from '@sveltejs/kit';
import { generatePDF } from './pdf_generator';
import { fetchAccomplishmentReportById } from './helper';
export const POST: RequestHandler = async ({ url, locals: { supabase } }) => {
	const id = url.searchParams.get('id');
	if (!id) throw error(400, 'IPCR ID is required');
	const accommplishmentReport = await fetchAccomplishmentReportById(id, supabase);
	try {
		// Generate PDF
		const pdfBlob = await generatePDF(supabase, accommplishmentReport, id);

		return new Response(pdfBlob, {
			headers: {
				'Content-Type': 'application/pdf',
				'Content-Length': pdfBlob.size.toString(),
				'Content-Disposition': `attachment; filename="ipcr-${id}.pdf"`,
				'Last-Modified': new Date().toUTCString(),
				'Cache-Control': 'public, max-age=600'
			}
		});
	} catch (e) {
		console.error('Error generating PDF:', e);
		throw error(500, 'Failed to generate PDF');
	}
};
