import { http, HttpResponse } from 'msw'

// Base de données mockée en mémoire pour les utilisateurs
// En production, cela serait dans une vraie base de données
const users = [
  {
    id: 'user-1',
    email: 'demo@example.com',
    password: 'demo123', // En production, ce serait un hash
    name: 'Utilisateur Demo',
  },
]

/**
 * Handlers MSW pour les endpoints d'authentification
 */
export const authHandlers = [
  // Connexion
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json() as { email: string; password: string }

    // Validation
    if (!body.email || !body.password) {
      return HttpResponse.json(
        { message: 'L\'email et le mot de passe sont requis' },
        { status: 400 }
      )
    }

    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 800))

    // Rechercher l'utilisateur
    const user = users.find(u => u.email === body.email && u.password === body.password)

    if (!user) {
      return HttpResponse.json(
        { message: 'Email ou mot de passe incorrect' },
        { status: 401 }
      )
    }

    // Retourner l'utilisateur (sans le mot de passe)
    const { password, ...userWithoutPassword } = user

    return HttpResponse.json({
      user: userWithoutPassword,
      token: `mock-token-${user.id}-${Date.now()}`,
    })
  }),
]

