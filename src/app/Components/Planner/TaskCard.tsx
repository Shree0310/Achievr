import { TaskCardArgs } from '@/lib/tools';
import { motion } from 'framer-motion';
import { duration } from 'node_modules/zod/v4/classic/iso.cjs';

const priorityStyles = {
  high: 'border-l-red-500 bg-red-50 dark:bg-red-950/20',
  medium: 'border-l-amber-500 bg-amber-50 dark:bg-amber-950/20',
  low: 'border-l-green-500 bg-green-50 dark:bg-green-950/20',
};

const priorityBadge = {
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
};

interface TaskCardProps extends TaskCardArgs {
    index?: number;
    layoutId?: string
}

const cardVariants = {
    hidden: {
        opacity: 0,
        y: 20,
        scale: 0.95
    },
    visible:  (index: number) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition :{
            duration: 0.35,
            delay: index * 0.1,
            ease: "easeInOut"
        }
    }),
    exit : {
        opacity: 0,
        scale: 0.95,
        transition: { duration: 0.2 }
    }
}

export function TaskCard({ title, duration, priority, index=0, layoutId }: TaskCardProps) {
  return (
    <motion.div
      layoutId={layoutId}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: {
          duration: 0.35,
          delay: index * 0.12,
          ease: 'easeOut',
        }
      }}
      exit={{ 
        opacity: 0, 
        scale: 0.95,
        transition: { duration: 0.2 }
      }}
      layout
      className={`
        rounded-lg border-l-4 p-4 
        border border-gray-200 dark:border-gray-700
        ${priorityStyles[priority]}
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-medium text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        <span
          className={`
            text-xs font-medium px-2 py-1 rounded-full shrink-0
            ${priorityBadge[priority]}
          `}
        >
          {priority}
        </span>
      </div>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        ⏱ {duration}
      </p>
    </motion.div>
  );
}