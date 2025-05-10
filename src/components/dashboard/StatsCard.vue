<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  icon: {
    type: String,
    default: 'pi pi-chart-bar'
  },
  color: {
    type: String,
    default: 'bg-blue-500'
  },
  change: {
    type: String,
    default: '0%'
  },
  trend: {
    type: String,
    default: 'neutral', // 'up', 'down', or 'neutral'
    validator: (value: string) => ['up', 'down', 'neutral'].includes(value)
  }
})
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden transition-transform duration-300 hover:shadow-lg hover:scale-105">
    <div class="p-5">
      <div class="flex justify-between items-center">
        <div>
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ title }}</p>
          <p class="text-2xl font-semibold text-gray-900 dark:text-white mt-1">{{ value }}</p>
        </div>
        <div :class="`${color} text-white p-3 rounded-lg`">
          <i :class="`${icon} text-xl`"></i>
        </div>
      </div>
      
      <div class="mt-4 flex items-center">
        <span 
          :class="{
            'text-green-600 dark:text-green-400': trend === 'up',
            'text-red-600 dark:text-red-400': trend === 'down',
            'text-gray-600 dark:text-gray-400': trend === 'neutral'
          }"
          class="text-sm font-medium flex items-center"
        >
          <i v-if="trend === 'up'" class="pi pi-arrow-up mr-1"></i>
          <i v-else-if="trend === 'down'" class="pi pi-arrow-down mr-1"></i>
          {{ change }}
        </span>
        <span class="text-sm text-gray-500 dark:text-gray-400 ml-2">За последний месяц</span>
      </div>
    </div>
    <div class="h-1" :class="color"></div>
  </div>
</template>