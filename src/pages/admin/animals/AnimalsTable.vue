]
<template>
  <va-alert class="mt-3" color="info" outline>
    <span>
      Use this to alert something
      <va-chip>alerted message</va-chip>
    </span>
  </va-alert>
  <row>
    <va-input v-model="input" class="flex flex-col mb-2 md6 xs12" placeholder="Escreva aqui para filtrar" />
  </row>
  <va-data-table
    v-model:sort-by="sortBy"
    v-model:sorting-order="sortingOrder"
    :items="props.items"
    :columns="columns"
    :filter="debouncedInput"
    :hoverable="true"
    :striped="true"
    :wrapper-size="500"
    virtual-scroller
    sticky-header
  />
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import debounce from 'lodash.debounce'

  export interface Props {
    items: Array<any>
  }

  const props = withDefaults(defineProps<Props>(), {
    items: () => [],
  })

  const input = ref('')
  const debouncedInput = ref('')

  watch(
    input,
    debounce(() => {
      debouncedInput.value = input.value
    }, 500),
  )

  const columns = [
    { key: 'nome', name: 'NOME', sortable: true, sortingOptions: ['desc', 'asc'] },
    { key: 'sexo', sortable: true, sortingOptions: ['desc', 'asc'] },
    { key: 'idpai', sortable: true, sortingOptions: ['desc', 'asc'] },
    { key: 'idmae', sortable: true, sortingOptions: ['desc', 'asc'] },
  ]

  const sortBy = ref('nome')
  const sortingOrder = ref('desc')

  // TODO add a custom filtering function to filter only by nome and brinco

  // TODO Add advanced options to define which columns to filter by

  // TODO pre-work items so that we have links working
</script>
