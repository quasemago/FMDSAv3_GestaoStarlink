<script setup>
import {reactive, watch} from 'vue';
import {useUserStore} from "@/stores/user";

const userStore = useUserStore();

// Definindo as propriedades e emitindo eventos
const props = defineProps({
  user: {
    type: Object,
    required: true
  }
});
const emit = defineEmits(['form:cancel']);

// Regras do formulário
const formRules = reactive({
  username: [
    (value) => {
      if (value) return true;
      return 'Username required';
    }
  ]
});

// Modelo reativo do formulário
const formModel = reactive({
  ...props.user
});

// Manipuladores de eventos
const handleSaveItem = async (e) => {
  e.preventDefault();

  const data = {...formModel};

  try {
    await userStore.updateClient(data.id, data);
    console.log("atualizado")
  } catch (error) {
    console.error(error);
  }

  handleCancelEdit();
};

const handleCancelEdit = () => {
  emit('form:cancel');
};

// Assistindo mudanças nas propriedades
watch(props, () => {
  Object.assign(formModel, props.user);
});
</script>

<template>
  <VCard width="640px">
    <VToolbar tag="div">
      <VToolbarTitle>Editar Cliente</VToolbarTitle>
      <VBtn icon="mdi-close" @click="$emit('form:cancel')"></VBtn>
    </VToolbar>
    <VCardText>
      <VForm>
        <VRow class="d-flex mb-3">
          <VCol cols="12">
            <VTextField
              label="Nome"
              v-model="formModel.name"
              :rules="formRules.username"
              variant="outlined"
              color="primary"
              name="name"
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              label="Telefone"
              v-model="formModel.tel"
              :rules="formRules.username"
              variant="outlined"
              color="primary"
              name="tel"
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              label="Endereço"
              v-model="formModel.address"
              :rules="formRules.username"
              variant="outlined"
              color="primary"
              name="address"
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              label="Data de Nascimento"
              v-model="formModel.birthDate"
              variant="outlined"
              color="primary"
              name="birthDate"
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              label="Gênero"
              v-model="formModel.gender"
              :rules="formRules.username"
              variant="outlined"
              color="primary"
              name="gender"
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              label="Foto do Perfil"
              v-model="formModel.profilePicture"
              :rules="formRules.username"
              variant="outlined"
              color="primary"
              name="profilePicture"
            />
          </VCol>
        </VRow>
      </VForm>
    </VCardText>
    <VCardActions>
      <VBtn type="submit" variant="outlined" color="primary" @click="handleSaveItem">Salvar</VBtn>
      <VBtn @click="handleCancelEdit">Cancelar</VBtn>
    </VCardActions>
  </VCard>
</template>
