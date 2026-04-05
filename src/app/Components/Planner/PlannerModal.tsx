'use client';

import { useState, useEffect } from 'react';
import { TaskCard } from './TaskCard';
import { TaskCardArgs } from '@/lib/tools';
import { supabase } from '@/utils/supabase/client';
import { AnimatePresence, LayoutGroup } from 'motion/react';
import SkeletonCard from './SkeletonCard';
import { motion } from 'framer-motion';
import { MorphCard } from './MorphCard';
import { usePlannerStore } from '@/lib/planner-store';

interface Cycle {
  id: string;
  title: string;
}

interface PlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTasksAdded: () => void; // Callback to refresh the board
  userId: string;
}

export function PlannerModal({ isOpen, onClose, onTasksAdded, userId }: PlannerModalProps) {
  const [goal, setGoal] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messages = usePlannerStore((state) =>state.messages);
  const addUsermessage = usePlannerStore((state) => state.addUserMessage);
  const tasks = usePlannerStore((state) => state.tasks);
  const isLoading = usePlannerStore((state) => state.isLoading);
  const setLoading = usePlannerStore((state) => state.setLoading);
  const addTasks = usePlannerStore((state) => state.addTasks);
  const removeTask = usePlannerStore((state) => state.removeTask);
  const reset = usePlannerStore((state) => state.reset);

  // Cycle state
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [selectedCycle, setSelectedCycle] = useState<string>('');

  // Fetch cycles on mount
  useEffect(() => {
    if (!isOpen) return;
    
    async function fetchCycles() {
      const { data, error } = await supabase
        .from('cycles')
        .select('id, title')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching cycles:', error);
        return;
      }

      if (data && data.length > 0) {
        setCycles(data);
        setSelectedCycle(data[0].id);
      }
    }
    fetchCycles();
  }, [isOpen]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setGoal('');
      reset();
      setError(null);
    }
  }, [isOpen]);

  // Generate tasks from AI
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) return;

    reset();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: goal }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate plan');
      }

      const data = await response.json();

      const extractedTasks: TaskCardArgs[] = data.toolCalls
        .filter((tc: any) => tc.toolName === 'create_task_card')
        .map((tc: any) => tc.input);

      addTasks(extractedTasks);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Transform AI output → Supabase task schema
  const transformToSupabaseTask = (task: {title: string, duration:string, priority: string}) => ({
    title: task.title,
    description: `Estimated: ${task.duration}`,
    status: 'not started',
    priority: task.priority === 'high' ? '1' : task.priority === 'medium' ? '2' : '3',
    user_id: userId,
    cycle_id: selectedCycle,
  });

  // Save tasks to Supabase
  const handleAddToBoard = async () => {
    if (!userId || tasks.length === 0) return;

    if (!selectedCycle) {
      setError('Please select a cycle');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const tasksToInsert = tasks.map(transformToSupabaseTask);

      const { error: insertError } = await supabase
        .from('tasks')
        .insert(tasksToInsert);

      if (insertError) {
        throw insertError;
      }

      // Success! Close modal and refresh board
      onTasksAdded();
      onClose();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save tasks');
    } finally {
      setIsSaving(false);
    }
  };

  // Clear and start over
  const handleClear = () => {
    reset();
    setTimeout(() => {
        setGoal('');
    }, 300)
    setError(null);
  };

  return (
    <AnimatePresence>
        {isOpen && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }} 
                    className="bg-white dark:bg-neutral-900 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
                    <div>
                        <h2 className="text-xl font-semibold text-neutral-800 dark:text-white">
                        ✨ AI Project Planner
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                        Describe your goal and AI will break it into tasks
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

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                    {/* Input */}
                    <form onSubmit={handleSubmit} className="mb-6">
                        <motion.div
                            animate={{
                            opacity: isLoading || tasks.length > 0 ? 0.6 : 1,
                            scale: isLoading || tasks.length > 0 ? 0.98 : 1,
                            }}
                            transition={{ duration: 0.3 }}
                        >
                        <input
                        type="text"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        placeholder="What do you want to accomplish?"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                        disabled={isLoading || tasks.length > 0}
                        />
                        </motion.div>
                        <AnimatePresence>
                            {tasks.length === 0 && !isLoading && (
                            <motion.button
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity:1, y: 0 }}
                                exit={{ opacity:0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                type="submit"
                                disabled={!goal.trim()}
                                className="mt-3 px-6 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 hover:bg-indigo-700 transition-colors"
                            >
                                Generate Plan
                            </motion.button>
                            )}
                        </AnimatePresence>
                    </form>

                    {/* Error */}
                    {error && (
                        <div className="mb-4 p-4 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-lg">
                        {error}
                        </div>
                    )}

                    {/* Cards - skeleton or real */}
                    {(isLoading || tasks.length > 0) && (
                    <div className="space-y-3 mb-6">
                        {isLoading && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                            Generating your plan...
                        </p>
                        )}

                        {!isLoading && tasks.length > 0 && (
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-neutral-800 dark:text-white">
                            Generated {tasks.length} tasks
                            </h3>
                            <button
                            onClick={handleClear}
                            className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                            Clear & start over
                            </button>
                        </div>
                        )}

                        {/* Show 4 cards when loading, or actual task count when done */}
                        {(isLoading ? [0, 1, 2, 3] : tasks).map((item, index) => (
                        <MorphCard
                            key={`card-${index}`}
                            index={index}
                            isLoading={isLoading}
                            task={isLoading ? undefined : (item as any)}
                        />
                        ))}
                    </div>
                    )}

                    {/* Cycle Selection - only show when tasks exist */}
                    {tasks.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }} 
                            className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Add to cycle
                            </label>
                            <select
                                value={selectedCycle}
                                onChange={(e) => setSelectedCycle(e.target.value)}
                                className="w-full px-4 py-2 bg-white dark:bg-neutral-700 border border-gray-300 dark:border-gray-600 rounded-lg text-neutral-900 dark:text-white"
                            >
                                <option value="" disabled>Select Cycle</option>
                                {cycles.map((cycle) => (
                                <option key={cycle.id} value={cycle.id}>
                                    {cycle.title}
                                </option>
                                ))}
                            </select>
                        </motion.div>
                    )}
                    </div>

                    {/* Footer */}
                    {tasks.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-700 flex gap-3"
                        >
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleAddToBoard}
                            disabled={isSaving || !selectedCycle}
                            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg disabled:opacity-50 hover:bg-green-700 transition-colors font-medium"
                        >
                        {isSaving ? 'Saving...' : '✓ Add to Board'}
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors text-neutral-700 dark:text-white"
                        >
                        ↻ Regenerate
                        </motion.button>
                    </motion.div>
                    )}
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
  );
}