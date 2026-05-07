<template>
  <header
    class="sticky top-0 z-50 flex max-h-22 flex-row items-center justify-between gap-6 overflow-hidden pr-6 pl-3 bg-grey-10 ocaity-100 shadow-sm"
  >
    <AppLogo />
    <div class="flex items-center gap-4">
      <NuxtLink to="/profil">
        <NuxtIcon name="profile" filled class="text-3xl text-purple-900"/>
      </NuxtLink>
    </div>
  </header>
</template>
