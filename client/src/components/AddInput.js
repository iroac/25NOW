
import { useEffect, useState } from 'react'
import Select from 'react-select'
import ArchiveList from './ArchiveList'
import HistoryItems from './HistoryItems'

function AddInput({ options, add, addlist, restTime, onArchivedUpdate, doneItems, onDeleteDone, onMoveDone }) {
    const [option, setOption] = useState([])
    const [addList, setAddList] = useState(false)
    const [addInput, setAddInput] = useState('')
    const [addNewList, setAddNewList] = useState('')
    const [selectedOption, setSelectedOption] = useState(null);
    const [modal, setModal] = useState(false)
    const [modalHistory, setModalHistory] = useState(false)

    const handleAdd = (e) => {
        if (e) {
            e.preventDefault()
        }
        add(addInput, selectedOption.value)
        setSelectedOption(null)
        setAddInput('')
    }

    const handleModel = () => {
        setModal(!modal)
    }

    const handleModelHistory = () => {
        setModalHistory(!modalHistory)
    }

    const showInput = (e) => {
        if (e) {
            e.preventDefault()
        }

        if (addNewList === '') {
            setAddList(!addList)
        } else {
            addlist(addNewList)
            setAddNewList('')
            setAddList(!addList)
        }
    }

    const filteroptions = options.filter((option) => {
        return option.value !== undefined
    })

    useEffect(() => {
        setOption(filteroptions)
    }, [options])

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            border: 0,
            margin: '2px',
            borderRadius: '15px',
            backgroundColor: '#efebe2',
            boxShadow: 'none'
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? restTime ? '#16A34A' : '#DC2626' : '#efebe2',
            color: state.isSelected ? 'white' : 'black',
        })
    };


    return <div className="flex flex-row justify-center items-center mt-16 " >
        <i className={`ri-history-line text-5xl pr-2 cursor-pointer  ${restTime ? 'text-green-600 hover:text-green-500' : 'text-red-600 hover:text-red-500 '}`} onClick={handleModelHistory} ></i>
        <i className={`ri-archive-line text-5xl pr-2 cursor-pointer  ${restTime ? 'text-green-600 hover:text-green-500 ' : 'text-red-600 hover:text-red-500 '}`} onClick={handleModel} ></i>
        <div className={`${restTime ? 'bg-green-600' : 'bg-red-600'} w-auto h-5/2  px-2 rounded-full justify-start items-center flex flex-row`}>
            {!addList && <> <form onSubmit={(e) => handleAdd(e)} ><input onChange={(e) => { setAddInput(e.target.value) }} value={addInput} className="h-8 p-auto focus:outline-0 "></input></form>
                <Select onChange={(option) => { setSelectedOption(option) }} value={selectedOption} className=" focus:outline-none " styles={customStyles} options={option} placeholder="choose a group"></Select>
                <i className="ri-add-circle-fill cursor-pointer text-5xl text-regal-white hover:text-regal-contrast" onClick={handleAdd}></i> </>}
            {addList ? <form onSubmit={(e) => showInput(e)} > <input onChange={(e) => { setAddNewList(e.target.value) }} value={addNewList} className=" h-8 focus:outline-0"></input> </form> : ''}
            <i className="ri-folder-add-fill cursor-pointer text-5xl text-regal-white hover:text-regal-contrast" onClick={showInput}></i>
        </div>
        {modal && <ArchiveList restTime={restTime} onArchivedUpdate={onArchivedUpdate} onClose={handleModel} />}
        {modalHistory && <HistoryItems restTime={restTime} onDeleteDone={onDeleteDone} onMoveDone={onMoveDone} doneItems={doneItems} onCloseHistory={handleModelHistory} />}
    </div>
}

export default AddInput