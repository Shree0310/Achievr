import OpenAI from 'openai';

export const maxDuration = 60;

// Lazy-load OpenAI client to avoid build-time errors
function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// Tool schemas for OpenAI
const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'explain_approach',
      description: 'Explain your approach to the user with context and bullet points. Use this at the start to set expectations.',
      parameters: {
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
  },
  {
    type: 'function',
    function: {
      name: 'suggest_actions',
      description: 'Offer 2-4 possible next steps as clickable buttons. Use this to let the user guide the direction.',
      parameters: {
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
  },
  {
    type: 'function',
    function: {
      name: 'create_task_card',
      description: 'Create a task/issue for the project. Use this when generating concrete action items.',
      parameters: {
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
  },
  {
    type: 'function',
    function: {
      name: 'send_text',
      description: 'Send a plain text message. Use for short confirmations or transitions.',
      parameters: {
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
  },
  {
    type: 'function',
    function: {
      name: 'list_features',
      description: 'Present a list of features, MVP items, or planning points. Use when user asks to define, list, or brainstorm features.',
      parameters: {
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
  },
];

const SYSTEM_PROMPT = `You are an AI project planner assistant. Help users turn vague goals into concrete, actionable project plans.

## CRITICAL INSTRUCTION - READ CAREFULLY

You MUST ALWAYS use suggest_actions at the end. NEVER skip suggest_actions.

## Response patterns (MANDATORY):

### Pattern 1: Initial goal from user
User says: "I want to build X" or "Help me with Y"
YOU MUST USE:
1. explain_approach (context + 3-5 bullets)
2. suggest_actions (buttons like "Define MVP features", "Create project tasks", "Ask clarifying questions")

### Pattern 2: User asks to DEFINE/LIST features
User says: "Define MVP features", "What features should I include", "List the features"
YOU MUST USE:
1. list_features (heading + 5-8 specific features)
2. suggest_actions (buttons like "Turn these into tasks", "Add technical architecture", "Refine features")

### Pattern 3: User asks to CREATE TASKS
User says ANY variation of: "Create tasks", "Turn these into tasks", "Create project plan", "create basic level one tasks", "make tasks", "generate tasks"

YOU MUST IMMEDIATELY call create_task_card with a real task.

Example: User says "create basic level one tasks for this"
YOU MUST CALL: create_task_card(title: "Set up project structure and dependencies", duration: "2 days", priority: "high")

DO NOT just explain - CREATE THE TASK IMMEDIATELY.

Example: If features were [Login, Dashboard, API, Database, Testing, Deployment, Monitoring]
You MUST make these tool calls:
1. create_task_card(title: "Implement user login", duration: "3 days", priority: "high")
2. create_task_card(title: "Build dashboard UI", duration: "5 days", priority: "medium")
3. create_task_card(title: "Develop REST API", duration: "1 week", priority: "high")
4. create_task_card(title: "Set up database", duration: "2 days", priority: "high")
5. create_task_card(title: "Write tests", duration: "4 days", priority: "medium")
6. create_task_card(title: "Deploy to production", duration: "1 day", priority: "high")
7. create_task_card(title: "Add monitoring", duration: "2 days", priority: "low")

Then after ALL task cards:
8. suggest_actions(prompt: "What would you like to do next?", actions: [...])

### Pattern 4: Brief acknowledgment
Only use send_text for very brief confirmations (rare)

## ABSOLUTE RULES
- Every response MUST end with suggest_actions
- Features/MVP → use list_features tool (NOT create_task_card)
- Create tasks → use create_task_card tool
- NEVER create tasks when user only asks for features
`;

export async function POST(req: Request) {
  try {
    const { message, conversationHistory = [] } = await req.json();

    if (!message) {
      return Response.json({ error: 'Message is required' }, { status: 400 });
    }

    console.log('🤖 Using OpenAI GPT-4o-mini');

    // Build messages array for OpenAI
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_PROMPT },
    ];

    // Add conversation history
    for (const msg of conversationHistory) {
      if (msg.role === 'user' && typeof msg.content === 'string') {
        messages.push({ role: 'user', content: msg.content });
      } else if (msg.role === 'assistant') {
        // Extract text content from assistant messages
        let textContent = '';
        if (Array.isArray(msg.content)) {
          for (const block of msg.content) {
            if (block.type === 'text') {
              textContent += block.text;
            }
          }
        }
        if (textContent) {
          messages.push({ role: 'assistant', content: textContent });
        }
      }
    }

    // Add current user message
    messages.push({ role: 'user', content: message });

    // Get OpenAI client (lazy-loaded to avoid build-time errors)
    const openai = getOpenAIClient();

    // Call OpenAI with retry logic for rate limits
    let completion;
    let retries = 3;

    while (retries > 0) {
      try {
        completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini', // Better tool calling than gpt-3.5-turbo
          messages,
          tools,
          tool_choice: 'auto', // Force tool usage when appropriate
          temperature: 0.7,
        });
        break; // Success, exit retry loop
      } catch (error: any) {
        if (error.status === 429 && retries > 1) {
          // Rate limit - wait and retry
          console.log(`Rate limit hit, waiting 3s before retry... (${retries - 1} retries left)`);
          await new Promise(resolve => setTimeout(resolve, 3000));
          retries--;
        } else {
          throw error; // Not a rate limit or out of retries
        }
      }
    }

    const response = completion!.choices[0].message;

    // Extract tool calls and text
    const toolCalls: any[] = [];
    let textContent = response.content || '';

    if (response.tool_calls) {
      for (const toolCall of response.tool_calls) {
        toolCalls.push({
          tool: toolCall.function.name,
          args: JSON.parse(toolCall.function.arguments),
        });
      }
    }

    console.log('Tool calls:', toolCalls.map(tc => tc.tool).join(', '));

    // Auto-generate remaining tasks if user asked to create tasks
    const userAskedForTasks = message.toLowerCase().includes('turn') ||
                               message.toLowerCase().includes('create task') ||
                               message.toLowerCase().includes('into task');

    if (userAskedForTasks && toolCalls.some(tc => tc.tool === 'create_task_card')) {
      // Look for list_features in recent conversation
      let featureList: string[] = [];
      for (const msg of conversationHistory.slice(-4)) {
        if (msg.role === 'assistant' && typeof msg.content !== 'string') {
          // This might contain tool results from a previous list_features call
          // We'll extract from message text for now (OpenAI limitation)
        }
      }

      // If we found features and only created 1 task, create the rest
      // For now, create 5-7 common tasks for any app
      const taskCardCalls = toolCalls.filter(tc => tc.tool === 'create_task_card');
      if (taskCardCalls.length === 1) {
        console.log('⚠️ Only 1 task created, auto-generating more tasks');

        const additionalTasks = [
          { title: 'Design user interface and experience', duration: '1 week', priority: 'high' },
          { title: 'Set up backend infrastructure', duration: '3 days', priority: 'high' },
          { title: 'Implement core features', duration: '2 weeks', priority: 'high' },
          { title: 'Create database schema', duration: '2 days', priority: 'high' },
          { title: 'Build authentication system', duration: '4 days', priority: 'medium' },
          { title: 'Add testing and QA', duration: '1 week', priority: 'medium' },
        ];

        for (const task of additionalTasks) {
          toolCalls.push({
            tool: 'create_task_card',
            args: task,
          });
        }
      }
    }

    // OpenAI doesn't call multiple tools in parallel like Claude
    // If we got list_features or explain_approach but no suggest_actions, add it manually
    const hasExplainApproach = toolCalls.some(tc => tc.tool === 'explain_approach');
    const hasListFeatures = toolCalls.some(tc => tc.tool === 'list_features');
    const hasSuggestActions = toolCalls.some(tc => tc.tool === 'suggest_actions');

    if ((hasExplainApproach || hasListFeatures) && !hasSuggestActions) {
      console.log('⚠️ Adding fallback suggest_actions');

      const defaultActions = hasListFeatures
        ? [
            { id: 'create_tasks', label: 'Turn these into tasks' },
            { id: 'add_more', label: 'Add more features' },
            { id: 'refine', label: 'Refine these features' },
          ]
        : [
            { id: 'create_tasks', label: 'Create project tasks now' },
            { id: 'ask_questions', label: 'Ask clarifying questions' },
            { id: 'define_mvp', label: 'Define MVP features' },
          ];

      toolCalls.push({
        tool: 'suggest_actions',
        args: {
          prompt: 'What would you like to do next?',
          actions: defaultActions,
        },
      });
    }

    // Build new conversation history
    const newHistory = [
      ...conversationHistory,
      { role: 'user', content: message },
      {
        role: 'assistant',
        content: [{ type: 'text', text: textContent || 'Processing...' }]
      },
    ];

    return Response.json({
      toolCalls,
      text: textContent,
      conversationHistory: newHistory,
      _meta: { mode: 'real', source: 'openai', model: 'gpt-4o-mini' }
    });

  } catch (error: any) {
    console.error('Planner API error:', {
      message: error.message,
      status: error.status,
      type: error.type,
      fullError: error
    });

    let userMessage = error.message;
    if (error.status === 401 || error.message?.includes('authentication') || error.message?.includes('API key')) {
      userMessage = '⚠️ Invalid OpenAI API key. Please check your OPENAI_API_KEY in .env.local\n\nGet an API key at: https://platform.openai.com/api-keys';
    } else if (error.status === 429) {
      userMessage = '⚠️ Rate limit exceeded. Please wait a moment and try again.';
    } else if (error.status === 402 || error.message?.includes('quota') || error.message?.includes('billing')) {
      userMessage = '⚠️ OpenAI billing issue. Please check your account at: https://platform.openai.com/account/billing';
    }

    return Response.json(
      { error: 'Failed to process request', message: userMessage },
      { status: 500 }
    );
  }
}
