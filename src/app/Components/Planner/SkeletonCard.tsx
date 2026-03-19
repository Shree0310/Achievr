import { motion } from 'framer-motion';

interface SkeletonCardProps {
    index?: number
    layoutId?: string
}

const SkeletonCard = ({index = 0, layoutId }: SkeletonCardProps) => {
    return (
        <motion.div
        layoutId={layoutId}
            initial={{
                opacity: 0,
                y: 20
            }}
            animate ={{
                opacity:1,
                y: 0
            }}
            transition={{
                duration:0.3,
                delay: 0.1 * index,
                ease: "easeInOut"
            }}
            className="rounded-lg border-l-4 m-4 border-l-gray-300 dark:border-l-gray-600 p-4 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
            >
            {/* Shimmer Cards */}
            <div className="relative overflow-hidden m-4">
            {/* Title skeleton */}
            <div className="flex items-start justify-between gap-3">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
            <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
            </div>
            
            {/* Duration skeleton */}
            <div className="mt-3 h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse" />
            {/* Shimmer effect */}
            <motion.div
            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ translateX: ['−100%', '100%'] }}
            transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear',
            }}
            />
        </div>
        </motion.div>
    )
}

export default SkeletonCard;