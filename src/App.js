import { useEffect, useState } from "react";
import axios from 'axios'
import AddInput from "./components/AddInput";
import EditInput from "./components/EditInput";


function App() {
  const [todogrup, setTodoGrup] = useState([])
  const [activeIndex, setActiveIndex] = useState('')
  const [clicked, setClicked] = useState(false)
  const [addItems, SetAddItems] = useState('')


  // I just pass most time of my day (02/28) to make this code. I was hard because at first I think 
  // "I will have to add a item on an array inside an object on a database with multiples obj"
  // I tried use the Title inicialy to acess that with the .findIndex obj method, but I forgot that every element on the json got have an id, so after a long time a notice it and put it.
  // So then I tried to change the second paramet of addItem for the id, for this when we create the option list the value will be assign to the id,
  // when we require that on select so here we use it to acess the id. after find the index with findIndex(this time it works cause I'm compare with the id not with index like I did first)
  // Then we create a new varible and assign that to the todogrup so we'll not modify the status. I know't how but if we not do this the renderTodo apresents a error that can map. So I guess that state has to stay aways clean in all modification.
  // so we push the item to the varible and set the TodoGrup for it, create a varible the represent the currently obj to be modified and put that as the second argument on the axios.put as know as payload.
  const addItem = async (item, id) => {

    const listIndex = todogrup.findIndex(list => list.id === id)
    const newState = [...todogrup]
    newState[listIndex].Itens.push(item)
    setTodoGrup(newState)

    const newItem = { ...newState[listIndex] }
    await axios.put(`http://localhost:3000/todogroup/${id}`, newItem)
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
      const twoindex = (`${i}, ${listindex}`)
      return <h2 onClick={() => handleClick(twoindex)} key={i} className={`text-lg ${activeIndex === twoindex ? 'text-red-500' : ''}`}>{item}</h2>
    })


    return (<div key={data.Title} className="text-left px-10 ">
      <div><h1 className="text-3xl text-red-600">{data.Title}</h1></div>
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
    {clicked ? <EditInput clicked={handleMenuClick} /> : <AddInput add={addItem} options={optionsList} />}
  </div>
}

export default App;
