<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../../stores/user'

const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle'])
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const currentUser = computed(() => userStore.currentUser)

const menuItems = [
  {
    title: 'Панель управления',
    icon: 'pi pi-home',
    route: '/dashboard'
  },
  {
    title: 'Объекты недвижимости',
    icon: 'pi pi-building',
    route: '/properties'
  },
  {
    title: 'Клиенты',
    icon: 'pi pi-users',
    route: '/clients'
  },
  {
    title: 'Профиль',
    icon: 'pi pi-user',
    route: '/profile'
  },
  {
    title: 'Настройки',
    icon: 'pi pi-cog',
    route: '/settings'
  }
]

const isActiveRoute = (path: string) => {
  return route.path.startsWith(path)
}

const toggleSidebar = () => {
  emit('toggle')
}

const logout = async () => {
  try {
    await userStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
  }
}
</script>

<template>
  <aside
    class="fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700"
    :class="{ 'w-64': !collapsed, 'w-20': collapsed }"
  >
    <!-- Logo -->
    <div class="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
      <router-link to="/dashboard" class="flex items-center">
        <span v-if="!collapsed" class="text-lg font-semibold text-gray-800 dark:text-white">
          RealEstate Admin
        </span>
        <span v-else class="text-lg font-semibold text-gray-800 dark:text-white">RE</span>
      </router-link>
      <button
        class="p-1 text-gray-500 rounded-md hover:bg-gray-100 focus:outline-none dark:text-gray-400 dark:hover:bg-gray-700"
        @click="toggleSidebar"
      >
        <i :class="collapsed ? 'pi pi-angle-right' : 'pi pi-angle-left'"></i>
      </button>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex-1 overflow-y-auto">
      <ul class="py-4 space-y-1">
        <li v-for="item in menuItems" :key="item.route">
          <router-link
            :to="item.route"
            class="flex items-center px-4 py-3 text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            :class="{ 'bg-gray-100 dark:bg-gray-700': isActiveRoute(item.route) }"
          >
            <i :class="[item.icon, 'mr-3 text-lg']"></i>
            <span v-if="!collapsed">{{ item.title }}</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- User Profile and Logout -->
    <div class="p-4 border-t border-gray-200 dark:border-gray-700">
      <div class="flex items-center" :class="{ 'justify-center': collapsed }">
        <div v-if="currentUser" class="flex items-center">
          <div class="relative" :class="{ 'mr-3': !collapsed }">
            <img
              :src="currentUser.avatar || 'https://via.placeholder.com/40'"
              alt="User avatar"
              class="w-10 h-10 rounded-full object-cover border-2 border-primary-500"
            />
            <div class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
          </div>
          <div v-if="!collapsed">
            <p class="text-sm font-semibold text-gray-800 dark:text-white truncate max-w-[160px]">
              {{ currentUser.name }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[160px]">
              {{ currentUser.role?.name || 'Риелтор' }}
            </p>
          </div>
        </div>
      </div>
      
      <button
        @click="logout"
        class="mt-4 flex items-center w-full px-4 py-2 text-left text-sm font-medium text-red-600 rounded-md hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-700"
        :class="{ 'justify-center': collapsed }"
      >
        <i class="pi pi-sign-out mr-2"></i>
        <span v-if="!collapsed">Выйти</span>
      </button>
    </div>
  </aside>
</template>