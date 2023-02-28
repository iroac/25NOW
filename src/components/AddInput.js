
import { useEffect, useState } from 'react'
import Select from 'react-select'

function AddInput({ options, add }) {
    const [option, setOption] = useState([])
    const [addList, setAddList] = useState(false)
    const [addInput, setAddInput] = useState('')
    const [selectedOption, setSelectedOption] = useState(null);

    const handleAdd = () => {
        add(addInput, selectedOption.value)
        setSelectedOption(null)
        setAddInput('')
    }

    const showInput = () => {
        setAddList(!addList)
    }

    useEffect(() => {
        setOption(options)
    }, [options])

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            border: '1px solid gray',
            margin: '2px',
            borderRadius: '15px',
            backgroundColor: '#efebe2',
            boxShadow: state.isFocused ? '0 0 0 1px red' : null,
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? 'red' : '#efebe2',
            color: state.isSelected ? 'white' : 'black',
        })
    };


    return <div className="flex flex-row justify-center items-center mt-32" >
        <div className=" bg-red-600 w-auto h-2/6 px-2 rounded-full justify-start items-center flex flex-row">
            <input onChange={(e) => { setAddInput(e.target.value) }} value={addInput} className=" h-8 p-auto focus:outline-0 "></input>
            <Select onChange={(option) => { setSelectedOption(option) }} value={selectedOption} styles={customStyles} options={option} placeholder="choose a group"></Select>
            <i className="ri-add-circle-fill text-5xl text-regal-white" onClick={handleAdd}></i>
            {addList ? <input className=" h-8 focus:outline-0"></input> : ''}
            <i className="ri-folder-add-fill text-5xl text-regal-white" onClick={showInput}></i>
        </div>
    </div>
}

export default AddInput