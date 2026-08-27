'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Camera, Upload, Trash2, Loader2, User, ZoomIn, X, AlertCircle, RefreshCw, Smartphone } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { 
  saveProfilePicture, 
  getProfilePicture, 
  deleteProfilePicture,
  isBrowser,
  isMobile,
  createPreviewUrl,
  revokePreviewUrl,
  debugStorageStatus,
  type ProfileImage 
} from '@/lib/db/profileDB'

// ============ TYPES ============
interface ProfilePictureUploaderProps {
  size?: 'small' | 'medium' | 'large'
  showPreview?: boolean
  onImageChange?: (imageData: string | null) => void
  className?: string
}

// Size configurations
const sizeConfig = {
  small: { container: 'w-16 h-16', image: 'w-14 h-14', icon: 24, text: 'text-xs' },
  medium: { container: 'w-24 h-24', image: 'w-22 h-22', icon: 32, text: 'text-sm' },
  large: { container: 'w-36 h-36', image: 'w-34 h-34', icon: 48, text: 'text-base' }
}

// ============ MAIN COMPONENT ============
export default function ProfilePictureUploader({
  size = 'large',
  showPreview = true,
  onImageChange,
  className = ''
}: ProfilePictureUploaderProps) {
  const { t, language, dir } = useI18n()
  const isRTL = dir === 'rtl'
  const isMobileDevice = isMobile()
  
  const config = sizeConfig[size]
  
  // State
  const [profileImage, setProfileImage] = useState<ProfileImage | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showFullPreview, setShowFullPreview] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string>('')
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const successTimeoutRef = useRef<NodeJS.Timeout>()
  const currentPreviewUrlRef = useRef<string | null>(null) // Track current preview URL for cleanup

  // Load existing profile picture on mount (client-side only!)
  useEffect(() => {
    if (!isBrowser()) {
      console.log('[ProfileUploader] Skipping load - not in browser (SSR)')
      return
    }
    
    console.log('[ProfileUploader] Component mounted', isMobileDevice ? '(📱 Mobile)' : '(💻 Desktop)')
    loadProfilePicture()
    setIsInitialized(true)
    
    return () => {
      // Cleanup preview URL on unmount
      if (currentPreviewUrlRef.current) {
        revokePreviewUrl(currentPreviewUrlRef.current)
        currentPreviewUrlRef.current = null
      }
      
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current)
      }
    }
  }, [])

  // Notify parent of image changes
  useEffect(() => {
    if (isInitialized) {
      onImageChange?.(previewUrl || profileImage?.data || null)
    }
  }, [previewUrl, profileImage, isInitialized])

  // Load profile picture from storage
  const loadProfilePicture = async () => {
    if (!isBrowser()) {
      console.log('[ProfileUploader] Cannot load - not in browser')
      return
    }

    try {
      console.log('[ProfileUploader] Loading profile picture...')
      
      const image = await getProfilePicture()
      
      if (image && image.data) {
        console.log('[ProfileUploader] ✓ Profile picture found:', image.fileName)
        setProfileImage(image)
        
        // Use base64 data directly for stored images (not ObjectURL needed)
        setPreviewUrl(image.data)
        currentPreviewUrlRef.current = null // No ObjectURL to track
        
        setDebugInfo(`✓ Loaded: ${image.fileName} (${image.compressedSize} bytes)`)
      } else {
        console.log('[ProfileUploader] No profile picture found')
        setDebugInfo('No saved picture')
      }
    } catch (err) {
      console.error('[ProfileUploader] Failed to load profile picture:', err)
      setError(language === 'ar' 
        ? 'فشل في تحميل الصورة المحفوظة'
        : 'Failed to load saved image'
      )
      setDebugInfo(`Load error: ${err}`)
    }
  }

  // Validate file before upload
  const validateFile = (file: File): string | null => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    const maxSize = 10 * 1024 * 1024 // 10MB

    if (!validTypes.includes(file.type)) {
      return language === 'ar' 
        ? 'نوع الملف غير مدعوم. يرجى استخدام JPEG, PNG, GIF, أو WebP'
        : 'Unsupported file type. Please use JPEG, PNG, GIF, or WebP'
    }

    if (file.size > maxSize) {
      return language === 'ar'
        ? 'حجم الملف كبير جداً. الحد الأقصى 10 ميجابايت'
        : 'File too large. Maximum size is 10MB'
    }

    return null
  }

  // Handle file selection - MOBILE FIXED VERSION!
  const handleFileSelect = async (file: File) => {
    console.log('[ProfileUploader] File selected:', file.name, 'Size:', file.size, 'Type:', file.type)
    
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      setDebugInfo(`Validation failed: ${validationError}`)
      return
    }

    setError(null)
    setIsUploading(true)

    try {
      // ✅ MOBILE FIX: Use URL.createObjectURL() instead of FileReader!
      // This works perfectly on mobile browsers where FileReader fails
      console.log('[ProfileUploader] Creating preview using ObjectURL (mobile compatible)...')
      
      let newPreviewUrl: string
      
      try {
        newPreviewUrl = createPreviewUrl(file)
        console.log('[ProfileUploader] ✓ Preview created successfully via ObjectURL')
        
        // Cleanup old preview URL if exists
        if (currentPreviewUrlRef.current) {
          revokePreviewUrl(currentPreviewUrlRef.current)
        }
        
        // Update state and ref
        setPreviewUrl(newPreviewUrl)
        currentPreviewUrlRef.current = newPreviewUrl
        
      } catch (previewError) {
        console.error('[ProfileUploader] Failed to create ObjectURL:', previewError)
        throw new Error(language === 'ar'
          ? 'فشل في إنشاء معاينة الصورة'
          : 'Failed to create image preview'
        )
      }
      
      setDebugInfo('Compressing & saving...')
      
      // Save to database (uses internal ObjectURL for compression - mobile compatible!)
      console.log('[ProfileUploader] Saving to database...')
      const savedImage = await saveProfilePicture(file)
      
      console.log('[ProfileUploader] ✓ Save successful:', savedImage)
      setProfileImage(savedImage)
      setDebugInfo(`✓ Saved! ${savedImage.compressedSize} bytes`)
      
      // Verify the save worked by reading back
      try {
        setDebugInfo('Verifying save...')
        const verifyImage = await getProfilePicture()
        
        if (verifyImage && verifyImage.data) {
          console.log('[ProfileUploader] ✓ Verification successful!')
          
          // Switch to base64 data URL (more stable than ObjectURL for long-term display)
          setPreviewUrl(verifyImage.data)
          currentPreviewUrlRef.current = null // Now using base64, no cleanup needed
          
          setDebugInfo(`✓ Verified! Saved as: ${verifyImage.fileName}`)
          
          // Show success message
          setSuccess(true)
          if (successTimeoutRef.current) {
            clearTimeout(successTimeoutRef.current)
          }
          successTimeoutRef.current = setTimeout(() => setSuccess(false), 3000)
          
          // Notify parent with actual data URL
          onImageChange?.(verifyImage.data)
        } else {
          console.warn('[ProfileUploader] ⚠ Verification failed but preview still showing')
          setDebugInfo('⚠ Preview OK, verification pending refresh')
          setSuccess(true)
          setTimeout(() => setSuccess(false), 3000)
        }
      } catch (verifyErr) {
        console.error('[ProfileUploader] Verification error:', verifyErr)
        // Don't fail - save was successful
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      }

    } catch (err) {
      console.error('[ProfileUploader] ✗ Failed to save:', err)
      
      // Provide better error messages based on device type
      let errorMessage: string
      
      if (isMobileDevice) {
        errorMessage = language === 'ar'
          ? `خطأ في الموبايل: ${err}. جرب صورة أصغر أو نوع مختلف`
          : `Mobile error: ${err}. Try a smaller image or different format`
      } else {
        errorMessage = language === 'ar'
          ? `فشل في حفظ الصورة: ${err}`
          : `Failed to save image: ${err}`
      }
      
      setError(errorMessage)
      setDebugInfo(`Error: ${err}`)
      
      // Revert preview on error
      if (profileImage && profileImage.data) {
        setPreviewUrl(profileImage.data)
        currentPreviewUrlRef.current = null
      } else {
        setPreviewUrl(null)
        if (currentPreviewUrlRef.current) {
          revokePreviewUrl(currentPreviewUrlRef.current)
          currentPreviewUrlRef.current = null
        }
      }
    } finally {
      setIsUploading(false)
    }
  }

  // Handle drag events
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    console.log('[ProfileUploader] Files dropped:', files.length)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }, [])

  // Handle file input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
    // Reset input so same file can be selected again
    e.target.value = ''
  }

  // Handle delete
  const handleDelete = async () => {
    if (!profileImage) return

    console.log('[ProfileUploader] Deleting profile picture...')
    setIsDeleting(true)
    setError(null)

    try {
      await deleteProfilePicture()
      
      // Verify deletion
      const checkImage = await getProfilePicture()
      if (!checkImage) {
        console.log('[ProfileUploader] ✓ Delete verified')
        setDebugInfo('✓ Deleted successfully')
      } else {
        console.warn('[ProfileUploader] ⚠ Delete may need refresh')
        setDebugInfo('⚠ Delete may need page refresh')
      }
      
      setProfileImage(null)
      setPreviewUrl(null)
      currentPreviewUrlRef.current = null
      onImageChange?.(null)
    } catch (err) {
      console.error('[ProfileUploader] Failed to delete:', err)
      setError(language === 'ar' 
        ? 'فشل في حذف الصورة'
        : 'Failed to delete image'
      )
      setDebugInfo(`Delete error: ${err}`)
    } finally {
      setIsDeleting(false)
    }
  }

  // Debug helper
  const handleDebug = async () => {
    if (!isBrowser()) return
    
    try {
      const status = await debugStorageStatus()
      const statusText = `
📱 Device: ${status.isMobileDevice ? 'Mobile 📱' : 'Desktop 💻'}
🔗 DB Connected: ${status.dbConnected ? '✓' : '❌'}
❌ Error Count: ${status.errorCount}
💾 IndexedDB: ${status.indexedDB ? '✓ Has data' : 'Empty'}
📦 LocalStorage: ${status.localStorage ? '✓ Has data' : 'Empty'}
🧠 Memory: ${status.memory ? '✓ Has data' : 'Empty'}
`.trim()
      
      setDebugInfo(statusText)
      console.log('[ProfileUploader] Debug info:', status)
    } catch (err) {
      setDebugInfo(`Debug error: ${err}`)
    }
  }

  // Open file picker
  const openFilePicker = () => {
    fileInputRef.current?.click()
  }

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  // Get status message
  const getStatusMessage = (): string => {
    if (isUploading) {
      return language === 'ar' ? 'جارٍ الرفع...' : 'Uploading...'
    }
    if (isDeleting) {
      return language === 'ar' ? 'جارٍ الحذف...' : 'Deleting...'
    }
    return ''
  }

  // ============ RENDER ============
  return (
    <div className={`${className}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleInputChange}
        className="hidden"
        aria-label="Upload profile picture"
      />

      <div className="flex flex-col items-center gap-4">
        {/* Mobile indicator (only in development or when there's an issue) */}
        {isMobileDevice && process.env.NODE_ENV === 'development' && (
          <div className="flex items-center gap-1 text-xs text-purple-400 bg-purple-500/10 px-2 py-1 rounded-full">
            <Smartphone size={12} />
            <span>{language === 'ar' ? 'وضع الموبايل' : 'Mobile Mode'}</span>
          </div>
        )}

        {/* Avatar Container with Upload Zone */}
        <div
          className={`
            relative group cursor-pointer
            ${config.container}
            rounded-2xl overflow-hidden
            transition-all duration-300
            ${isDragging 
              ? 'ring-4 ring-cyan-400 bg-cyan-500/10 scale-105' 
              : 'ring-2 ring-white/20 hover:ring-cyan-400/50'
            }
            ${isUploading || isDeleting ? 'opacity-75 pointer-events-none' : ''}
          `}
          onClick={openFilePicker}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && openFilePicker()}
          aria-label={language === 'ar' ? 'رفع أو تغيير الصورة الشخصية' : 'Upload or change profile picture'}
        >
          {/* Image or Placeholder */}
          {previewUrl ? (
            <>
              <img
                src={previewUrl}
                alt="Profile"
                className={`${config.image} object-cover`}
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                {isUploading ? (
                  <>
                    <Loader2 className={`animate-spin text-white`} size={config.icon} />
                    <span className="text-white text-xs font-medium px-2">
                      {getStatusMessage()}
                    </span>
                  </>
                ) : (
                  <>
                    <Camera size={config.icon} className="text-white" />
                    <span className="text-white text-xs font-medium px-2 text-center">
                      {language === 'ar' ? 'تغيير' : 'Change'}
                    </span>
                  </>
                )}
              </div>

              {/* Full Preview Button */}
              {showPreview && !isUploading && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowFullPreview(true)
                  }}
                  className={`
                    absolute top-1 ${isRTL ? 'left-1' : 'right-1'}
                    p-1.5 bg-black/70 rounded-lg
                    opacity-0 group-hover:opacity-100 transition-opacity
                    hover:bg-black/90
                  `}
                  aria-label={language === 'ar' ? 'معاينة كاملة' : 'Full preview'}
                >
                  <ZoomIn size={14} className="text-white" />
                </button>
              )}
            </>
          ) : (
            /* Empty State */
            <div className={`${config.container} flex flex-col items-center justify-center bg-white/5`}>
              {isUploading ? (
                <Loader2 className={`animate-spin text-cyan-400`} size={config.icon} />
              ) : isDragging ? (
                <Upload size={config.icon} className="text-cyan-400" />
              ) : (
                <User size={config.icon} className="text-gray-400" />
              )}
            </div>
          )}

          {/* Loading Spinner Overlay */}
          {(isUploading || isDeleting) && (
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2 rounded-2xl">
              <Loader2 className="animate-spin text-white" size={config.icon} />
              <span className="text-white text-xs font-medium">
                {getStatusMessage()}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 flex-wrap justify-center">
          {/* Upload Button */}
          <button
            onClick={openFilePicker}
            disabled={isUploading || isDeleting}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm
              transition-all duration-200
              ${isUploading || isDeleting 
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 active:bg-cyan-500/40'
              }
            `}
          >
            {isUploading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                {language === 'ar' ? 'جارٍ الرفع...' : 'Uploading...'}
              </>
            ) : (
              <>
                <Upload size={16} />
                {language === 'ar' ? (previewUrl ? 'تغيير الصورة' : 'رفع صورة') : (previewUrl ? 'Change Photo' : 'Upload Photo')}
              </>
            )}
          </button>

          {/* Delete Button */}
          {profileImage && (
            <button
              onClick={handleDelete}
              disabled={isDeleting || isUploading}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm
                transition-all duration-200
                ${isDeleting 
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                  : 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 active:bg-red-500/40'
                }
              `}
            >
              {isDeleting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {language === 'ar' ? 'جارٍ الحذف...' : 'Deleting...'}
                </>
              ) : (
                <>
                  <Trash2 size={16} />
                  {language === 'ar' ? 'حذف' : 'Delete'}
                </>
              )}
            </button>
          )}

          {/* Debug Button */}
          {(process.env.NODE_ENV === 'development' || error) && (
            <button
              onClick={handleDebug}
              className="
                flex items-center gap-2 px-3 py-2 rounded-xl font-medium text-xs
                bg-purple-500/20 text-purple-400 border border-purple-500/30 
                hover:bg-purple-500/30 transition-all duration-200
              "
            >
              <AlertCircle size={14} />
              {process.env.NODE_ENV === 'development' ? 'Debug' : 'Status'}
            </button>
          )}
        </div>

        {/* Status Messages */}
        {error && (
          <div className="max-w-sm p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center animate-in fade-in">
            <div className="flex items-center justify-center gap-2 mb-1">
              <AlertCircle size={16} />
              <span className="font-medium">{error}</span>
            </div>
            {isMobileDevice && (
              <p className="text-xs mt-1 text-red-400/70 opacity-75">
                {language === 'ar' 
                  ? '💡 نصيحة: جرب صورة أصغر من 5 ميجابايت'
                  : '💡 Tip: Try an image smaller than 5MB'
                }
              </p>
            )}
          </div>
        )}

        {success && (
          <div className="max-w-sm p-3 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm text-center animate-in fade-in slide-in-from-bottom-2">
            ✓ {language === 'ar' ? 'تم حفظ الصورة بنجاح!' : 'Image saved successfully!'}
          </div>
        )}

        {/* Debug Info */}
        {debugInfo && (
          <div className={`max-w-xs p-2 rounded-lg text-xs font-mono text-center break-all whitespace-pre-line ${
            error ? 'bg-red-900/20 border border-red-500/30 text-red-300' :
            success ? 'bg-green-900/20 border border-green-500/30 text-green-300' :
            'bg-slate-800/50 border border-slate-600/30 text-slate-400'
          }`}>
            {debugInfo}
          </div>
        )}

        {/* Image Info */}
        {profileImage && (
          <div className="text-center space-y-1">
            <p className="text-gray-400 text-xs">
              {language === 'ar' ? 'الملف:' : 'File:'} {profileImage.fileName}
            </p>
            <p className="text-gray-500 text-xs">
              {formatFileSize(profileImage.fileSize)} → {formatFileSize(profileImage.compressedSize)}
              {language === 'ar' ? ' (بعد الضغط)' : ' (compressed)'}
            </p>
          </div>
        )}

        {/* Help Text */}
        {!profileImage && (
          <p className="text-gray-500 text-xs text-center max-w-xs">
            {language === 'ar' 
              ? 'اسحب وأفلت صورة هنا أو انقر للاختيار. يدعم JPEG, PNG, GIF, WebP (حد أقصى 10 ميجابايت)'
              : 'Drag & drop or click to select. Supports JPEG, PNG, GIF, WebP (max 10MB)'
            }
          </p>
        )}
      </div>

      {/* Full Preview Modal */}
      {showFullPreview && previewUrl && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowFullPreview(false)}
        >
          <div className="relative max-w-lg w-full">
            {/* Close Button */}
            <button
              onClick={() => setShowFullPreview(false)}
              className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white transition-colors"
              aria-label={language === 'ar' ? 'إغلاق' : 'Close'}
            >
              <X size={24} />
            </button>

            {/* Image */}
            <img
              src={previewUrl}
              alt="Profile full preview"
              className="w-full rounded-2xl shadow-2xl"
            />

            {/* Image Info */}
            {profileImage && (
              <div className="mt-4 text-center text-white/80 text-sm space-y-1">
                <p>{profileImage.fileName}</p>
                <p className="text-white/60 text-xs">
                  {language === 'ar' ? 'تم الرفع في:' : 'Uploaded:'}{' '}
                  {new Date(profileImage.uploadedAt).toLocaleDateString(
                    language === 'ar' ? 'ar-SA' : 'en-US',
                    { year: 'numeric', month: 'long', day: 'numeric' }
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Export hook
export function useProfilePicture() {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadProfilePicture = useCallback(async () => {
    if (!isBrowser()) {
      console.log('[useProfilePicture] Skipping - not in browser (SSR)')
      setIsLoading(false)
      return
    }

    try {
      console.log('[useProfilePicture] Loading profile picture...')
      const pic = await getProfilePicture()
      
      if (pic && pic.data) {
        console.log('[useProfilePicture] ✓ Found profile picture')
        setImageUrl(pic.data)
      } else {
        console.log('[useProfilePicture] No profile picture found')
        setImageUrl(null)
      }
    } catch (err) {
      console.error('[useProfilePicture] Failed to load:', err)
      setImageUrl(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProfilePicture()
  }, [loadProfilePicture])

  return { imageUrl, isLoading, refresh: loadProfilePicture }
}
