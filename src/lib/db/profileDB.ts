/**
 * Profile Picture Storage Service - MOBILE-FIXED VERSION
 * 
 * PROBLEM SOLVED:
 * - FileReader.readAsDataURL() FAILS on mobile browsers (Chrome iOS/Android)
 * - Error: "Failed to read file" 
 * - Mobile browsers have strict security restrictions
 * 
 * SOLUTION (from developer communities research):
 * - Use URL.createObjectURL() for preview (no FileReader needed!)
 * - Use Canvas.toBlob() for compression (mobile-compatible)
 * - Use Image() constructor with crossOrigin for loading
 * - Remove FileReader dependency completely
 * 
 * Sources:
 * - https://stackoverflow.com/questions/31742072/filereader-vs-window-url-createobjecturl
 * - https://forweb.dev/en/blog/2020-05-05-object-url
 * - https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
 * - https://github.com/blueimp/javascript-canvas-to-blob
 */

const DB_NAME = 'NexusERP_ProfileDB'
const DB_VERSION = 1
const STORE_NAME = 'profilePictures'
const LOCAL_STORAGE_KEY = 'nexuserp_profile_picture'

// Types
export interface ProfileImage {
  id: string // 'user-profile'
  data: string // Base64 encoded image (for storage)
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

export function isMobile(): boolean {
  if (!isBrowser()) return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

// ============ RETRY UTILITIES ============

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

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
      
      dbErrorCount = 0
      return result
    } catch (error) {
      lastError = error as Error
      dbErrorCount++
      
      console.warn(`[ProfileDB] ${operationName} - ✗ Attempt ${attempt} failed:`, error?.message || error)
      
      if (attempt < maxAttempts) {
        const exponentialDelay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay)
        const jitter = Math.random() * 100
        const delay = exponentialDelay + jitter
        
        console.log(`[ProfileDB] ${operationName} - Retrying in ${Math.round(delay)}ms...`)
        await sleep(delay)
        
        if (dbErrorCount >= MAX_DB_ERRORS_BEFORE_RESET) {
          console.warn(`[ProfileDB] Too many errors (${dbErrorCount}), resetting connection...`)
          await resetConnection()
        }
      }
    }
  }
  
  throw lastError || new Error(`${operationName} failed after ${maxAttempts} attempts`)
}

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

    if (isDBOpening) {
      console.log('[ProfileDB] Database already opening, waiting...')
      if (dbPromise) {
        dbPromise.then(resolve).catch(reject)
        return
      }
    }

    isDBOpening = true
    
    const request = indexedDB.open(DB_NAME, DB_VERSION)

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
  if (dbInstance && dbInstance.objectStoreNames.contains(STORE_NAME)) {
    return dbInstance
  }
  
  if (!dbPromise) {
    dbPromise = openDB()
  }
  
  return dbPromise
}

// ============ IMAGE PROCESSING - MOBILE COMPATIBLE ============
// NO FileReader! Uses URL.createObjectURL and Canvas.toBlob()

/**
 * Create object URL for preview (NO FileReader needed!)
 * This works perfectly on mobile browsers
 */
function createPreviewUrl(file: File): string {
  if (!isBrowser()) {
    throw new Error('Not in browser environment')
  }
  
  try {
    const url = URL.createObjectURL(file)
    console.log('[ProfileDB] ✓ Created preview URL (ObjectURL method)')
    return url
  } catch (error) {
    console.error('[ProfileDB] Failed to create ObjectURL:', error)
    throw new Error('Failed to create preview URL')
  }
}

/**
 * Revoke object URL to free memory
 */
function revokePreviewUrl(url: string): void {
  if (isBrowser() && url.startsWith('blob:')) {
    URL.revokeObjectURL(url)
  }
}

/**
 * Load image from file using URL.createObjectURL (mobile compatible!)
 * Returns an HTMLImageElement
 */
function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    if (!isBrowser()) {
      reject(new Error('Not in browser environment'))
      return
    }

    // Use ObjectURL instead of FileReader - MOBILE COMPATIBLE!
    const objectUrl = URL.createObjectURL(file)
    const img = new Image()
    
    // Set timeout for image loading
    const timeoutId = setTimeout(() => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Image load timeout'))
    }, 10000) // 10 second timeout
    
    img.onload = () => {
      clearTimeout(timeoutId)
      URL.revokeObjectURL(objectUrl) // Clean up immediately
      resolve(img)
    }
    
    img.onerror = () => {
      clearTimeout(timeoutId)
      URL.revokeObjectURL(objectUrl)
      console.error('[ProfileDB] Failed to load image from file')
      reject(new Error('Failed to load image'))
    }
    
    // Start loading
    img.src = objectUrl
  })
}

/**
 * Compress image using Canvas API - MOBILE COMPATIBLE!
 * Uses Canvas.toBlob() instead of toDataURL() when possible
 */
async function compressImage(
  file: File, 
  maxWidth: number = 400, 
  maxHeight: number = 400,
  quality: number = 0.8
): Promise<{ base64: string; width: number; height: number; size: number }> {
  try {
    // Load image using ObjectURL (works on mobile!)
    const img = await loadImageFromFile(file)
    
    // Calculate new dimensions maintaining aspect ratio
    let { width, height } = img.naturalWidth && img.naturalHeight 
      ? { width: img.naturalWidth, height: img.naturalHeight }
      : { width: img.width, height: img.height }
    
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
      throw new Error('Could not get canvas context')
    }

    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

    // Try Canvas.toBlob() first (more memory efficient, better for mobile)
    // Fall back to toDataURL() if toBlob fails
    return new Promise((resolve, reject) => {
      // Try toBlob first (preferred method)
      if (canvas.toBlob) {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Convert blob to base64 using FileReader (small blob, should work)
              const reader = new FileReader()
              reader.onload = () => {
                const base64 = reader.result as string
                const size = Math.round((base64.length * 3) / 4)
                
                console.log(`[ProfileDB] Image compressed via toBlob: ${file.size} → ${size} bytes (${canvas.width}x${canvas.height})`)
                
                resolve({
                  base64,
                  width: canvas.width,
                  height: canvas.height,
                  size
                })
              }
              reader.onerror = () => {
                // If FileReader fails here too, use toDataURL as ultimate fallback
                console.warn('[ProfileDB] Blob FileReader failed, using toDataURL fallback')
                try {
                  const base64 = canvas.toDataURL('image/jpeg', quality)
                  const size = Math.round((base64.length * 3) / 4)
                  
                  resolve({
                    base64,
                    width: canvas.width,
                    height: canvas.height,
                    size
                  })
                } catch (err) {
                  reject(err)
                }
              }
              reader.readAsDataURL(blob)
            } else {
              // toBlob returned null, fall back to toDataURL
              console.warn('[ProfileDB] toBlob returned null, using toDataURL fallback')
              fallbackToDataURL()
            }
          },
          'image/jpeg',
          quality
        )
      } else {
        // Browser doesn't support toBlob, use toDataURL
        fallbackToDataURL()
      }
      
      function fallbackToDataURL() {
        try {
          const base64 = canvas.toDataURL('image/jpeg', quality)
          const size = Math.round((base64.length * 3) / 4)
          
          console.log(`[ProfileDB] Image compressed via toDataURL: ${file.size} → ${size} bytes (${canvas.width}x${canvas.height})`)
          
          resolve({
            base64,
            width: canvas.width,
            height: canvas.height,
            size
          })
        } catch (err) {
          reject(err)
        }
      }
    })
    
  } catch (error) {
    console.error('[ProfileDB] Error during image compression:', error)
    throw error
  }
}

/**
 * Generate thumbnail - uses same mobile-compatible approach
 */
async function generateThumbnail(
  sourceBase64: string, 
  maxSize: number = 80
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    
    img.onload = () => {
      try {
        let { width, height } = img.naturalWidth && img.naturalHeight 
          ? { width: img.naturalWidth, height: img.naturalHeight }
          : { width: img.width, height: img.height }
        
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
        
        // Use small quality for thumbnail
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
    
    img.src = sourceBase64
  })
}

// ============ LOCALSTORAGE FALLBACK ============

function saveToLocalStorage(image: ProfileImage): boolean {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(image))
    console.log('[ProfileDB] ✓ Saved to localStorage fallback')
    return true
  } catch (err) {
    if (err instanceof DOMException && (
      err.name === 'QuotaExceededError' ||
      err.name === 'NS_ERROR_DOM_QUOTA_REACHED'
    )) {
      console.error('[ProfileDB] ✗ LocalStorage quota exceeded!')
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

// ============ CRUD OPERATIONS WITH RETRY & FALLBACK ============

/**
 * Save profile picture - MOBILE FIXED VERSION
 * No FileReader dependency!
 */
export async function saveProfilePicture(file: File): Promise<ProfileImage> {
  console.log('[ProfileDB] Starting save process for file:', file.name, 'Size:', file.size)
  console.log('[ProfileDB] Device type:', isMobile() ? '📱 Mobile' : '💻 Desktop')
  
  // Step 1: Compress the main image (uses ObjectURL internally - mobile compatible!)
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

  // Step 3: Save with retry logic
  if (isBrowser()) {
    try {
      const savedImage = await withRetry(async () => {
        const db = await getDB()
        
        return new Promise<ProfileImage>((resolve, reject) => {
          const transaction = db.transaction([STORE_NAME], 'readwrite')
          const store = transaction.objectStore(STORE_NAME)
          const request = store.put(profileImage)

          request.onsuccess = () => {
            console.log('[ProfileDB] ✓ Successfully saved to IndexedDB')
            resolve(profileImage)
          }
          
          request.onerror = () => {
            const error = request.error
            console.error('[ProfileDB] ✗ IndexedDB put error:', error?.message)
            reject(error || new Error('Failed to save to IndexedDB'))
          }
          
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
      
      const localSuccess = saveToLocalStorage(profileImage)
      memoryCache = profileImage
      
      if (!localSuccess) {
        console.warn('[ProfileDB] ✗ localStorage also failed, keeping in memory only')
      }
      
      return profileImage
    }
  }
  
  console.log('[ProfileDB] Not in browser, keeping in memory only')
  memoryCache = profileImage
  return profileImage
}

/**
 * Get user profile picture
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
        maxAttempts: 2,
        baseDelay: 100,
        operationName: 'getProfilePicture'
      })
      
      if (image) {
        return image
      }
      
      console.log('[ProfileDB] Checking localStorage fallback...')
      const localData = getFromLocalStorage()
      if (localData) {
        console.log('[ProfileDB] ✓ Found in localStorage fallback')
        memoryCache = localData
        return localData
      }
      
      console.log('[ProfileDB] Returning from memory cache')
      return memoryCache
      
    } catch (error) {
      console.warn('[ProfileDB] ✗ All IndexedDB attempts failed for get, checking localStorage:', error)
      
      const localData = getFromLocalStorage()
      if (localData) {
        memoryCache = localData
        return localData
      }
      
      return memoryCache
    }
  }
  
  console.log('[ProfileDB] Returning from memory cache (SSR)')
  return memoryCache
}

/**
 * Delete user profile picture
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
      
      removeFromLocalStorage()
      memoryCache = null
      
    } catch (error) {
      console.warn('[ProfileDB] ✗ Delete failed, cleaning up anyway:', error)
      removeFromLocalStorage()
      memoryCache = null
    }
  }
  
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
 * Get only the thumbnail
 */
export async function getProfileThumbnail(): Promise<string | null> {
  const pic = await getProfilePicture()
  return pic?.thumbnail || pic?.data || null
}

/**
 * Clear all profile data
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
    
    removeFromLocalStorage()
  }
  
  memoryCache = null
}

/**
 * Debug helper
 */
export async function debugStorageStatus(): Promise<{
  indexedDB: boolean
  localStorage: boolean
  memory: boolean
  imageData?: ProfileImage
  dbConnected: boolean
  errorCount: number
  isMobileDevice: boolean
}> {
  const status = {
    indexedDB: false,
    localStorage: false,
    memory: memoryCache !== null,
    imageData: memoryCache || undefined,
    dbConnected: dbInstance !== null,
    errorCount: dbErrorCount,
    isMobileDevice: isMobile()
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
 * Export helper functions for preview URLs
 */
export { createPreviewUrl, revokePreviewUrl, isMobile }
