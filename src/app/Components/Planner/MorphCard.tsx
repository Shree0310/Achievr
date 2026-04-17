'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { IconTrash, IconEdit, IconCheck, IconX } from '@tabler/icons-react';
import { useState } from 'react';

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
  onUpdate?: (id: string, updates: { title?: string; priority?: 'high' | 'medium' | 'low' }) => void;
}

export function MorphCard({ index, isLoading, task, onDelete, onUpdate }: MorphCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task?.title || '');
  const [editPriority, setEditPriority] = useState<'high' | 'medium' | 'low'>(task?.priority || 'medium');
  const shouldReduceMotion = useReducedMotion();

  const handleSave = () => {
    if (task && onUpdate) {
      onUpdate(task.id, { title: editTitle, priority: editPriority });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task?.title || '');
    setEditPriority(task?.priority || 'medium');
    setIsEditing(false);
  };

  const startEditing = () => {
    setEditTitle(task?.title || '');
    setEditPriority(task?.priority || 'medium');
    setIsEditing(true);
  };

  return (
    <motion.div
      layout
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: {
          delay: shouldReduceMotion ? 0 : index * 0.05,
          duration: 0.2,
          ease: [0.215, 0.61, 0.355, 1]
        }
      }}
      className={`
        relative
        rounded-lg border-l-4 p-4 border border-gray-200 dark:border-gray-700
        transition-colors duration-300
        ${isLoading || !task
          ? 'border-l-gray-300 dark:border-l-gray-600 bg-gray-50 dark:bg-gray-800/50'
          : priorityStyles[isEditing ? editPriority : task.priority]
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
      ) : isEditing ? (
        // Edit mode
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15, ease: [0.215, 0.61, 0.355, 1] }}
          className="space-y-3"
        >
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
              bg-white dark:bg-neutral-800 text-gray-900 dark:text-white text-sm"
            autoFocus
          />
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {(['high', 'medium', 'low'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setEditPriority(p)}
                  className={`
                    text-xs font-medium px-3 py-1.5 rounded-full transition-all
                    ${editPriority === p 
                      ? priorityBadge[p] + ' ring-2 ring-offset-1 ring-gray-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                    }
                  `}
                >
                  {p}
                </button>
              ))}
            </div>
            <div className="flex gap-1">
              <button
                onClick={handleSave}
                className="p-1.5 rounded-full bg-green-100 dark:bg-green-900/30
                  text-green-600 hover:bg-green-200 dark:hover:bg-green-900/50
                  active:scale-[0.97] transition-all duration-150"
              >
                <IconCheck size={16} />
              </button>
              <button
                onClick={handleCancel}
                className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-800
                  text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700
                  active:scale-[0.97] transition-all duration-150"
              >
                <IconX size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        // View mode
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15, ease: [0.215, 0.61, 0.355, 1] }}
        >
          <div className="flex justify-between gap-4">
            <h3 className="font-medium text-gray-900 dark:text-gray-100 flex-1">
              {task.title}
            </h3>
            <div className="flex items-center gap-2">
              <span
                className={`
                  text-xs font-medium px-2 py-1 rounded-full shrink-0
                  ${priorityBadge[task.priority]}
                `}
              >
                {task.priority}
              </span>
              
              {/* Edit button - Always visible, more prominent on hover */}
              {onUpdate && (
                <button
                  onClick={startEditing}
                  className="p-1.5 rounded-full opacity-60 hover:opacity-100
                    hover:bg-blue-100 dark:hover:bg-blue-900/30
                    text-gray-400 hover:text-blue-500
                    active:scale-[0.97]
                    transition-all duration-150"
                >
                  <IconEdit size={16} />
                </button>
              )}

              {/* Delete button - Always visible, more prominent on hover */}
              {onDelete && (
                <button
                  onClick={() => onDelete(task.id)}
                  className="p-1.5 rounded-full opacity-60 hover:opacity-100
                    hover:bg-red-100 dark:hover:bg-red-900/30
                    text-gray-400 hover:text-red-500
                    active:scale-[0.97]
                    transition-all duration-150"
                >
                  <IconTrash size={16} />
                </button>
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