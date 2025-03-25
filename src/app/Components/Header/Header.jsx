const Header = () =>{
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const currentMonth = monthNames[new Date().getMonth()];

    return <div className="mx-4 mt-4 relative z-10">
    <div className="bg-white rounded-lg">
        <div className="h-full flex items-center">
            <div className="flex space-x-4">
                <ul className="text-primary-500 font-semibold text-2xl px-6">
                    <li>{currentMonth}</li>
                </ul>
            </div>
        </div>
    </div>
    </div>
    
}

export default Header;