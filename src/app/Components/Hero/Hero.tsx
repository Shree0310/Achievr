const Hero = () => {
    return <div className="h-screen dark:bg-gradient-to-t from-neutral-950 via-neutral-950 bg-white  to-sky-900 bg-transparent flex flex-col items-center justify-center">
        <h1 className="text-6xl font-semibold tracking-tight mt-10 mb-4 max-w-3xl text-center leading-tight bg-clip-text text-transparent bg-neutral-800 dark:bg-gradient-to-b dark:from-neutral-50 dark:to-neutral-500">
            Achievr- A tool to empower your Daily task managment and productivity
        </h1>
        <p className="text-neutral-400 text-lg items-center max-w-3xl text-center selection:bg-white">
            Say goodbye to the outdated financial tools. Every small business owner, regardless of the background, 
            can now manage their business like a pro. Simple. Intuitive. And never boring.
        </p>
        <div className="my-10 flex w-full max-w-lg">
            <input className="h-10 flex flex-1 dark:bg-neutral-900 mx-4 rounded-lg border border-neutral-600 focus:outline-none placeholder:text-neutral-300 p-2 focus:ring-1 transition  focus:ring-sky-500" 
                   placeholder="Enter your Email here..."/>
            <button className="text-neutral-400 relative border border-neutral-600 border-b-4s shadow-xl rounded-3xl p-2 cursor-pointer">
                Join the waitlist
                <div className="absolute bg-gradient-to-r from-transparent via-cyan-300 to-transparent inset-x-0 -bottom-px w-full h-px rounded-3xl"></div>
            </button>
        </div>
    </div>
}
export default Hero;