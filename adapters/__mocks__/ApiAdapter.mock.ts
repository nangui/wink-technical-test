import type { IApiAdapter, RequestOptions, UploadOptions } from '../api/types'

/**
 * Mock de l'adapter API pour les tests
 */
export class MockApiAdapter implements IApiAdapter {
  private mockResponses: Map<string, unknown> = new Map()

  async get<T>(_url: string, _options?: RequestOptions): Promise<T> {
    return Promise.resolve({} as T)
  }

  async post<T>(_url: string, _data?: unknown, _options?: RequestOptions): Promise<T> {
    return Promise.resolve({} as T)
  }

  async put<T>(_url: string, _data?: unknown, _options?: RequestOptions): Promise<T> {
    return Promise.resolve({} as T)
  }

  async delete<T>(_url: string, _options?: RequestOptions): Promise<T> {
    return Promise.resolve({} as T)
  }

  async upload<T>(_url: string, _file: File, _options?: UploadOptions): Promise<T> {
    return Promise.resolve({} as T)
  }

  /**
   * Méthode utilitaire pour définir des réponses mockées
   */
  setMockResponse(url: string, response: unknown): void {
    this.mockResponses.set(url, response)
  }

  /**
   * Méthode utilitaire pour obtenir une réponse mockée
   */
  getMockResponse<T>(url: string): T | undefined {
    return this.mockResponses.get(url) as T | undefined
  }
}

