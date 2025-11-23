/**
 * Types globaux pour le domaine Company
 */
export interface Company {
  id: string
  name: string
  address: string
  logoUrl: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateCompanyDto {
  name: string
  address: string
  logoUrl?: string | null
}

export interface CompanyRegistrationData {
  name: string
  address: string
  logo: File | null
}

export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

export interface UploadLogoResponse {
  url: string
}

