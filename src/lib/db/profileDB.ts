/**
 * Profile Picture Storage Service using IndexedDB
 * Works perfectly with Vercel - no backend needed!
 * 
 * Features:
 * - Store profile pictures locally in browser
 * - Automatic image compression (max 200KB)
 * - Persistent storage across sessions
 * - Works offline
 */

const DB_NAME = 'NexusERP_ProfileDB'
const DB_VERSION = 1
const STORE_NAME = 'profilePictures'

// Types
export interface ProfileImage {
  id: string // 'user-profile'
  data: string // Base64 encoded image
  thumbnail: string // Smaller base64 for quick loading
  fileName: string
  fileType: string
  fileSize: number // Original size in bytes
  compressedSize: number // Compressed size in bytes
  uploadedAt: string // ISO date string
  updatedAt: string // ISO date string
}

// Database initialization
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => {
      console.error('IndexedDB error:', request.error)
      reject(request.error)
    }

    request.onsuccess = () => {
      resolve(request.result)
    }

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      
      // Create object store for profile pictures
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
        store.createIndex('uploadedAt', 'uploadedAt', { unique: false })
        store.createIndex('updatedAt', 'updatedAt', { unique: false })
      }
    }
  })
}

// Initialize database on first call
let dbPromise: Promise<IDBDatabase> | null = null

function getDB(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = openDB()
  }
  return dbPromise
}

// ============ IMAGE COMPRESSION ============

/**
 * Compress image before saving to reduce storage size
 * Target: max 200KB, max dimensions 400x400 for avatar
 */
async function compressImage(
  file: File, 
  maxWidth: number = 400, 
  maxHeight: number = 400,
  quality: number = 0.8
): Promise<{ base64: string; width: number; height: number; size: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const img = new Image()
      
      img.onload = () => {
        // Calculate new dimensions maintaining aspect ratio
        let { width, height } = img
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
        }

        // Create canvas and draw resized image
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(width)
        canvas.height = Math.round(height)
        
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Could not get canvas context'))
          return
        }

        // Enable image smoothing for better quality
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        
        // Draw image to canvas
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        // Convert to base64 with compression
        const base64 = canvas.toDataURL('image/jpeg', quality)
        
        // Calculate approximate size of base64 string
        const size = Math.round((base64.length * 3) / 4)

        resolve({
          base64,
          width: canvas.width,
          height: canvas.height,
          size
        })
      }

      img.onerror = () => reject(new Error('Failed to load image'))
      
      // Set image source from file reader result
      img.src = e.target?.result as string
    }

    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

/**
 * Generate a smaller thumbnail version for quick loading in UI
 */
async function generateThumbnail(
  base64: string, 
  maxSize: number = 80
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    
    img.onload = () => {
      let { width, height } = img
      
      if (width > height) {
        if (width > maxSize) {
          height = (height * maxSize) / width
          width = maxSize
        }
      } else {
        if (height > maxSize) {
          width = (width * maxSize) / height
          height = maxSize
        }
      }

      const canvas = document.createElement('canvas')
      canvas.width = Math.round(width)
      canvas.height = Math.round(height)
      
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Could not get canvas context'))
        return
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL('image/jpeg', 0.6))
    }

    img.onerror = () => reject(new Error('Failed to generate thumbnail'))
    img.src = base64
  })
}

// ============ CRUD OPERATIONS ============

/**
 * Save or update user profile picture
 */
export async function saveProfilePicture(file: File): Promise<ProfileImage> {
  const db = await getDB()
  
  // Compress the main image
  const compressed = await compressImage(file)
  
  // Generate thumbnail
  const thumbnail = await generateThumbnail(compressed.base64)
  
  const profileImage: ProfileImage = {
    id: 'user-profile',
    data: compressed.base64,
    thumbnail,
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
    compressedSize: compressed.size,
    uploadedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.put(profileImage)

    request.onsuccess = () => resolve(profileImage)
    request.onerror = () => reject(request.error)
  })
}

/**
 * Get user profile picture
 */
export async function getProfilePicture(): Promise<ProfileImage | null> {
  try {
    const db = await getDB()
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.get('user-profile')

      request.onsuccess = () => resolve(request.result || null)
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.error('Error getting profile picture:', error)
    return null
  }
}

/**
 * Delete user profile picture
 */
export async function deleteProfilePicture(): Promise<void> {
  const db = await getDB()
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.delete('user-profile')

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

/**
 * Check if profile picture exists
 */
export async function hasProfilePicture(): Promise<boolean> {
  const pic = await getProfilePicture()
  return pic !== null
}

/**
 * Get only the thumbnail (faster, for UI previews like TopNav)
 */
export async function getProfileThumbnail(): Promise<string | null> {
  const pic = await getProfilePicture()
  return pic?.thumbnail || pic?.data || null
}

/**
 * Clear all profile data (for reset functionality)
 */
export async function clearAllProfileData(): Promise<void> {
  const db = await getDB()
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.clear()

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}
