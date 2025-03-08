"use client"

import { signInWithGoogle } from "@/utils/actions";

const Login = () => {
    return <div>
        <div className="flex h-screen w-screen items-center justify-center bg-[#AA96AF]">
            <div className="flex flex-col">
                <h1 className="text-center text-lg font-bold">LOGIN</h1>
                <form>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" formAction={signInWithGoogle}>
                        Sign In With Google
                    </button>
                </form>
            </div>

        </div>
    </div>
}

export default Login;