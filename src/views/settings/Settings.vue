<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '../../stores/user'

const userStore = useUserStore()
const isLoading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

// Settings form
const settings = ref({
  notifications: {
    email: true,
    push: true,
    sms: false
  },
  privacy: {
    showPhone: true,
    showEmail: false,
    showProfile: true
  },
  appearance: {
    language: 'ru',
    theme: localStorage.getItem('darkMode') === 'true' ? 'dark' : 'light'
  },
  security: {
    twoFactorAuth: false,
    sessionTimeout: 30
  }
})

const languages = [
  { code: 'ru', name: 'Русский' },
  { code: 'uk', name: 'Українська' },
  { code: 'en', name: 'English' }
]

const themes = [
  { id: 'light', name: 'Светлая' },
  { id: 'dark', name: 'Темная' },
  { id: 'system', name: 'Системная' }
]

const timeoutOptions = [
  { value: 15, label: '15 минут' },
  { value: 30, label: '30 минут' },
  { value: 60, label: '1 час' },
  { value: 120, label: '2 часа' },
  { value: 240, label: '4 часа' }
]

// Save settings
const saveSettings = async () => {
  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    // Update theme
    if (settings.value.appearance.theme === 'dark') {
      document.documentElement.classList.add('dark')
      localStorage.setItem('darkMode', 'true')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('darkMode', 'false')
    }

    // Here you would typically save settings to backend
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API call

    successMessage.value = 'Настройки успешно сохранены'
  } catch (error: any) {
    console.error('Error saving settings:', error)
    errorMessage.value = error.message || 'Ошибка сохранения настроек'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  // Load settings from localStorage or backend
  const savedTheme = localStorage.getItem('darkMode')
  if (savedTheme) {
    settings.value.appearance.theme = savedTheme === 'true' ? 'dark' : 'light'
  }
})
</script>

<template>
  <div>
    <header class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Настройки</h1>
      <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
        Управляйте настройками вашего аккаунта
      </p>
    </header>

    <div class="grid grid-cols-1 gap-6">
      <!-- Notifications -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div class="p-6">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Уведомления</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-medium text-gray-900 dark:text-white">Email уведомления</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">Получать уведомления на email</p>
              </div>
              <button
                  type="button"
                  class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  :class="settings.notifications.email ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'"
                  @click="settings.notifications.email = !settings.notifications.email"
              >
                <span
                    class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                    :class="settings.notifications.email ? 'translate-x-5' : 'translate-x-0'"
                />
              </button>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-medium text-gray-900 dark:text-white">Push уведомления</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">Получать push-уведомления в браузере</p>
              </div>
              <button
                  type="button"
                  class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  :class="settings.notifications.push ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'"
                  @click="settings.notifications.push = !settings.notifications.push"
              >
                <span
                    class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                    :class="settings.notifications.push ? 'translate-x-5' : 'translate-x-0'"
                />
              </button>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-medium text-gray-900 dark:text-white">SMS уведомления</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">Получать уведомления по SMS</p>
              </div>
              <button
                  type="button"
                  class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  :class="settings.notifications.sms ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'"
                  @click="settings.notifications.sms = !settings.notifications.sms"
              >
                <span
                    class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                    :class="settings.notifications.sms ? 'translate-x-5' : 'translate-x-0'"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Privacy -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div class="p-6">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Конфиденциальность</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-medium text-gray-900 dark:text-white">Показывать телефон</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">Отображать номер телефона в профиле</p>
              </div>
              <button
                  type="button"
                  class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  :class="settings.privacy.showPhone ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'"
                  @click="settings.privacy.showPhone = !settings.privacy.showPhone"
              >
                <span
                    class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                    :class="settings.privacy.showPhone ? 'translate-x-5' : 'translate-x-0'"
                />
              </button>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-medium text-gray-900 dark:text-white">Показывать email</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">Отображать email в профиле</p>
              </div>
              <button
                  type="button"
                  class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  :class="settings.privacy.showEmail ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'"
                  @click="settings.privacy.showEmail = !settings.privacy.showEmail"
              >
                <span
                    class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                    :class="settings.privacy.showEmail ? 'translate-x-5' : 'translate-x-0'"
                />
              </button>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-medium text-gray-900 dark:text-white">Публичный профиль</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">Сделать профиль видимым для всех</p>
              </div>
              <button
                  type="button"
                  class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  :class="settings.privacy.showProfile ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'"
                  @click="settings.privacy.showProfile = !settings.privacy.showProfile"
              >
                <span
                    class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                    :class="settings.privacy.showProfile ? 'translate-x-5' : 'translate-x-0'"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Appearance -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div class="p-6">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Внешний вид</h2>
          <div class="space-y-4">
            <div>
              <label for="language" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Язык
              </label>
              <select
                  id="language"
                  v-model="settings.appearance.language"
                  class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option v-for="lang in languages" :key="lang.code" :value="lang.code">
                  {{ lang.name }}
                </option>
              </select>
            </div>

            <div>
              <label for="theme" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Тема
              </label>
              <select
                  id="theme"
                  v-model="settings.appearance.theme"
                  class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option v-for="theme in themes" :key="theme.id" :value="theme.id">
                  {{ theme.name }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Security -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div class="p-6">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Безопасность</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-medium text-gray-900 dark:text-white">Двухфакторная аутентификация</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">Дополнительный уровень защиты для вашего аккаунта</p>
              </div>
              <button
                  type="button"
                  class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  :class="settings.security.twoFactorAuth ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'"
                  @click="settings.security.twoFactorAuth = !settings.security.twoFactorAuth"
              >
                <span
                    class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                    :class="settings.security.twoFactorAuth ? 'translate-x-5' : 'translate-x-0'"
                />
              </button>
            </div>

            <div>
              <label for="sessionTimeout" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Тайм-аут сессии
              </label>
              <select
                  id="sessionTimeout"
                  v-model="settings.security.sessionTimeout"
                  class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option v-for="option in timeoutOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="rounded-md bg-green-50 dark:bg-green-900/20 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <i class="pi pi-check-circle text-green-400"></i>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-green-800 dark:text-green-200">
              {{ successMessage }}
            </p>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <i class="pi pi-exclamation-circle text-red-400"></i>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-red-800 dark:text-red-200">
              {{ errorMessage }}
            </p>
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <div class="flex justify-end">
        <button
            type="button"
            @click="saveSettings"
            :disabled="isLoading"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-gray-800"
        >
          <i v-if="isLoading" class="pi pi-spinner animate-spin mr-2"></i>
          <i v-else class="pi pi-check mr-2"></i>
          {{ isLoading ? 'Сохранение...' : 'Сохранить настройки' }}
        </button>
      </div>
    </div>
  </div>
</template>