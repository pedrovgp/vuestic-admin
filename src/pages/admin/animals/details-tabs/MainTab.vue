<template>
  <div class="pt-2">
    <div class="row">
      <div class="flex sm12 md6">
        <div class="title mb-3" :style="computedStylesTitle">Principal</div>
        <model-text-input
          :initial-value="animal.nome"
          :update-api="AnimalApi"
          :update-field-name="'nome'"
          :update-entity-id="animal.id.toString()"
          :label="'Nome'"
          :success-message="'Nome atualizado com sucesso'"
        />
        <!-- <va-input v-model="animal.nome" :label="'Nome'" /> -->
        <va-input v-model="animal.datanascimento" :label="'Nascimento'" />
        <va-input v-model="animal.brinco" :label="'Brinco'" />
      </div>
      <div class="flex sm12 md6">
        <div class="title mb-3" :style="computedStylesTitle">Mais informações</div>
        <animal-select
          :animal-id="animal.idmae?.id"
          :label="'Mãe'"
          :update-api="AnimalApi"
          :update-field-name="'idmae'"
          :update-entity-id="animal.id.toString()"
          :success-message="'Mãe atualizada com sucesso'"
          :pre-filter="{ sexo: 'FEMEA' }"
        />
        <animal-select
          :animal-id="animal.idpai?.id"
          :label="'Pai'"
          :update-api="AnimalApi"
          :update-field-name="'idpai'"
          :update-entity-id="animal.id.toString()"
          :success-message="'Pai atualizado com sucesso'"
          :pre-filter="{ sexo: 'MACHO' }"
        />
      </div>
    </div>
    <!-- <div class="row justify-center mb-3">
      <va-button @click="submit"> Salvar alterações </va-button>
    </div> -->
  </div>
</template>

<script lang="ts">
  export default {
    name: 'AnimalOverviewTab',
  }
</script>

<script setup lang="ts">
  import { computed, reactive, ref, watch } from 'vue'
  import { useColors } from 'vuestic-ui'
  import { useI18n } from 'vue-i18n'
  import AnimalSelect from '../form-fields/AnimalSelect.vue'
  import ModelTextInput from '../form-fields/ModelTextInput.vue'
  import AnimalApi from '../../../../services/fam/fam'

  const { colors } = useColors()
  const { t } = useI18n()

  const props = withDefaults(
    defineProps<{
      animal: any
    }>(),
    {
      animal: { nome: 'teste' },
    },
  )

  const animal = ref(props.animal)

  const emit = defineEmits<{
    (e: 'submit', data: typeof form): void
  }>()

  const form = reactive({
    name: 'John Smith',
    email: 'smith@gmail.com',
    address: '93  Guild Street',
    city: { text: 'London' },
    country: 'United Kingdom',
    connection: true,
  })

  const computedStylesTitle = computed(() => ({ color: colors.dark }))

  function submit() {
    emit('submit', form)
  }
</script>

<style lang="scss" scoped>
  .va-input-wrapper {
    margin-bottom: 1rem;
  }
</style>
