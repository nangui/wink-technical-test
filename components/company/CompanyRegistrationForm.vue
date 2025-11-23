<template>
  <UCard>
    <template #header>
      <h2 class="text-2xl font-bold text-gray-900">Création de compte entreprise</h2>
      <p class="text-sm text-gray-500 mt-1">Remplissez les informations pour créer votre compte entreprise</p>
    </template>

    <UForm
      :state="{ name: state.name, address: state.address, logo: state.logo }"
      @submit="handleSubmit"
    >
      <div class="space-y-6">
        <!-- Nom de l'entreprise -->
        <UFormGroup
          label="Nom de l'entreprise"
          :error="getFieldError('name')"
          required
        >
        <UInput
          :model-value="state.name"
          placeholder="Ex: Acme Corporation"
          :disabled="state.isLoading"
          @update:model-value="setName"
        />
        </UFormGroup>

        <!-- Adresse -->
        <UFormGroup
          label="Adresse"
          :error="getFieldError('address')"
          required
        >
        <UTextarea
          :model-value="state.address"
          placeholder="Ex: 123 Rue de la République, 75001 Paris, France"
          :disabled="state.isLoading"
          :rows="3"
          @update:model-value="setAddress"
        />
        </UFormGroup>

        <!-- Logo -->
        <CompanyLogoUpload
          :model-value="state.logo"
          :error="getFieldError('logo')"
          :disabled="state.isLoading"
          @update:model-value="setLogo"
        />

        <!-- Message d'erreur global -->
        <UAlert
          v-if="state.error"
          color="red"
          variant="soft"
          icon="i-heroicons-exclamation-triangle"
          :title="state.error"
        />

        <!-- Actions -->
        <div class="flex justify-end gap-3 pt-4">
          <UButton
            type="button"
            color="gray"
            variant="ghost"
            :disabled="state.isLoading"
            @click="resetForm"
          >
            Réinitialiser
          </UButton>
          <UButton
            type="submit"
            :loading="state.isLoading"
            :disabled="!canSubmit"
          >
            Créer le compte
          </UButton>
        </div>
      </div>
    </UForm>
  </UCard>
</template>

<script setup lang="ts">
import { useCompanyRegistration } from '~/composables/company/useCompanyRegistration'
import CompanyLogoUpload from './CompanyLogoUpload.vue'

const {
  state,
  canSubmit,
  setName,
  setAddress,
  setLogo,
  registerCompany,
  resetForm,
  getFieldError,
} = useCompanyRegistration()

const handleSubmit = async () => {
  try {
    const company = await registerCompany()
    
    // Succès - navigation ou notification
    await navigateTo(`/companies/${company.id}`)
  } catch (error) {
    // L'erreur est déjà gérée dans le composable
    console.error('Erreur lors de l\'inscription:', error)
  }
}
</script>

