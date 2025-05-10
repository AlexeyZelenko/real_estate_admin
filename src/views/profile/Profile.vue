<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '../../stores/user'

const userStore = useUserStore()
const currentUser = computed(() => userStore.currentUser)
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Form data
const formData = ref({
  name: currentUser.value?.name || '',
  agency: currentUser.value?.agency || '',
  phones: [...(currentUser.value?.phones || [''])],
  experience: currentUser.value?.experience || 0
})

// Add phone field
const addPhone = () => {
  if (formData.value.phones.length < 3) {
    formData.value.phones.push('')
  }
}

// Remove phone field
const removePhone = (index: number) => {
  if (formData.value.phones.length > 1) {
    formData.value.phones.splice(index, 1)
  }
}

// Update profile
const updateProfile = async () => {
  if (!formData.value.name) {
    errorMessage.value = 'Имя обязательно для заполнения'
    return
  }

  // Filter out empty phone numbers
  const phones = formData.value.phones.filter(phone => phone.trim() !== '')
  if (phones.length === 0) {
    errorMessage.value = 'Укажите хотя бы один номер телефона'
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await userStore.updateUserProfile({
      name: formData.value.name,
      agency: formData.value.agency,
      phones,
      experience: formData.value.experience
    })
    successMessage.value = 'Профиль успешно обновлен'
  } catch (error: any) {
    console.error('Profile update error:', error)
    errorMessage.value = error.message || 'Ошибка обновления профиля'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto p-6">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Профиль</h1>
      <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
        Управляйте вашей личной информацией и настройками
      </p>
    </div>

    <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <!-- Profile Header -->
      <div class="p-6 sm:p-8 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="relative">
              <img
                  :src="currentUser?.avatar || 'https://via.placeholder.com/128'"
                  alt="Profile"
                  class="h-32 w-32 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
              />
              <button
                  class="absolute bottom-0 right-0 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <i class="pi pi-camera text-gray-600 dark:text-gray-400"></i>
              </button>
            </div>
          </div>
          <div class="ml-6">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
              {{ currentUser?.name }}
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {{ currentUser?.email }}
            </p>
            <div class="mt-2 flex items-center">
              <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="currentUser?.featured ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'"
              >
                {{ currentUser?.featured ? 'Премиум агент' : 'Базовый аккаунт' }}
              </span>
              <span class="mx-2 text-gray-300 dark:text-gray-600">•</span>
              <span class="text-sm text-gray-500 dark:text-gray-400">
                Рейтинг: {{ currentUser?.rating || 0 }}
              </span>
              <span class="mx-2 text-gray-300 dark:text-gray-600">•</span>
              <span class="text-sm text-gray-500 dark:text-gray-400">
                Отзывов: {{ currentUser?.reviews || 0 }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Profile Form -->
      <form @submit.prevent="updateProfile" class="p-6 sm:p-8 space-y-6">
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

        <!-- Name -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            ФИО *
          </label>
          <div class="mt-1">
            <input
                id="name"
                type="text"
                v-model="formData.name"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            />
          </div>
        </div>

        <!-- Agency -->
        <div>
          <label for="agency" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Агентство
          </label>
          <div class="mt-1">
            <input
                id="agency"
                type="text"
                v-model="formData.agency"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            />
          </div>
        </div>

        <!-- Phone Numbers -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Телефоны *
          </label>
          <div class="mt-1 space-y-2">
            <div v-for="(phone, index) in formData.phones" :key="index" class="flex gap-2">
              <input
                  type="tel"
                  v-model="formData.phones[index]"
                  class="flex-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="+380 XX XXX XX XX"
              />
              <button
                  type="button"
                  @click="removePhone(index)"
                  class="px-2 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                  :disabled="formData.phones.length === 1"
              >
                <i class="pi pi-trash"></i>
              </button>
            </div>
          </div>
          <button
              type="button"
              @click="addPhone"
              class="mt-2 text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400"
              :disabled="formData.phones.length >= 3"
          >
            <i class="pi pi-plus mr-1"></i>
            Добавить телефон
          </button>
        </div>

        <!-- Experience -->
        <div>
          <label for="experience" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Опыт работы (лет)
          </label>
          <div class="mt-1">
            <input
                id="experience"
                type="number"
                v-model="formData.experience"
                min="0"
                max="50"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            />
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end">
          <button
              type="submit"
              :disabled="isLoading"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-gray-800"
          >
            <i v-if="isLoading" class="pi pi-spinner animate-spin mr-2"></i>
            <i v-else class="pi pi-check mr-2"></i>
            {{ isLoading ? 'Сохранение...' : 'Сохранить изменения' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>