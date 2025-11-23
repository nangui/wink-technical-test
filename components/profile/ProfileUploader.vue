<template>
  <UFormField
    :label="label"
    :error="error"
    :required="required"
    :description="description"
  >
    <UFileUpload
      v-model="fileValue"
      accept="image/png,image/jpeg"
      :disabled="disabled"
      :interactive="false"
      @update:model-value="handleFileChange"
    >
      <template #default="{ open, removeFile: removeFileFromUpload }">
        <div class="flex items-start gap-4">
          <!-- Photo circulaire ou placeholder -->
          <div class="shrink-0">
            <div
              class="w-18 h-18 rounded-full overflow-hidden bg-gray-100 border-3 border-white shadow flex items-center justify-center"
            >
              <NuxtImg
                v-if="previewUrl"
                :src="previewUrl"
                alt="Profile Preview"
                class="w-full h-full object-cover"
                width="72"
                height="72"
              />
              <span
                v-else-if="initials"
                class="text-2xl font-semibold text-gray-500"
              >
                {{ initials }}
              </span>
              <UIcon
                v-else
                name="i-heroicons-user"
                class="w-12 h-12 text-gray-400"
              />
            </div>
          </div>

          <!-- Boutons d'action sur la même ligne -->
          <div class="flex flex-col gap-2 flex-1">
            <div class="flex gap-2 items-center">
              <UButton
                :icon="hasPhoto ? 'i-heroicons-photo' : 'i-heroicons-arrow-up-tray'"
                :label="hasPhoto ? t('registration.workspace.modifyPhoto') : t('registration.workspace.addPhoto')"
                variant="outline"
                color="neutral"
                :disabled="disabled"
                @click="open()"
              />
              <UButton
                :label="t('common.delete')"
                variant="outline"
                color="neutral"
                :disabled="disabled"
                @click="handleRemove(removeFileFromUpload)"
              />
            </div>
            <p class="text-xs text-gray-500 mt-1">
              {{ t('registration.workspace.fileFormat') }}
            </p>
          </div>
        </div>
      </template>
    </UFileUpload>
  </UFormField>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

const { t } = useI18n()

const props = defineProps<{
  modelValue: File | null
  label?: string
  error?: string
  disabled?: boolean
  required?: boolean
  description?: string
  initials?: string // Initiales pour le placeholder (ex: "AP")
}>()

const emit = defineEmits<{
  'update:modelValue': [value: File | null]
}>()

const fileValue = ref<File | null>(props.modelValue)
const previewUrl = ref<string | null>(null)

const hasPhoto = computed(() => !!props.modelValue && !!previewUrl.value)

// Fonction pour créer une URL d'objet à partir d'un fichier
const createObjectUrl = (file: File): string => {
  return URL.createObjectURL(file)
}

// Surveiller les changements de modelValue pour mettre à jour fileValue et previewUrl
watch(() => props.modelValue, (newFile) => {
  fileValue.value = newFile
  if (newFile) {
    previewUrl.value = createObjectUrl(newFile)
  } else {
    if (previewUrl.value) {
      URL.revokeObjectURL(previewUrl.value)
    }
    previewUrl.value = null
  }
}, { immediate: true })

// Surveiller les changements de fileValue pour mettre à jour le parent
watch(fileValue, (newFile) => {
  if (newFile !== props.modelValue) {
    emit('update:modelValue', newFile)
  }
})

const handleFileChange = (file: File | null | undefined) => {
  if (!file) {
    fileValue.value = null
    emit('update:modelValue', null)
    return
  }

  // Valider la taille (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    fileValue.value = null
    emit('update:modelValue', null)
    return
  }

  // Valider le type
  if (!file.type.match(/^image\/(png|jpeg)$/)) {
    fileValue.value = null
    emit('update:modelValue', null)
    return
  }

  fileValue.value = file
  emit('update:modelValue', file)
}

const handleRemove = (removeFileFromUpload: () => void) => {
  removeFileFromUpload()
  fileValue.value = null
  emit('update:modelValue', null)
}
</script>

