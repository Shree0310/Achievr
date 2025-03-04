import Image from "next/image";
import Board from "./Components/Board/Board";
import Dashboard from "./Components/Dashboard/Dashboard";
import Header from "./Components/Header/Header";
import Navbar from "./Components/Navbar/Navbar";
import SubHeader from "./Components/SubHeader/SubHeader";
import Stages from "./Components/Stages/Stages";
import Tasks from "./Components/Tasks/Tasks";
import Activity from "./Components/Activity/Activity";

export default function Home() {
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
          <Header />
        </div>

        <div className="w-full">
          <SubHeader />
        </div>

        {/* Board - takes remaining space */}
        <div className="flex-1 overflow-auto">
          <Board />
        </div>

        <div>
          <Stages />
        </div>

        <div>
          <Dashboard />
        </div>


      </div>
    </div>
  );
}

