<template>
  <span :class="badgeClasses">
    <slot />
  </span>
</template>

<script setup lang="ts">
type Variant = "green" | "purple" | "red" | "neutral" | "soft-green" | "soft-purple"
type Size = "sm" | "md"

interface Props {
  variant?: Variant
  size?: Size
  rounded?: "full" | "lg"
}

const props = withDefaults(defineProps<Props>(), {
  variant: "neutral",
  size: "md",
  rounded: "full",
})

const VARIANTS: Record<Variant, string> = {
  green: "bg-green-400 text-purple-900",
  purple: "bg-purple-500 text-white",
  red: "bg-red-100 text-red-700",
  neutral: "bg-purple-900/10 text-purple-900",
  "soft-green": "bg-green-100 text-green-700",
  "soft-purple": "bg-purple-500/10 text-purple-500",
}

const SIZES: Record<Size, string> = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-3 py-1 text-xs",
}

const badgeClasses = computed(() => [
  "inline-flex items-center font-semibold uppercase tracking-wider",
  props.rounded === "full" ? "rounded-full" : "rounded-lg",
  VARIANTS[props.variant],
  SIZES[props.size],
])
</script>
