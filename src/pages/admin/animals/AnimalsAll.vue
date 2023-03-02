]
<template>
  <animal-details v-if="animalId" :animal-id="animalId" />
  <div v-else>
    <suspense>
      <template #default>
        <animals-table :items="animals" />
      </template>
      <template #fallback>
        <p>Loading...</p>
      </template>
    </suspense>
  </div>
</template>

<script lang="ts">
  export default {
    name: 'AnimalsAll',
    inheritAttrs: false,
    customOptions: {},
  }
</script>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import AnimalApi from '../../../services/fam/fam'
  import AnimalDetails from './AnimalDetails.vue'
  import AnimalsTable from './AnimalsTable.vue'

  const animals: any = ref([])

  const props = withDefaults(
    defineProps<{
      animalId?: number
    }>(),
    {
      animalId: 0,
    },
  )

  onMounted(async () => {
    animals.value = await (await AnimalApi.getAll()).data
  })
</script>

<style lang="scss">
  .va-tabs__tabs {
    height: 100%;
  }
</style>
