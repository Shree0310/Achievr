import Task from '@/app/Components/Task/Task';
import { create } from 'zustand';

//For single chat msg
type MessageRole=  'user' | 'assistant';

interface ChatMessage {
    id: string;
    content: string;
    role: MessageRole;
    timestamp: Date;
}

interface PlannerTask {
    id: string;
    title: string;
    description?: string;
    duration: string;
    priority: 'high' | 'medium' | 'low';
}

//Store's state
interface PlannerState {
    //state
    messages: ChatMessage[];
    tasks: PlannerTask[];
    isLoading: boolean;

    //message actions
    addUserMessage: (content: string) => void;
    addAssistantMessage : (content: string) => void;

    //task actions
    addTask: (task: Omit<PlannerTask, 'id'>) => void
    addTasks: (tasks: Omit<PlannerTask, 'id'>[]) => void
    removeTask: (taskId: string) => void;
    updateTask: (taskId: string, updates: Partial<PlannerTask>) => void;

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

  addAssistantMessage: (content: string) => {
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
    });
  },
}));

//SELECTORS FOR PERFORMANCE
export const selectMessages = (state: PlannerState) => state.messages;
export const selectTasks = (state: PlannerState) => state.tasks;
export const selectIsLoading = (state: PlannerState) => state.isLoading;
export const selectTaskCount = (state: PlannerState) =>state.tasks.length;


