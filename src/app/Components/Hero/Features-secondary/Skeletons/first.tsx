import { GitHubIcon, MetaIcon, SlackIcon } from "@/app/icons";
import { cn } from "@/lib/utils";
import SkeletonTwo, { CardTwo } from "../../Features/Skeletons/second";
import { CardSkeleton } from "../../Features/Card";

const SkeletonOne = () => {
    return <div className="flex-1 rounded-t-3xl gap-2 mt-6 flex items-center justify-center bg-neutral-200 dark:bg-gradient-to-br from-neutral-800 via-neutral-900 to-black mx-auto w-full h-full absolute inset-0 p-2"
           >
        <Circle className="flex items-center justify-center shadow-sm">
            <div className="size-10 absolute inset-0 flex items-center justify-center border border-transparent rounded-sm ring-1 shadow-white/70 ring-white/70 shadow-sm animate-orbit [--translate-position:120px] [--orbit-duration:10s]">
                <SlackIcon className="size-8"/>
            </div>
            <div className="size-10 absolute inset-0 flex items-center justify-center border border-transparent rounded-sm ring-1 shadow-white/70 ring-white/70 shadow-sm animate-orbit [--translate-position:160px] [--orbit-duration:20s]">
                <MetaIcon className="size-8"/>
            </div>
            <div className="size-10 absolute inset-0 flex items-center justify-center border border-transparent rounded-sm ring-1 shadow-white/70 ring-white/70 shadow-sm animate-orbit [--translate-position:180px] [--orbit-duration:30s]">
                <GitHubIcon className="size-8"/>
            </div>
            {/* <div className="absolute inset-0 flex items-center justify-center border border-transparent rounded-sm ring-1 shadow-white/70 ring-white/70 shadow-sm animate-orbit [--translate-position:220px] [--orbit-duration:60s]">
                 <CardTwo className="absolute top-14 left-7 translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:-translate-y-0 scale-x-110 group-hover:scale-100
                    transition-all duration-300  "/>
            </div> */}
        </Circle>
        <Circle className="border-neutral-200 dark:border-neutral-600 shadow-sm size-60 bg-neutral-200 dark:bg-neutral-800/80 z-[9] relative">
        </Circle>
        <Circle className="border-neutral-200 dark:border-neutral-600 shadow-sm size-80 bg-neutral-200 dark:bg-neutral-800/60 z-[8]"></Circle>
        <Circle className="border-neutral-200 dark:border-neutral-600 shadow-sm size-80 bg-neutral-200 dark:bg-neutral-900/40 z-[7]"></Circle>
        <Circle className="border-neutral-200 dark:border-neutral-600 shadow-sm size-96 bg-neutral-200 dark:bg-neutral-900/20 z-[6]"></Circle>
    </div>
}
export default SkeletonOne;

const Circle = ({className, children} : {className: string, children?: React.ReactNode}) => {
    return <div className={cn("size-40 z-[10] border border-transparent bg-neutral-200 dark:bg-neutral-700 rounded-full inset-0 m-auto absolute", className)}>
        {children}
    </div>
}