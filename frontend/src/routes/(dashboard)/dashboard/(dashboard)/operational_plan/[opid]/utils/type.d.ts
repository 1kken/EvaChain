import { Tables } from '$lib/types/database.types';

export type OpHeaderFormResult = {
	form: any;
	opHeader: Tables<'op_header'>;
};

export type OpProgramProjectFormResult = {
	form: any;
	opProgramProject: Tables<'op_program_project'>;
};

export type OpObjectiveFormResult = {
	form: any;
	opObjective: Tables<'op_objectives'>;
};
