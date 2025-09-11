<template>
  <div class="mb-5">
    <!-- Tools Container -->
    <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
      <!-- New Task Button -->
      <button @click="handleNewTask"
        class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 whitespace-nowrap">
        New Task
        <i class="fa-solid fa-chevron-down ml-5"></i>
      </button>

      <!-- Search Input Container -->
      <div class="relative w-full sm:max-w-xs sm:w-64">
        <!-- Magnifying Glass Icon -->
        <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <i class="fas fa-search text-sm"></i>
        </div>
        <!-- Search Input -->
        <input type="text" placeholder="Search" v-model="store.search" @input="debouncedSearch"
          class="w-full bg-gray-800 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" />
      </div>

      <!-- Sort Select -->
      <div class="relative">
        <select v-model="store.sortBy"
          class="w-full sm:w-auto appearance-none bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer">
          <option value="" disabled class="bg-gray-800 text-gray-400">Sort by...</option>
          <option v-for="option in sortSelectOptions" :key="option.value" :value="option.value"
            class="bg-gray-800 text-white">
            {{ option.text }}
          </option>
        </select>
        <!-- Dropdown Arrow Icon -->
        <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
          <i class="fas fa-chevron-down text-sm"></i>
        </div>
      </div>

      <!-- Sort Button Group -->
      <div class="flex">
        <!-- Direction Icon Button -->
        <button @click="toggleSortDirection"
          class="flex items-center justify-center px-3 h-10 border border-gray-600 border-r-0 rounded-l-lg hover:bg-gray-800 transition-colors duration-200 text-gray-300 hover:text-white">
          <i :class="store.direction === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down'" class="text-sm"></i>
        </button>
        <!-- Sort Button -->
        <button @click="handleSortOrder"
          class="flex items-center justify-center px-5 h-10 border border-gray-600 rounded-r-lg hover:bg-gray-800 transition-colors duration-200 text-gray-300 hover:text-white">
          Sort
        </button>
      </div>
    </div>
  </div>

  <div class="mb-5">
    <button v-if="store.selectedTasks.length > 0" @click="showDeleteConfirm = true"
      class="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 whitespace-nowrap">
      <i class="fa-solid fa-trash-can mr-2"></i>
      Remove Task
    </button>
  </div>

  <!-- Delete Confirmation Modal -->
  <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-600">
      <!-- Modal Header -->
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-white">Confirm Delete</h3>
        <button @click="showDeleteConfirm = false" class="text-gray-400 hover:text-white">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="mb-6">
        <p class="text-gray-300 mb-3">
          Are you sure you want to delete {{ store.selectedTasks.length }} selected task{{ store.selectedTasks.length >
            1 ? 's' : '' }}?
        </p>
        <p class="text-sm text-gray-400">
          This action cannot be undone.
        </p>

        <!-- Selected Tasks Preview -->
        <div v-if="store.selectedTasks.length > 0" class="mt-4 max-h-32 overflow-y-auto">
          <div class="text-xs text-gray-500 mb-2">Tasks to be deleted:</div>
          <div v-for="task in store.getSelectedTasksData()" :key="task.id"
            class="text-sm text-gray-300 bg-gray-700 px-2 py-1 rounded mb-1 truncate">
            {{ task.task }}
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="flex justify-end space-x-3">
        <button @click="showDeleteConfirm = false"
          class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200">
          Cancel
        </button>
        <button @click="confirmDelete"
          class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 flex items-center">
          <i class="fas fa-trash-can mr-2"></i>
          Delete
        </button>
      </div>
    </div>
  </div>
  <!-- Delete Confirmation Modal -->

  <!-- Add Task Modal -->
  <div v-if="showAddTaskModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 border border-gray-600 max-h-[90vh] overflow-y-auto">
      <!-- Modal Header -->
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-white">Add New Task</h3>
        <button @click="closeAddTaskModal" class="text-gray-400 hover:text-white">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="space-y-4">
        <!-- Task Name -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Task</label>
          <input v-model="store.task" type="text" placeholder="Enter task name..."
            class="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>

        <!-- Developer Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Developer</label>
          <div class="relative">
            <button @click="showDeveloperDropdown = !showDeveloperDropdown"
              class="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-left text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center justify-between">
              <span v-if="store.developer.length === 0" class="text-gray-400">Select developers...</span>
              <span v-else class="text-white">{{ store.developer.length }} developer(s) selected</span>
              <i class="fas fa-chevron-down text-sm text-gray-400"></i>
            </button>

            <!-- Developer Dropdown -->
            <div v-if="showDeveloperDropdown"
              class="absolute top-full left-0 right-0 mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-30 max-h-48 overflow-y-auto">
              <div class="p-2">
                <div class="text-xs text-gray-400 mb-2 font-medium">Select Developers:</div>
                <label v-for="developer in availableDevelopers" :key="developer"
                  class="flex items-center space-x-2 p-2 hover:bg-gray-600 rounded cursor-pointer">
                  <input type="checkbox" :checked="store.developer.includes(developer)"
                    @change="toggleDeveloperSelection(developer)"
                    class="w-4 h-4 text-blue-600 bg-gray-700 border-gray-500 rounded focus:ring-blue-500 focus:ring-2" />
                  <span class="text-sm text-gray-200">{{ developer }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Selected Developers Display -->
          <div v-if="store.developer.length > 0" class="mt-2 flex flex-wrap gap-2">
            <div v-for="dev in store.developer" :key="dev"
              class="flex items-center bg-blue-600 text-white text-sm px-2 py-1 rounded">
              {{ dev }}
              <button @click="removeDeveloper(dev)" class="ml-2 text-blue-200 hover:text-white">
                <i class="fas fa-times text-xs"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Status -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Status</label>
          <select v-model="store.status"
            class="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option v-for="option in statusOptions" :key="option.value" :value="option.value"
              class="bg-gray-700 text-white">
              {{ option.label }}
            </option>
          </select>
        </div>

        <!-- Priority -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Priority</label>
          <select v-model="store.priority"
            class="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option v-for="option in priorityOptions" :key="option.value" :value="option.value"
              class="bg-gray-700 text-white">
              {{ option.label }}
            </option>
          </select>
        </div>

        <!-- Type -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Type</label>
          <select v-model="store.type"
            class="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option v-for="option in typeOptions" :key="option.value" :value="option.value"
              class="bg-gray-700 text-white">
              {{ option.label }}
            </option>
          </select>
        </div>

        <!-- Due Date -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Due Date</label>
          <VueDatePicker v-model="store.date" :enable-time-picker="false" :dark="true" auto-apply format="dd/MM/yyyy" placeholder="Select date"
            input-class-name="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>

        <!-- Estimated SP -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Estimated SP</label>
          <input v-model.number="store.estimated_sp" type="number" min="0" placeholder="Enter estimated story points..."
            class="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>

        <!-- Actual SP -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Actual SP</label>
          <input v-model.number="store.actual_sp" type="number" min="0" placeholder="Enter actual story points..."
            class="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="flex justify-end space-x-3 mt-6">
        <button @click="closeAddTaskModal"
          class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200">
          Cancel
        </button>
        <button @click="createTask"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center">
          <i class="fas fa-plus mr-2"></i>
          Create Task
        </button>
      </div>
    </div>
  </div>
  <!-- Add Task Modal -->

</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTodoList } from '@/stores/useTodoList';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import Swal from 'sweetalert2';

const store = useTodoList();
const showDeleteConfirm = ref(false)
const showAddTaskModal = ref(false)
const showDeveloperDropdown = ref(false)

const props = defineProps<{
  activeTab: string
}>()

const availableDevelopers = ref<string[]>([
  'Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Heidi', 'Ivan', 'Judy', 'Zul'
])

// Handle New Task button - conditional logic
const handleNewTask = () => {
  if (props.activeTab === 'table') {
    // Table tab: add task directly
    store.addNewTask()
  } else {
    // Kanban tab: show modal
    resetFormData()
    showAddTaskModal.value = true
  }
}

// Reset form data to defaults
const resetFormData = () => {
  store.task = 'New Task'
  store.developer = []
  store.status = 'pending'
  store.priority = 'medium'
  store.type = 'feature_enhancements'
  store.date = new Date().toISOString().split('T')[0]
  store.estimated_sp = 1
  store.actual_sp = 0
}

// Close Add Task Modal
const closeAddTaskModal = () => {
  showAddTaskModal.value = false
  showDeveloperDropdown.value = false
  resetFormData()
}

// Toggle developer selection
const toggleDeveloperSelection = (developer: string) => {
  const index = store.developer.indexOf(developer)
  if (index > -1) {
    store.developer.splice(index, 1)
  } else {
    store.developer.push(developer)
  }
}

// Remove developer
const removeDeveloper = (developer: string) => {
  const index = store.developer.indexOf(developer)
  if (index > -1) {
    store.developer.splice(index, 1)
  }
}

// Create task
const createTask = async () => {
  try {
    await store.addNewTaskWithParams()
    if (store.successAddNew) {
      closeAddTaskModal()
    }
    
    if(store.error) {
      handleErrorMessage(store.error)
    }
  } catch (error) {
    handleErrorMessage(error)
  } finally {
    store.successAddNew = false
    store.error = null
  }
}

// Debounce timer
let debounceTimer: number | null = null

// Debounced search function
const debouncedSearch = () => {
  // Clear existing timer
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }

  // Set new timer for 1 second
  debounceTimer = setTimeout(() => {
    store.fetchTasks()
  }, 1000)
}

// Handle sort order
const handleSortOrder = () => {
  store.fetchTasks()
}

// Toggle sort direction
const toggleSortDirection = () => {
  store.direction = store.direction === 'asc' ? 'desc' : 'asc'
}

const confirmDelete = async () => {
  try {
    await store.deleteTaskBulk()
    showDeleteConfirm.value = false
    store.clearSelection()
  } catch (error) {
    console.error('Failed to delete tasks:', error)
  }
}

interface SelectOptionsInterface {
  value: string;
  text: string;
  label: string;
}

const sortSelectOptions = ref<SelectOptionsInterface[]>([
  { value: 'title', text: 'Task', label: 'Task' },
  { value: 'assigne', text: 'Developer', label: 'Developer' },
  { value: 'status', text: 'Status', label: 'Status' },
  { value: 'priority', text: 'Priority', label: 'Priority' },
  { value: 'type', text: 'Type', label: 'Type' },
  { value: 'due_date', text: 'Date', label: 'Date' },
  { value: 'estimated_sp', text: 'Estimated SP', label: 'Estimated SP' },
  { value: 'actual_sp', text: 'Actual SP', label: 'Actual SP' },
]);

const statusOptions = ref<SelectOptionsInterface[]>([
  { value: 'open', text: 'Open', label: 'Open' },
  { value: 'in_progress', text: 'In Progress', label: 'In Progress' },
  { value: 'pending', text: 'Pending', label: 'Pending' },
  { value: 'stuck', text: 'Stuck', label: 'Stuck' },
  { value: 'completed', text: 'Completed', label: 'Completed' },
]);

const priorityOptions = ref<SelectOptionsInterface[]>([
  { value: 'critical', text: 'Critical', label: 'Critical' },
  { value: 'high', text: 'High', label: 'High' },
  { value: 'medium', text: 'Medium', label: 'Medium' },
  { value: 'low', text: 'Low', label: 'Low' },
  { value: 'best_effort', text: 'Best Effort', label: 'Best Effort' },
]);

const typeOptions = ref<SelectOptionsInterface[]>([
  { value: 'feature_enhancements', text: 'Feature Enhancements', label: 'Feature Enhancements' },
  { value: 'bug', text: 'Bug', label: 'Bug' },
  { value: 'other', text: 'Other', label: 'Other' },
]);

const handleErrorMessage = (error: Object) => {
  let errorMessage = 'Failed to update date'

  if (error.response?.data?.errors) {
    // Handle validation errors
    const errors = error.response.data.errors
    if (typeof errors === 'object') {
      const errorMessages = []
      for (const key in errors) {
        if (errors.hasOwnProperty(key)) {
          if (Array.isArray(errors[key])) {
            errorMessages.push(...errors[key])
          } else {
            errorMessages.push(errors[key])
          }
        }
      }
      errorMessage = errorMessages.join(', ')
    } else if (typeof errors === 'string') {
      errorMessage = errors
    }
  } else if (error.response?.data?.message) {
    errorMessage = error.response.data.message
  } else if (error.message) {
    errorMessage = error.message
  }

  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'error',
    title: errorMessage,
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    background: '#1f2937',
    color: '#f3f4f6'
  })
}

</script>