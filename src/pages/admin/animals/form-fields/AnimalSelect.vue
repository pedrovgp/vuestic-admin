<!-- This component is a Vuestic va-select field
which options fetch Animal objects from the backend through the rest API -->
<template>
  <va-select
    v-model="selectedOption"
    :label="props.label || 'Animal'"
    :options="options"
    :text-by="(option: any) => `${option.nome} - Br. ${option.brinco}`"
    :value-by="(option: any) => option.id"
    :loading="isLoading"
    :readonly="!editable"
    searchable
    :error="fieldError ? true : null"
    :error-messages="errorMessages.values ? errorMessages : null"
    :success="fieldSuccess ? true : null"
    :messages="messages.values ? messages : null"
    @update-search="searchUpdated"
    ><template #append>
      <va-button v-model="editable" :icon="editable ? 'clear' : 'edit'" class="mb-2" @click="editable = !editable">
      </va-button> </template
  ></va-select>
</template>

<script setup lang="ts">
  import { ref, Ref, watch, onMounted } from 'vue'
  import AnimalApi from '../../../../services/fam/fam'
  import debounce from 'lodash.debounce'

  const props = defineProps<{
    // The component can receive an animalId prop, which will be used to fetch the animal
    animalId?: number // The current value of the field, if any
    label?: string // The label of the field, defaults to 'Animal'
    updateApi: any // The API to update the related entity (for example, API to update Animal location)
    updateFieldName: string // The field name to update in the related entity (ex.: 'animal_id')
    updateEntityId: string // The id of the related entity to update (ex.: location_id)
    successMessage?: string // The message to show when the update is successful
    preFilter?: any // A pre-filter to apply to the options, executed on the backend
  }>()

  const preFilter = props.preFilter || {}

  interface Option {
    // An Option mus have an id and a name, and any other property the backend might return
    id: string
    nome: string
    [key: string]: any
  }

  const selectedOption: Ref<Option | null> = ref(null)
  const options: Ref<Option[]> = ref([])
  const isLoading: Ref<boolean> = ref(false)
  const debouncedSearchTerm: Ref<string> = ref('')
  const fieldError: Ref<boolean> = ref(false)
  const errorMessages: Ref<any> = ref([])
  const fieldSuccess: Ref<boolean> = ref(false)
  const editable: Ref<boolean> = ref(false)
  const messages: Ref<string[]> = ref([])
  const successMessage = props.successMessage !== undefined ? props.successMessage : 'Atualizado'

  onMounted(() => {
    if (props.animalId) {
      updateSelectedOption(props.animalId.toString())
    }
  })
  // Debounce the searchUpdated function
  const searchUpdated = debounce((searchTerm: string) => {
    debouncedSearchTerm.value = searchTerm
  }, 300)

  function updateSelectedOption(id: string | null, informSuccess = false) {
    // Selected option is set to string instead of the object, when selected
    if (id != null) {
      AnimalApi.get(parseInt(id))
        .then((response) => {
          selectedOption.value = response.data
          tempSelectedOption.value = response.data
          fieldError.value = false
          fieldSuccess.value = informSuccess
          messages.value = informSuccess ? [successMessage] : []
          editable.value = false
        })
        .catch((error) => {
          fieldError.value = true
          errorMessages.value = [error]
          console.log(error)
        })
    }
  }

  function fetchOptions() {
    isLoading.value = true
    if (debouncedSearchTerm.value.length > 0) {
      let params = { ...preFilter, q: debouncedSearchTerm.value }
      AnimalApi.getAll(params)
        .then((response) => {
          options.value = response.data
          fieldError.value = false
        })
        .catch((error) => {
          fieldError.value = true
          errorMessages.value.push(error)
          console.log(error)
        })
    } else {
      options.value = []
      isLoading.value = false
    }
    isLoading.value = false
  }

  watch(debouncedSearchTerm, fetchOptions)

  // selectedOption becomes a string, when selected, we must turn it back to an object
  // only then we can update the backend. This will require a temporary variable
  const tempSelectedOption: Ref<Option | null> = ref(selectedOption.value)
  watch(selectedOption, async (newValue, oldValue): Promise<void> => {
    // Whenever the selectedOption changes, we update the backend
    // This needs to be customizable, we never know which related entity to update
    isLoading.value = true
    console.log(`selectedOption changed from ${oldValue} to ${newValue}`)
    // const oldId = tempSelectedOption.value != null ? tempSelectedOption.value.id : null
    if (typeof newValue === 'number' || newValue == null) {
      props.updateApi
        .update({ id: props.updateEntityId, data: { [props.updateFieldName]: newValue } })
        .then((response: any) => {
          console.log(response)
          updateSelectedOption(newValue, true)
        })
        .catch((error: any) => {
          console.log(error)
          selectedOption.value = tempSelectedOption.value
        })
    }
    isLoading.value = false
  })
</script>
