import * as v from 'valibot'
import type { FormSubmitEvent } from '@nuxt/ui'
import { reactive, computed, ref, watch, onMounted } from 'vue'
import { useRegistrationState, type PersonalDetails } from './useRegistrationState'

function createPersonalDetailsSchema(t: ReturnType<typeof useI18n>['t']) {
  return v.object({
    firstname: v.pipe(
      v.string(),
      v.nonEmpty(t('registration.personalDetails.errors.firstnameRequired'))
    ),
    lastname: v.pipe(
      v.string(),
      v.nonEmpty(t('registration.personalDetails.errors.lastnameRequired'))
    ),
    email: v.pipe(
      v.string(),
      v.nonEmpty(t('registration.personalDetails.errors.emailRequired')),
      v.email(t('registration.personalDetails.errors.emailInvalid'))
    ),
  })
}

export type PersonalDetailsSchema = v.InferOutput<ReturnType<typeof createPersonalDetailsSchema>>

export function usePersonalDetailsForm() {
  const { t } = useI18n()
  const { saveSection, restoreToFormState } = useRegistrationState()
  const localePath = useLocalePath()

  // Schema Valibot avec messages traduits
  const schema = computed(() => createPersonalDetailsSchema(t))

  const formState = reactive<PersonalDetailsSchema & { profil_photo: File | null }>({
    firstname: '',
    lastname: '',
    email: '',
    profil_photo: null,
  })

  const isLoading = ref(false)
  const imageContainerRef = ref<HTMLElement | null>(null)

  // Vérifier si une photo de profil est uploadée
  const hasProfilePhoto = computed(() => !!formState.profil_photo)

  // Générer les initiales pour le placeholder de la photo
  const profileInitials = computed(() => {
    const first = formState.firstname?.trim().charAt(0).toUpperCase() || ''
    const last = formState.lastname?.trim().charAt(0).toUpperCase() || ''
    return first && last ? `${first}${last}` : ''
  })

  // Calculer le style pour la transition du sélecteur de profil
  const selectorStyle = computed(() => {
    if (!imageContainerRef.value) {
      return {}
    }

    const containerHeight = imageContainerRef.value.offsetHeight
    const topPosition = 5 * 16 // top-20 = 5rem = 80px
    const bottomPosition = 5 * 16 // bottom-20 = 5rem = 80px

    // Distance à parcourir = hauteur du conteneur - top - bottom
    const distance = containerHeight - topPosition - bottomPosition

    if (hasProfilePhoto.value) {
      return {
        transform: `translateY(-${distance}px)`,
        bottom: `${bottomPosition}px`,
        top: 'auto'
      }
    } else {
      return {
        transform: 'translateY(0)',
        bottom: `${bottomPosition}px`,
        top: 'auto'
      }
    }
  })

  // Vérifier si le formulaire peut être soumis
  const canSubmit = computed(() => {
    return (
      formState.firstname?.trim().length > 0 &&
      formState.lastname?.trim().length > 0 &&
      formState.email?.trim().length > 0 &&
      !isLoading.value
    )
  })

  // Restaurer les données sauvegardées au montage
  onMounted(async () => {
    await restoreToFormState('personalDetails', formState)
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
        await saveSection('personalDetails', { ...formState } as PersonalDetails)
      }, 500) // Debounce de 500ms
    },
    { deep: true }
  )

  const handleSubmit = async (_event: FormSubmitEvent<PersonalDetailsSchema>) => {
    isLoading.value = true

    try {
      // Sauvegarder une dernière fois avant navigation
      await saveSection('personalDetails', { ...formState } as PersonalDetails)

      // Naviguer vers l'étape suivante
      await navigateTo(localePath('/welcome/workspace'))
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
    imageContainerRef,
    hasProfilePhoto,
    profileInitials,
    selectorStyle,
    canSubmit,
    handleSubmit,
  }
}

