<script setup lang="ts">
import { Button } from '@/components/ui'
import { useRouter } from 'vue-router'

const router = useRouter()

const enterAs = (role: 'employee' | 'manager') => {
  router.push(`/${role}`)
}
</script>

<template>
  <div class="min-h-screen bg-vegas flex items-center justify-center px-4">
    <div class="text-center">
      <div class="text-7xl mb-6 animate-float">🎰</div>
      <h1 class="text-4xl md:text-6xl font-bold text-gradient mb-4">OfficeVegas</h1>
      <p class="text-xl text-purple-200/80 mb-10">Gamify your daily work outcomes</p>

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
          @click="enterAs('manager')"
        >
          Vào với tư cách Manager
        </Button>
      </div>
    </div>
  </div>
</template>
