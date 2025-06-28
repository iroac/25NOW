import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../services/axios-config";
import Time from "../Time";
import ActionMenu from "./ui/action-menu";

function App() {
	// Aplication states
	const [todogrup, setTodoGrup] = useState([]);
	const [doneItens, setDoneItens] = useState([]);
	const [user, setUser] = useState({});

	// Components states
	const [activeIndex, setActiveIndex] = useState("");
	const [valueEditInput, setValueEditInput] = useState("");
	const [activeIndexList, setActiveIndexList] = useState("");
	const [valueEditList, setValueEditList] = useState("");

	// Boolean states - Components states
	const [clicked, setClicked] = useState(false);
	const [listclicked, setListClicked] = useState(false);
	const [editClicked, setEditClicked] = useState(false);
	const [editClikedList, setEditClickedList] = useState(false);
	const [updateArchived, setUpdateArchived] = useState(false);
	const [restTime, setRestTime] = useState(false);

	const navigate = useNavigate();

	const handleTimeFive = (TimeFive) => {
		setRestTime(TimeFive);
	};

	const deleteItem = async () => {
		const itemIndex = +activeIndex[3];
		const listIndex = +activeIndex[0];

		const updatedGroup = [...todogrup];
		updatedGroup[listIndex].Itens.splice(itemIndex, 1);

		setTodoGrup(updatedGroup);
		const listid = todogrup[listIndex]._id;

		const newItem = { ...todogrup[listIndex] };
		setValueEditInput("");
		setClicked(false);
		await api.put(`api/updatetodogroup/${listid}`, newItem, {
			withCredentials: true,
		});
	};

	const handleDone = async () => {
		// Currently item select
		const itemIndex = +activeIndex[3];
		const listIndex = +activeIndex[0];

		// Currently date sum
		const date = new Date();
		const day = date.getDate();
		const month = date.toLocaleString("default", { month: "long" });
		const year = date.getFullYear();
		const currentdate = `${day} ${month} ${year}`;

		// Item Select
		const newState = [...todogrup];
		const itemSelect = newState[listIndex].Itens[itemIndex];
		const listSelect = newState[listIndex].Title;

		// doneItens Copy
		const newDoneItens = [...doneItens];
		const data = newDoneItens.map((done) => done.data);
		const containsdata = data.some((item) => item === currentdate);
		let content;

		if (containsdata) {
			// eslint-disable-next-line
			newDoneItens.map((done, doneindex) => {
				if (done.data === currentdate) {
					done.items.push({ list: listSelect, item: itemSelect });
					content = [...newDoneItens];
					setDoneItens(content);
					const newList = content[doneindex];
					api.put(`api/updatedonetodo/${done._id}`, newList, {
						withCredentials: true,
					});
				}
			});
		} else {
			const newitem = {
				data: currentdate,
				items: [{ list: listSelect, item: itemSelect }],
			};
			content = [...newDoneItens, newitem];
			setDoneItens(content);
			await api.post("api/newdonetodo", newitem, { withCredentials: true });
			setUpdateArchived(!updateArchived);
		}

		setClicked(false);
		deleteItem();
	};

	const handleDeleteDoneItem = async (index) => {
		const itemindex = +index[3];
		const dayindex = +index[0];

		const updateState = [...doneItens];
		updateState[dayindex].items.splice(itemindex, 1);

		const listId = updateState[dayindex]._id;

		setDoneItens(updateState);

		const newItem = { ...doneItens[dayindex] };
		const listItems = doneItens[dayindex].items;
		api.put(`api/updatedonetodo/${listId}`, newItem, { withCredentials: true });
		if (listItems.length === 0) {
			const newList = doneItens.filter((list) => list._id !== listId);
			setDoneItens(newList);
			api.delete(`api/deletetododone/${listId}`, { withCredentials: true });
		}
	};

	const handleMoveDoneItem = async (index) => {
		const itemindex = +index[3];
		const dayindex = +index[0];

		const newState = [...doneItens];
		const newItem = newState[dayindex].items[itemindex].item;
		const listname = newState[dayindex].items[itemindex].list;

		const updatedList = [...todogrup];
		const containsListName = updatedList.some(
			(item) => item.Title === listname,
		);

		if (containsListName) {
			// eslint-disable-next-line
			updatedList.map((list, listIndex) => {
				if (list.Title === listname) {
					list.Itens.push(newItem);
					setTodoGrup(updatedList);
					const newList = todogrup[listIndex];
					api.put(`api/updatetodogroup/${list._id}`, newList, {
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
			const newGroup = [...todogrup, res.data];
			setTodoGrup(newGroup);
		}

		handleDeleteDoneItem(index);
	};

	const handleUpdateArchived = () => {
		setUpdateArchived(!updateArchived);
	};

	// Handle to show the Input field and set the value as the currently item name. it just can be accomplished with the defaultvalue set as the item on the input field
	const handleEditInput = () => {
		setEditClicked(true);
	};

	// Update the ListName
	const handleListNameUpdate = (e, listindex) => {
		e.preventDefault();
		setEditClickedList(false);
		const newState = [...todogrup];
		newState[listindex] = { ...newState[listindex], Title: valueEditList };

		const newList = newState[listindex];

		setTodoGrup(newState);
		api.put(`api/updatetodogroup/${newList._id}`, newList, {
			withCredentials: true,
		});
	};

	// Make any input width at the same size of the content
	const handleWidthInput = (e) => {
		const input = e.target;
		input.style.width = `${input.value.length}ch`;
	};

	// Handle to make the set the valuedefaul when click and make the defaultValue width at the same size of the input
	const handleFocus = (e, Title) => {
		const input = e.target;
		input.style.width = `${input.value.length}ch`;
	};

	const handleArchive = (listIndex) => {
		const newState = [...todogrup];
		newState[listIndex].isArchive = true;

		const listid = newState[listIndex]._id;

		setTodoGrup(newState);

		const newList = { ...todogrup[listIndex] };
		api.put(`api/updatetodogroup/${listid}`, newList, {
			withCredentials: true,
		});
	};

	// Hey boy, what a jorney, it was intense but rewarding, the first config was made the editClicked status so we can change between the input and the h2 the represents each item
	// Then I styled currectly so it appears to be just a plain text, was a pain but I found out that we need the valuedefault to put the item as the inicial value
	// after I passed the same thing and then discovered the we need the autoFocus to put the | on the end when click no need to the user select the text and find where they want to start editing
	// Then on submit is not available on the input field so I embedded it with a form so onSubmit calls the handleUpdateItem and from there we can make everything happen
	// Also we assign the currently value of the input with a state so we can acess it with that function.
	// handleUpdateItem has 3 props (event, itemIndex, listIndex ) with this is possible to assign the right modification, I won't explain this, just look for your self to see the steps
	const handleUpdateItem = (e, index, listindex) => {
		e.preventDefault();
		setEditClicked(false);
		const newState = [...todogrup];
		newState[listindex].Itens.splice(index, 1, valueEditInput);

		const listId = newState[listindex]._id;

		setTodoGrup(newState);

		const newList = { ...todogrup[listindex] };
		api.put(`api/updatetodogroup/${listId}`, newList, {
			withCredentials: true,
		});
	};

	// A spend some time trying to figure why after create the put request to addItem was not working and finally found out that was the order of this function
	// A tried a lot of stuff but It's always better looking in the function order first
	const addNewList = async (listname) => {
		try {
			const newList = {
				Title: listname,
				Itens: [],
				isArchive: false,
				author: user._id,
			};
			const res = await api.post("api/newtodogroup", newList, {
				withCredentials: true,
			});
			const newGroup = [...todogrup, res.data];
			setTodoGrup(newGroup);
			setListClicked(false);
		} catch (err) {
			toast.error(err.response.data);
		}
	};

	// I just pass most time of my day (02/28) to make this code. I was hard because at first I think
	// "I will have to add a item on an array inside an object on a database with multiples obj"
	// I tried use the Title inicialy to acess that with the .findIndex obj method, but I forgot that every element on the json got have an id, so after a long time a notice it and put it.
	// So then I tried to change the second paramet of addItem for the id, for this when we create the option list the value will be assign to the id,
	// when we require that on select so here we use it to acess the id. after find the index with findIndex(this time it works cause I'm compare with the id not with index like I did first)
	// Then we create a new varible and assign that to the todogrup so we'll not modify the status. I know't how but if we not do this the renderTodo apresents a error that can map. So I guess that state has to stay aways clean in all modification.
	// so we push the item to the varible and set the TodoGrup for it, create a varible the represent the currently obj to be modified and put that as the second argument on the api.put as know as payload.
	const addItem = async (item, id) => {
		try {
			// Find the list id by the index
			const listIndex = todogrup.findIndex((list) => list._id === id);

			// Assign newState as a copy of todogrup so we can modify it
			const newState = [...todogrup];
			// Push the item to the right place
			if (!newState[listIndex]) {
				toast.error("Please select a list");
			} else {
				if (item.length >= 50) {
					toast.error(
						"item length must be less than or equal to 50 characters long",
					);
				} else {
					newState[listIndex].Itens.push(item);
					// Seting the todoGrup as the newState
					setTodoGrup(newState);

					// Assing the newItem and made a put request so replace the item before with the new one.
					const newItem = { ...todogrup[listIndex] };
					await api.put(`api/updatetodogroup/${id}`, newItem, {
						withCredentials: true,
					});
				}
			}
		} catch (err) {
			toast.error(err.response.data);
		}
	};

	// Set the currently clicked index and show set the listclicked to true so shows the icon
	const handleListDeleteButton = (index, e) => {
		setListClicked(!listclicked);
		setActiveIndexList(index);
		setEditClickedList(false);
		setValueEditList(e.target.innerText);
	};

	// Handle the List Delete using a filter method
	const handleListDelete = (id) => {
		const newList = todogrup.filter((list) => list._id !== id);
		setTodoGrup(newList);
		api.delete(`api/deletetodogroup/${id}`, {
			withCredentials: true,
		});
	};

	// All below is refering to the data fetch and the functions to change between menus edit/add

	// Set the current item index that was clicked, with the index list and index item so just active the item to red
	// Set the cliked state so the menus can change between then
	const handleClick = (index, e) => {
		setActiveIndex(index);
		setClicked(true);
		setEditClicked(false);
		setListClicked(false);
		setValueEditInput(e.target.innerText);
	};

	// A function that goes to Editinput as a props so when click on add we change to AddInput and unselect any active item
	const handleMenuClick = () => {
		setClicked(false);
		setActiveIndex("");
		setValueEditInput("");
	};

	const handleLogout = async () => {
		try {
			const res = await api.get("api/logout", { withCredentials: true });
			toast.success(res.data);
			navigate("/login");
		} catch (err) {
			toast.error(err.data);
		}
	};

	// Maps to handle with the fetch to display currectly
	const renderedLists = todogrup.map((data, listindex) => {
		if (!data.isArchive) {
			const items = data.Itens;
			const rendereditems = items.map((item, i) => {
				const twoindex = `${listindex}, ${i}`;
				let content;
				if (editClicked & (twoindex === activeIndex)) {
					content = (
						<form
							key={`${i}${item}`}
							onSubmit={(e) => handleUpdateItem(e, i, listindex)}
						>
							{" "}
							<input
								onInput={handleWidthInput}
								onFocus={(e) => handleFocus(e)}
								className={`text-lg focus:outline-0 ${restTime ? "text-green-600" : "text-red-600"}`}
								style={{ width: "auto" }}
								defaultValue={item}
								onChange={(e) => {
									setValueEditInput(e.target.value);
								}}
							/>{" "}
						</form>
					);
				} else {
					content = (
						<h2
							onClick={(e) => handleClick(twoindex, e)}
							onKeyDown={(e) =>
								e.key === "Enter" ? handleClick(twoindex, e) : ""
							}
							key={`${i}${item}`}
							className={`text-lg cursor-pointer ${twoindex === activeIndex ? (restTime ? "text-green-500" : "text-red-500") : ""}`}
						>
							{item}
						</h2>
					);
				}
				return content;
			});

			return (
				<div key={data.Title} className="text-left px-10 pt-10">
					<div className="flex flex-row">
						{editClikedList & (listindex === activeIndexList) ? (
							<form
								key={`${listindex}${data.Title}`}
								onSubmit={(e) => handleListNameUpdate(e, listindex)}
							>
								{" "}
								<input
									onInput={handleWidthInput}
									className={`text-3xl focus:outline-0   ${restTime ? "text-green-600" : "text-red-600"}`}
									style={{ width: "auto" }}
									onFocus={(e) => handleFocus(e)}
									defaultValue={data.Title}
									onChange={(e) => {
										setValueEditList(e.target.value);
									}}
								/>{" "}
							</form>
						) : (
							<h1
								onClick={(e) => handleListDeleteButton(listindex, e)}
								onKeyDown={(e) =>
									e.key === "Enter" ? handleListDeleteButton(listindex, e) : ""
								}
								className={`text-3xl cursor-pointer ${restTime ? "text-green-600 hover:text-green-500 " : "text-red-600 hover:text-red-500 "}`}
							>
								{data.Title}
							</h1>
						)}
						{listclicked & (listindex === activeIndexList) & !editClikedList ? (
							<div>
								<i
									className={`ri-edit-2-line ml-1 text-2xl   ${restTime ? "text-green-600" : "text-red-600"} `}
									onClick={() => setEditClickedList(!editClikedList)}
									onKeyDown={(e) =>
										e.key === "Enter" ? setEditClickedList(!editClikedList) : ""
									}
								/>
								<i
									onClick={() => handleArchive(listindex)}
									onKeyDown={(e) =>
										e.key === "Enter" ? handleArchive(listindex) : ""
									}
									className={`ri-inbox-archive-line ml-1 text-2xl pl-1  ${restTime ? "text-green-600" : "text-red-600"} `}
								/>
								<i
									onClick={() => handleListDelete(data._id)}
									onKeyDown={(e) =>
										e.key === "Enter" ? handleListDelete(data._id) : ""
									}
									className={`ri-delete-bin-2-line ml-2 ${restTime ? "text-green-600" : "text-red-600"}  text-2xl`}
								>
									{" "}
								</i>{" "}
							</div>
						) : (
							""
						)}{" "}
					</div>
					{rendereditems}
				</div>
			);
		}
		return "";
	});

	// A map that take the Title to put on the selection as options at AddInput
	const optionsList = todogrup.map((todo) => {
		if (!todo.isArchive) {
			return { value: todo._id, label: todo.Title };
		}
		return { value: undefined, label: undefined };
	});

	// A fetch to take all list and itens from the database
	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await api.get("api/todogroup", {
					withCredentials: true,
				});
				setTodoGrup(data.data);
			} catch (err) {
				toast.error(err.response.data);
			}
		};

		const fetchHistory = async () => {
			const res = await api.get("api/getdonetodo", { withCredentials: true });
			setDoneItens(res.data);
		};

		const fetchUser = async () => {
			const res = await api.get("api/getuser", { withCredentials: true });
			setUser(res.data);
		};

		fetchUser();
		fetchData();
		fetchHistory();
	}, []);

	return (
		<div className="flex flex-col w-screen h-screen ">
			<Toaster position="top-center" reverseOrder={false} />
			<div className="flex flex-row justify-end items-end">
				{" "}
				<h2 className=" pr-1">{user.username}</h2>{" "}
				<Link
					onClick={handleLogout}
					className={`cursor-pointer ri-login-circle-line text-2xl  ${restTime ? "text-green-600 hover:text-green-500" : "text-red-600 hover:text-red-500"} `}
				/>{" "}
			</div>
			<Time itemClicked={valueEditInput} funcTimeFive={handleTimeFive} />
			<div className="flex flex-wrap pt-6 justify-center items-center ">
				{renderedLists}
			</div>

			{!editClicked && (
				<div>
					<ActionMenu
						isEdit={clicked}
						onDone={handleDone}
						restTime={restTime}
						onEdit={handleEditInput}
						deleteI={deleteItem}
						clicked={handleMenuClick}
						doneItems={doneItens}
						onDeleteDone={handleDeleteDoneItem}
						onMoveDone={handleMoveDoneItem}
						onArchivedUpdate={handleUpdateArchived}
						addlist={addNewList}
						add={addItem}
						options={optionsList}
					/>
				</div>
			)}
		</div>
	);
}

export default App;
