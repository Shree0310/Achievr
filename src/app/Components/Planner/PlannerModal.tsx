'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { usePlannerStore } from '@/lib/planner-store';
import { ChatContainer } from './chat/ChatContainer';
import { supabase } from '@/utils/supabase/client';
import { IconMaximize, IconMinimize } from '@tabler/icons-react';

interface PlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTasksAdded: () => Promise<void> | void;
  userId: string;
}

export function PlannerModal({ isOpen, onClose, onTasksAdded, userId }: PlannerModalProps) {
  const tasks = usePlannerStore((state) => state.tasks);
  const reset = usePlannerStore((state) => state.reset);
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      reset();
      setIsExpanded(false);
    }
  }, [isOpen, reset]);

  // Save tasks to Supabase
  const handleSaveToBoard = async () => {
    if (!userId || tasks.length === 0) return;

    try {
      // Get the first cycle (or you can add cycle selection later)
      const { data: cycles } = await supabase
        .from('cycles')
        .select('id')
        .order('created_at', { ascending: false })
        .limit(1);

      const cycleId = cycles?.[0]?.id;

      if (!cycleId) {
        console.error('No cycle found');
        return;
      }

      const tasksToInsert = tasks.map((task) => ({
        title: task.title,
        description: task.description || `Estimated: ${task.duration}`,
        status: 'not started',
        priority: task.priority === 'high' ? '1' : task.priority === 'medium' ? '2' : '3',
        user_id: userId,
        cycle_id: cycleId,
      }));

      const { error } = await supabase.from('tasks').insert(tasksToInsert);

      if (error) throw error;

      // Call onTasksAdded and wait if it's async
      await Promise.resolve(onTasksAdded());

      // Close modal after a short delay to show success message
      setTimeout(() => {
        onClose();
      }, 2500);

    } catch (error) {
      console.error('Failed to save tasks:', error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - only show when expanded */}
          {isExpanded && (
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0 }}
              transition={{ duration: 0.15, ease: [0.215, 0.61, 0.355, 1] }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setIsExpanded(false)}
            />
          )}

          {/* Chat widget */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95, y: 20 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              width: isExpanded ? '100%' : '400px',
              height: isExpanded ? '100%' : '600px',
              borderRadius: isExpanded ? '0px' : '16px',
            }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.95, y: 20 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              mass: 0.8
            }}
            className={`fixed bg-white dark:bg-gray-900 shadow-2xl overflow-hidden flex flex-col ${
              isExpanded
                ? 'inset-0 z-[60] border-0'
                : 'bottom-4 right-4 z-50 border border-gray-200 dark:border-gray-800'
            }`}
          >
            {/* Header - Sticky */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    AI Planner
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Plan smarter, build faster
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-150 active:scale-95"
                  title={isExpanded ? "Exit fullscreen" : "Expand to fullscreen"}
                >
                  {isExpanded ? (
                    <IconMinimize className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <IconMaximize className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-150 active:scale-95"
                  title="Close"
                >
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Chat Container */}
            <ChatContainer onSaveToBoard={handleSaveToBoard} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}