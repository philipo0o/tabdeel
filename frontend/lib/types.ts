// Common types for your application
export interface User {
  id: string
  email: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Add more types based on your backend models
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

export interface Article {
  id: number
  title: string
  content?: string
  excerpt?: string
  featuredImage?: string
  fileAttachment?: string
  status: 'draft' | 'published' | 'archived'
  viewCount: number
  authorId: number
  publishedAt?: string
  createdAt: string
  updatedAt: string
  tags?: string[]
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
}

export enum NewsCategory {
  BREAKING = 'breaking',
  NEW = 'new',
  EVENT = 'event',
  UPDATE = 'update',
  ANNOUNCEMENT = 'announcement',
}

export interface News {
  id: number
  titleEn: string
  titleAr: string
  contentEn: string
  contentAr: string
  category: NewsCategory
  featuredImage?: string
  fileAttachment?: string
  viewCount: number
  isPublished: boolean
  publishedAt?: string
  createdAt: string
  updatedAt: string
  authorId: number
}

export enum PublicationType {
  GUIDE = 'guide',
  MAP = 'map',
  MANUAL = 'manual',
  REPORT = 'report',
  BROCHURE = 'brochure',
}

export interface Publication {
  id: number
  titleEn: string
  titleAr: string
  descriptionEn: string
  descriptionAr: string
  type: PublicationType
  fileUrl?: string
  coverImage?: string
  pdfUrl?: string
  downloadCount: number
  isPublished: boolean
  publishedAt?: string
  createdAt: string
  updatedAt: string
  authorId: number
}

export enum AlbumCategory {
  BIKES = 'bikes',
  ROUTES = 'routes',
  EVENTS = 'events',
  MEMBERS = 'members',
  GENERAL = 'general',
}

export interface AlbumPhoto {
  id: number
  imageUrl: string
  captionEn?: string
  captionAr?: string
  order: number
}

export interface Album {
  id: number
  titleEn: string
  titleAr: string
  descriptionEn?: string
  descriptionAr?: string
  category: AlbumCategory
  coverPhoto?: string
  viewCount: number
  isPublished: boolean
  createdAt: string
  updatedAt: string
  authorId: number
  photos?: AlbumPhoto[]
}

export enum EventType {
  RIDE = 'ride',
  MEETING = 'meeting',
  WORKSHOP = 'workshop',
  SOCIAL = 'social',
  COMPETITION = 'competition',
}

export interface Event {
  id: number
  title: string
  description?: string
  location: string
  startDate: string
  endDate: string
  type: EventType | string
  featuredImage?: string
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled' | string
  authorId: number
  organizerName?: string
  governorate?: string
  socialMediaUrl?: string
  createdAt: string
  updatedAt: string
}