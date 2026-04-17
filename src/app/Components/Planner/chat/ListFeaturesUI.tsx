'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ListFeaturesBlock } from '@/lib/planner-store';
import { IconSparkles } from '@tabler/icons-react';

interface ListFeaturesUIProps {
  block: ListFeaturesBlock;
}

export function ListFeaturesUI({ block }: ListFeaturesUIProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="max-w-[85%] bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 px-5 py-4 rounded-2xl rounded-bl-sm border border-indigo-200 dark:border-indigo-800">
      <div className="flex items-center gap-2 mb-3">
        <IconSparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        <h3 className="text-base font-semibold text-indigo-900 dark:text-indigo-100">
          {block.heading}
        </h3>
      </div>
      <ul className="space-y-2">
        {block.items.map((item, i) => (
          <motion.li
            key={i}
            initial={shouldReduceMotion ? false : { opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: shouldReduceMotion ? 0 : i * 0.05,
              duration: 0.2,
              ease: [0.215, 0.61, 0.355, 1]
            }}
            className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-gray-300"
          >
            <span className="text-indigo-500 dark:text-indigo-400 font-bold mt-0.5 min-w-[20px]">
              {i + 1}.
            </span>
            <span>{item}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
