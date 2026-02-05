<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Props {
  min?: number
  max?: number
  lowValue: number
  highValue: number
  minGap?: number
  resultMarker?: number | null
  isHit?: boolean | null
}

const props = withDefaults(defineProps<Props>(), {
  min: 1,
  max: 1000,
  minGap: 10,
  resultMarker: null,
  isHit: null,
})

const emit = defineEmits<{
  'update:lowValue': [value: number]
  'update:highValue': [value: number]
}>()

const trackRef = ref<HTMLDivElement | null>(null)
const isDraggingLow = ref(false)
const isDraggingHigh = ref(false)

// Computed
const range = computed(() => props.highValue - props.lowValue)
const rangePercent = computed(() => (range.value / (props.max - props.min)) * 100)

const lowPercent = computed(() => ((props.lowValue - props.min) / (props.max - props.min)) * 100)
const highPercent = computed(() => ((props.highValue - props.min) / (props.max - props.min)) * 100)

const filledWidth = computed(() => highPercent.value - lowPercent.value)

// Risk-based color
const riskColor = computed(() => {
  if (range.value > 500) return 'bg-green-500'
  if (range.value >= 200) return 'bg-indigo-500'
  if (range.value >= 50) return 'bg-orange-500'
  return 'bg-red-500'
})

const riskBorderColor = computed(() => {
  if (range.value > 500) return 'border-green-600'
  if (range.value >= 200) return 'border-indigo-600'
  if (range.value >= 50) return 'border-orange-600'
  return 'border-red-600'
})

// Result marker position
const markerPercent = computed(() => {
  if (props.resultMarker === null) return 0
  return ((props.resultMarker - props.min) / (props.max - props.min)) * 100
})

// Convert pixel position to value
const positionToValue = (clientX: number): number => {
  if (!trackRef.value) return props.min
  const rect = trackRef.value.getBoundingClientRect()
  const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
  return Math.round(props.min + percent * (props.max - props.min))
}

// Handle drag for low handle
const startDragLow = (e: MouseEvent | TouchEvent) => {
  e.preventDefault()
  isDraggingLow.value = true
}

const startDragHigh = (e: MouseEvent | TouchEvent) => {
  e.preventDefault()
  isDraggingHigh.value = true
}

const handleMove = (e: MouseEvent | TouchEvent) => {
  if (!isDraggingLow.value && !isDraggingHigh.value) return

  const clientX = 'touches' in e ? (e.touches[0]?.clientX ?? 0) : e.clientX
  const value = positionToValue(clientX)

  if (isDraggingLow.value) {
    // Low handle: can't go above high - minGap, can't go below min
    const maxLow = props.highValue - props.minGap
    const newValue = Math.max(props.min, Math.min(maxLow, value))
    emit('update:lowValue', newValue)
  } else if (isDraggingHigh.value) {
    // High handle: can't go below low + minGap, can't go above max
    const minHigh = props.lowValue + props.minGap
    // Also enforce max gap of 940
    const maxGapHigh = props.lowValue + 940
    const newValue = Math.min(props.max, Math.min(maxGapHigh, Math.max(minHigh, value)))
    emit('update:highValue', newValue)
  }
}

const stopDrag = () => {
  isDraggingLow.value = false
  isDraggingHigh.value = false
}

// Global event listeners
onMounted(() => {
  window.addEventListener('mousemove', handleMove)
  window.addEventListener('mouseup', stopDrag)
  window.addEventListener('touchmove', handleMove)
  window.addEventListener('touchend', stopDrag)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMove)
  window.removeEventListener('mouseup', stopDrag)
  window.removeEventListener('touchmove', handleMove)
  window.removeEventListener('touchend', stopDrag)
})
</script>

<template>
  <div class="relative pt-10 pb-4 px-3 select-none">
    <!-- Low Value Label -->
    <div
      class="absolute top-0 -translate-x-1/2 text-sm font-semibold text-gray-700 bg-white px-2 py-0.5 rounded shadow-sm border transition-all"
      :class="isDraggingLow ? 'scale-110' : ''"
      :style="{ left: `${lowPercent}%` }"
    >
      {{ lowValue }}
    </div>

    <!-- High Value Label -->
    <div
      class="absolute top-0 -translate-x-1/2 text-sm font-semibold text-gray-700 bg-white px-2 py-0.5 rounded shadow-sm border transition-all"
      :class="isDraggingHigh ? 'scale-110' : ''"
      :style="{ left: `${highPercent}%` }"
    >
      {{ highValue }}
    </div>

    <!-- Track -->
    <div ref="trackRef" class="relative h-3 bg-gray-200 rounded-full cursor-pointer">
      <!-- Filled Range -->
      <div
        :class="['absolute h-full rounded-full transition-colors', riskColor, resultMarker !== null && isHit ? 'animate-pulse' : '']"
        :style="{ left: `${lowPercent}%`, width: `${filledWidth}%` }"
      />

      <!-- Result Marker -->
      <Transition name="drop">
        <div
          v-if="resultMarker !== null"
          class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20"
          :style="{ left: `${markerPercent}%` }"
        >
          <!-- Marker dot -->
          <div
            :class="[
              'w-5 h-5 rounded-full border-2 border-white shadow-lg flex items-center justify-center',
              isHit ? 'bg-green-500' : 'bg-red-500',
            ]"
          >
            <span class="text-white text-xs font-bold">{{ isHit ? '✓' : '✗' }}</span>
          </div>
          <!-- Marker value label -->
          <div
            :class="[
              'absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold px-2 py-1 rounded shadow whitespace-nowrap',
              isHit ? 'bg-green-500 text-white' : 'bg-red-500 text-white',
            ]"
          >
            🔴 {{ resultMarker }}
          </div>
          <!-- Result text -->
          <div
            :class="[
              'absolute top-7 left-1/2 -translate-x-1/2 text-xs font-bold whitespace-nowrap',
              isHit ? 'text-green-600' : 'text-red-600',
            ]"
          >
            {{ isHit ? 'HIT! 🎉' : 'MISS! 💀' }}
          </div>
        </div>
      </Transition>

      <!-- Low Handle -->
      <div
        :class="[
          'absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-white rounded-full border-2 shadow-md cursor-grab transition-all z-10',
          riskBorderColor,
          isDraggingLow ? 'scale-125 shadow-lg cursor-grabbing' : 'hover:scale-110',
        ]"
        :style="{ left: `${lowPercent}%` }"
        @mousedown="startDragLow"
        @touchstart="startDragLow"
      />

      <!-- High Handle -->
      <div
        :class="[
          'absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-white rounded-full border-2 shadow-md cursor-grab transition-all z-10',
          riskBorderColor,
          isDraggingHigh ? 'scale-125 shadow-lg cursor-grabbing' : 'hover:scale-110',
        ]"
        :style="{ left: `${highPercent}%` }"
        @mousedown="startDragHigh"
        @touchstart="startDragHigh"
      />
    </div>

    <!-- Min/Max Labels -->
    <div class="flex justify-between mt-2 text-xs text-gray-400">
      <span>{{ min }}</span>
      <span>{{ max }}</span>
    </div>
  </div>
</template>

<style scoped>
.drop-enter-active {
  animation: drop 0.3s ease-out;
}

@keyframes drop {
  0% {
    transform: translateY(-20px) translateX(-50%);
    opacity: 0;
  }
  60% {
    transform: translateY(5px) translateX(-50%);
  }
  100% {
    transform: translateY(-50%) translateX(-50%);
    opacity: 1;
  }
}
</style>
