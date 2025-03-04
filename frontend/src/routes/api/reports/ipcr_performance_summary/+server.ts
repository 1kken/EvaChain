import { error, redirect, type RequestHandler } from '@sveltejs/kit';
import { generatePDF } from './pdf_generator';
import { fetchPerformanceSummary } from './helper';

export const POST: RequestHandler = async ({ url, locals: { supabase, profile, hasRole } }) => {
	// Get parameters from URL
	let year = url.searchParams.get('year');
	const period = url.searchParams.get('period');
	const inline = url.searchParams.get('inline') === 'true';

	if (!profile) {
		return redirect(401, '/login');
	}

	if (year === null || period === null) {
		return error(400, 'Year and period are required');
	}

	let intYear = parseInt(year);
	let intPeriod = parseInt(period);

	if (isNaN(intYear) || isNaN(intPeriod)) {
		return error(400, 'Year and period must be numbers');
	}

	const performanceSummary = await fetchPerformanceSummary(
		supabase,
		profile,
		hasRole,
		intYear,
		intPeriod
	);

	// Validate required parameters
	if (!year || !period) throw error(400, 'Year and period are required');

	try {
		// Generate PDF with year and period
		const pdfBlob = await generatePDF(performanceSummary!);

		// Create appropriate Content-Disposition based on inline parameter
		const disposition = inline
			? 'inline'
			: `attachment; filename="ipcr-performance-${year}-period${period}.pdf"`;

		return new Response(pdfBlob, {
			headers: {
				'Content-Type': 'application/pdf',
				'Content-Length': pdfBlob.size.toString(),
				'Content-Disposition': disposition,
				'Last-Modified': new Date().toUTCString(),
				'Cache-Control': 'public, max-age=600'
			}
		});
	} catch (e) {
		console.error('Error generating PDF:', e);
		throw error(500, 'Failed to generate PDF');
	}
};
