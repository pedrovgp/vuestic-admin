]
<template>
  <!-- <animal-dropdown v-if="animal != null" :key="animal" :animal="animal" /> -->
  <div id="animal-details-buttons">
    <birth-modal
      v-if="animal?.sexo == 'FEMEA'"
      :key="animal"
      :animal-id="props.animalId"
      :animal-text="`${animal?.nome} - Br. ${animal?.brinco}`"
      button-text="Registrar cria"
      button-size="small"
    />
    <death-modal
      :key="animal"
      :animal-id="props.animalId"
      :animal-text="`${animal?.nome} - Br. ${animal?.brinco}`"
      :button-text="animal?.vivo ? 'Registrar morte' : 'Editar morte'"
      button-size="small"
      @death-changed="fetchAnimal()"
    />
    <sale-modal
      :key="animal"
      :animal-id="props.animalId"
      :animal-text="`${animal?.nome} - Br. ${animal?.brinco}`"
      :button-text="getSaleButtonText()"
      button-size="small"
      @sale-changed="fetchAnimal()"
    />
  </div>
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
      <component :is="tabs[activeTabName]" v-if="animalLoaded()" :key="animal" :animal="animal" @submit="submit" />
    </va-card-content>
  </va-card>
</template>

<script lang="ts">
  export default {
    name: 'AnimalDetails',
  }
</script>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import createApi from '../../../services/fam/fam'
  // import AnimalDropdown from './registry/AnimalDropdown.vue'
  import DeathModal from './registry/DeathModal.vue'
  import SaleModal from './registry/SaleModal.vue'
  import BirthModal from './registry/BirthModal.vue'
  import MainTab from './details-tabs/MainTab.vue'

  const { t } = useI18n()

  const props = defineProps<{
    animalId: string
  }>()

  const animal: any = ref(null)
  const AnimalApi = createApi('animal')

  function animalLoaded() {
    return animal.value != null
  }

  async function fetchAnimal() {
    console.log('fetchAnimal called')
    animal.value = await (await AnimalApi.get(parseInt(props.animalId))).data
  }

  onMounted(async () => {
    fetchAnimal()
  })

  function getSaleButtonText() {
    if (animal.value?.animal_vendido.length > 0) {
      return 'Editar venda'
    } else {
      return 'Registrar venda'
    }
  }

  const tabs = {
    MainTab: MainTab,
    // MainTab: defineAsyncComponent(() => import('./details-tabs/MainTab.vue')),
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
  #animal-details-buttons {
    display: flex;
    justify-content: space-between;
  }
</style>
