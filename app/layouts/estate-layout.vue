<template>
  <div class="flex min-h-screen w-screen flex-col">
    <Header />
    <div class="flex w-full overflow-auto">
      <Sidebar/>
      <main class="flex-1 pr-6 pl-3">
        <slot />
      </main>
    </div>
    <Footer />
  </div>
</template>

<script lang="ts"></script>
