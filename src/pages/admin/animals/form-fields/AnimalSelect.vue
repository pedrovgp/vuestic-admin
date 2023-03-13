<!-- This component is a Vuestic va-select field
which options fetch Animal objects from the backend through the rest API -->
<template>
  <va-select
    v-model="selectedOption"
    :label="props.label || 'Animal'"
    :options="options"
    :text-by="(option: Option) => `${option.nome} - Br. ${option.brinco}`"
    :value-by="(option: Option) => option.id"
    :track-by="(option: Option) => option.id"
    :loading="isLoading"
    searchable
    @update-search="searchUpdated"
  ></va-select>
</template>

<script setup lang="ts">
  import { number } from '@intlify/core-base'
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

  // Debounce the searchUpdated function
  const searchUpdated = debounce((searchTerm: string) => {
    debouncedSearchTerm.value = searchTerm
  }, 300)

  if (props.animalId) {
    // If the component receives an animalId prop, it will fetch the animal and set it as the selectedOption
    AnimalApi.get(props.animalId)
      .then((response) => {
        selectedOption.value = response.data
      })
      .catch((error) => {
        console.log(error)
      })
  }

  function fetchOptions() {
    isLoading.value = true
    AnimalApi.query(debouncedSearchTerm.value)
      .then((response) => {
        options.value = response.data
        console.log(response.data)
        isLoading.value = false
      })
      .catch((error) => {
        console.log(error)
      })
    isLoading.value = false
  }

  onMounted(async () => {
    fetchOptions()
  })

  watch(selectedOption, async (newValue, oldValue) => {
    // Whenever the selectedOption changes, we update the backend
    // This needs to be customizable, we never know which related entity to update
    isLoading.value = true
    if (newValue != oldValue) {
      if (typeof newValue === 'string' || typeof newValue === 'number') {
        props.updateApi
          .update({ id: props.updateEntityId, data: { [props.updateFieldName]: newValue } })
          .then((response: any) => {
            console.log(response)
            isLoading.value = false
          })
          .catch((error: any) => {
            console.log(error)
            isLoading.value = false
          })
      }
    }
  })
</script>
