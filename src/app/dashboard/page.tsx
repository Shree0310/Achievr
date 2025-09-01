import Dashboard from "../Components/Dashboard/Dashboard";
import Navbar from "../Components/Navbar/Navbar";
import Header from "../Components/Header/Header";
import SubHeader from "../Components/SubHeader/SubHeader";

// Force dynamic rendering to avoid ThemeProvider context issues during build
export const dynamic = 'force-dynamic';

export default function DashboardPage() {
    return (
        <div className="h-screen w-screen flex overflow-hidden">
            {/* Navbar - fixed on the left */}
            <div className="h-full flex-shrink-0">
                <Navbar />
            </div>

            {/* Main content area - takes remaining width */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header - fixed at top */}
                <div className="w-full">
                    <Header user={undefined} />
                </div>

                <div className="w-full">
                    <SubHeader />
                </div>

                <div className="flex">
                    {/* Board - takes remaining space */}
                    <div className="flex-1 overflow-auto">
                        <Dashboard />
                    </div>
   
                </div>

            </div>
        </div>
    );
}