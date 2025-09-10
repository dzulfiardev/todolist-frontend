<template>
  <div class="kanban-container border-2 border-white/20 rounded-lg p-6 text-white overflow-x-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500">
    <div class="flex flex-col">
      <div class="flex space-x-4 min-w-max">
        
        <div v-for="status in kanbanBoardsByStatus" :key="status.value" class="kanban-column flex-shrink-0 w-80">
          <div :class="status.bg_class"
            class="rounded-t-lg px-4 py-3 font-semibold text-left border-b-2 border-gray-600">
            {{ status.title }}
            <span class="ml-2 text-sm opacity-80">
              {{ getTasksByStatus(status.value).length }}
            </span>
          </div>

          <!-- Card Body for tasks -->
          <div 
            class="bg-gray-800 rounded-b-lg border-2 border-gray-600 border-t-0 min-h-96 p-4 drop-zone"
            :data-status="status.value"
            @drop="onDrop"
            @dragover.prevent
            @dragenter="onDragEnter"
            @dragleave="onDragLeave">
            <div v-for="task in store.tasks" :key="task.id" class="task-card">
              <div v-if="task.status_raw === status.value"
                class="bg-gray-700 rounded-lg p-3 mb-4 shadow hover:shadow-lg transition-all duration-200 cursor-move"
                draggable="true"
                :data-task-id="task.id"
                @dragstart="onDragStart"
                @dragend="onDragEnd">
                <div class="flex items-start justify-between">
                  <div class="text-sm font-medium mb-2">
                    {{ task.task }}
                  </div>
                  <div class="text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap">
                    {{ task.priority }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty state message -->
            <div v-if="store.tasks.length === 0" class="text-center text-gray-500 text-sm py-8">
              No tasks available.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useTodoList } from '@/stores/useTodoList';

const store = useTodoList();

interface KanbanBoard {
  title: string;
  value: string;
  bg_class: string;
}

const kanbanBoardsByStatus = ref<KanbanBoard[]>([
  { title: 'Ready To Start', value: 'open', bg_class: 'text-gray-200 bg-blue-600' },
  { title: 'In Progress', value: 'in_progress', bg_class: 'text-gray-300 bg-indigo-400' },
  { title: 'Pending', value: 'pending', bg_class: 'text-gray-700 bg-yellow-400' },
  { title: 'Stuck', value: 'stuck', bg_class: 'text-gray-200 bg-red-400' },
  { title: 'Done', value: 'completed', bg_class: 'text-gray-100 bg-green-400' },
]);

// Helper function to get tasks by status
const getTasksByStatus = (status: string) => {
  return store.tasks.filter(task => task.status_raw === status);
};

// Helper function to format date
const formatDate = (dateString: string) => {
  if (!dateString) return 'No date';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

// Drag and Drop functionality
let draggedTaskId: number | null = null;

const onDragStart = (event: DragEvent) => {
  const target = event.target as HTMLElement;
  const taskId = target.getAttribute('data-task-id');
  if (taskId) {
    draggedTaskId = parseInt(taskId);
    target.classList.add('dragging');
  }
};

const onDragEnd = (event: DragEvent) => {
  const target = event.target as HTMLElement;
  target.classList.remove('dragging');
  
  // Remove drag-over class from all drop zones
  document.querySelectorAll('.drop-zone').forEach(zone => {
    zone.classList.remove('drag-over');
  });
};

const onDragEnter = (event: DragEvent) => {
  event.preventDefault();
  const target = event.currentTarget as HTMLElement;
  target.classList.add('drag-over');
};

const onDragLeave = (event: DragEvent) => {
  const target = event.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();
  const x = event.clientX;
  const y = event.clientY;
  
  // Only remove drag-over if mouse is actually outside the element
  if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
    target.classList.remove('drag-over');
  }
};

const onDrop = async (event: DragEvent) => {
  event.preventDefault();
  const target = event.currentTarget as HTMLElement;
  const newStatus = target.getAttribute('data-status');
  
  // Remove drag-over class
  target.classList.remove('drag-over');
  
  if (draggedTaskId && newStatus) {
    try {
      // Update task status via store
      await store.updateTask(draggedTaskId, { status: newStatus });
      console.log(`Task ${draggedTaskId} moved to ${newStatus}`);
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  }
  
  draggedTaskId = null;
};
</script>

<style scoped>
/* Custom scrollbar styling */
.kanban-container::-webkit-scrollbar {
  height: 8px;
}

.kanban-container::-webkit-scrollbar-track {
  background: #1f2937; /* gray-800 */
  border-radius: 4px;
}

.kanban-container::-webkit-scrollbar-thumb {
  background: #4b5563; /* gray-600 */
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.kanban-container::-webkit-scrollbar-thumb:hover {
  background: #6b7280; /* gray-500 */
}

/* Firefox scrollbar styling */
.kanban-container {
  scrollbar-width: thin;
  scrollbar-color: #4b5563 #1f2937;
}

/* Drag and Drop styling */
.task-card [draggable="true"]:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.drop-zone.drag-over {
  background-color: #374151 !important; /* gray-700 */
  border-color: #60a5fa !important; /* blue-400 */
}

.task-card [draggable="true"].dragging {
  opacity: 0.5;
  transform: rotate(5deg);
}
</style>