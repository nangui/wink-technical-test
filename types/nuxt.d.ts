import type { IApiAdapter } from '~/adapters/api/types'

/**
 * Déclarations de types pour Nuxt App
 * Étend les types de nuxtApp pour inclure nos injections
 */
declare module '#app' {
  interface NuxtApp {
    $apiAdapter: IApiAdapter
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $apiAdapter: IApiAdapter
  }
}

export {}

