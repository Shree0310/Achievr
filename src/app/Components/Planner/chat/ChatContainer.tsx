'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { usePlannerStore, ContentBlock } from '@/lib/planner-store';
import { UserMessage } from './UserMessage';
import { AssistantMessage } from './AssistantMessage';
import { TypingIndicator } from './TypingIndicator';
import { IconSend, IconSparkles, IconCheck, IconLoader2 } from '@tabler/icons-react';

interface ChatContainerProps {
  onSaveToBoard?: () => void;
}

export function ChatContainer({ onSaveToBoard }: ChatContainerProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Zustand store
  const messages = usePlannerStore((state) => state.messages);
  const tasks = usePlannerStore((state) => state.tasks);
  const isLoading = usePlannerStore((state) => state.isLoading);
  const conversationHistory = usePlannerStore((state) => state.conversationHistory);
  const addUserMessage = usePlannerStore((state) => state.addUserMessage);
  const addAssistantMessage = usePlannerStore((state) => state.addAssistantMessage);
  const addTasks = usePlannerStore((state) => state.addTasks);
  const setLoading = usePlannerStore((state) => state.setLoading);
  const setConversationHistory = usePlannerStore((state) => state.setConversationHistory);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Send message to API
  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    // Add user message to UI
    addUserMessage(content);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          conversationHistory,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', response.status, errorData);
        throw new Error(errorData.message || `API request failed with status ${response.status}`);
      }

      const data = await response.json();

      // Update conversation history for next turn
      if (data.conversationHistory) {
        setConversationHistory(data.conversationHistory);
      }

      // Process tool calls into content blocks
      const contentBlocks: ContentBlock[] = [];
      const newTasks: any[] = [];
      let suggestActionsBlock: ContentBlock | null = null;

      for (const tc of data.toolCalls || []) {
        switch (tc.tool) {
          case 'explain_approach':
            contentBlocks.push({
              type: 'explain',
              context: tc.args.context,
              bullets: tc.args.bullets,
            });
            break;

          case 'list_features':
            contentBlocks.push({
              type: 'list_features',
              heading: tc.args.heading,
              items: tc.args.items,
            });
            break;

          case 'suggest_actions':
            // Store suggest_actions separately to add at the end
            suggestActionsBlock = {
              type: 'suggest_actions',
              prompt: tc.args.prompt,
              actions: tc.args.actions,
            };
            break;

          case 'create_task_card':
            newTasks.push({
              title: tc.args.title,
              duration: tc.args.duration,
              priority: tc.args.priority,
              description: tc.args.description,
            });
            break;

          case 'send_text':
            contentBlocks.push({
              type: 'text',
              content: tc.args.content,
            });
            break;
        }
      }

      // If we collected tasks, add them as a block and to the store
      if (newTasks.length > 0) {
        addTasks(newTasks);
        // Get the tasks with IDs from the store for display
        const tasksWithIds = usePlannerStore.getState().tasks.slice(-newTasks.length);
        contentBlocks.push({
          type: 'task_cards',
          tasks: tasksWithIds,
        });
      }

      // Add suggest_actions at the END
      if (suggestActionsBlock) {
        contentBlocks.push(suggestActionsBlock);
      }

      // Add plain text if no tool calls
      if (contentBlocks.length === 0 && data.text) {
        contentBlocks.push({
          type: 'text',
          content: data.text,
        });
      }

      // Add assistant message
      if (contentBlocks.length > 0) {
        addAssistantMessage(contentBlocks);
      }

    } catch (error) {
      console.error('Chat error:', error);
      addAssistantMessage([{
        type: 'text',
        content: 'Sorry, something went wrong. Please try again.',
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Handle action button click
  const handleActionClick = (actionId: string, label: string) => {
    sendMessage(label);
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  // Handle save to board with loading state
  const handleSaveToBoard = async () => {
    if (!onSaveToBoard) return;

    setIsSaving(true);

    try {
      await onSaveToBoard();
      setShowSuccess(true);

      // Hide success message after 2 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Error saving to board:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent bg-gray-50/50 dark:bg-gray-950/50">
        {/* Welcome message if empty */}
        {messages.length === 0 && (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: [0.215, 0.61, 0.355, 1] }}
            className="text-center py-16 px-4"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 mb-6 shadow-2xl shadow-blue-500/30">
              <IconSparkles className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Welcome to AI Planner
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
              Describe your project idea, and I'll help you create a structured plan with actionable tasks. Let's build something amazing together.
            </p>
          </motion.div>
        )}

        {/* Messages */}
        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => (
            message.role === 'user' ? (
              <UserMessage 
                key={message.id} 
                content={message.content as string} 
                index={index} 
              />
            ) : (
              <AssistantMessage
                key={message.id}
                content={message.content as ContentBlock[]}
                onActionClick={handleActionClick}
                index={index}
              />
            )
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        <AnimatePresence>
          {isLoading && <TypingIndicator />}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Task summary bar */}
      <AnimatePresence>
        {tasks.length > 0 && !showSuccess && (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: 10 }}
            transition={{ duration: 0.15, ease: [0.215, 0.61, 0.355, 1] }}
            className="px-6 py-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-t border-emerald-200 dark:border-emerald-900/50"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                  {tasks.length} task{tasks.length > 1 ? 's' : ''} ready
                </span>
              </div>
              <button
                onClick={handleSaveToBoard}
                disabled={isSaving}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-medium rounded-xl hover:from-emerald-700 hover:to-teal-700 active:scale-95 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-emerald-500/25"
              >
                {isSaving ? (
                  <>
                    <IconLoader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add to Board
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* Success message */}
        {showSuccess && (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: 10 }}
            transition={{ duration: 0.15, ease: [0.215, 0.61, 0.355, 1] }}
            className="px-6 py-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-t border-emerald-200 dark:border-emerald-900/50"
          >
            <div className="flex items-center justify-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                <IconCheck className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                Tasks added successfully!
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input area */}
      <form
        onSubmit={handleSubmit}
        className="p-6 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
      >
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your project idea..."
              disabled={isLoading}
              className="w-full px-5 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-700
                bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                placeholder-gray-400 dark:placeholder-gray-500
                focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-150"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white
              disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale
              hover:from-blue-700 hover:to-purple-700 active:scale-95
              transition-all duration-150 shadow-lg shadow-blue-500/25
              disabled:shadow-none"
          >
            <IconSend className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}