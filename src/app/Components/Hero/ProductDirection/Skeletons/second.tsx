import { cn } from "@/lib/utils";
import { BsGraphDown } from "react-icons/bs";
import { VscGraphLine } from "react-icons/vsc";
import { GoGraph } from "react-icons/go";

const SkeletonSecond =  ({className, children}:{className?:string; children?:React.ReactNode}) => {
                return <div className={cn("perspective-distant h-[90%] w-full m-7 group", className)} style={{
        transform: "rotateX(30deg) rotateY(-30deg) rotateZ(0deg) scale(1.2) "
    }}>
        {children}
        <Card className="absolute bottom-4 left-20 z-30 translate-x-2 translate-y-0 hover:-translate-y-6" title="Off Track" titleColor="text-red-500" description="Unexpected challenges made us change the approach midway" date="Oct 3" icon={ <BsGraphDown className='size-5' />}  ></Card>
        <Card className="absolute bottom-16 left-12 z-20 translate-x-2 translate-y-0  hover:-translate-y-6" title="At Risk" titleColor="text-yellow-500" description="Progress slowed down last week because the cloudtop was down." date="Nov 16" icon={<VscGraphLine className='size-5' />}></Card>
        <Card className="absolute bottom-28 left-4 z-10 translate-x-2 translate-y-0  hover:-translate-y-6" title="On track" titleColor="text-green-500" description="We are ready for production deployment next monday." date="Dec 1" icon={<GoGraph className='size-5' />}></Card>
    </div>
}
export default SkeletonSecond;

export const Card = ({className, title, titleColor, description, date, icon, children}:{className?: string; children?: React.ReactNode; title: string, description:string; date:string; icon: React.ReactNode; titleColor: string; }) => {
return <div className={cn("bg-gradient-to-b from-neutral-800 via-neutral-900 to-neutral-950  max-w-[80%] p-3  rounded-xl border border-neutral-700", className)}>
        {children}
        <div className="flex flex-col gap-1">
            <div className="flex gap-2">
                <span className={titleColor}>{icon}</span>
                <h1  className={titleColor}>{title}</h1>
                
                
            
            </div>
            <p className="text-neutral-500">{description}</p>
            <p className="text-neutral-500">{date}</p>
        </div>
    </div>
}