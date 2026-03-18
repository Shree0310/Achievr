import { z } from 'zod';

 //The inputSchema tells Claude exactly what parameters the tool expects 
const taskCardSchema = z.object({
  title: z.string().describe('Clear, actionable task name'),
  description: z.string().describe('Clear, descriptive task description'),
  duration: z.string().describe('Estimated time like "2 hours" or "1 day"'),
  priority: z.enum(['high', 'medium', 'low']).describe('Task priority level'),
});

export const tools = {
  create_task_card: {
    description: 'Create a task card for the project plan',
    inputSchema: taskCardSchema, //zod schema
  },
} as const;

export type TaskCardArgs = z.infer<typeof taskCardSchema>;

//TWhy Zod? It provides both TypeScript types AND runtime validation. Claude's output gets validated against this schema.