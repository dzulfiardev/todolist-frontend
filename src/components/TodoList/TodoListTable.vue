<template>
  <div class="overflow-x-auto">
    <table class="w-full border-collapse border border-gray-600 bg-gray-700">
      <!-- Table Header -->
      <thead>
        <tr class="border-b border-gray-600 bg-gray-800/50">
          <!-- Checkbox All Column -->
          <th class="text-center p-2 w-12 border-r border-gray-600">
            <input type="checkbox" :checked="selectAll" @change="toggleSelectAll"
              class="w-4 h-4 text-blue-600 bg-gray-800 border-gray-500 rounded focus:ring-blue-500 focus:ring-2 accent-blue-600" />
          </th>

          <!-- Task Column (colspan 2) -->
          <th class="text-center p-2 text-gray-300 font-medium text-sm border-r border-gray-600 min-w-[200px]"
            colspan="2">
            Task
          </th>

          <!-- Developer Column -->
          <th class="text-center p-2 text-gray-300 font-medium text-sm border-r border-gray-600">
            Developer
          </th>

          <!-- Status Column -->
          <th class="text-center p-2 text-gray-300 font-medium text-sm border-r border-gray-600">
            Status
          </th>

          <!-- Priority Column -->
          <th class="text-center p-2 text-gray-300 font-medium text-sm border-r border-gray-600">
            Priority
          </th>

          <!-- Type Column -->
          <th class="text-center p-2 text-gray-300 font-medium text-sm border-r border-gray-600">
            Type
          </th>

          <!-- Date Column -->
          <th class="text-center p-2 text-gray-300 font-medium text-sm border-r border-gray-600">
            Date
          </th>

          <!-- Estimated SP Column -->
          <th class="text-center p-2 text-gray-300 font-medium text-sm border-r border-gray-600">
            Estimated SP
          </th>

          <!-- Actual SP Column -->
          <th class="text-center p-2 text-gray-300 font-medium text-sm">
            Actual SP
          </th>
        </tr>
      </thead>

      <!-- Table Body -->
      <tbody>
        <tr v-for="task in todoStore.tasks" :key="task.id"
          class="border-b border-gray-600 hover:bg-gray-800/30 transition-colors duration-200">

          <td class="p-2 border-r border-gray-600 text-center">
            <input type="checkbox" v-model="todoStore.selectedTasks" :value="task.id"
              @change="handleTaskSelection(task.id, ($event.target as HTMLInputElement).checked)"
              class="w-4 h-4 text-blue-600 bg-gray-800 border-gray-500 rounded focus:ring-blue-500 focus:ring-2 accent-blue-600" />
          </td>

          <td class="p-2 mw-300 text-gray-200 text-sm border-r border-gray-600 min-w-[200px]">
            <!-- Edit mode -->
            <input v-if="editingTaskId === task.id" v-model="editingValue" @keydown="handleKeydown($event, task.id)"
              @blur="saveEdit(task.id)" :data-task-id="task.id"
              class="w-full bg-gray-700 border border-gray-500 rounded px-2 py-1 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              type="text" placeholder="Enter task name..." />
            <!-- Display mode -->
            <div v-else @click="startEdit(task.id, task.task)"
              class="cursor-pointer hover:bg-gray-600 transition-colors duration-200 p-1 rounded">
              {{ task.task }}
            </div>
          </td>

          <td
            class="p-1 text-center text-gray-200 text-sm border-r border-gray-600 hover:bg-gray-600 transition-colors duration-200 relative dropdown-container">
            <button class="relative group" @click="toggleDropdown(task.id)">
              <i class="fa-solid fa-circle-plus" style="font-size: 20px"></i>
              <!-- Tooltip - only show when dropdown is not open -->
              <div v-if="showDropdown !== task.id"
                class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap border border-gray-600 z-10">
                Add Developers
                <!-- Arrow -->
                <div
                  class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900">
                </div>
              </div>
            </button>

            <!-- Developers Dropdown -->
            <div v-if="showDropdown === task.id"
              class="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-20 min-w-48"
              @click.stop>
              <div class="p-2">
                <div class="text-xs text-gray-400 mb-2 font-medium">Select Developers:</div>
                <div class="max-h-48 overflow-y-auto">
                  <label v-for="developer in developers" :key="developer"
                    class="flex items-center space-x-2 p-1 hover:bg-gray-700 rounded cursor-pointer">
                    <input type="checkbox" :checked="task.developer.includes(developer)"
                      @change="toggleDeveloper(task.id, developer)"
                      class="w-4 h-4 text-blue-600 bg-gray-700 border-gray-500 rounded focus:ring-blue-500 focus:ring-2" />
                    <span class="text-sm text-gray-200">{{ developer }}</span>
                  </label>
                </div>
                <div class="mt-2 pt-2 border-t border-gray-600">
                  <button @click="closeDropdown"
                    class="w-full px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs rounded transition-colors">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </td>

          <td class="p-2 text-gray-200 text-sm border-r border-gray-600">
            <div class="flex flex-wrap gap-1 items-center">
              <div v-for="(dev, index) in task.developer" :key="index"
                class="flex items-center text-blue-300 rounded text-xs group relative">
                <img :src="generateAvatar(dev)" :alt="dev"
                  class="w-8 h-8 rounded-full object-cover border border-blue-400/30" />

                <div
                  class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap border border-gray-600 z-10">
                  {{ dev }}
                  <!-- Arrow -->
                  <div
                    class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900">
                  </div>
                </div>

              </div>
            </div>
          </td>

          <td @click="startStatusEdit(task.id)"
            class="p-2 cursor-pointer text-sm border-r text-center border-gray-600 transition-colors duration-200 status-edit-container hover:bg-opacity-85"
            :class="editingStatusTaskId === task.id ? 'bg-gray-700' : getStatusColorClass(task.status)">

            <!-- Edit mode - Select dropdown -->
            <select v-if="editingStatusTaskId === task.id" :value="toSnakeCase(task.status)"
              @change="handleStatusChange($event, task.id)" @blur="cancelStatusEdit"
              class="w-full bg-gray-800 border border-gray-500 rounded px-2 py-1 text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autofocus>

              <option v-for="option in statusOptions" :key="option.label" :value="option.value"
                class="bg-gray-800 text-white">
                {{ option.label }}
              </option>
            </select>

            <!-- Display mode -->
            <span v-else class="text-xs font-medium">
              {{ getStatusText(task.status) }}
            </span>
          </td>

          <td @click="startPriorityEdit(task.id)"
            class="p-2 text-sm border-r cursor-pointer text-center border-gray-600 text-center transition-colors duration-200 priority-edit-container"
            :class="editingPriorityTaskId === task.id ? 'bg-gray-700' : getPriorityClass(task.priority)">

            <!-- Edit mode - Select dropdown -->
            <select v-if="editingPriorityTaskId === task.id" :value="toSnakeCase(task.priority)"
              @change="handlePriorityChange($event, task.id)" @blur="cancelPriorityEdit"
              class="w-full bg-gray-800 border border-gray-500 rounded px-2 py-1 text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autofocus>
              <option v-for="option in priorityOptions" :key="option.value" :value="option.value"
                class="bg-gray-800 text-white">
                {{ option.label }}
              </option>
            </select>

            <!-- Display mode -->
            <span v-else
              class="px-2 py-1 text-xs font-medium">
              {{ task.priority }}
            </span>
          </td>

          <td
            class="p-2 text-center text-gray-200 text-sm border-r border-gray-600 cursor-pointer hover:bg-opacity-85 transition-colors duration-200"
            :class="getTypeClass(task.type)">
            <span class="px-2 py-1 text-xs font-medium">
              {{ task.type }}
            </span>
          </td>

          <td
            class="p-2 text-gray-200 text-sm border-r border-gray-600 cursor-pointer hover:bg-gray-600 transition-colors duration-200">
            {{ task.date }}
          </td>

          <td
            class="p-2 text-gray-200 text-sm border-r border-gray-600 text-center cursor-pointer hover:bg-gray-600 transition-colors duration-200">
            {{ task.estimated_sp }}
          </td>

          <td
            class="p-2 text-gray-200 text-sm text-center cursor-pointer hover:bg-gray-600 transition-colors duration-200">
            {{ task.actual_sp }}
          </td>
        </tr>

        <!-- Empty state -->
        <tr v-if="todoStore.tasks.length === 0" class="border-b border-gray-600">
          <td colspan="10" class="text-center p-6 text-gray-400 text-sm">
            No tasks yet. Click "New Task" to add your first task.
          </td>
        </tr>

        <tr>
          <td class="p-2 border-r border-gray-600 text-center">
            <input type="checkbox" disabled
              class="w-4 h-4 text-blue-600 bg-gray-800 border-gray-500 rounded focus:ring-blue-500 focus:ring-2 accent-blue-600" />
          </td>

          <td class="p-2 border-r border-gray-600 text-gray-400 text-left text-sm" colspan="9">
            <button class="ml-2">
              <i class="fa-solid fa-circle-plus mr-2"></i>
              Add Task
            </button>
          </td>
        </tr>

        <tr>
          <td class="border-t border-gray-600" colspan="4"></td>
          <td
            class="p-2 text-center border-l border-r border-t border-gray-600 text-gray-400 text-sm text-center status-color-percentage">
            <div class="flex flex-row w-full justify-center items-center">
              <div class="bg-blue-600 w-5 h-5"></div>
              <div class="bg-indigo-400 w-5 h-5"></div>
              <div class="bg-sky-500 w-5 h-5"></div>
              <div class="bg-yellow-400 w-5 h-5"></div>
              <div class="bg-red-500 w-5 h-5"></div>
              <div class="bg-green-500 w-5 h-5"></div>
              <div class="bg-gray-500 w-5 h-5"></div>
            </div>
          </td>
          <td
            class="p-2 text-center border-r border-t border-gray-600 text-gray-400 text-sm text-center priority-color-percentage">
            <div class="flex flex-row w-full justify-center items-center">
              <div class="bg-red-600 w-6 h-6"></div>
              <div class="bg-red-400 w-6 h-6"></div>
              <div class="bg-amber-500 w-6 h-6"></div>
              <div class="bg-sky-200 w-6 h-6"></div>
              <div class="bg-sky-300 w-6 h-6"></div>
              <div class="bg-gray-500 w-6 h-6"></div>
            </div>
          </td>
          <td
            class="p-2 text-center border-r border-t border-gray-600 text-gray-400 text-sm text-center type-color-percentage">
            <div class="flex flex-row w-full justify-center items-center">
              <div class="bg-purple-400 w-6 h-6"></div>
              <div class="bg-pink-300 w-6 h-6"></div>
              <div class="bg-indigo-600 w-6 h-6"></div>
              <div class="bg-gray-500 w-6 h-6"></div>
            </div>
          </td>
          <td class="border-t border-gray-600" colspan="3"></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch, ref, nextTick, onBeforeUnmount } from 'vue'
import { useTodoList } from '@/stores/useTodoList'

// Store
const todoStore = useTodoList()

// Fetch tasks on component mount
onMounted(async () => {
  await todoStore.fetchTasks()
  // Add click outside listener
  document.addEventListener('click', handleClickOutside)
})

// Clean up event listener on unmount
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Handle click outside to close dropdown
const handleClickOutside = (event: Event) => {
  const path = event.composedPath ? event.composedPath() : []
  const isInDropdown = path.some((el: any) => el.classList && el.classList.contains('dropdown-container'))
  if (!isInDropdown) {
    showDropdown.value = null
  }

  // Also close status editing if clicking outside
  const isInStatusEdit = path.some((el: any) => el.classList && el.classList.contains('status-edit-container'))
  if (!isInStatusEdit) {
    editingStatusTaskId.value = null
  }

  // Also close priority editing if clicking outside
  const isInPriorityEdit = path.some((el: any) => el.classList && el.classList.contains('priority-edit-container'))
  if (!isInPriorityEdit) {
    editingPriorityTaskId.value = null
  }
}

// Watch for changes in selectedTasks to log the collected IDs
watch(() => todoStore.selectedTasks, (newSelectedTasks) => {
  console.log('Selected task IDs:', newSelectedTasks)
}, { deep: true })

// Inline editing state
const editingTaskId = ref<number | null>(null)
const editingValue = ref<string>('')

// Status editing state
const editingStatusTaskId = ref<number | null>(null)

// Priority editing state
const editingPriorityTaskId = ref<number | null>(null)

// Dropdown state for developers
const showDropdown = ref<number | null>(null)

// Function to toggle dropdown
const toggleDropdown = (taskId: number) => {
  if (showDropdown.value === taskId) {
    showDropdown.value = null
  } else {
    showDropdown.value = taskId
  }
}

// Function to close dropdown when clicking outside
const closeDropdown = () => {
  showDropdown.value = null
}

// Function to update developers
const updateDevelopers = async (taskId: number, developers: string[]) => {
  try {
    await todoStore.updateTask(taskId, { developer: developers })
  } catch (error) {
    console.error('Failed to update developers:', error)
  }
}

// Function to toggle developer assignment
const toggleDeveloper = async (taskId: number, developerName: string) => {
  const task = todoStore.getTaskById(taskId)
  if (!task) return

  const currentDevelopers = [...task.developer]
  const developerIndex = currentDevelopers.indexOf(developerName)

  if (developerIndex > -1) {
    // Remove developer
    currentDevelopers.splice(developerIndex, 1)
  } else {
    // Add developer
    currentDevelopers.push(developerName)
  }

  await updateDevelopers(taskId, currentDevelopers)
}

// Status editing functions
const startStatusEdit = (taskId: number) => {
  editingStatusTaskId.value = taskId
}

const cancelStatusEdit = () => {
  editingStatusTaskId.value = null
}

const updateStatus = async (taskId: number, newStatus: string) => {
  try {
    await todoStore.updateTask(taskId, { status: newStatus })
    editingStatusTaskId.value = null
  } catch (error) {
    console.error('Failed to update status:', error)
    // Keep editing mode on error
  }
}

const handleStatusChange = (event: Event, taskId: number) => {
  const target = event.target as HTMLSelectElement
  updateStatus(taskId, target.value)
}
// End Status editing functions

// Priority editing functions
const startPriorityEdit = (taskId: number) => {
  editingPriorityTaskId.value = taskId
}

const cancelPriorityEdit = () => {
  editingPriorityTaskId.value = null
}

const updatePriority = async (taskId: number, newPriority: string) => {
  try {
    await todoStore.updateTask(taskId, { priority: newPriority })
    editingPriorityTaskId.value = null
  } catch (error) {
    console.error('Failed to update priority:', error)
    // Keep editing mode on error
  }
}

const handlePriorityChange = (event: Event, taskId: number) => {
  const target = event.target as HTMLSelectElement
  updatePriority(taskId, target.value)
}
// End Priority editing functions

// Inline editing functions
const startEdit = async (taskId: number, currentValue: string) => {
  editingTaskId.value = taskId
  editingValue.value = currentValue

  // Focus the input after Vue updates the DOM
  await nextTick()
  const inputElement = document.querySelector(`input[data-task-id="${taskId}"]`) as HTMLInputElement
  if (inputElement) {
    inputElement.focus()
    inputElement.select()
  }
}

const cancelEdit = () => {
  editingTaskId.value = null
  editingValue.value = ''
}

const saveEdit = async (taskId: number) => {
  if (editingValue.value.trim() === '') {
    cancelEdit()
    return
  }

  try {
    await todoStore.updateTask(taskId, { task: editingValue.value.trim() })
    cancelEdit()
  } catch (error) {
    console.error('Failed to update task:', error)
    // Keep editing mode on error
  }
}

const handleKeydown = (event: KeyboardEvent, taskId: number) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    saveEdit(taskId)
  } else if (event.key === 'Escape') {
    event.preventDefault()
    cancelEdit()
  }
}

// Computed property for select all functionality
const selectAll = computed({
  get: () => {
    if (todoStore.tasks.length === 0) return false
    return todoStore.selectedTasks.length === todoStore.tasks.length
  },
  set: (value: boolean) => {
    if (value) {
      todoStore.selectedTasks.splice(0, todoStore.selectedTasks.length, ...todoStore.tasks.map(task => task.id))
    } else {
      todoStore.selectedTasks.splice(0, todoStore.selectedTasks.length)
    }
  }
})

// Methods for handling checkbox selection - now using store methods
const toggleSelectAll = () => {
  todoStore.toggleSelectAll()
}

// Function to handle individual checkbox change
const handleTaskSelection = (taskId: number, isChecked: boolean) => {
  console.log(taskId, isChecked);
  todoStore.toggleTaskSelection(taskId, isChecked)
}

// Function to get selected tasks data
const getSelectedTasksData = () => {
  return todoStore.getSelectedTasksData()
}

// Function to clear all selections
const clearSelection = () => {
  todoStore.clearSelection()
}
// 

// Generate avatar URL for developer name
const generateAvatar = (name: string) => {
  const colors = ['3b82f6', '10b981', 'f59e0b', '8b5cf6', 'ec4899', 'ef4444', '06b6d4', 'f97316']
  const colorIndex = name.length % colors.length
  const color = colors[colorIndex]
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${color}&color=fff`
}

const getStatusColorClass = (status: string) => {
  switch (status) {
    case 'Open':
      return 'text-gray-200 bg-blue-600'
    case 'Ready To Start':
      return 'text-gray-200 bg-blue-600'
    case 'In Progress':
      return 'text-gray-300 bg-indigo-400'
    case 'Waiting For Review':
      return 'text-gray-300 bg-sky-500'
    case 'Pending Deploy':
      return 'text-gray-700 bg-yellow-400'
    case 'Pending':
      return 'text-gray-700 bg-yellow-400'
    case 'Stuck':
      return 'text-gray-300 bg-red-500'
    case 'Done':
      return 'text-gray-100 bg-green-500'
    case 'Completed':
      return 'text-gray-100 bg-green-500'
    case '':
      return 'text-gray-300 bg-gray-500'
    default:
      return 'text-gray-300 bg-gray-500'
  }
}

const getPriorityClass = (priority: string) => {
  switch (priority) {
    case 'Critical':
      return 'bg-red-600 text-gray-200'
    case 'High':
      return 'bg-red-400 text-gray-700'
    case 'Medium':
      return 'bg-amber-500 text-gray-200'
    case 'Low':
      return 'bg-sky-200 text-gray-700'
    case 'Best Effort':
      return 'bg-sky-300 text-gray-700'
    case '':
      return 'text-gray-300 bg-gray-500'
    default:
      return 'text-gray-300 bg-gray-500'
  }
}

const getTypeClass = (type: string) => {
  switch (type) {
    case 'Feature Enhancements':
      return 'bg-purple-400 text-gray-800'
    case 'Bug':
      return 'bg-pink-300 text-gray-800'
    case 'Other':
      return 'bg-indigo-600 text-gray-200'
    case '':
      return 'text-gray-300 bg-gray-500'
    default:
      return 'text-gray-300 bg-gray-500'
  }
}

// Select Options Inputs
const developers = ref<string[]>(['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Heidi', 'Ivan', 'Judy', 'Zul']);

interface OptionsInterface {
  label: string;
  value: string;
}

const statusOptions = ref<OptionsInterface[]>([
  { label: 'Ready To Start', value: 'open' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Pending', value: 'pending' },
  { label: 'Stuck', value: 'stuck' },
  { label: 'Done', value: 'completed' },
]);

const toSnakeCase = (str: string) => str
  .replace(/\s+/g, '_')
  .replace(/[A-Z]/g, letter => `${letter.toLowerCase()}`)
  .toLowerCase();

const getStatusText = (value: string) => {

  const textStatus = toSnakeCase(value);
  console.log(textStatus);
  const option = statusOptions.value.find(opt => opt.value === textStatus)
  return option ? option.label : 'Unknown'
}


const priorityOptions = ref<OptionsInterface[]>([
  { label: 'Critical', value: 'critical' },
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' },
  { label: 'Best Effort', value: 'best_effort' },
]);

const typeOptions = ref<OptionsInterface[]>([
  { label: 'Feature Enhancements', value: 'feature_enhancements' },
  { label: 'Bug', value: 'bug' },
  { label: 'Other', value: 'other' },
]);

</script>