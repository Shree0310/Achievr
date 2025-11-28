import { cn } from "@/lib/utils";
import { IconCircleDashedCheck } from "@tabler/icons-react";
import { IconCircleCheck } from '@tabler/icons-react';
import { IconLoader2 } from '@tabler/icons-react';
import { IconCircle } from '@tabler/icons-react';
import React from "react";

const SkeletonTwo = () => {
    return <div className="">
                <CardOne className="relative">
                    <CardTwo className="absolute top-10"/>
                </CardOne>
            </div>
}
export default SkeletonTwo;

const CardOne = ({className, children}:{className:string; children: React.ReactNode}) => {
    return <div className={cn("max-w-[80%] h-full my-auto mx-auto w-full p-3 rounded-lg border",
                              "border-neutral-200 dark:border-neutral-700 bg-white", 
                              "dark:bg-neutral-800 shadow-2xl relative", className)}>
                <div className="flex gap-3 items-center">
                    <IconCircleDashedCheck className='size-5' stroke={2} /> 
                    <p className='text-sm font-normal text-black dark:text-neutral-300/70'>
                        Task Planner
                    </p>   
                </div>
                <div className="h-40 relative overflow-hidden flex-1 mt-4 border border-neutral-600 rounded-2xl shadow-2xl">
                    <div 
                        className="absolute inset-0 opacity-100 dark:opacity-0"
                        style={{
                            backgroundImage: 'repeating-linear-gradient(315deg, rgba(0, 0, 0, 0.1) 0px, rgba(0, 0, 0, 0.1) 1px, transparent 0px, transparent 50%)',
                            backgroundSize: '10px 10px'
                        }}
                    ></div>
                    <div 
                        className="absolute inset-0 opacity-0 dark:opacity-100"
                        style={{
                            backgroundImage: 'repeating-linear-gradient(315deg, rgba(255, 255, 255, 0.15) 0px, rgba(255, 255, 255, 0.15) 1px, transparent 0px, transparent 50%)',
                            backgroundSize: '10px 10px'
                        }}
                    ></div>
                </div> 
                {children}          
            </div>
}

const CardTwo = ({className}:{className: string}) => {
    return <div className={cn("max-w-[90%] h-full my-auto mx-auto w-full p-3 rounded-lg border",
                              "border-neutral-200 dark:border-neutral-700 bg-white", 
                              "dark:bg-neutral-800 shadow-2xl relative", className)}>
                <div className="flex flex-col gap-2">
                    <CardEntry icon={<IconCircleCheck className="size-5" fill="green" stroke={2} />} title="Real-Time Updates"/>
                    <CardEntry icon={<IconCircleCheck className="size-5" fill="green" stroke={2} />} title="Commit History"/>
                    <CardEntry icon={<IconLoader2 className="size-5 border border-neutral-200 rounded-full flex justify-center bg-yellow-400/50 p-1 " stroke={4} />} title="Progress Transparency"/>
                    <CardEntry title="Multi-Device Sync" icon={<IconCircle className="size-5" fill="grey" stroke={2} />} />
                    <CardEntry  title="Code-Task Linking" icon={<IconCircle className="size-5" fill="grey" stroke={2} />} />
                </div>
    </div>
}

const CardEntry = ({className, icon, title, children}: {className?: string; icon?: React.ReactNode; title: string, children?:React.ReactNode}) => {
    return <div className={cn("flex gap-2", className)}>
                {icon}
                <p>{title}</p>
            </div>
}