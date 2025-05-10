<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '../../stores/user'
import { usePropertiesStore } from '../../stores/properties'
import { useClientsStore } from '../../stores/clients'
import StatsCard from '../../components/dashboard/StatsCard.vue'
import RecentProperties from '../../components/dashboard/RecentProperties.vue'
import RecentClients from '../../components/dashboard/RecentClients.vue'

const userStore = useUserStore()
const propertiesStore = usePropertiesStore()
const clientsStore = useClientsStore()

const currentUser = computed(() => userStore.currentUser)
const isLoading = ref(true)

// Stats
const stats = ref([
  { 
    title: 'Активных объектов', 
    value: 0, 
    icon: 'pi pi-building', 
    color: 'bg-blue-500',
    change: '+5%',
    trend: 'up'
  },
  { 
    title: 'Клиентов', 
    value: 0, 
    icon: 'pi pi-users', 
    color: 'bg-green-500',
    change: '+12%',
    trend: 'up'
  },
  { 
    title: 'Просмотров', 
    value: 0, 
    icon: 'pi pi-eye', 
    color: 'bg-purple-500',
    change: '+18%',
    trend: 'up'
  },
  { 
    title: 'Продажи/Аренда', 
    value: 0, 
    icon: 'pi pi-wallet', 
    color: 'bg-orange-500',
    change: '-3%',
    trend: 'down'
  }
])

onMounted(async () => {
  if (currentUser.value && currentUser.value.id) {
    try {
      // Load properties and clients
      await Promise.all([
        propertiesStore.fetchUserProperties(currentUser.value.id),
        clientsStore.fetchUserClients(currentUser.value.id)
      ])
      
      // Update stats
      stats.value[0].value = propertiesStore.properties.filter(p => p.status === 'active').length
      stats.value[1].value = clientsStore.clients.length
      stats.value[2].value = 248 // Sample data
      stats.value[3].value = 12 // Sample data
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      isLoading.value = false
    }
  }
})
</script>

<template>
  <div>
    <header class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Панель управления</h1>
      <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
        Обзор вашей деятельности и статистика
      </p>
    </header>
    
    <div v-if="isLoading" class="flex items-center justify-center h-64">
      <div class="loading-spinner"></div>
    </div>
    
    <div v-else>
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          v-for="(stat, index) in stats" 
          :key="index"
          :title="stat.title"
          :value="stat.value"
          :icon="stat.icon"
          :color="stat.color"
          :change="stat.change"
          :trend="stat.trend"
        />
      </div>
      
      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Аналитика просмотров</h2>
          <div class="h-64 flex items-center justify-center">
            <!-- Chart would go here -->
            <p class="text-gray-500 dark:text-gray-400">Диаграмма просмотров объектов</p>
          </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Объекты по категориям</h2>
          <div class="h-64 flex items-center justify-center">
            <!-- Chart would go here -->
            <p class="text-gray-500 dark:text-gray-400">Диаграмма категорий объектов</p>
          </div>
        </div>
      </div>
      
      <!-- Recent Activity -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Properties -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Последние объекты</h2>
            <router-link to="/properties" class="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400">
              Все объекты
            </router-link>
          </div>
          <RecentProperties :properties="propertiesStore.properties.slice(0, 5)" />
        </div>
        
        <!-- Recent Clients -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Последние клиенты</h2>
            <router-link to="/clients" class="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400">
              Все клиенты
            </router-link>
          </div>
          <RecentClients :clients="clientsStore.clients.slice(0, 5)" />
        </div>
      </div>
    </div>
  </div>
</template>