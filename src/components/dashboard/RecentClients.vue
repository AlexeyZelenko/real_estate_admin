<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Client } from '../../types/client'

const props = defineProps<{
  clients: Client[]
}>()

const router = useRouter()

const viewClient = (id: string) => {
  router.push(`/clients/${id}`)
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    case 'potential':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
    case 'inactive':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

const getRandomColor = (name: string) => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-yellow-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-red-500',
    'bg-teal-500'
  ]
  
  const index = name.charCodeAt(0) % colors.length
  return colors[index]
}
</script>

<template>
  <div class="overflow-hidden">
    <div v-if="clients.length === 0" class="p-6 text-center text-gray-500 dark:text-gray-400">
      У вас пока нет клиентов
    </div>
    <ul v-else class="divide-y divide-gray-200 dark:divide-gray-700">
      <li v-for="client in clients" :key="client.id" 
        class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors duration-150"
        @click="viewClient(client.id)"
      >
        <div class="flex items-center space-x-4">
          <div :class="[getRandomColor(client.name), 'flex-shrink-0 w-10 h-10 rounded-full overflow-hidden flex items-center justify-center text-white font-medium']">
            {{ getInitials(client.name) }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
              {{ client.name }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
              {{ client.phone }}
            </p>
          </div>
          <div>
            <span class="text-xs px-2 py-1 rounded-full" :class="getStatusClass(client.status)">
              {{ client.status === 'active' ? 'Активный' : 
                 client.status === 'potential' ? 'Потенциальный' : 'Неактивный' }}
            </span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>