import { motion } from "motion/react";
import Image from "next/image";
import hero from "../../../utils/Images/hero.png"
import { cn } from "@/lib/utils";

const LandingImages = () => {
    return (
        <div className="relative w-full min-h-140 perspective-distant flex items-center justify-center pt-32 mt-48 mb-40">
            {/* Back card - rotated */}
            <motion.div
                className="absolute translate-x-60 -translate-y-20"
                initial= {{
                    opacity:0,
                    y: -100
                }}
                animate={{
                    opacity:1,
                    y: 0
                }}
                 transition={{
                    duration:0.3,
                    delay:1.5,
                    ease:"easeOut"
                }}
                >
                <Image
                    src={hero}
                    alt="Hero illustration background"
                    width={1000}
                    height={600}
                    className={cn(
                        "rounded-lg shadow-2xl inset-0",
                        "blur-[2px] brightness-80 dark:brightness-65",
                    )}
                    style={{
                        transform: 'rotateY(20deg) rotateX(40deg) rotateZ(-20deg)',
                        width: '1000px',
                        height: '600px'
                    }}
                />
            </motion.div>

            {/* Front card - on top */}
            <motion.div
                className="absolute translate-x-80 -translate-y-70"
                initial= {{
                    opacity:0,
                    y: -200
                }}
                animate={{
                    opacity:1,
                    y:-100,
                }}
                transition={{
                    delay:1.6,
                    duration:0.5,
                    ease:"easeOut"
                }}
            >
                <Image
                    src={hero}
                    alt="Hero illustration foreground"
                    width={1600}
                    height={800}
                    className={cn("rounded-2xl shadow-2xl inset-0 ", 
                                  "[mask-image:linear-gradient(to_bottom,black_0%,transparent_100%",
                                  "linear-gradient(to_right,black_0%,transparent_100%)] [mask-image:linear-gradient(to_right,black_0%,transparent_100%)]"
                                )}
                    style={{
                        transform: 'rotateY(20deg) rotateX(40deg) rotateZ(-20deg)',
                        width: '1000px',
                        height: '600px',
                        opacity: 0.7
                    }}
                />
            </motion.div>
        </div>
    );
}
export default LandingImages;