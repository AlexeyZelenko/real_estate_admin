import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { db, storage } from '../main'
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  addDoc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore'
import { 
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage'
import { Property } from '../types/property'

export const usePropertiesStore = defineStore('properties', () => {
  const properties = ref<Property[]>([])
  const currentProperty = ref<Property | null>(null)
  const isLoading = ref(false)
  const error = ref('')
  
  // Computed properties
  const propertyCount = computed(() => properties.value.length)
  
  // Get properties for current user
  async function fetchUserProperties(userId: string) {
    isLoading.value = true
    error.value = ''
    
    try {
      const q = query(
        collection(db, 'properties'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      properties.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Property[]
    } catch (err: any) {
      console.error('Error fetching properties:', err)
      error.value = err.message || 'Failed to load properties'
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  // Get single property
  async function fetchProperty(propertyId: string) {
    isLoading.value = true
    error.value = ''
    
    try {
      const docRef = doc(db, 'properties', propertyId)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        currentProperty.value = {
          id: docSnap.id,
          ...docSnap.data()
        } as Property
      } else {
        throw new Error('Property not found')
      }
    } catch (err: any) {
      console.error('Error fetching property:', err)
      error.value = err.message || 'Failed to load property'
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  // Add new property
  async function addProperty(property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) {
    isLoading.value = true
    error.value = ''
    
    try {
      const propertyData = {
        ...property,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
      
      const docRef = await addDoc(collection(db, 'properties'), propertyData)
      return docRef.id
    } catch (err: any) {
      console.error('Error adding property:', err)
      error.value = err.message || 'Failed to add property'
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  // Update property
  async function updateProperty(propertyId: string, propertyData: Partial<Property>) {
    isLoading.value = true
    error.value = ''
    
    try {
      const docRef = doc(db, 'properties', propertyId)
      await updateDoc(docRef, {
        ...propertyData,
        updatedAt: serverTimestamp()
      })
    } catch (err: any) {
      console.error('Error updating property:', err)
      error.value = err.message || 'Failed to update property'
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  // Delete property
  async function deleteProperty(propertyId: string) {
    isLoading.value = true
    error.value = ''
    
    try {
      const docRef = doc(db, 'properties', propertyId)
      await deleteDoc(docRef)
      
      // Update local state
      properties.value = properties.value.filter(p => p.id !== propertyId)
    } catch (err: any) {
      console.error('Error deleting property:', err)
      error.value = err.message || 'Failed to delete property'
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  // Upload property images
  async function uploadPropertyImage(propertyId: string, file: File): Promise<string> {
    isLoading.value = true
    error.value = ''
    
    try {
      const path = `properties/${propertyId}/${Date.now()}_${file.name}`
      const imageRef = storageRef(storage, path)
      
      // Upload file
      await uploadBytes(imageRef, file)
      
      // Get download URL
      const downloadURL = await getDownloadURL(imageRef)
      return downloadURL
    } catch (err: any) {
      console.error('Error uploading image:', err)
      error.value = err.message || 'Failed to upload image'
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  // Delete property image
  async function deletePropertyImage(imageUrl: string) {
    isLoading.value = true
    error.value = ''
    
    try {
      // Extract path from URL
      const imageRef = storageRef(storage, imageUrl)
      await deleteObject(imageRef)
    } catch (err: any) {
      console.error('Error deleting image:', err)
      error.value = err.message || 'Failed to delete image'
      throw err
    } finally {
      isLoading.value = false
    }
  }
  
  return {
    properties,
    currentProperty,
    isLoading,
    error,
    propertyCount,
    fetchUserProperties,
    fetchProperty,
    addProperty,
    updateProperty,
    deleteProperty,
    uploadPropertyImage,
    deletePropertyImage
  }
})