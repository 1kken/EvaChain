import type { Content } from 'pdfmake/interfaces';
import type { SupervisorWithPosition } from '../helper';
import { createSignatureBlock } from './pdf_gen_helper';

export const generateSupervisor = (immediateSupervisors: SupervisorWithPosition[]): Content => {
	return {
		columns: [
			...immediateSupervisors.map((supervisor, index) => {
				return createSignatureBlock(supervisor);
			})
		],
		columnGap: 10,
		//horizontal,vertical
		margin: [0, 5]
	};
};
