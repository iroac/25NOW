import type { DoneItems, TodoGroup } from "../../../models/todo";
import type { User } from "../../../models/user";
import { api } from "../../../services/axios-config";
import AddInput from "../../AddInput";
import EditInput from "../../EditInput";

interface propActionMenu {
	isEdit: boolean;
	onDone: () => Promise<void>;
	onEdit: VoidFunction;
	handleDone: () => Promise<void>;
	deleteI: VoidFunction;
	handleEditInput: VoidFunction;
	clicked: VoidFunction;
	deleteItem: unknown;
	handleMenuClick: unknown;
	doneItens: DoneItems[];
	handleUpdateArchived: VoidFunction;
	setDoneItens: (arg: DoneItems[]) => void;
	restTime: unknown;
	addlist: (listname: string) => Promise<void>;
	addItem: unknown;
	setTodoGroup: React.Dispatch<React.SetStateAction<TodoGroup[]>>;
	todogroup: TodoGroup[];
	user: User;
}

export default function ActionMenu({
	isEdit = false,
	handleDone,
	handleEditInput,
	clicked,
	deleteItem,
	handleMenuClick,
	doneItens,
	setTodoGroup,
	handleUpdateArchived,
	restTime,
	setDoneItens,
	addlist,
	addItem,
	user,
	todogroup,
}: propActionMenu) {
	const optionsList = (todogroup || []).map((todo) => {
		if (!todo.isArchive) {
			return { value: todo._id, label: todo.Title };
		}
		return { value: undefined, label: undefined };
	});

	const handleMoveDoneItem = async (index: number[]) => {
		const itemindex = +index[3];
		const dayindex = +index[0];

		const newState = [...doneItens];
		const newItem = newState[dayindex].items[itemindex].item;
		const listname = newState[dayindex].items[itemindex].list;

		const updatedList = [...todogroup];
		const containsListName = updatedList.some(
			(item) => item.Title === listname,
		);

		if (containsListName) {
			updatedList.map(async (list, listIndex) => {
				if (list.Title === listname) {
					list.Itens.push(newItem);
					setTodoGroup(updatedList);
					const newList = todogroup[listIndex];
					await api.put(`api/updatetodogroup/${list._id}`, newList, {
						withCredentials: true,
					});
				}
			});
		} else if (!containsListName) {
			const newList = {
				Title: listname,
				Itens: [newItem],
				isArchive: false,
				author: user._id,
			};
			const res = await api.post("api/newtodogroup/", newList, {
				withCredentials: true,
			});
			const newGroup = [...todogroup, res.data];
			setTodoGroup(newGroup);
		}

		handleDeleteDoneItem(index);
	};

	const handleDeleteDoneItem = async (index: number[]) => {
		const itemindex = +index[3];
		const dayindex = +index[0];

		const updateState = [...doneItens];
		updateState[dayindex].items.splice(itemindex, 1);

		const listId = updateState[dayindex]._id;

		setDoneItens(updateState);

		const newItem = { ...doneItens[dayindex] };
		const listItems = doneItens[dayindex].items;
		await api.put(`api/updatedonetodo/${listId}`, newItem, {
			withCredentials: true,
		});

		if (listItems.length === 0) {
			const newList = doneItens.filter((list) => list._id !== listId);
			setDoneItens(newList);
			api.delete(`api/deletetododone/${listId}`, { withCredentials: true });
		}
	};

	return (
		<>
			{isEdit ? (
				<EditInput
					onDone={handleDone}
					restTime={restTime}
					onEdit={handleEditInput}
					deleteI={deleteItem}
					clicked={handleMenuClick}
				/>
			) : (
				<AddInput
					doneItems={doneItens}
					onDeleteDone={handleDeleteDoneItem}
					onMoveDone={handleMoveDoneItem}
					onArchivedUpdate={handleUpdateArchived}
					restTime={restTime}
					addlist={addlist}
					add={addItem}
					options={optionsList}
				/>
			)}
		</>
	);
}
