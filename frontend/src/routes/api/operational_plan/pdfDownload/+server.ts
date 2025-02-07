import { error, type RequestHandler } from '@sveltejs/kit';
import { generatePDF } from './pdfGenerator';
export const POST: RequestHandler = async ({ url, locals: { supabase } }) => {
	const id = url.searchParams.get('id');
	const inline = url.searchParams.get('inline');

	if (!id) throw error(400, 'Operational Plan ID is required');

	try {
		// Generate PDF
		const pdfBlob = await generatePDF(supabase, id);

		//if inline is true, display the pdf in the browser
		if (inline === 'true') {
			return new Response(pdfBlob, {
				headers: {
					'Content-Type': 'application/pdf',
					'Content-Length': pdfBlob.size.toString(),
					'Content-Disposition': `inline; filename="operational-plan-${id}.pdf"`,
					'Last-Modified': new Date().toUTCString(),
					'Cache-Control': 'public, max-age=600'
				}
			});
		}

		return new Response(pdfBlob, {
			headers: {
				'Content-Type': 'application/pdf',
				'Content-Length': pdfBlob.size.toString(),
				'Content-Disposition': `attachment; filename="operational-plan-${id}.pdf"`,
				'Last-Modified': new Date().toUTCString(),
				'Cache-Control': 'public, max-age=600'
			}
		});
	} catch (e) {
		console.error('Error generating PDF:', e);
		throw error(500, 'Failed to generate PDF');
	}
};
