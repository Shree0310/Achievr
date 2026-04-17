'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface UserMessageProps {
  content: string;
  index?: number;
}

export function UserMessage({ content, index = 0 }: UserMessageProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.2, ease: [0.215, 0.61, 0.355, 1] }}
      className="flex justify-end"
    >
      <div className="max-w-[80%] bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-3 rounded-2xl rounded-br-sm shadow-md shadow-blue-500/20">
        <p className="text-sm leading-relaxed">{content}</p>
      </div>
    </motion.div>
  );
}