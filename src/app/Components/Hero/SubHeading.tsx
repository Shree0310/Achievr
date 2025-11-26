import { cn } from "@/lib/utils";
import { ElementType } from "react";

const SubHeading = ({children, className, as}: {children?: React.ReactNode; className?: string, as?: "p" | "h2"}) => {
    const Tag: ElementType = as ?? "p";

    return <Tag className={cn("text-neutral-400 text-lg items-center max-w-3xl text-center selection:bg-white", className)}>
        {children}
    </Tag>
}
export default SubHeading;