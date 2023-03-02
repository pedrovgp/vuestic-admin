<template>
  <div class="lact-open-cell-div">
    <va-badge
      :text="params.data.lact_is_open ? 'SIM' : 'NÃO'"
      :color="params.data.lact_is_open ? 'SUCCESS' : 'WARNING'"
    />
  </div>
</template>

<script setup lang="ts">
  export interface Props {
    params: any
  }

  const props = withDefaults(defineProps<Props>(), {
    params: () => 'Erro ao carregar nome',
  })
</script>

<style></style>
