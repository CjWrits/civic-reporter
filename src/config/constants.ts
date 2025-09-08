export const APP_CONFIG = {
  name: 'Civic Reporter',
  description: 'Report & track community issues',
  version: '1.0.0',
} as const;

export const API_ENDPOINTS = {
  issues: '/api/issues',
  auth: '/api/auth',
  users: '/api/users',
} as const;

export const STORAGE_KEYS = {
  user: 'civic-user',
  issues: 'civic-issues',
} as const;

export const ISSUE_CATEGORIES = [
  'Roads & Potholes',
  'Street Lighting',
  'Sanitation',
  'Public Transportation',
  'Parks & Recreation',
  'Traffic Signals',
  'Sidewalks',
  'Drainage',
  'Other'
] as const;

export const ISSUE_STATUSES = {
  SUBMITTED: 'submitted',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
} as const;

export const GEOLOCATION_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 60000,
} as const;