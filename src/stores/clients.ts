import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { db } from '../main'
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  addDoc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore'
import { Client } from '../types/client'

export const useClientsStore = defineStore('clients', () => {
  const clients = ref<Client[]>([])
  const currentClient = ref<Client | null>(null)
  const isLoading = ref(false)
  const error = ref('')
  
  // Computed
  const clientCount = computed(() => clients.value.length)
  
  // Fetch all clients for current user
  async function fetchUserClients(userId: string) {
    isLoading.value = true
    error.value = ''
    
    try {
      const q = query(
        collection(db, 'clients'),
        where('realtorId', '==', userId),
        orderBy('createdAt', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      clients.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Client[]
    } catch (err: any) {
      console.error('Error fetching clients:', err)
      error.value = err.message || 'Failed to load clients'
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  // Get single client
  async function fetchClient(clientId: string) {
    isLoading.value = true
    error.value = ''
    
    try {
      const docRef = doc(db, 'clients', clientId)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        currentClient.value = {
          id: docSnap.id,
          ...docSnap.data()
        } as Client
      } else {
        throw new Error('Client not found')
      }
    } catch (err: any) {
      console.error('Error fetching client:', err)
      error.value = err.message || 'Failed to load client'
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  // Add new client
  async function addClient(client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) {
    isLoading.value = true
    error.value = ''
    
    try {
      const clientData = {
        ...client,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
      
      const docRef = await addDoc(collection(db, 'clients'), clientData)
      return docRef.id
    } catch (err: any) {
      console.error('Error adding client:', err)
      error.value = err.message || 'Failed to add client'
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  // Update client
  async function updateClient(clientId: string, clientData: Partial<Client>) {
    isLoading.value = true
    error.value = ''
    
    try {
      const docRef = doc(db, 'clients', clientId)
      await updateDoc(docRef, {
        ...clientData,
        updatedAt: serverTimestamp()
      })
    } catch (err: any) {
      console.error('Error updating client:', err)
      error.value = err.message || 'Failed to update client'
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  // Delete client
  async function deleteClient(clientId: string) {
    isLoading.value = true
    error.value = ''
    
    try {
      const docRef = doc(db, 'clients', clientId)
      await deleteDoc(docRef)
      
      // Update local state
      clients.value = clients.value.filter(c => c.id !== clientId)
    } catch (err: any) {
      console.error('Error deleting client:', err)
      error.value = err.message || 'Failed to delete client'
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  return {
    clients,
    currentClient,
    isLoading,
    error,
    clientCount,
    fetchUserClients,
    fetchClient,
    addClient,
    updateClient,
    deleteClient
  }
})