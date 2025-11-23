<template>
  <div class="w-full max-w-[1024px]">
    <UCard
      :ui="{
        root: 'gap-4 pt-20 pb-20 bg-white relative',
      }"
    >
      <template #header>
        <div class="space-y-7">
          <UStepper :items="steps" :model-value="2" />
        </div>
      </template>

      <div class="p-4 sm:p-6 space-y-6 w-full flex">
        <div class="flex-1">
        <div class="pl-10">
          <h2 class="text-2xl font-semibold mb-6">
            {{ $t('registration.aboutYou.title') }}
          </h2>
        </div>

        <UForm
          :schema="schema"
          :state="formState"
          :validate-on="['blur']"
          @submit="handleSubmit"
        >
          <div class="w-full space-y-6 flex flex-col items-center">
            <!-- Message d'erreur global -->
            <UAlert
              v-if="errorMessage"
              color="error"
              variant="soft"
              icon="i-heroicons-exclamation-triangle"
              :title="errorMessage"
              :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'error', variant: 'link', size: 'xs' }"
              @close="errorMessage = ''"
            />

            <!-- Description -->
            <UFormField
              :label="$t('registration.aboutYou.description')"
              name="description"
              size="xl"
            >
              <UTextarea
                v-model="formState.description"
                :placeholder="$t('registration.aboutYou.descriptionPlaceholder')"
                :disabled="isLoading"
                :rows="5"
                :ui="{
                  base: 'w-[392px]'
                }"
              />
            </UFormField>

            <!-- Secteur d'activité -->
            <UFormField
              :label="$t('registration.aboutYou.sector')"
              name="sector"
              size="xl"
            >
              <UInput
                v-model="formState.sector"
                :placeholder="$t('registration.aboutYou.sectorPlaceholder')"
                :disabled="isLoading"
                :ui="{
                  base: 'w-[392px]',
                }"
              />
            </UFormField>

            <!-- Taille de l'entreprise -->
            <UFormField
              :label="$t('registration.aboutYou.size')"
              name="size"
              size="xl"
            >
              <USelect
                v-model="formState.size"
                :items="companySizes"
                :placeholder="$t('registration.aboutYou.sizePlaceholder')"
                :disabled="isLoading"
                :ui="{
                  base: 'w-[392px]'
                }"
              />
            </UFormField>

            <!-- Actions -->
            <div class="flex justify-between items-center w-full max-w-[392px] pt-4">
              <UButton
                type="button"
                color="neutral"
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
                {{ $t('registration.aboutYou.createAccount') }}
              </UButton>
            </div>
          </div>
        </UForm>
      </div>

        <div class="flex-1 flex justify-end h-full relative">
          <NuxtImg
            src="/desktop.svg"
            alt="About You"
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
import { useAboutYouForm } from '~/composables/registration/useAboutYouForm'

definePageMeta({
  layout: 'auth',
})

const { t } = useI18n()

const {
  schema,
  formState,
  isLoading,
  errorMessage,
  canSubmit,
  companySizes,
  goBack,
  handleSubmit,
} = useAboutYouForm()

const steps = computed(() => [
  { title: t('registration.personalDetails.stepper.step1') },
  { title: t('registration.personalDetails.stepper.step2') },
  { title: t('registration.personalDetails.stepper.step3') },
])
</script>

