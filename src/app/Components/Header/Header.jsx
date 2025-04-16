import UserName from '../UserName/UserName';

const Header = () => {
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const currentMonth = monthNames[new Date().getMonth()];
    const currentYear = new Date().getFullYear();

    return (
        <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <h1 className="text-2xl font-semibold text-gray-800">{currentMonth}</h1>
                    <span className="text-gray-400">|</span>
                    <span className="text-gray-500">{currentYear}</span>
                </div>
                <div className="flex items-center">
                    <UserName position="right" />
                </div>
            </div>
        </div>
    );
}

export default Header;