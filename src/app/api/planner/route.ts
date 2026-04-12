import Anthropic from '@anthropic-ai/sdk';

export const maxDuration = 60;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Tool schemas for Claude
const tools: Anthropic.Messages.Tool[] = [
  {
    name: 'explain_approach',
    description: 'Explain your approach to the user with context and bullet points. Use this at the start to set expectations.',
    input_schema: {
      type: 'object',
      properties: {
        context: {
          type: 'string',
          description: 'Opening statement explaining how you will help',
        },
        bullets: {
          type: 'array',
          items: { type: 'string' },
          description: 'Key points or considerations as bullet points',
        },
      },
      required: ['context', 'bullets'],
    },
  },
  {
    name: 'suggest_actions',
    description: 'Offer 2-4 possible next steps as clickable buttons. Use this to let the user guide the direction.',
    input_schema: {
      type: 'object',
      properties: {
        prompt: {
          type: 'string',
          description: 'Text before the buttons, e.g. "Possible next steps:"',
        },
        actions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', description: 'Unique identifier for this action' },
              label: { type: 'string', description: 'Button label shown to user' },
            },
            required: ['id', 'label'],
          },
          minItems: 1,
          maxItems: 4,
          description: 'Array of action objects',
        },
      },
      required: ['prompt', 'actions'],
    },
  },
  {
    name: 'create_task_card',
    description: 'Create a task/issue for the project. Use this when generating concrete action items.',
    input_schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Clear, actionable task name',
        },
        duration: {
          type: 'string',
          description: 'Estimated time like "2 hours", "1 day", "1 week"',
        },
        priority: {
          type: 'string',
          enum: ['high', 'medium', 'low'],
          description: 'Task priority level',
        },
        description: {
          type: 'string',
          description: 'Optional detailed description',
        },
      },
      required: ['title', 'duration', 'priority'],
    },
  },
  {
    name: 'send_text',
    description: 'Send a plain text message. Use for short confirmations or transitions.',
    input_schema: {
      type: 'object',
      properties: {
        content: {
          type: 'string',
          description: 'The text message to send',
        },
      },
      required: ['content'],
    },
  },
];

const SYSTEM_PROMPT = `You are an AI project planner assistant. Help users turn vague goals into concrete, actionable project plans.

## How to respond

1. When a user shares a goal, FIRST use explain_approach to:
   - Acknowledge their goal
   - List 3-5 key considerations as bullets
   - Set expectations for what you'll help with

2. THEN use suggest_actions to offer 2-4 possible next steps, such as:
   - "Draft an MVP feature list"
   - "Create project tasks now"
   - "Ask clarifying questions"
   - "Create a timeline"

3. When the user wants tasks, use create_task_card multiple times (4-8 tasks typically):
   - Make tasks specific and actionable
   - Vary priorities realistically
   - Include realistic duration estimates

4. After creating tasks, use suggest_actions again for follow-ups like:
   - "Add more tasks"
   - "Refine these tasks"
   - "Add milestones"

## Rules
- Always start with explain_approach for new goals
- Always end your turn with suggest_actions (except for final confirmation)
- Use send_text sparingly, only for brief confirmations
- Create 4-8 tasks when asked to generate a project plan
- Be conversational but efficient
`;

export async function POST(req: Request) {
  try {
    const { message, conversationHistory = [] } = await req.json();

    if (!message) {
      return Response.json({ error: 'Message is required' }, { status: 400 });
    }

    // Build messages array for Anthropic
    const messages: Anthropic.Messages.MessageParam[] = [
      ...conversationHistory,
      { role: 'user', content: message },
    ];

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages,
      tools,
    });

    // Collect all tool calls from the response
    const toolCalls: any[] = [];
    let textContent = '';

    for (const block of response.content) {
      if (block.type === 'tool_use') {
        toolCalls.push({
          tool: block.name,
          args: block.input,
        });
      } else if (block.type === 'text') {
        textContent = block.text;
      }
    }

    // Build assistant response for history
    const newHistory = [
      ...conversationHistory,
      { role: 'user', content: message },
      { role: 'assistant', content: response.content },
    ];

    return Response.json({
      toolCalls,
      text: textContent,
      conversationHistory: newHistory,
    });

  } catch (error: any) {
    console.error('Planner API error:', error);
    return Response.json(
      { error: 'Failed to process request', message: error.message },
      { status: 500 }
    );
  }
}