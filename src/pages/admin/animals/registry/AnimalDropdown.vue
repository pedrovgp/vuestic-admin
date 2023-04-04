<!-- This vue component renders a dropdown from Vuestic, which elements
are buttons for Morte and Venda, which in turn, when clicked, open
a form in a modal for registering the Death or Sale of the animal in context -->
<template>
  <va-dropdown>
    <template #anchor>
      <va-button icon="more_vert"> Registrar </va-button>
    </template>
    <va-dropdown-content>
      <va-list :fit="true">
        <va-list-item class="list__item">
          <birth-modal
            v-if="animal?.sexo == 'FEMEA'"
            :key="animal"
            :animal-id="props.animal.id"
            :animal-text="`${animal?.nome} - Br. ${animal?.brinco}`"
            button-text="Registrar cria"
            button-size="small"
          />
        </va-list-item>
        <va-list-separator :spaced="true" />
        <va-list-item class="list__item">
          <death-modal
            :key="animal"
            :animal-id="props.animal.id"
            :animal-text="`${animal?.nome} - Br. ${animal?.brinco}`"
            :button-text="animal?.vivo ? 'Registrar morte' : 'Editar morte'"
            button-size="small"
          />
        </va-list-item>
      </va-list>
    </va-dropdown-content>
  </va-dropdown>
</template>

<script setup lang="ts">
  // Now this script should lazy load the modals above
  // Morte must have the fields: animal (automatically filled from the props.animalId), data, causa, obs
  // Venda must have the fields: animal (automatically filled from the props.animalId), data, valor, obs, comprador
  import DeathModal from './DeathModal.vue'
  import BirthModal from './BirthModal.vue'

  const props = defineProps<{
    animal: any
  }>()

  // const deathModalComponent = defineAsyncComponent(() => import('./DeathModal.vue'))
  // const showDeathModal = ref(false)

  // function openDeathModal() {
  //   console.log('openDeathModal')
  //   showDeathModal.value = true
  // }
</script>
