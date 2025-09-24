export interface Task {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  completed: boolean;
}

export interface CreateTaskData {
  title: string;
  description?: string;
}

export interface UpdateTaskData {
  id: string;
  title?: string;
  description?: string;
  completed?: boolean;
}
