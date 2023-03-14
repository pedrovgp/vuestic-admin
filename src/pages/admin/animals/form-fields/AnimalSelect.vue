<!-- This component is a Vuestic va-select field
which options fetch Animal objects from the backend through the rest API -->
<template>
  <va-select
    v-model="selectedOption"
    :label="props.label || 'Animal'"
    :options="options"
    :text-by="(option: Option) => `${option.nome} - Br. ${option.brinco}`"
    :value-by="(option: Option) => option.id"
    :loading="isLoading"
    searchable
    @update-search="searchUpdated"
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
  }>()

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

  onMounted(() => {
    if (props.animalId) {
      updateSelectedOption(props.animalId.toString())
    }
  })
  // Debounce the searchUpdated function
  const searchUpdated = debounce((searchTerm: string) => {
    debouncedSearchTerm.value = searchTerm
  }, 300)

  function updateSelectedOption(id: string | null) {
    // Selected option is set to string instead of the object, when selected
    if (id != null) {
      AnimalApi.get(parseInt(id))
        .then((response) => {
          console.log('changing')
          selectedOption.value = response.data
          tempSelectedOption.value = response.data
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }

  function fetchOptions() {
    isLoading.value = true
    if (debouncedSearchTerm.value.length > 0) {
      AnimalApi.query(debouncedSearchTerm.value)
        .then((response) => {
          options.value = response.data
          isLoading.value = false
        })
        .catch((error) => {
          console.log(error)
        })
      isLoading.value = false
    } else {
      options.value = []
      isLoading.value = false
    }
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
          updateSelectedOption(newValue)
          isLoading.value = false
        })
        .catch((error: any) => {
          console.log(error)
          selectedOption.value = tempSelectedOption.value
          isLoading.value = false
        })
    }
  })
</script>
