'use client';

import { motion } from 'framer-motion';

interface UserMessageProps {
  content: string;
  index?: number;
}

export function UserMessage({ content, index = 0 }: UserMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="flex justify-end"
    >
      <div className="max-w-[80%] bg-indigo-600 text-white px-4 py-2.5 rounded-2xl rounded-br-sm">
        <p className="text-sm">{content}</p>
      </div>
    </motion.div>
  );
}