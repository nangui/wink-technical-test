<script setup lang="ts">
import * as locales from '@nuxt/ui/locale'

const { locale } = useI18n()

// Calculer la locale NuxtUI pour les attributs HTML
const nuxtUILocale = computed(() => locales[locale.value as keyof typeof locales] || locales.en)
const lang = computed(() => nuxtUILocale.value.code)
const dir = computed(() => nuxtUILocale.value.dir)

useHead({
  htmlAttrs: {
    lang,
    dir
  }
})
</script>

<template>
  <UApp :locale="locales[locale]">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
