import { cn } from "@/lib/utils";

const SkeletonOne = () => {
    return <div className="flex-1 rounded-t-3xl gap-2 flex flex-col bg-neutral-200 dark:bg-gradient-to-br from-neutral-800 via-neutral-900 to-black  border dark:border-neutral-600 border-neutral-200 mx-auto w-full h-full absolute inset-0 p-2">
        Skeleton One
        <Circle className="flex items-center justify-center shadow-sm">
        </Circle>
        <Circle className="border-neutral-200 dark:border-neutral-600 shadow-sm size-48 bg-neutral-200 dark:bg-neutral-800/60 z-[9]"></Circle>
        <Circle className="border-neutral-200 dark:border-neutral-600 shadow-sm size-56 bg-neutral-200 dark:bg-neutral-800/80 z-[9]"></Circle>
        <Circle className="border-neutral-200 dark:border-neutral-600 shadow-sm size-60 bg-neutral-200 dark:bg-neutral-900/80 z-[9]"></Circle>
        <Circle className="border-neutral-200 dark:border-neutral-600 shadow-sm size-72 bg-neutral-200 dark:bg-neutral-900/60 z-[9]"></Circle>
    </div>
}
export default SkeletonOne;

const Circle = ({className, children} : {className: string, children?: React.ReactNode}) => {
    return <div className={cn("size-32 z-[10] border border-transparent bg-neutral-200 dark:bg-neutral-700 rounded-full inset-0 m-auto absolute", className)}>
        {children}
    </div>
}