<template>
  <div class="animal-cell-div">
    <va-chip :to="'animals/' + params.data.idmae.id" size="small"
      >{{ params.data.idmae.nome }} - Br. {{ params.data.idmae.brinco }}</va-chip
    >
  </div>
</template>

<script setup lang="ts">
  export interface Props {
    params: any
  }

  const props = withDefaults(defineProps<Props>(), {
    params: () => 'Erro ao carregar nome',
  })
</script>

<style></style>
