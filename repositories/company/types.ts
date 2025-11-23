import type { Company, CreateCompanyDto, CompanyRegistrationData, ValidationResult, UploadLogoResponse } from '~/types/company'
import type { IApiAdapter } from '~/adapters/api/types'

/**
 * Interface pour le repository Company
 * Définit les opérations métier pour le domaine Company
 */
export interface ICompanyRepository {
  /**
   * Crée une nouvelle entreprise
   */
  createCompany(data: CreateCompanyDto): Promise<Company>

  /**
   * Upload le logo d'une entreprise
   */
  uploadLogo(file: File): Promise<UploadLogoResponse>

  /**
   * Valide les données d'inscription d'une entreprise
   */
  validateCompanyData(data: CompanyRegistrationData): ValidationResult
}

/**
 * Dépendances nécessaires pour le repository
 */
export interface CompanyRepositoryDependencies {
  apiAdapter: IApiAdapter
}

