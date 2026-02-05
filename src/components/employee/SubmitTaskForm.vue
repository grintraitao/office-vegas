<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card, Button, Input } from '@/components/ui'
import { useUserStore, useGameStore } from '@/stores'

const userStore = useUserStore()
const gameStore = useGameStore()

const title = ref('')
const outcome = ref('')
const showSuccess = ref(false)

const isValid = computed(() => title.value.trim() && outcome.value.trim())

const handleSubmit = () => {
  if (!isValid.value || !userStore.currentUser) return

  gameStore.submitTask({
    userId: userStore.currentUser.id,
    userName: userStore.currentUser.nickname,
    title: title.value.trim(),
    outcome: outcome.value.trim(),
  })

  // Clear form
  title.value = ''
  outcome.value = ''

  // Show success message
  showSuccess.value = true
  setTimeout(() => {
    showSuccess.value = false
  }, 3000)
}
</script>

<template>
  <Card title="📝 Submit Task" padding="md">
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <Input
        v-model="title"
        label="Title"
        placeholder="Tên công việc đã hoàn thành"
      />

      <Input
        v-model="outcome"
        type="textarea"
        label="Outcome"
        placeholder="Mô tả kết quả công việc..."
      />

      <div class="flex items-center gap-3">
        <Button
          type="submit"
          variant="primary"
          :disabled="!isValid"
        >
          Submit Task 🚀
        </Button>

        <Transition name="fade">
          <span v-if="showSuccess" class="text-green-600 text-sm font-medium">
            ✓ Task submitted successfully!
          </span>
        </Transition>
      </div>
    </form>
  </Card>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
