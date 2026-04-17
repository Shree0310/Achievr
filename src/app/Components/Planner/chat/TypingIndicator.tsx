'use client';

import { motion, useReducedMotion } from 'framer-motion';

export function TypingIndicator() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={shouldReduceMotion ? undefined : { opacity: 0, y: -10 }}
      transition={{ duration: 0.15, ease: [0.215, 0.61, 0.355, 1] }}
      className="flex items-center gap-3"
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-bl-sm px-5 py-3.5 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
              animate={shouldReduceMotion ? {} : {
                y: [0, -8, 0],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 0.9,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">AI is thinking</span>
      </div>
    </motion.div>
  );
}