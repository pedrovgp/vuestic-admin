<template>
  <va-navbar class="app-layout-navbar">
    <template #left>
      <div class="left">
        <va-icon-menu-collapsed
          :class="{ 'x-flip': isSidebarMinimized }"
          class="va-navbar__item"
          :color="colors.primary"
          @click="isSidebarMinimized = !isSidebarMinimized"
        />
        <div class="app-navbar-center">
          <animal-select
            :key="reloadAnimalSelect"
            label="Buscar um animal"
            update-field-name="null"
            update-entity-id="null"
            :clearable="true"
            success-message="Animal selecionado"
            placeholder-text="Digite nome ou brinco"
            :online-updates="false"
            :always-editable="true"
            class="mt-3"
            @selected-option-id-changed="(id: any) => goToAnimal(id)"
          />
        </div>
      </div>
    </template>
    <template #center> </template>
    <template #right>
      <app-navbar-actions class="app-navbar__actions md5 lg4" :user-name="userName" />
    </template>
  </va-navbar>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import { computed, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useGlobalStore } from '../../stores/global-store'
  import { useColors } from 'vuestic-ui'
  import VaIconMenuCollapsed from '../icons/VaIconMenuCollapsed.vue'
  import AppNavbarActions from './components/AppNavbarActions.vue'
  import AnimalSelect from '../../pages/admin/animals/form-fields/AnimalSelect.vue'

  const GlobalStore = useGlobalStore()

  const { isSidebarMinimized, userName } = storeToRefs(GlobalStore)

  const { getColors } = useColors()
  const colors = computed(() => getColors())
  const router = useRouter()

  const reloadAnimalSelect = ref(0)

  async function goToAnimal(id: any) {
    if (id) {
      router.push({ name: 'animalsDetails', params: { animalId: id } })
      ++reloadAnimalSelect.value
    }
  }
</script>

<style lang="scss" scoped>
  .va-navbar {
    box-shadow: var(--va-box-shadow);
    z-index: 2;

    @media screen and (max-width: 950px) {
      .left {
        width: 100%;
      }

      .app-navbar__actions {
        width: 100%;
        display: flex;
        justify-content: space-between;
      }
    }
  }

  .left {
    display: flex;
    align-items: center;

    & > * {
      margin-right: 1.5rem;
    }

    & > *:last-child {
      margin-right: 0;
    }
  }

  .x-flip {
    transform: scaleX(-100%);
  }

  .app-navbar-center {
    display: flex;
    align-items: center;

    @media screen and (max-width: 1200px) {
      &__github-button {
        display: none;
      }
    }

    @media screen and (max-width: 950px) {
      &__text {
        display: none;
      }
    }
  }
</style>
