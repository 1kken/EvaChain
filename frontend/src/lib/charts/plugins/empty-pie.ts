import type { Plugin, ChartType } from 'chart.js';

// Declare the plugin options type
declare module 'chart.js' {
	interface PluginOptionsByType<TType extends ChartType> {
		emptyDoughnut?: {
			color?: string;
			width?: number;
			radiusDecrease?: number;
			text?: string;
			fontColor?: string;
			fontSize?: number;
			fontFamily?: string;
		};
	}
}

export const emptyDoughnutPlugin: Plugin = {
	id: 'emptyDoughnut',
	afterDraw(chart, args, options) {
		// Safely check chart type with type casting
		const chartType = (chart.config as any).type;

		// Only apply to doughnut and pie charts
		if (chartType !== 'doughnut' && chartType !== 'pie') {
			return;
		}
		const { datasets } = chart.data;
		const { color, width, radiusDecrease, text, fontColor, fontSize, fontFamily } = options;
		let hasData = false;
		for (let i = 0; i < datasets.length; i += 1) {
			const dataset = datasets[i];
			// This is the fix - you were using logical OR (||) instead of logical assignment (|=)
			// Also check for empty array and all zero values
			if (dataset.data.length > 0) {
				// Check if at least one value is non-zero
				hasData = dataset.data.some((value) => value !== 0);
				if (hasData) break;
			}
		}
		if (!hasData) {
			const {
				chartArea: { left, top, right, bottom },
				ctx
			} = chart;
			const centerX = (left + right) / 2;
			const centerY = (top + bottom) / 2;
			const r = Math.min(right - left, bottom - top) / 2;

			// Draw the circle
			ctx.beginPath();
			ctx.lineWidth = width || 2;
			ctx.strokeStyle = color || 'rgba(255, 128, 0, 0.5)';
			ctx.arc(centerX, centerY, r - (radiusDecrease || 0), 0, 2 * Math.PI);
			ctx.stroke();

			// Draw the text
			if (text) {
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				ctx.font = `${fontSize || 16}px ${fontFamily || 'Arial'}`;
				ctx.fillStyle = fontColor || '#666';
				ctx.fillText(text, centerX, centerY);
			}
		}
	}
};
