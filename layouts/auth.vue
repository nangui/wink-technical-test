<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Top Bar -->
    <header class="w-full border-b border-gray-200 bg-white">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-column sm:flex-row justify-center items-center h-16">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center">
            <NuxtImg
              src="/wink-logo.svg"
              alt="Wink Logo"
              width="100"
              height="100"
            />
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- Main Content - Centered Logo and Page Content -->
    <main class="mx-auto flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 w-full">
      <!-- Page Content -->
      <slot />
    </main>
  </div>
</template>

