import { Timestamp } from 'firebase/firestore'

export interface Property {
  id: string
  title: string
  description: string
  price: number
  priceType: 'fixed' | 'negotiable' | 'contract'
  category: string
  subcategory: string
  status: 'active' | 'pending' | 'sold' | 'archived'
  featured: boolean
  address: {
    street: string
    city: string
    region: string
    zipCode?: string
    coordinates?: {
      latitude: number
      longitude: number
    }
  }
  details: {
    area: number
    rooms?: number
    bathrooms?: number
    floors?: number
    floor?: number
    yearBuilt?: number
    hasParking?: boolean
    hasElevator?: boolean
    [key: string]: any
  }
  amenities: string[]
  images: string[]
  documents?: string[]
  contactInfo: {
    name: string
    phone: string
    email?: string
  }
  userId: string
  createdAt: Timestamp
  updatedAt: Timestamp
  [key: string]: any
}

export interface PropertyFilter {
  category?: string
  subcategory?: string
  status?: string
  priceMin?: number
  priceMax?: number
  areaMin?: number
  areaMax?: number
  rooms?: number
  featured?: boolean
  [key: string]: any
}