<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'

const props = defineProps({
  toggleSidebar: {
    type: Function,
    required: true
  },
  sidebarCollapsed: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()
const userStore = useUserStore()
const currentUser = computed(() => userStore.currentUser)

// Theme toggle
const isDarkMode = ref(false)

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  document.documentElement.classList.toggle('dark')
  localStorage.setItem('darkMode', isDarkMode.value ? 'true' : 'false')
}

// Check saved theme
const checkTheme = () => {
  if (localStorage.getItem('darkMode') === 'true') {
    isDarkMode.value = true
    document.documentElement.classList.add('dark')
  } else {
    isDarkMode.value = false
    document.documentElement.classList.remove('dark')
  }
}

// Notifications
const notifications = ref([
  { 
    id: 1, 
    title: 'Новый клиент', 
    message: 'У вас новая заявка от потенциального клиента', 
    time: '10 мин. назад',
    read: false
  },
  { 
    id: 2, 
    title: 'Просмотр объекта', 
    message: 'Запланирован просмотр объекта на завтра в 14:00', 
    time: '2 часа назад',
    read: false
  },
  { 
    id: 3, 
    title: 'Система обновлена', 
    message: 'Система была обновлена до последней версии', 
    time: 'вчера',
    read: true
  }
])

const showNotifications = ref(false)
const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
}

const markAsRead = (id: number) => {
  const notification = notifications.value.find(n => n.id === id)
  if (notification) {
    notification.read = true
  }
}

const markAllAsRead = () => {
  notifications.value.forEach(n => n.read = true)
}

// Check theme on component creation
checkTheme()
</script>

<template>
  <header class="z-10 py-4 bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 transition-all duration-200"
    :class="{ 'md:ml-64': !sidebarCollapsed, 'md:ml-20': sidebarCollapsed }">
    <div class="container px-4 mx-auto sm:px-6 lg:px-8">
      <div class="flex items-center justify-between">
        <!-- Mobile sidebar toggle -->
        <button
          class="p-2 text-gray-500 rounded-md lg:hidden hover:bg-gray-100 focus:outline-none dark:text-gray-400 dark:hover:bg-gray-700"
          @click="toggleSidebar"
        >
          <i class="pi pi-bars"></i>
        </button>

        <!-- Search bar -->
        <div class="hidden md:flex md:flex-1 mx-4">
          <div class="relative w-full max-w-md">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <i class="pi pi-search text-gray-400"></i>
            </div>
            <input
              type="search"
              class="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="Поиск..."
            />
          </div>
        </div>

        <!-- Right side buttons -->
        <div class="flex items-center space-x-4">
          <!-- Theme toggle -->
          <button
            class="p-2 text-gray-500 rounded-md hover:bg-gray-100 focus:outline-none dark:text-gray-400 dark:hover:bg-gray-700"
            @click="toggleDarkMode"
          >
            <i :class="isDarkMode ? 'pi pi-sun' : 'pi pi-moon'"></i>
          </button>

          <!-- Notifications -->
          <div class="relative">
            <button
              class="p-2 text-gray-500 rounded-md hover:bg-gray-100 focus:outline-none dark:text-gray-400 dark:hover:bg-gray-700"
              @click="toggleNotifications"
            >
              <i class="pi pi-bell"></i>
              <span
                v-if="unreadCount > 0"
                class="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full"
              >
                {{ unreadCount }}
              </span>
            </button>

            <!-- Notifications dropdown -->
            <div
              v-if="showNotifications"
              class="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20 dark:bg-gray-800 border dark:border-gray-700"
            >
              <div class="py-2">
                <div class="flex items-center justify-between px-4 py-2 text-sm font-semibold border-b dark:border-gray-700">
                  <span>Уведомления</span>
                  <button
                    class="text-primary-600 hover:text-primary-800 text-xs dark:text-primary-400"
                    @click="markAllAsRead"
                  >
                    Отметить все как прочитанные
                  </button>
                </div>

                <div v-if="notifications.length === 0" class="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                  Нет уведомлений
                </div>

                <div v-else class="max-h-60 overflow-y-auto">
                  <div
                    v-for="notification in notifications"
                    :key="notification.id"
                    class="flex px-4 py-3 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    :class="{ 'bg-blue-50 dark:bg-blue-900/20': !notification.read }"
                    @click="markAsRead(notification.id)"
                  >
                    <div class="flex-shrink-0">
                      <div class="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                        <i class="pi pi-bell text-primary-500"></i>
                      </div>
                    </div>
                    <div class="ml-3 w-0 flex-1">
                      <p class="text-sm font-medium text-gray-900 dark:text-white">{{ notification.title }}</p>
                      <p class="text-sm text-gray-500 dark:text-gray-400">{{ notification.message }}</p>
                      <p class="text-xs text-gray-400 mt-1 dark:text-gray-500">{{ notification.time }}</p>
                    </div>
                  </div>
                </div>

                <div class="px-4 py-2 text-sm font-semibold text-center border-t dark:border-gray-700">
                  <router-link to="/notifications" class="text-primary-600 hover:text-primary-800 dark:text-primary-400">
                    Все уведомления
                  </router-link>
                </div>
              </div>
            </div>
          </div>

          <!-- User menu -->
          <div class="relative flex-shrink-0 ml-4">
            <router-link to="/profile" class="flex items-center">
              <img
                v-if="currentUser && currentUser.avatar"
                :src="currentUser.avatar"
                alt="User avatar"
                class="w-8 h-8 rounded-full object-cover"
              />
              <div v-else class="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white">
                {{ currentUser?.name?.[0] || 'U' }}
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>