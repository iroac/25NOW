import { useEffect, useState } from "react";
import axios from 'axios'
import AddInput from "./components/AddInput";
import EditInput from "./components/EditInput";


function App() {
  const [todogrup, setTodoGrup] = useState([])
  const [activeIndex, setActiveIndex] = useState('')
  const [clicked, setClicked] = useState(false)

  const handleClick = (index) => {
    setActiveIndex(index)
    setClicked(true)
  }

  const handleMenuClick = () => {
    setClicked(false)
    setActiveIndex('')
  }

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

  const optionsList = todogrup.map((todo) => {
    return { value: todo.Title, label: todo.Title }
  })

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
    {clicked ? <EditInput clicked={handleMenuClick} /> : <AddInput options={optionsList} />}
  </div>
}

export default App;
