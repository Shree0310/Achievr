import { cn } from "@/lib/utils";

export const SkeletonOne = ({className, children}:{className?:string; children?:React.ReactNode}) => {
            return <div className={cn("flex-1 w-full h-full inset-x-0 absolute bg-neutral-400 dark:bg-neutral-700  mx-auto p-3 mt-3 rounded-xl border  border-neutral-200 dark:border-neutral-700 ", className)}>
            {children}
        </div>
}