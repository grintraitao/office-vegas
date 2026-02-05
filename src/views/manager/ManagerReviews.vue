<script setup lang="ts">
import { PendingTasksList, RecentlyApproved } from '@/components/manager'
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-base">Duyệt Task</h1>
      <p class="text-muted mt-1">Review và phân phối coins cho team</p>
    </div>

    <!-- Pending Reviews -->
    <PendingTasksList />

    <!-- Recently Approved -->
    <RecentlyApproved />
  </div>
</template>
