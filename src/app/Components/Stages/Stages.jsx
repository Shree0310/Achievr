import Tasks from "../Tasks/Tasks";

const Stages = () => {
    return <div className="mx-[26px] mt-2 relative z-10">
                <div>
            <Tasks/>
        </div>
        <div className="flex gap-4">
            <div className="bg-[#C1C1C1] w-72 h-screen rounded-lg">
                <p className="py-4 text-center text-gray-700 text-lg">Not Started</p>
            </div>
            <div className="bg-[#C1C1C1] w-72 h-screen rounded-lg ml-4">
                <p className="py-4 text-center text-gray-700 text-lg">In Progress</p>
            </div>
            <div className="bg-[#C1C1C1] w-72 h-screen rounded-lg ml-4">
                <p className="py-4 text-center text-gray-700 text-lg">Under Review</p>
            </div>
            <div className="bg-[#C1C1C1] w-72 h-screen rounded-lg ml-4">
                <p className="py-4 text-center text-gray-700 text-lg">Completed</p>
            </div>
        </div>
    </div>
}

export default Stages;