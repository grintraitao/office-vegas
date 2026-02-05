<script setup lang="ts">
interface Props {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'neutral',
})

const variantClasses = {
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  danger: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
  neutral: 'bg-elevated text-base',
}
</script>

<template>
  <span
    :class="[
      'inline-flex items-center px-2.5 py-1 text-sm font-medium rounded-full',
      variantClasses[props.variant],
    ]"
  >
    <slot />
  </span>
</template>
