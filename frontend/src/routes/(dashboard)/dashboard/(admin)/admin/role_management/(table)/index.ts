export type Permission = {
	id: number;
	name: string;
	checked: boolean;
	// scope: Scopes;
};

export type Module = {
	name: string;
	permissions: Permission[];
};

export type RoleFormData = {
	name: string;
	modules: Module[];
};

export type Scopes = 'all' | 'unit' | 'office' | 'program';
