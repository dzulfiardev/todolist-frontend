import apiClient from './axios'
import type { TodoTask } from '@/stores/useTodoList'

// Todo API service
export const todoApi = {
  // Get all tasks
  getTasks: async (): Promise<TodoTask[]> => {
    const response = await apiClient.get('/tasks')
    return response.data
  },

  // Get task by ID
  getTask: async (id: number): Promise<TodoTask> => {
    const response = await apiClient.get(`/tasks/${id}`)
    return response.data
  },

  // Create new task
  createTask: async (task: Omit<TodoTask, 'id'>): Promise<TodoTask> => {
    const response = await apiClient.post('/tasks', task)
    return response.data
  },

  // Update task
  updateTask: async (id: number, task: Partial<TodoTask>): Promise<TodoTask> => {
    const response = await apiClient.put(`/tasks/${id}`, task)
    return response.data
  },

  // Delete task
  deleteTask: async (id: number): Promise<void> => {
    await apiClient.delete(`/tasks/${id}`)
  },

  // Bulk operations
  bulkDelete: async (ids: number[]): Promise<void> => {
    await apiClient.post('/tasks/bulk-delete', { ids })
  },

  // Update task status
  updateTaskStatus: async (id: number, status: string): Promise<TodoTask> => {
    const response = await apiClient.patch(`/tasks/${id}/status`, { status })
    return response.data
  }
}

export default todoApi
