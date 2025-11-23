<template>
  <div class="bg-white hover:rotate-2 rounded-md border border-primary-500 ring-2 ring-primary-500/50 shadow-primary-300 w-[210px] flex items-center gap-3 px-3 py-2 -translate-x-52 translate-y-15 hover:-translate-x-50  transition-all duration-300">
    <!-- Photo de profil circulaire -->
    <div class="w-7 h-7 rounded-full overflow-hidden bg-gray-100 border-2 border-white shadow flex items-center justify-center shrink-0">
      <NuxtImg
        v-if="previewUrl"
        :src="previewUrl"
        alt="Profile Preview"
        class="w-full h-full object-cover"
        width="28"
        height="28"
      />
      <span
        v-else-if="displayInitials"
        class="text-sm font-semibold text-gray-500"
      >
        {{ displayInitials }}
      </span>
      <UIcon
        v-else
        name="i-heroicons-user"
        class="w-5 h-5 text-gray-400"
      />
    </div>
    <!-- Nom de l'utilisateur -->
    <span class="flex-1 text-sm font-medium text-gray-900 truncate">
      {{ displayName }}
    </span>
    <!-- Icône chevron -->
    <UIcon name="i-heroicons-chevron-down" class="w-5 h-5 text-gray-400 shrink-0" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  profilePhoto?: File | null
  firstname?: string
  lastname?: string
  displayName?: string // Si fourni, sera utilisé directement au lieu de firstname + lastname
}>()

const previewUrl = ref<string | null>(null)

// Générer les initiales pour le placeholder
const displayInitials = computed(() => {
  if (props.firstname && props.lastname) {
    const first = props.firstname.trim().charAt(0).toUpperCase()
    const last = props.lastname.trim().charAt(0).toUpperCase()
    return first && last ? `${first}${last}` : ''
  }
  return ''
})

// Nom complet à afficher
const displayName = computed(() => {
  if (props.displayName) {
    return props.displayName
  }
  if (props.firstname && props.lastname) {
    return `${props.firstname.trim()} ${props.lastname.trim()}`
  }
  return props.firstname?.trim() || props.lastname?.trim() || ''
})

// Surveiller les changements de la photo de profil pour générer la preview
watch(() => props.profilePhoto, (newFile) => {
  if (newFile) {
    const reader = new FileReader()
    reader.onload = (e) => {
      previewUrl.value = e.target?.result as string
    }
    reader.readAsDataURL(newFile)
  } else {
    previewUrl.value = null
  }
}, { immediate: true })
</script>

