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
    <div className="max-w-[88%] bg-gradient-to-br from-blue-50/80 via-purple-50/80 to-pink-50/80 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20 px-6 py-5 rounded-2xl rounded-bl-sm border border-blue-200/50 dark:border-blue-800/50 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-md">
          <IconSparkles className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          {block.heading}
        </h3>
      </div>
      <ul className="space-y-2.5">
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
            className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300"
          >
            <span className="flex-shrink-0 w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold text-xs flex items-center justify-center mt-0.5 shadow-sm">
              {i + 1}
            </span>
            <span className="leading-relaxed">{item}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
