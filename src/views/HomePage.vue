<script setup lang="ts">
import { Button } from '@/components/ui'
import { useRouter } from 'vue-router'

const router = useRouter()

const enterAs = (role: 'employee' | 'manager') => {
  router.push(`/${role}`)
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center px-4">
    <div class="text-center">
      <div class="text-6xl mb-4">🎰</div>
      <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">OfficeVegas</h1>
      <p class="text-xl text-white/80 mb-8">Gamify your daily work outcomes</p>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          variant="secondary"
          size="lg"
          @click="enterAs('employee')"
        >
          Vào với tư cách Employee
        </Button>
        <Button
          variant="primary"
          size="lg"
          class="!bg-white !text-indigo-600 hover:!bg-gray-100"
          @click="enterAs('manager')"
        >
          Vào với tư cách Manager
        </Button>
      </div>
    </div>
  </div>
</template>
