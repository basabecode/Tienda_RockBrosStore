import { supabase } from '../supabase'

// Servicio para manejo de archivos e imágenes
export class StorageService {
  private static bucketName = 'product-images'

  // Subir imagen de producto
  static async uploadProductImage(
    file: File,
    path?: string
  ): Promise<{ url: string; path: string }> {
    // Generar nombre único si no se proporciona path
    const fileName = path || `${Date.now()}-${file.name}`
    const filePath = `products/${fileName}`

    const { data, error } = await supabase.storage
      .from(this.bucketName)
      .upload(filePath, file, {
        upsert: false,
        cacheControl: '3600',
      })

    if (error) {
      throw new Error(`Error uploading image: ${error.message}`)
    }

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from(this.bucketName)
      .getPublicUrl(data.path)

    return {
      url: urlData.publicUrl,
      path: data.path,
    }
  }

  // Subir múltiples imágenes
  static async uploadProductImages(
    files: File[]
  ): Promise<Array<{ url: string; path: string }>> {
    const uploads = files.map(file => this.uploadProductImage(file))
    return Promise.all(uploads)
  }

  // Eliminar imagen
  static async deleteImage(path: string): Promise<void> {
    const { error } = await supabase.storage
      .from(this.bucketName)
      .remove([path])

    if (error) {
      throw new Error(`Error deleting image: ${error.message}`)
    }
  }

  // Eliminar múltiples imágenes
  static async deleteImages(paths: string[]): Promise<void> {
    const { error } = await supabase.storage.from(this.bucketName).remove(paths)

    if (error) {
      throw new Error(`Error deleting images: ${error.message}`)
    }
  }

  // Obtener URL pública de una imagen
  static getPublicUrl(path: string): string {
    const { data } = supabase.storage.from(this.bucketName).getPublicUrl(path)

    return data.publicUrl
  }

  // Listar archivos en un directorio
  static async listFiles(
    path = ''
  ): Promise<
    Array<{
      name: string
      id: string
      updated_at: string
      created_at: string
      last_accessed_at: string
      metadata: Record<string, unknown>
    }>
  > {
    const { data, error } = await supabase.storage
      .from(this.bucketName)
      .list(path)

    if (error) {
      throw new Error(`Error listing files: ${error.message}`)
    }

    return data || []
  }

  // Validar tipo de archivo
  static validateImageFile(file: File): { valid: boolean; error?: string } {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error:
          'Tipo de archivo no permitido. Solo se permiten: JPEG, PNG, WebP',
      }
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'El archivo es demasiado grande. Máximo 5MB',
      }
    }

    return { valid: true }
  }

  // Redimensionar imagen (usando canvas)
  static async resizeImage(
    file: File,
    maxWidth: number,
    maxHeight: number,
    quality = 0.8
  ): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        // Calcular nuevas dimensiones manteniendo proporción
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

        canvas.width = width
        canvas.height = height

        // Dibujar imagen redimensionada
        ctx?.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          blob => {
            if (blob) {
              const resizedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              })
              resolve(resizedFile)
            } else {
              reject(new Error('Error al redimensionar imagen'))
            }
          },
          file.type,
          quality
        )
      }

      img.onerror = () => reject(new Error('Error al cargar imagen'))
      img.src = URL.createObjectURL(file)
    })
  }
}
