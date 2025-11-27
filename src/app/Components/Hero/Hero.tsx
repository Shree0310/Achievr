"use client"

import Button from "./Button";
import Container from "./Container";
import Features from "./Features/Features";
import Heading from "./Heading";
import LandingImages from "./LandingImages";
import SubHeading from "./SubHeading";

const Hero = () => {
    return <div>
        <Container className="dark:bg-gradient-to-t from-neutral-950 via-neutral-950 bg-white  to-sky-900 bg-transparent flex flex-col items-center justify-center">
                <Heading delay={0.2} className="text-center max-w-4xl">
                    Achievr - A tool to empower your Daily task managment and productivity
                </Heading>
            <SubHeading>
                <div>Say goodbye to the outdated financial tools. Every small business owner, regardless of the background, 
                can now manage their business like a pro. Simple. Intuitive. And never boring.
                </div>
            </SubHeading>
            <div className="my-10 flex w-full max-w-lg justify-center">
                <Button>
                    Start building
                </Button>   
                <p className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-50 via-neutral-200 to-neutral-500 px-6 py-2 text-lg">New Agent for Slack</p>
 
            </div>
            <div className="my-5 flex w-full max-w-lg justify-center">
                <input className="h-10 flex flex-1 dark:bg-neutral-900 mx-4 rounded-lg border border-neutral-600 focus:outline-none placeholder:text-neutral-300 p-2 focus:ring-1 transition  focus:ring-sky-500" 
                    placeholder="Enter your Email here..."/>
                <button className="dark:text-neutral-400 text-neutral-600 relative border border-neutral-600 border-b-4s shadow-xl rounded-3xl p-2 cursor-pointer">
                    Join the waitlist
                    <div className="absolute bg-gradient-to-r from-transparent via-cyan-300 to-transparent inset-x-0 -bottom-px w-full h-px rounded-3xl"></div>
                </button>

            </div>
            <div className="my-24 flex w-full max-w-[800px] justify-center items-center">
                <LandingImages/>
            </div>
            <Features/>
        </Container>
    </div>
}
export default Hero;