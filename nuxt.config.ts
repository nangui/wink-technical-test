// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/test-utils',
    '@nuxt/hints',
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxtjs/i18n'
  ],

  i18n: {
    locales: [
      {
        code: 'fr',
        file: 'fr.json',
        name: 'Français'
      },
      {
        code: 'en',
        file: 'en.json',
        name: 'English'
      }
    ],
    defaultLocale: 'fr',
    langDir: 'locales',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      alwaysRedirect: false,
      fallbackLocale: 'fr'
    },
    vueI18n: './i18n.config.ts',
    compilation: {
      strictMessage: false
    }
  },

  css: ['~/assets/css/main.css']
})