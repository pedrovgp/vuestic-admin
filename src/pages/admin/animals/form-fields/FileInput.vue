<!-- This component is a Vuestic va-input or va-date-input field, tied to
an updateApi, fieldName and entityId. When updated, this field calls the 
updateApi to update the given fieldName of the given entityId -->
<template>
  <!-- Ceate div v-for each msg in errorMessages -->
  <va-card v-if="backendValue != null && backendValue[0] != null">
    <va-card-title>Foto atual</va-card-title>
    <va-image :src="backendValue[0]" style="height: 200px" />
    <va-card-actions align="between">
      <va-button :icon="'clear'" color="danger" class="mb-2" @click="clear()">Apagar atual</va-button>
    </va-card-actions>
  </va-card>
  <va-alert v-for="msg in errorMessages" :key="msg" color="danger" class="mb-6"> {{ msg }} </va-alert>
  <va-alert v-for="msg in messages" :key="msg" color="success" class="mb-6"> {{ msg }} </va-alert>
  <div v-if="!isLoading">
    <va-button
      v-if="currentValue.length && (initialValue == null || currentValue[0] != backendValue[0])"
      :icon="'done'"
      class="mb-2"
      color="success"
      @click="done()"
      >Confirmar envio</va-button
    >
  </div>
  <va-file-upload
    v-model="currentValue"
    :label="props.label || props.updateFieldName"
    :loading="isLoading"
    upload-button-text="Enviar nova foto"
    drop-zone-text=""
    type="gallery"
    file-types="image/*"
    dropzone
  />
</template>

<script setup lang="ts">
  import { ref, Ref, watch } from 'vue'

  const props = defineProps<{
    // The component can receive an animalId prop, which will be used to fetch the animal
    initialValue?: any[] // The current value of the field, if any
    label?: string // The label of the field, defaults to 'Animal'
    updateApi: any // The API to update the related entity (for example, API to update Animal location)
    updateFieldName: string // The field name to update in the related entity (ex.: 'animal_id')
    updateEntityId: string // The id of the related entity to update (ex.: location_id)
    successMessage?: string // The message to show when the update is successful
  }>()

  const currentValue: Ref<any[]> = ref([])
  watch(
    currentValue,
    (newValue, oldValue) => {
      // keep currentValue length always equal one, keeping the most recent
      // uploaded file
      if (newValue.length > 1) {
        currentValue.value = [newValue[-1]]
      }
    },
    { immediate: true },
  )

  const backendValue: Ref<any[] | undefined | null> = ref(props.initialValue)
  const isLoading: Ref<boolean> = ref(false)
  const errorMessages: Ref<any> = ref([])
  const editable: Ref<boolean> = ref(false)
  const messages: Ref<string[]> = ref([])
  const successMessage = props.successMessage !== undefined ? props.successMessage : 'Atualizado'

  function done() {
    editable.value = false
    isLoading.value = true
    messages.value = ['Processando...']
    updateBackendAndSync()
    isLoading.value = false
  }

  function clear() {
    editable.value = false
    isLoading.value = true
    // TODO: call API to set the field to null and set backendValue to null
    deleteBackendAndSync()
    messages.value = []
    isLoading.value = false
  }

  function apiFormatFn(value: any) {
    return value[0]
  }

  function updateBackendAndSync() {
    props.updateApi
      .updateFile({ id: props.updateEntityId, data: { [props.updateFieldName]: apiFormatFn(currentValue.value) } })
      .then((response: any) => {
        console.log(response)
        backendValue.value = response.data.one_picture ? response.data.one_picture : []
        messages.value = [successMessage]
        currentValue.value = []
      })
      .catch((error: any) => {
        console.log(error)
        errorMessages.value = error.response.data[props.updateFieldName]
      })
  }

  function deleteBackendAndSync() {
    props.updateApi
      .update({ id: props.updateEntityId, data: { [props.updateFieldName]: null } })
      .then((response: any) => {
        console.log(response)
        backendValue.value = []
        messages.value = ['Foto apagada']
      })
      .catch((error: any) => {
        console.log(error)
        errorMessages.value = error.response.data[props.updateFieldName]
      })
  }
</script>
