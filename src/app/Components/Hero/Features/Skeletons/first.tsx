import { cn } from '@/lib/utils';
import { IconCircleDashedCheck } from '@tabler/icons-react';
import { IconExclamationCircle } from '@tabler/icons-react';
import { IconChartAreaLine } from '@tabler/icons-react';
import { IconClock } from '@tabler/icons-react';
import { IconRipple } from '@tabler/icons-react';

export const SkeletonOne = () => {
    return <div className="perspective-distant h-full w-full mt-3 -translate-x-10 " style={{
        transform: "rotateX(35deg) rotateY(-20deg) rotateZ(30deg) scale(1.2) "
    }}>
        <SkeletonCard 
            className="-bottom-2 left-12 z-30 max-w-[90%] absolute"
            icon={ <IconCircleDashedCheck className='size-5' stroke={2} />} 
            badge={<Badge text="1205" variant='danger'/>} 
            title='Task Planner'
            description='From idea to code in one view, Never lose track of "why"'/>
        <SkeletonCard
            className="bottom-10 left-8 z-20 absolute"
            icon={ <IconExclamationCircle 
            className='size-5' stroke={2} />} 
            badge={<Badge text="455" variant='success'/>} 
            title='Issue Tracker'description='Decision Documentation, with Clear Ownership'/>
        <SkeletonCard
            className='bottom-20 left-4 z-10 absolute'
            icon={ <IconChartAreaLine className='size-5' stroke={2} />} 
            badge={<Badge text="905" variant='warning'/>} 
            title='PR Visibility'description='Real-Time Updates, Branch Tracking & Code-Task Linking '/>
    </div>
}

const SkeletonCard = ({className, icon, title, description, badge}:{className:string; icon: React.ReactNode, title: string, description: string, badge: React.ReactNode}) => {
    return <div className={cn("max-w-[80%] h-fit my-auto mx-auto w-full p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-2xl", className)}>
        <div className="flex gap-3 items-center">
            {icon}
            <p className='text-sm font-normal text-black dark:text-neutral-300/70'>
                {title}
            </p>
            {badge}
        </div>
        <p className='text-sm text-neutral-500 dark:text-neutral-400/60 font-medium'>{description}</p>
        <div className="flex items-center gap-2 py-3">
            <Tag text='Google Ads'/>
            <Tag text='Saas'/>
            <Tag text='Content'/>
        </div>
    </div>
}
export default SkeletonCard;

const Tag = ({text}:{text:string}) => {
    return <div className="text-xs px-1 py-0.5 rounded-sm bg-neutral-200 dark:bg-neutral-700 text-black dark:text-neutral-200">
               {text}
            </div>
}


const Badge = ({ variant, text }: {variant?: "danger" | "success" | "warning"; text: string}) => {
    return <div className={cn("px-1 py-0.5 rounded-full flex items-center gap-1 w-fit",
                variant === "danger" && 'bg-red-500/50 border border-red-400 text-red-300',
                variant === "success" && 'bg-green-500/50 border border-green-600 text-green-300',
                variant === "warning" && 'bg-yellow-300/50 border border-yellow-500 text-yellow-200'
    )}>
        <IconClock className='size-3' stroke={2} />
        <IconRipple className='size-3' stroke={2} />
        <p className='text-xs font-bold'>{text}</p>
    </div>
}