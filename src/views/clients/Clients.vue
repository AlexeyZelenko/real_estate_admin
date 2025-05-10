<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'
import { useClientsStore } from '../../stores/clients'
import type { Client } from '../../types/client'

const router = useRouter()
const userStore = useUserStore()
const clientsStore = useClientsStore()

const isLoading = ref(true)
const currentView = ref('grid') // 'grid' or 'table'
const searchQuery = ref('')

// Filters
const statusFilter = ref('')
const sortBy = ref('createdAt')
const sortOrder = ref('desc')

const currentUser = computed(() => userStore.currentUser)

// Filtered and sorted clients
const filteredClients = computed(() => {
  let result = [...clientsStore.clients]

  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(client =>
        client.name.toLowerCase().includes(query) ||
        client.phone.toLowerCase().includes(query) ||
        client.email?.toLowerCase().includes(query)
    )
  }

  // Apply status filter
  if (statusFilter.value) {
    result = result.filter(client => client.status === statusFilter.value)
  }

  // Apply sorting
  result.sort((a, b) => {
    let compareResult = 0

    switch (sortBy.value) {
      case 'name':
        compareResult = a.name.localeCompare(b.name)
        break
      case 'status':
        compareResult = a.status.localeCompare(b.status)
        break
      case 'createdAt':
        compareResult = b.createdAt.seconds - a.createdAt.seconds
        break
      default:
        compareResult = 0
    }

    return sortOrder.value === 'asc' ? compareResult : -compareResult
  })

  return result
})

const addNewClient = () => {
  router.push('/clients/add')
}

const viewClient = (clientId: string) => {
  router.push(`/clients/${clientId}`)
}

const editClient = (clientId: string) => {
  router.push(`/clients/${clientId}/edit`)
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

onMounted(async () => {
  if (currentUser.value && currentUser.value.id) {
    try {
      await clientsStore.fetchUserClients(currentUser.value.id)
    } catch (error) {
      console.error('Error loading clients:', error)
    } finally {
      isLoading.value = false
    }
  }
})
</script>

<template>
  <div>
    <div class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Клиенты</h1>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Управляйте вашей базой клиентов
        </p>
      </div>
      <div class="mt-4 md:mt-0">
        <button
            @click="addNewClient"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800"
        >
          <i class="pi pi-plus mr-2"></i>
          Добавить клиента
        </button>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden mb-6">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex flex-col md:flex-row md:items-center md:space-x-4">
          <!-- Search -->
          <div class="flex-1">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="pi pi-search text-gray-400"></i>
              </div>
              <input
                  type="search"
                  v-model="searchQuery"
                  class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Поиск клиентов..."
              />
            </div>
          </div>

          <!-- Filters -->
          <div class="mt-4 md:mt-0 flex space-x-4">
            <select
                v-model="statusFilter"
                class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Все статусы</option>
              <option value="active">Активные</option>
              <option value="potential">Потенциальные</option>
              <option value="inactive">Неактивные</option>
            </select>

            <select
                v-model="sortBy"
                class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="createdAt">По дате</option>
              <option value="name">По имени</option>
              <option value="status">По статусу</option>
            </select>

            <button
                @click="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'"
                class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <i :class="sortOrder === 'asc' ? 'pi pi-sort-amount-up' : 'pi pi-sort-amount-down'"></i>
            </button>
          </div>
        </div>
      </div>

      <div v-if="isLoading" class="flex items-center justify-center h-64">
        <div class="loading-spinner"></div>
      </div>

      <div v-else-if="filteredClients.length === 0" class="p-6 text-center">
        <div class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4">
          <i class="pi pi-users text-4xl"></i>
        </div>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">Нет клиентов</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ searchQuery || statusFilter ? 'Нет клиентов, соответствующих заданным критериям.' : 'Начните с добавления вашего первого клиента.' }}
        </p>
        <div class="mt-6">
          <button
              @click="addNewClient"
              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800"
          >
            <i class="pi pi-plus mr-2"></i>
            Добавить клиента
          </button>
        </div>
      </div>

      <div v-else>
        <!-- Grid View -->
        <div v-if="currentView === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          <div
              v-for="client in filteredClients"
              :key="client.id"
              class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
              @click="viewClient(client.id)"
          >
            <div class="p-4">
              <div class="flex items-center space-x-4">
                <div :class="[getRandomColor(client.name), 'flex-shrink-0 w-12 h-12 rounded-full overflow-hidden flex items-center justify-center text-white font-medium']">
                  {{ getInitials(client.name) }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {{ client.name }}
                  </p>
                  <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {{ client.phone }}
                  </p>
                  <div class="mt-2">
                    <span class="text-xs px-2 py-1 rounded-full" :class="getStatusClass(client.status)">
                      {{ client.status === 'active' ? 'Активный' :
                        client.status === 'potential' ? 'Потенциальный' : 'Неактивный' }}
                    </span>
                  </div>
                </div>
                <button
                    @click.stop="editClient(client.id)"
                    class="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <i class="pi pi-pencil"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Table View -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Клиент
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Контакты
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Статус
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Интересы
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Действия
              </th>
            </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            <tr
                v-for="client in filteredClients"
                :key="client.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                @click="viewClient(client.id)"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div :class="[getRandomColor(client.name), 'flex-shrink-0 w-10 h-10 rounded-full overflow-hidden flex items-center justify-center text-white font-medium']">
                    {{ getInitials(client.name) }}
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ client.name }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      ID: {{ client.id.substring(0, 8) }}...
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">{{ client.phone }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">{{ client.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 text-xs rounded-full" :class="getStatusClass(client.status)">
                    {{ client.status === 'active' ? 'Активный' :
                      client.status === 'potential' ? 'Потенциальный' : 'Неактивный' }}
                  </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">
                  {{ client.interests?.category || 'Не указано' }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ client.interests?.subcategory || 'Не указано' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                    @click.stop="editClient(client.id)"
                    class="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  <i class="pi pi-pencil"></i>
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>