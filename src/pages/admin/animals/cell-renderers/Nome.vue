<template>
  <va-chip class="nome-va-chip" square :to="'animals/' + params.data.id" size="medium">{{ params.data.nome }}</va-chip>
</template>

<script lang="ts">
  export default {
    name: 'Nome',
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

<style lang="scss">
  .nome-va-chip {
    --va-chip-font-size: 0.8rem;
    --va-chip-content-padding: 1px;
  }
</style>
