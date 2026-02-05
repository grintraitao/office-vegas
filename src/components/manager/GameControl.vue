<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, Button, ProgressBar, Modal } from '@/components/ui'
import { useGameStore } from '@/stores'
import CreateGameModal from './CreateGameModal.vue'

const gameStore = useGameStore()

const showCreateModal = ref(false)
const showEndConfirm = ref(false)
const isEditMode = ref(false)

const game = computed(() => gameStore.currentGame)
const progress = computed(() => gameStore.teamProgress)
const daysRemaining = computed(() => gameStore.daysRemaining)
const isActive = computed(() => gameStore.isGameActive)

const openCreateModal = (edit = false) => {
  isEditMode.value = edit
  showCreateModal.value = true
}

const handleEndGame = () => {
  gameStore.endGame()
  showEndConfirm.value = false
}
</script>

<template>
  <Card padding="md">
    <!-- Has Active Game -->
    <template v-if="game && isActive">
      <div class="flex items-start justify-between gap-4">
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-lg">🎮</span>
            <span class="text-sm font-medium text-gray-500">GAME HIỆN TẠI:</span>
            <span class="font-semibold text-gray-900">"{{ game.name }}"</span>
          </div>

          <div class="flex items-center gap-4">
            <div class="flex-1">
              <ProgressBar :current="game?.currentCoins ?? 0" :target="game?.targetCoins ?? 1" show-label />
            </div>
            <div class="text-sm text-gray-600 whitespace-nowrap">
              Còn <span class="font-semibold text-indigo-600">{{ daysRemaining }}</span> ngày
            </div>
          </div>

          <div class="mt-3 flex items-center gap-2 text-sm text-gray-500">
            <span>🎯 {{ game.targetCoins }} coins</span>
            <span class="text-gray-300">|</span>
            <span>🏆 {{ game.reward }}</span>
            <span class="text-gray-300">|</span>
            <span>💰 {{ game.sponsor }}</span>
          </div>
        </div>
      </div>

      <div class="mt-4 pt-4 border-t border-gray-100 flex gap-2">
        <Button variant="secondary" size="sm" @click="openCreateModal(true)">
          📝 Chỉnh sửa
        </Button>
        <Button variant="danger" size="sm" @click="showEndConfirm = true">
          🗑️ Kết thúc sớm
        </Button>
        <Button size="sm" @click="openCreateModal(false)">
          + Tạo mới
        </Button>
      </div>
    </template>

    <!-- No Active Game -->
    <template v-else>
      <div class="text-center py-4">
        <div class="text-lg mb-2">🎮 Chưa có game nào đang chạy</div>
        <Button @click="openCreateModal(false)">
          + Tạo Game Mới 🚀
        </Button>
      </div>
    </template>
  </Card>

  <!-- Create/Edit Modal -->
  <CreateGameModal
    :is-open="showCreateModal"
    :edit-game="isEditMode ? game : null"
    @close="showCreateModal = false"
  />

  <!-- End Game Confirmation Modal -->
  <Modal :is-open="showEndConfirm" title="⚠️ Kết thúc Game" size="sm" @close="showEndConfirm = false">
    <div class="space-y-4">
      <p class="text-gray-600">
        Bạn có chắc muốn kết thúc game <span class="font-semibold">"{{ game?.name }}"</span> sớm?
      </p>
      <div class="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm">
        <p class="font-medium text-amber-800 mb-1">Bonus sẽ được phát:</p>
        <ul class="text-amber-700 space-y-0.5">
          <li>🥇 Top 1: {{ game?.bonusTop1 }} coins</li>
          <li>🥈 Top 2: {{ game?.bonusTop2 }} coins</li>
          <li>🥉 Top 3: {{ game?.bonusTop3 }} coins</li>
        </ul>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-3">
        <Button variant="secondary" @click="showEndConfirm = false">Hủy</Button>
        <Button variant="danger" @click="handleEndGame">Kết thúc Game</Button>
      </div>
    </template>
  </Modal>
</template>
