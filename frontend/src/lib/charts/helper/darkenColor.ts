import tinycolor from 'tinycolor2';
export function darkenColor(color: string, index: number): string {
	return tinycolor(color)
		.darken(index * 5)
		.toHexString();
}
