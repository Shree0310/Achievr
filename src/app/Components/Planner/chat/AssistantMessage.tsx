'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ContentBlock } from '@/lib/planner-store';
import { ExplainBlockUI } from './ExplainBlockUI';
import { SuggestActionsUI } from './SuggestActionsUI';
import { TaskCardsBlockUI } from './TaskCardsBlockUI';
import { ListFeaturesUI } from './ListFeaturesUI';

interface AssistantMessageProps {
  content: ContentBlock[];
  onActionClick?: (actionId: string, label: string) => void;
  index?: number;
}

export function AssistantMessage({ content, onActionClick, index = 0 }: AssistantMessageProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.2, ease: [0.215, 0.61, 0.355, 1] }}
      className="flex flex-col gap-3"
    >
      {content.map((block, blockIndex) => {
        switch (block.type) {
          case 'text':
            return (
              <div
                key={blockIndex}
                className="max-w-[85%] bg-white dark:bg-gray-800 px-5 py-3 rounded-2xl rounded-bl-sm shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">{block.content}</p>
              </div>
            );
          
          case 'explain':
            return <ExplainBlockUI key={blockIndex} block={block} />;
          
          case 'suggest_actions':
            return (
              <SuggestActionsUI 
                key={blockIndex} 
                block={block} 
                onActionClick={onActionClick} 
              />
            );
          
          case 'task_cards':
            return <TaskCardsBlockUI key={blockIndex} block={block} />;

          case 'list_features':
            return <ListFeaturesUI key={blockIndex} block={block} />;

          default:
            return null;
        }
      })}
    </motion.div>
  );
}