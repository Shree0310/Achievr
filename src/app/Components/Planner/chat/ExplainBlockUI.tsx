'use client';

import { motion } from 'framer-motion';
import { ExplainBlock } from '@/lib/planner-store';

interface ExplainBlockUIProps {
  block: ExplainBlock;
}

export function ExplainBlockUI({ block }: ExplainBlockUIProps) {
  const bullets = Array.isArray(block.bullets) ? block.bullets : [block.bullets];

  return (
    <div className="max-w-[85%] bg-gray-100 dark:bg-neutral-800 px-4 py-3 rounded-2xl rounded-bl-sm">
      <p className="text-sm text-gray-800 dark:text-gray-200 mb-2">
        {block.context}
      </p>
      <ul className="space-y-1.5">
        {bullets.map((bullet, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.2 }}
            className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
          >
            <span className="text-indigo-500 mt-0.5">•</span>
            <span>{bullet}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}