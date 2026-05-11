<template>
  <nav
    v-if="totalPages > 1"
    class="flex flex-col items-center justify-between gap-4 sm:flex-row"
    aria-label="Paginare"
  >
    <p v-if="totalItems !== undefined" class="text-sm text-purple-800/70">
      Afisez
      <strong class="text-purple-900">{{ rangeStart }}-{{ rangeEnd }}</strong>
      din
      <strong class="text-purple-900">{{ totalItems }}</strong>
      {{ totalItems === 1 ? "rezultat" : "rezultate" }}
    </p>

    <div class="flex items-center gap-1">
      <button
        type="button"
        :disabled="currentPage === 1"
        :class="navClasses"
        aria-label="Pagina anterioara"
        @click="goTo(currentPage - 1)"
      >
        <span aria-hidden="true">&larr;</span>
        <span class="hidden md:inline">Inapoi</span>
      </button>

      <template v-for="(item, idx) in items" :key="idx">
        <span
          v-if="item === 'ellipsis'"
          class="px-2 text-sm text-purple-800/50 select-none"
          aria-hidden="true"
        >
          …
        </span>
        <button
          v-else
          type="button"
          :class="pageClasses(item)"
          :aria-current="item === currentPage ? 'page' : undefined"
          :aria-label="`Pagina ${item}`"
          @click="goTo(item)"
        >
          {{ item }}
        </button>
      </template>

      <button
        type="button"
        :disabled="currentPage === totalPages"
        :class="navClasses"
        aria-label="Pagina urmatoare"
        @click="goTo(currentPage + 1)"
      >
        <span class="hidden md:inline">Inainte</span>
        <span aria-hidden="true">&rarr;</span>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
interface Props {
  currentPage: number
  totalPages: number
  totalItems?: number
  pageSize?: number
  siblings?: number
}

const props = withDefaults(defineProps<Props>(), {
  siblings: 1,
})

const emit = defineEmits<{
  "update:currentPage": [page: number]
}>()

const goTo = (page: number) => {
  if (page < 1 || page > props.totalPages || page === props.currentPage) return
  emit("update:currentPage", page)
}

const rangeStart = computed(() => {
  if (!props.pageSize) return 0
  return (props.currentPage - 1) * props.pageSize + 1
})

const rangeEnd = computed(() => {
  if (!props.pageSize || props.totalItems === undefined) return 0
  return Math.min(props.currentPage * props.pageSize, props.totalItems)
})

type Item = number | "ellipsis"

const items = computed<Item[]>(() => {
  const total = props.totalPages
  const current = props.currentPage
  const siblings = props.siblings

  const totalSlots = siblings * 2 + 5

  if (total <= totalSlots) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const leftSibling = Math.max(current - siblings, 1)
  const rightSibling = Math.min(current + siblings, total)

  const showLeftEllipsis = leftSibling > 2
  const showRightEllipsis = rightSibling < total - 1

  const first = 1
  const last = total

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftCount = 3 + 2 * siblings
    const left = Array.from({ length: leftCount }, (_, i) => i + 1)
    return [...left, "ellipsis", last]
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightCount = 3 + 2 * siblings
    const right = Array.from(
      { length: rightCount },
      (_, i) => total - rightCount + 1 + i,
    )
    return [first, "ellipsis", ...right]
  }

  const middle = Array.from(
    { length: rightSibling - leftSibling + 1 },
    (_, i) => leftSibling + i,
  )
  return [first, "ellipsis", ...middle, "ellipsis", last]
})

const navClasses = [
  "inline-flex h-9 items-center gap-1 rounded-lg border border-purple-900/15 bg-white px-3 text-sm font-medium text-purple-900 transition-colors",
  "hover:border-purple-500 hover:text-purple-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-purple-900/15 disabled:hover:text-purple-900",
]

const pageClasses = (page: number) => [
  "inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-sm font-medium transition-colors",
  page === props.currentPage
    ? "bg-purple-900 text-white"
    : "border border-purple-900/15 bg-white text-purple-900 hover:border-purple-500 hover:text-purple-500",
]
</script>
