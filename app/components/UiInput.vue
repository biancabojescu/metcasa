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
        :type="type"
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
      <div v-if="$slots.suffix" class="absolute right-3 top-1/2 -translate-y-1/2">
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
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  modelValue: "",
})

const emit = defineEmits<{
  "update:modelValue": [value: string | number | null]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const autoId = useId()
const inputId = computed(() => props.id ?? autoId)

const inputClasses = computed(() => [
  "w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-purple-900",
  "placeholder:text-purple-900/40 focus:outline-none transition-colors",
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
