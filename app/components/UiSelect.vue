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

    <select
      :id="inputId"
      :value="modelValue"
      :required="required"
      :disabled="disabled"
      :class="selectClasses"
      @change="onChange"
    >
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <option
        v-for="opt in normalizedOptions"
        :key="String(opt.value)"
        :value="opt.value"
      >
        {{ opt.label }}
      </option>
    </select>

    <p v-if="error" class="text-xs text-red-600">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
type Option = { value: string | number; label: string }

interface Props {
  modelValue?: string | number | null
  options: Array<string | Option>
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  id?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  "update:modelValue": [value: string | number]
}>()

const autoId = useId()
const inputId = computed(() => props.id ?? autoId)

const normalizedOptions = computed<Option[]>(() =>
  props.options.map((o) =>
    typeof o === "string" || typeof o === "number"
      ? { value: o, label: String(o) }
      : o,
  ),
)

const selectClasses = computed(() => [
  "w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-purple-900 focus:outline-none transition-colors",
  props.error
    ? "border-red-300 focus:border-red-500"
    : "border-purple-900/15 focus:border-purple-500",
  props.disabled ? "bg-grey-10 text-purple-800/40 cursor-not-allowed" : "",
])

const onChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit("update:modelValue", target.value)
}
</script>
