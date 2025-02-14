export type Permission = {
	id: number;
	name: string;
	checked: boolean;
};

export type Module = {
	name: string;
	permissions: Permission[];
};

export type RoleFormData = {
	name: string;
	modules: Module[];
};
