import { CompanyRepository } from '~/repositories/company/CompanyRepository'
import type { ICompanyRepository } from '~/repositories/company/types'
import type { IApiAdapter } from '~/adapters/api/types'

/**
 * Composable pour accéder au CompanyRepository
 * Wrapper Nuxt qui injecte les dépendances nécessaires
 */
export function useCompanyRepository(): ICompanyRepository {
  const nuxtApp = useNuxtApp()

  // Récupérer l'adapter injecté par le plugin
  const apiAdapter = nuxtApp.$apiAdapter as IApiAdapter

  if (!apiAdapter) {
    throw new Error('ApiAdapter n\'est pas disponible. Vérifiez que le plugin adapters.provider.ts est bien chargé.')
  }

  // Créer et retourner une instance du repository avec les dépendances injectées
  return new CompanyRepository({ apiAdapter })
}

