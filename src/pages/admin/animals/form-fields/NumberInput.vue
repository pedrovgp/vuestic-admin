<template>
  <div class="flex gap-8 flex-wrap">
    <va-counter v-model="value" buttons width="360px">
      <template #decreaseAction>
        <va-button-group>
          <va-button v-for="step in steps" :key="step" class="!px-0" @click="value -= step"> -{{ step }} </va-button>
        </va-button-group>
      </template>
      <template #increaseAction>
        <va-button-group>
          <va-button v-for="step in steps" :key="step" class="!px-0" @click="value += step"> +{{ step }} </va-button>
        </va-button-group>
      </template>
    </va-counter>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        value: 0,
        steps: [1, 10, 100, 1000],
      }
    },
  }
</script>
