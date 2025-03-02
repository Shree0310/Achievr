const SubHeader = () => {
    return <div className="mx-7 my-2 relative z-10">
    <div className="h-9 bg-[#ADAAB2] w-full rounded-lg">
        <div className="h-full flex items-center">
            <div className=" flex justify-center space-x-4">
                <ul className="flex text-xl text-gray-700 px-4">
                    <li className="mx-5">Overview</li>
                    <li className="mx-5">Board</li>
                    <li className="mx-5">Dashboard</li>
                    <li className="mx-5">This Week</li>
                    <li className="mx-5">This Cycle</li>
                </ul>
            </div>
        </div>
    </div>
    </div>
}

export default SubHeader;