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
  {
    name: 'list_features',
    description: 'Present a list of features, MVP items, or planning points. Use when user asks to define, list, or brainstorm features.',
    input_schema: {
      type: 'object',
      properties: {
        heading: {
          type: 'string',
          description: 'Heading for the list (e.g., "MVP Features for Fitness App")',
        },
        items: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of features or items',
        },
      },
      required: ['heading', 'items'],
    },
  },
];

const SYSTEM_PROMPT = `You are an AI project planner assistant. Help users turn vague goals into concrete, actionable project plans.

## CRITICAL INSTRUCTION - READ CAREFULLY

You MUST ALWAYS use suggest_actions tool after explain_approach. NEVER skip suggest_actions.

## Response patterns (MANDATORY):

### Pattern 1: Initial goal from user
User says: "I want to build X" or "Help me with Y"
YOU MUST USE BOTH TOOLS:
1. explain_approach (context + 3-5 bullets)
2. suggest_actions (2-4 buttons like "Create project tasks now", "Draft MVP features", "Ask clarifying questions")

### Pattern 2: User requests SPECIFIC features or planning
User says: "Define MVP features", "Draft features", "What features should I include", etc.
YOU MUST USE:
1. Multiple create_task_card (4-8 feature-based tasks, vary priorities, include durations)
   - Each task represents a key feature or component
   - Make them specific and actionable
2. suggest_actions (follow-up options like "Add more features", "Refine these", "Create implementation timeline")

### Pattern 3: User requests general tasks or "Create tasks"
User says: "Create project tasks now", "Create tasks", "Give me tasks"
YOU MUST USE:
1. Multiple create_task_card (6-10 comprehensive project tasks, vary priorities, include durations)
   - Cover all aspects: planning, design, development, testing, deployment
   - Make tasks concrete and actionable
2. suggest_actions (follow-up options like "Add more tasks", "Break down complex tasks", "Add milestones")

### Pattern 4: Brief acknowledgment
Only use send_text for very brief confirmations (rare)

## ABSOLUTE RULE
- Every response MUST end with suggest_actions (except final confirmations)
- If you use explain_approach, you MUST also use suggest_actions in the SAME response
- When user asks for features, MVP, or tasks → ALWAYS create task cards, NOT just explanations
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

    // Debug logging
    console.log('Tool calls:', toolCalls.map(tc => tc.tool).join(', '));

    // Debug bullets rendering
    const explainApproach = toolCalls.find(tc => tc.tool === 'explain_approach');
    if (explainApproach) {
      console.log('Explain approach bullets:', JSON.stringify(explainApproach.args.bullets, null, 2));
      console.log('Bullets type:', typeof explainApproach.args.bullets);
      console.log('Is array?', Array.isArray(explainApproach.args.bullets));
    }

    // Fallback: If explain_approach was used but suggest_actions wasn't, add a default suggest_actions
    const hasExplainApproach = toolCalls.some(tc => tc.tool === 'explain_approach');
    const hasSuggestActions = toolCalls.some(tc => tc.tool === 'suggest_actions');

    if (hasExplainApproach && !hasSuggestActions) {
      console.log('⚠️ Adding fallback suggest_actions');
      toolCalls.push({
        tool: 'suggest_actions',
        args: {
          prompt: 'What would you like to do next?',
          actions: [
            { id: 'create_tasks', label: 'Create project tasks now' },
            { id: 'ask_questions', label: 'Ask clarifying questions' },
            { id: 'define_mvp', label: 'Define MVP features' },
          ],
        },
      });
    }

    // Build tool results for any tool uses
    const toolResults = response.content
      .filter((block): block is Anthropic.Messages.ToolUseBlock => block.type === 'tool_use')
      .map(block => ({
        type: 'tool_result' as const,
        tool_use_id: block.id,
        content: 'Success', // Acknowledge tool use
      }));

    // Build conversation history with tool results
    const newHistory: Anthropic.Messages.MessageParam[] = [
      ...conversationHistory,
      { role: 'user', content: message },
      { role: 'assistant', content: response.content },
    ];

    // If there were tool uses, add a user message with tool results
    if (toolResults.length > 0) {
      newHistory.push({
        role: 'user',
        content: toolResults,
      });
    }

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