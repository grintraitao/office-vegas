<script setup lang="ts">
interface Props {
  modelValue?: string | number
  type?: 'text' | 'email' | 'password' | 'number' | 'textarea'
  label?: string
  placeholder?: string
  error?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  modelValue: '',
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  emit('update:modelValue', props.type === 'number' ? Number(target.value) : target.value)
}

const inputClasses = computed(() => [
  'w-full px-4 py-2 rounded-lg border transition-colors duration-200 bg-surface text-base',
  'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
  'disabled:opacity-50 disabled:cursor-not-allowed',
  props.error ? 'border-red-500' : 'border-theme',
])
</script>

<script lang="ts">
import { computed } from 'vue'
</script>

<template>
  <div class="w-full">
    <label v-if="label" class="block text-sm font-medium text-base mb-1">
      {{ label }}
    </label>
    <textarea
      v-if="type === 'textarea'"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="inputClasses"
      rows="4"
      @input="handleInput"
    />
    <input
      v-else
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="inputClasses"
      @input="handleInput"
    />
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
  </div>
</template>
