<template>
  <div>
    <!-- Hero -->
    <section class="relative overflow-hidden">
      <div
        class="absolute inset-0 -z-10 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-500"
      />
      <div
        class="absolute inset-0 -z-10 opacity-20 bg-[radial-gradient(circle_at_top_right,_white,_transparent_60%)]"
      />

      <div class="mx-auto max-w-7xl px-6 py-20 md:px-12 md:py-32">
        <div class="max-w-3xl">
          <span
            class="inline-block rounded-full bg-white/10 px-4 py-1 text-xs font-medium uppercase tracking-widest text-white/80 backdrop-blur"
          >
            Tranzactii imobiliare
          </span>
          <h1
            class="mt-6 text-5xl font-bold leading-tight text-white md:text-7xl"
          >
            Casa ta <span class="text-green-400">incepe cu noi.</span>
          </h1>
          <p class="mt-6 max-w-xl text-lg text-white/80 md:text-xl">
            La metCasa transformam cautarea de locuinta intr-o experienta
            simpla. Apartamente, case si terenuri verificate, cu un agent care
            iti raspunde cand ai nevoie.
          </p>

          <div class="mt-10 flex flex-wrap gap-4">
            <UiButton to="/anunturi" variant="accent" size="lg" rounded="full">
              Vezi anunturile
              <template #iconRight><span aria-hidden="true">&rarr;</span></template>
            </UiButton>
            <a
              href="#despre-noi"
              class="inline-flex items-center gap-2 rounded-full border border-white/30 px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10"
            >
              Despre noi
            </a>
          </div>

          <div class="mt-14 max-w-2xl border-t border-white/15 pt-8">
            <p class="text-base font-medium text-white/80 md:text-lg">
              <span class="text-white">Mediere</span>
              <span class="mx-3 text-white/40">&middot;</span>
              <span class="text-white">Evaluare</span>
              <span class="mx-3 text-white/40">&middot;</span>
              <span class="text-white">Tranzactii</span>
            </p>
            <p class="mt-2 text-sm text-white/60">
              imobiliare in Iasi
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Despre noi -->
    <section id="despre-noi" class="mx-auto max-w-7xl px-6 py-20 md:px-12">
      <div class="grid grid-cols-1 gap-12 md:grid-cols-2 md:items-center">
        <div>
          <span class="text-sm font-semibold uppercase tracking-widest text-purple-500">
            Despre metCasa
          </span>
          <h2 class="mt-3 text-4xl font-bold text-purple-900 md:text-5xl">
            Mediere, Evaluare, Tranzactii imobiliare.
          </h2>
          <p class="mt-6 text-lg leading-relaxed text-purple-800/80">
            metCasa este o agentie imobiliara tanara, construita pe ideea ca o
            casa nu se vinde doar cu o poza si un pret. Te ascult, verific
            fiecare anunt si te insotesc de la prima vizionare pana la semnarea
            actelor.
          </p>
          <p class="mt-4 text-lg leading-relaxed text-purple-800/80">
            Lucrez cu apartamente, case, terenuri si spatii comerciale in Iasi
            si imprejurimi. Fiecare proprietate listata pe metCasa trece
            printr-o verificare de baza inainte sa ajunga la tine.
          </p>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div
            class="rounded-2xl border border-purple-900/10 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div class="text-3xl">🏡</div>
            <h3 class="mt-4 text-lg font-semibold text-purple-900">
              Proprietati verificate
            </h3>
            <p class="mt-2 text-sm text-purple-800/70">
              Fiecare anunt este validat inainte sa apara pe platforma.
            </p>
          </div>
          <div
            class="rounded-2xl border border-purple-900/10 bg-white p-6 shadow-sm transition-shadow hover:shadow-md sm:translate-y-6"
          >
            <div class="text-3xl">🤝</div>
            <h3 class="mt-4 text-lg font-semibold text-purple-900">
              Consultanta gratuita
            </h3>
            <p class="mt-2 text-sm text-purple-800/70">
              Discutam buget, zona si optiuni fara nicio obligatie.
            </p>
          </div>
          <div
            class="rounded-2xl border border-purple-900/10 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div class="text-3xl">📄</div>
            <h3 class="mt-4 text-lg font-semibold text-purple-900">
              Acte si contracte
            </h3>
            <p class="mt-2 text-sm text-purple-800/70">
              Te asistam cu documentatia, de la antecontract la notar.
            </p>
          </div>
          <div
            class="rounded-2xl border border-purple-900/10 bg-white p-6 shadow-sm transition-shadow hover:shadow-md sm:translate-y-6"
          >
            <div class="text-3xl">📍</div>
            <h3 class="mt-4 text-lg font-semibold text-purple-900">
              Cunosc zona
            </h3>
            <p class="mt-2 text-sm text-purple-800/70">
              Lucrez local si stiu fiecare cartier din Iasi.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA final -->
    <section class="mx-auto max-w-7xl px-6 pb-20 md:px-12">
      <div
        class="overflow-hidden rounded-3xl bg-purple-900 px-8 py-14 text-center shadow-xl md:px-16 md:py-20"
      >
        <h2 class="text-3xl font-bold text-white md:text-4xl">
          Gata sa-ti gasesti urmatoarea casa?
        </h2>
        <p class="mx-auto mt-4 max-w-xl text-base text-white/70 md:text-lg">
          Rasfoieste anunturile actualizate sau lasa-mi un mesaj si te
          contactez eu.
        </p>
        <UiButton to="/anunturi" variant="accent" size="lg" rounded="full" class="mt-8">
          Exploreaza anunturile
          <template #iconRight><span aria-hidden="true">&rarr;</span></template>
        </UiButton>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "default",
})
</script>
