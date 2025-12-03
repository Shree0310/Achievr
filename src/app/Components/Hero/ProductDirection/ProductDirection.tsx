"use client"
import { cn } from "@/lib/utils";
import Container from "../Container"
import Heading from "../Heading"
import SubHeading from "../SubHeading"
import { motion } from "motion/react";
import { Card, SkeletonOne } from "./Skeletons/first";
import SkeletonSecond from "./Skeletons/second";

const ProductDirection = () => {
    return <Container className="mt-10 md:pt-4 ">
        <div className="flex flex-col p-0  mt-12 justify-center items-center mx-auto">
                <Heading className="">
                    Set the development flow
                </Heading>
                <div className="mx-auto">
                <SubHeading className="mx-auto">
                    Align all the team members towrads the same goal. Plan, manage and track all product initiatives with achievr.        
                </SubHeading>
                <div className="mx-auto grid grid-cols-1 mt-10 md:grid-cols-2 border-y border-neutral-500 dark:border-neutral-700 divide-x divide-neutral-200 dark:divide-neutral-700">
                    <div className="p-4 mx-16">
                        <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-300">Manage products end to end</h2>
                        <p className="text-neutral-600 dark:text-neutral-500 text-balance">Consolidate specs, milestones, tasks, and other documentation in one centralized location.</p>
                        <CardSkeleton>
                            <SkeletonOne>
                                <Card/>
                            </SkeletonOne>
                        </CardSkeleton>
                    </div>
                    <div className="p-4 mx-auto">
                        <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-300">Project updates</h2>
                        <p className="text-neutral-600 dark:text-neutral-500 text-balance">Communicate progress and project health with built-in project updates.</p>
                         <CardSkeleton>
                            <SkeletonSecond/>
                        </CardSkeleton>
                    </div>
                </div>
            </div>
            </div>
    </Container>
}
export default ProductDirection;



export const CardSkeleton = ({className, children}:{className?: string, children?: React.ReactNode}) =>{
    return <div className={cn("relative md:h-80 h-96 flex flex-col mt-2  overflow-hidden perspective-distant ", className)}>
    {children}
</div>
}