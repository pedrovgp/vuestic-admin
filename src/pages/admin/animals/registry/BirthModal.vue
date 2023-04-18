<!-- This vue component is a modal containing a form for registering the Death 
  of the animal in context, received through props.animalId. It first fetches from
the backend API to check if such a death exists (if so, it renders the form populated).
If it does not, it pre fills some fields (like animalId, date with todays date) -->

<template>
  <div>
    <va-button
      color="success"
      icon="child_care"
      :size="props.buttonSize || 'small'"
      class="mr-6 mb-2"
      @click="showContent = !showContent"
    >
      {{ props.buttonText || 'Morte' }}
    </va-button>
    <va-modal v-model="showContent">
      <template #content="{}">
        <va-card-title> Registrando nova cria da vaca: {{ props.animalText }}</va-card-title>
        <va-form ref="form" v-model="formValid" tag="form" @submit.prevent="submitForm">
          <va-card-content>
            <div hidden="false">
              <va-input v-model="animalId" :label="'Mãe'" :readonly="true" />
            </div>
            <va-select
              v-model="sexo"
              class="mt-3"
              :options="sexoOptions"
              label="Sexo da cria"
              :rules="[(value: string | any[]) => (value && value.length > 0) || 'Field is required']"
            />
            <div>
              <va-date-input
                v-model="datanascimento"
                class="mt-3"
                label="Quando nasceu (ANO-MÊS-DIA)"
                :format="formatFn"
                :rules="datanascimentoValidationRules"
              />
            </div>
            <va-input v-model="nome" label="Nome (opcional, será dado automaticamente)" class="mt-3" />
            <va-input v-model="brinco" label="Brinco da cria (opcional)" class="mt-3" />
            <va-input v-model="obs" label="Observação (opcional)" class="mt-3" />
            <va-input v-model="idpai" label="Pai" :readonly="true" class="mt-3" />
            <animal-select
              ref="paiAnimalSelect"
              :label="'Pai'"
              update-field-name="idpai"
              update-entity-id="null"
              :clearable="true"
              :success-message="'Pai selecionado com sucesso'"
              :pre-filter="{ sexo: 'MACHO' }"
              :online-updates="false"
              class="mt-3"
              @selected-option-id-changed="(id: any) => (idpai = id)"
            />
            <va-button type="submit" color="success" class="mt-3" @click="validateForm()"> Salvar </va-button>
            <va-button class="mb-3" @click="validateForm()"> Validate: {{ formValid }} </va-button>
          </va-card-content>
        </va-form>
      </template>
    </va-modal>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import createApi from '../../../../services/fam/fam'
  import { useToast } from 'vuestic-ui'
  import AnimalSelect from '../form-fields/AnimalSelect.vue'

  const AnimalApi = createApi('animal')
  const { init } = useToast()
  const emit = defineEmits(['birthCreated'])

  const props = defineProps<{
    animalId: string | number
    buttonText?: string
    buttonSize?: string
    animalText?: string
  }>()

  const animalId = ref(props.animalId)
  // Use todays date as default, converted to ISO string date format
  const datanascimento = ref(null)
  const nome = ref(null)
  const sexo = ref(null)
  const brinco = ref(null)
  const paiAnimalSelect = ref()
  const idpai = ref(null)
  const obs = ref(null)
  const form = ref()
  const formValid = ref(false)
  const showContent = ref(false)

  const successToastMsg = 'Novo animal registrado com sucesso!'

  const sexoOptions = ['FEMEA', 'MACHO']

  function formatFn(date: any) {
    if (date instanceof Date) {
      return date.toISOString().split('T')[0]
    }
    return date
  }

  const datanascimentoValidationRules = [
    (val: any) => {
      if (!val) {
        return 'Informação necessária'
      }
      return true
    },
  ]

  function validateForm() {
    formValid.value = form.value.validate()
  }

  function translateError(error: any) {
    try {
      const data = error.response.data
      if (data?.non_field_errors[0] == 'Os campos idmae, datanascimento devem criar um set único.') {
        return 'Animal já possui uma cria registrada nessa data'
      }
      return error.response.data
    } catch (e) {
      return error
    }
  }

  // Define Death type
  interface Birth {
    idmae: string | number
    datanascimento: string
    sexo: string | null
    nome: string | null
    brinco: string | null
    idpai: string | number | null
    obs: string | null
  }

  // Function to submit the form

  async function submitForm() {
    console.log('submitForm')
    const birth: Birth = {
      idmae: animalId.value,
      datanascimento: formatFn(datanascimento.value),
      sexo: sexo.value,
      nome: nome.value,
      brinco: brinco.value,
      idpai: idpai.value,
      obs: obs.value,
    }
    console.log(birth)
    if (!formValid.value) {
      return false
    }
    AnimalApi.create(birth)
      .then((response: any) => {
        console.log(response)
        init({ message: successToastMsg, color: 'success' })
        showContent.value = false
        emit('birthCreated')
      })
      .catch((error: any) => {
        console.log(error)
        init({ message: translateError(error), color: 'danger' })
        return false
      })
  }
</script>
