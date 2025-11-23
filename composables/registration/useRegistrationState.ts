import { readonly } from 'vue'

export interface PersonalDetails {
  firstname: string
  lastname: string
  email: string
  profil_photo: File | null
  profil_photo_preview?: string | null
}

export interface WorkspaceDetails {
  logo: File | null
  logo_preview?: string | null
  name: string
  description: string
  website: string
  address: string
  sector: string
}

export interface AboutYouDetails {
  description: string
  sector: string
  size: string
}

export interface RegistrationState {
  personalDetails?: PersonalDetails
  workspace?: WorkspaceDetails
  aboutYou?: AboutYouDetails
}

const STORAGE_KEY = 'wink_registration_data'

/**
 * Convertit un File en base64 pour la sauvegarde
 */
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Convertit un base64 en File
 */
async function base64ToFile(base64: string, filename: string): Promise<File> {
  const response = await fetch(base64)
  const blob = await response.blob()
  // Détecter le type MIME depuis le base64
  const mimeType = base64.match(/data:([^;]+);/)?.[1] || blob.type || 'image/jpeg'
  return new File([blob], filename, { type: mimeType })
}

/**
 * Sauvegarde l'état dans localStorage
 */
async function saveToLocalStorage(state: RegistrationState) {
  if (!import.meta.client) return

  try {
    const serializableState: Record<string, unknown> = JSON.parse(JSON.stringify(state))
    const finalState: RegistrationState = { ...serializableState } as RegistrationState

    // Traiter les fichiers séparément et les convertir en base64
    if (state.personalDetails?.profil_photo instanceof File) {
      const base64 = await fileToBase64(state.personalDetails.profil_photo)
      finalState.personalDetails = {
        ...state.personalDetails,
        profil_photo_preview: base64,
        profil_photo: null,
      }
    } else if (finalState.personalDetails && typeof finalState.personalDetails === 'object') {
      // Conserver la preview si elle existe déjà
      finalState.personalDetails = {
        ...finalState.personalDetails,
        profil_photo: null,
      } as PersonalDetails
    }

    if (state.workspace?.logo instanceof File) {
      const base64 = await fileToBase64(state.workspace.logo)
      finalState.workspace = {
        ...state.workspace,
        logo_preview: base64,
        logo: null,
      }
    } else if (finalState.workspace && typeof finalState.workspace === 'object') {
      // Conserver la preview si elle existe déjà
      finalState.workspace = {
        ...finalState.workspace,
        logo: null,
      } as WorkspaceDetails
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(finalState))
  } catch (error) {
    console.error('Erreur lors de la sauvegarde dans localStorage:', error)
  }
}

/**
 * Charge l'état depuis localStorage
 */
function loadFromLocalStorage(): RegistrationState | null {
  if (import.meta.client) {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored) as RegistrationState
      }
    } catch (error) {
      console.error('Erreur lors du chargement depuis localStorage:', error)
    }
  }
  return null
}

/**
 * Composable pour gérer l'état de registration avec cache automatique
 */
export function useRegistrationState() {
  // Utiliser useState de Nuxt pour le state réactif
  const registrationData = useState<RegistrationState>('registration', () => {
    // Charger depuis localStorage au démarrage
    const stored = loadFromLocalStorage()
    return stored || {}
  })

  /**
   * Sauvegarde une section spécifique
   */
  const saveSection = async (section: keyof RegistrationState, data: PersonalDetails | WorkspaceDetails | AboutYouDetails) => {
    registrationData.value = {
      ...registrationData.value,
      [section]: { ...data },
    }
    await saveToLocalStorage(registrationData.value)
  }

  /**
   * Charge une section spécifique
   */
  const loadSection = <T extends keyof RegistrationState>(section: T): RegistrationState[T] | undefined => {
    return registrationData.value[section]
  }

  /**
   * Restaure les données dans un formState
   */
  const restoreToFormState = async (
    section: keyof RegistrationState,
    formState: Record<string, unknown>
  ) => {
    const saved = loadSection(section)
    if (saved) {
      const savedData = saved as unknown as Record<string, unknown>
      
      // Restaurer les champs simples
      Object.keys(savedData).forEach((key) => {
        if (key !== 'profil_photo' && key !== 'logo' && key !== 'profil_photo_preview' && key !== 'logo_preview') {
          if (key in formState) {
            formState[key] = savedData[key]
          }
        }
      })

      // Restaurer les fichiers depuis les previews si disponibles
      // Ne restaurer que si le fichier n'est pas déjà présent
      if (!formState.profil_photo && 'profil_photo_preview' in savedData && savedData.profil_photo_preview && typeof savedData.profil_photo_preview === 'string') {
        try {
          // Détecter l'extension depuis le type MIME
          const mimeMatch = savedData.profil_photo_preview.match(/data:image\/([^;]+);/)
          const extension = mimeMatch?.[1] === 'png' ? 'png' : 'jpg'
          const filename = `profil_photo.${extension}`
          
          const file = await base64ToFile(
            savedData.profil_photo_preview,
            filename
          )
          formState.profil_photo = file
        } catch (error) {
          console.error('Erreur lors de la restauration de la photo de profil:', error)
        }
      }

      if (!formState.logo && 'logo_preview' in savedData && savedData.logo_preview && typeof savedData.logo_preview === 'string') {
        try {
          // Détecter l'extension depuis le type MIME
          const mimeMatch = savedData.logo_preview.match(/data:image\/([^;]+);/)
          const extension = mimeMatch?.[1] === 'png' ? 'png' : 'jpg'
          const filename = `logo.${extension}`
          
          const file = await base64ToFile(
            savedData.logo_preview,
            filename
          )
          formState.logo = file
        } catch (error) {
          console.error('Erreur lors de la restauration du logo:', error)
        }
      }
    }
  }

  /**
   * Réinitialise toutes les données
   */
  const clearRegistration = () => {
    registrationData.value = {}
    if (import.meta.client) {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  /**
   * Restaure un fichier depuis une preview base64
   */
  const restoreFileFromPreview = async (preview: string, filename: string): Promise<File | null> => {
    if (!preview || typeof preview !== 'string') {
      return null
    }
    try {
      return await base64ToFile(preview, filename)
    } catch (error) {
      console.error('Erreur lors de la restauration du fichier depuis la preview:', error)
      return null
    }
  }

  return {
    registrationData: readonly(registrationData),
    saveSection,
    loadSection,
    restoreToFormState,
    restoreFileFromPreview,
    clearRegistration,
  }
}
