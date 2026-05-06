<template>
  <div class="flex min-h-screen bg-white/90 w-screen flex-col">
    <Header />
    <div class="flex w-full overflow-auto">
      <main class="flex-1 pr-6 pl-3">
        <slot />
      </main>
    </div>
  </div>
</template>

<script lang="ts"></script>
