'use client';

import { motion } from 'framer-motion';
import { TaskCardsBlock, usePlannerStore } from '@/lib/planner-store';
import { MorphCard } from '../MorphCard';

interface TaskCardsBlockUIProps {
  block: TaskCardsBlock;
}

export function TaskCardsBlockUI({ block }: TaskCardsBlockUIProps) {
  const removeTask = usePlannerStore((state) => state.removeTask);
  const updateTask = usePlannerStore((state) => state.updateTask);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-2 max-w-[90%]"
    >
      {block.tasks.map((task, index) => (
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