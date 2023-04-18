<!-- This vue component is a modal containing a form for registering the Sale  
  of the animal in context, received through props.animalId. It first fetches from
the backend API to check if a Sale from Criola exists (if so, it renders the form populated).
If it does not, it pre fills some fields (like animalId, date with todays date) -->

<template>
  <div>
    <va-button
      color="success"
      icon="paid"
      :size="props.buttonSize || 'small'"
      class="mt-3"
      @click="showContent = !showContent"
    >
      {{ props.buttonText || 'Venda' }}
    </va-button>
    <va-modal v-model="showContent">
      <template #content="{ ok }">
        <va-card-title> Registrando a venda de: {{ props.animalText }} </va-card-title>
        <va-form v-model="formValid" tag="form" @submit.prevent="submitForm">
          <va-card-content>
            <div hidden="false">
              <va-input v-model="vendaId" :label="'vendaId'" />
              <va-input v-model="animalId" :label="'animal'" :readonly="true" />
            </div>
            <va-date-input v-model="date" label="Data da venda (ANO-MÊS-DIA)" :format="formatFn" class="mt-3" />
            <va-input v-model="obs" label="Observação (opcional)" class="mt-3" />
            <va-counter
              v-model="price"
              label="Preço (opcional)"
              manual-input
              outline
              buttons
              :flat="false"
              margins="0"
              rounded
            />

            <!-- <va-select
              v-model="vendedor"
              :options="vendedorOptions"
              label="Vendedor do animal (opcional)"
              class="mt-3"
            />
            <va-select
              v-model="comprador"
              :options="compradorOptions"
              label="Comprador do animal (opcional)"
              class="mt-3"
            /> -->

            <va-button type="submit" color="success" :disabled="!formValid" class="mt-3" @click="ok">
              Salvar
            </va-button>
            <va-button v-if="vendaId != null" color="warning" :disabled="!formValid" @click="deleteSale()">
              Apagar registro de venda
            </va-button>
          </va-card-content>
        </va-form>
      </template>
    </va-modal>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import createApi from '../../../../services/fam/fam'
  import { useToast } from 'vuestic-ui'

  const SaleApi = createApi('venda')
  const { init } = useToast()
  const emit = defineEmits(['saleChanged'])

  const props = defineProps<{
    animalId: string | number
    buttonText?: string
    buttonSize?: string
    animalText?: string
  }>()

  const animalId = ref(props.animalId)
  // Use todays date as default, converted to ISO string date format
  const vendaId = ref(null)
  const date = ref(null)
  const price = ref(null)
  const obs = ref('')
  const formValid = ref(true)
  const showContent = ref(false)

  const successToastMsg = 'Venda do animal registrada/atualizada com sucesso!'

  function formatFn(date: any) {
    if (date instanceof Date) {
      return date.toISOString().split('T')[0]
    }
    return date
  }

  // Define Death type
  interface Sale {
    id: string | number | null
    idanimal: string | number
    data: Date
    preco: number | null
    obs: string | null
    idvendedor: number | string | null
    idcomprador: number | string | null
  }

  // Funtion to get the death of the animal in context, if it exists and pre fill the form
  function getSale() {
    console.log('getSale')
    console.log(animalId.value)
    SaleApi.getAll({ idanimal: animalId.value })
      .then((response: any) => {
        console.log(response)
        vendaId.value = response.data[0].id
        date.value = response.data[0].data
        obs.value = response.data[0].obs
        price.value = response.data[0].preco
        console.log(`vendaId: ${vendaId.value}`)
      })
      .catch((error: any) => {
        console.log('error in getSale')
        console.log(error)
      })
  }

  function deleteSale() {
    console.log('deleteSale')
    SaleApi.delete(vendaId.value)
      .then((response: any) => {
        init({ message: 'Venda apagada.', color: 'warning' })
        showContent.value = false
        emit('saleChanged', response)
      })
      .catch((error: any) => {
        console.log('error in deleteDeath')
        init({ message: error.response.data, color: 'danger' })
      })
  }

  // Watch showContent and call getDeath whenever it changes to true
  watch(showContent, (val) => {
    if (val) {
      getSale()
    }
  })

  // Function to submit the form

  async function submitForm() {
    console.log('submitForm')
    console.log(date.value)
    console.log(formatFn(date.value))
    const sale: Sale = {
      id: vendaId.value,
      idanimal: animalId.value,
      data: formatFn(date.value),
      preco: price.value,
      obs: obs.value,
      idvendedor: 12, // id da Criola
      idcomprador: 20, // id da pessoa VENDIDO
    }
    console.log(sale)
    SaleApi.upsert(sale)
      .then((response: any) => {
        console.log(response)
        init({ message: successToastMsg, color: 'success' })
        emit('saleChanged')
      })
      .catch((error: any) => {
        console.log(error)
        init({ message: error.response.data, color: 'danger' })
        return false
      })
  }
</script>
