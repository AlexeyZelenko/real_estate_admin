```vue
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useClientsStore } from '../../stores/clients'
import type { Client } from '../../types/client'

const route = useRoute()
const router = useRouter()
const clientsStore = useClientsStore()

const isLoading = ref(true)
const isSaving = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const clientId = route.params.id as string

// Form data
const formData = ref({
  name: '',
  email: '',
  phone: '',
  secondaryPhone: '',
  status: 'potential',
  interests: {
    category: '',
    subcategory: '',
    priceMin: undefined as number | undefined,
    priceMax: undefined as number | undefined,
    areaMin: undefined as number | undefined,
    areaMax: undefined as number | undefined,
    location: '',
    notes: ''
  },
  notes: ''
})

// Status options
const statusOptions = [
  { value: 'active', label: 'Активный' },
  { value: 'potential', label: 'Потенциальный' },
  { value: 'inactive', label: 'Неактивный' }
]

// Property categories
const categories = [
  { id: 'apartments', name: 'Квартиры' },
  { id: 'houses', name: 'Дома' },
  { id: 'commercial', name: 'Коммерческая недвижимость' },
  { id: 'land', name: 'Земельные участки' }
]

// Load client data
onMounted(async () => {
  try {
    await clientsStore.fetchClient(clientId)
    if (clientsStore.currentClient) {
      formData.value = {
        name: clientsStore.currentClient.name,
        email: clientsStore.currentClient.email || '',
        phone: clientsStore.currentClient.phone,
        secondaryPhone: clientsStore.currentClient.secondaryPhone || '',
        status: clientsStore.currentClient.status,
        interests: {
          category: clientsStore.currentClient.interests?.category || '',
          subcategory: clientsStore.currentClient.interests?.subcategory || '',
          priceMin: clientsStore.currentClient.interests?.priceMin,
          priceMax: clientsStore.currentClient.interests?.priceMax,
          areaMin: clientsStore.currentClient.interests?.areaMin,
          areaMax: clientsStore.currentClient.interests?.areaMax,
          location: clientsStore.currentClient.interests?.location || '',
          notes: clientsStore.currentClient.interests?.notes || ''
        },
        notes: clientsStore.currentClient.notes || ''
      }
    }
  } catch (error: any) {
    console.error('Error loading client:', error)
    errorMessage.value = error.message || 'Ошибка загрузки данных клиента'
  } finally {
    isLoading.value = false
  }
})

// Save changes
const saveChanges = async () => {
  if (!formData.value.name || !formData.value.phone) {
    errorMessage.value = 'Заполните обязательные поля'
    return
  }

  isSaving.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await clientsStore.updateClient(clientId, {
      name: formData.value.name,
      email: formData.value.email || null,
      phone: formData.value.phone,
      secondaryPhone: formData.value.secondaryPhone || null,
      status: formData.value.status,
      interests: formData.value.interests,
      notes: formData.value.notes
    })

    successMessage.value = 'Данные клиента успешно обновлены'
    setTimeout(() => {
      router.push(`/clients/${clientId}`)
    }, 1500)
  } catch (error: any) {
    console.error('Error updating client:', error)
    errorMessage.value = error.message || 'Ошибка обновления данных клиента'
  } finally {
    isSaving.value = false
  }
}

const cancelEdit = () => {
  router.push(`/clients/${clientId}`)
}
</script>

<template>
  <div class="max-w-4xl mx-auto p-6">
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Редактирование клиента
        </h1>
        <button
            @click="cancelEdit"
            class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <i class="pi pi-times"></i>
        </button>
      </div>
      <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
        Измените информацию о клиенте
      </p>
    </div>

    <div v-if="isLoading" class="flex items-center justify-center h-64">
      <div class="loading-spinner"></div>
    </div>

    <div v-else class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <form @submit.prevent="saveChanges" class="p-6 space-y-6">
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

        <!-- Basic Information -->
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <!-- Name -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              ФИО *
            </label>
            <input
                id="name"
                type="text"
                v-model="formData.name"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <!-- Status -->
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Статус *
            </label>
            <select
                id="status"
                v-model="formData.status"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option v-for="option in statusOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>

          <!-- Phone -->
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Телефон *
            </label>
            <input
                id="phone"
                type="tel"
                v-model="formData.phone"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <!-- Secondary Phone -->
          <div>
            <label for="secondaryPhone" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Дополнительный телефон
            </label>
            <input
                id="secondaryPhone"
                type="tel"
                v-model="formData.secondaryPhone"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
                id="email"
                type="email"
                v-model="formData.email"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        <!-- Interests -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Интересы клиента
          </h3>

          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <!-- Property Category -->
            <div>
              <label for="category" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Категория недвижимости
              </label>
              <select
                  id="category"
                  v-model="formData.interests.category"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">Выберите категорию</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>

            <!-- Location -->
            <div>
              <label for="location" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Предпочитаемый район
              </label>
              <input
                  id="location"
                  type="text"
                  v-model="formData.interests.location"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <!-- Price Range -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Ценовой диапазон
              </label>
              <div class="mt-1 grid grid-cols-2 gap-3">
                <div>
                  <input
                      type="number"
                      v-model="formData.interests.priceMin"
                      placeholder="От"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <input
                      type="number"
                      v-model="formData.interests.priceMax"
                      placeholder="До"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <!-- Area Range -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Площадь (м²)
              </label>
              <div class="mt-1 grid grid-cols-2 gap-3">
                <div>
                  <input
                      type="number"
                      v-model="formData.interests.areaMin"
                      placeholder="От"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <input
                      type="number"
                      v-model="formData.interests.areaMax"
                      placeholder="До"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Interest Notes -->
          <div class="mt-6">
            <label for="interestNotes" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Дополнительные пожелания
            </label>
            <textarea
                id="interestNotes"
                v-model="formData.interests.notes"
                rows="3"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            ></textarea>
          </div>
        </div>

        <!-- General Notes -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <label for="notes" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Общие заметки
          </label>
          <textarea
              id="notes"
              v-model="formData.notes"
              rows="4"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          ></textarea>
        </div>

        <!-- Form Actions -->
        <div class="flex justify-end space-x-3 border-t border-gray-200 dark:border-gray-700 pt-6">
          <button
              type="button"
              @click="cancelEdit"
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            Отмена
          </button>
          <button
              type="submit"
              :disabled="isSaving"
              class="inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-gray-800"
          >
            <i v-if="isSaving" class="pi pi-spinner animate-spin mr-2"></i>
            {{ isSaving ? 'Сохранение...' : 'Сохранить изменения' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
```