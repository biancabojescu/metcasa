<template>
  <div class="flex flex-col gap-1.5">
    <label
      v-if="label"
      :for="inputId"
      class="text-xs font-semibold uppercase tracking-wider text-purple-900"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <div class="relative">
      <input
        :id="inputId"
        :value="modelValue"
        :type="effectiveType"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :autocomplete="autocomplete"
        :min="min"
        :max="max"
        :minlength="minlength"
        :class="inputClasses"
        @input="onInput"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
      />
      <button
        v-if="showRevealButton"
        type="button"
        :aria-label="passwordVisible ? 'Ascunde parola' : 'Afiseaza parola'"
        class="absolute right-3 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center text-purple-900/50 transition-colors hover:text-purple-900"
        @click="passwordVisible = !passwordVisible"
      >
        <svg
          v-if="passwordVisible"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-5 w-5"
          aria-hidden="true"
        >
          <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
          <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
          <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
          <line x1="2" x2="22" y1="2" y2="22" />
        </svg>
        <svg
          v-else
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-5 w-5"
          aria-hidden="true"
        >
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>
      <div v-else-if="$slots.suffix" class="absolute right-3 top-1/2 -translate-y-1/2">
        <slot name="suffix" />
      </div>
    </div>

    <p v-if="error" class="text-xs text-red-600">{{ error }}</p>
    <p v-else-if="hint" class="text-xs text-purple-800/60">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string | number | null
  type?: "text" | "email" | "password" | "number" | "tel" | "date" | "url"
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  autocomplete?: string
  min?: number | string
  max?: number | string
  minlength?: number
  error?: string
  hint?: string
  id?: string
  revealable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  modelValue: "",
  revealable: false,
})

const passwordVisible = ref(false)
const showRevealButton = computed(
  () => props.revealable && props.type === "password",
)
const effectiveType = computed(() =>
  showRevealButton.value && passwordVisible.value ? "text" : props.type,
)

const emit = defineEmits<{
  "update:modelValue": [value: string | number | null]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const autoId = useId()
const inputId = computed(() => props.id ?? autoId)

const inputClasses = computed(() => [
  "w-full rounded-lg border bg-white py-2.5 text-sm text-purple-900",
  "placeholder:text-purple-900/40 focus:outline-none transition-colors",
  showRevealButton.value ? "pl-3 pr-10" : "px-3",
  props.error
    ? "border-red-300 focus:border-red-500"
    : "border-purple-900/15 focus:border-purple-500",
  props.disabled ? "bg-grey-10 text-purple-800/40 cursor-not-allowed" : "",
])

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (props.type === "number") {
    const num = target.valueAsNumber
    emit("update:modelValue", Number.isNaN(num) ? null : num)
  } else {
    emit("update:modelValue", target.value)
  }
}
</script>
