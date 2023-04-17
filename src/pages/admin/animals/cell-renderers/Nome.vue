<template>
  <div class="nome-cell-div">
    <va-chip v-if="hierarchy == 'id'" class="nome-va-chip" square :to="'animals/' + params.data.id" size="medium">{{
      params.data.nome
    }}</va-chip>
    <va-chip
      v-if="hierarchy == 'idmae' && params.data.idmae != null"
      class="mae-va-chip"
      square
      :to="'animals/' + params.data.idmae.id"
      size="medium"
      >{{ params.data.idmae.nome }} - Br. {{ params.data.idmae.brinco }}</va-chip
    >
    <va-chip
      v-if="hierarchy == 'idpai' && params.data.idpai != null"
      class="pai-va-chip"
      square
      :to="'animals/' + params.data.idpai.id"
      size="medium"
      >{{ params.data.idpai.nome }} - Br. {{ params.data.idpai.brinco }}</va-chip
    >
  </div>
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

  const props = withDefaults(defineProps<Props>(), {
    params: () => 'Erro ao carregar nome',
  })

  const hierarchy = props.params.hierarchy ? props.params.hierarchy : 'id' // id, idmae, idpai
</script>

<style lang="scss">
  .nome-va-chip {
    --va-chip-font-size: 0.8rem;
    --va-chip-content-padding: 1px;
  }
  .mae-va-chip {
    --va-chip-font-size: 0.8rem;
    --va-chip-content-padding: 1px;
  }
  .pai-va-chip {
    --va-chip-font-size: 0.8rem;
    --va-chip-content-padding: 1px;
  }
</style>
