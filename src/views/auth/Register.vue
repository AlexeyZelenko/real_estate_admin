<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'

const router = useRouter()
const userStore = useUserStore()

const form = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  name: '',
  agency: '',
  phones: [''],
  experience: 0,
  city: {},
  region: {}
})

const isLoading = ref(false)
const errorMessage = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const addPhone = () => {
  if (form.phones.length < 3) {
    form.phones.push('')
  }
}

const removePhone = (index: number) => {
  if (form.phones.length > 1) {
    form.phones.splice(index, 1)
  }
}

const register = async () => {
  // Validate form
  if (!form.email || !form.password || !form.name) {
    errorMessage.value = 'Пожалуйста, заполните все обязательные поля'
    return
  }
  
  if (form.password !== form.confirmPassword) {
    errorMessage.value = 'Пароли не совпадают'
    return
  }
  
  if (form.password.length < 6) {
    errorMessage.value = 'Пароль должен содержать минимум 6 символов'
    return
  }
  
  // Filter out empty phone numbers
  form.phones = form.phones.filter(phone => phone.trim() !== '')
  
  if (form.phones.length === 0) {
    errorMessage.value = 'Укажите хотя бы один номер телефона'
    return
  }
  
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    await userStore.register(form)
    router.push('/dashboard')
  } catch (error: any) {
    console.error('Registration error:', error)
    errorMessage.value = error.message || 'Ошибка регистрации'
  } finally {
    isLoading.value = false
  }
}

const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
  if (field === 'password') {
    showPassword.value = !showPassword.value
  } else {
    showConfirmPassword.value = !showConfirmPassword.value
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Регистрация
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Создайте аккаунт риелтора
        </p>
      </div>
      
      <div class="mt-8 bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="register">
          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email *
            </label>
            <div class="mt-1">
              <input
                id="email"
                type="email"
                v-model="form.email"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="email@example.com"
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Пароль *
            </label>
            <div class="mt-1 relative">
              <input
                id="password"
                :type="showPassword ? 'text' : 'password'"
                v-model="form.password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="••••••••"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                @click="togglePasswordVisibility('password')"
              >
                <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
              </button>
            </div>
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Подтвердите пароль *
            </label>
            <div class="mt-1 relative">
              <input
                id="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                v-model="form.confirmPassword"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="••••••••"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                @click="togglePasswordVisibility('confirmPassword')"
              >
                <i :class="showConfirmPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
              </button>
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
                v-model="form.name"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="Иван Иванов"
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
                v-model="form.agency"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="Название агентства"
              />
            </div>
          </div>

          <!-- Phone Numbers -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Телефоны *
            </label>
            <div class="space-y-2">
              <div v-for="(phone, index) in form.phones" :key="index" class="flex gap-2">
                <input
                  type="tel"
                  v-model="form.phones[index]"
                  class="flex-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="067-473-55-00"
                />
                <button
                  type="button"
                  @click="removePhone(index)"
                  class="px-2 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                  :disabled="form.phones.length === 1"
                >
                  <i class="pi pi-trash"></i>
                </button>
              </div>
            </div>
            <button
              type="button"
              @click="addPhone"
              class="mt-2 text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400"
              :disabled="form.phones.length >= 3"
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
                v-model="form.experience"
                min="0"
                max="50"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              />
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
              {{ isLoading ? 'Регистрация...' : 'Зарегистрироваться' }}
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
                Уже есть аккаунт?
              </span>
            </div>
          </div>

          <div class="mt-6 text-center">
            <router-link
              to="/login"
              class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
            >
              Войти в систему
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>