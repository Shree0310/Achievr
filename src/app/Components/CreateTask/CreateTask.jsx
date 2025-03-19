'use client'

import { useState } from "react";

const CreateTask = () => {
    const [isOpen, setIsOpen] = useState(false);

    return <div>
        <div className="absolute h-4  w-44 z-30 top-4 left-4 py-12 rounded-md">
            <div className="bg-[#D9D9D9] p-2 shadow-md rounded-md">
                <button className="text-gray-800 items-center"
                    onClick={() =>setIsOpen(!isOpen)}>Create Task</button>
            </div>
        </div>
        {isOpen && (
            <div className="fixed inset-0 flex justify-center py-36 px-20">
                <div className=" bg-[#F4EEEE]  w-1/2 h-full rounded-lg shadow-md">
                <h1 className="bg-[]#D9D9D9 h-12 px-8 py-2 text-gray-500 shadow-sm rounded-md">Create a task</h1>
                    <div className="flex flex-col p-10 space-y-4">
                        <input 
                        type="text" 
                        placeholder="Title"
                        className="h-12 px-8 py-2 border border-gray-500 rounded-sm shadow-sm focus:border-blue-500"/>
                        <input 
                        type="text" 
                        placeholder="Description"
                        className="h-24 px-8 py-2 border border-gray-500 rounded-sm shadow-sm focus:border-blue-500"
                        />
                        <div className="flex justify-center space-x-2">
                            <input 
                            type="text" 
                            placeholder="Priority"
                            className="h-12 w-36 px-8 py-2 border border-gray-500 rounded-sm shadow-sm focus:border-blue-500"/>
                            <input 
                            type="dropdown" 
                            placeholder="Efforts"
                            className="h-12 w-36 px-8 py-2 border border-gray-500 rounded-sm shadow-sm focus:border-blue-500"/>    
                        </div>
                        <div className="flex px-4 space-x-2 justify-end">
                            <button className="bg-[#D9D9D9] hover:bg-gray-500 text-black font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                                Cancel
                            </button>
                            <button className="bg-[#AA96AF] hover:bg-violet-500 font-medium py-2 px-4 rounded-md hover:cursor-pointer text-white">
                                Create
                            </button>
                        </div>
                    </div>                   
                </div>

            </div>
        )}
    </div>
}
export default CreateTask;