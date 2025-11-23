<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <UCard>
        <template #header>
          <h1 class="text-3xl font-bold text-gray-900">{{ $t('home.title') }}</h1>
          <p class="text-sm text-gray-500 mt-2">{{ $t('home.subtitle') }}</p>
        </template>

        <div class="space-y-4">
          <p class="text-gray-700">
            {{ $t('home.welcome', { email: user?.email || 'utilisateur' }) }}
          </p>
          <p class="text-sm text-gray-500">
            {{ $t('home.description') }}
          </p>
          <UButton :to="localePath('/login')" @click="logout">
            {{ $t('auth.logout') }}
          </UButton>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/auth/useAuth'

definePageMeta({
  middleware: 'auth',
})

const { logout, user } = useAuth()
const localePath = useLocalePath()
</script>

