import { cn } from "@/lib/utils";
import { FaFigma } from "react-icons/fa";
import { FaMountain } from "react-icons/fa";
import { FaDiamond } from "react-icons/fa6";
import { RiProgress6Line } from "react-icons/ri";

export const SkeletonOne = ({className, children}:{className?:string; children?:React.ReactNode}) => {
            return <div className={cn("flex-1 w-full h-full mx-auto inset-x-0 absolute bg-neutral-400 dark:bg-gradient-to-br from-neutral-800 via-neutral-900 to-black p-3 mt-3 rounded-xl border border-neutral-200 dark:border-neutral-700 ", className)}>
            {children}
        </div>
}

export const Card = () => {
    return <div className="div">
        <h1 className="text-xl font-medium mb-3">Project Overview</h1>
        <div className="flex flex-col gap-4">
            <div className="flex gap-10 text-lg text-neutral-500">
                <div className="text-neutral-500">Properties</div>
                <div className="flex justify-between gap-3 text-sm">
                    <div className="flex gap-1">
                        <RiProgress6Line className="w-4 h-4 mx-1 text-yellow-600 mt-1" />
                        In Progress
                    </div>
                    <div className="div">ENG</div>
                    <div className="div">icons</div>
                </div>
            </div>
            <div className="flex  gap-10 text-lg text-neutral-500">
                <div className="text-neutral-500">Resources</div>
                <div className="flex justify-between gap-3 text-sm pb-3">
                    <div className="flex p-1 rounded-sm bg-neutral-800">
                        <svg className="color-override" 
                             width="16" 
                             height="16" 
                             viewBox="0 0 16 16" 
                             role="img" 
                             focusable="false" 
                             aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.33334 15C5.95218 15 6.54567 14.7541 6.98326 14.3166C7.42085 13.879 7.66668 13.2855 7.66668 12.6666V10.3333H5.33334C4.7145 10.3333 4.12101 10.5791 3.68342 11.0167C3.24583 11.4543 3 12.0478 3 12.6666C3 13.2855 3.24583 13.879 3.68342 14.3166C4.12101 14.7541 4.7145 15 5.33334 15Z" fill="#0ACF83"></path><path d="M3 8.00004C3 7.3812 3.24583 6.78771 3.68342 6.35012C4.12101 5.91254 4.7145 5.6667 5.33334 5.6667H7.66668V10.3333H5.33334C4.7145 10.3333 4.12101 10.0875 3.68342 9.64996C3.24583 9.21238 3 8.61888 3 8.00004Z" fill="#A259FF"></path><path d="M3 3.33334C3 2.71481 3.24558 2.1216 3.68277 1.68406C4.11997 1.24653 4.71299 1.00048 5.33152 1H7.66486V5.66668L5.33334 5.6667C4.7145 5.6667 4.12101 5.42085 3.68342 4.98326C3.24583 4.54567 3 3.95218 3 3.33334Z" fill="#F24E1E"></path>
                            <path d="M7.66681 1H10.0001C10.619 1 11.2125 1.24583 11.6501 1.68342C12.0877 2.12101 12.3335 2.7145 12.3335 3.33334C12.3335 3.95218 12.0877 4.54567 11.6501 4.98326C11.2125 5.42085 10.619 5.66668 10.0001 5.66668L7.66668 5.6667L7.66681 1Z" fill="#FF7262"></path>
                            <path d="M12.3335 8.00004C12.3335 8.61888 12.0877 9.21238 11.6501 9.64996C11.2125 10.0875 10.619 10.3334 10.0001 10.3334C9.38131 10.3334 8.78781 10.0875 8.35023 9.64996C7.91264 9.21238 7.66681 8.61888 7.66681 8.00004C7.66681 7.3812 7.91264 6.78771 8.35023 6.35012C8.78781 5.91254 9.38131 5.66668 10.0001 5.66668C10.619 5.66668 11.2125 5.91254 11.6501 6.35012C12.0877 6.78771 12.3335 7.3812 12.3335 8.00004Z" fill="#1ABCFE"></path>
                        </svg>
                        Exploration
                    </div>
                    <div className=" flex px-2 p-1 rounded-sm bg-neutral-800">
                        <FaMountain className="w-4 h-4 mx-1 text-blue-600" />
                        User Interviews
                    </div>
                </div>
            </div>
            <div className="flex  gap-10 text-lg text-neutral-500">
                <div className="text-neutral-500">Milestones</div>
                <div className="flex flex-col text-sm gap-4">
                    <div className="flex gap-2">
                        <FaDiamond className="w-3 h-3  text-violet-600 mt-1"/>
                        Design Review
                    </div>
                    <div className="flex gap-2">
                        <FaDiamond className="w-3 h-3 text-violet-600 mt-1"/>
                        Frontend devleopment
                    </div>
                    <div className="flex gap-2">
                        <FaDiamond className="w-3 h-3 text-violet-600 mt-1"/>
                        Backend devleopment
                    </div>
                </div>
            </div>
        </div>
    </div>
}