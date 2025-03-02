const Tasks = () => {
    return <div className="absolute z-20 top-44 mx-10">
        <div className="flex gap-16">
            {/* Not Started tasks */}

            <div className="flex flex-col gap-2">
                <div className="bg-white w-60 h-44 rounded-lg shadow-lg">
                    <p className="text-gray-600 p-4"> Task 1</p>
                </div>
                <div className="bg-white w-60 h-44 rounded-lg shadow-lg">
                    <p className="text-gray-600 p-4"> Task 2</p>
                </div>
                <div className="bg-white w-60 h-44 rounded-lg shadow-lg">
                    <p className="text-gray-600 p-4"> Task 3</p>
                </div>
            </div>
            {/* In Progress tasks */}

            <div className="flex flex-col gap-2">
                <div className="bg-white w-60 h-44 rounded-lg shadow-lg">
                    <p className="text-gray-600 p-4"> Task 1</p>
                </div>
                <div className="bg-white w-60 h-44 rounded-lg shadow-lg">
                    <p className="text-gray-600 p-4"> Task 2</p>
                </div>
                <div className="bg-white w-60 h-44 rounded-lg shadow-lg">
                    <p className="text-gray-600 p-4"> Task 3</p>
                </div>
            </div>
            {/* Under-Review tasks */}
            <div className="flex flex-col gap-2">
                <div className="bg-white w-60 h-44 rounded-lg shadow-lg">
                    <p className="text-gray-600 p-4">Task 3</p>
                </div>
                <div className="bg-white w-60 h-44 rounded-lg shadow-lg">
                    <p className="text-gray-600 p-4">Task 4</p>
                </div>
            </div>
            {/* Completed tasks */}
            <div className="flex flex-col gap-2">
                <div className="bg-white w-60 h-44 rounded-lg shadow-lg">
                    <p className="text-gray-600 p-4">Task 1</p>
                </div>
            </div>
        </div>



    </div>
}

export default Tasks;