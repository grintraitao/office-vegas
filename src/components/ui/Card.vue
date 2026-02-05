<script setup lang="ts">
interface Props {
  title?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  padding: 'md',
})

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-8',
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100">
    <div v-if="$slots.header || title" class="px-5 py-4 border-b border-gray-100">
      <slot name="header">
        <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
      </slot>
    </div>
    <div :class="paddingClasses[props.padding]">
      <slot />
    </div>
    <div v-if="$slots.footer" class="px-5 py-4 bg-gray-50 border-t border-gray-100 rounded-b-xl">
      <slot name="footer" />
    </div>
  </div>
</template>
