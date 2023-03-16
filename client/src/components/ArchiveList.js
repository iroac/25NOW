import React, { useEffect, useState } from 'react'
import ReactDom from 'react-dom'
import axios from 'axios'

function ArchiveList({ onClose, onArchivedUpdate, restTime }) {
    const [archiveList, setArchiveList] = useState([])
    const [editMode, setEditMode] = useState(false)
    const [currentId, setCurrentId] = useState(null)

    const handleUnarchive = async (listIndex) => {
        const newState = [...archiveList]
        newState[listIndex].isArchive = false
        const listId = newState[listIndex]._id

        setArchiveList(newState)
        const newList = { ...newState[listIndex] }
        axios.put(`/api/updatetodogroup/${listId}`, newList)
    }

    const handleDelete = async (id) => {
        const newList = archiveList.filter((list) => list.id !== id)
        setArchiveList(newList)
        await axios.delete(`http://localhost:3000/todogroup/${id}`)
        onArchivedUpdate()
    }

    const handleListClick = (id) => {
        setEditMode(!editMode)
        setCurrentId(id)
    }

    useEffect(() => {
        const fetchData = async () => {
            const data = await axios.get('/api/todogroup')
            setArchiveList(data.data)
        }
        document.body.classList.add('overflow-hidden');
        fetchData()
        return () => {
            document.body.classList.remove('overflow-hidden')
        }
    }, [])

    const renderedLists = archiveList.map((list, listindex) => {
        if (list.isArchive) {
            return <div key={list._id} className='flex flex-row'>  <h2 onClick={() => handleListClick(list._id)} className={`text-lg cursor-pointer ${restTime ? `text-green-600 ${!editMode && 'hover:text-green-500'} ` : `text-red-600 ${!editMode && 'hover:text-red-500'} `}`}> - {list.Title}</h2>
                {editMode & currentId === list._id ? <> <i className={`ri-inbox-unarchive-line cursor-pointer ${restTime ? 'text-green-600 hover:text-green-500' : 'text-red-600 hover:text-red-500 '} text-xl pl-2`} onClick={() => handleUnarchive(listindex)} > </i> <i onClick={() => handleDelete(list._id)} className={`ri-delete-bin-2-line ${restTime ? 'text-green-600 hover:text-green-500' : 'text-red-600 hover:text-red-500 '} cursor-pointer text-xl pl-2`}></i> </> : ''}
            </div>
        } else {
            return ''
        }
    })


    return ReactDom.createPortal(
        <div>
            <div onClick={() => onClose()} className='fixed inset-0 bg-gray-300 opacity-80 '></div>
            <div className='fixed inset-16 p-10 bg-regal-white' >
                <div className='flex flex-col justify-start h-full' >
                    <div className='items-center justify-center flex pb-10' >
                        <h1 className=' text-4xl' > Archived </h1>
                        <h1 className={`pl-2 text-4xl ${restTime ? 'text-green-600' : 'text-red-600'}`} > Lists </h1>
                    </div>
                    {renderedLists}
                </div>






                <div className='flex justify-end' >
                    <button onClick={() => onClose()} className={`rounded-full ${restTime ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500 '} px-2 text-regal-white`} >Go back</button>
                </div>
            </div>
        </div>,
        document.querySelector('.modal-container')
    )
}

export default ArchiveList