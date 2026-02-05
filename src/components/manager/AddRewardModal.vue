<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { Reward, RewardCategory } from '@/types'
import { useRewardStore } from '@/stores'
import { Modal, Button, Input } from '@/components/ui'

const props = defineProps<{
  isOpen: boolean
  editReward?: Reward | null
}>()

const emit = defineEmits<{
  close: []
}>()

const rewardStore = useRewardStore()

const isEditMode = computed(() => !!props.editReward)

const form = ref({
  icon: '',
  name: '',
  description: '',
  cost: 10,
  category: 'fun' as RewardCategory,
  stock: null as number | null,
  hasStock: false,
})

const categories: { value: RewardCategory; label: string }[] = [
  { value: 'fun', label: 'Vui vẻ' },
  { value: 'privilege', label: 'Đặc quyền' },
  { value: 'bonding', label: 'Gắn kết' },
  { value: 'status', label: 'Danh hiệu' },
  { value: 'treat', label: 'Đãi ngộ' },
]

const commonIcons = ['🎁', '☕', '🍕', '🎮', '🎬', '🏆', '💬', '📱', '🪑', '🔙', '🧋', '🍜']

watch(
  () => props.isOpen,
  (open) => {
    if (open && props.editReward) {
      form.value = {
        icon: props.editReward.icon,
        name: props.editReward.name,
        description: props.editReward.description,
        cost: props.editReward.cost,
        category: props.editReward.category,
        stock: props.editReward.stock,
        hasStock: props.editReward.stock !== null,
      }
    } else if (open) {
      resetForm()
    }
  }
)

const resetForm = () => {
  form.value = {
    icon: '🎁',
    name: '',
    description: '',
    cost: 10,
    category: 'fun',
    stock: null,
    hasStock: false,
  }
}

const handleSubmit = () => {
  const rewardData = {
    icon: form.value.icon,
    name: form.value.name,
    description: form.value.description,
    cost: form.value.cost,
    category: form.value.category,
    stock: form.value.hasStock ? (form.value.stock ?? 1) : null,
  }

  if (isEditMode.value && props.editReward) {
    rewardStore.updateReward(props.editReward.id, rewardData)
  } else {
    rewardStore.addReward(rewardData)
  }

  emit('close')
}

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <Modal :isOpen="isOpen" :title="isEditMode ? 'Sửa phần thưởng' : 'Thêm phần thưởng'" @close="handleClose">
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Icon -->
      <div>
        <label class="block text-sm font-medium text-base mb-1">Icon</label>
        <div class="flex items-center gap-2">
          <div class="text-3xl w-12 h-12 flex items-center justify-center bg-elevated rounded-lg">
            {{ form.icon }}
          </div>
          <div class="flex flex-wrap gap-1">
            <button
              v-for="icon in commonIcons"
              :key="icon"
              type="button"
              :class="[
                'text-xl p-1 rounded hover:bg-elevated',
                form.icon === icon ? 'bg-indigo-100' : '',
              ]"
              @click="form.icon = icon"
            >
              {{ icon }}
            </button>
          </div>
        </div>
      </div>

      <!-- Name -->
      <div>
        <label class="block text-sm font-medium text-base mb-1">Tên phần thưởng</label>
        <Input v-model="form.name" placeholder="VD: Coffee/Trà sữa" required />
      </div>

      <!-- Description -->
      <div>
        <label class="block text-sm font-medium text-base mb-1">Mô tả</label>
        <Input v-model="form.description" placeholder="VD: Một ly bất kỳ dưới 50k" />
      </div>

      <!-- Cost -->
      <div>
        <label class="block text-sm font-medium text-base mb-1">Giá (coins)</label>
        <Input v-model.number="form.cost" type="number" min="1" required />
      </div>

      <!-- Category -->
      <div>
        <label class="block text-sm font-medium text-base mb-1">Danh mục</label>
        <select
          v-model="form.category"
          class="w-full px-3 py-2 border border-theme rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option v-for="cat in categories" :key="cat.value" :value="cat.value">
            {{ cat.label }}
          </option>
        </select>
      </div>

      <!-- Stock -->
      <div>
        <label class="flex items-center gap-2">
          <input v-model="form.hasStock" type="checkbox" class="rounded text-indigo-600" />
          <span class="text-sm font-medium text-base">Giới hạn số lượng</span>
        </label>
        <Input
          v-if="form.hasStock"
          v-model.number="form.stock"
          type="number"
          min="1"
          placeholder="Số lượng"
          class="mt-2"
        />
      </div>

      <!-- Actions -->
      <div class="flex gap-3 pt-2">
        <Button type="button" variant="secondary" class="flex-1" @click="handleClose">
          Huỷ
        </Button>
        <Button type="submit" variant="primary" class="flex-1">
          {{ isEditMode ? 'Lưu' : 'Thêm' }}
        </Button>
      </div>
    </form>
  </Modal>
</template>
