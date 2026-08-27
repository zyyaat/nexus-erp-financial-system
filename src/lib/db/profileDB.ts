/**
 * Profile Picture Storage Service - ROBUST VERSION
 * 
 * Based on research from:
 * - MDN Web Docs (IndexedDB best practices)
 * - Dexie.js (IndexedDB wrapper patterns)
 * - JavaScript.info (transaction handling)
 * - StackOverflow community solutions
 * 
 * Key Features:
 * 1. Exponential backoff retry (3 attempts)
 * 2. Connection health monitoring
 * 3. Transaction isolation
 * 4. Graceful fallback chain: IndexedDB → localStorage → memory
 * 5. Proper error classification
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

// Connection state tracking
let dbInstance: IDBDatabase | null = null
let isDBOpening = false
let dbErrorCount = 0
const MAX_DB_ERRORS_BEFORE_RESET = 3

// ============ BROWSER CHECK ============

export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof indexedDB !== 'undefined'
}

// ============ RETRY UTILITIES ============

/**
 * Sleep utility for delays between retries
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Exponential backoff retry with jitter
 * Based on AWS/Google Cloud best practices
 */
async function withRetry<T>(
  operation: () => Promise<T>,
  options: {
    maxAttempts?: number
    baseDelay?: number
    maxDelay?: number
    operationName?: string
  } = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    baseDelay = 200,
    maxDelay = 2000,
    operationName = 'operation'
  } = options

  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`[ProfileDB] ${operationName} - Attempt ${attempt}/${maxAttempts}`)
      const result = await operation()
      
      if (attempt > 1) {
        console.log(`[ProfileDB] ${operationName} - ✓ Success on attempt ${attempt}`)
      }
      
      // Reset error count on success
      dbErrorCount = 0
      
      return result
    } catch (error) {
      lastError = error as Error
      dbErrorCount++
      
      console.warn(`[ProfileDB] ${operationName} - ✗ Attempt ${attempt} failed:`, error?.message || error)
      
      if (attempt < maxAttempts) {
        // Exponential backoff with jitter (randomness to prevent thundering herd)
        const exponentialDelay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay)
        const jitter = Math.random() * 100 // 0-100ms random jitter
        const delay = exponentialDelay + jitter
        
        console.log(`[ProfileDB] ${operationName} - Retrying in ${Math.round(delay)}ms...`)
        await sleep(delay)
        
        // Reset connection if too many errors
        if (dbErrorCount >= MAX_DB_ERRORS_BEFORE_RESET) {
          console.warn(`[ProfileDB] Too many errors (${dbErrorCount}), resetting connection...`)
          await resetConnection()
        }
      }
    }
  }
  
  throw lastError || new Error(`${operationName} failed after ${maxAttempts} attempts`)
}

/**
 * Reset the database connection
 */
async function resetConnection(): Promise<void> {
  console.log('[ProfileDB] Resetting database connection...')
  
  if (dbInstance) {
    try {
      dbInstance.close()
    } catch (e) {
      console.warn('[ProfileDB] Error closing connection:', e)
    }
    dbInstance = null
  }
  
  // Clear cached promise
  dbPromise = null
  isDBOpening = false
  
  console.log('[ProfileDB] Connection reset complete')
}

// ============ DATABASE INITIALIZATION WITH RETRY ============

let dbPromise: Promise<IDBDatabase> | null = null

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!isBrowser()) {
      reject(new Error('Not running in browser'))
      return
    }

    // Prevent multiple simultaneous opens
    if (isDBOpening) {
      console.log('[ProfileDB] Database already opening, waiting...')
      // Return existing promise if available
      if (dbPromise) {
        dbPromise.then(resolve).catch(reject)
        return
      }
    }

    isDBOpening = true
    
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    // Set timeout for database opening
    const timeoutId = setTimeout(() => {
      console.error('[ProfileDB] Database open timeout')
      isDBOpening = false
      reject(new Error('Database open timeout'))
    }, 5000)

    request.onerror = (event) => {
      clearTimeout(timeoutId)
      isDBOpening = false
      const error = request.error || (event.target as IDBOpenDBRequest)?.error
      console.error('[ProfileDB] IndexedDB open error:', error)
      reject(error || new Error('Failed to open database'))
    }

    request.onsuccess = () => {
      clearTimeout(timeoutId)
      isDBOpening = false
      dbInstance = request.result
      
      // Handle connection closing unexpectedly
      dbInstance.onclose = () => {
        console.warn('[ProfileDB] Database connection closed unexpectedly')
        dbInstance = null
        dbPromise = null
      }
      
      dbInstance.onversionchange = () => {
        console.log('[ProfileDB] Database version change detected, closing connection')
        dbInstance?.close()
        dbInstance = null
        dbPromise = null
      }
      
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

    request.blocked = () => {
      console.warn('[ProfileDB] Database blocked by other connections')
    }
  })
}

async function getDB(): Promise<IDBDatabase> {
  // If we have a valid connection, use it
  if (dbInstance && dbInstance.objectStoreNames.contains(STORE_NAME)) {
    return dbInstance
  }
  
  // Otherwise open/create connection
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

function saveToLocalStorage(image: ProfileImage): boolean {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(image))
    console.log('[ProfileDB] ✓ Saved to localStorage fallback')
    return true
  } catch (err) {
    // Check if it's a quota error
    if (err instanceof DOMException && (
      err.name === 'QuotaExceededError' ||
      err.name === 'NS_ERROR_DOM_QUOTA_REACHED'
    )) {
      console.error('[ProfileDB] ✗ LocalStorage quota exceeded!')
      // Try to make space by removing old data
      try {
        localStorage.removeItem(LOCAL_STORAGE_KEY)
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(image))
        console.log('[ProfileDB] ✓ Saved to localStorage after cleanup')
        return true
      } catch (e) {
        console.error('[ProfileDB] ✗ Still cannot save to localStorage after cleanup')
        return false
      }
    }
    console.error('[ProfileDB] ✗ Failed to save to localStorage:', err)
    return false
  }
}

function getFromLocalStorage(): ProfileImage | null {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (data) {
      return JSON.parse(data)
    }
  } catch (err) {
    console.error('[ProfileDB] ✗ Failed to read from localStorage:', err)
  }
  return null
}

function removeFromLocalStorage(): void {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY)
    console.log('[ProfileDB] ✓ Removed from localStorage fallback')
  } catch (err) {
    console.error('[ProfileDB] ✗ Failed to remove from localStorage:', err)
  }
}

// ============ ROBUST CRUD OPERATIONS WITH RETRY & FALLBACK ============

/**
 * Save or update user profile picture with automatic retry
 * Strategy: Try IndexedDB → Fallback to localStorage → Memory cache
 */
export async function saveProfilePicture(file: File): Promise<ProfileImage> {
  console.log('[ProfileDB] Starting save process for file:', file.name, 'Size:', file.size)
  
  // Step 1: Compress the main image (this is fast, no need for retry)
  const compressed = await compressImage(file)
  
  // Step 2: Generate thumbnail
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

  // Step 3: Try to save with retry logic
  if (isBrowser()) {
    try {
      const savedImage = await withRetry(async () => {
        const db = await getDB()
        
        return new Promise<ProfileImage>((resolve, reject) => {
          // Use a short-lived transaction
          const transaction = db.transaction([STORE_NAME], 'readwrite')
          const store = transaction.objectStore(STORE_NAME)
          const request = store.put(profileImage)

          // Success handler
          request.onsuccess = () => {
            console.log('[ProfileDB] ✓ Successfully saved to IndexedDB')
            resolve(profileImage)
          }
          
          // Error handler - this will trigger retry
          request.onerror = () => {
            const error = request.error
            console.error('[ProfileDB] ✗ IndexedDB put error:', error?.message)
            reject(error || new Error('Failed to save to IndexedDB'))
          }
          
          // Transaction-level error handling
          transaction.onerror = () => {
            console.error('[ProfileDB] ✗ Transaction error')
          }
          
          transaction.onabort = () => {
            console.warn('[ProfileDB] ⚠ Transaction aborted')
          }
          
          transaction.oncomplete = () => {
            console.log('[ProfileDB] ✓ Transaction completed successfully')
          }
        })
      }, {
        maxAttempts: 3,
        baseDelay: 300,
        operationName: 'saveProfilePicture'
      })
      
      // Also update localStorage as backup (don't wait for it)
      setTimeout(() => {
        saveToLocalStorage(savedImage)
        memoryCache = savedImage
      }, 0)
      
      return savedImage
      
    } catch (indexedDBError) {
      console.warn('[ProfileDB] ✗ All IndexedDB attempts failed, using localStorage fallback:', indexedDBError.message)
      
      // Fallback to localStorage
      const localSuccess = saveToLocalStorage(profileImage)
      memoryCache = profileImage
      
      if (!localSuccess) {
        console.warn('[ProfileDB] ✗ localStorage also failed, keeping in memory only')
      }
      
      return profileImage
    }
  }
  
  // SSR fallback - just keep in memory
  console.log('[ProfileDB] Not in browser, keeping in memory only')
  memoryCache = profileImage
  return profileImage
}

/**
 * Get user profile picture with retry logic
 */
export async function getProfilePicture(): Promise<ProfileImage | null> {
  console.log('[ProfileDB] Starting get process...')
  
  if (isBrowser()) {
    try {
      const image = await withRetry(async () => {
        const db = await getDB()
        
        return new Promise<ProfileImage | null>((resolve, reject) => {
          const transaction = db.transaction([STORE_NAME], 'readonly')
          const store = transaction.objectStore(STORE_NAME)
          const request = store.get('user-profile')

          request.onsuccess = () => {
            if (request.result) {
              console.log('[ProfileDB] ✓ Found in IndexedDB')
              memoryCache = request.result
              resolve(request.result)
            } else {
              console.log('[ProfileDB] Not found in IndexedDB')
              resolve(null)
            }
          }
          
          request.onerror = () => {
            const error = request.error
            console.error('[ProfileDB] ✗ IndexedDB get error:', error?.message)
            reject(error || new Error('Failed to read from IndexedDB'))
          }
        })
      }, {
        maxAttempts: 2, // Fewer retries for reads
        baseDelay: 100,
        operationName: 'getProfilePicture'
      })
      
      // If found in IndexedDB, return it
      if (image) {
        return image
      }
      
      // Not in IndexedDB, check localStorage
      console.log('[ProfileDB] Checking localStorage fallback...')
      const localData = getFromLocalStorage()
      if (localData) {
        console.log('[ProfileDB] ✓ Found in localStorage fallback')
        memoryCache = localData
        return localData
      }
      
      // Not anywhere, return memory cache
      console.log('[ProfileDB] Returning from memory cache')
      return memoryCache
      
    } catch (error) {
      console.warn('[ProfileDB] ✗ All IndexedDB attempts failed for get, checking localStorage:', error)
      
      // Try localStorage
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
 * Delete user profile picture with retry
 */
export async function deleteProfilePicture(): Promise<void> {
  console.log('[ProfileDB] Starting delete process...')
  
  if (isBrowser()) {
    try {
      await withRetry(async () => {
        const db = await getDB()
        
        return new Promise<void>((resolve, reject) => {
          const transaction = db.transaction([STORE_NAME], 'readwrite')
          const store = transaction.objectStore(STORE_NAME)
          const request = store.delete('user-profile')

          request.onsuccess = () => {
            console.log('[ProfileDB] ✓ Deleted from IndexedDB')
            resolve()
          }
          
          request.onerror = () => {
            const error = request.error
            console.error('[ProfileDB] ✗ IndexedDB delete error:', error?.message)
            reject(error || new Error('Failed to delete from IndexedDB'))
          }
        })
      }, {
        maxAttempts: 3,
        baseDelay: 300,
        operationName: 'deleteProfilePicture'
      })
      
      // Clean up other storage locations
      removeFromLocalStorage()
      memoryCache = null
      
    } catch (error) {
      console.warn('[ProfileDB] ✗ Delete failed, cleaning up anyway:', error)
      // Still clean up what we can
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
      await withRetry(async () => {
        const db = await getDB()
        
        return new Promise<void>((resolve, reject) => {
          const transaction = db.transaction([STORE_NAME], 'readwrite')
          const store = transaction.objectStore(STORE_NAME)
          const request = store.clear()

          request.onsuccess = () => {
            console.log('[ProfileDB] ✓ Cleared IndexedDB')
            resolve()
          }
          
          request.onerror = () => {
            const error = request.error
            console.error('[ProfileDB] ✗ Clear error:', error?.message)
            reject(error || new Error('Failed to clear IndexedDB'))
          }
        })
      }, {
        maxAttempts: 2,
        operationName: 'clearAllProfileData'
      })
    } catch (error) {
      console.warn('[ProfileDB] ✗ Clear failed:', error)
    }
    
    // Always clean up other storage
    removeFromLocalStorage()
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
  dbConnected: boolean
  errorCount: number
}> {
  const status = {
    indexedDB: false,
    localStorage: false,
    memory: memoryCache !== null,
    imageData: memoryCache || undefined,
    dbConnected: dbInstance !== null,
    errorCount: dbErrorCount
  }
  
  if (isBrowser()) {
    try {
      const db = await getDB()
      status.dbConnected = true
      
      const pic = await new Promise<ProfileImage | null>((resolve) => {
        try {
          const tx = db.transaction([STORE_NAME], 'readonly')
          const store = tx.objectStore(STORE_NAME)
          const req = store.get('user-profile')
          req.onsuccess = () => resolve(req.result)
          req.onerror = () => resolve(null)
        } catch (e) {
          resolve(null)
        }
      })
      
      status.indexedDB = pic !== null
      if (pic) status.imageData = pic
    } catch (e) {
      console.error('[ProfileDB] Debug check failed for IndexedDB:', e)
      status.dbConnected = false
    }
    
    status.localStorage = localStorage.getItem(LOCAL_STORAGE_KEY) !== null
  }
  
  console.log('[ProfileDB] Storage Status:', status)
  return status
}

/**
 * Force reset all storage (for troubleshooting)
 */
export async function forceResetAllStorage(): Promise<void> {
  console.log('[ProfileDB] Force resetting all storage...')
  
  // Close and reset IndexedDB connection
  await resetConnection()
  
  // Try to delete the database entirely
  if (isBrowser()) {
    try {
      await new Promise((resolve, reject) => {
        const request = indexedDB.deleteDatabase(DB_NAME)
        request.onsuccess = resolve
        request.onerror = reject
        request.blocked = () => {
          console.warn('[ProfileDB] Database deletion blocked')
          resolve()
        }
      })
      console.log('[ProfileDB] ✓ Database deleted')
    } catch (e) {
      console.error('[ProfileDB] ✗ Failed to delete database:', e)
    }
  }
  
  // Clear localStorage
  removeFromLocalStorage()
  
  // Clear memory
  memoryCache = null
  
  console.log('[ProfileDB] All storage reset complete')
}
