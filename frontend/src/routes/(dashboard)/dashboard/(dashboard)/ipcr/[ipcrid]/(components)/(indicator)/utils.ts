import type { SuperFormData } from 'sveltekit-superforms/client';

interface ResetConfig {
	data: {
		core_function_id?: string;
		sub_core_function_id?: string;
	};
	newState: {
		core_function_id?: string;
		sub_core_function_id?: string;
	};
}

interface ConfigItem {
	id: string;
}

function handleIndicatorConfig(
	configType: 'core_function' | 'sub_core_function' | 'support_function' | 'sub_support_function',
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
			resetObj.data.core_function_id = config.id;
			resetObj.newState.core_function_id = config.id;
			break;
		case 'sub_support_function':
			resetObj.data.sub_core_function_id = config.id;
			resetObj.newState.sub_core_function_id = config.id;
			break;
	}

	return resetObj;
}

export type { ResetConfig, ConfigItem };
export { handleIndicatorConfig };
