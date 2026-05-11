<template>
  <div class="flex min-h-screen w-screen flex-col">
    <Header />
    <div class="flex w-full flex-1 overflow-auto">
      <main class="flex-1">
        <slot />
      </main>
    </div>
    <Footer />
  </div>
</template>

<script lang="ts"></script>
