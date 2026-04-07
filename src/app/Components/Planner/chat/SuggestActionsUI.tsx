'use client';

import { motion } from 'framer-motion';
import { SuggestActionsBlock } from '@/lib/planner-store';

interface SuggestActionsUIProps {
  block: SuggestActionsBlock;
  onActionClick?: (actionId: string, label: string) => void;
  disabled?: boolean;
}

export function SuggestActionsUI({ block, onActionClick, disabled }: SuggestActionsUIProps) {
  return (
    <div className="max-w-[85%]">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
        {block.prompt}
      </p>
      <div className="flex flex-wrap gap-2">
        {block.actions.map((action, i) => (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08, duration: 0.2 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onActionClick?.(action.id, action.label)}
            disabled={disabled}
            className="px-4 py-2 text-sm font-medium rounded-full
              border border-indigo-200 dark:border-indigo-800
              bg-white dark:bg-neutral-900
              text-indigo-600 dark:text-indigo-400
              hover:bg-indigo-50 dark:hover:bg-indigo-950
              hover:border-indigo-300 dark:hover:border-indigo-700
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-200"
          >
            {action.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}