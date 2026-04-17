'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { SuggestActionsBlock } from '@/lib/planner-store';

interface SuggestActionsUIProps {
  block: SuggestActionsBlock;
  onActionClick?: (actionId: string, label: string) => void;
  disabled?: boolean;
}

export function SuggestActionsUI({ block, onActionClick, disabled }: SuggestActionsUIProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="max-w-[88%]">
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-medium">
        {block.prompt}
      </p>
      <div className="flex flex-wrap gap-2">
        {block.actions.map((action, i) => (
          <motion.button
            key={action.id}
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: shouldReduceMotion ? 0 : i * 0.05, duration: 0.2, ease: [0.215, 0.61, 0.355, 1] }}
            onClick={() => onActionClick?.(action.id, action.label)}
            disabled={disabled}
            className="px-4 py-2.5 text-sm font-medium rounded-xl
              border-2 border-gray-200 dark:border-gray-700
              bg-white dark:bg-gray-800
              text-gray-700 dark:text-gray-300
              hover:border-blue-500 dark:hover:border-blue-500
              hover:bg-blue-50 dark:hover:bg-blue-950/30
              hover:text-blue-700 dark:hover:text-blue-300
              active:scale-95
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-150 shadow-sm hover:shadow-md"
          >
            {action.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}