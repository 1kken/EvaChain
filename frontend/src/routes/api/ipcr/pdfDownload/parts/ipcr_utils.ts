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
export interface Category {
	category: string;
	units: string;
	total: number;
}

interface NoCategory {
	total: number;
}

type Categories = Category | NoCategory;

export class CategoryStore {
	private categories: Record<string, Record<string, Categories>> = {};

	add(functionName: string, categoryId: string, data: Categories) {
		if (!this.categories[functionName]) {
			this.categories[functionName] = {};
		}
		this.categories[functionName][categoryId] = data;
	}

	getAll() {
		return this.categories;
	}

	clear() {
		this.categories = {};
	}
}

// Export a factory function to create new instances
export const createCategoryStore = () => new CategoryStore();
