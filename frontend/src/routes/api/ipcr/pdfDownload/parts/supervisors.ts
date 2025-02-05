import type { Content } from 'pdfmake/interfaces';
import type { SupervisorWithPosition } from '../helper';
import { createSignatureBlock } from './pdf_gen_helper';
import type { Tables } from '$lib/types/database.types';

export const generateSupervisor = (
	immediateSupervisors: SupervisorWithPosition[],
	ipcr: Tables<'ipcr'>
): Content => {
	return {
		columns: [
			immediateSupervisors?.length
				? immediateSupervisors.map((supervisor) => createSignatureBlock(supervisor))
				: [
						createSignatureBlock({
							position: 'Head, Instruction',
							fullName: ipcr.immediate_supervisor ?? 'Unprocesable input'
						})
					]
		].flat(),
		columnGap: 10,
		margin: [0, 5]
	};
};
