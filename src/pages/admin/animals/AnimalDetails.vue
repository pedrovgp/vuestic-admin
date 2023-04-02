]
<template>
  <!-- <animal-dropdown :animal-id="animal?.id" /> -->
  <va-card>
    <va-card-title>
      {{ t('animals.animalDetailsTitle') }}
    </va-card-title>
    <va-card-content>
      <va-tabs v-model="activeTabName" grow>
        <template #tabs>
          <va-tab name="MainTab"> Geral </va-tab>
          <!-- <va-tab name="BillingAddressTab">
            {{ t('dashboard.tabs.billingAddress.title') }}
          </va-tab> -->
          <!-- <va-tab name="BankDetailsTab">
            {{ t('dashboard.tabs.bankDetails.title') }}
          </va-tab> -->
        </template>
      </va-tabs>
      <va-separator />
      <component :is="tabs[activeTabName]" v-if="animalLoaded()" :animal="animal" @submit="submit" />
    </va-card-content>
  </va-card>
  <div>
    <death-modal
      :animal-id="props.animalId"
      :button-text="'Registrar morte'"
      button-size="small"
      @death-successfully-registered="onMounted"
    />
  </div>
</template>

<script lang="ts">
  export default {
    name: 'AnimalDetails',
  }
</script>

<script setup lang="ts">
  import { defineAsyncComponent, ref, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import createApi from '../../../services/fam/fam'
  import AnimalDropdown from './registry/AnimalDropdown.vue'
  import DeathModal from './registry/DeathModal.vue'

  const { t } = useI18n()

  const props = defineProps<{
    animalId: string
  }>()

  const animal: any = ref(null)
  const AnimalApi = createApi('animal')

  function animalLoaded() {
    return animal.value != null
  }

  onMounted(async () => {
    animal.value = await (await AnimalApi.get(parseInt(props.animalId))).data
  })

  const tabs = {
    MainTab: defineAsyncComponent(() => import('./details-tabs/MainTab.vue')),
    // BillingAddressTab: defineAsyncComponent(() => import('./details-tabs/BillingAddressTab.vue')),
    // BankDetailsTab: defineAsyncComponent(() => import('./details-tabs/BankDetailsTab.vue')),
  }

  const emit = defineEmits<{
    (e: 'submit', data: any): void
  }>()

  const activeTabName = ref<keyof typeof tabs>('MainTab')

  function submit(data: any) {
    emit('submit', data)
  }
</script>

<style lang="scss">
  .va-tabs__tabs {
    height: 100%;
  }
</style>
