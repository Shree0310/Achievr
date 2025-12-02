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
                <Heading delay={0.2} className="max-w-4xl">
                    Achievr - A tool to empower your daily task managment and productivity
                </Heading>
            <SubHeading className="ml-10">
                <div>Say goodbye to context-switching between your tasks and your code. Every developer, regardless of stack or setup, can now work like the pros. Integrated. Intuitive. And never in your way.
                </div>
            </SubHeading>
            <div className="my-6 mt-10 flex w-full max-w-lg justify-center items-start">
                <Button>
                    Start building
                </Button>   
                <p className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-50 via-neutral-200 to-neutral-500 px-6 py-2 text-lg">New Agent for Slack</p>
 
            </div>
            <div className="my-12 flex w-full justify-center items-center translate-x-10 -translate-y-15">
                <LandingImages/>
            </div>
            <Features/>
        </Container>
    </div>
}
export default Hero;