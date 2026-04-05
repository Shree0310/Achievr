'use client';

import { motion } from 'framer-motion';
import { PlannerSkeleton } from './PlannerSkeleton';
import { IconTrash } from '@tabler/icons-react';

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
    id: string;
    title: string;
    duration: string;
    priority: 'high' | 'medium' | 'low';
  };
  onDelete?: (id: string) => void;
}

export function MorphCard({ index, isLoading, task, onDelete }: MorphCardProps) {
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
        group relative
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
          <PlannerSkeleton className="mb-6" />

      ) : (
        // Real content
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className='group relative'
        >
          <div className="flex justify-between gap-20">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">
              {task.title}
            </h3>
            <div className='flex gap-2'>
            <span
              className={`
                text-xs font-medium px-2 py-1 rounded-full shrink-0
                ${priorityBadge[task.priority]}
              `}
            >
              {task.priority}
            </span>
            {onDelete && (
              <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onDelete(task.id)}
                  className="p-1 rounded-full opacity-0 group-hover:opacity-100
                    hover:bg-red-100 dark:hover:bg-red-900/30 
                    text-gray-400 hover:text-red-500 
                    transition-all duration-200"
                >
                  <IconTrash size={16} />
                </motion.button>
            )}
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            ⏱ {task.duration}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}