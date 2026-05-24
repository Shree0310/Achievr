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
User says: "Create tasks", "Turn these into tasks", "Create project plan"

CRITICAL INSTRUCTION - YOU MUST CALL create_task_card MULTIPLE TIMES:

If you just showed 7 features, you must create 7 tasks by calling create_task_card 7 separate times.

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

    // DEMO MODE: Mock AI responses until Anthropic API key is properly configured
    const USE_DEMO_MODE = false; // Set to false after waiting 5-10 min for Anthropic billing to activate

    if (USE_DEMO_MODE) {
      console.log('🎭 DEMO MODE: Using hardcoded responses (not Claude AI)');
      console.log('💡 To use real Claude AI: Add billing to your Anthropic account, then set USE_DEMO_MODE = false');

      // Wait a bit to simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const lowerMessage = message.toLowerCase();
      let mockToolCalls: any[] = [];

      // Pattern 1: Initial request - explain approach
      if (conversationHistory.length === 0 || lowerMessage.includes('build') || lowerMessage.includes('create app')) {
        mockToolCalls = [
          {
            tool: 'explain_approach',
            args: {
              context: "I'll help you plan this project step by step. Here's my approach:",
              bullets: [
                "Define the core features and MVP scope",
                "Break down into manageable tasks with time estimates",
                "Prioritize based on dependencies and value",
                "Create a realistic timeline"
              ]
            }
          },
          {
            tool: 'suggest_actions',
            args: {
              prompt: "What would you like to do next?",
              actions: [
                { id: 'features', label: 'Define MVP features' },
                { id: 'tasks', label: 'Create project tasks' },
                { id: 'questions', label: 'Ask clarifying questions' }
              ]
            }
          }
        ];
      }
      // Pattern 2: User asks for features
      else if (lowerMessage.includes('feature') || lowerMessage.includes('mvp') || lowerMessage.includes('define')) {
        const projectType = lowerMessage.includes('fitness') ? 'Fitness App' :
                          lowerMessage.includes('ecommerce') ? 'E-commerce Platform' :
                          lowerMessage.includes('social') ? 'Social Network' : 'Your Project';

        mockToolCalls = [
          {
            tool: 'list_features',
            args: {
              heading: `MVP Features for ${projectType}`,
              items: [
                "User authentication and profile management",
                "Dashboard with key metrics and overview",
                "Core functionality (main feature set)",
                "Data storage and management",
                "Responsive design for mobile and desktop",
                "Search and filtering capabilities",
                "User settings and preferences",
                "Notifications system"
              ]
            }
          },
          {
            tool: 'suggest_actions',
            args: {
              prompt: "Ready to move forward?",
              actions: [
                { id: 'create_tasks', label: 'Turn these into tasks' },
                { id: 'add_features', label: 'Add more features' },
                { id: 'refine', label: 'Refine features' }
              ]
            }
          }
        ];
      }
      // Pattern 3: User asks to create tasks
      else if (lowerMessage.includes('task') || lowerMessage.includes('turn these')) {
        mockToolCalls = [
          {
            tool: 'create_task_card',
            args: {
              title: "Set up project structure and authentication",
              duration: "3 days",
              priority: "high",
              description: "Initialize project, set up auth system"
            }
          },
          {
            tool: 'create_task_card',
            args: {
              title: "Build main dashboard UI",
              duration: "5 days",
              priority: "high",
              description: "Create responsive dashboard layout"
            }
          },
          {
            tool: 'create_task_card',
            args: {
              title: "Implement core functionality",
              duration: "1 week",
              priority: "high",
              description: "Develop main feature set"
            }
          },
          {
            tool: 'create_task_card',
            args: {
              title: "Set up database and data models",
              duration: "2 days",
              priority: "high",
              description: "Design and implement data schema"
            }
          },
          {
            tool: 'create_task_card',
            args: {
              title: "Add search and filtering",
              duration: "4 days",
              priority: "medium",
              description: "Implement search functionality"
            }
          },
          {
            tool: 'create_task_card',
            args: {
              title: "Build notifications system",
              duration: "3 days",
              priority: "medium",
              description: "Create notification infrastructure"
            }
          },
          {
            tool: 'create_task_card',
            args: {
              title: "Testing and bug fixes",
              duration: "5 days",
              priority: "low",
              description: "Comprehensive testing and fixes"
            }
          },
          {
            tool: 'suggest_actions',
            args: {
              prompt: "Tasks created! What's next?",
              actions: [
                { id: 'add_board', label: 'Add to board' },
                { id: 'refine', label: 'Refine tasks' },
                { id: 'start_over', label: 'Start new plan' }
              ]
            }
          }
        ];
      }
      // Default response
      else {
        mockToolCalls = [
          {
            tool: 'send_text',
            args: {
              content: "I can help you plan your project! Try asking me to 'Define MVP features' or 'Create project tasks'."
            }
          },
          {
            tool: 'suggest_actions',
            args: {
              prompt: "How can I help?",
              actions: [
                { id: 'features', label: 'Define features' },
                { id: 'tasks', label: 'Create tasks' },
                { id: 'plan', label: 'Full project plan' }
              ]
            }
          }
        ];
      }

      // Build mock conversation history
      const newHistory: Anthropic.Messages.MessageParam[] = [
        ...conversationHistory,
        { role: 'user', content: message },
        { role: 'assistant', content: [{ type: 'text', text: 'Demo response' }] }
      ];

      return Response.json({
        toolCalls: mockToolCalls,
        text: '',
        conversationHistory: newHistory,
        // Add metadata to indicate demo mode
        _meta: { mode: 'demo', source: 'hardcoded' }
      });
    }

    // ========================================
    // REAL CLAUDE AI MODE
    // ========================================
    // This section uses the actual Claude API (requires working Anthropic API key with billing)
    // Build messages array for Anthropic
    const messages: Anthropic.Messages.MessageParam[] = [
      ...conversationHistory,
      { role: 'user', content: message },
    ];

    console.log('🤖 REAL MODE: Using Claude AI');

    // Try multiple models in order of preference
    const modelsToTry = [
      'claude-3-5-sonnet-20241022',
      'claude-3-5-sonnet-20240620',
      'claude-3-opus-20240229',
      'claude-3-sonnet-20240229',
      'claude-3-haiku-20240307'
    ];

    let response;
    let lastError;

    for (const model of modelsToTry) {
      try {
        console.log(`Trying model: ${model}`);
        response = await anthropic.messages.create({
          model,
          max_tokens: 4096,
          system: SYSTEM_PROMPT,
          messages,
          tools,
        });
        console.log(`✅ Success with model: ${model}`);
        break;
      } catch (error: any) {
        console.log(`❌ Failed with ${model}: ${error.message}`);
        lastError = error;
        if (!error.message?.includes('not_found_error')) {
          // If it's not a model not found error, throw immediately
          throw error;
        }
        continue;
      }
    }

    if (!response) {
      throw new Error(`No available Claude models. Last error: ${lastError?.message}. Please ensure billing is set up at https://console.anthropic.com/settings/billing`);
    }

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

    // Log task card count for debugging
    const taskCardCalls = toolCalls.filter(tc => tc.tool === 'create_task_card');
    if (taskCardCalls.length > 0) {
      console.log(`✅ Created ${taskCardCalls.length} task card(s)`);
    }

    // INTELLIGENT FALLBACK: Auto-generate remaining tasks if Haiku only created 1-2 tasks
    // Check if user just asked to create tasks and there was a recent list_features
    const userAskedForTasks = message.toLowerCase().includes('turn') ||
                               message.toLowerCase().includes('create task') ||
                               message.toLowerCase().includes('into task');

    if (userAskedForTasks && taskCardCalls.length > 0 && taskCardCalls.length < 4) {
      console.log(`⚠️ Only ${taskCardCalls.length} task(s) created, checking for feature list to expand...`);

      // Look for list_features in recent conversation
      const recentAssistantMessages = conversationHistory
        .slice(-4) // Check last 4 messages
        .filter((msg: Anthropic.Messages.MessageParam) => msg.role === 'assistant');
        interface ToolCall {
            tool: string;
            args: Record<string, any>;
        }

        interface ExplainApproachArgs {
            context: string;
            bullets: string[];
        }

        interface ActionItem {
            id: string;
            label: string;
        }

        interface SuggestActionsArgs {
            prompt: string;
            actions: ActionItem[];
        }

        interface CreateTaskCardArgs {
            title: string;
            duration: string;
            priority: 'high' | 'medium' | 'low';
            description?: string;
        }

        interface ListFeaturesArgs {
            heading: string;
            items: string[];
        }

        interface SendTextArgs {
            content: string;
        }

        interface ToolUseContent {
            type: 'tool_use';
            name: string;
            input: Record<string, any>;
        }

        interface ConversationMessage {
            role: 'user' | 'assistant';
            content: string | Anthropic.Messages.ContentBlock[] | Anthropic.Messages.ToolResultBlockParam[];
        }

        interface PlannerResponse {
            toolCalls: ToolCall[];
            text: string;
            conversationHistory: Anthropic.Messages.MessageParam[];
        }

        interface PlannerRequest {
            message: string;
            conversationHistory?: Anthropic.Messages.MessageParam[];
        }

      let featureList: string[] = [];
      for (const msg of recentAssistantMessages) {
        if (typeof msg.content !== 'string') {
          // Parse the content to find list_features
          const parsedContent = Array.isArray(msg.content) ? msg.content : [msg.content];
          for (const block of parsedContent as any[]) {
            if (block && typeof block === 'object' && 'type' in block && block.type === 'tool_use' &&
                'name' in block && block.name === 'list_features' && 'input' in block) {
              featureList = (block.input as any).items || [];
              break;
            }
          }
          if (featureList.length > 0) break;
        }
      }

      if (featureList.length > taskCardCalls.length) {
        console.log(`✨ Found ${featureList.length} features, auto-generating ${featureList.length - taskCardCalls.length} more tasks`);

        // Generate tasks for remaining features
        const existingTitles = new Set(taskCardCalls.map(tc => tc.args.title.toLowerCase()));
        const remainingFeatures = featureList.filter(
          feature => !existingTitles.has(feature.toLowerCase().substring(0, 20))
        );

        const priorities = ['high', 'medium', 'low'] as const;
        const durations = ['2 days', '3 days', '1 week', '4 days', '5 days', '1.5 weeks'];

        for (let i = 0; i < remainingFeatures.length; i++) {
          toolCalls.push({
            tool: 'create_task_card',
            args: {
              title: remainingFeatures[i],
              duration: durations[i % durations.length],
              priority: priorities[i % priorities.length],
              description: `Implement: ${remainingFeatures[i]}`,
            },
          });
        }

        console.log(`✅ Auto-generated ${remainingFeatures.length} additional tasks`);
      }
    }

    // Fallback: Add suggest_actions if missing
    const hasExplainApproach = toolCalls.some(tc => tc.tool === 'explain_approach');
    const hasListFeatures = toolCalls.some(tc => tc.tool === 'list_features');
    const hasSuggestActions = toolCalls.some(tc => tc.tool === 'suggest_actions');

    if ((hasExplainApproach || hasListFeatures) && !hasSuggestActions) {
      console.log('⚠️ Adding fallback suggest_actions');

      // Different defaults based on context
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
      // Add metadata to indicate real AI mode
      _meta: { mode: 'real', source: 'claude-ai' }
    });

  } catch (error: any) {
    console.error('Planner API error:', error);

    // Provide helpful error messages
    let userMessage = error.message;
    if (error.message?.includes('not_found_error') || error.message?.includes('No available Claude models')) {
      userMessage = '⚠️ Your Anthropic API key needs billing activated. Please:\n1. Go to https://console.anthropic.com/settings/billing\n2. Add a payment method\n3. Wait 5-10 minutes for activation\n4. Refresh this page';
    } else if (error.message?.includes('authentication')) {
      userMessage = '⚠️ Invalid API key. Please check your ANTHROPIC_API_KEY in .env.local';
    }

    return Response.json(
      { error: 'Failed to process request', message: userMessage },
      { status: 500 }
    );
  }
}