<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'

const router = useRouter()
const userStore = useUserStore()

const email = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const resetPassword = async () => {
  if (!email.value) {
    errorMessage.value = 'Пожалуйста, введите email'
    return
  }
  
  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  try {
    await userStore.resetPassword(email.value)
    successMessage.value = 'Инструкции по сбросу пароля отправлены на ваш email'
    setTimeout(() => {
      router.push('/login')
    }, 3000)
  } catch (error: any) {
    console.error('Password reset error:', error)
    errorMessage.value = error.message || 'Ошибка сброса пароля'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Восстановление пароля
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Введите email для получения инструкций по сбросу пароля
        </p>
      </div>
      
      <div class="mt-8 bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="resetPassword">
          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <div class="mt-1">
              <input
                id="email"
                type="email"
                v-model="email"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="email@example.com"
              />
            </div>
          </div>

          <!-- Success Message -->
          <div v-if="successMessage" class="rounded-md bg-green-50 dark:bg-green-900/20 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <i class="pi pi-check-circle text-green-400"></i>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-green-800 dark:text-green-200">
                  {{ successMessage }}
                </h3>
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
                <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
                  {{ errorMessage }}
                </h3>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div>
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-gray-800"
            >
              <span v-if="isLoading" class="absolute left-0 inset-y-0 flex items-center pl-3">
                <div class="loading-spinner w-5 h-5"></div>
              </span>
              {{ isLoading ? 'Отправка...' : 'Сбросить пароль' }}
            </button>
          </div>
        </form>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300 dark:border-gray-700"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white dark:bg-gray-800 text-gray-500">
                или
              </span>
            </div>
          </div>

          <div class="mt-6 text-center">
            <router-link
              to="/login"
              class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
            >
              Вернуться к входу
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>