import Image from "next/image";
import Board from "./Components/Board/Board";
import Dashboard from "./Components/Dashboard/Dashboard";
import Header from "./Components/Header/Header";
import Navbar from "./Components/Navbar/Navbar";
import SubHeader from "./Components/SubHeader/SubHeader";
import Stages from "./Components/Stages/Stages";
import Tasks from "./Components/Tasks/Tasks";
import Activity from "./Components/Activity/Activity";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import UserName from './Components/UserName/UserName';

export default async function Home() {

  const supabase = await createClient();

  const session = await supabase.auth.getSession();

  // Force unauthenticated state for testing

  // console.log(session);
  // console.log(session.data.session?.user);

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
    user: { user_metadata, app_metadata }
  } = session.data.session;

  const { name, email, user_name, avatar_url } = user_metadata

  const userName = user_name ? `@${user_name}` : 'user name not set';

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row overflow-hidden">
      {/* Navbar - fixed on the left, full width on mobile */}
      <div className="relative w-full md:w-auto">
        <UserName />
        <div className="h-auto md:h-full flex-shrink-0">
          <Navbar />
        </div>
      </div>

      {/* Main content area - takes remaining width */}
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        {/* Header - fixed at top */}
        <div className="w-full">
          <Header />
        </div>

        <div className="w-full">
          <SubHeader />
        </div>

        {/* Board - takes remaining space */}
        <div className="flex-1">
          <Board />
        </div>

        {/* Stages (which now contains Tasks) */}
        <div className="pb-6">
          <Stages />
        </div>
      </div>
    </div>
  );
}

