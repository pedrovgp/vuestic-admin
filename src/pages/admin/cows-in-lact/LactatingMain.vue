<!-- Display an empty page with some text, just to know the link works -->
<template>
  <div>
    <va-alert class="mt-3" color="info" outline>
      <span> Vacas em lactação ou recém paridas </span>
    </va-alert>
  </div>
  <div>
    <ag-grid-vue
      class="ag-theme-alpine"
      :row-data="cows"
      :column-defs="columnDefs"
      :default-col-def="defaultColDef"
    ></ag-grid-vue>
  </div>
</template>

<script setup>
  import { AgGridVue } from 'ag-grid-vue3' // the AG Grid Vue Component
  import { ref, onMounted } from 'vue'
  import createApi from '../../../services/fam/fam'
  import ChangeOrCreateLactation from './cell-renderers/ChangeOrCreateLactation.vue'

  const cows = ref([])
  const AnimalApi = createApi('animal')
  // Mocked API response
  const mockApiResponse = [
    {
      id: 1,
      name: 'Bessie',
      brinco: '1234',
      status: 'Lactating',
      lastBirthDate: '2023-01-15',
      lactationOpenDate: '2023-01-16',
      lactationOpen: true,
    },
    {
      id: 2,
      name: 'Daisy',
      brinco: '1254b',
      status: 'Recent Birth',
      lastBirthDate: '2023-03-20',
      lactationOpen: false,
    },
  ]

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

  const columnDefs = ref([
    { field: 'id', headerName: 'id', hide: true },
    {
      field: 'name',
      headerName: 'Nome',
      sort: true,
      sortingOrder: ['asc', 'desc'],
      pinned: 'left',
      suppressSizeToFit: true,
      suppressMovable: true,
      ...defaultColumnFilter,
    },
    {
      field: 'brinco',
      headerName: 'Br.',
      sort: true,
      sortingOrder: ['asc', 'desc'],
      minWidth: 60,
      width: 60,
      pinned: 'left',
      suppressSizeToFit: true,
      suppressMovable: true,
      ...defaultColumnFilter,
    },
    {
      field: 'action',
      headerName: 'Ação',
      cellRenderer: ChangeOrCreateLactation,
    },
    { field: 'status', headerName: 'Status' },
    { field: 'lastBirthDate', headerName: 'Último Parto' },
    { field: 'lactationOpenDate', headerName: 'Abertura da Lactação' },
  ])

  async function fetchCows() {
    // Use the mock response instead of fetching from the API
    cows.value = mockApiResponse
  }

  onMounted(fetchCows)

  function closeLactation(cowId) {
    // Implement the function to close lactation
  }

  function openLactation(cowId) {
    // Implement the function to open lactation
  }
</script>

<style lang="scss">
  @import '@vuestic/ag-grid-theme';
  .ag-cell {
    --ag-cell-horizontal-padding: 5px;
  }
  .ag-cell-value {
    line-height: 1.1em;
  }
  .ag-theme-alpine {
    height: 500px;
    width: 100%;
  }
</style>
