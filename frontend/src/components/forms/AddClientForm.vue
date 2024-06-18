<template>
  <v-snackbar v-model="successSaveMessage" color="success" timeout="3000" location="top">
    <v-icon icon="mdi-check-circle"></v-icon>
    Cliente cadastrado com sucesso!
  </v-snackbar>
  <VCard width="640px">
    <VToolbar tag="div">
      <VToolbarTitle>Cadastrar Cliente</VToolbarTitle>
      <VBtn icon="mdi-close" @click="handleCancelEdit"></VBtn>
    </VToolbar>
    <VCardText>
      <VForm>
        <VRow class="d-flex mb-3">
          <VCol cols="12">
            <VTextField
              label="Email"
              v-model="addNewUser.account.email"
              :rules="formRules.email"
              variant="outlined"
              color="primary"
              type="email"
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              label="Senha"
              v-model="addNewUser.account.password"
              :rules="formRules.password"
              variant="outlined"
              color="primary"
              type="password"
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              label="Nome"
              v-model="addNewUser.name"
              :rules="formRules.emptyField"
              variant="outlined"
              color="primary"
              name="name"
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              label="Telefone"
              v-model="addNewUser.tel"
              :rules="formRules.tel"
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
              v-model="addNewUser.address"
              :rules="formRules.emptyField"
              variant="outlined"
              color="primary"
              name="address"
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              label="Data de Nascimento"
              v-model="addNewUser.birthDate"
              variant="outlined"
              color="primary"
              name="birthDate"
              type="date"
            />
          </VCol>
          <VCol cols="12">
            <v-select
              label="Gênero"
              v-model="addNewUser.gender"
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
import {ref, watch} from 'vue';
import {normalizeTel} from "@/utils";
import {useUserStore} from "@/stores/user";

const userStore = useUserStore();
const emit = defineEmits(['form:cancel', 'form:saved']);
const props = defineProps({
  showDialog: {
    type: Boolean,
    required: true
  }
});

const successSaveMessage = ref(false);

const initialUserState = () => ({
  account: {
    email: '',
    password: ''
  },
  name: '',
  tel: '',
  address: '',
  birthDate: '',
  gender: '',
  profilePicture: ''
});

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

const profilePictureFile = ref(null);
const addNewUser = ref(initialUserState());

// Manipuladores de eventos
const handleSaveItem = async (e) => {
  e.preventDefault();

  const data = {...addNewUser.value};

  try {
    data.tel = normalizeTel(data.tel);

    if (profilePictureFile.value) {
      data.profilePicture = profilePictureFile.value
    }

    await userStore.registerClient(data);
    successSaveMessage.value = true;
    emit('form:saved')
  } catch (error) {
    console.error(error);
  }

  handleCancelEdit();
};

const handleCancelEdit = () => {
  resetForm();
  emit('form:cancel');
};

const resetForm = () => {
  Object.assign(addNewUser.value, initialUserState());
  profilePictureFile.value = null;
};

// Redefine o formulário quando o diálogo é fechado
watch(() => props.showDialog, (newVal) => {
  if (!newVal) {
    resetForm();
  }
});
</script>
