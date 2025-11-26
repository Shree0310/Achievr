import { cn } from "@/lib/utils";

const Button = ({children, className}: {children?: React.ReactNode; className?: string}) => {
    return <div className="div">
        <button className={cn("dark:bg-neutral-100 bg-neutral-900 dark:text-neutral-900 text-neutral-100 rounded-lg py-2 px-3 shadow-2xl cursor-pointer font-medium",className)}>
            {children}
        </button>
    </div>
}
export default Button;