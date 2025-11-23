<template>
  <div class="w-full max-w-[1024px] mx-auto">
    <UCard
      :ui="{
        root: 'gap-4 rounded-2xl border border-gray-200 bg-white',
        body: 'space-y-6'
      }"
    >
      <template #header>
        <div class="space-y-3">
          <h2 class="text-2xl font-semibold text-center mt-7 mb-6">{{ $t('auth.login.title') }}</h2>
          <p class="text-sm text-gray-500 text-center">
            {{ $t('auth.login.subtitle') }}
          </p>
        </div>
      </template>

      <UForm
        :schema="schema"
        :state="formState"
        :validate-on="['submit', 'blur']"
        @submit="handleSubmit"
      >
        <div class="w-full space-y-6 sm:px-0 flex flex-col items-center">
          <!-- Message d'erreur global -->
          <UAlert
            v-if="errorMessage"
            color="red"
            variant="soft"
            icon="i-heroicons-exclamation-triangle"
            :title="errorMessage"
            :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'red', variant: 'link', size: 'xs' }"
            @close="errorMessage = ''"
          />

          <!-- Email -->
          <UFormField
            :label="$t('auth.login.email')"
            name="email"
            size="md"
            required
          >
            <UInput
              v-model="formState.email"
              type="email"
              :placeholder="$t('auth.login.emailPlaceholder')"
              :disabled="isLoading"
              icon="i-heroicons-envelope"
              autocomplete="email"
              :ui="{
                base: 'w-[392px] py-4 px-6',
                icon: { trailing: { pointer: '' } }
              }"
            />
          </UFormField>

          <!-- Mot de passe -->
          <UFormField
            :label="$t('auth.login.password')"
            name="password"
            size="md"
            required
          >
            <UInput
              v-model="formState.password"
              type="password"
              :placeholder="$t('auth.login.passwordPlaceholder')"
              :disabled="isLoading"
              icon="i-heroicons-lock-closed"
              autocomplete="current-password"
              :ui="{
                base: 'w-[392px] py-4 px-6',
                icon: { trailing: { pointer: '' } }
              }"
            />
          </UFormField>

          <!-- Actions -->
          <div class="flex flex-col items-center gap-4 pt-4">
            <UButton
              type="submit"
              :loading="isLoading"
              :disabled="!canSubmit"
              color="primary"
              size="xl"
              class="text-white px-12 sm:px-24 font-bold"
            >
              {{ $t('auth.login.submit') }}
            </UButton>

            <div class="text-center">
              <UButton
                variant="link"
                :to="localePath('/welcome/personal-details')"
                :disabled="isLoading"
              >
                {{ $t('auth.login.createAccount') }}
              </UButton>
            </div>
          </div>
        </div>
      </UForm>

      <!-- Note avec identifiants de test -->
      <div class="mt-6 pt-6 border-t border-gray-200">
        <UAlert
          color="info"
          variant="soft"
          icon="i-heroicons-information-circle"
          :title="$t('auth.login.testCredentials.title')"
        >
          <template #description>
            <div class="mt-2 space-y-1 text-sm">
              <div class="flex items-center gap-2">
                <span class="font-medium text-gray-700">{{ $t('auth.login.testCredentials.email') }}:</span>
                <code class="px-2 py-1 bg-gray-100 rounded text-gray-900 font-mono text-xs">{{ $t('auth.login.testCredentials.emailValue') }}</code>
              </div>
              <div class="flex items-center gap-2">
                <span class="font-medium text-gray-700">{{ $t('auth.login.testCredentials.password') }}:</span>
                <code class="px-2 py-1 bg-gray-100 rounded text-gray-900 font-mono text-xs">{{ $t('auth.login.testCredentials.passwordValue') }}</code>
              </div>
            </div>
          </template>
        </UAlert>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { useLoginForm } from '~/composables/auth/useLoginForm'

const localePath = useLocalePath()

definePageMeta({
  layout: 'auth',
})

const {
  schema,
  formState,
  isLoading,
  errorMessage,
  canSubmit,
  handleSubmit,
} = useLoginForm()
</script>

