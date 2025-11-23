/**
 * Interface pour l'adapter API
 * Définit le contrat pour toutes les opérations API
 */
export interface IApiAdapter {
  /**
   * Effectue une requête GET
   */
  get<T>(url: string, options?: RequestOptions): Promise<T>

  /**
   * Effectue une requête POST
   */
  post<T>(url: string, data?: unknown, options?: RequestOptions): Promise<T>

  /**
   * Effectue une requête PUT
   */
  put<T>(url: string, data?: unknown, options?: RequestOptions): Promise<T>

  /**
   * Effectue une requête DELETE
   */
  delete<T>(url: string, options?: RequestOptions): Promise<T>

  /**
   * Upload un fichier
   */
  upload<T>(url: string, file: File, options?: UploadOptions): Promise<T>
}

export interface RequestOptions {
  headers?: Record<string, string>
  params?: Record<string, string | number | boolean>
  signal?: AbortSignal
}

export interface UploadOptions {
  fieldName?: string
  additionalData?: Record<string, string>
  headers?: Record<string, string>
  onUploadProgress?: (progress: number) => void
}

