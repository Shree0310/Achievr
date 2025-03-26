import { createClient } from "@/utils/supabase/server";

export default async function UserName({position = "left"}) {

    const supabase = await createClient();

    const session = await supabase.auth.getUser();

    //console.log(session.data.user);

    const {
        data: { user }
    } = await supabase.auth.getUser();

    console.log(user.user_metadata);


    const user_name = user.user_metadata?.name;
    console.log("user_name: ", user_name);

    const getInitials =(name)=>{
        return name
        .split(' ')
        .map(part => part.charAt(0).toUpperCase())
        .join('');
    }

    const userInitials = getInitials(user_name);
    const userName = user_name || "user name not set";

    const nameClasses = position === "right" ? "text-right" : "text-left";

    return (
        <div>
            <div className=" z-30 top-4 left-4 pb-2">
                <div className="p-2 rounded-full bg-accent-500 border-2 border-black">
                <p className={`text-gray-800 font-semibold text-sm ${nameClasses}`}>{userInitials}</p>
                </div>
            </div>
        </div>
    )

}
