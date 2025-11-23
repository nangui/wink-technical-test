import { http, HttpResponse } from 'msw'
import type { Company, CreateCompanyDto, UploadLogoResponse } from '~/types/company'

// Base de données mockée en mémoire
const companies: Company[] = []

/**
 * Handlers MSW pour les endpoints companies
 */
export const companyHandlers = [
  // Créer une entreprise
  http.post('/api/companies/create', async ({ request }) => {
    const body = await request.json() as CreateCompanyDto

    // Validation côté serveur (mock)
    if (!body.name || body.name.trim().length === 0) {
      return HttpResponse.json(
        { message: 'Le nom de l\'entreprise est requis' },
        { status: 400 }
      )
    }

    if (!body.address || body.address.trim().length === 0) {
      return HttpResponse.json(
        { message: 'L\'adresse est requise' },
        { status: 400 }
      )
    }

    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500))

    // Créer l'entreprise
    const newCompany: Company = {
      id: `company-${Date.now()}`,
      name: body.name.trim(),
      address: body.address.trim(),
      logoUrl: body.logoUrl || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    companies.push(newCompany)

    return HttpResponse.json(newCompany, { status: 201 })
  }),

  // Upload du logo
  http.post('/api/companies/upload-logo', async ({ request }) => {
    const formData = await request.formData()
    const file = formData.get('logo') as File

    if (!file) {
      return HttpResponse.json(
        { message: 'Aucun fichier fourni' },
        { status: 400 }
      )
    }

    // Validation du fichier
    const maxSize = 5 * 1024 * 1024 // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

    if (file.size > maxSize) {
      return HttpResponse.json(
        { message: 'Le fichier est trop volumineux. Taille maximale : 5MB' },
        { status: 400 }
      )
    }

    if (!allowedTypes.includes(file.type)) {
      return HttpResponse.json(
        { message: 'Format de fichier non supporté. Formats acceptés : JPEG, PNG, GIF, WebP' },
        { status: 400 }
      )
    }

    // Simuler un délai d'upload
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Générer une URL mockée pour le logo
    const logoUrl = `https://api.example.com/logos/${Date.now()}-${file.name}`

    const response: UploadLogoResponse = {
      url: logoUrl,
    }

    return HttpResponse.json(response, { status: 200 })
  }),
]

