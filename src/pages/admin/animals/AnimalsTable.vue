]
<template>
  <va-alert class="mt-3" color="info" outline>
    <span>
      Mostrando apenas animais
      <va-chip>vivos na estância Suzana</va-chip>.
      <p v-if="computedItems.length ? true : false">{{ computedItems.length }} no total.</p>
      <p v-else>Carregando...</p>
    </span>
  </va-alert>
  <row>
    <va-input v-model="input" class="flex flex-col mb-2 md6 xs12" placeholder="Escreva aqui para filtrar" />
  </row>
  <ag-grid-vue
    class="ag-theme-alpine"
    style="height: 500px"
    :column-defs="columns"
    :row-data="computedItems"
    :default-col-def="defaultColDef"
    animate-rows="true"
    @grid-ready="onGridReady"
    @virtual-columns-changed="onColumnsChanged"
  >
    <!-- 
    <template #cell(idpai)="{ value }"
      ><va-chip v-if="splitParentValueStr(value)[0]" :to="'animals/' + splitParentValueStr(value)[0]" size="small">{{
        splitParentValueStr(value)[1]
      }}</va-chip></template
    >
    <template #cell(idmae)="{ value }"
      ><va-chip v-if="splitParentValueStr(value)[0]" :to="'animals/' + splitParentValueStr(value)[0]" size="small">{{
        splitParentValueStr(value)[1]
      }}</va-chip></template
    >
    <template #cell(lact_is_open)="{ value }"
      ><va-badge :text="value == 'true' ? 'SIM' : 'NÃO'" :color="value == 'true' ? 'SUCCESS' : 'WARNING'"
    /></template> -->
  </ag-grid-vue>
</template>

<script lang="ts">
  export default {
    name: 'AnimalsTable',
  }
</script>

<script setup lang="ts">
  import { AgGridVue } from 'ag-grid-vue3' // the AG Grid Vue Component
  import { ref, watch, computed } from 'vue'
  import debounce from 'lodash.debounce'
  import Nome from './cell-renderers/Nome.vue'
  import LactOpen from './cell-renderers/LactOpen.vue'
  import IdMae from './cell-renderers/IdMae.vue'

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

  // DefaultColDef sets props common to all Columns
  const defaultColDef = {
    sortable: true,
    minWidth: 65,
    // maxWidth: 200,
    // filter: true,
    // flex: 1,
    resizable: true,
  }

  // in onGridReady, store the api for later use
  // Obtain API from grid's onGridReady event
  const gridApi = ref(null) // Optional - for accessing Grid's API
  const columnApi = ref(null) // Optional - for accessing Grid's API
  function onGridReady(params: any) {
    gridApi.value = params.api
    columnApi.value = params.columnApi
  }

  function onColumnsChanged(params: any) {
    params.columnApi.autoSizeAllColumns()
  }

  const columns = ref([
    {
      field: 'nome',
      sort: true,
      sortingOrder: ['asc', 'desc'],
      pinned: 'left',
      headerName: 'Nome',
      minWidth: 120,
      maxWidth: 200,
      width: 120,
      suppressSizeToFit: true,
      cellRenderer: Nome,
      wrapText: true,
      autoHeight: true,
    },
    {
      field: 'brinco',
      sortingOrder: ['asc', 'desc'],
      headerName: 'Br.',
      minWidth: 60,
      width: 60,
      suppressSizeToFit: true,
    },
    { field: 'sexo', sortingOrder: ['asc', 'desc'], headerName: 'Sexo' },
    { field: 'idmae', headerName: 'Mãe', sortingOrder: ['asc', 'desc'], cellRenderer: IdMae },
    { field: 'idpai', headerName: 'Pai', sortingOrder: ['asc', 'desc'] },
    { field: 'datanascimento', sortingOrder: ['asc', 'desc'], headerName: 'Nascimento' },
    { field: 'idade', headerName: 'Idade (meses)', sortingOrder: ['asc', 'desc'] },
    { field: 'obs', sortingOrder: ['asc', 'desc'], headerName: 'Observação temporária' },
    { field: 'autoname', sortingOrder: ['asc', 'desc'], headerName: 'Nome auto' },
    { field: 'birthorder', sortingOrder: ['asc', 'desc'], headerName: 'Ordem de nasc.' },
    { field: 'lact_is_open', sortingOrder: ['asc', 'desc'], headerName: 'Lact. aberta', cellRenderer: LactOpen },
    //fieldkey: 'lact_condition', sortingOrder: ['asc', 'desc'], headerName: 'condição' },
    { field: 'categoria', sortingOrder: ['asc', 'desc'], headerName: 'Categoria' },
    { field: 'pregnancy_condition', sortingOrder: ['asc', 'desc'], headerName: 'Prenhez' },
    { field: 'last_birth_date', sortingOrder: ['asc', 'desc'], headerName: 'Último parto' },
    { field: 'iep', sortingOrder: ['asc', 'desc'], headerName: 'IEP' },
    { field: 'origem', sortingOrder: ['asc', 'desc'], headerName: 'Origem' },
  ])

  // TODO add a custom filtering function to filter only by nome and brinco

  // TODO Add advanced options to define which columns to filter by

  // TODO pre-work items so that we have links working
  function getParentValueStr(item: any) {
    if (!item) return ''
    const brincoStr = item.brinco ? ` - Br. ${item.brinco}` : ''
    return `${item.id}|${item.nome}${brincoStr}`
  }
  const computedItems = computed(() => {
    return props.items.map((item) => {
      return {
        ...item,
        brinco: item.brinco,
        nome: item.nome,
        sexo: item.sexo,
        idpai: getParentValueStr(item.idpai),
      }
    })
  })
</script>

<style lang="scss">
  @import '@vuestic/ag-grid-theme';
  .ag-cell {
    --ag-cell-horizontal-padding: 5px;
  }
</style>
