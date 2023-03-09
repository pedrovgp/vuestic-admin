]
<template>
  <va-alert class="mt-3" color="info" outline>
    <span>
      Mostrando animais
      <va-button
        v-model="defaultAnimalFilter"
        hover-behavior="opacity"
        :hover-opacity="0.4"
        size="small"
        @click="defaultAnimalFilter = !defaultAnimalFilter"
        >{{ defaultAnimalFilter ? 'vivos na estância Suzana' : 'todos já registrados' }}
      </va-button>
      <p v-if="!loading">{{ items.length }} no total.</p>
      <p v-else>Carregando...</p>
    </span>
  </va-alert>
  <row>
    <va-input
      v-model="quickFilterText"
      class="flex flex-col mb-2 md6 xs12"
      placeholder="Escreva: busca em toda a tabela"
    />
  </row>
  <ag-grid-vue
    class="ag-theme-alpine"
    style="height: 500px"
    :column-defs="columns"
    :row-data="items"
    :default-col-def="defaultColDef"
    :quick-filter-text="debouncedQuickFilterText"
    animate-rows="true"
    @grid-ready="onGridReady"
    @virtual-columns-changed="onColumnsChanged"
  >
  </ag-grid-vue>
</template>

<script lang="ts">
  export default {
    name: 'AnimalsTable',
  }
</script>

<script setup lang="ts">
  import { AgGridVue } from 'ag-grid-vue3' // the AG Grid Vue Component
  import { ref, watch, onMounted } from 'vue'
  import AnimalApi from '../../../services/fam/fam'
  import debounce from 'lodash.debounce'
  import Nome from './cell-renderers/Nome.vue'
  import LactOpen from './cell-renderers/LactOpen.vue'

  const items: any = ref([])
  const defaultAnimalFilter = ref(true)
  const loading = ref(true)

  // in onGridReady, store the api for later use
  // Obtain API from grid's onGridReady event
  const gridApi = ref(null as any) // Optional - for accessing Grid's API
  const columnApi = ref(null as any) // Optional - for accessing Column's API
  function onGridReady(params: any) {
    params.api.showLoadingOverlay()
    gridApi.value = params.api
    columnApi.value = params.columnApi
  }

  function onColumnsChanged(params: any) {
    params.columnApi.autoSizeAllColumns()
  }

  function updateTableItems() {
    loading.value = true
    if (gridApi.value != null) gridApi.value.showLoadingOverlay()
    AnimalApi.getAll(defaultAnimalFilter.value ? { default_animal_filter: '1' } : {})
      .then((response) => {
        items.value = response.data
        loading.value = false
      })
      .catch((error) => {
        console.log(error)
      })
  }
  onMounted(async () => {
    updateTableItems()
  })
  watch(defaultAnimalFilter, updateTableItems)

  // Quick Filter
  const quickFilterText = ref('')
  const debouncedQuickFilterText = ref('')

  watch(
    quickFilterText,
    debounce(() => {
      debouncedQuickFilterText.value = quickFilterText.value
    }, 500),
  )

  // DefaultColDef sets props common to all Columns
  const defaultColDef = {
    sortable: true,
    minWidth: 65,
    maxWidth: 170,
    initialWidth: 100,
    // filter: true,
    // flex: 1,
    resizable: true,
    // wrapping cell and header texts
    wrapText: true,
    autoHeight: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
  }

  const defaultColumnFilter = {
    filter: true,
    floatingFilter: true, //https://www.ag-grid.com/vue-data-grid/floating-filters/
    floatingFilterComponentParams: { suppressFilterButton: true },
    filterParams: {
      debounceMs: 200,
    },
  }

  const columns = ref([
    {
      field: 'nome',
      sort: true,
      sortingOrder: ['asc', 'desc'],
      pinned: 'left',
      headerName: 'Nome',
      minWidth: 120,
      maxWidth: 170,
      width: 120,
      suppressSizeToFit: true,
      cellRenderer: Nome,
      ...defaultColumnFilter,
    },
    {
      field: 'brinco',
      sortingOrder: ['asc', 'desc'],
      headerName: 'Br.',
      minWidth: 60,
      width: 60,
      suppressSizeToFit: true,
      ...defaultColumnFilter,
    },
    { field: 'sexo', sortingOrder: ['asc', 'desc'], headerName: 'Sexo' },
    {
      field: 'idmae',
      headerName: 'Mãe',
      sortingOrder: ['asc', 'desc'],
      cellRenderer: Nome,
      cellRendererParams: {
        hierarchy: 'idmae',
      },
      ...defaultColumnFilter,
    },
    {
      field: 'idpai',
      headerName: 'Pai',
      sortingOrder: ['asc', 'desc'],
      cellRenderer: Nome,
      cellRendererParams: {
        hierarchy: 'idpai',
      },
      ...defaultColumnFilter,
    },
    {
      field: 'datanascimento',
      sortingOrder: ['asc', 'desc'],
      headerName: 'Nascimento',
      // filter: true,
      // floatingFilter: true,
    },
    { field: 'idade', headerName: 'Idade (meses)', sortingOrder: ['asc', 'desc'] },
    { field: 'obs', sortingOrder: ['asc', 'desc'], headerName: 'Observação temporária', initialWidth: 190 },
    { field: 'autoname', sortingOrder: ['asc', 'desc'], headerName: 'Nome auto' },
    { field: 'birthorder', sortingOrder: ['asc', 'desc'], headerName: 'Ordem de nasc.' },
    { field: 'lact_is_open', sortingOrder: ['asc', 'desc'], headerName: 'Lact. aberta', cellRenderer: LactOpen },
    //fieldkey: 'lact_condition', sortingOrder: ['asc', 'desc'], headerName: 'condição' },
    { field: 'categoria', sortingOrder: ['asc', 'desc'], headerName: 'Categoria' },
    { field: 'pregnancy_condition', sortingOrder: ['asc', 'desc'], headerName: 'Prenhez', initialWidth: 190 },
    { field: 'last_birth_date', sortingOrder: ['asc', 'desc'], headerName: 'Último parto' },
    { field: 'iep', sortingOrder: ['asc', 'desc'], headerName: 'IEP' },
    { field: 'origem', sortingOrder: ['asc', 'desc'], headerName: 'Origem' },
  ])

  // TODO add a custom filtering function to filter only by nome and brinco

  // TODO Add advanced options to define which columns to filter by
</script>

<style lang="scss">
  @import '@vuestic/ag-grid-theme';
  .ag-cell {
    --ag-cell-horizontal-padding: 5px;
  }
  .ag-cell-value {
    line-height: 1.1em;
  }
</style>
