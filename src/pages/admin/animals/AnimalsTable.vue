]
<template>
  <va-alert class="mt-3" color="info" outline>
    <span>
      Mostrando apenas animais
      <va-chip>vivos na estância Suzana</va-chip>
    </span>
  </va-alert>
  <row>
    <va-input v-model="input" class="flex flex-col mb-2 md6 xs12" placeholder="Escreva aqui para filtrar" />
  </row>
  <va-data-table
    v-model:sort-by="sortBy"
    v-model:sorting-order="sortingOrder"
    :items="computedItems"
    :columns="columns"
    :filter="debouncedInput"
    :hoverable="true"
    :loading="computedItems.length ? false : true"
    :striped="true"
    :wrapper-size="500"
    virtual-scroller
    sticky-header
  >
    <template #cell(nome)="{ value }"
      ><va-chip :to="splitParentValueStr(value)[0]" size="small">{{ splitParentValueStr(value)[1] }}</va-chip></template
    >
    <template #cell(NOME)="{ value }"
      ><va-chip :href="value" size="small">{{ value }}</va-chip></template
    >
    <template #cell(idpai)="{ value }"
      ><va-chip :to="splitParentValueStr(value)[0]" size="small">{{ splitParentValueStr(value)[1] }}</va-chip></template
    >
    <template #cell(idmae)="{ value }"
      ><va-chip :to="splitParentValueStr(value)[0]" size="small">{{ splitParentValueStr(value)[1] }}</va-chip></template
    >
  </va-data-table>
</template>

<script setup lang="ts">
  import { ref, watch, computed } from 'vue'
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
    { key: 'brinco', sortable: true, sortingOptions: ['desc', 'asc'], fixed: 'left' },
    { key: 'nome', sortable: true, sortingOptions: ['desc', 'asc'] },
    { key: 'sexo', sortable: true, sortingOptions: ['desc', 'asc'] },
    { key: 'idmae', sortable: true, sortingOptions: ['desc', 'asc'] },
    { key: 'idpai', sortable: true, sortingOptions: ['desc', 'asc'] },
  ]

  const sortBy = ref('nome')
  const sortingOrder = ref('desc')

  // TODO add a custom filtering function to filter only by nome and brinco

  // TODO Add advanced options to define which columns to filter by

  // TODO pre-work items so that we have links working
  function getParentValueStr(item: any) {
    if (!item) return ''
    const brincoStr = item.brinco ? ` - Br. ${item.brinco}` : ''
    return `${item.id}|${item.nome}${brincoStr}`
  }
  function getAnimalValueStr(item: any) {
    if (!item) return ''
    return `${item.id}|${item.nome}`
  }
  function splitParentValueStr(txt: string) {
    return txt.split('|')
  }
  const computedItems = computed(() => {
    return props.items.map((item) => {
      return {
        brinco: item.brinco,
        nome: getAnimalValueStr(item),
        sexo: item.sexo,
        idmae: getParentValueStr(item.idmae),
        idpai: getParentValueStr(item.idpai),
      }
    })
  })
</script>
