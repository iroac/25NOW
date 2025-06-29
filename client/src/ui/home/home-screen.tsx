import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import type { DoneItems, TodoGroup } from "../../models/todo";
import type { User } from "../../models/user";
import { api } from "../../services/axios-config";
import Time from "../Time";
import ActionMenu from "./ui/action-menu";

function App() {
	// Aplication states
	const [todogroup, setTodoGroup] = useState<TodoGroup[]>();
	const [doneItens, setDoneItens] = useState<DoneItems[]>([]);
	const [user, setUser] = useState<User>({ _id: "", username: "" });

	// Components states
	const [activeIndex, setActiveIndex] = useState("");
	const [valueEditInput, setValueEditInput] = useState("");
	const [activeIndexList, setActiveIndexList] = useState<number>();
	const [valueEditList, setValueEditList] = useState("");

	// Boolean states - Components states
	const [clicked, setClicked] = useState(false);
	const [listclicked, setListClicked] = useState(false);
	const [editClicked, setEditClicked] = useState(false);
	const [editClikedList, setEditClickedList] = useState(false);
	const [updateArchived, setUpdateArchived] = useState(false);
	const [restTime, setRestTime] = useState(false);

	const navigate = useNavigate();

	const handleTimeFive = (TimeFive: boolean) => {
		setRestTime(TimeFive);
	};

	const deleteItem = async () => {
		const itemIndex = +activeIndex[3];
		const listIndex = +activeIndex[0];

		const updatedGroup = [...todogroup];
		updatedGroup[listIndex].Itens.splice(itemIndex, 1);

		setTodoGroup(updatedGroup);
		const listid = todogroup[listIndex]._id;

		const newItem = { ...todogroup[listIndex] };
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

		const newState = [...todogroup];
		const itemSelect = newState[listIndex].Itens[itemIndex];
		const listSelect = newState[listIndex].Title;

		const newDoneItens = [...doneItens];
		const data = newDoneItens.map((done) => done.data);
		const containsdata = data.some((item) => item === currentdate);
		let content: DoneItems[];

		if (containsdata) {
			newDoneItens.map(async (done, doneindex) => {
				if (done.data === currentdate) {
					done.items.push({ list: listSelect, item: itemSelect });
					content = [...newDoneItens];
					setDoneItens(content);
					const newList = content[doneindex];
					await api.put(`api/updatedonetodo/${done._id}`, newList, {
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

	const handleUpdateArchived = () => {
		setUpdateArchived(!updateArchived);
	};

	const handleEditInput = () => {
		setEditClicked(true);
	};

	const handleListNameUpdate = (
		e: React.FormEvent<HTMLFormElement>,
		listindex: number,
	) => {
		e.preventDefault();
		setEditClickedList(false);
		const newState = [...todogroup];
		newState[listindex] = { ...newState[listindex], Title: valueEditList };

		const newList = newState[listindex];

		setTodoGroup(newState);
		api.put(`api/updatetodogroup/${newList._id}`, newList, {
			withCredentials: true,
		});
	};

	const handleWidthInput = (e: React.FocusEvent<HTMLInputElement, Element>) => {
		const input = e.target;
		input.style.width = `${input.value.length}ch`;
	};

	const handleFocus = (e: React.FocusEvent<HTMLInputElement, Element>) => {
		const input = e.target;
		input.style.width = `${input.value.length}ch`;
	};

	const handleArchive = (listIndex: number) => {
		const newState = [...todogroup];
		newState[listIndex].isArchive = true;

		const listid = newState[listIndex]._id;

		setTodoGroup(newState);

		const newList = { ...todogroup[listIndex] };
		api.put(`api/updatetodogroup/${listid}`, newList, {
			withCredentials: true,
		});
	};

	const handleUpdateItem = (
		e: React.FormEvent<HTMLFormElement>,
		index: number,
		listindex: number,
	) => {
		e.preventDefault();
		setEditClicked(false);
		const newState = [...todogroup];
		newState[listindex].Itens.splice(index, 1, valueEditInput);

		const listId = newState[listindex]._id;

		setTodoGroup(newState);

		const newList = { ...todogroup[listindex] };
		api.put(`api/updatetodogroup/${listId}`, newList, {
			withCredentials: true,
		});
	};

	const addNewList = async (listname: string) => {
		try {
			const newList: TodoGroup = {
				Title: listname,
				Itens: [],
				isArchive: false,
				author: user._id,
			};
			const res = await api.post("api/newtodogroup", newList, {
				withCredentials: true,
			});
			const newGroup = [...todogroup, res.data];
			setTodoGroup(newGroup);
			setListClicked(false);
		} catch (err) {
			toast.error(err.response.data);
		}
	};

	const addItem = async (item: string, id: string) => {
		try {
			const listIndex = todogroup.findIndex((list) => list._id === id);

			const newState = [...todogroup];
			if (!newState[listIndex]) {
				toast.error("Please select a list");
			} else {
				if (item.length >= 50) {
					toast.error(
						"item length must be less than or equal to 50 characters long",
					);
				} else {
					newState[listIndex].Itens.push(item);
					setTodoGroup(newState);

					const newItem = { ...todogroup[listIndex] };
					await api.put(`api/updatetodogroup/${id}`, newItem, {
						withCredentials: true,
					});
				}
			}
		} catch (err) {
			toast.error(err.response.data);
		}
	};

	const handleListDeleteButton = (
		index: number,
		e:
			| React.MouseEvent<HTMLDivElement>
			| React.KeyboardEvent<HTMLHeadingElement>,
	) => {
		setListClicked(!listclicked);
		setActiveIndexList(index);
		setEditClickedList(false);
		setValueEditList(e.currentTarget.innerText);
	};

	const handleListDelete = (id: string) => {
		const newList = todogroup.filter((list) => list._id !== id);
		setTodoGroup(newList);
		api.delete(`api/deletetodogroup/${id}`, {
			withCredentials: true,
		});
	};

	const handleClick = (
		index: string,
		e:
			| React.MouseEvent<HTMLDivElement>
			| React.KeyboardEvent<HTMLHeadingElement>,
	) => {
		setActiveIndex(index);
		setClicked(true);
		setEditClicked(false);
		setListClicked(false);
		setValueEditInput(e.currentTarget.innerText);
	};

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
	const renderedLists = (todogroup || [])?.map((data, listindex) => {
		if (!data.isArchive) {
			const items = data.Itens;
			const rendereditems = items.map((item, i) => {
				const twoindex = `${listindex}, ${i}`;

				if (editClicked && twoindex === activeIndex) {
					return (
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
				}

				return (
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
			});

			return (
				<div key={data.Title} className="text-left px-10 pt-10">
					<div className="flex flex-row">
						{editClikedList && listindex === activeIndexList ? (
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
						{listclicked && listindex === activeIndexList && !editClikedList ? (
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

	// A fetch to take all list and itens from the database
	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await api.get("api/todogroup", {
					withCredentials: true,
				});
				setTodoGroup(data.data);
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
				<h2 className=" pr-1">{user.username}</h2>
				<Link
					onClick={handleLogout}
					className={`cursor-pointer ri-login-circle-line text-2xl  ${restTime ? "text-green-600 hover:text-green-500" : "text-red-600 hover:text-red-500"} `}
					to={""}
				/>
			</div>
			<Time itemClicked={valueEditInput} funcTimeFive={handleTimeFive} />
			<div className="flex flex-wrap pt-6 justify-center items-center ">
				{renderedLists}
			</div>
			{editClicked ? (
				<></>
			) : (
				<div>
					<ActionMenu
						onDone={handleDone}
						restTime={restTime}
						onEdit={handleEditInput}
						deleteI={deleteItem}
						clicked={handleMenuClick}
						isEdit={clicked}
						setDoneItens={setDoneItens}
						doneItens={doneItens}
						user={user}
						addlist={addNewList}
						todogroup={todogroup}
						handleDone={handleDone}
						handleEditInput={handleEditInput}
						deleteItem={deleteItem}
						handleMenuClick={handleMenuClick}
						handleUpdateArchived={handleUpdateArchived}
						addItem={addItem}
						setTodoGroup={setTodoGroup}
					/>
				</div>
			)}
		</div>
	);
}

export default App;
