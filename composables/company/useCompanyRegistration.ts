import { reactive, readonly, computed } from 'vue'
import { useCompanyRepository } from '~/composables/repositories/useCompanyRepository'
import type { Company, CompanyRegistrationData } from '~/types/company'

/**
 * ViewModel pour le formulaire d'inscription d'entreprise
 * Gère l'état et la logique de présentation
 */
export function useCompanyRegistration() {
  const companyRepository = useCompanyRepository()

  // État réactif du formulaire
  const state = reactive({
    name: '',
    address: '',
    logo: null as File | null,
    logoPreview: null as string | null,
    isLoading: false,
    error: null as string | null,
    validationErrors: {} as Record<string, string>,
  })

  // Computed pour vérifier si le formulaire peut être soumis
  const canSubmit = computed(() => {
    return (
      state.name.trim().length > 0 &&
      state.address.trim().length > 0 &&
      !state.isLoading &&
      Object.keys(state.validationErrors).length === 0
    )
  })

  /**
   * Valide le formulaire en temps réel
   */
  const validateForm = (): boolean => {
    const data: CompanyRegistrationData = {
      name: state.name,
      address: state.address,
      logo: state.logo,
    }

    const validation = companyRepository.validateCompanyData(data)
    state.validationErrors = validation.errors

    return validation.isValid
  }

  /**
   * Met à jour le nom de l'entreprise
   */
  const setName = (name: string) => {
    state.name = name
    // Validation en temps réel
    if (state.name.trim().length > 0) {
      validateForm()
    } else {
      state.validationErrors = {}
    }
  }

  /**
   * Met à jour l'adresse
   */
  const setAddress = (address: string) => {
    state.address = address
    // Validation en temps réel
    if (state.address.trim().length > 0) {
      validateForm()
    } else {
      state.validationErrors = {}
    }
  }

  /**
   * Met à jour le logo avec preview
   */
  const setLogo = (file: File | null) => {
    state.logo = file

    // Créer une preview si un fichier est sélectionné
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        state.logoPreview = e.target?.result as string
      }
      reader.readAsDataURL(file)
    } else {
      state.logoPreview = null
    }

    // Validation en temps réel
    if (file) {
      validateForm()
    } else {
      // Supprimer l'erreur de logo si aucun fichier
      const { logo, ...rest } = state.validationErrors
      state.validationErrors = rest
    }
  }

  /**
   * Enregistre l'entreprise
   */
  const registerCompany = async (): Promise<Company> => {
    // Réinitialiser les erreurs
    state.error = null
    state.validationErrors = {}

    // Valider avant soumission
    if (!validateForm()) {
      throw new Error('Le formulaire contient des erreurs')
    }

    state.isLoading = true

    try {
      // Upload du logo si présent
      let logoUrl: string | null = null
      if (state.logo) {
        const uploadResult = await companyRepository.uploadLogo(state.logo)
        logoUrl = uploadResult.url
      }

      // Créer l'entreprise
      const company = await companyRepository.createCompany({
        name: state.name.trim(),
        address: state.address.trim(),
        logoUrl,
      })

      return company
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'inscription'
      state.error = errorMessage
      throw error
    } finally {
      state.isLoading = false
    }
  }

  /**
   * Réinitialise le formulaire
   */
  const resetForm = () => {
    state.name = ''
    state.address = ''
    state.logo = null
    state.logoPreview = null
    state.error = null
    state.validationErrors = {}
  }

  /**
   * Obtient le message d'erreur pour un champ spécifique
   */
  const getFieldError = (fieldName: string): string | undefined => {
    return state.validationErrors[fieldName]
  }

  return {
    // État en lecture seule pour éviter les modifications directes
    state: readonly(state),
    // Computed
    canSubmit,
    // Méthodes
    setName,
    setAddress,
    setLogo,
    registerCompany,
    resetForm,
    validateForm,
    getFieldError,
  }
}

