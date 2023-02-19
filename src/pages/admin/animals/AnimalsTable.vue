]
<template>
  <va-alert class="mt-3" color="info" outline>
    <span>
      Use this to alert something
      <va-chip>alerted message</va-chip>
    </span>
  </va-alert>
  <EasyDataTable :headers="headers" :items="props.items" :sort-by="'NOME'" :sort-type="'desc'" />
</template>

<script setup lang="ts">
  import type { Header } from 'vue3-easy-data-table'

  export interface Props {
    items: Array<any>
  }

  const props = withDefaults(defineProps<Props>(), {
    items: () => [],
  })

  const headers: Header[] = [
    { text: 'NOME', value: 'nome' },
    { text: 'SEXO', value: 'sexo' },
    { text: 'IDMAE', value: 'idmae' },
    { text: 'IDPAI', value: 'idpai' },
  ]
</script>
