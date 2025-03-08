import { createClient } from "@/utils/supabase/server";

export default async function UserName() {

    const supabase = await createClient();

    const session = await supabase.auth.getUser();

    //console.log(session.data.user);

    const {
        data: { user }
    } = await supabase.auth.getUser();

    console.log(user.user_metadata);


    const user_name = user.user_metadata?.name;
    //console.log(user_name);
    const userName = user_name || "user name not set";


    return (
        <div>
            <div className="absolute h-4  w-44 z-30 top-4 left-4">
                <div className="bg-[#D9D9D9] p-2 shadow-md ">
                <p className="text-gray-800">{userName}</p>
                </div>
            </div>
        </div>
    )

}
