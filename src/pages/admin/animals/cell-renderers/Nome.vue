<template>
  <div class="nome-cell-div">
    <va-chip
      v-if="hierarchy == 'id'"
      :color="getColor(params.data.vivo, params.data.sexo)"
      class="nome-va-chip"
      square
      :to="'animals/' + params.data.id"
      size="medium"
      >{{ params.data.nome }}</va-chip
    >
    <va-chip
      v-if="hierarchy == 'idmae' && params.data.idmae != null"
      class="mae-va-chip"
      square
      :color="getColor(params.data.idmae.vivo, params.data.idmae.sexo)"
      :to="'animals/' + params.data.idmae.id"
      size="medium"
      >{{ params.data.idmae.nome }} - Br. {{ params.data.idmae.brinco }}</va-chip
    >
    <va-chip
      v-if="hierarchy == 'idpai' && params.data.idpai != null"
      class="pai-va-chip"
      square
      :color="getColor(params.data.idpai.vivo, params.data.idpai.sexo)"
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
  import { animalColors } from '../AnimalsTable.vue'
  export interface Props {
    params: any
  }

  const props = withDefaults(defineProps<Props>(), {
    params: () => 'Erro ao carregar nome',
  })

  const hierarchy = props.params.hierarchy ? props.params.hierarchy : 'id' // id, idmae, idpai

  function getColor(vivo: boolean, sexo: string) {
    // Se vivo e fêmea, HEX de rosa
    // Se vivo e macho, HEX de azul
    // Se morto e fêmea, HEX de cinza claro
    // Se morto e macho, HEX de cinza escuro
    if (vivo) {
      if (sexo == 'FEMEA') {
        return animalColors.FEMEAVIVA
      } else {
        return animalColors.MACHOVIVO
      }
    } else {
      if (sexo == 'FEMEA') {
        return animalColors.FEMEAMORTA
      } else {
        return animalColors.MACHOMORTO
      }
    }
  }
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
