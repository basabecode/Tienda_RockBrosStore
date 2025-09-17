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
    return !error && Array.isArray(data)
  } catch (error) {
    console.warn('Storage no está disponible:', error)
    return false
  }
}

// Función para crear el bucket si no existe (solo si Storage está habilitado)
export async function ensureBucketExists() {
  try {
    const storageAvailable = await isStorageAvailable()
    if (!storageAvailable) {
      console.warn('⚠️ Supabase Storage no está habilitado. Usando URLs externas.')
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
        console.error('Error creating bucket:', error)
        return false
      }
    }

    return true
  } catch (error) {
    console.error('Error checking bucket:', error)
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

// Función para subir una imagen
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

    // Asegurar que el bucket existe
    const bucketReady = await ensureBucketExists()
    if (!bucketReady) {
      return { url: '', path: '', error: 'Error configurando almacenamiento' }
    }

    // Generar nombre único
    const filename = generateUniqueFilename(file.name)
    const filePath = `${folder}/${filename}`

    // Subir archivo
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      console.error('Upload error:', error)
      return { url: '', path: '', error: error.message }
    }

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath)

    return {
      url: urlData.publicUrl,
      path: filePath,
    }
  } catch (error) {
    console.error('Unexpected upload error:', error)
    return {
      url: '',
      path: '',
      error: error instanceof Error ? error.message : 'Error desconocido',
    }
  }
}

// Función para subir múltiples imágenes
export async function uploadMultipleImages(
  files: File[],
  folder = 'products'
): Promise<ImageUploadResult[]> {
  const uploadPromises = files.map(file => uploadImage(file, folder))
  return Promise.all(uploadPromises)
}

// Función para eliminar imagen
export async function deleteImage(filePath: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([filePath])

    if (error) {
      console.error('Delete image error:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Unexpected delete error:', error)
    return false
  }
}

// Hook personalizado para manejo de imágenes
import { useState } from 'react'

export function useImageUpload() {
  const [uploading, setUploading] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<ImageUploadResult[]>([])

  const uploadImages = async (files: File[]): Promise<ImageUploadResult[]> => {
    setUploading(true)

    try {
      const results = await uploadMultipleImages(files)
      setUploadedImages(prev => [...prev, ...results])
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
  }
}
