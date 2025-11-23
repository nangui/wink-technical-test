import * as v from 'valibot'
import type { FormSubmitEvent } from '@nuxt/ui'
import { reactive, computed, ref, watch, onMounted } from 'vue'
import { useCompanyRegistration } from '../company/useCompanyRegistration'
import { useRegistrationState } from './useRegistrationState'
import type { AboutYouDetails } from './useRegistrationState'

function createAboutYouSchema() {
  return v.object({
    description: v.optional(v.string()),
    sector: v.optional(v.string()),
    size: v.optional(v.string()),
  })
}

export type AboutYouSchema = v.InferOutput<ReturnType<typeof createAboutYouSchema>>

export function useAboutYouForm() {
  const { t, locale } = useI18n()
  const { saveSection, restoreToFormState, clearRegistration, restoreFileFromPreview, registrationData } = useRegistrationState()
  const localePath = useLocalePath()

  // Schema Valibot - tous les champs sont optionnels pour cette étape
  const schema = computed(() => createAboutYouSchema())

  const formState = reactive<Partial<AboutYouSchema>>({
    description: '',
    sector: '',
    size: '',
  })

  const isLoading = ref(false)
  const errorMessage = ref('')

  // Vérifier si le formulaire peut être soumis (tous les champs sont optionnels, donc toujours true sauf si loading)
  const canSubmit = computed(() => !isLoading.value)

  // Options de taille d'entreprise - dépendre de locale pour la réactivité
  const companySizes = computed(() => {
    // Utiliser locale.value pour forcer la réactivité lors du changement de langue
    void locale.value
    return [
      { label: t('registration.aboutYou.sizes.1-10'), value: '1-10' },
      { label: t('registration.aboutYou.sizes.11-50'), value: '11-50' },
      { label: t('registration.aboutYou.sizes.51-200'), value: '51-200' },
      { label: t('registration.aboutYou.sizes.201-500'), value: '201-500' },
      { label: t('registration.aboutYou.sizes.500+'), value: '500+' },
    ]
  })

  // Restaurer les données sauvegardées au montage
  onMounted(async () => {
    await restoreToFormState('aboutYou', formState)
  })

  // Sauvegarder automatiquement lors des changements (debounce)
  let saveTimeout: NodeJS.Timeout | null = null
  watch(
    () => ({ ...formState }),
    () => {
      if (saveTimeout) {
        clearTimeout(saveTimeout)
      }
      saveTimeout = setTimeout(async () => {
        await saveSection('aboutYou', {
          description: formState.description || '',
          sector: formState.sector || '',
          size: formState.size || '',
        } as AboutYouDetails)
      }, 500) // Debounce de 500ms
    },
    { deep: true }
  )

  const goBack = async () => {
    // Sauvegarder avant de revenir en arrière
    await saveSection('aboutYou', {
      description: formState.description || '',
      sector: formState.sector || '',
      size: formState.size || '',
    } as AboutYouDetails)
    await navigateTo(localePath('/welcome/workspace'))
  }

  const handleSubmit = async (_event: FormSubmitEvent<AboutYouSchema>) => {
    errorMessage.value = ''
    isLoading.value = true

    try {
      // Sauvegarder cette étape une dernière fois
      await saveSection('aboutYou', {
        description: formState.description || '',
        sector: formState.sector || '',
        size: formState.size || '',
      } as AboutYouDetails)

      // Utiliser le composable pour créer l'entreprise
      const { setName, setAddress, setLogo, registerCompany } = useCompanyRegistration()

      // Remplir les données du workspace
      if (registrationData.value.workspace) {
        setName(registrationData.value.workspace.name)
        setAddress(registrationData.value.workspace.address)

        // Restaurer le logo depuis la preview si présent, sinon utiliser le fichier direct
        if (registrationData.value.workspace.logo_preview) {
          const logoFile = await restoreFileFromPreview(
            registrationData.value.workspace.logo_preview,
            'logo.jpg'
          )
          if (logoFile) {
            setLogo(logoFile)
          }
        } else if (registrationData.value.workspace.logo instanceof File) {
          setLogo(registrationData.value.workspace.logo)
        }
      }

      // Créer l'entreprise
      const company = await registerCompany()

      // Authentifier l'utilisateur
      const auth = useState('auth', () => ({
        isAuthenticated: false,
        user: null as { id: string; email: string } | null,
      }))

      auth.value.isAuthenticated = true
      auth.value.user = {
        id: company.id,
        email: registrationData.value.personalDetails?.email || '',
      }

      // Nettoyer les données de registration après succès
      clearRegistration()

      // Rediriger vers la page d'accueil
      await navigateTo(localePath('/'))
    } catch (error) {
      console.error('Erreur lors de la création du compte:', error)
      errorMessage.value = t('registration.aboutYou.errors.createAccountError')
    } finally {
      isLoading.value = false
    }
  }

  return {
    schema,
    formState,
    isLoading,
    errorMessage,
    canSubmit,
    companySizes,
    goBack,
    handleSubmit,
  }
}

