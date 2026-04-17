'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { TaskCardsBlock, usePlannerStore } from '@/lib/planner-store';
import { MorphCard } from '../MorphCard';

interface TaskCardsBlockUIProps {
  block: TaskCardsBlock;
}

export function TaskCardsBlockUI({ block }: TaskCardsBlockUIProps) {
  const removeTask = usePlannerStore((state) => state.removeTask);
  const updateTask = usePlannerStore((state) => state.updateTask);
  const allTasks = usePlannerStore((state) => state.tasks);
  const shouldReduceMotion = useReducedMotion();

  // Get the task IDs from the block to filter live tasks
  const blockTaskIds = new Set(block.tasks.map(t => t.id));
  const liveTasks = allTasks.filter(t => blockTaskIds.has(t.id));

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: [0.215, 0.61, 0.355, 1] }}
      className="space-y-2 max-w-[90%]"
    >
      {liveTasks.map((task, index) => (
        <MorphCard
          key={task.id}
          index={index}
          isLoading={false}
          task={task}
          onDelete={removeTask}
          onUpdate={updateTask}
        />
      ))}
    </motion.div>
  );
}