'use client';

import { motion } from 'framer-motion';
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="flex flex-col gap-3"
    >
      {content.map((block, blockIndex) => {
        switch (block.type) {
          case 'text':
            return (
              <div 
                key={blockIndex} 
                className="max-w-[85%] bg-gray-100 dark:bg-neutral-800 px-4 py-2.5 rounded-2xl rounded-bl-sm"
              >
                <p className="text-sm text-gray-800 dark:text-gray-200">{block.content}</p>
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