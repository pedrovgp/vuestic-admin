<!-- This vue component is a modal containing a form for registering the Death 
  of the animal in context, received through props.animalId. It first fetches from
the backend API to check if such a death exists (if so, it renders the form populated).
If it does not, it pre fills some fields (like animalId, date with todays date) -->

<template>
  <va-button color="danger" icon="Skull" :size="props.buttonSize || 'small'" @click="showContent = !showContent">
    {{ props.buttonText || 'Morte' }}
  </va-button>
  <va-modal v-model="showContent">
    <template #content="{ ok }">
      <va-card-title> Registrando a morte do animal </va-card-title>
      <va-form v-model="formValid" tag="form" @submit.prevent="submitForm">
        <va-card-content>
          <va-input v-model="animalId" :label="'animal'" :readonly="true" />
          <va-select v-model="cause" :options="causeOptions" label="Causa da morte" />
          <va-date-input v-model="date" label="Data da morte (ANO-MÊS-DIA)" :format="formatFn" />
          <va-input v-model="obs" label="Observação (opcional)" />
          <va-button type="submit" color="warning" :disabled="!formValid" @click="ok"> Salvar </va-button>
        </va-card-content>
      </va-form>
    </template>
  </va-modal>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import createApi from '../../../../services/fam/fam'
  import { useToast } from 'vuestic-ui'

  const DeathApi = createApi('morte')
  const { init, close, closeAll } = useToast()
  const emit = defineEmits(['deathSuccessfullyRegistered'])

  const props = defineProps<{
    animalId: string | number
    buttonText?: string
    buttonSize?: string
  }>()

  const animalId = ref(props.animalId)
  // Use todays date as default, converted to ISO string date format
  const date = ref(new Date())
  const cause = ref('DOENCA')
  const obs = ref('')
  const formValid = ref(true)
  const showContent = ref(false)

  // Options for cause of death: NATURAL, DOENCA ou ACIDENTE
  const causeOptions = ['DOENCA', 'ACIDENTE', 'NATURAL']
  //   { value: 'NATURAL', text: 'Natural' },
  //   { value: 'DOENCA', text: 'Doença' },
  //   { value: 'ACIDENTE', text: 'Acidente' },
  // ]

  function formatFn(date: any) {
    return date.toISOString().split('T')[0]
  }

  // Define Death type
  interface Death {
    idanimal: string | number
    data: Date
    causa: string
    obs: string
  }

  async function submitForm() {
    console.log('submitForm')
    const death: Death = {
      idanimal: animalId.value,
      data: formatFn(date.value),
      causa: cause.value,
      obs: obs.value,
    }
    console.log(death)
    DeathApi.create(death)
      .then((response: any) => {
        console.log(response)
        init({ message: 'Morte registrada com sucesso', color: 'success' })
        emit('deathSuccessfullyRegistered')
      })
      .catch((error: any) => {
        console.log(error)
        init({ message: 'Erro ao registrar morte', color: 'danger' })
      })
  }
</script>
