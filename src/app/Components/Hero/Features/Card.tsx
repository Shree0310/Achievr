import { cn } from "@/lib/utils";
import React from "react";

const Card = ({className, children}:{children:React.ReactNode; className:string;}) => {
    return <div className={cn("dark:bg-neutral-800 bg-neutral-100 rounded-md p-4", className)}>
        {children}
    </div>
}
export default Card;

export const CardContent = ({children, className}:{children:React.ReactNode; className?: string}) => {
    return <div className={cn("px-4 pb-6",className)}>
        {children}
    </div>
}

export const CardCTA = ({className, children, ...rest}: React.ComponentProps<"button">) => {
    return <button className={cn("border border-neutral-700 rounded-full shrink-0 size-5 flex items-center justify-center active:scale-[0.98] transition duration-200", className)}
                    {...rest}>
                {children}
            </button>
}

export const CardTitle = ({children, className}:{children?: React.ReactNode, className?:string}) => {
    return <div className={cn("text-lg font-bold ", className)}>
        {children}
    </div>
}

export const CardSkeleton = ({className, children}:{className?:string; children?:React.ReactNode}) => {
     return <div className={cn("relative md:h-60 h-40 overflow-hidden perspective-distant mask-radial-from-50%", className)}>
        {children}
    </div>
}