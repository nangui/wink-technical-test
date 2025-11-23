<template>
  <div class="w-full max-w-[1024px]">
    <UCard
      :ui="{
        root: 'gap-4 pt-20 pb-20 bg-white relative',
      }"
    >
      <template #header>
        <div class="space-y-7">
          <UStepper :items="steps" :model-value="0" />
        </div>
      </template>

      <div class="p-4 sm:p-6 space-y-6 w-full flex">
        <div class="flex-1">
        <div class="pl-10">
          <h2 class="text-2xl font-semibold mb-6">
            {{ $t("registration.personalDetails.title") }}
          </h2>
        </div>

        <UForm
          :schema="schema"
          :state="formState"
          :validate-on="['submit', 'blur']"
          @submit="handleSubmit"
        >
          <div class="w-full space-y-6 flex flex-col items-center">
            <!-- Photo de profil -->
            <div class="w-full pl-10">
              <ProfileUploader
                v-model="formState.profil_photo"
                :label="$t('registration.personalDetails.profilePhoto')"
                :disabled="isLoading"
                :initials="profileInitials"
              />
            </div>

            <!-- Prénom -->
            <UFormField
              :label="$t('registration.personalDetails.firstname')"
              name="firstname"
              size="xl"
              required
            >
              <UInput
                v-model="formState.firstname"
                :placeholder="
                  $t('registration.personalDetails.firstnamePlaceholder')
                "
                :disabled="isLoading"
                :ui="{
                  base: 'w-[392px]',
                }"
              />
            </UFormField>

            <!-- Nom -->
            <UFormField
              :label="$t('registration.personalDetails.lastname')"
              name="lastname"
              size="xl"
              required
            >
              <UInput
                v-model="formState.lastname"
                :placeholder="
                  $t('registration.personalDetails.lastnamePlaceholder')
                "
                :disabled="isLoading"
                :ui="{
                  base: 'w-[392px]',
                }"
              />
            </UFormField>

            <!-- Email -->
            <UFormField
              :label="$t('registration.personalDetails.email')"
              name="email"
              size="xl"
              required
            >
              <UInput
                v-model="formState.email"
                type="email"
                :placeholder="
                  $t('registration.personalDetails.emailPlaceholder')
                "
                icon="i-heroicons-envelope"
                :disabled="isLoading"
                :ui="{
                  base: 'w-[392px]',
                }"
              />
            </UFormField>

            <!-- Actions -->
            <div class="flex flex-col items-center gap-4">
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
                {{ $t("common.continue") }}
              </UButton>
              <div class="text-center">
                <span class="text-sm text-gray-600">{{
                  $t("registration.personalDetails.alreadyHaveAccount")
                }}</span>
                <UButton
                  variant="link"
                  :to="localePath('/login')"
                  :disabled="isLoading"
                  class="ml-1"
                >
                  {{ $t("registration.personalDetails.signIn") }}
                </UButton>
              </div>
            </div>
          </div>
        </UForm>
      </div>

        <div ref="imageContainerRef" class="flex-1 flex justify-end h-full relative">
          <NuxtImg
            src="/desktop.svg"
            alt="Personal Details"
            width="500"
            height="600"
            class="object-cover h-full w-full translate-x-10 relative z-0 shadow-xs"
          />
          <div
            ref="profileSelectorRef"
            :class="[
              'absolute right-10 z-50 profile-selector-transition',
              hasProfilePhoto ? 'profile-selector-top' : 'profile-selector-bottom'
            ]"
            :style="selectorStyle"
          >
            <UiProfileSelector
              :profile-photo="formState.profil_photo"
              :firstname="formState.firstname"
              :lastname="formState.lastname"
            />
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import ProfileUploader from "~/components/profile/ProfileUploader.vue";
import UiProfileSelector from "~/components/ui/ProfileSelector.vue";
import { usePersonalDetailsForm } from "~/composables/registration/usePersonalDetailsForm";

definePageMeta({
  layout: "auth",
});

const { t } = useI18n();
const localePath = useLocalePath();

const {
  schema,
  formState,
  isLoading,
  imageContainerRef,
  hasProfilePhoto,
  profileInitials,
  selectorStyle,
  canSubmit,
  handleSubmit,
} = usePersonalDetailsForm();

const steps = computed(() => [
  { title: t("registration.personalDetails.stepper.step1") },
  { title: t("registration.personalDetails.stepper.step2") },
  { title: t("registration.personalDetails.stepper.step3") },
]);
</script>

<style scoped>
.profile-selector-transition {
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
}
</style>
