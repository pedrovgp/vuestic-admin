<!-- This vue component is a modal containing a form for registering the Death 
  of the animal in context, received through props.animalId. It first fetches from
the backend API to check if such a death exists (if so, it renders the form populated).
If it does not, it pre fills some fields (like animalId, date with todays date) -->

<template>
  <va-button
    color="danger"
    icon="Skull"
    :size="props.buttonSize || 'small'"
    class="mt-3"
    @click="showContent = !showContent"
  >
    {{ props.buttonText || 'Morte' }}
  </va-button>
  <va-modal v-model="showContent">
    <template #content="{ ok }">
      <va-card-title> Registrando a morte de: {{ props.animalText }} </va-card-title>
      <va-form v-model="formValid" tag="form" @submit.prevent="submitForm">
        <va-card-content>
          <div hidden="false">
            <va-input v-model="deathId" :label="'deathId'" />
            <va-input v-model="animalId" :label="'animal'" :readonly="true" />
          </div>
          <va-select v-model="cause" :options="causeOptions" label="Causa da morte" class="mt-3" />
          <va-date-input v-model="date" label="Data da morte (ANO-MÊS-DIA)" :format="formatFn" class="mt-3" />
          <va-input v-model="obs" label="Observação (opcional)" class="mt-3" />
          <va-button type="submit" color="success" :disabled="!formValid" class="mt-3" @click="ok"> Salvar </va-button>
          <va-button v-if="deathId != null" color="warning" :disabled="!formValid" @click="deleteDeath()">
            Apagar registro de morte
          </va-button>
        </va-card-content>
      </va-form>
    </template>
  </va-modal>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import createApi from '../../../../services/fam/fam'
  import { useToast } from 'vuestic-ui'

  const DeathApi = createApi('morte')
  const { init } = useToast()
  const emit = defineEmits(['deathChanged'])

  const props = defineProps<{
    animalId: string | number
    buttonText?: string
    buttonSize?: string
    animalText?: string
  }>()

  const animalId = ref(props.animalId)
  // Use todays date as default, converted to ISO string date format
  const deathId = ref(null)
  const date = ref(null)
  const cause = ref('DOENCA')
  const obs = ref('')
  const formValid = ref(true)
  const showContent = ref(false)

  const successToastMsg = 'Morte do animal registrada/atualizada com sucesso!'

  // Options for cause of death: NATURAL, DOENCA ou ACIDENTE
  const causeOptions = ['DOENCA', 'ACIDENTE', 'NATURAL']
  //   { value: 'NATURAL', text: 'Natural' },
  //   { value: 'DOENCA', text: 'Doença' },
  //   { value: 'ACIDENTE', text: 'Acidente' },
  // ]

  function formatFn(date: any) {
    if (date instanceof Date) {
      return date.toISOString().split('T')[0]
    }
    return date
  }

  // Define Death type
  interface Death {
    id: string | number | null
    idanimal: string | number
    data: Date
    causa: string
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
        console.log(error)
      })
  }

  function deleteDeath() {
    console.log('deleteDeath')
    DeathApi.delete(deathId.value)
      .then((response: any) => {
        init({ message: 'Morte apagada. Animal consta novamente como vivo.', color: 'warning' })
        showContent.value = false
        emit('deathChanged', response)
      })
      .catch((error: any) => {
        console.log('error in deleteDeath')
        init({ message: error.response.data, color: 'danger' })
      })
  }

  // Watch showContent and call getDeath whenever it changes to true
  watch(showContent, (val) => {
    if (val) {
      getDeath()
    }
  })

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
        return false
      })
  }
</script>
