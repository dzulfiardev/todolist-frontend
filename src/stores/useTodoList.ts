import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiClient from '@/api/axios'

export interface TodoTask {
  id: number
  task: string
  developer: string[]
  status: string
  status_raw: string
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
  const search = ref<string>('')
  const sortBy = ref<string>('')
  const direction = ref<string>('asc')

  // Actions
  const fetchTasks = async () => {
    try {
      loading.value = true
      error.value = null
      
      // Build params object, include search if it has value
      const params: any = {}
      if (search.value && search.value.trim() !== '') {
        params.search = search.value.trim()
      }

      if (sortBy.value) {
        params.sort_by = sortBy.value
        params.order_direction = direction.value
      }
      
      const response = await apiClient.get('/todo-lists', {
        params: params
      });

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
      console.error('Error updating task:', err.response.data.errors)
      throw err // Re-throw to handle in component
    } finally {
      loading.value = false
    }
  }

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
    search,
    sortBy,
    direction,
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
