import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";
import kanbanHero from "@/app/illustrations/speed-lines.svg";
import Image from "next/image";


const SkeletonThree = () => {
return <div className="flex items-center justify-center relative h-full w-full">
    <Image 
        src={kanbanHero} 
        alt="Achievr Kanban Board" 
        width={200} 
        height={150}
        className="relative z-20"
        />
      <DottedGlowBackground
        className="pointer-events-none mask-radial-to-70% mask-radial-at-center"
        opacity={1}
        gap={10}
        radius={1.6}
        colorLightVar="--color-neutral-500"
        glowColorLightVar="--color-neutral-200"
        colorDarkVar="--color-neutral-500"
        glowColorDarkVar="--color-sky-800"
        backgroundOpacity={0}
        speedMin={0.3}
        speedMax={1.6}
        speedScale={1}
      />
    </div>
}
export default SkeletonThree;