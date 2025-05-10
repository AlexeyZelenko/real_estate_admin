import { Timestamp } from 'firebase/firestore'

export interface Client {
  id: string
  name: string
  email?: string
  phone: string
  secondaryPhone?: string
  status: 'active' | 'potential' | 'inactive'
  interests: {
    category: string
    subcategory: string
    priceMin?: number
    priceMax?: number
    areaMin?: number
    areaMax?: number
    location?: string
    notes?: string
    [key: string]: any
  }
  notes?: string
  interactions: ClientInteraction[]
  realtorId: string
  createdAt: Timestamp
  updatedAt: Timestamp
  [key: string]: any
}

export interface ClientInteraction {
  id: string
  type: 'call' | 'meeting' | 'email' | 'message' | 'showing' | 'other'
  date: Timestamp
  description: string
  outcome?: string
  nextSteps?: string
  relatedPropertyId?: string
  createdAt: Timestamp
  [key: string]: any
}