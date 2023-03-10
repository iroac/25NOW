import React, { useEffect, useState } from 'react'
import ReactDom from 'react-dom'

function HistoryItems({ onCloseHistory, doneItems, onDeleteDone, onMoveDone, restTime }) {
    const [options, setOptions] = useState(false)
    const [actualIndex, setActualIndex] = useState('')

    const handleItemHover = (boolean, index) => {
        setOptions(boolean)
        setActualIndex(index)
    }

    const handleDeleteClick = (twoindex) => {
        onDeleteDone(twoindex)
    }

    const handleMoveClick = (twoindex) => {
        onMoveDone(twoindex)
    }


    const renderedHistory = doneItems.map((done, doneindex) => {
        let items = done.items
        const renderedItems = items.map((item, itemindex) => {
            const twoindex = `${doneindex}, ${itemindex}`
            return <div key={item.item} className='flex flex-row' onMouseLeave={() => handleItemHover(false, twoindex)} onMouseEnter={() => handleItemHover(true, twoindex)} >
                <h2 className=' line-through hover:no-underline ' >{item.item}</h2>
                {options & twoindex === actualIndex ? <> <i className={`ri-inbox-unarchive-line cursor-pointer text-lg pl-2 ${restTime ? 'text-green-600 hover:text-green-500' : 'text-red-600 hover:text-red-500 '}`} onClick={() => { handleMoveClick(twoindex) }} ></i> <i onClick={() => handleDeleteClick(twoindex)} className={`ri-close-circle-line cursor-pointer text-lg pl-2 2 ${restTime ? 'text-green-600 hover:text-green-500' : 'text-red-600 hover:text-red-500 '}`}></i> </> : ''}
            </div>
        })

        return <div key={done.data} >
            <h1 className={`${restTime ? 'text-green-600 hover:text-green-500' : 'text-red-600 hover:text-red-500 '} pt-5 text-sm`} >{done.data}</h1>
            {renderedItems}
        </div>
    })

    useEffect(() => {
        document.body.classList.add('overflow-hidden');


        return () => {
            document.body.classList.remove('overflow-hidden')
        }
    }, [])

    return ReactDom.createPortal(
        <div>
            <div onClick={() => onCloseHistory()} className='fixed inset-0 bg-gray-300 opacity-80 '></div>
            <div className='fixed inset-16 p-10 bg-regal-white' >
                <div className='items-center justify-center flex h-1 ' >
                    <h1 className=' text-4xl' > Done </h1>
                    <h1 className={` pl-2 text-4xl ${restTime ? 'text-green-600 hover:text-green-500' : 'text-red-600 hover:text-red-500 '}`} > Items </h1>
                </div>
                <div className='flex flex-col justify-start h-full overflow-auto' >
                    {renderedHistory}
                </div>






                <div className='flex justify-end' >
                    <button onClick={() => onCloseHistory()} className={`rounded-full   ${restTime ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500 '} px-2 text-regal-white`} >Go back</button>
                </div>
            </div>
        </div>,
        document.querySelector('.modal-history')
    )
}

export default HistoryItems