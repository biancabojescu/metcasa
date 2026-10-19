<template>
  <div class="flex min-h-screen w-full flex-col">
    <Header />
    <div class="flex w-full flex-1">
      <Sidebar/>
      <main class="min-w-0 flex-1 pr-6 pl-3">
        <slot />
      </main>
    </div>
    <Footer />
  </div>
</template>

<script lang="ts"></script>
