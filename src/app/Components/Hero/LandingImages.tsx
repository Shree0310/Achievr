import { motion } from "motion/react";
import Image from "next/image";
import hero from "../../../utils/Images/hero.png"
import { cn } from "@/lib/utils";

const LandingImages = () => {
    return (
        <div className="relative w-full min-h-140 perspective-distant flex items-center justify-center pt-20 mt-56 mb-24">
            {/* Back card - rotated */}
            <motion.div
                className="absolute translate-x-20"
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
                    width={2600}
                    height={1200}
                    className={cn(
                        "rounded-lg shadow-2xl inset-0",
                        "blur-[1px] brightness-90 dark:brightness-75",
                    )}
                    style={{
                        transform: 'rotateY(20deg) rotateX(30deg) rotateZ(-20deg)',
                        width: '1200px',
                        height: 'auto'
                    }}
                />
            </motion.div>

            {/* Front card - on top */}
            <motion.div
                className="absolute translate-x-20 -translate-y-40"
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
                    width={2600}
                    height={1200}
                    className={cn("rounded-2xl shadow-2xl inset-0 ", 
                                  "[mask-image:linear-gradient(to_bottom,black_0%,transparent_100%",
                                  "linear-gradient(to_right,black_0%,transparent_100%)] [mask-image:linear-gradient(to_right,black_0%,transparent_100%)]"
                                )}
                    style={{
                        transform: 'rotateY(20deg) rotateX(30deg) rotateZ(-20deg)',
                        width: '1200px',
                        height: 'auto'
                    }}
                />
            </motion.div>
        </div>
    );
}
export default LandingImages;