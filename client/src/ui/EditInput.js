function EditInput({ clicked, deleteI, onEdit, onDone, restTime }) {
	const handleClicked = () => {
		clicked();
	};

	const handleEditClick = () => {
		onEdit();
	};

	const deleteItem = () => {
		deleteI();
	};

	const handleDoneClick = () => {
		onDone();
	};

	return (
		<div className="flex flex-row justify-center items-center mt-16">
			<div
				className={` ${restTime ? "bg-green-600" : "bg-red-600"} cursor-pointer w-auto h-2/6 px-auto rounded-full justify-start items-center flex flex-row"`}
			>
				<i
					className="ri-edit-circle-fill text-5xl cursor-pointer text-regal-white hover:text-regal-contrast"
					onClick={handleEditClick}
					onKeyDown={(e) => (e.code === "Enter" ? handleEditClick() : "")}
				/>
				<i
					className="ri-checkbox-circle-line text-5xl ml-6 cursor-pointer text-regal-white hover:text-regal-contrast "
					onClick={handleDoneClick}
					onKeyDown={(e) => (e.code === "Enter" ? handleDoneClick() : "")}
				/>
				<i
					className="ri-add-circle-fill text-5xl cursor-pointer text-regal-white hover:text-regal-contrast "
					onClick={handleClicked}
					onKeyDown={(e) => (e.code === "Enter" ? handleClicked() : "")}
				/>
				<i
					onClick={deleteItem}
					onKeyDown={(e) => (e.code === "Enter" ? deleteItem() : "")}
					className="ri-close-circle-fill cursor-pointer text-5xl ml-6  text-regal-white hover:text-regal-contrast"
				/>
			</div>
		</div>
	);
}

export default EditInput;
