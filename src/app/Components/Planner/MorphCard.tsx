'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { IconTrash, IconEdit, IconCheck, IconX } from '@tabler/icons-react';
import { useState } from 'react';

const priorityStyles = {
  high: 'border-l-rose-500 dark:border-l-rose-400 bg-gradient-to-r from-rose-50/80 to-pink-50/80 dark:from-rose-950/20 dark:to-pink-950/20',
  medium: 'border-l-amber-500 dark:border-l-amber-400 bg-gradient-to-r from-amber-50/80 to-orange-50/80 dark:from-amber-950/20 dark:to-orange-950/20',
  low: 'border-l-emerald-500 dark:border-l-emerald-400 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 dark:from-emerald-950/20 dark:to-teal-950/20',
};

const priorityBadge = {
  high: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800',
  low: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
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
        rounded-xl border-l-4 p-5 border border-gray-200 dark:border-gray-700
        transition-all duration-300 shadow-sm hover:shadow-md
        ${isLoading || !task
          ? 'border-l-gray-300 dark:border-l-gray-600 bg-gray-50/50 dark:bg-gray-800/30'
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
            className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 dark:border-gray-600
              bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm
              focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none
              transition-all duration-150"
            autoFocus
          />
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {(['high', 'medium', 'low'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setEditPriority(p)}
                  className={`
                    text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-150
                    ${editPriority === p
                      ? priorityBadge[p] + ' shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500 border border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                    }
                  `}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30
                  text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50
                  active:scale-95 transition-all duration-150 border border-emerald-200 dark:border-emerald-800"
              >
                <IconCheck size={16} />
              </button>
              <button
                onClick={handleCancel}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800
                  text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700
                  active:scale-95 transition-all duration-150 border border-gray-200 dark:border-gray-700"
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
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex-1 leading-snug">
              {task.title}
            </h3>
            <div className="flex items-center gap-2">
              <span
                className={`
                  text-xs font-semibold px-2.5 py-1 rounded-lg shrink-0
                  ${priorityBadge[task.priority]}
                `}
              >
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>
              
              {/* Edit button - Always visible, more prominent on hover */}
              {onUpdate && (
                <button
                  onClick={startEditing}
                  className="p-2 rounded-lg opacity-60 hover:opacity-100
                    hover:bg-blue-100 dark:hover:bg-blue-900/30
                    text-gray-400 hover:text-blue-600 dark:hover:text-blue-400
                    active:scale-95 border border-transparent hover:border-blue-200 dark:hover:border-blue-800
                    transition-all duration-150"
                >
                  <IconEdit size={15} />
                </button>
              )}

              {/* Delete button - Always visible, more prominent on hover */}
              {onDelete && (
                <button
                  onClick={() => onDelete(task.id)}
                  className="p-2 rounded-lg opacity-60 hover:opacity-100
                    hover:bg-rose-100 dark:hover:bg-rose-900/30
                    text-gray-400 hover:text-rose-600 dark:hover:text-rose-400
                    active:scale-95 border border-transparent hover:border-rose-200 dark:hover:border-rose-800
                    transition-all duration-150"
                >
                  <IconTrash size={15} />
                </button>
              )}
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{task.duration}</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}