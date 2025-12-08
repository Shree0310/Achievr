import Image from "next/image";
import Container from "../Container";
import { CardSkeleton } from "../ProductDirection/ProductDirection";
import SkeletonOne from "./Skeletons/first";
import lineGraph from "../../../../utils/Images/line-graph.png"
import { cn } from "@/lib/utils";

const FeaturesSecondary = () => {
    return <Container className="mt-36 md:pt-4 ">
        <div className="mx-auto grid grid-cols-1 mt-10 md:grid-cols-2 border-y border-neutral-500 dark:border-neutral-700 divide-x divide-neutral-200 dark:divide-neutral-700">
                    <div className="p-4 mx-16">
                        <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-300 my-4">Manage incoming work with Triage</h2>
                        <p className="text-neutral-600 dark:text-neutral-500 text-balance">Review and assign incoming bug reports, feature requests, and other unplanned work.</p>
                        <CardSkeleton>
                            <SkeletonOne/>
                        </CardSkeleton>
                    </div>
                    <div className="p-4 mx-auto">
                        <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-300 ml-16 my-4">Build momentum with Cycles</h2>
                        <p className="text-neutral-600 dark:text-neutral-500 text-balance ml-16">Create healthy routines and focus your team on what work should happen next.</p>
                         <CardSkeleton>
                            <Image
                                src={lineGraph}
                                alt="Hero illustration background"
                                width={500}
                                height={500}
                                className={cn(
                                    "rounded-lg shadow-2xl left-16 m-auto p-10 opacity-65",
                                )}
                            />
                        </CardSkeleton>
                    </div>
                </div>
    </Container>
}
export default FeaturesSecondary;