import type { ElementType } from "react";
import { cn } from "@/lib/utils";

const Heading = ({ children, className, as }: { children: React.ReactNode; className?: string; as?: "h1" | "h2"; }) => {
    const Tag: ElementType = as ?? "h1";

    return (
        <Tag className={cn("text-6xl font-semibold tracking-tight mb-4 max-w-3xl text-center leading-tight bg-clip-text text-transparent bg-neutral-800 dark:bg-gradient-to-b dark:from-neutral-50 dark:to-neutral-500", className)}>
            {children}
        </Tag>
    );
}
export default Heading;