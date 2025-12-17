import { GitHubIcon, GoogleSheetsIcon, MetaIcon, SlackIcon } from "@/app/icons";
import { cn } from "@/lib/utils";
import SkeletonTwo, { CardTwo } from "../../Features/Skeletons/second";
import { CardSkeleton } from "../../Features/Card";
import { IconCircleDashedCheck, IconClock, IconRipple } from "@tabler/icons-react";

const SkeletonOne = () => {
    return <div className="flex-1 rounded-t-3xl gap-2 mt-6 flex items-center justify-center mx-auto w-full h-full absolute inset-0 p-2"
            style={{
                transform: "rotateY(20deg) rotateX(20deg) rotateZ(-20deg)"
            }}
           >
        <Circle className="flex items-center justify-center shadow-lg">
            <RevolvingCard className="[--translate-position:120px] [--orbit-duration:10s]">
                <SlackIcon className="size-8"/>
            </RevolvingCard>
            <RevolvingCard className="[--translate-position:180px] [--orbit-duration:30s]">
                <GitHubIcon className="size-8"/>
            </RevolvingCard>
            <RevolvingCard className="[--translate-position:200px] [--orbit-duration:50s] ring-0 shadow-nono bg-transparent w-60">
                <SkeletonCard
                    className="-bottom-2 left-12 z-30 max-w-[90%] absolute"
                    icon={ <IconCircleDashedCheck className='size-5' stroke={2} />} 
                    badge={<Badge text="1205" variant='danger'/>} 
                    title='Task Planner'
                    description='From idea to code in one view, Never lose track of "why"'/>
            </RevolvingCard>
             <RevolvingCard className="[--translate-position:220px] [--orbit-duration:60s]">
                <GoogleSheetsIcon className="size-8"/>
            </RevolvingCard>
        </Circle>
        <Circle className="border-neutral-200 dark:border-neutral-700 shadow-md size-60 bg-neutral-200/10 dark:bg-neutral-800/80 z-[9] relative">
        </Circle>
        <Circle className="border-neutral-200 dark:border-neutral-700 shadow-md size-80 bg-neutral-200/20 dark:bg-neutral-800/60 z-[8]"></Circle>
        <Circle className="border-neutral-200 dark:border-neutral-700 shadow-md size-80 bg-neutral-200/30 dark:bg-neutral-800/40 z-[7]"></Circle>
        <Circle className="border-neutral-200 dark:border-neutral-700 shadow-md size-96 bg-neutral-200/40 dark:bg-neutral-800/30 z-[6]"></Circle>
    </div>
}
export default SkeletonOne;

const Circle = ({className, children} : {className: string, children?: React.ReactNode}) => {
    return <div className={cn("size-40 z-[10] border border-transparent bg-neutral-200 dark:bg-neutral-700 rounded-full inset-0 m-auto absolute", className)}>
        {children}
    </div>
}

const RevolvingCard = ({children, className}: {children: React.ReactNode, className: string}) => {
    return <div className={cn("size-10 absolute inset-0 m-auto flex items-center justify-center border border-transparent rounded-sm ring-1 shadow-white/70 ring-white/70 shadow-sm animate-orbit ", className)}>
        {children}
    </div>
}

export const SkeletonCard = ({className, icon, title, description, badge}:{className:string; icon: React.ReactNode, title: string, description: string, badge: React.ReactNode}) => {
    return <div className={cn("max-w-[80%] h-fit my-auto mx-auto w-full p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-2xl", className)}>
        <div className="flex gap-3 items-center">
            {icon}
            <p className='text-md font-normal text-black dark:text-neutral-200/80'>
                {title}
            </p>
            {badge}
        </div>
        <p className='text-sm text-neutral-500 dark:text-neutral-400/60 font-medium'>{description}</p>
    </div>
}

const Badge = ({ variant, text }: {variant?: "danger" | "success" | "warning"; text: string}) => {
    return <div className={cn("px-1 py-0.5 rounded-full flex items-center gap-1 w-fit",
                variant === "danger" && 'bg-red-500/50 border border-red-400 text-red-300',
                variant === "success" && 'bg-green-500/50 border border-green-600 text-green-300',
                variant === "warning" && 'bg-yellow-300/50 border border-yellow-500 text-yellow-200'
    )}>
        <IconClock className='size-3' stroke={2} />
        <IconRipple className='size-3' stroke={2} />
        <p className='text-xs font-bold'>{text}</p>
    </div>
}
