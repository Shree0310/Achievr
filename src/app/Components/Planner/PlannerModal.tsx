'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlannerStore } from '@/lib/planner-store';
import { ChatContainer } from './chat/ChatContainer';
import { supabase } from '@/utils/supabase/client';

interface PlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTasksAdded: () => void;
  userId: string;
}

export function PlannerModal({ isOpen, onClose, onTasksAdded, userId }: PlannerModalProps) {
  const tasks = usePlannerStore((state) => state.tasks);
  const reset = usePlannerStore((state) => state.reset);

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      reset();
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

      onTasksAdded();
      onClose();

    } catch (error) {
      console.error('Failed to save tasks:', error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="bg-white dark:bg-neutral-900 rounded-xl shadow-xl w-full max-w-2xl h-[80vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
              <div>
                <h2 className="text-xl font-semibold text-neutral-800 dark:text-white">
                  ✨ AI Project Planner
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Chat with AI to plan your project
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-full transition-colors"
              >
                <svg className="w-5 h-5 text-neutral-500 dark:text-white" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {/* Chat Container */}
            <ChatContainer onSaveToBoard={handleSaveToBoard} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}