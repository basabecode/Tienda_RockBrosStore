import { supabase } from './supabase'

// Tipos para el manejo de imágenes
export interface ImageUploadResult {
  url: string
  path: string
  error?: string
}

// Configuración para subida de imágenes
const STORAGE_BUCKET = 'product-images'
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

// Función para verificar si Storage está disponible
export async function isStorageAvailable(): Promise<boolean> {
  try {
    const { data, error } = await supabase.storage.listBuckets()
    return !error && Array.isArray(data) && data.length >= 0
  } catch (error) {
    console.warn('⚠️ Storage no está disponible:', error)
    return false
  }
}

// Función para convertir File a Base64
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}

// Función para crear el bucket si no existe (solo si Storage está habilitado)
export async function ensureBucketExists(): Promise<boolean> {
  try {
    const storageAvailable = await isStorageAvailable()
    if (!storageAvailable) {
      console.warn(
        '⚠️ Supabase Storage no está habilitado. Usando fallback a Base64.'
      )
      return false
    }

    const { data: buckets } = await supabase.storage.listBuckets()
    const bucketExists = buckets?.some(bucket => bucket.name === STORAGE_BUCKET)

    if (!bucketExists) {
      const { error } = await supabase.storage.createBucket(STORAGE_BUCKET, {
        public: true,
        allowedMimeTypes: ALLOWED_TYPES,
        fileSizeLimit: MAX_FILE_SIZE,
      })

      if (error) {
        console.error('❌ Error creando bucket:', error)
        return false
      }

      console.log('✅ Bucket creado exitosamente')
    }

    return true
  } catch (error) {
    console.error('❌ Error verificando bucket:', error)
    return false
  }
}

// Función para validar archivo
export function validateImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Tipo de archivo no permitido. Solo se permiten: JPG, PNG, WebP'
  }

  if (file.size > MAX_FILE_SIZE) {
    return 'El archivo es demasiado grande. Máximo 5MB'
  }

  return null
}

// Función para generar nombre único de archivo
export function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const extension = originalName.split('.').pop()
  return `${timestamp}_${randomString}.${extension}`
}

// Función principal para subir una imagen con fallback
export async function uploadImage(
  file: File,
  folder = 'products'
): Promise<ImageUploadResult> {
  try {
    // Validar archivo
    const validationError = validateImageFile(file)
    if (validationError) {
      return { url: '', path: '', error: validationError }
    }

    // Verificar si Storage está disponible
    const bucketReady = await ensureBucketExists()

    if (bucketReady) {
      // Usar Supabase Storage (método preferido)
      return await uploadToSupabaseStorage(file, folder)
    } else {
      // Usar fallback a Base64
      return await uploadAsBase64(file, folder)
    }
  } catch (error) {
    console.error('❌ Error inesperado en upload:', error)
    return {
      url: '',
      path: '',
      error: error instanceof Error ? error.message : 'Error desconocido',
    }
  }
}

// Función para subir a Supabase Storage
async function uploadToSupabaseStorage(
  file: File,
  folder: string
): Promise<ImageUploadResult> {
  try {
    // Generar nombre único
    const filename = generateUniqueFilename(file.name)
    const filePath = `${folder}/${filename}`

    console.log('📤 Subiendo a Supabase Storage:', filePath)

    // Subir archivo
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      console.error('❌ Error en upload Storage:', error)
      return { url: '', path: '', error: error.message }
    }

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath)

    console.log('✅ Imagen subida exitosamente a Storage')
    return {
      url: urlData.publicUrl,
      path: filePath,
    }
  } catch (error) {
    console.error('❌ Error en uploadToSupabaseStorage:', error)
    return {
      url: '',
      path: '',
      error: error instanceof Error ? error.message : 'Error en Storage',
    }
  }
}

// Función para usar Base64 como fallback
async function uploadAsBase64(
  file: File,
  folder: string
): Promise<ImageUploadResult> {
  try {
    console.log('🔄 Usando Base64 como fallback para:', file.name)

    // Convertir a Base64
    const base64String = await fileToBase64(file)

    // Generar un path simulado para consistencia
    const filename = generateUniqueFilename(file.name)
    const simulatedPath = `${folder}/${filename}`

    console.log('✅ Imagen convertida a Base64 exitosamente')

    return {
      url: base64String,
      path: simulatedPath, // Path simulado para consistencia
    }
  } catch (error) {
    console.error('❌ Error convirtiendo a Base64:', error)
    return {
      url: '',
      path: '',
      error: 'Error convirtiendo imagen a Base64',
    }
  }
}

// Función para subir múltiples imágenes
export async function uploadMultipleImages(
  files: File[],
  folder = 'products'
): Promise<ImageUploadResult[]> {
  console.log(`📤 Subiendo ${files.length} imágenes...`)
  const uploadPromises = files.map(file => uploadImage(file, folder))
  return Promise.all(uploadPromises)
}

// Función para eliminar imagen
export async function deleteImage(filePath: string): Promise<boolean> {
  try {
    // Solo intentar eliminar si es de Supabase Storage (no Base64)
    if (filePath.includes('data:image')) {
      console.log('ℹ️ Imagen Base64 - no requiere eliminación del servidor')
      return true
    }

    const storageAvailable = await isStorageAvailable()
    if (!storageAvailable) {
      console.log('ℹ️ Storage no disponible - eliminación omitida')
      return true
    }

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([filePath])

    if (error) {
      console.error('❌ Error eliminando imagen:', error)
      return false
    }

    console.log('✅ Imagen eliminada exitosamente')
    return true
  } catch (error) {
    console.error('❌ Error inesperado eliminando imagen:', error)
    return false
  }
}

// Hook personalizado para manejo de imágenes
import { useState } from 'react'

export function useImageUpload() {
  const [uploading, setUploading] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<ImageUploadResult[]>([])
  const [storageStatus, setStorageStatus] = useState<
    'checking' | 'available' | 'unavailable'
  >('checking')

  // Verificar Storage al inicializar
  const checkStorageStatus = async () => {
    setStorageStatus('checking')
    const available = await isStorageAvailable()
    setStorageStatus(available ? 'available' : 'unavailable')
  }

  const uploadImages = async (files: File[]): Promise<ImageUploadResult[]> => {
    setUploading(true)

    try {
      const results = await uploadMultipleImages(files)
      const successfulUploads = results.filter(result => !result.error)

      setUploadedImages(prev => [...prev, ...successfulUploads])

      // Mostrar estado de Storage si es la primera vez
      if (storageStatus === 'checking') {
        await checkStorageStatus()
      }

      return results
    } finally {
      setUploading(false)
    }
  }

  const removeImage = async (index: number) => {
    const imageToRemove = uploadedImages[index]
    if (imageToRemove?.path) {
      await deleteImage(imageToRemove.path)
    }

    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  const clearImages = () => {
    setUploadedImages([])
  }

  return {
    uploading,
    uploadedImages,
    uploadImages,
    removeImage,
    clearImages,
    storageStatus,
    checkStorageStatus,
  }
}
