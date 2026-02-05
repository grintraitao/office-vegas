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
  { icon: '🏆', label: 'Bảng Xếp Hạng', path: '/manager/leaderboard' },
]

const tabs = computed(() => (isManager.value ? managerTabs : employeeTabs))

const isActive = (path: string) => route.path === path

const navigate = (path: string) => {
  router.push(path)
}
</script>

<template>
  <!-- Desktop: Top bar under header -->
  <nav class="hidden md:block bg-white border-b border-gray-200">
    <div class="max-w-5xl mx-auto px-4">
      <div class="flex gap-8">
        <button
          v-for="tab in tabs"
          :key="tab.path"
          :class="[
            'flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-medium transition-colors',
            isActive(tab.path)
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
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
  <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
    <div class="flex justify-around">
      <button
        v-for="tab in tabs"
        :key="tab.path"
        :class="[
          'flex flex-col items-center py-2 px-4 text-xs font-medium transition-colors flex-1',
          isActive(tab.path) ? 'text-indigo-600' : 'text-gray-500',
        ]"
        @click="navigate(tab.path)"
      >
        <span class="text-xl mb-0.5">{{ tab.icon }}</span>
        <span>{{ tab.label }}</span>
      </button>
    </div>
  </nav>
</template>
