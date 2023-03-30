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
          <va-button color="danger" icon="Skull"> Morte </va-button>
        </va-list-item>
        <va-list-separator :spaced="true" />
        <va-list-item class="list__item">
          <va-button color="success" icon="Paid"> Venda </va-button>
        </va-list-item>
      </va-list>
    </va-dropdown-content>
  </va-dropdown>
</template>

<script setup lang="ts">
  // Now this script should lazy load the modals above
  // Morte must have the fields: animal (automatically filled from the props.animalId), data, causa, obs
  // Venda must have the fields: animal (automatically filled from the props.animalId), data, valor, obs, comprador
  const props = defineProps<{
    animalId?: string
  }>()
</script>
