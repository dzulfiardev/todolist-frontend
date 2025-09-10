import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiClient from '@/api/axios';

export interface TodoTask {
  id: number
  task: string
  developer: string[]
  status: string
  priority: string
  type: string
  date: string
  estimated_sp: number
  actual_sp: number
}

export const useTodoList = defineStore('todoList', () => {
  // State
  const tasks = ref<TodoTask[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const selectedTasks = ref<number[]>([])

  // Actions
  const fetchTasks = async () => {
    try {
      loading.value = true
      error.value = null
      const response = await apiClient.get('/todo-lists')
      tasks.value = response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch tasks'
      console.error('Error fetching tasks:', err)
    } finally {
      loading.value = false
    }
  }

  const addNewTask = async () => {
    try {
      loading.value = true
      const { data } = await apiClient.post('/todo-lists', {});
      await fetchTasks();
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to add new task'
      console.error('Error adding new task:', err)
    } finally {
      loading.value = false
    }

  }

  // Getters
  const getTasks = () => tasks.value
  const getTaskById = (id: number) => tasks.value.find(task => task.id === id)
  const getTasksByStatus = (status: string) => tasks.value.filter(task => task.status === status)
  const getTasksByPriority = (priority: string) => tasks.value.filter(task => task.priority === priority)


  const updateTask = async (id: number, updatedTask: Partial<TodoTask>) => {
    try {
      loading.value = true
      error.value = null
      await apiClient.put(`/todo-lists/${id}`, updatedTask)
      
      // Update local state
      await fetchTasks();
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update task'
      console.error('Error updating task:', err)
      throw err // Re-throw to handle in component
    } finally {
      loading.value = false
    }
  }

  // const deleteTask = (id: number) => {
  //   const index = tasks.value.findIndex(task => task.id === id)
  //   if (index !== -1) {
  //     tasks.value.splice(index, 1)
  //   }
  // }

  const deleteTaskBulk = async () => {
    try {
      loading.value = true
      await apiClient.post(`/todo-lists/bulk-delete`, { ids: selectedTasks.value });
      await fetchTasks();
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete task'
      console.error('Error deleting task:', err)
    } finally {
      loading.value = false
    }
  }

  // Selection actions
  const toggleTaskSelection = (taskId: number, isChecked: boolean) => {
    if (isChecked) {
      if (!selectedTasks.value.includes(taskId)) {
        selectedTasks.value.push(taskId)
      }
    } else {
      selectedTasks.value = selectedTasks.value.filter(id => id !== taskId)
    }
  }

  const toggleSelectAll = () => {
    if (selectedTasks.value.length === tasks.value.length) {
      selectedTasks.value = []
    } else {
      selectedTasks.value = tasks.value.map(task => task.id)
    }
  }

  const clearSelection = () => {
    selectedTasks.value = []
  }

  const getSelectedTasksData = () => {
    return tasks.value.filter(task => selectedTasks.value.includes(task.id))
  }

  return {
    // State
    tasks,
    loading,
    error,
    selectedTasks,
    // Getters
    getTasks,
    getTaskById,
    getTasksByStatus,
    getTasksByPriority,
    getSelectedTasksData,
    // Actions
    fetchTasks,
    addNewTask,
    updateTask,
    deleteTaskBulk,
    toggleTaskSelection,
    toggleSelectAll,
    clearSelection
  }
})
