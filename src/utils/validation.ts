export const validateTaskTitle = (title: string): string | null => {
  if (!title || title.trim().length === 0) {
    return 'Task title is required';
  }
  if (title.trim().length < 3) {
    return 'Task title must be at least 3 characters long';
  }
  if (title.trim().length > 100) {
    return 'Task title must be less than 100 characters';
  }
  return null;
};

export const validateTaskDescription = (description: string): string | null => {
  if (description && description.length > 500) {
    return 'Task description must be less than 500 characters';
  }
  return null;
};