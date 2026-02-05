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
  'w-full px-4 py-2 rounded-lg border transition-colors duration-200',
  'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
  'disabled:bg-gray-100 disabled:cursor-not-allowed',
  props.error ? 'border-red-500' : 'border-gray-300',
])
</script>

<script lang="ts">
import { computed } from 'vue'
</script>

<template>
  <div class="w-full">
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1">
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
