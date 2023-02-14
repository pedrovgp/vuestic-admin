]
<template>
  <suspense>
    <template #default>
      {{ animals }}
    </template>
    <template #fallback>
      <p>Loading...</p>
    </template>
  </suspense>
</template>

<script setup lang="ts">
  import { ref, watchEffect } from 'vue'
  import AnimalApi from '../../../services/fam/fam'

  const animals: any = ref(null)

  watchEffect(async () => {
    // this effect will run immediately and then
    // re-run whenever currentBranch.value changes
    animals.value = await (await AnimalApi.getAll()).data
  })
</script>

<style lang="scss">
  .va-tabs__tabs {
    height: 100%;
  }
</style>
