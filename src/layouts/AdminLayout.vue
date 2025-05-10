<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { usePropertiesStore } from '../stores/properties'
import { useClientsStore } from '../stores/clients'
import SidebarMenu from '../components/layout/SidebarMenu.vue'
import TopNavbar from '../components/layout/TopNavbar.vue'

const router = useRouter()
const userStore = useUserStore()
const propertiesStore = usePropertiesStore()
const clientsStore = useClientsStore()

const sidebarCollapsed = ref(false)
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

// If mobile, collapse sidebar by default
onMounted(() => {
  if (window.innerWidth < 768) {
    sidebarCollapsed.value = true
  }
  
  // Load user data if needed
  if (userStore.currentUser && userStore.currentUser.id) {
    propertiesStore.fetchUserProperties(userStore.currentUser.id)
    clientsStore.fetchUserClients(userStore.currentUser.id)
  }
})
</script>

<template>
  <div class="flex h-screen bg-gray-100 dark:bg-gray-900">
    <!-- Sidebar -->
    <SidebarMenu 
      :collapsed="sidebarCollapsed" 
      @toggle="toggleSidebar" 
    />
    
    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top Navigation -->
      <TopNavbar 
        :toggle-sidebar="toggleSidebar" 
        :sidebar-collapsed="sidebarCollapsed"
      />
      
      <!-- Main Content Area -->
      <main 
        class="flex-1 overflow-y-auto p-4 md:p-6 transition-all duration-200"
        :class="{ 'md:ml-64': !sidebarCollapsed, 'md:ml-20': sidebarCollapsed }"
      >
        <div class="container mx-auto">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </main>
    </div>
  </div>
</template>