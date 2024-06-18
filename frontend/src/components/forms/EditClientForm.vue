<template>
  <v-snackbar v-model="successEditMessage" color="success" timeout="3000" location="top">
    <v-icon icon="mdi-check-circle"></v-icon>
    Cliente editado com sucesso!
  </v-snackbar>
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
              :rules="formRules.emptyField"
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
              type="tel"
              v-mask="'(##) #####-####'"
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              label="Endereço"
              v-model="formModel.address"
              :rules="formRules.emptyField"
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
              type="date"
            />
          </VCol>
          <VCol cols="12">
            <VSelect
              label="Gênero"
              v-model="formModel.gender"
              :items="genderOptions"
              item-title="title"
              item-value="value"
              :rules="formRules.gender"
              variant="outlined"
              color="primary"
              name="gender"
            />
          </VCol>
          <VCol cols="12">
            <VFileInput
              label="Foto do Perfil"
              v-model="profilePictureFile"
              variant="outlined"
              color="primary"
              name="profilePicture"
              accept="image/png, image/jpeg"
              prepend-icon=""
              append-inner-icon="mdi-camera"
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

<script setup>
import {reactive, ref, watch} from 'vue';
import {normalizeTel} from "@/utils";
import {useUserStore} from "@/stores/user";

const userStore = useUserStore();
const successEditMessage = ref(false);

// Definindo as propriedades e emitindo eventos
const props = defineProps({
  user: {
    type: Object,
    required: true
  }
});
const emit = defineEmits(['form:cancel', 'form:saved']);

// Regras do formulário
const formRules = ref({
  emptyField: [
    (value) => !!value || 'Campo obrigatório',
    (value) => value.length >= 3 || 'Esse campo deve ter no mínimo 3 caracteres'
  ],
  password: [
    (value) => !!value || 'Campo obrigatório',
    (value) => value.length >= 6 || 'Senha deve ter no mínimo 6 caracteres'
  ],
  email: [
    (value) => !!value || 'Campo obrigatório',
    (value) => /.+@.+\..+/.test(value) || 'E-mail inválido'
  ],
  tel: [
    (value) => !!value || 'Campo obrigatório',
    (value) => /^\(\d{2}\) \d{5}-\d{4}$/.test(value) || 'Telefone inválido'
  ],
  gender: [
    (value) => !!value || 'Campo obrigatório',
    (value) => ['M', 'F'].includes(value) || 'Gênero inválido'
  ],
});

const genderOptions = ref([
  {title: 'Masculino', value: 'M'},
  {title: 'Feminino', value: 'F'}
]);

// Modelo reativo do formulário
const profilePictureFile = ref(null);
const formModel = reactive({
  ...props.user
});

// Manipuladores de eventos
const handleSaveItem = async (e) => {
  e.preventDefault();

  const data = {...formModel};
  const clientId = data.id;

  try {
    // Cliente alterou a foto de perfil, portanto,
    // tenta fazer a atualização dela antes dos dados.
    if (profilePictureFile.value) {
      await userStore.updateClientProfilePicture(clientId, profilePictureFile.value);
    }

    // Normalize fields.
    data.tel = normalizeTel(data.tel);

    await userStore.updateClient(clientId, {
      name: data.name,
      tel: data.tel,
      address: data.address,
      birthDate: data.birthDate,
      gender: data.gender
    });
    successEditMessage.value = true;
    emit('form:saved')
  } catch (error) {
    console.error(error);
  }

  handleCancelEdit();
};

const handleCancelEdit = () => {
  profilePictureFile.value = null;
  emit('form:cancel');
};

// Assistindo mudanças nas propriedades
watch(props, () => {
  profilePictureFile.value = null;
  Object.assign(formModel, props.user);
});
</script>
