'use client';

import { useEffect, useState } from 'react';
import { TaskCard } from '../Components/Planner/TaskCard';
import { TaskCardArgs } from '@/lib/tools';
import { supabase } from "@/utils/supabase/client";
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

//define type for cycle a task is linked to
interface Cycle {
    title: string,
    id: string
}

export default function PlannerPage() {
  const router = useRouter();
  const [goal, setGoal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState<TaskCardArgs[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  //States for managing cycles
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [selectedCycle, setSelectedCycle] = useState<string>('');

  //Get current user and cycles on mount
  useEffect(() => {
    async function init() {
        const {data} = await supabase.auth.getSession();
        if(data.session?.user){
            setUser(data.session.user);
        }

        //fetch Cycles
        const { data: cyclesData, error: cyclesError} = await supabase
            .from('cycles')
            .select('id, title')
            .order("created_at", { ascending: false})
        
            if(cyclesError){
                console.error('Error while fetching cycles', cyclesError);
            }

            if(cyclesData && cyclesData.length > 0) {
                setCycles(cyclesData);
                setSelectedCycle(cyclesData[0].id);
            }
    }
    init();
  },[])

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

  const TransformSupabaseTask = (task: TaskCardArgs) => ({
    title: task.title,
    description: task.description,
    status: 'not started',
    priority: task.priority === 'high' ? '1' : task.priority === 'medium' ? '2' : '3',
    cycle_id: selectedCycle,
    user_id: user?.id,
  });

  const handleAddToBoard = async () => {
    if(!user?.id || tasks.length == 0 ) return;

    setIsSaving(true);
    setError(null);

    try{
        const tasksToInsert = tasks.map(TransformSupabaseTask);
        const { error: insertError} = await supabase   
        .from('tasks')
        .insert(tasksToInsert);

        if(insertError){
            throw insertError;
        }

        router.push('/board');
    } catch(err) {
        console.error("error while creating a task", err);
    }finally{
        setIsSaving(false);
    }
  }

  const handleClear = () => {
    setTasks([]);
    setGoal('');
    setError(null);
  }


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
            <button
              onClick={handleAddToBoard}
              disabled={isSaving || !user}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg disabled:opacity-50 hover:bg-green-700 transition-colors font-medium"
            >
              {isSaving ? 'Saving...' : '✓ Add to Board'}
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

      {/* Cycle Selection */}
      <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Add to cycle
            </label>
            <select
              value={selectedCycle}
              onChange={(e) => setSelectedCycle(e.target.value)}
              className="w-full px-4 py-2 bg-white dark:bg-neutral-700 border border-gray-300 dark:border-gray-600 rounded-lg"
            >
              <option value="" disabled>
                Select Cycle
              </option>
              {cycles.map((cycle) => (
                <option key={cycle.id} value={cycle.id}>
                  {cycle.title}
                </option>
              ))}
            </select>
            {cycles.length === 0 && (
              <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
                No cycles found. Please create a cycle first.
              </p>
            )}
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