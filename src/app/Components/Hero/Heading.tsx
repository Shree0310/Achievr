import type { ElementType } from "react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

const Heading = ({ children, className, delay = 0, as }: { children: string; className?: string;delay?: number;
 as?: "h1" | "h2"; }) => {
    const Tag: ElementType = as ?? "h2";

    return (
                <Tag className={cn("text-[56px] font-bold tracking-tighter mb-4 " ,
                    "leading-tight",
                    "dark:text-neutral-200 text-left",
                    "bg-clip-text text-transparent bg-gradient-to-r from-neutral-50 via-neutral-200 to-neutral-500 px-6 py-2"
                    , className)}>

            {children.split(" ").map((word,idx)=>(
                <motion.span
                    initial={{
                        filter: "blur(10px)",
                        opacity: 0,
                        y: 10
                    }}
                    whileInView={{
                        filter: "blur(0)",
                        opacity: 1,
                        y:0
                    }}
                    transition= {{
                        delay: delay + idx*0.1,
                        duration: 0.3,
                        ease:"easeInOut"
                    }}
                    key={word+idx}
                    viewport={{
                        once:true
                    }}
                    className="inline-block">
                    {word} &nbsp;
                </motion.span>
            ))}
        </Tag>
    );
}
export default Heading;