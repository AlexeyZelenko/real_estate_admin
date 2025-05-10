<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useClientsStore } from '../../stores/clients'

const route = useRoute()
const router = useRouter()
const clientsStore = useClientsStore()

const isLoading = ref(true)
const showInteractionForm = ref(false)
const newInteraction = ref({
  type: 'call',
  date: new Date().toISOString().split('T')[0],
  description: '',
  outcome: '',
  nextSteps: ''
})

// Load client data
onMounted(async () => {
  try {
    await clientsStore.fetchClient(route.params.id as string)
  } catch (error) {
    console.error('Error loading client:', error)
  } finally {
    isLoading.value = false
  }
})

const client = computed(() => clientsStore.currentClient)

const getStatusClass = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    case 'potential':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
    case 'inactive':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
}

const editClient = () => {
  router.push(`/clients/${client.value?.id}/edit`)
}

const formatDate = (timestamp: any) => {
  if (!timestamp) return ''
  return new Date(timestamp.seconds * 1000).toLocaleDateString()
}

const getInteractionIcon = (type: string) => {
  switch (type) {
    case 'call':
      return 'pi-phone'
    case 'meeting':
      return 'pi-users'
    case 'email':
      return 'pi-envelope'
    case 'message':
      return 'pi-comments'
    case 'showing':
      return 'pi-home'
    default:
      return 'pi-circle-fill'
  }
}

const addInteraction = async () => {
  if (!client.value) return

  try {
    const interaction = {
      ...newInteraction.value,
      id: Date.now().toString(),
      createdAt: new Date()
    }

    await clientsStore.updateClient(client.value.id, {
      interactions: [...(client.value.interactions || []), interaction]
    })

    // Reset form
    newInteraction.value = {
      type: 'call',
      date: new Date().toISOString().split('T')[0],
      description: '',
      outcome: '',
      nextSteps: ''
    }
    showInteractionForm.value = false
  } catch (error) {
    console.error('Error adding interaction:', error)
  }
}
</script>

<template>
  <div>
    <div v-if="isLoading" class="flex items-center justify-center h-64">
      <div class="loading-spinner"></div>
    </div>

    <div v-else-if="!client" class="text-center py-12">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">Клиент не найден</h3>
      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Запрашиваемый клиент не существует или был удален
      </p>
      <div class="mt-6">
        <router-link
            to="/clients"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
        >
          <i class="pi pi-arrow-left mr-2"></i>
          Вернуться к списку
        </router-link>
      </div>
    </div>

    <div v-else>
      <!-- Header -->
      <div class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ client.name }}</h1>
          <div class="mt-2 flex items-center space-x-4">
            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getStatusClass(client.status)"
            >
              {{ client.status === 'active' ? 'Активный' :
                client.status === 'potential' ? 'Потенциальный' : 'Неактивный' }}
            </span>
            <span class="text-sm text-gray-500 dark:text-gray-400">
              Добавлен: {{ formatDate(client.createdAt) }}
            </span>
          </div>
        </div>

        <div class="mt-4 md:mt-0 flex space-x-3">
          <button
              @click="editClient"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            <i class="pi pi-pencil mr-2"></i>
            Редактировать
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Contact Information -->
          <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Контактная информация</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="text-sm text-gray-500 dark:text-gray-400">Телефон</label>
                <p class="mt-1">
                  <a
                      :href="`tel:${client.phone}`"
                      class="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
                  >
                    {{ client.phone }}
                  </a>
                </p>
              </div>

              <div v-if="client.secondaryPhone">
                <label class="text-sm text-gray-500 dark:text-gray-400">Дополнительный телефон</label>
                <p class="mt-1">
                  <a
                      :href="`tel:${client.secondaryPhone}`"
                      class="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
                  >
                    {{ client.secondaryPhone }}
                  </a>
                </p>
              </div>

              <div v-if="client.email">
                <label class="text-sm text-gray-500 dark:text-gray-400">Email</label>
                <p class="mt-1">
                  <a
                      :href="`mailto:${client.email}`"
                      class="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
                  >
                    {{ client.email }}
                  </a>
                </p>
              </div>
            </div>
          </div>

          <!-- Interests -->
          <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Интересы</h2>
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-sm text-gray-500 dark:text-gray-400">Категория</label>
                  <p class="mt-1 text-gray-900 dark:text-white">{{ client.interests.category }}</p>
                </div>

                <div>
                  <label class="text-sm text-gray-500 dark:text-gray-400">Подкатегория</label>
                  <p class="mt-1 text-gray-900 dark:text-white">{{ client.interests.subcategory }}</p>
                </div>

                <div v-if="client.interests.priceMin || client.interests.priceMax">
                  <label class="text-sm text-gray-500 dark:text-gray-400">Бюджет</label>
                  <p class="mt-1 text-gray-900 dark:text-white">
                    {{ client.interests.priceMin ? `от ${client.interests.priceMin}₴` : '' }}
                    {{ client.interests.priceMax ? `до ${client.interests.priceMax}₴` : '' }}
                  </p>
                </div>

                <div v-if="client.interests.location">
                  <label class="text-sm text-gray-500 dark:text-gray-400">Локация</label>
                  <p class="mt-1 text-gray-900 dark:text-white">{{ client.interests.location }}</p>
                </div>
              </div>

              <div v-if="client.interests.notes">
                <label class="text-sm text-gray-500 dark:text-gray-400">Дополнительные пожелания</label>
                <p class="mt-1 text-gray-600 dark:text-gray-400">{{ client.interests.notes }}</p>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div v-if="client.notes" class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Заметки</h2>
            <p class="text-gray-600 dark:text-gray-400 whitespace-pre-line">{{ client.notes }}</p>
          </div>
        </div>

        <!-- Right Column -->
        <div class="space-y-6">
          <!-- Interactions -->
          <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-medium text-gray-900 dark:text-white">История взаимодействий</h2>
              <button
                  @click="showInteractionForm = true"
                  class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <i class="pi pi-plus mr-2"></i>
                Добавить
              </button>
            </div>

            <!-- Add Interaction Form -->
            <div v-if="showInteractionForm" class="mb-6 border-b border-gray-200 dark:border-gray-700 pb-6">
              <form @submit.prevent="addInteraction" class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Тип
                    </label>
                    <select
                        v-model="newInteraction.type"
                        class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="call">Звонок</option>
                      <option value="meeting">Встреча</option>
                      <option value="email">Email</option>
                      <option value="message">Сообщение</option>
                      <option value="showing">Показ объекта</option>
                      <option value="other">Другое</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Дата
                    </label>
                    <input
                        type="date"
                        v-model="newInteraction.date"
                        class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Описание
                  </label>
                  <textarea
                      v-model="newInteraction.description"
                      rows="3"
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  ></textarea>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Результат
                  </label>
                  <input
                      type="text"
                      v-model="newInteraction.outcome"
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Следующие шаги
                  </label>
                  <input
                      type="text"
                      v-model="newInteraction.nextSteps"
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div class="flex justify-end space-x-3">
                  <button
                      type="button"
                      @click="showInteractionForm = false"
                      class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                  >
                    Отмена
                  </button>
                  <button
                      type="submit"
                      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Сохранить
                  </button>
                </div>
              </form>
            </div>

            <!-- Interactions List -->
            <div class="flow-root">
              <ul role="list" class="-mb-8">
                <li v-for="(interaction, index) in client.interactions" :key="interaction.id">
                  <div class="relative pb-8">
                    <span
                        v-if="index !== client.interactions.length - 1"
                        class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                        aria-hidden="true"
                    ></span>
                    <div class="relative flex space-x-3">
                      <div>
                        <span
                            class="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center ring-8 ring-white dark:ring-gray-800"
                        >
                          <i :class="`pi ${getInteractionIcon(interaction.type)} text-gray-500 dark:text-gray-400`"></i>
                        </span>
                      </div>
                      <div class="min-w-0 flex-1">
                        <div>
                          <div class="text-sm">
                            <span class="font-medium text-gray-900 dark:text-white">
                              {{ interaction.type === 'call' ? 'Звонок' :
                                interaction.type === 'meeting' ? 'Встреча' :
                                    interaction.type === 'email' ? 'Email' :
                                        interaction.type === 'message' ? 'Сообщение' :
                                            interaction.type === 'showing' ? 'Показ объекта' : 'Другое' }}
                            </span>
                          </div>
                          <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                            {{ formatDate(interaction.date) }}
                          </p>
                        </div>
                        <div class="mt-2 text-sm text-gray-700 dark:text-gray-300">
                          <p>{{ interaction.description }}</p>
                        </div>
                        <div v-if="interaction.outcome || interaction.nextSteps" class="mt-2 text-sm">
                          <p v-if="interaction.outcome" class="text-gray-600 dark:text-gray-400">
                            Результат: {{ interaction.outcome }}
                          </p>
                          <p v-if="interaction.nextSteps" class="text-gray-600 dark:text-gray-400">
                            Следующие шаги: {{ interaction.nextSteps }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>