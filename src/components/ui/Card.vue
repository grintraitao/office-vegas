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
  default: 'bg-white rounded-xl shadow-sm border border-gray-100',
  glass: 'glass rounded-xl',
  solid: 'bg-slate-800/80 rounded-xl border border-white/10',
}
</script>

<template>
  <div :class="variantClasses[props.variant]">
    <div v-if="$slots.header || title" class="px-5 py-4 border-b border-white/10">
      <slot name="header">
        <h3 class="text-lg font-semibold text-white">{{ title }}</h3>
      </slot>
    </div>
    <div :class="paddingClasses[props.padding]">
      <slot />
    </div>
    <div v-if="$slots.footer" class="px-5 py-4 bg-white/5 border-t border-white/10 rounded-b-xl">
      <slot name="footer" />
    </div>
  </div>
</template>
