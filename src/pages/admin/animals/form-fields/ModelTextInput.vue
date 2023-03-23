<!-- This component is a Vuestic va-select field
which options fetch Animal objects from the backend through the rest API -->
<template>
  <component
    :is="component"
    v-model="currentValue"
    :label="props.label || props.updateFieldName"
    :loading="isLoading"
    :readonly="!editable"
    :error="fieldError ? true : null"
    :error-messages="errorMessages.values ? errorMessages : null"
    :success="fieldSuccess ? true : null"
    :messages="messages.values ? messages : null"
    :format="formatFn"
    manual-input
    ><template #append>
      <va-button v-if="!editable" :icon="editable ? 'clear' : 'edit'" class="mb-2" @click="edit()" />
      <div v-else>
        <va-button :icon="'done'" class="mb-2" @click="done()" />
        <va-button :icon="'clear'" class="mb-2" @click="clear()" />
      </div> </template
  ></component>
</template>

<script setup lang="ts">
  import { ref, Ref, computed } from 'vue'
  import { VaInput, VaDateInput } from 'vuestic-ui/web-components'

  const props = defineProps<{
    // The component can receive an animalId prop, which will be used to fetch the animal
    initialValue?: string // The current value of the field, if any
    label?: string // The label of the field, defaults to 'Animal'
    updateApi: any // The API to update the related entity (for example, API to update Animal location)
    updateFieldName: string // The field name to update in the related entity (ex.: 'animal_id')
    updateEntityId: string // The id of the related entity to update (ex.: location_id)
    successMessage?: string // The message to show when the update is successful
    componentType?: string // The type of the component to use (input, date, etc)
  }>()

  const component = computed(() => {
    if (props.componentType === 'date') {
      return VaDateInput
    }
    return VaInput
  })

  function formatFn(value: any) {
    if (props.componentType === 'date') {
      return value.toISOString().split('T')[0]
    }
    return value
  }

  function apiFormatFn(value: any) {
    if (props.componentType === 'date') {
      return value.toISOString().split('T')[0]
    }
    return value
  }

  const currentValue: Ref<string | undefined | null> = ref(props.initialValue)
  const tempCurrentValue: Ref<string | undefined | null> = ref(props.initialValue)
  const isLoading: Ref<boolean> = ref(false)
  const fieldError: Ref<boolean> = ref(false)
  const errorMessages: Ref<any> = ref([])
  const fieldSuccess: Ref<boolean> = ref(false)
  const editable: Ref<boolean> = ref(false)
  const messages: Ref<string[]> = ref([])
  const successMessage = props.successMessage !== undefined ? props.successMessage : 'Atualizado'

  function done() {
    editable.value = false
    isLoading.value = true
    updateBackendAndSync()
    isLoading.value = false
  }

  function clear() {
    editable.value = false
    isLoading.value = true
    currentValue.value = tempCurrentValue.value
    isLoading.value = false
    clearMessages()
  }

  function edit() {
    editable.value = true
    clearMessages()
  }

  function clearMessages() {
    fieldSuccess.value = false
    messages.value = []
    fieldError.value = false
    errorMessages.value = []
  }

  function updateBackendAndSync() {
    props.updateApi
      .update({ id: props.updateEntityId, data: { [props.updateFieldName]: apiFormatFn(currentValue.value) } })
      .then((response: any) => {
        console.log(response)
        tempCurrentValue.value = currentValue.value
        fieldSuccess.value = true
        messages.value = [successMessage]
      })
      .catch((error: any) => {
        console.log(error)
        currentValue.value = tempCurrentValue.value
        fieldError.value = true
        errorMessages.value = [error]
      })
  }
</script>
