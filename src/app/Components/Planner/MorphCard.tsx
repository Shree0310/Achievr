'use client';

import { motion } from 'framer-motion';

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

interface MorphCardProps {
  index: number;
  isLoading: boolean;
  task?: {
    title: string;
    duration: string;
    priority: 'high' | 'medium' | 'low';
  };
}

export function MorphCard({ index, isLoading, task }: MorphCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        transition: { delay: index * 0.1, duration: 0.3 }
      }}
      className={`
        rounded-lg border-l-4 p-4 border border-gray-200 dark:border-gray-700
        transition-colors duration-500
        ${isLoading || !task
          ? 'border-l-gray-300 dark:border-l-gray-600 bg-gray-50 dark:bg-gray-800/50'
          : priorityStyles[task.priority]
        }
      `}
    >
      {isLoading || !task ? (
        // Skeleton content
        <div className="relative overflow-hidden">
          <div className="flex items-start justify-between gap-3">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
            <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
          </div>
          <div className="mt-3 h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse" />
        </div>
      ) : (
        // Real content
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">
              {task.title}
            </h3>
            <span
              className={`
                text-xs font-medium px-2 py-1 rounded-full shrink-0
                ${priorityBadge[task.priority]}
              `}
            >
              {task.priority}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            ⏱ {task.duration}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}