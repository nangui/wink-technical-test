import type { IApiAdapter } from '~/adapters/api/types'

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthUser {
  id: string
  email: string
  name?: string
}

export interface AuthState {
  isAuthenticated: boolean
  user: AuthUser | null
}

/**
 * Composable pour gérer l'authentification
 */
export function useAuth() {
  const auth = useState<AuthState>('auth', () => ({
    isAuthenticated: false,
    user: null,
  }))

  const { $apiAdapter } = useNuxtApp()

  /**
   * Connecte un utilisateur
   */
  const login = async (credentials: LoginCredentials): Promise<void> => {
    const apiAdapter = $apiAdapter as IApiAdapter
    const response = await apiAdapter.post<{ user: AuthUser; token?: string }>('/api/auth/login', credentials)

    if (!response.user) {
      throw new Error('Réponse invalide du serveur')
    }

    auth.value.isAuthenticated = true
    auth.value.user = response.user

    // Stocker le token si présent
    if (response.token && import.meta.client) {
      localStorage.setItem('auth_token', response.token)
    }
  }

  /**
   * Déconnecte l'utilisateur
   */
  const logout = () => {
    auth.value.isAuthenticated = false
    auth.value.user = null

    if (import.meta.client) {
      localStorage.removeItem('auth_token')
    }
  }

  /**
   * Vérifie si l'utilisateur est connecté
   */
  const isAuthenticated = computed(() => auth.value.isAuthenticated)

  /**
   * Retourne l'utilisateur actuel
   */
  const user = computed(() => auth.value.user)

  return {
    auth: readonly(auth),
    login,
    logout,
    isAuthenticated,
    user,
  }
}

