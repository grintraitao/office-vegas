<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  amount: number
  size?: 'sm' | 'md' | 'lg'
  showChange?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  showChange: false,
})

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-xl',
}

const iconSizes = {
  sm: 'text-sm',
  md: 'text-lg',
  lg: 'text-2xl',
}

const formatNumber = (num: number) => num.toLocaleString()

const changeAmount = ref<number | null>(null)
const showChangeAnimation = ref(false)

watch(
  () => props.amount,
  (newVal, oldVal) => {
    if (props.showChange && oldVal !== undefined) {
      const diff = newVal - oldVal
      if (diff !== 0) {
        changeAmount.value = diff
        showChangeAnimation.value = true
        setTimeout(() => {
          showChangeAnimation.value = false
        }, 1500)
      }
    }
  }
)
</script>

<template>
  <div class="relative inline-flex items-center gap-1 font-semibold text-gray-900">
    <span :class="iconSizes[props.size]">💰</span>
    <span :class="sizeClasses[props.size]">{{ formatNumber(amount) }}</span>
    <Transition name="change">
      <span
        v-if="showChange && showChangeAnimation && changeAmount !== null"
        :class="[
          'absolute -top-4 left-1/2 -translate-x-1/2 text-sm font-bold',
          changeAmount > 0 ? 'text-green-500' : 'text-red-500',
        ]"
      >
        {{ changeAmount > 0 ? '+' : '' }}{{ formatNumber(changeAmount) }}
      </span>
    </Transition>
  </div>
</template>

<style scoped>
.change-enter-active {
  transition: all 0.3s ease-out;
}

.change-leave-active {
  transition: all 0.5s ease-in;
}

.change-enter-from {
  opacity: 0;
  transform: translate(-50%, 0);
}

.change-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}
</style>
