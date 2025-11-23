import { useAuth } from "~/composables/auth/useAuth"

/**
 * Middleware d'authentification
 * Redirige vers /login si l'utilisateur n'est pas connecté
 */
export default defineNuxtRouteMiddleware((to) => {
  // Vérifier si on est sur une route publique
  const publicRoutes = ['/login', '/welcome']
  const isPublicRoute = publicRoutes.some(route => to.path.startsWith(route))

  if (isPublicRoute) {
    return
  }

  // Vérifier l'état d'authentification
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }
})

