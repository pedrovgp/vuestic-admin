<template>
  <div class="main_message">
    <a>Em breve aqui você poderá ver os dados da fazenda. Por enquanto, você pode ver os dados financeiros abaixo. </a>
  </div>
  <div class="financial_charts"><Charts /></div>
  <!-- <div class="dashboard">
    <dashboard-charts />

    <dashboard-info-block />

    <div class="row row-equal">
      <div class="flex xs12 lg6">
        <dashboard-tabs @submit="addAddressToMap" />
      </div>

      <div class="flex xs12 lg6">
        <DashboardMap ref="dashboardMap" />
      </div>
    </div>
  </div> -->
</template>

<script setup lang="ts">
  // import { ref } from 'vue'

  import Charts from '../statistics/charts/Charts.vue'
  // import DashboardCharts from './DashboardCharts.vue'
  // import DashboardInfoBlock from './DashboardInfoBlock.vue'
  // import DashboardTabs from './DashboardTabs.vue'
  // import DashboardMap from './DashboardMap.vue'

  // const dashboardMap = ref()

  // function addAddressToMap({ city, country }: { city: { text: string }; country: string }) {
  //   dashboardMap.value.addAddress({ city: city.text, country })
  // }
</script>

<style lang="scss">
  .row-equal .flex {
    .va-card {
      height: 100%;
    }
  }

  .dashboard {
    .va-card {
      margin-bottom: 0 !important;
      &__title {
        display: flex;
        justify-content: space-between;
      }
    }
  }
</style>
