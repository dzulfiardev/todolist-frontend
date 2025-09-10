<template>
  <!-- Parent Container -->
  <div class="min-h-screen bg-custom-dark py-8">
    <!-- Main Content Container -->
    <div class="main-container max-w-7xl mx-auto px-4 text-white">
      <!-- Tab Navigation -->
      <div class="mb-6">
        <nav class="flex border-b-2 border-white/20" aria-label="Tabs">
          <button @click="activeTab = 'table'" :class="[
            'py-2 px-1 border-b-2 font-medium text-sm',
            activeTab === 'table'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'
          ]" style="margin-bottom:-2px">
            <i class="fa-regular fa-house"></i>
            Main Table
          </button>
          <button @click="activeTab = 'kanban'" :class="[
            'py-2 px-5 border-b-2 font-medium text-sm',
            activeTab === 'kanban'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'
          ]" style="margin-bottom:-2px">
            Kanban
          </button>
        </nav>
      </div>

      <Tools />

      <!-- Tab Content -->
      <div class="tab-content">
      
        <div v-if="activeTab === 'table'" class="tab-panel">
          <TodoListTable />  
        </div>


        <div v-if="activeTab === 'kanban'" class="tab-panel">
          <h2 class="text-xl font-semibold mb-4">Kanban View</h2>
          <p class="text-gray-300">Kanban view content coming soon...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Tools from '@/components/TodoList/Tools.vue';
import TodoListTable from '@/components/TodoList/TodoListTable.vue';

// Tab state
const activeTab = ref('table')
</script>