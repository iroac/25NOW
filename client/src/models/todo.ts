export type TodoGroup = {
	_id?: string;
	Title: string;
	Itens: string[];
	isArchive: boolean;
	author: string;
	__v?: number;
};

export type DoneItems = {
	items: { item: string; list: string }[];
	_id?: number;
	data: string;
};
