export interface PropDataFacet {
	column: string;
	options: PropOptionFacet[];
}
export interface PropOptionFacet {
	label: string;
	value: string;
	icon?: any;
}

export function mapToOptions<T>(
	items: T[],
	valueKey: keyof T,
	labelKey: keyof T
): PropOptionFacet[] {
	return items.map((item) => ({
		value: item[valueKey] as string,
		label: item[labelKey] as string
	}));
}
