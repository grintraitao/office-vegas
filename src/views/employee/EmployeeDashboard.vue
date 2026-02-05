<script setup lang="ts">
import { StatsBar, SubmitTaskForm, MyTasksList } from '@/components/employee'
import { TeamProgress } from '@/components/shared'
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-base">Dashboard</h1>
      <p class="text-muted mt-1">Submit your daily outcomes and earn coins!</p>
    </div>

    <!-- Stats Bar -->
    <StatsBar />

    <!-- Team Progress (Compact) -->
    <TeamProgress compact />

    <!-- Main Content -->
    <div class="grid gap-6 md:grid-cols-2">
      <SubmitTaskForm />
      <MyTasksList />
    </div>
  </div>
</template>
