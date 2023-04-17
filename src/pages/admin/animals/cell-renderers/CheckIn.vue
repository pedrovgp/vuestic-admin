<template>
  <div class="checkin-cell-div">
    <va-button class="mr-2" color="success" size="small" @click="showModal = !showModal">Check-in</va-button>
  </div>
  <va-modal v-model="showModal" :message="message">
    <template #content="{}">
      <va-card-title> Check In de: {{ params.data.nome }} - Br. {{ params.data.brinco }} </va-card-title>
      <va-card-content> {{ params.data.nome }} - Br. {{ params.data.brinco }} está na fazenda hoje? </va-card-content>
      <va-card-actions>
        <va-button color="success" @click="checkin(true)">Sim</va-button>
        <va-button color="danger" @click="checkin(false)">Não</va-button>
      </va-card-actions>
    </template>
  </va-modal>
</template>

<script lang="ts">
  export default {
    name: 'Vivo',
  }
</script>

<script setup lang="ts">
  import { ref } from 'vue'
  // import { createApi } from '@services/fam/fam'
  import { createApi } from '../../../../services/fam/fam'

  export interface Props {
    params: any
  }

  const props = withDefaults(defineProps<Props>(), {
    params: () => 'Erro ao carregar parâmetros',
  })

  const showModal = ref(false)
  const message = 'Esse animal está hoje na fazenda?'
  const AnimalApi = createApi('animal')

  const checkin = (checkIn: boolean) => {
    AnimalApi.makeCheckIn(props.params.data.id, checkIn)
      .then((response) => {
        console.log('Make check in')
        showModal.value = false
      })
      .catch((error) => {
        console.log('Make chec in failed')
        console.log(error)
      })
    console.log(`checkin(${checkIn}), da vaca de id ${props.params.data.id}`)
  }
</script>

<style></style>
