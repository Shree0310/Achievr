import { cn } from "@/lib/utils";
import { IconCircleDashedCheck } from "@tabler/icons-react";
import { IconCircleCheck } from '@tabler/icons-react';
import { IconLoader2 } from '@tabler/icons-react';
import { IconCircle } from '@tabler/icons-react';
import React from "react";

const SkeletonTwo = () => {
    return <div className="perspective-distant h-full w-full mt-3 translate-x-20 " style={{
                transform: "rotateX(40deg) rotateY(20deg) rotateZ(-20deg) scale(1.2)"
            }}>
                <CardOne className="relative">
                    <CardTwo className="absolute top-14 left-7 translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:-translate-y-0 scale-x-110 group-hover:scale-100
                    transition-all duration-300  "/>
                </CardOne>
            </div>
}
export default SkeletonTwo;

const CardOne = ({className, children}:{className:string; children: React.ReactNode}) => {
    return <div className={cn("group max-w-[80%] h-full my-auto mx-auto w-full p-3 rounded-lg border",
                              "border-neutral-200 dark:border-neutral-700 bg-white", 
                              "dark:bg-neutral-800 shadow-2xl relative", className)}>
                <div className="flex gap-3 items-center">
                    <IconCircleDashedCheck className='size-5' stroke={2} /> 
                    <p className='text-xl font-semibold text-black dark:text-neutral-200/80'>
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

const GradientHr = () => {
    return <div className="h-px w-full bg-gradient-to-r from transparent via-neutral-200 dark:via-neutral-500 to transparent"></div>
}

export const CardTwo = ({className}:{className: string}) => {
    return <div className={cn("max-w-[90%] h-full my-auto mx-auto w-full p-3 rounded-lg border",
                              "border-neutral-200 dark:border-neutral-700 bg-white", 
                              "dark:bg-neutral-800 shadow-2xl relative", className)}>
                <div className="flex flex-col gap-2">
                    <CardEntry icon={<IconCircleCheck className="size-5" fill="green" stroke={2} />} title="Real-Time Updates" time="20s"/>
                    <GradientHr/>
                    <CardEntry icon={<IconCircleCheck className="size-5" fill="green" stroke={2} />} title="Commit History" time="40s"/>
                    <GradientHr/>
                    <CardEntry time="50s" icon={<IconLoader2 className="size-4 animate-spin border border-neutral-200 rounded-full flex justify-center bg-yellow-400/50 " stroke={4} />} title="Progress Transparency"/>
                    <GradientHr/>
                    <CardEntry time="60s" title="Multi-Device Sync ?" icon={<IconCircle className="size-5" fill="grey" stroke={2} />} />
                     <GradientHr/>
                    <CardEntry  title="Code-Task Linking!!" icon={<IconCircle className="size-5" fill="grey" stroke={2} />} time="40s"/>
                </div>
            </div>
        }

const CardEntry = ({className, icon, title, time, children}: {className?: string; icon?: React.ReactNode; title: string, time: string; children?:React.ReactNode}) => {
    return <div className={cn("flex justify-between gap-2 text-neutral-200/70", className)}>
                <div className="flex p-1">
                    <div className="px-1">{icon}</div>
                    <p className="text-sm">{title}</p>
                </div>
                <div className="text-[10px] pt-2">
                    {time}
                </div>
            </div>
}