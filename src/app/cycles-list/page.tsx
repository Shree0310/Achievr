import Header from '../Components/Header/Header';
import Navbar from '../Components/Navbar/Navbar';
import SubHeader from '../Components/SubHeader/SubHeader';
import Cycles from '../Components/Cycles/Cycles';
import { createClient } from '@/utils/supabase/server';

export default async function CycleListPage(){
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
                    <Cycles
                    userId={userId}/>
                </div>

            </div>

        </div>
    </div>
    );
}