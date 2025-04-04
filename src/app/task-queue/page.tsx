import Header from '../Components/Header/Header';
import Navbar from '../Components/Navbar/Navbar';
import SubHeader from '../Components/SubHeader/SubHeader';
import TaskQueue from '../Components/TaskQueue/TaskQueue';
import UserName from '../Components/UserName/UserName';
import CreateTaskButton from '../Components/CreateTask/CreateTaskButton';
import { createClient } from '@/utils/supabase/server';

export default async function TaskQueuePage(){
    const supabase = await createClient();
    const session = await supabase.auth.getSession();
    const userId = session.data.session?.user?.id;


    return (
        <div className="h-screen w-screen flex overflow-hidden">
        {/* Navbar - fixed on the left */}
        <div className="relative w-full md:w-auto md:h-screen">
        {/* <CreateTaskButton 
        /> */}
        <div className="h-auto md:h-full flex-shrink-0">
          <Navbar />
        </div>
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

            <div className="flex">
                {/* Board - takes remaining space */}
                <div className="flex-1 overflow-auto">
                    <TaskQueue
                    userId={userId} />
                </div>

            </div>

        </div>
    </div>
    );
}