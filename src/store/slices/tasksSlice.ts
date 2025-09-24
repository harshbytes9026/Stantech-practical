import {Task} from '@/types/Task';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  filteredTasks: Task[];
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
  searchQuery: '',
  filteredTasks: [],
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
      state.filteredTasks = action.payload;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
      state.filteredTasks = state.tasks.filter(task =>
        task.title.toLowerCase().includes(state.searchQuery.toLowerCase()),
      );
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(
        task => task.id === action.payload.id,
      );
      if (index !== -1) {
        state.tasks[index] = action.payload;
        state.filteredTasks = state.tasks.filter(task =>
          task.title.toLowerCase().includes(state.searchQuery.toLowerCase()),
        );
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
      state.filteredTasks = state.tasks.filter(task =>
        task.title.toLowerCase().includes(state.searchQuery.toLowerCase()),
      );
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.filteredTasks = state.tasks.filter(task =>
        task.title.toLowerCase().includes(action.payload.toLowerCase()),
      );
    },
    clearSearch: state => {
      state.searchQuery = '';
      state.filteredTasks = state.tasks;
    },
  },
});

export const {
  setLoading,
  setError,
  setTasks,
  addTask,
  updateTask,
  deleteTask,
  setSearchQuery,
  clearSearch,
} = tasksSlice.actions;

export default tasksSlice.reducer;
