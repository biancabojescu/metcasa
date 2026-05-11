<template>
  <component
    :is="tag"
    :type="isButton ? type : undefined"
    :to="to"
    :href="href"
    :disabled="isButton ? disabled || loading : undefined"
    :class="buttonClasses"
  >
    <span v-if="loading" class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
    <slot v-else name="iconLeft" />
    <slot />
    <slot name="iconRight" />
  </component>
</template>

<script setup lang="ts">
type Variant = "primary" | "secondary" | "danger" | "ghost" | "accent"
type Size = "sm" | "md" | "lg"

interface Props {
  variant?: Variant
  size?: Size
  type?: "button" | "submit" | "reset"
  block?: boolean
  disabled?: boolean
  loading?: boolean
  rounded?: "lg" | "full"
  to?: string | object
  href?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  size: "md",
  type: "button",
  rounded: "lg",
})

const tag = computed(() => {
  if (props.to) return resolveComponent("NuxtLink")
  if (props.href) return "a"
  return "button"
})

const isButton = computed(() => !props.to && !props.href)

const SIZE_CLASSES: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-sm md:text-base",
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-purple-900 text-white shadow-sm hover:bg-purple-500 disabled:bg-purple-900/40",
  secondary:
    "border border-purple-900/15 bg-white text-purple-900 hover:border-purple-500 hover:text-purple-500 disabled:opacity-50",
  danger:
    "border border-red-200 bg-white text-red-600 hover:bg-red-50 disabled:opacity-50",
  ghost:
    "text-purple-900 hover:bg-purple-900/5 disabled:opacity-50",
  accent:
    "bg-green-400 text-purple-900 shadow-md shadow-green-400/30 hover:bg-green-300 disabled:opacity-50",
}

const buttonClasses = computed(() => [
  "inline-flex items-center justify-center gap-2 font-semibold transition-all disabled:cursor-not-allowed",
  props.rounded === "full" ? "rounded-full" : "rounded-lg",
  SIZE_CLASSES[props.size],
  VARIANT_CLASSES[props.variant],
  props.block ? "w-full" : "",
])
</script>
