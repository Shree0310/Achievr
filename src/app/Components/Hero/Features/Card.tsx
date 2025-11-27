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

export const CardTitle = ({children, className}:{children?: React.ReactNode, className?:string}) => {
    return <div className={cn("text-lg font-bold", className)}>
        {children}
    </div>
}