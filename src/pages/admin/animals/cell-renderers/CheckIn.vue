<template>
  <div class="checkin-cell-div">
    <va-button v-if="displayCheckInButton()" class="mr-2" color="success" size="small" @click="showModal = !showModal"
      >Check-in</va-button
    >
    <p v-else>{{ params.data.check_in ? 'SIM' : 'NÃO' }}: {{ formatDateString(params.data.last_check_in) }}</p>
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
  import { useToast } from 'vuestic-ui'

  export interface Props {
    params: any
  }

  const { init } = useToast()

  const props = withDefaults(defineProps<Props>(), {
    params: () => 'Erro ao carregar parâmetros',
  })

  const showModal = ref(false)
  const message = 'Esse animal está hoje na fazenda?'
  const AnimalApi = createApi('animal')

  function displayCheckInButton() {
    // Check if last_check_in date is null or is later than a month old
    // and display the button if it is
    if (props.params.data.last_check_in == null) {
      return true
    }
    const lastCheckIn = new Date(props.params.data.last_check_in)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - lastCheckIn.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    if (diffDays > 30) {
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

<style></style>
