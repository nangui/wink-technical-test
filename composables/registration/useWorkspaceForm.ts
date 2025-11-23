import * as v from 'valibot'
import type { FormSubmitEvent } from '@nuxt/ui'
import { reactive, computed, ref, watch, onMounted } from 'vue'
import { useRegistrationState, type WorkspaceDetails } from './useRegistrationState'

function createWorkspaceSchema(t: ReturnType<typeof useI18n>['t']) {
  return v.object({
    name: v.pipe(
      v.string(),
      v.nonEmpty(t('registration.workspace.errors.nameRequired'))
    ),
    description: v.optional(v.string()),
    website: v.optional(v.string()),
    address: v.pipe(
      v.string(),
      v.nonEmpty(t('registration.workspace.errors.addressRequired'))
    ),
    sector: v.pipe(
      v.string(),
      v.nonEmpty(t('registration.workspace.errors.sectorRequired'))
    ),
  })
}

export type WorkspaceSchema = v.InferOutput<ReturnType<typeof createWorkspaceSchema>>

export function useWorkspaceForm() {
  const { t } = useI18n()
  const { saveSection, restoreToFormState } = useRegistrationState()
  const localePath = useLocalePath()

  // Schema Valibot avec messages traduits
  const schema = computed(() => createWorkspaceSchema(t))

  const formState = reactive<WorkspaceSchema & { logo: File | null }>({
    logo: null,
    name: '',
    description: undefined,
    website: undefined,
    address: '',
    sector: '',
  })

  const isLoading = ref(false)

  // Vérifier si le formulaire peut être soumis
  const canSubmit = computed(() => {
    return (
      formState.name?.trim().length > 0 &&
      formState.address?.trim().length > 0 &&
      formState.sector?.trim().length > 0 &&
      !isLoading.value
    )
  })

  // Restaurer les données sauvegardées au montage
  onMounted(async () => {
    await restoreToFormState('workspace', formState)
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
        await saveSection('workspace', {
          ...formState,
          description: formState.description || '',
          website: formState.website || '',
        } as WorkspaceDetails)
      }, 500) // Debounce de 500ms
    },
    { deep: true }
  )

  const goBack = async () => {
    // Sauvegarder avant de revenir en arrière
    await saveSection('workspace', {
      ...formState,
      description: formState.description || '',
      website: formState.website || '',
    } as WorkspaceDetails)
    await navigateTo(localePath('/welcome/personal-details'))
  }

  const handleSubmit = async (_event: FormSubmitEvent<WorkspaceSchema>) => {
    isLoading.value = true

    try {
      // Sauvegarder une dernière fois avant navigation
      await saveSection('workspace', {
        ...formState,
        description: formState.description || '',
        website: formState.website || '',
      } as WorkspaceDetails)

      // Naviguer vers l'étape suivante
      await navigateTo(localePath('/welcome/about-you'))
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    schema,
    formState,
    isLoading,
    canSubmit,
    goBack,
    handleSubmit,
  }
}

