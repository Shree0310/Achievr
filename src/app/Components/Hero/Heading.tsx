import type { ElementType } from "react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

const Heading = ({ children, className, delay = 0, as }: { children: string; className?: string;delay?: number;
 as?: "h1" | "h2"; }) => {
    const Tag: ElementType = as ?? "h1";

    return (
                <Tag className={cn("text-6xl font-semibold tracking-tight mb-4 max-w-3xl" ,
                    "text-center leading-tighter",
                    " dark:text-neutral-200 text-left"
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