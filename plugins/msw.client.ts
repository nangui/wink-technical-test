import { setupWorker } from 'msw/browser'
import { handlers } from '~/mocks/handlers'

/**
 * Plugin MSW pour le client
 * Configure Mock Service Worker pour intercepter les requêtes HTTP
 */
export default defineNuxtPlugin(async () => {
  // Vérifier si on est dans le navigateur
  if (import.meta.server) {
    return
  }

  // Vérifier si MSW est déjà initialisé
  if (typeof window !== 'undefined' && (window as unknown as { __MSW_INSTALLED__: boolean }).__MSW_INSTALLED__) {
    return
  }

  try {
    // Créer le worker MSW
    const worker = setupWorker(...handlers)

    // Démarrer le worker
    await worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
    })

    // Marquer comme installé
    if (typeof window !== 'undefined') {
      (window as unknown as { __MSW_INSTALLED__: boolean }).__MSW_INSTALLED__ = true
    }

    console.log('[MSW] Mock Service Worker démarré avec succès')
  } catch (error) {
    console.error('[MSW] Erreur lors du démarrage de Mock Service Worker:', error)
  }
})

