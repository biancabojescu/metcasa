<template>
  <component :is="tag" :class="cardClasses">
    <slot />
  </component>
</template>

<script setup lang="ts">
interface Props {
  tag?: string
  padding?: "none" | "sm" | "md" | "lg"
  hoverable?: boolean
  bordered?: boolean
  shadow?: "none" | "sm" | "md"
}

const props = withDefaults(defineProps<Props>(), {
  tag: "div",
  padding: "md",
  hoverable: false,
  bordered: true,
  shadow: "sm",
})

const PADDING: Record<NonNullable<Props["padding"]>, string> = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
}

const SHADOW: Record<NonNullable<Props["shadow"]>, string> = {
  none: "",
  sm: "shadow-sm",
  md: "shadow-md",
}

const cardClasses = computed(() => [
  "rounded-2xl bg-white",
  props.bordered ? "border border-purple-900/10" : "",
  SHADOW[props.shadow],
  PADDING[props.padding],
  props.hoverable ? "transition-all hover:-translate-y-1 hover:shadow-lg" : "",
])
</script>
