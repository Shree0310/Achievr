import { motion } from "motion/react";
import Image from "next/image";
import hero from "../../../utils/Images/hero.png"
import { cn } from "@/lib/utils";

const LandingImages = () => {
    return <div className="relative min-h-140 w-full flex pt-20 perspective-distant transform-3d justify-center">
        <motion.div className="perspective-[4000px]">
            <Image src={hero} 
                        alt="Hero illustration" 
                        width={1820} 
                        height={820}
                        className={cn("absolute rounded-lg shadow-2xl mt-64")}
                        style={{
                            transform: "rotateY(20deg) rotateX(30deg) rotateZ(50deg)"
                        }}
                 />
        </motion.div>
        <motion.div className="perspective-[4000px]">
            <Image src={hero} 
                    alt="Hero illustration" 
                    width={1820} 
                    height={820}
                    className="absolute rounded-lg shadow-2xl mt-24"
                />
        </motion.div>
    </div>
}
export default LandingImages;