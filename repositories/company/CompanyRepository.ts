import type { ICompanyRepository, CompanyRepositoryDependencies } from './types'
import type { Company, CreateCompanyDto, CompanyRegistrationData, ValidationResult, UploadLogoResponse } from '~/types/company'

/**
 * Repository pour la logique métier Company
 * Encapsule toute la logique métier liée aux entreprises
 */
export class CompanyRepository implements ICompanyRepository {
  constructor(private dependencies: CompanyRepositoryDependencies) {}

  async createCompany(data: CreateCompanyDto): Promise<Company> {
    // Validation métier avant création
    if (!data.name || data.name.trim().length === 0) {
      throw new Error('Le nom de l\'entreprise est requis')
    }

    if (data.name.length < 2) {
      throw new Error('Le nom de l\'entreprise doit contenir au moins 2 caractères')
    }

    if (!data.address || data.address.trim().length === 0) {
      throw new Error('L\'adresse est requise')
    }

    if (data.address.length < 5) {
      throw new Error('L\'adresse doit contenir au moins 5 caractères')
    }

    // Appel API via l'adapter
    return await this.dependencies.apiAdapter.post<Company>('/api/companies/create', data)
  }

  async uploadLogo(file: File): Promise<UploadLogoResponse> {
    // Validation du fichier
    const maxSize = 5 * 1024 * 1024 // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

    if (file.size > maxSize) {
      throw new Error('Le fichier est trop volumineux. Taille maximale : 5MB')
    }

    if (!allowedTypes.includes(file.type)) {
      throw new Error('Format de fichier non supporté. Formats acceptés : JPEG, PNG, GIF, WebP')
    }

    // Upload via l'adapter
    return await this.dependencies.apiAdapter.upload<UploadLogoResponse>(
      '/api/companies/upload-logo',
      file,
      {
        fieldName: 'logo',
      }
    )
  }

  validateCompanyData(data: CompanyRegistrationData): ValidationResult {
    const errors: Record<string, string> = {}

    // Validation du nom
    if (!data.name || data.name.trim().length === 0) {
      errors.name = 'Le nom de l\'entreprise est requis'
    } else if (data.name.length < 2) {
      errors.name = 'Le nom de l\'entreprise doit contenir au moins 2 caractères'
    } else if (data.name.length > 100) {
      errors.name = 'Le nom de l\'entreprise ne peut pas dépasser 100 caractères'
    }

    // Validation de l'adresse
    if (!data.address || data.address.trim().length === 0) {
      errors.address = 'L\'adresse est requise'
    } else if (data.address.length < 5) {
      errors.address = 'L\'adresse doit contenir au moins 5 caractères'
    } else if (data.address.length > 500) {
      errors.address = 'L\'adresse ne peut pas dépasser 500 caractères'
    }

    // Validation du logo (optionnel mais si présent, doit être valide)
    if (data.logo) {
      const maxSize = 5 * 1024 * 1024 // 5MB
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

      if (data.logo.size > maxSize) {
        errors.logo = 'Le fichier est trop volumineux. Taille maximale : 5MB'
      } else if (!allowedTypes.includes(data.logo.type)) {
        errors.logo = 'Format de fichier non supporté. Formats acceptés : JPEG, PNG, GIF, WebP'
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    }
  }
}

