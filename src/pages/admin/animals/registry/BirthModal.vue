<!-- This vue component is a modal containing a form for registering the Death 
  of the animal in context, received through props.animalId. It first fetches from
the backend API to check if such a death exists (if so, it renders the form populated).
If it does not, it pre fills some fields (like animalId, date with todays date) -->

<template>
  <va-button color="success" icon="Child care" :size="props.buttonSize || 'small'" @click="showContent = !showContent">
    {{ props.buttonText || 'Morte' }}
  </va-button>
  <va-modal v-model="showContent">
    <template #content="{ ok }">
      <va-card-title> Registrando nova cria da vaca: {{ props.animalText }}</va-card-title>
      <va-form v-model="formValid" tag="form" @submit.prevent="submitForm">
        <va-card-content>
          <div hidden="false">
            <va-input v-model="animalId" :label="'Mãe'" :readonly="true" />
          </div>
          <va-select v-model="sexo" :options="sexoOptions" label="Sexo da cria" />
          <va-date-input v-model="datanascimento" label="Quando nasceu (ANO-MÊS-DIA)" :format="formatFn" />
          <va-input v-model="brinco" label="Brinco da cria (opcional)" />
          <va-input v-model="obs" label="Observação (opcional)" />
          <va-input v-model="idpai" label="Pai" :readonly="true" />
          <animal-select
            ref="paiAnimalSelect"
            :label="'Pai'"
            update-field-name="idpai"
            update-entity-id="null"
            :clearable="true"
            :success-message="'Pai selecionado com sucesso'"
            :pre-filter="{ sexo: 'MACHO' }"
            :online-updates="false"
            @selected-option-id-changed="(id) => (idpai = id)"
          />
          <va-button type="submit" color="success" :disabled="!formValid" @click="ok"> Salvar </va-button>
        </va-card-content>
      </va-form>
    </template>
  </va-modal>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import createApi from '../../../../services/fam/fam'
  import { useToast } from 'vuestic-ui'
  import AnimalSelect from '../form-fields/AnimalSelect.vue'

  const DeathApi = createApi('morte')
  const { init, close, closeAll } = useToast()
  const emit = defineEmits(['deathChanged'])

  const props = defineProps<{
    animalId: string | number
    buttonText?: string
    buttonSize?: string
    animalText?: string
  }>()

  const animalId = ref(props.animalId)
  // Use todays date as default, converted to ISO string date format
  const datanascimento = ref(new Date())
  const sexo = ref(null)
  const brinco = ref('')
  const paiAnimalSelect = ref()
  const idpai = ref(null)
  const obs = ref('')
  const formValid = ref(true)
  const showContent = ref(false)

  const successToastMsg = 'Morte do animal registrada/atualizada com sucesso!'

  const sexoOptions = ['FEMEA', 'MACHO']

  function formatFn(date: any) {
    if (date instanceof Date) {
      return date.toISOString().split('T')[0]
    }
    return date
  }

  // Define Death type
  interface Birth {
    idmae: string | number
    datanascimento: string
    sexo: string
    brinco: string
    idpai: string | number
    obs: string
  }

  // Funtion to get the death of the animal in context, if it exists and pre fill the form
  function getDeath() {
    console.log('getDeath')
    console.log(animalId.value)
    DeathApi.getAll({ idanimal: animalId.value })
      .then((response: any) => {
        console.log(response)
        deathId.value = response.data[0].id
        date.value = response.data[0].data
        cause.value = response.data[0].causa
        obs.value = response.data[0].obs
        console.log(`deathId: ${deathId.value}`)
      })
      .catch((error: any) => {
        console.log('error in getDeath')
      })
  }

  function deleteDeath() {
    console.log('deleteDeath')
    DeathApi.delete(deathId.value)
      .then((response: any) => {
        init({ message: 'Morte apagada. Animal consta novamente como vivo.', color: 'warning' })
        showContent.value = false
        emit('deathChanged')
      })
      .catch((error: any) => {
        console.log('error in deleteDeath')
        init({ message: error.response.data, color: 'danger' })
      })
  }

  // Function to submit the form

  async function submitForm() {
    console.log('submitForm')
    console.log(date.value)
    console.log(formatFn(date.value))
    const death: Death = {
      id: deathId.value,
      idanimal: animalId.value,
      data: formatFn(date.value),
      causa: cause.value,
      obs: obs.value,
    }
    console.log(death)
    DeathApi.upsert(death)
      .then((response: any) => {
        console.log(response)
        init({ message: successToastMsg, color: 'success' })
        emit('deathChanged')
      })
      .catch((error: any) => {
        console.log(error)
        init({ message: error.response.data, color: 'danger' })
      })
  }
</script>
