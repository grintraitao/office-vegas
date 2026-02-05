<script setup lang="ts">
interface Props {
  title?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  variant?: 'default' | 'glass' | 'solid'
}

const props = withDefaults(defineProps<Props>(), {
  padding: 'md',
  variant: 'glass',
})

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-8',
}

const variantClasses = {
  default: 'card',
  glass: 'card',
  solid: 'bg-surface rounded-xl border border-theme',
}
</script>

<template>
  <div :class="variantClasses[props.variant]">
    <div v-if="$slots.header || title" class="px-5 py-4 border-b border-theme-light">
      <slot name="header">
        <h3 class="text-lg font-semibold text-base">{{ title }}</h3>
      </slot>
    </div>
    <div :class="paddingClasses[props.padding]">
      <slot />
    </div>
    <div v-if="$slots.footer" class="px-5 py-4 bg-elevated border-t border-theme-light rounded-b-xl">
      <slot name="footer" />
    </div>
  </div>
</template>
