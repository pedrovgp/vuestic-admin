<template>
  <div class="animal-cell-div">
    <va-chip :to="'animals/' + params.data.id" size="small">{{ params.data.nome }}</va-chip>
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

<style>
  .animal-cell-div {
    width: 80px;
    word-wrap: break-word;
    word-break: break-all;
  }
</style>
