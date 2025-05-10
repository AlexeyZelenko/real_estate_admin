import { defineStore } from 'pinia'
import { ref } from 'vue'
import { auth, db } from '../main'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth'
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore'
import { User } from '../types/user'

export const useUserStore = defineStore('user', () => {
  const currentUser = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref('')

  // Initialize user
  async function init() {
    isLoading.value = true
    try {
      if (auth.currentUser) {
        await fetchUserData()
      }
    } catch (err) {
      console.error('Failed to initialize user:', err)
      error.value = 'Failed to load user data'
    } finally {
      isLoading.value = false
    }
  }

  // Fetch user data from Firestore
  async function fetchUserData() {
    if (!auth.currentUser) return
    
    try {
      const userDocRef = doc(db, 'users', auth.currentUser.uid)
      const userDoc = await getDoc(userDocRef)
      
      if (userDoc.exists()) {
        currentUser.value = userDoc.data() as User
      } else {
        console.error('No user document found')
      }
    } catch (err) {
      console.error('Error fetching user data:', err)
      throw err
    }
  }

  // Login
  async function login(email: string, password: string) {
    isLoading.value = true
    error.value = ''
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      await fetchUserData()
      
      // Update last login
      if (userCredential.user) {
        const userDocRef = doc(db, 'users', userCredential.user.uid)
        await updateDoc(userDocRef, {
          lastLogin: serverTimestamp()
        })
      }
      
      return userCredential.user
    } catch (err: any) {
      console.error('Login error:', err)
      error.value = err.message || 'Failed to login'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Register
  async function register(userData: {
    email: string;
    password: string;
    name: string;
    agency?: string;
    phones: string[];
    experience: number;
    city: any;
    region: any;
  }) {
    isLoading.value = true
    error.value = ''
    
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        userData.email, 
        userData.password
      )
      
      // Update user profile
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: userData.name
        })
      }
      
      // Create user document in Firestore
      if (userCredential.user) {
        const user: Partial<User> = {
          id: userCredential.user.uid,
          email: userData.email,
          name: userData.name,
          agency: userData.agency || '',
          phones: userData.phones || [],
          experience: userData.experience || 0,
          city: userData.city || {},
          region: userData.region || {},
          avatar: '',
          featured: false,
          rating: 0,
          reviews: 0,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          role: {
            id: 'realtor',
            name: 'Риелтор',
            description: 'Пользователь с доступом к управлению недвижимостью.',
            isDefault: true,
            isEditable: false,
            isRemovable: false
          },
          permissions: ['manage_properties', 'manage_clients']
        }
        
        const userDocRef = doc(db, 'users', userCredential.user.uid)
        await setDoc(userDocRef, user)
        
        await fetchUserData()
      }
      
      return userCredential.user
    } catch (err: any) {
      console.error('Registration error:', err)
      error.value = err.message || 'Failed to register'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Logout
  async function logout() {
    isLoading.value = true
    error.value = ''
    
    try {
      await signOut(auth)
      currentUser.value = null
    } catch (err: any) {
      console.error('Logout error:', err)
      error.value = err.message || 'Failed to logout'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Reset password
  async function resetPassword(email: string) {
    isLoading.value = true
    error.value = ''
    
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (err: any) {
      console.error('Password reset error:', err)
      error.value = err.message || 'Failed to send password reset email'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Update user profile
  async function updateUserProfile(userData: Partial<User>) {
    isLoading.value = true
    error.value = ''
    
    try {
      if (!auth.currentUser || !currentUser.value) {
        throw new Error('User not authenticated')
      }
      
      const userDocRef = doc(db, 'users', auth.currentUser.uid)
      await updateDoc(userDocRef, {
        ...userData,
        updatedAt: serverTimestamp()
      })
      
      // Update local user data
      await fetchUserData()
    } catch (err: any) {
      console.error('Profile update error:', err)
      error.value = err.message || 'Failed to update profile'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    currentUser,
    isLoading,
    error,
    init,
    login,
    register,
    logout,
    resetPassword,
    updateUserProfile,
    fetchUserData
  }
})