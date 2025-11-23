<template>
  <div
    class="relative inline-flex items-center bg-gray-100 p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1"
    tabindex="0"
    role="radiogroup"
    :aria-label="t('common.languageSwitcher', 'Language switcher')"
    @keydown.enter.prevent="handleKeydown"
    @keydown.space.prevent="handleKeydown"
    @keydown.left.prevent="handleKeydown"
    @keydown.right.prevent="handleKeydown"
    @keydown.up.prevent="handleKeydown"
    @keydown.down.prevent="handleKeydown"
  >
    <!-- Indicateur qui glisse -->
    <div
      class="absolute h-[calc(100%-0.5rem)] bg-primary-500 rounded transition-all duration-300 ease-out shadow-sm"
      :style="{
        width: indicatorPosition.width,
        left: indicatorPosition.left,
      }"
      aria-hidden="true"
    />
    
    <!-- Boutons -->
    <button
      v-for="availableLocale in availableLocales"
      :key="availableLocale.code"
      :class="[
        'relative z-10 px-4 py-1.5 text-sm font-medium transition-colors duration-300 rounded',
        'focus:outline-none',
        currentLocale === availableLocale.code
          ? 'text-white'
          : 'text-gray-600 hover:text-gray-900'
      ]"
      role="radio"
      :aria-checked="currentLocale === availableLocale.code"
      :aria-label="`${availableLocale.name || availableLocale.code.toUpperCase()}`"
      tabindex="-1"
      @click="switchLocale(availableLocale.code)"
    >
      {{ availableLocale.code.toUpperCase() }}
    </button>
  </div>
</template>

<script setup lang="ts">
const { locale, locales, setLocale, t } = useI18n()

const currentLocale = computed(() => locale.value)

const availableLocales = computed(() => {
  return locales.value.filter((loc) => loc.code === 'fr' || loc.code === 'en')
})

// Calcul de la position de l'indicateur pour optimiser les performances
const indicatorPosition = computed(() => {
  const index = availableLocales.value.findIndex(loc => loc.code === currentLocale.value)
  return {
    left: `calc(${(index * 100) / availableLocales.value.length}% + 0.125rem)`,
    width: `calc(${100 / availableLocales.value.length}% - 0.25rem)`
  }
})

const switchLocale = async (localeCode: string) => {
  if (localeCode !== currentLocale.value) {
    await setLocale(localeCode)
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  const currentIndex = availableLocales.value.findIndex(loc => loc.code === currentLocale.value)
  let nextIndex = currentIndex

  if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
    nextIndex = currentIndex > 0 ? currentIndex - 1 : availableLocales.value.length - 1
  } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
    nextIndex = currentIndex < availableLocales.value.length - 1 ? currentIndex + 1 : 0
  } else if (event.key === 'Enter' || event.key === ' ') {
    // Toggle vers l'autre langue
    nextIndex = currentIndex === 0 ? 1 : 0
  }

  if (nextIndex !== currentIndex) {
    switchLocale(availableLocales.value[nextIndex].code)
  }
}
</script>

