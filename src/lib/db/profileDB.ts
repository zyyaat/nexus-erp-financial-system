/**
 * Profile Picture Storage Service
 * 
 * Strategy: IndexedDB → localStorage fallback → memory cache
 * Works perfectly with Vercel - no backend needed!
 * 
 * Features:
 * - Store profile pictures locally in browser
 * - Automatic image compression (max 200KB)
 * - Persistent storage across sessions
 * - Works offline
 * - Graceful fallback if IndexedDB unavailable
 */

const DB_NAME = 'NexusERP_ProfileDB'
const DB_VERSION = 1
const STORE_NAME = 'profilePictures'
const LOCAL_STORAGE_KEY = 'nexuserp_profile_picture'

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

// In-memory fallback for SSR
let memoryCache: ProfileImage | null = null

// ============ BROWSER CHECK ============

/**
 * Check if we're running in a browser environment with IndexedDB support
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof indexedDB !== 'undefined'
}

export function isIndexedDBAvailable(): Promise<boolean> {
  return new Promise((resolve) => {
    if (!isBrowser()) {
      resolve(false)
      return
    }
    
    try {
      const request = indexedDB.open(DB_NAME)
      
      request.onerror = () => resolve(false)
      request.onsuccess = () => {
        request.result.close()
        resolve(true)
      }
      
      // Timeout after 2 seconds
      setTimeout(() => {
        resolve(false)
      }, 2000)
    } catch {
      resolve(false)
    }
  })
}

// ============ DATABASE INITIALIZATION ============

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!isBrowser()) {
      reject(new Error('Not running in browser'))
      return
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => {
      console.error('[ProfileDB] IndexedDB open error:', request.error)
      reject(request.error)
    }

    request.onsuccess = () => {
      console.log('[ProfileDB] Database opened successfully')
      resolve(request.result)
    }

    request.onupgradeneeded = (event) => {
      console.log('[ProfileDB] Creating/upgrading database schema')
      const db = (event.target as IDBOpenDBRequest).result
      
      // Create object store for profile pictures
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
        store.createIndex('uploadedAt', 'uploadedAt', { unique: false })
        store.createIndex('updatedAt', 'updatedAt', { unique: false })
        console.log('[ProfileDB] Object store created:', STORE_NAME)
      }
    }
  })
}

// Initialize database on first call
let dbPromise: Promise<IDBDatabase> | null = null

async function getDB(): Promise<IDBDatabase> {
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
        try {
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

          console.log(`[ProfileDB] Image compressed: ${file.size} bytes → ${size} bytes (${canvas.width}x${canvas.height})`)
          
          resolve({
            base64,
            width: canvas.width,
            height: canvas.height,
            size
          })
        } catch (err) {
          console.error('[ProfileDB] Error during image compression:', err)
          reject(err)
        }
      }

      img.onerror = () => {
        console.error('[ProfileDB] Failed to load image for compression')
        reject(new Error('Failed to load image'))
      }
      
      // Set image source from file reader result
      img.src = e.target?.result as string
    }

    reader.onerror = () => {
      console.error('[ProfileDB] Failed to read file')
      reject(new Error('Failed to read file'))
    }
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
      try {
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
      } catch (err) {
        console.error('[ProfileDB] Error generating thumbnail:', err)
        reject(err)
      }
    }

    img.onerror = () => {
      console.error('[ProfileDB] Failed to load image for thumbnail')
      reject(new Error('Failed to generate thumbnail'))
    }
    img.src = base64
  })
}

// ============ LOCALSTORAGE FALLBACK ============

function saveToLocalStorage(image: ProfileImage): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(image))
    console.log('[ProfileDB] Saved to localStorage fallback')
  } catch (err) {
    console.error('[ProfileDB] Failed to save to localStorage:', err)
  }
}

function getFromLocalStorage(): ProfileImage | null {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (data) {
      return JSON.parse(data)
    }
  } catch (err) {
    console.error('[ProfileDB] Failed to read from localStorage:', err)
  }
  return null
}

function removeFromLocalStorage(): void {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY)
    console.log('[ProfileDB] Removed from localStorage fallback')
  } catch (err) {
    console.error('[ProfileDB] Failed to remove from localStorage:', err)
  }
}

// ============ CRUD OPERATIONS WITH FALLBACK ============

/**
 * Save or update user profile picture
 * Tries IndexedDB first, falls back to localStorage, then memory
 */
export async function saveProfilePicture(file: File): Promise<ProfileImage> {
  console.log('[ProfileDB] Starting save process for file:', file.name, 'Size:', file.size)
  
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

  // Try IndexedDB first
  if (isBrowser()) {
    try {
      const db = await getDB()
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        const request = store.put(profileImage)

        request.onsuccess = () => {
          console.log('[ProfileDB] ✓ Successfully saved to IndexedDB')
          // Also update localStorage as backup
          saveToLocalStorage(profileImage)
          memoryCache = profileImage
          resolve(profileImage)
        }
        
        request.onerror = () => {
          console.warn('[ProfileDB] IndexedDB save failed, trying localStorage...')
          // Fallback to localStorage
          saveToLocalStorage(profileImage)
          memoryCache = profileImage
          resolve(profileImage)
        }
        
        transaction.oncomplete = () => {
          console.log('[ProfileDB] Transaction completed')
        }
        
        transaction.onerror = () => {
          console.error('[ProfileDB] Transaction error')
        }
      })
    } catch (err) {
      console.warn('[ProfileDB] IndexedDB unavailable, using localStorage fallback:', err)
      saveToLocalStorage(profileImage)
      memoryCache = profileImage
      return profileImage
    }
  }
  
  // SSR fallback - just keep in memory
  console.log('[ProfileDB] Not in browser, keeping in memory only')
  memoryCache = profileImage
  return profileImage
}

/**
 * Get user profile picture
 * Tries IndexedDB first, then localStorage, then memory
 */
export async function getProfilePicture(): Promise<ProfileImage | null> {
  console.log('[ProfileDB] Starting get process...')
  
  // Try IndexedDB first
  if (isBrowser()) {
    try {
      const db = await getDB()
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly')
        const store = transaction.objectStore(STORE_NAME)
        const request = store.get('user-profile')

        request.onsuccess = () => {
          if (request.result) {
            console.log('[ProfileDB] ✓ Found in IndexedDB')
            memoryCache = request.result
            resolve(request.result)
          } else {
            console.log('[ProfileDB] Not found in IndexedDB, checking localStorage...')
            // Try localStorage fallback
            const localData = getFromLocalStorage()
            if (localData) {
              console.log('[ProfileDB] ✓ Found in localStorage fallback')
              memoryCache = localData
              resolve(localData)
            } else {
              console.log('[ProfileDB] Not found anywhere')
              resolve(memoryCache)
            }
          }
        }
        
        request.onerror = () => {
          console.warn('[ProfileDB] IndexedDB get failed, trying localStorage...')
          const localData = getFromLocalStorage()
          if (localData) {
            memoryCache = localData
            resolve(localData)
          } else {
            resolve(memoryCache)
          }
        }
      })
    } catch (err) {
      console.warn('[ProfileDB] IndexedDB unavailable, checking localStorage...', err)
      const localData = getFromLocalStorage()
      if (localData) {
        memoryCache = localData
        return localData
      }
      return memoryCache
    }
  }
  
  // SSR - return from memory
  console.log('[ProfileDB] Returning from memory cache (SSR)')
  return memoryCache
}

/**
 * Delete user profile picture
 * Removes from all storage locations
 */
export async function deleteProfilePicture(): Promise<void> {
  console.log('[ProfileDB] Starting delete process...')
  
  // Delete from IndexedDB
  if (isBrowser()) {
    try {
      const db = await getDB()
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        const request = store.delete('user-profile')

        request.onsuccess = () => {
          console.log('[ProfileDB] ✓ Deleted from IndexedDB')
          // Also delete from localStorage
          removeFromLocalStorage()
          memoryCache = null
          resolve()
        }
        
        request.onerror = () => {
          console.warn('[ProfileDB] IndexedDB delete failed')
          // Still clean up other storage
          removeFromLocalStorage()
          memoryCache = null
          resolve()
        }
      })
    } catch (err) {
      console.warn('[ProfileDB] IndexedDB unavailable during delete:', err)
      removeFromLocalStorage()
      memoryCache = null
    }
  }
  
  // Clean up memory
  memoryCache = null
}

/**
 * Check if profile picture exists
 */
export async function hasProfilePicture(): Promise<boolean> {
  const pic = await getProfilePicture()
  return pic !== null && pic !== undefined
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
  console.log('[ProfileDB] Clearing all profile data...')
  
  if (isBrowser()) {
    try {
      const db = await getDB()
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        const request = store.clear()

        request.onsuccess = () => {
          console.log('[ProfileDB] ✓ Cleared IndexedDB')
          removeFromLocalStorage()
          memoryCache = null
          resolve()
        }
        
        request.onerror = () => {
          console.error('[ProfileDB] Failed to clear IndexedDB')
          removeFromLocalStorage()
          memoryCache = null
          resolve()
        }
      })
    } catch (err) {
      console.warn('[ProfileDB] IndexedDB unavailable during clear:', err)
      removeFromLocalStorage()
      memoryCache = null
    }
  }
  
  memoryCache = null
}

/**
 * Debug helper - log current storage status
 */
export async function debugStorageStatus(): Promise<{
  indexedDB: boolean
  localStorage: boolean
  memory: boolean
  imageData?: ProfileImage
}> {
  const status = {
    indexedDB: false,
    localStorage: false,
    memory: memoryCache !== null,
    imageData: memoryCache || undefined
  }
  
  if (isBrowser()) {
    try {
      const db = await getDB()
      const pic = await new Promise<ProfileImage | null>((resolve) => {
        const tx = db.transaction([STORE_NAME], 'readonly')
        const store = tx.objectStore(STORE_NAME)
        const req = store.get('user-profile')
        req.onsuccess = () => resolve(req.result)
        req.onerror = () => resolve(null)
      })
      status.indexedDB = pic !== null
      if (pic) status.imageData = pic
    } catch (e) {
      console.error('[ProfileDB] Debug check failed for IndexedDB:', e)
    }
    
    status.localStorage = localStorage.getItem(LOCAL_STORAGE_KEY) !== null
  }
  
  console.log('[ProfileDB] Storage Status:', status)
  return status
}
