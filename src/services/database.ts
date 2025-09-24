import * as SQLite from 'expo-sqlite';
import { Task, CreateTaskData, UpdateTaskData } from '@/types/Task';

const DB_NAME = 'tasks.db';

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async init(): Promise<void> {
    try {
      this.db = SQLite.openDatabase(DB_NAME);
      await this.createTables();
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      this.db!.transaction(tx => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS tasks (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            createdAt TEXT NOT NULL,
            updatedAt TEXT NOT NULL,
            completed INTEGER NOT NULL DEFAULT 0
          );`,
          [],
          () => {
            console.log('Tasks table created successfully');
            resolve();
          },
          (_, error) => {
            console.error('Error creating tasks table:', error);
            reject(error);
            return false;
          }
        );
      });
    });
  }

  async getAllTasks(): Promise<Task[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      this.db!.transaction(tx => {
        tx.executeSql(
          `SELECT * FROM tasks ORDER BY updatedAt DESC`,
          [],
          (_, result) => {
            const tasks = result.rows._array.map((row: any) => ({
              id: row.id,
              title: row.title,
              description: row.description || undefined,
              createdAt: row.createdAt,
              updatedAt: row.updatedAt,
              completed: Boolean(row.completed),
            }));
            resolve(tasks);
          },
          (_, error) => {
            console.error('Failed to get tasks:', error);
            reject(error);
            return false;
          }
        );
      });
    });
  }

  async getTaskById(id: string): Promise<Task | null> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      this.db!.transaction(tx => {
        tx.executeSql(
          `SELECT * FROM tasks WHERE id = ?`,
          [id],
          (_, result) => {
            if (result.rows.length > 0) {
              const row = result.rows.item(0);
              resolve({
                id: row.id,
                title: row.title,
                description: row.description || undefined,
                createdAt: row.createdAt,
                updatedAt: row.updatedAt,
                completed: Boolean(row.completed),
              });
            } else {
              resolve(null);
            }
          },
          (_, error) => {
            console.error('Failed to get task:', error);
            reject(error);
            return false;
          }
        );
      });
    });
  }

  async createTask(taskData: CreateTaskData): Promise<Task> {
    if (!this.db) throw new Error('Database not initialized');

    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const now = new Date().toISOString();

    const task: Task = {
      id,
      title: taskData.title,
      description: taskData.description,
      createdAt: now,
      updatedAt: now,
      completed: false,
    };

    return new Promise((resolve, reject) => {
      this.db!.transaction(tx => {
        tx.executeSql(
          `INSERT INTO tasks (id, title, description, createdAt, updatedAt, completed)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            task.id,
            task.title,
            task.description || null,
            task.createdAt,
            task.updatedAt,
            task.completed ? 1 : 0,
          ],
          () => {
            console.log('Task created successfully');
            resolve(task);
          },
          (_, error) => {
            console.error('Failed to create task:', error);
            reject(error);
            return false;
          }
        );
      });
    });
  }

  async updateTask(taskData: UpdateTaskData): Promise<Task> {
    if (!this.db) throw new Error('Database not initialized');

    const existingTask = await this.getTaskById(taskData.id);
    if (!existingTask) throw new Error('Task not found');

    const updatedTask: Task = {
      ...existingTask,
      ...taskData,
      updatedAt: new Date().toISOString(),
    };

    return new Promise((resolve, reject) => {
      this.db!.transaction(tx => {
        tx.executeSql(
          `UPDATE tasks 
           SET title = ?, description = ?, updatedAt = ?, completed = ?
           WHERE id = ?`,
          [
            updatedTask.title,
            updatedTask.description || null,
            updatedTask.updatedAt,
            updatedTask.completed ? 1 : 0,
            updatedTask.id,
          ],
          () => {
            console.log('Task updated successfully');
            resolve(updatedTask);
          },
          (_, error) => {
            console.error('Failed to update task:', error);
            reject(error);
            return false;
          }
        );
      });
    });
  }

  async deleteTask(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      this.db!.transaction(tx => {
        tx.executeSql(
          `DELETE FROM tasks WHERE id = ?`,
          [id],
          () => {
            console.log('Task deleted successfully');
            resolve();
          },
          (_, error) => {
            console.error('Failed to delete task:', error);
            reject(error);
            return false;
          }
        );
      });
    });
  }

  async searchTasks(query: string): Promise<Task[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      this.db!.transaction(tx => {
        tx.executeSql(
          `SELECT * FROM tasks 
           WHERE title LIKE ? OR description LIKE ?
           ORDER BY updatedAt DESC`,
          [`%${query}%`, `%${query}%`],
          (_, result) => {
            const tasks = result.rows._array.map((row: any) => ({
              id: row.id,
              title: row.title,
              description: row.description || undefined,
              createdAt: row.createdAt,
              updatedAt: row.updatedAt,
              completed: Boolean(row.completed),
            }));
            resolve(tasks);
          },
          (_, error) => {
            console.error('Failed to search tasks:', error);
            reject(error);
            return false;
          }
        );
      });
    });
  }
}

export const databaseService = new DatabaseService();