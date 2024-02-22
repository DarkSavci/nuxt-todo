// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/eslint-module', '@nuxt/ui'],
  devtools: { enabled: true },
  ui: {
    global: true
  }
})