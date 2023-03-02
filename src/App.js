import { useEffect, useState } from "react";
import axios from 'axios'
import AddInput from "./components/AddInput";
import EditInput from "./components/EditInput";


function App() {
  const [todogrup, setTodoGrup] = useState([])
  const [activeIndex, setActiveIndex] = useState('')
  const [activeIndexList, setActiveIndexList] = useState('')
  const [clicked, setClicked] = useState(false)
  const [listclicked, setListClicked] = useState(false)


  // A spend some time trying to figure why after create the put request to addItem was not working and finally found out that was the order of this function
  // A tried a lot of stuff but It's always better looking in the function order first 
  const addNewList = async (listname) => {
    const newList = { Title: listname, Itens: [] }
    const res = await axios.post('http://localhost:3000/todogroup/', newList)
    const newGroup = [...todogrup, res.data]
    setTodoGrup(newGroup)
    setListClicked(false)
  }

  // I just pass most time of my day (02/28) to make this code. I was hard because at first I think 
  // "I will have to add a item on an array inside an object on a database with multiples obj"
  // I tried use the Title inicialy to acess that with the .findIndex obj method, but I forgot that every element on the json got have an id, so after a long time a notice it and put it.
  // So then I tried to change the second paramet of addItem for the id, for this when we create the option list the value will be assign to the id,
  // when we require that on select so here we use it to acess the id. after find the index with findIndex(this time it works cause I'm compare with the id not with index like I did first)
  // Then we create a new varible and assign that to the todogrup so we'll not modify the status. I know't how but if we not do this the renderTodo apresents a error that can map. So I guess that state has to stay aways clean in all modification.
  // so we push the item to the varible and set the TodoGrup for it, create a varible the represent the currently obj to be modified and put that as the second argument on the axios.put as know as payload.
  const addItem = async (item, id) => {
    // Find the list id by the index 
    const listIndex = todogrup.findIndex(list => list.id === id)

    // Assign newState as a copy of todogrup so we can modify it
    const newState = [...todogrup]
    // Push the item to the right place 
    newState[listIndex].Itens.push(item)
    // Seting the todoGrup as the newState
    setTodoGrup(newState)

    // Assing the newItem and made a put request so replace the item before with the new one.
    const newItem = { ...todogrup[listIndex] }
    await axios.put(`http://localhost:3000/todogroup/${id}`, newItem)
  }

  // This was so hard, i was tring to use the filter method but it was not working so I use the splice method then works. I search and seems like the splice is used to remove or replace
  // But the filter is use to create a new array that pass a certain condition. In other words just a big confusion 
  const deleteItem = async () => {
    const itemIndex = +activeIndex[3]
    const listIndex = +activeIndex[0]

    const updatedGroup = [...todogrup]
    updatedGroup[listIndex].Itens.splice(itemIndex, 1)

    const listid = updatedGroup[listIndex].id

    setTodoGrup(updatedGroup)

    const newItem = { ...todogrup[listIndex] }
    await axios.put(`http://localhost:3000/todogroup/${listid}`, newItem)
  }

  const handleListDeleteButton = (index) => {
    setListClicked(!listclicked)
    setActiveIndexList(index)
  }


  const handleListDelete = (index) => {
    const newList = todogrup.filter((list) => list.id !== index)
    setTodoGrup(newList)
    axios.delete(`http://localhost:3000/todogroup/${index}`)
  }

  // All below is refering to the data fetch and the functions to change between menus edit/add

  // Set the current item index that was clicked, with the index list and index item so just active the item to red
  // Set the cliked state so the menus can change between then
  const handleClick = (index) => {
    setActiveIndex(index)
    setClicked(true)
  }

  // A function that goes to Editinput as a props so when click on add we change to AddInput and unselect any active item
  const handleMenuClick = () => {
    setClicked(false)
    setActiveIndex('')
  }

  // Maps to handle with the fetch to display currectly 
  const renderedLists = todogrup.map((data, listindex) => {

    let items = data.Itens
    const rendereditems = items.map((item, i) => {
      const twoindex = `${listindex}, ${i}`
      return <h2 onClick={() => handleClick(twoindex)} key={i} className={`text-lg ${twoindex === activeIndex ? 'text-red-500' : ''}`}>{item}</h2>
    })


    return (<div key={data.Title} className="text-left px-10 ">
      <div className="flex flex-row">
        <h1 onClick={() => handleListDeleteButton(listindex)} className="text-3xl text-red-600">{data.Title}</h1>
        {listclicked & listindex === activeIndexList ? <i onClick={() => handleListDelete(data.id)} className="ri-delete-bin-2-line text-red-600 text-2xl"></i> : ''} </div>
      {rendereditems}
    </div>
    )
  })

  // A map that take the Title to put on the selection as options at AddInput
  const optionsList = todogrup.map((todo) => {
    return { value: todo.id, label: todo.Title }
  })

  // A fetch to take all list and itens from the database
  useEffect(() => {
    const fetchData = async () => {
      const data = await axios.get('http://localhost:3000/todogroup')
      setTodoGrup(data.data)
    }
    fetchData()
  }, [])

  return <div>
    <div className="flex flex-col text-center justify-center">
      <h1 className="text-3xl text-red-600 font-bold underline">Let's start</h1>
    </div>
    <div className="flex flex-row justify-center pt-60">{renderedLists}</div>
    {clicked ? <EditInput deleteI={deleteItem} clicked={handleMenuClick} /> : <AddInput addlist={addNewList} add={addItem} options={optionsList} />}
  </div>
}

export default App;
