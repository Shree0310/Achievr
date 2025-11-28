import { cn } from "@/lib/utils";
import { ElementType } from "react";
import { motion } from "motion/react";

const SubHeading = ({children, className, as}: {children?: React.ReactNode; className?: string, as?: "p" | "h2"}) => {
    const Tag: ElementType = as ?? "div";

    return <Tag className={cn("text-neutral-400 text-lg items-center max-w-3xl text-left selection:bg-white", className)}>
        <motion.div 
            className="div"
            initial={{
                opacity:0,
                y:10,  
            }}
            animate={{
                opacity:1,
                y:0
            }}
            transition={{
                ease: "easeIn",
                duration:0.5,
                delay:1.2
            }}>
            {children}
        </motion.div>
    </Tag>
}
export default SubHeading;