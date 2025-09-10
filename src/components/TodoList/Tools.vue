<template>
  <div class="mb-5">
    <!-- Tools Container -->
    <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
      <!-- New Task Button -->
      <button @click="store.addNewTask()"
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
          <option v-for="option in sortSelectOptions" :key="option.value" :value="option.value" class="bg-gray-800 text-white">
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

</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTodoList } from '@/stores/useTodoList';

const store = useTodoList();
const showDeleteConfirm = ref(false)

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
}

const sortSelectOptions = ref<SelectOptionsInterface[]>([
  { value: 'title', text: 'Task' },
  { value: 'assigne', text: 'Developer' },
  { value: 'status', text: 'Status' },
  { value: 'priority', text: 'Priority' },
  { value: 'type', text: 'Type' },
  { value: 'due_date', text: 'Date' },
  { value: 'estimated_sp', text: 'Estimated SP' },
  { value: 'actual_sp', text: 'Actual SP' },
]);

</script>