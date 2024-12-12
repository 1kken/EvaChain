import type { SuperFormData } from 'sveltekit-superforms/client';

interface ResetConfig {
	data: {
		core_function_id?: string;
		sub_core_function_id?: string;
		support_function_id?: string;
		sub_support_function_id?: string;
		other_function_id?: string;
		sub_other_function_id?: string;
	};
	newState: {
		core_function_id?: string;
		sub_core_function_id?: string;
		support_function_id?: string;
		sub_support_function_id?: string;
		other_function_id?: string;
		sub_other_function_id?: string;
	};
}

interface ConfigItem {
	id: string;
}

function handleIndicatorConfig(
	configType:
		| 'core_function'
		| 'sub_core_function'
		| 'support_function'
		| 'sub_support_function'
		| 'other_function'
		| 'sub_other_function',
	config: ConfigItem
): ResetConfig {
	const resetObj: ResetConfig = {
		data: {},
		newState: {}
	};

	switch (configType) {
		case 'core_function':
			resetObj.data.core_function_id = config.id;
			resetObj.newState.core_function_id = config.id;
			break;
		case 'sub_core_function':
			resetObj.data.sub_core_function_id = config.id;
			resetObj.newState.sub_core_function_id = config.id;
			break;
		case 'support_function':
			resetObj.data.support_function_id = config.id;
			resetObj.newState.support_function_id = config.id;
			break;
		case 'sub_support_function':
			resetObj.data.sub_support_function_id = config.id;
			resetObj.newState.sub_support_function_id = config.id;
			break;
		case 'other_function':
			resetObj.data.other_function_id = config.id;
			resetObj.newState.other_function_id = config.id;
			break;
		case 'sub_other_function':
			resetObj.data.sub_other_function_id = config.id;
			resetObj.newState.sub_other_function_id = config.id;
			break;
	}

	return resetObj;
}

export type { ResetConfig, ConfigItem };
export { handleIndicatorConfig };
