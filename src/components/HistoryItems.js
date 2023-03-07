import React, { useEffect, useState } from 'react'
import ReactDom from 'react-dom'
import axios from 'axios'

function HistoryItems({ onCloseHistory, doneItems }) {

    useEffect(() => {
        document.body.classList.add('overflow-hidden');


        return () => {
            document.body.classList.remove('overflow-hidden')
        }
    }, [])

    const renderedHistory = doneItems.map((done) => {
        let items = done.items
        const renderedItems = items.map((item) => {
            return <h2 key={item} >{item}</h2>
        })

        return <div key={done.data} >
            <h1>{done.data}</h1>
            {renderedItems}
        </div>
    })

    return ReactDom.createPortal(
        <div>
            <div onClick={() => onCloseHistory()} className='fixed inset-0 bg-gray-300 opacity-80 '></div>
            <div className='fixed inset-16 p-10 bg-regal-white' >
                <div className='flex flex-col justify-start h-full' >
                    <div className='items-center justify-center flex pb-10' >
                        <h1 className=' text-4xl' > Done </h1>
                        <h1 className=' pl-2 text-4xl text-red-600' > Items </h1>
                    </div>
                    {renderedHistory}
                </div>






                <div className='flex justify-end' >
                    <button onClick={() => onCloseHistory()} className='rounded-full bg-red-500 px-2 text-regal-white ' >Go back</button>
                </div>
            </div>
        </div>,
        document.querySelector('.modal-history')
    )
}

export default HistoryItems