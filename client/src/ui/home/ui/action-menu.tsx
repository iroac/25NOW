import AddInput from "../../AddInput";
import EditInput from "../../EditInput";

interface propActionMenu {
	isEdit: boolean;
	handleDone: VoidFunction;
	handleEditInput: VoidFunction;
	deleteItem: unknown;
	handleMenuClick: unknown;
	doneItens: unknown;
	handleDeleteDoneItem: VoidFunction;
	handleMoveDoneItem: VoidFunction;
	handleUpdateArchived: VoidFunction;
	restTime: unknown;
	addNewList: unknown;
	addItem: unknown;
	optionsList: unknown;
}

export default function ActionMenu({
	isEdit = false,
	handleDone,
	handleEditInput,
	deleteItem,
	handleMenuClick,
	doneItens,
	handleDeleteDoneItem,
	handleMoveDoneItem,
	handleUpdateArchived,
	restTime,
	addNewList,
	addItem,
	optionsList,
}: propActionMenu) {
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
					addlist={addNewList}
					add={addItem}
					options={optionsList}
				/>
			)}
		</>
	);
}
