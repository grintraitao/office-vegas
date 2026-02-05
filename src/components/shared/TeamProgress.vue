<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { Card, ProgressBar } from '@/components/ui'
import { useGameStore } from '@/stores'

interface Props {
  compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  compact: false,
})

const gameStore = useGameStore()

const now = ref(new Date())
let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  timer = setInterval(() => {
    now.value = new Date()
  }, 60000) // Update every minute
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

const game = computed(() => gameStore.currentGame)
const contributions = computed(() => gameStore.teamContributions)

const progressPercent = computed(() => {
  if (!game.value) return 0
  return Math.min(100, (game.value.currentCoins / game.value.targetCoins) * 100)
})

const isGoalReached = computed(() => progressPercent.value >= 100)

const timeRemaining = computed(() => {
  if (!game.value) return null

  const end = new Date(game.value.endDate).getTime()
  const diff = end - now.value.getTime()

  if (diff <= 0) return { expired: true, text: '⏰ Đã hết hạn!' }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  if (days > 0) {
    return { expired: false, text: `${days} ngày ${hours} giờ` }
  }
  return { expired: false, text: `${hours} giờ` }
})

const maxContribution = computed(() => {
  if (contributions.value.length === 0) return 1
  return Math.max(...contributions.value.map(c => c.coins), 1)
})
</script>

<template>
  <Card title="🎯 Team Challenge" padding="md">
    <!-- No Game State -->
    <div v-if="!game" class="text-center py-8">
      <p class="text-gray-500">Chưa có challenge nào</p>
    </div>

    <div v-else class="space-y-4">
      <!-- Game Name -->
      <h3 class="text-xl font-bold text-gray-900">"{{ game.name }}"</h3>

      <!-- Progress Bar -->
      <div>
        <ProgressBar
          :current="game.currentCoins"
          :target="game.targetCoins"
          showLabel
        />
        <div
          v-if="isGoalReached"
          class="mt-2 text-center text-green-600 font-bold text-lg"
        >
          🎉 GOAL REACHED!
        </div>
      </div>

      <!-- Compact Mode: Just show reward -->
      <template v-if="compact">
        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-600">🏆 {{ game.reward }}</span>
          <span
            v-if="timeRemaining"
            :class="timeRemaining.expired ? 'text-red-600' : 'text-gray-500'"
          >
            {{ timeRemaining.expired ? timeRemaining.text : `⏰ Còn ${timeRemaining.text}` }}
          </span>
        </div>
      </template>

      <!-- Full Mode: Show all details -->
      <template v-else>
        <!-- Info -->
        <div class="space-y-2 text-sm">
          <div class="flex items-center gap-2">
            <span class="text-gray-600">🏆 Reward:</span>
            <span class="font-medium text-gray-900">{{ game.reward }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-gray-600">💰 Sponsor:</span>
            <span class="font-medium text-gray-900">{{ game.sponsor }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-gray-600">⏰ Còn lại:</span>
            <span
              :class="[
                'font-medium',
                timeRemaining?.expired ? 'text-red-600' : 'text-gray-900'
              ]"
            >
              {{ timeRemaining?.text || 'N/A' }}
            </span>
          </div>
        </div>

        <!-- Contributions -->
        <div class="pt-4 border-t border-gray-100">
          <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <span>👥</span>
            <span>Đóng góp:</span>
          </h4>

          <div v-if="contributions.length === 0" class="text-sm text-gray-400">
            Chưa có đóng góp nào
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="contributor in contributions"
              :key="contributor.id"
              class="flex items-center gap-3"
            >
              <span class="w-16 text-sm font-medium text-gray-700 truncate">
                {{ contributor.name }}
              </span>
              <div class="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                <div
                  class="h-full bg-indigo-500 rounded-full transition-all duration-300"
                  :style="{ width: `${(contributor.coins / maxContribution) * 100}%` }"
                />
              </div>
              <span class="text-sm text-gray-600 w-24 text-right">
                {{ contributor.coins }} <span class="text-gray-400">({{ contributor.percentage }}%)</span>
              </span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </Card>
</template>
