/// <reference types="vite/client" />

declare module 'vuetify/styles'
declare module '*.css'
declare module '*.scss'
declare module '*.sass'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $t: (path: string, defaultValue?: string) => string
  }
}
