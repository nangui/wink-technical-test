import type { IApiAdapter, RequestOptions, UploadOptions } from './types'

/**
 * Implémentation concrète de l'adapter API
 * Utilise $fetch de Nuxt pour les requêtes HTTP
 */
export class ApiAdapter implements IApiAdapter {
  private baseUrl: string

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl
  }

  async get<T>(url: string, options?: RequestOptions): Promise<T> {
    try {
      const fullUrl = this.buildUrl(url, options?.params)
      return await $fetch<T>(fullUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        signal: options?.signal,
      })
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async post<T>(url: string, data?: unknown, options?: RequestOptions): Promise<T> {
    try {
      const fullUrl = this.buildUrl(url, options?.params)
      return await $fetch<T>(fullUrl, {
        method: 'POST',
        body: data as Record<string, unknown>,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        signal: options?.signal,
      })
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async put<T>(url: string, data?: unknown, options?: RequestOptions): Promise<T> {
    try {
      const fullUrl = this.buildUrl(url, options?.params)
      return await $fetch<T>(fullUrl, {
        method: 'PUT',
        body: data as Record<string, unknown>,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        signal: options?.signal,
      })
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async delete<T>(url: string, options?: RequestOptions): Promise<T> {
    try {
      const fullUrl = this.buildUrl(url, options?.params)
      return await $fetch<T>(fullUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        signal: options?.signal,
      })
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async upload<T>(url: string, file: File, options?: UploadOptions): Promise<T> {
    try {
      const fullUrl = this.buildUrl(url)
      const formData = new FormData()
      formData.append(options?.fieldName || 'file', file)

      if (options?.additionalData) {
        Object.entries(options.additionalData).forEach(([key, value]) => {
          formData.append(key, value)
        })
      }

      return await $fetch<T>(fullUrl, {
        method: 'POST',
        body: formData,
        headers: {
          ...options?.headers,
        },
      })
    } catch (error) {
      throw this.handleError(error)
    }
  }

  private buildUrl(url: string, params?: Record<string, string | number | boolean>): string {
    const fullUrl = this.baseUrl ? `${this.baseUrl}${url}` : url

    if (!params || Object.keys(params).length === 0) {
      return fullUrl
    }

    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value))
    })

    return `${fullUrl}?${searchParams.toString()}`
  }

  private handleError(error: unknown): Error {
    if (error instanceof Error) {
      return error
    }

    if (typeof error === 'object' && error !== null && 'data' in error) {
      const errorData = error.data as { message?: string }
      return new Error(errorData.message || 'Une erreur est survenue')
    }

    return new Error('Une erreur inattendue est survenue')
  }
}

