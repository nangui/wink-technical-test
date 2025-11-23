import * as v from 'valibot'
import type { FormSubmitEvent } from '@nuxt/ui'
import { reactive, computed, ref, onMounted } from 'vue'
import { useAuth } from './useAuth'

function createLoginSchema(t: ReturnType<typeof useI18n>['t']) {
  return v.object({
    email: v.pipe(
      v.string(),
      v.nonEmpty(t('auth.login.errors.emailRequired')),
      v.email(t('auth.login.errors.emailInvalid'))
    ),
    password: v.pipe(
      v.string(),
      v.nonEmpty(t('auth.login.errors.passwordRequired')),
      v.minLength(6, t('auth.login.errors.passwordMinLength'))
    ),
  })
}

export type LoginSchema = v.InferOutput<ReturnType<typeof createLoginSchema>>

export function useLoginForm() {
  const { t } = useI18n()
  const { login, isAuthenticated } = useAuth()

  // Schema Valibot avec messages traduits
  const schema = computed(() => createLoginSchema(t))

  const formState = reactive<LoginSchema>({
    email: '',
    password: '',
  })

  const isLoading = ref(false)
  const errorMessage = ref('')

  // Vérifier si le formulaire peut être soumis
  const canSubmit = computed(() => {
    return (
      formState.email?.trim().length > 0 &&
      formState.password?.trim().length > 0 &&
      !isLoading.value
    )
  })

  // Rediriger si déjà connecté
  onMounted(() => {
    if (isAuthenticated.value) {
      navigateTo('/')
    }
  })

  const handleSubmit = async (event: FormSubmitEvent<LoginSchema>) => {
    errorMessage.value = ''
    isLoading.value = true

    try {
      // Appeler l'API de connexion avec les données validées
      await login({
        email: event.data.email.trim(),
        password: event.data.password,
      })

      // Rediriger vers la page d'accueil
      await navigateTo('/')
    } catch (error: unknown) {
      // Gérer les erreurs
      const message = error instanceof Error
        ? error.message
        : (error as { response?: { data?: { message?: string } } })?.response?.data?.message || t('auth.login.errors.generic')

      // Afficher le message d'erreur global
      errorMessage.value = message
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
    handleSubmit,
  }
}

