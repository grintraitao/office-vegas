<script setup lang="ts">
import { ManagerStatsBar, GameControl } from '@/components/manager'
import { TeamProgress } from '@/components/shared'
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-base">Dashboard</h1>
      <p class="text-muted mt-1">Quản lý game và theo dõi tiến độ team</p>
    </div>

    <!-- Stats Bar -->
    <ManagerStatsBar />

    <!-- Game Control -->
    <GameControl />

    <!-- Team Progress (Full) -->
    <TeamProgress />
  </div>
</template>
