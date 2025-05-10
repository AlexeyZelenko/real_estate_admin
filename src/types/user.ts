import { Timestamp } from 'firebase/firestore'

export interface User {
  id: string
  email: string
  name: string
  agency?: string
  avatar?: string
  phones: string[]
  experience: number
  featured: boolean
  rating: number
  reviews: number
  city: {
    Ref: string
    Description: string
    DescriptionRu: string
    AreaDescription: string
    SettlementTypeDescription: string
    Latitude: string
    Longitude: string
    [key: string]: any
  }
  region: {
    code: string
    name: string
    [key: string]: any
  }
  role: {
    id: string
    name: string
    description: string
    isDefault: boolean
    isEditable: boolean
    isRemovable: boolean
    [key: string]: any
  }
  permissions: string[]
  createdAt: Timestamp
  lastLogin: Timestamp
  [key: string]: any
}