<template>
  <div class="w-full max-w-[1024px]">
    <UCard
      :ui="{
        root: 'gap-4 pt-20 pb-20 bg-white relative',
      }"
    >
      <template #header>
        <div class="space-y-7">
          <UStepper :items="steps" :model-value="1" />
        </div>
      </template>

      <div class="p-4 sm:p-6 space-y-6 w-full flex">
        <div class="flex-1">
        <div class="pl-10">
          <h2 class="text-2xl font-semibold mb-6">
            {{ $t('registration.workspace.title') }}
          </h2>
        </div>

        <UForm
          :schema="schema"
          :state="formState"
          :validate-on="['submit', 'blur']"
          @submit="handleSubmit"
        >
          <div class="w-full space-y-6 flex flex-col items-center">
            <!-- Logo de l'entreprise -->
            <div class="w-full pl-10">
              <ProfileUploader
                v-model="formState.logo"
                :label="$t('registration.workspace.logo')"
                :disabled="isLoading"
              />
            </div>

            <!-- Nom de l'entreprise -->
            <UFormField
              :label="$t('registration.workspace.name')"
              name="name"
              size="xl"
              required
            >
              <UInput
                v-model="formState.name"
                :placeholder="$t('registration.workspace.namePlaceholder')"
                :disabled="isLoading"
                :ui="{
                  base: 'w-[392px]',
                }"
              />
            </UFormField>

            <!-- Description de l'entreprise -->
            <UFormField
              :label="$t('registration.workspace.description')"
              name="description"
              size="xl"
            >
              <UTextarea
                v-model="formState.description"
                :placeholder="$t('registration.workspace.descriptionPlaceholder')"
                :disabled="isLoading"
                :rows="4"
                :ui="{
                  base: 'w-[392px]'
                }"
              />
            </UFormField>

            <!-- Site internet -->
            <UFormField
              :label="$t('registration.workspace.website')"
              name="website"
              size="xl"
            >
              <UInput
                v-model="formState.website"
                type="url"
                :placeholder="$t('registration.workspace.websitePlaceholder')"
                :disabled="isLoading"
                :ui="{
                  base: 'w-[392px]',
                }"
              />
            </UFormField>

            <!-- Adresse du siège social -->
            <UFormField
              :label="$t('registration.workspace.address')"
              name="address"
              size="xl"
              required
            >
              <UTextarea
                v-model="formState.address"
                :placeholder="$t('registration.workspace.addressPlaceholder')"
                :disabled="isLoading"
                :rows="3"
                :ui="{
                  base: 'w-[392px]'
                }"
              />
            </UFormField>

            <!-- Secteur d'activité -->
            <UFormField
              :label="$t('registration.workspace.sector')"
              name="sector"
              size="xl"
              required
            >
              <UInput
                v-model="formState.sector"
                :placeholder="$t('registration.workspace.sectorPlaceholder')"
                :disabled="isLoading"
                :ui="{
                  base: 'w-[392px]',
                }"
              />
            </UFormField>

            <!-- Actions -->
            <div class="flex justify-between items-center w-full max-w-[392px] pt-4">
              <UButton
                type="button"
                color="gray"
                variant="ghost"
                :disabled="isLoading"
                @click="goBack"
              >
                {{ $t('common.back') }}
              </UButton>
              <UButton
                type="submit"
                :loading="isLoading"
                :disabled="!canSubmit"
                color="primary"
                size="xl"
                class="text-white text-center font-bold flex align-center justify-center"
                :ui="{
                  base: 'w-[392px]',
                }"
              >
                {{ $t('common.continue') }}
              </UButton>
            </div>
          </div>
        </UForm>
      </div>

        <div class="flex-1 flex justify-end h-full relative">
          <NuxtImg
            src="/desktop.svg"
            alt="Workspace"
            width="500"
            height="600"
            class="object-cover h-full w-full translate-x-10 relative z-0 shadow-xs"
          />
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ProfileUploader from '~/components/profile/ProfileUploader.vue'
import { useWorkspaceForm } from '~/composables/registration/useWorkspaceForm'

definePageMeta({
  layout: 'auth',
})

const { t } = useI18n()

const {
  schema,
  formState,
  isLoading,
  canSubmit,
  goBack,
  handleSubmit,
} = useWorkspaceForm()

const steps = computed(() => [
  { title: t('registration.personalDetails.stepper.step1') },
  { title: t('registration.personalDetails.stepper.step2') },
  { title: t('registration.personalDetails.stepper.step3') },
])
</script>

