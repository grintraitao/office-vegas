<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  current: number
  target: number
  showLabel?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showLabel: false,
})

const percentage = computed(() => Math.min(100, Math.max(0, (props.current / props.target) * 100)))

const formatNumber = (num: number) => num.toLocaleString()
</script>

<template>
  <div class="w-full">
    <div v-if="showLabel" class="flex justify-between mb-1">
      <span class="text-sm font-medium text-gray-700">
        {{ formatNumber(current) }} / {{ formatNumber(target) }}
      </span>
      <span class="text-sm font-medium text-gray-700">{{ Math.round(percentage) }}%</span>
    </div>
    <div class="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
      <div
        class="h-full bg-indigo-600 rounded-full transition-all duration-300"
        :style="{ width: `${percentage}%` }"
      />
    </div>
  </div>
</template>
