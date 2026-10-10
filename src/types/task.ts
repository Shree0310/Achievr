// Task types for our application

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority?: string; // '1', '2', '3' (High, Medium, Low)
  efforts?: string; // Story points: 1, 2, 3, 5, 8
  user_id: string;
  cycle_id?: string;
  created_at: string;
  updated_at?: string;
  parent_task_id?: string; // For subtasks
}

// Data needed to CREATE a new task
export interface CreateTaskData {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  efforts?: string;
  user_id: string;
  cycle_id?: string;
}

// Data needed to UPDATE a task
export interface UpdateTaskData {
  id: string;
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  efforts?: string;
  cycle_id?: string;
}
