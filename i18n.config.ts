export default defineI18nConfig(() => ({
  legacy: false,
  // Ne pas définir 'locale' ici, elle sera gérée par Nuxt i18n via defaultLocale
  fallbackLocale: 'fr',
  compilation: {
    // Désactiver le parsing des linked messages pour éviter les erreurs avec les points dans les emails
    strictMessage: false,
  },
}))

