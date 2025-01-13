export function calculateColspan(text: string): number {
	const baseLength = 20; // Base length for 1 column
	if (text.length < 0 || text === undefined || text === null) {
		return 1;
	}

	const length = text.length;

	// Calculate how many columns this text needs
	const neededColumns = Math.ceil(length / baseLength);
	// Limit to maximum available columns (8 in your case)
	return Math.min(neededColumns, 8);
}
