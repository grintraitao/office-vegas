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
  <nav class="hidden md:block bg-base-100 border-b border-base-300">
    <div class="max-w-5xl mx-auto px-4">
      <div class="tabs tabs-bordered">
        <button
          v-for="tab in tabs"
          :key="tab.path"
          :class="[
            'tab tab-lg gap-2',
            isActive(tab.path) ? 'tab-active' : '',
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
  <nav class="btm-nav md:hidden z-50">
    <button
      v-for="tab in tabs"
      :key="tab.path"
      :class="[isActive(tab.path) ? 'active' : '']"
      @click="navigate(tab.path)"
    >
      <span class="text-xl">{{ tab.icon }}</span>
      <span class="btm-nav-label">{{ tab.label }}</span>
    </button>
  </nav>
</template>
