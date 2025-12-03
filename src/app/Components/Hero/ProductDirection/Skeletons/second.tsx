import { cn } from "@/lib/utils";
import { BsGraphDown } from "react-icons/bs";
import { VscGraphLine } from "react-icons/vsc";
import { GoGraph } from "react-icons/go";
import { IconType } from "react-icons"; // ← Change this

const SkeletonSecond = ({className, children}:{className?:string; children?:React.ReactNode}) => {
    return <div className={cn("perspective-distant h-[90%] w-full m-7 group", className)} style={{
        transform: "rotateX(30deg) rotateY(-30deg) rotateZ(0deg) scale(1.2) "
    }}>
        {children}
        <Card className="absolute bottom-4 left-20 z-30 translate-x-2 translate-y-0 text-neutral-500 hover:-translate-y-6 hover:text-red-500" title="Off Track" description="Unexpected challenges made us change the approach midway" date="Oct 3" icon={BsGraphDown} /> 
        <Card className="absolute bottom-16 left-12 z-20 translate-x-2 translate-y-0 text-neutral-500 hover:-translate-y-6 hover:text-yellow-500" title="At Risk" description="Progress slowed down last week because the cloudtop was down." date="Nov 16" icon={VscGraphLine} />
        <Card className="absolute bottom-28 left-4 z-10 translate-x-2 translate-y-0 text-neutral-500 hover:-translate-y-6 hover:text-green-500" title="On track" description="We are ready for production deployment next monday." date="Dec 1" icon={GoGraph} />
    </div>
}
export default SkeletonSecond;

export const Card = ({className, title, description, date, icon: Icon, children}:{className?: string; children?: React.ReactNode; title: string, description:string; date:string; icon: IconType; }) => {
    return <div className={cn("bg-gradient-to-b from-neutral-800 via-neutral-900 to-neutral-950 max-w-[80%] p-3 rounded-xl border border-neutral-700", className)}>
        {children}
        <div className="flex flex-col gap-1">
            <div className="flex gap-2">
                <span className="h-8 w-8 rounded-full bg-neutral-700 flex items-center justify-center">
                    <Icon className="size-4" />
                </span>
                <h1>{title}</h1>          
            </div>
            <p className="text-neutral-400 hover:text-neutral-200">{description}</p>
            <p className="text-neutral-400 hover:text-neutral-200">{date}</p>
        </div>
    </div>
}