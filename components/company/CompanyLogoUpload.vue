<template>
  <div class="space-y-2">
    <UFormGroup
      label="Logo de l'entreprise"
      :error="error"
      :description="description"
    >
      <UFileUpload
        v-model="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        :disabled="disabled"
        :variant="variant"
        :size="size"
        @update:model-value="handleFileChange"
      >
        <template #files="{ files }">
          <div v-if="files && files.length > 0" class="mt-4">
            <div class="flex items-center gap-4">
              <img
                v-if="previewUrl"
                :src="previewUrl"
                alt="Logo preview"
                class="w-24 h-24 object-cover rounded-lg border border-gray-200"
              >
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">{{ files[0].name }}</p>
                <p class="text-xs text-gray-500">{{ formatFileSize(files[0].size) }}</p>
              </div>
            </div>
          </div>
        </template>
      </UFileUpload>
    </UFormGroup>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  modelValue: File | null
  error?: string
  description?: string
  disabled?: boolean
  variant?: 'button' | 'area'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<Props>(), {
  error: undefined,
  description: 'Formats acceptés : JPEG, PNG, GIF, WebP (max 5MB)',
  disabled: false,
  variant: 'area',
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: File | null]
}>()

const file = ref<File | null>(props.modelValue)
const previewUrl = ref<string | null>(null)

watch(() => props.modelValue, (newValue) => {
  file.value = newValue
  if (newValue) {
    createPreview(newValue)
  } else {
    previewUrl.value = null
  }
})

const handleFileChange = (files: File | File[] | null) => {
  if (files === null) {
    file.value = null
    previewUrl.value = null
    emit('update:modelValue', null)
    return
  }

  const fileArray = Array.isArray(files) ? files : [files]
  if (fileArray.length > 0) {
    file.value = fileArray[0]
    createPreview(fileArray[0])
    emit('update:modelValue', fileArray[0])
  }
}

const createPreview = (file: File) => {
  if (file.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = (e) => {
      previewUrl.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}
</script>

