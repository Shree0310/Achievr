import { anthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';
import { z } from 'zod';
import { tools } from '@/lib/tools';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const result = await generateText({
    model: anthropic('claude-sonnet-4-20250514'),
    system: `You are a project planning assistant. When given a goal, break it down into actionable tasks.

IMPORTANT: You MUST use the create_task_card tool for each task. Do not write text responses. Only call the tool.
    
For each task, call the create_task_card tool with:
- title: Clear, actionable task name
- duration: Estimated time (e.g., "2 hours", "1 day", "1 week")  
- priority: "high", "medium", or "low"

Create 3-6 tasks that logically sequence toward the goal. Start with the most foundational tasks first.`,
    prompt,
    tools: tools as any,
    toolChoice: 'required' as any,
  });

  // Extract tool calls from the result
  const toolCalls = result.toolCalls || [];
  
  return Response.json({ toolCalls });
}