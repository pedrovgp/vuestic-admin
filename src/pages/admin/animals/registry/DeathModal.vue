<!-- This vue component is a modal containing a form for registering the Death 
  of the animal in context, received through props.animalId. It first fetches from
the backend API to check if such a death exists (if so, it renders the form populated).
If it does not, it pre fills some fields (like animalId, date with todays date) -->

<template>
  <va-button color="danger" icon="Skull" @click="showContent = !showContent">
    {{ props.buttonText || 'Morte' }}
  </va-button>
  <Teleport to="body">
    <va-modal v-model="showContent" :title="'Morte'">
      <template #content="{ ok }">
        <va-form v-model="formValid" @submit="submitForm">
          <va-card-content>
            <va-input v-model="animalId" :label="'animal'" :readonly="true" />
            <va-date-picker v-model="date" :label="$t('date')" :format="formatFn" />
            <va-input v-model="cause" :label="'cause'" />
            <va-input v-model="obs" :label="'obs'" />
            <va-button type="submit" color="danger" :disabled="!formValid" @click="ok"> save </va-button>
          </va-card-content>
        </va-form>
      </template>
    </va-modal>
  </Teleport>
</template>

<script setup lang="ts">
  import { defineAsyncComponent, ref, watch } from 'vue'
  // import { DeathApi } from '../../../../services/fam/fam'

  const props = defineProps<{
    animalId?: string | number
    buttonText?: string
  }>()

  const animalId = ref(props.animalId)
  // Use todays date as default, converted to ISO string date format
  const date = ref(new Date().toISOString().split('T')[0])
  const cause = ref('')
  const obs = ref('')
  const formValid = ref(false)
  const showContent = ref(false)

  function formatFn(date: any) {
    return date.toISOString().split('T')[0]
  }

  async function submitForm() {
    // console.log('submitForm')
    // const death: Death = {
    //   animal_id: animalId.value,
    //   data: date.value,
    //   causa: cause.value,
    //   obs: obs.value,
    // }
    // try {
    //   await DeathApi.create(death)
    //   toast.success(t('deathRegistered'))
    //   hideModal()
    // } catch (error) {
    //   toast.error(t('errorRegisteringDeath'))
    // }
  }
</script>
