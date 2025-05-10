<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from './stores/user'

const route = useRoute()
const userStore = useUserStore()
const isLoading = ref(true)

// Check if the current route requires authentication
const isAuthPage = computed(() => {
  return ['/login', '/register', '/forgot-password'].includes(route.path)
})

onMounted(async () => {
  // Initialize app
  try {
    await userStore.init()
  } catch (error) {
    console.error('Failed to initialize app:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen">
    <div v-if="isLoading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="loading-spinner mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">Загрузка...</p>
      </div>
    </div>
    
    <template v-else>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </template>
  </div>
</template>