import { ApiAdapter } from '~/adapters/api/ApiAdapter'
import type { IApiAdapter } from '~/adapters/api/types'

/**
 * Plugin pour injecter les adapters dans l'application
 * Utilise nuxtApp.provide() pour rendre les adapters disponibles partout
 */
export default defineNuxtPlugin(() => {
  const nuxtApp = useNuxtApp()

  // Créer l'instance de l'adapter API
  const apiAdapter: IApiAdapter = new ApiAdapter()

  // Provide l'adapter pour qu'il soit accessible via inject()
  nuxtApp.provide('apiAdapter', apiAdapter)
})

