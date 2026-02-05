<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const isManager = computed(() => userStore.isManager)

interface Tab {
  icon: string
  label: string
  path: string
}

const employeeTabs: Tab[] = [
  { icon: '🏠', label: 'Dashboard', path: '/employee' },
  { icon: '🏆', label: 'Xếp Hạng', path: '/employee/leaderboard' },
  { icon: '🎰', label: 'Xổ Số', path: '/employee/lottery' },
  { icon: '🎁', label: 'Đổi Thưởng', path: '/employee/redeem' },
]

const managerTabs: Tab[] = [
  { icon: '🏠', label: 'Dashboard', path: '/manager' },
  { icon: '📥', label: 'Duyệt Task', path: '/manager/reviews' },
  { icon: '🏆', label: 'Xếp Hạng', path: '/manager/leaderboard' },
  { icon: '🎁', label: 'Phần Thưởng', path: '/manager/rewards' },
]

const tabs = computed(() => (isManager.value ? managerTabs : employeeTabs))

const isActive = (path: string) => route.path === path

const navigate = (path: string) => {
  router.push(path)
}
</script>

<template>
  <!-- Desktop: Top bar under header -->
  <nav class="hidden md:block glass-dark border-b border-white/10">
    <div class="max-w-5xl mx-auto px-4">
      <div class="flex gap-1">
        <button
          v-for="tab in tabs"
          :key="tab.path"
          :class="[
            'flex items-center gap-2 py-3 px-4 text-sm font-medium transition-all duration-200 rounded-t-lg',
            isActive(tab.path)
              ? 'bg-white/10 text-white border-b-2 border-purple-400'
              : 'text-purple-200/70 hover:text-white hover:bg-white/5',
          ]"
          @click="navigate(tab.path)"
        >
          <span>{{ tab.icon }}</span>
          <span>{{ tab.label }}</span>
        </button>
      </div>
    </div>
  </nav>

  <!-- Mobile: Fixed bottom bar -->
  <nav class="md:hidden fixed bottom-0 left-0 right-0 glass-dark border-t border-white/10 z-50">
    <div class="flex justify-around">
      <button
        v-for="tab in tabs"
        :key="tab.path"
        :class="[
          'flex flex-col items-center py-3 px-2 text-xs font-medium transition-all duration-200 flex-1',
          isActive(tab.path)
            ? 'text-white'
            : 'text-purple-200/60 hover:text-white',
        ]"
        @click="navigate(tab.path)"
      >
        <span
          :class="[
            'text-xl mb-1 transition-transform duration-200',
            isActive(tab.path) ? 'scale-110' : ''
          ]"
        >{{ tab.icon }}</span>
        <span>{{ tab.label }}</span>
        <div
          v-if="isActive(tab.path)"
          class="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-full"
        />
      </button>
    </div>
  </nav>
</template>
