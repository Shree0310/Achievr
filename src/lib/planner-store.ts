import Task from '@/app/Components/Task/Task';
import { create } from 'zustand';

//For single chat msg
type MessageRole=  'user' | 'assistant';

export interface TextBlock {
    type: 'text';
    content: string;
}

export interface ExplainBlock {
    type: 'explain';
    context: string;
    bullets: string;
}

//Suggest Actions Block is how AI gives clickable option to the user
//The user drives the conversation by clicking buttons rather than typing everything
export interface SuggestActionsBlock {
    type: 'suggest_actions';
    prompt: string;
    actions: { id: string, label: string }[];
}

export interface TaskCardsBlock {
    type: 'task_cards';
    tasks: PlannerTask[];
}

export interface ListFeaturesBlock {
    type: 'list_features';
    heading: string;
    items: string[];
}

export type ContentBlock = TextBlock | ExplainBlock | SuggestActionsBlock | TaskCardsBlock | ListFeaturesBlock;

//Chat Message - User sends strings, Assistant sends content blocks
export interface ChatMessage {
    id: string;
    content: string | ContentBlock[];
    role: MessageRole;
    timestamp: Date;
}

//Task type
export interface PlannerTask {
    id: string;
    title: string;
    description?: string;
    duration: string;
    priority: 'high' | 'medium' | 'low';
}

//Store's state
export interface PlannerState {
    //state
    messages: ChatMessage[];
    tasks: PlannerTask[];
    isLoading: boolean;
    conversationHistory: { role: string; content: string }[]

    //message actions
    addUserMessage: (content: string) => void;
    addAssistantMessage : (content: ContentBlock[]) => void;

    //task actions
    addTask: (task: Omit<PlannerTask, 'id'>) => void
    addTasks: (tasks: Omit<PlannerTask, 'id'>[]) => void
    removeTask: (taskId: string) => void;
    updateTask: (taskId: string, updates: Partial<PlannerTask>) => void;
    reorderTasks: (fromIndex: number, toIndex: number) => void;

    //state action for conversation history
    setConversationHistory: (history: { role: string; content: string }[]) => void;

    //General state actions
    setLoading : (loading: boolean) => void;
    reset: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

//Store
export const usePlannerStore = create<PlannerState>((set) => ({
  // Initial state
  messages: [],
  tasks: [],
  isLoading: false,
  conversationHistory: [],

  // Action: Add a user message
  addUserMessage: (content: string) => {
    const message: ChatMessage = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    
    // set() updates the state
    // We get the previous state and return the new state
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  addAssistantMessage: (content: ContentBlock[]) => {
    const message: ChatMessage = {
      id: generateId(),
      role: 'assistant',
      content,
      timestamp: new Date(),
    };
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  addTask: (task) => {
    const newTask: PlannerTask = {
      ...task,
      id: generateId(),
    };
    set((state) => ({
      tasks: [...state.tasks, newTask],
    }));
  },

  addTasks: (tasks) => {
    const newTasks : PlannerTask[] = tasks.map((task) => ({
      ...task,
      id: generateId(),
    }));
    set((state) => ({
      tasks: [...state.tasks, ...newTasks],
    }));
  },

  removeTask: (taskId: string) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id != taskId),
    }));
  },

  updateTask: (taskId: string, updates: Partial<PlannerTask>) => {
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, ...updates } : t
      ),
    }));
  },

  reorderTasks: (fromIndex: number, toIndex: number) => {
    set((state) => {
      const tasks = [...state.tasks];
      const [movedTask] = tasks.splice(fromIndex, 1);
      tasks.splice(toIndex, 0, movedTask);
      return { tasks };
    });
  },

  setConversationHistory: (history: { role: string; content: string }[]) => {
    set({ conversationHistory: history });
  },

  // Action: Set loading state
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  // Action: Reset everything
  reset: () => {
    set({
      messages: [],
      tasks: [],
      isLoading: false,
      conversationHistory: [],
    });
  },
}));

//SELECTORS FOR PERFORMANCE
export const selectMessages = (state: PlannerState) => state.messages;
export const selectTasks = (state: PlannerState) => state.tasks;
export const selectIsLoading = (state: PlannerState) => state.isLoading;
export const selectTaskCount = (state: PlannerState) =>state.tasks.length;


