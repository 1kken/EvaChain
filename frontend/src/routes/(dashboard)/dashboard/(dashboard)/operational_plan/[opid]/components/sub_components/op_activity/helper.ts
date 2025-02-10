export function calculateTotal(
	q1: string | null,
	q2: string | null,
	q3: string | null,
	q4: string | null,
	inputType: string
): string {
	// Convert null values to empty strings for consistency
	const quarters = [q1, q2, q3, q4].map((q) => q ?? '');

	// Return empty if all quarters are empty/null for non-text types
	if (inputType !== 'text' && quarters.every((q) => !q)) {
		return '';
	}

	switch (inputType) {
		case 'number':
			const nums = quarters.map((q) => {
				const parsed = parseFloat(q);
				return isNaN(parsed) ? 0 : parsed;
			});
			return nums.reduce((a, b) => a + b, 0).toString();

		case 'percentage':
			const validPercentages = quarters
				.filter((q) => q !== '' && q !== null)
				.map((q) => {
					const parsed = parseFloat(q);
					return isNaN(parsed) ? 0 : parsed;
				});
			if (validPercentages.length === 0) return '';
			return validPercentages.reduce((a, b) => a + b, 0).toFixed(2) + '%';

		case 'ratio':
			const ratios = quarters
				.filter((q) => q && q.includes(':'))
				.map((q) => {
					const [numStr, denStr] = (q || '').split(':');
					const num = parseFloat(numStr);
					const den = parseFloat(denStr);
					if (isNaN(num) || isNaN(den) || den === 0) return null;
					return { num, den };
				})
				.filter((ratio): ratio is { num: number; den: number } => ratio !== null);

			if (ratios.length === 0) return '';

			// Get the common denominator (should be the same for all ratios)
			const denominator = ratios[0].den;

			// Check if all denominators are the same
			const hasCommonDenominator = ratios.every((ratio) => ratio.den === denominator);
			if (!hasCommonDenominator) return '';

			// Sum up all numerators but keep the common denominator
			const totalNum = ratios.reduce((sum, ratio) => sum + ratio.num, 0);

			// The total ratio should not exceed 1:1
			return totalNum > denominator
				? `${denominator}:${denominator}`
				: `${totalNum}:${denominator}`;

		default:
			return '';
	}
}
