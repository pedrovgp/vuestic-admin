<template>
  <div class="animal-cell-div">
    <va-chip v-if="params.data.idmae != null" :to="'animals/' + params.data.idmae.id" size="small"
      >{{ params.data.idmae.nome }} - Br. {{ params.data.idmae.brinco }}</va-chip
    >
  </div>
</template>

<script lang="ts">
  export default {
    name: 'IdMae',
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
