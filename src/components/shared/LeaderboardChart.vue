<script setup lang="ts">
import { computed, ref } from 'vue'
import { Card } from '@/components/ui'
import { useLeaderboardStore } from '@/stores'

const leaderboardStore = useLeaderboardStore()

const history = computed(() => leaderboardStore.monthlyTopHistory)
const dominant = computed(() => leaderboardStore.dominantWinner)
const maxCoins = computed(() => leaderboardStore.maxCoins)

// Chart dimensions
const chartHeight = 200
const chartPadding = 40
const dotRadius = 8

// Color mapping
const colorClasses: Record<string, { dot: string; text: string }> = {
  indigo: { dot: 'bg-indigo-500', text: 'text-indigo-600' },
  emerald: { dot: 'bg-emerald-500', text: 'text-emerald-600' },
  pink: { dot: 'bg-pink-500', text: 'text-pink-600' },
  amber: { dot: 'bg-amber-500', text: 'text-amber-600' },
}

// Calculate Y position for a coin value
const getYPosition = (coins: number) => {
  const maxY = maxCoins.value * 1.2 // Add 20% padding
  return chartHeight - chartPadding - ((coins / maxY) * (chartHeight - chartPadding * 2))
}

// Calculate X position for index
const getXPosition = (index: number, total: number) => {
  const usableWidth = 100 - 10 // Percentage, with padding
  return 5 + (index / (total - 1)) * usableWidth
}

// Generate SVG path for line
const linePath = computed(() => {
  if (history.value.length < 2) return ''

  const points = history.value.map((item, index) => {
    const x = getXPosition(index, history.value.length)
    const y = getYPosition(item.coins)
    return `${x},${y}`
  })

  return `M ${points.join(' L ')}`
})

// Y-axis labels
const yAxisLabels = computed(() => {
  const max = maxCoins.value * 1.2
  const step = Math.ceil(max / 4 / 50) * 50 // Round to nearest 50
  const labels = []
  for (let i = 0; i <= 4; i++) {
    labels.push(Math.round(step * i))
  }
  return labels.reverse()
})

// Tooltip
const hoveredIndex = ref<number | null>(null)
</script>

<template>
  <Card title="📊 Top 1 qua các tháng" padding="md">
    <div class="relative">
      <!-- Chart Container -->
      <div class="relative h-64">
        <!-- Y-axis labels -->
        <div class="absolute left-0 top-0 bottom-8 w-10 flex flex-col justify-between text-xs text-gray-400">
          <span v-for="label in yAxisLabels" :key="label">{{ label }}</span>
        </div>

        <!-- Chart Area -->
        <div class="absolute left-12 right-4 top-0 bottom-0">
          <!-- Grid lines -->
          <div class="absolute inset-0 flex flex-col justify-between pointer-events-none">
            <div v-for="i in 5" :key="i" class="border-t border-gray-100 w-full" />
          </div>

          <!-- SVG for line -->
          <svg class="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
            <path
              :d="linePath"
              fill="none"
              stroke="#6366f1"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              vector-effect="non-scaling-stroke"
              class="opacity-50"
            />
          </svg>

          <!-- Data points -->
          <div
            v-for="(item, index) in history"
            :key="item.month"
            class="absolute transform -translate-x-1/2 transition-all duration-200"
            :style="{
              left: `${getXPosition(index, history.length)}%`,
              top: `${getYPosition(item.coins)}px`,
            }"
            @mouseenter="hoveredIndex = index"
            @mouseleave="hoveredIndex = null"
          >
            <!-- Crown -->
            <div class="absolute -top-6 left-1/2 -translate-x-1/2 text-sm">👑</div>

            <!-- Dot -->
            <div
              :class="[
                'w-4 h-4 rounded-full border-2 border-white shadow-md cursor-pointer',
                colorClasses[item.color]?.dot ?? 'bg-indigo-500',
                item.isActive ? 'ring-2 ring-offset-2 ring-gray-300' : '',
              ]"
            />

            <!-- Nickname below dot -->
            <div
              :class="[
                'absolute top-5 left-1/2 -translate-x-1/2 text-xs font-medium whitespace-nowrap',
                colorClasses[item.color]?.text ?? 'text-indigo-600',
              ]"
            >
              {{ item.nickname }}
            </div>

            <!-- Tooltip on hover -->
            <Transition name="fade">
              <div
                v-if="hoveredIndex === index"
                class="absolute bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10"
              >
                {{ item.month }} - {{ item.nickname }}: {{ item.coins }} coins
                <span v-if="item.isActive" class="text-yellow-400 ml-1">(đang diễn ra)</span>
              </div>
            </Transition>
          </div>

          <!-- X-axis labels -->
          <div class="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-gray-400">
            <span
              v-for="(item, index) in history"
              :key="item.month"
              class="text-center"
              :style="{ position: 'absolute', left: `${getXPosition(index, history.length)}%`, transform: 'translateX(-50%)' }"
            >
              {{ item.month.split('/')[0] }}
              <br />
              <span class="text-gray-300">{{ item.month.split('/')[1] }}</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Dominant winner footer -->
      <div class="mt-8 pt-4 border-t border-gray-100 text-center">
        <span class="text-gray-600">
          <span :class="(colorClasses[history.find(h => h.nickname === dominant.nickname)?.color ?? 'indigo']?.text) ?? 'text-indigo-600'" class="font-bold">
            {{ dominant.nickname }}
          </span>
          thống trị {{ dominant.count }}/{{ dominant.total }} tháng 🔥
        </span>
      </div>
    </div>
  </Card>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
