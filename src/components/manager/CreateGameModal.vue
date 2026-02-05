<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Modal, Button, Input } from '@/components/ui'
import { useGameStore, useUserStore } from '@/stores'
import type { Game } from '@/types'

interface Props {
  isOpen: boolean
  editGame?: Game | null
}

const props = withDefaults(defineProps<Props>(), {
  editGame: null,
})

const emit = defineEmits<{
  close: []
}>()

const gameStore = useGameStore()
const userStore = useUserStore()

// Form state
const name = ref('')
const targetCoins = ref(500)
const customTarget = ref('')
const reward = ref('')
const sponsorType = ref<'self' | 'company' | 'other'>('self')
const sponsorName = ref('')
const startDate = ref('')
const endDate = ref('')
const bonusTop1 = ref(50)
const bonusTop2 = ref(25)
const bonusTop3 = ref(10)

// Preset targets
const presetTargets = [100, 300, 500, 1000]

// Initialize form when opening/editing
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      if (props.editGame) {
        // Edit mode - populate form
        name.value = props.editGame.name
        targetCoins.value = props.editGame.targetCoins
        if (!presetTargets.includes(props.editGame.targetCoins)) {
          customTarget.value = String(props.editGame.targetCoins)
        }
        reward.value = props.editGame.reward
        sponsorType.value = props.editGame.sponsorType
        sponsorName.value = props.editGame.sponsorType === 'other' ? props.editGame.sponsor : ''
        startDate.value = formatDateForInput(props.editGame.startDate)
        endDate.value = formatDateForInput(props.editGame.endDate)
        bonusTop1.value = props.editGame.bonusTop1
        bonusTop2.value = props.editGame.bonusTop2
        bonusTop3.value = props.editGame.bonusTop3
      } else {
        // Create mode - reset form
        resetForm()
      }
    }
  }
)

const formatDateForInput = (date: Date): string => {
  const d = new Date(date)
  return d.toISOString().split('T')[0] ?? ''
}

const resetForm = () => {
  name.value = ''
  targetCoins.value = 500
  customTarget.value = ''
  reward.value = ''
  sponsorType.value = 'self'
  sponsorName.value = ''
  const today = new Date()
  startDate.value = formatDateForInput(today)
  const nextMonth = new Date(today)
  nextMonth.setMonth(nextMonth.getMonth() + 1)
  endDate.value = formatDateForInput(nextMonth)
  bonusTop1.value = 50
  bonusTop2.value = 25
  bonusTop3.value = 10
}

// Handle target selection
const selectTarget = (target: number) => {
  targetCoins.value = target
  customTarget.value = ''
}

const handleCustomTarget = () => {
  const val = parseInt(customTarget.value)
  if (val > 0) {
    targetCoins.value = val
  }
}

// Computed
const managerNickname = computed(() => {
  const manager = userStore.users.find(u => u.role === 'manager')
  return manager?.nickname || 'Manager'
})

const sponsorDisplay = computed(() => {
  if (sponsorType.value === 'self') return `${managerNickname.value} (Manager)`
  if (sponsorType.value === 'company') return 'Công ty'
  return sponsorName.value || '...'
})

const duration = computed(() => {
  if (!startDate.value || !endDate.value) return 0
  const start = new Date(startDate.value)
  const end = new Date(endDate.value)
  const diff = end.getTime() - start.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
})

const formattedDateRange = computed(() => {
  if (!startDate.value || !endDate.value) return ''
  const start = new Date(startDate.value)
  const end = new Date(endDate.value)
  const formatDate = (d: Date) => `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`
  return `${formatDate(start)} - ${formatDate(end)} (${duration.value} ngày)`
})

const isValid = computed(() => {
  return (
    name.value.trim() &&
    targetCoins.value > 0 &&
    reward.value.trim() &&
    startDate.value &&
    endDate.value &&
    duration.value > 0 &&
    (sponsorType.value !== 'other' || sponsorName.value.trim())
  )
})

// Actions
const handleSubmit = () => {
  if (!isValid.value) return

  const sponsor =
    sponsorType.value === 'self'
      ? managerNickname.value
      : sponsorType.value === 'company'
        ? 'Công ty'
        : sponsorName.value

  const gameData = {
    name: name.value.trim(),
    targetCoins: targetCoins.value,
    reward: reward.value.trim(),
    sponsorType: sponsorType.value,
    sponsor,
    startDate: new Date(startDate.value),
    endDate: new Date(endDate.value),
    bonusTop1: bonusTop1.value,
    bonusTop2: bonusTop2.value,
    bonusTop3: bonusTop3.value,
  }

  if (props.editGame) {
    gameStore.updateGame(gameData)
  } else {
    gameStore.createGame(gameData)
  }

  emit('close')
}

const close = () => {
  emit('close')
}
</script>

<template>
  <Modal :is-open="isOpen" :title="editGame ? '📝 Chỉnh sửa Game' : '🎮 Tạo Game Mới'" size="xl" @close="close">
    <div class="space-y-5 max-h-[70vh] overflow-y-auto pr-2">
      <!-- Game Name -->
      <div>
        <label class="block text-sm font-medium text-base mb-1">Tên game</label>
        <Input v-model="name" placeholder="VD: Sprint Tháng 2" />
      </div>

      <!-- Target Coins -->
      <div>
        <label class="block text-sm font-medium text-base mb-2">🎯 Mục tiêu coins</label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="target in presetTargets"
            :key="target"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-all',
              targetCoins === target && !customTarget
                ? 'bg-indigo-600 text-white'
                : 'bg-elevated text-base hover:brightness-110',
            ]"
            @click="selectTarget(target)"
          >
            {{ target }}
          </button>
          <input
            v-model="customTarget"
            type="number"
            placeholder="Khác..."
            class="w-24 px-3 py-2 rounded-lg border border-theme focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
            @input="handleCustomTarget"
          />
        </div>
      </div>

      <!-- Reward -->
      <div>
        <label class="block text-sm font-medium text-base mb-1">🏆 Phần thưởng</label>
        <Input v-model="reward" placeholder="VD: Trà sữa cả team" />
      </div>

      <!-- Sponsor -->
      <div>
        <label class="block text-sm font-medium text-base mb-2">💰 Ai tài trợ</label>
        <div class="space-y-2">
          <label class="flex items-center gap-2 cursor-pointer">
            <input v-model="sponsorType" type="radio" value="self" class="text-indigo-600" />
            <span>Tự khao (Manager)</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input v-model="sponsorType" type="radio" value="company" class="text-indigo-600" />
            <span>Xin công ty</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input v-model="sponsorType" type="radio" value="other" class="text-indigo-600" />
            <span>Sponsor khác:</span>
            <input
              v-model="sponsorName"
              type="text"
              :disabled="sponsorType !== 'other'"
              placeholder="Tên sponsor..."
              class="flex-1 px-3 py-1 rounded border border-theme disabled:bg-surface disabled:text-faint"
            />
          </label>
        </div>
      </div>

      <!-- Date Range -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-base mb-1">⏰ Bắt đầu</label>
          <input
            v-model="startDate"
            type="date"
            class="w-full px-3 py-2 rounded-lg border border-theme focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-base mb-1">Kết thúc</label>
          <input
            v-model="endDate"
            type="date"
            class="w-full px-3 py-2 rounded-lg border border-theme focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>

      <!-- Bonus -->
      <div>
        <label class="block text-sm font-medium text-base mb-2">🥇 Bonus cuối tháng</label>
        <div class="grid grid-cols-3 gap-3">
          <div>
            <label class="block text-xs text-muted mb-1">Top 1</label>
            <div class="flex items-center gap-1">
              <input
                v-model.number="bonusTop1"
                type="number"
                min="0"
                class="w-full px-3 py-2 rounded-lg border border-theme focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              />
              <span class="text-sm text-muted">coins</span>
            </div>
          </div>
          <div>
            <label class="block text-xs text-muted mb-1">Top 2</label>
            <div class="flex items-center gap-1">
              <input
                v-model.number="bonusTop2"
                type="number"
                min="0"
                class="w-full px-3 py-2 rounded-lg border border-theme focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              />
              <span class="text-sm text-muted">coins</span>
            </div>
          </div>
          <div>
            <label class="block text-xs text-muted mb-1">Top 3</label>
            <div class="flex items-center gap-1">
              <input
                v-model.number="bonusTop3"
                type="number"
                min="0"
                class="w-full px-3 py-2 rounded-lg border border-theme focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              />
              <span class="text-sm text-muted">coins</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Preview -->
      <div class="bg-surface rounded-lg p-4 border border-theme-light">
        <h4 class="text-sm font-medium text-base mb-3">📋 Preview</h4>
        <div class="space-y-1 text-sm">
          <p class="font-semibold text-base">"{{ name || '...' }}"</p>
          <p class="text-muted">Mục tiêu: {{ targetCoins }} coins</p>
          <p class="text-muted">Reward: {{ reward || '...' }}</p>
          <p class="text-muted">Sponsor: {{ sponsorDisplay }}</p>
          <p class="text-muted">Thời gian: {{ formattedDateRange || '...' }}</p>
          <p class="text-muted">Bonus: 🥇{{ bonusTop1 }} 🥈{{ bonusTop2 }} 🥉{{ bonusTop3 }}</p>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-3">
        <Button variant="secondary" @click="close">Hủy</Button>
        <Button :disabled="!isValid" @click="handleSubmit">
          🚀 {{ editGame ? 'Lưu thay đổi' : 'Tạo Game' }}
        </Button>
      </div>
    </template>
  </Modal>
</template>
