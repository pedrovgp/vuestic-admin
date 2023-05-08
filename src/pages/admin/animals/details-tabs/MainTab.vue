<template>
  <div class="pt-2">
    <div class="row">
      <div class="flex sm12 md6">
        <div class="title mb-3" :style="computedStylesTitle">
          <va-badge
            :text="animal.vivo ? 'Animal vivo' : 'Animal morto'"
            :color="animal.vivo ? colors.success : colors.error"
          />
        </div>
        <model-text-input
          :initial-value="animal.nome"
          :update-api="AnimalApi"
          :update-field-name="'nome'"
          :update-entity-id="animal.id.toString()"
          :label="'Nome'"
          :success-message="'Nome atualizado com sucesso'"
        />
        <model-text-input
          :initial-value="animal.datanascimento"
          :component-type="'date'"
          :update-api="AnimalApi"
          :update-field-name="'datanascimento'"
          :update-entity-id="animal.id.toString()"
          :label="'Nascimento'"
          :success-message="'Nascimento atualizado com sucesso'"
        />
        <model-text-input
          :initial-value="animal.brinco"
          :update-api="AnimalApi"
          :update-field-name="'brinco'"
          :update-entity-id="animal.id.toString()"
          :label="'Brinco'"
          :success-message="'Brinco atualizado com sucesso'"
        />
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
        <model-text-input
          :initial-value="animal.obs"
          :update-api="AnimalApi"
          update-field-name="obs"
          :update-entity-id="animal.id.toString()"
          label="Observação"
          success-message="Observação atualizada com sucesso"
          type="textarea"
          autosize
          :min-rows="5"
        />
        <file-input
          :initial-value="[animal.one_picture]"
          :update-api="AnimalApi"
          update-field-name="one_picture"
          :update-entity-id="animal.id.toString()"
          label="Foto"
          success-message="Foto atualizada com sucesso"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  export default {
    name: 'AnimalOverviewTab',
  }
</script>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useColors } from 'vuestic-ui'
  import AnimalSelect from '../form-fields/AnimalSelect.vue'
  import ModelTextInput from '../form-fields/ModelTextInput.vue'
  import FileInput from '../form-fields/FileInput.vue'
  import { createApi } from '../../../../services/fam/fam'

  const AnimalApi = createApi('animal')

  const { colors } = useColors()

  const props = withDefaults(
    defineProps<{
      animal: any
    }>(),
    {
      animal: { nome: 'teste' },
    },
  )

  const animal = ref(props.animal)

  const computedStylesTitle = computed(() => ({ color: colors.dark }))
</script>

<style lang="scss" scoped>
  .va-input-wrapper {
    margin-bottom: 1rem;
  }
</style>
