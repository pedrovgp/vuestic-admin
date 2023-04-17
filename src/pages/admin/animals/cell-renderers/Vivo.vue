<template>
  <div class="vivo-cell-div">
    <va-icon v-if="params.data.vivo" class="mr-2" name="sentiment_satisfied" color="success" />
    <va-icon v-else class="mr-2" name="sentiment_very_dissatisfied" color="danger" />
  </div>
</template>

<script lang="ts">
  export default {
    name: 'Vivo',
  }
</script>

<script setup lang="ts">
  export interface Props {
    params: any
  }

  withDefaults(defineProps<Props>(), {
    params: () => 'Erro ao carregar nome',
  })
</script>

<style></style>
