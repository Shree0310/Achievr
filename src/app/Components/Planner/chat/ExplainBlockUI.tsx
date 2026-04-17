'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ExplainBlock } from '@/lib/planner-store';

interface ExplainBlockUIProps {
  block: ExplainBlock;
}

export function ExplainBlockUI({ block }: ExplainBlockUIProps) {
  const bullets = Array.isArray(block.bullets) ? block.bullets : [block.bullets];
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="max-w-[88%] bg-white dark:bg-gray-800 px-5 py-4 rounded-2xl rounded-bl-sm shadow-sm border border-gray-200 dark:border-gray-700">
      <p className="text-sm text-gray-800 dark:text-gray-200 mb-3 leading-relaxed font-medium">
        {block.context}
      </p>
      <ul className="space-y-2.5">
        {bullets.map((bullet, i) => (
          <motion.li
            key={i}
            initial={shouldReduceMotion ? false : { opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: shouldReduceMotion ? 0 : i * 0.05, duration: 0.2, ease: [0.215, 0.61, 0.355, 1] }}
            className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300"
          >
            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mt-2"></span>
            <span className="leading-relaxed">{bullet}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}