import { useState } from "react"

function EditInput({ clicked, deleteI, onEdit }) {

    const handleClicked = () => {
        clicked()
    }

    const handleEditClick = () => {
        onEdit()
    }

    const deleteItem = () => {
        deleteI()
    }

    return (
        <div className="flex flex-row justify-center items-center mt-32" >
            <div className=" bg-red-600 w-auto h-2/6 px-auto rounded-full justify-start items-center flex flex-row">
                <i className="ri-edit-circle-fill text-6xl text-regal-white" onClick={handleEditClick}></i>
                <i className="ri-checkbox-circle-line text-6xl text-regal-white ml-6"></i>
                <i onClick={deleteItem} className="ri-close-circle-fill text-6xl text-regal-white"></i>
                <i className="ri-add-circle-fill text-6xl text-regal-white ml-6 hover:text-white" onClick={handleClicked} ></i>
            </div>
        </div>
    )
}

export default EditInput