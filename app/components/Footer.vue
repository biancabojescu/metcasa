<template>
  <footer class="mt-16 border-t border-purple-900/10 bg-grey-10">
    <div class="mx-auto max-w-7xl px-6 py-12 md:px-12">
      <div class="grid grid-cols-1 gap-10 md:grid-cols-3">
        <div>
          <h3 class="text-2xl font-semibold text-purple-900">metCasa</h3>
          <p class="mt-3 text-sm text-purple-800/80 leading-relaxed">
            Agentia ta de incredere pentru tranzactii imobiliare. Gasim casa potrivita pentru tine.
          </p>
        </div>

        <div>
          <h4 class="text-sm font-semibold uppercase tracking-wider text-purple-900">Navigare</h4>
          <ul class="mt-3 space-y-2 text-sm">
            <li>
              <NuxtLink to="/" class="text-purple-800/80 hover:text-purple-500 transition-colors">
                Acasa
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/anunturi" class="text-purple-800/80 hover:text-purple-500 transition-colors">
                Anunturi
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/profil" class="text-purple-800/80 hover:text-purple-500 transition-colors">
                Profil
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h4 class="text-sm font-semibold uppercase tracking-wider text-purple-900">Contact</h4>
          <ul class="mt-3 space-y-2 text-sm text-purple-800/80">
            <li>contact@metCasa.ro</li>
            <li>+40 755 633 650</li>
            <li>Iași, România</li>
          </ul>
        </div>
      </div>

      <div class="mt-10 border-t border-purple-900/10 pt-6 text-center text-xs text-purple-800/60">
        &copy; {{ new Date().getFullYear() }} metCasa. Toate drepturile rezervate.
      </div>
    </div>
  </footer>
</template>
