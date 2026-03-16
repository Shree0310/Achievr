'use client';

import { useState } from 'react';
import { TaskCard } from '../Components/Planner/TaskCard';
import { TaskCardArgs } from '@/lib/tools';

export default function PlannerPage() {
  const [goal, setGoal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState<TaskCardArgs[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) return;

    setIsLoading(true);
    setTasks([]);
    setError(null);

    try {
      const response = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: goal }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate plan');
      }

      const data = await response.json();
      console.log('Response data:', data);

      // Extract tasks from tool calls
      const extractedTasks: TaskCardArgs[] = data.toolCalls
        .filter((tc: any) => tc.toolName === 'create_task_card')
        .map((tc: any) => tc.input);

      setTasks(extractedTasks);
      setGoal('');

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">AI Project Planner</h1>

      {/* Input */}
      <form onSubmit={handleSubmit} className="mb-8">
        <input
          type="text"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="What do you want to accomplish?"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !goal.trim()}
          className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
        >
          {isLoading ? 'Planning...' : 'Generate Plan'}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-lg">
          {error}
        </div>
      )}

      {/* Output */}
      <div className="space-y-3">
        {tasks.map((task, index) => (
          <TaskCard key={index} {...task} />
        ))}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="text-gray-500 animate-pulse">
          Generating your plan...
        </div>
      )}
    </div>
  );
}