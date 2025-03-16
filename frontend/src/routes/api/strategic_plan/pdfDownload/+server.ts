import { error, type RequestHandler } from '@sveltejs/kit';
import { generatePDF } from './pdf_generator';
export const POST: RequestHandler = async ({ url, locals: { supabase } }) => {
	const id = url.searchParams.get('id');
	if (!id) throw error(400, 'Strategic Plan ID is required');

	try {
		// Generate PDF
		const pdfBlob = await generatePDF(supabase, id);

		return new Response(pdfBlob, {
			headers: {
				'Content-Type': 'application/pdf',
				'Content-Length': pdfBlob.size.toString(),
				'Content-Disposition': `attachment; filename="strategic-${id}.pdf"`,
				'Last-Modified': new Date().toUTCString(),
				'Cache-Control': 'public, max-age=600'
			}
		});
	} catch (e) {
		console.error('Error generating PDF:', e);
		throw error(500, 'Failed to generate PDF');
	}
};
