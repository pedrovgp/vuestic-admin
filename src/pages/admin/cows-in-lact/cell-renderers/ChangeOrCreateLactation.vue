<template>
  <div class="lactation-cell-div">
    <va-button v-if="lactationIsOpen()" class="mr-2" color="danger" size="small" @click="showModal = !showModal"
      >Fechar</va-button
    >
    <va-button v-else class="mr-2" color="sucess" size="small" @click="showModal = !showModal">Abrir</va-button>
  </div>
  <va-modal v-model="showModal" :message="message">
    <template #content="{}">
      <va-card-title> Lactação de: {{ params.data.nome }} - Br. {{ params.data.brinco }} </va-card-title>
      <va-card-content>
        {{ params.data.nome }} - Br. {{ params.data.brinco }} está na fazenda hoje (TO DO)?
      </va-card-content>
      <va-card-actions>
        <va-button color="success" @click="checkin(true)">Sim</va-button>
        <va-button color="danger" @click="checkin(false)">Não</va-button>
      </va-card-actions>
    </template>
  </va-modal>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  // import { createApi } from '@services/fam/fam'
  import { createApi } from '../../../../services/fam/fam'
  import { useToast } from 'vuestic-ui'

  export interface Props {
    params: any
  }

  const { init } = useToast()

  const props = withDefaults(defineProps<Props>(), {
    params: () => 'Erro ao carregar parâmetros',
  })

  const showModal = ref(false)
  const message = 'Esse animal está em lactação?'
  const AnimalApi = createApi('animal')

  function lactationIsOpen() {
    // Check if there is lactation with null close date
    if (props.params.data.datafim == null) {
      return true
    }
    return false
  }

  function formatDateString(date: string) {
    const dateObj = new Date(date)
    const year = dateObj.getFullYear()
    const month = dateObj.getMonth() + 1
    const day = dateObj.getDate()
    return `${day}/${month}/${year}`
  }

  const checkin = (checkIn: boolean) => {
    AnimalApi.makeCheckIn(props.params.data.id, checkIn)
      .then((response) => {
        console.log('Make check in')
        showModal.value = false
        // update ag grid's row data with the response data
        props.params.node.setData(response.data)
        // if (checkIn) {
        //   // Update the row data
        //   props.params.node.setData(response.data)
        // } else {
        //   // Delete the row from the grid (COULD NOT GET THIS TO WORK)
        //   props.params.api.applyTransactionAsync({ remove: [{ id: response.data.id }] })
        // }
      })
      .catch((error) => {
        init({ message: `Check In failed: ${error}`, color: 'danger' })
        console.log(error)
      })
    console.log(`checkin(${checkIn}), da vaca de id ${props.params.data.id}`)
  }
</script>
