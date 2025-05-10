import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '../main'

// Layouts
import AdminLayout from '../layouts/AdminLayout.vue'

// Auth views
import Login from '../views/auth/Login.vue'
import Register from '../views/auth/Register.vue'
import ForgotPassword from '../views/auth/ForgotPassword.vue'

// Dashboard views
import Dashboard from '../views/dashboard/Dashboard.vue'
import Properties from '../views/properties/Properties.vue'
import PropertyDetails from '../views/properties/PropertyDetails.vue'
import AddProperty from '../views/properties/AddProperty.vue'
import EditProperty from '../views/properties/EditProperty.vue'
import Clients from '../views/clients/Clients.vue'
import ClientDetails from '../views/clients/ClientDetails.vue'
import AddClient from '../views/clients/AddClient.vue'
import EditClient from '../views/clients/EditClient.vue'
import Profile from '../views/profile/Profile.vue'
import Settings from '../views/settings/Settings.vue'

const routes = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresAuth: false }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword,
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: AdminLayout,
    // meta: { requiresAuth: true },
    meta: { requiresAuth: false },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard
      },
      {
        path: 'properties',
        name: 'Properties',
        component: Properties
      },
      {
        path: 'properties/add',
        name: 'AddProperty',
        component: AddProperty
      },
      {
        path: 'properties/:id',
        name: 'PropertyDetails',
        component: PropertyDetails
      },
      {
        path: 'properties/:id/edit',
        name: 'EditProperty',
        component: EditProperty
      },
      {
        path: 'clients',
        name: 'Clients',
        component: Clients
      },
      {
        path: 'clients/add',
        name: 'AddClient',
        component: AddClient
      },
      {
        path: 'clients/:id',
        name: 'ClientDetails',
        component: ClientDetails
      },
      {
        path: 'clients/:id/edit',
        name: 'EditClient',
        component: EditClient
      },
      {
        path: 'profile',
        name: 'Profile',
        component: Profile
      },
      {
        path: 'settings',
        name: 'Settings',
        component: Settings
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuthenticated = auth.currentUser

  if (requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (!requiresAuth && isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router