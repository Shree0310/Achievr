import Image from "next/image";
import Board from "./Components/Board/Board";
import Header from "./Components/Header/Header";
import Navbar from "./Components/Navbar/Navbar";
import SubHeader from "./Components/SubHeader/SubHeader";
import Stages from "./Components/Stages/Stages";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import UserName from './Components/UserName/UserName';
import CreateTask from './Components/CreateTask/CreateTask';

export default async function Home() {
  const supabase = await createClient();
  const session = await supabase.auth.getSession();

  if (!session.data.session?.user) {
    return (
      <div className="flex flex-col items-center h-screen gap-4">
        <h1>
          Not Authenticated
          <Link className="btn bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded ml-3" href='/auth'>
            Sign In
          </Link>
        </h1>
      </div>
    )
  }

  const {
    user: { user_metadata }
  } = session.data.session;

  const { user_name } = user_metadata;
  const userName = user_name ? `@${user_name}` : 'user name not set';

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row overflow-hidden">
      {/* Navbar */}
      <div className="relative w-full md:w-auto md:h-screen">
        <UserName />
        <CreateTask/>
        <div className="h-auto md:h-full flex-shrink-0">
          <Navbar />
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col h-screen max-h-screen overflow-hidden">
        {/* Fixed header area */}
        <div className="flex-shrink-0">
          <Header />
          <SubHeader />
          <Board />
        </div>
        
        {/* Stages component - explicitly take all remaining space */}
        <div className="flex-1 overflow-hidden">
          <Stages />
        </div>
      </div>
    </div>
  );
}

