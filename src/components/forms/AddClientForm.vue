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
              :rules="formRules.username"
              variant="outlined"
              color="primary"
              type="email"
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              label="Senha"
              v-model="addNewUser.account.password"
              :rules="formRules.username"
              variant="outlined"
              color="primary"
              type="password"
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              label="Nome"
              v-model="addNewUser.name"
              :rules="formRules.username"
              variant="outlined"
              color="primary"
              name="name"
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              label="Telefone"
              v-model="addNewUser.tel"
              :rules="formRules.username"
              variant="outlined"
              color="primary"
              name="tel"
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              label="Endereço"
              v-model="addNewUser.address"
              :rules="formRules.username"
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
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              label="Gênero"
              v-model="addNewUser.gender"
              :rules="formRules.username"
              variant="outlined"
              color="primary"
              name="gender"
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              label="Foto do Perfil"
              v-model="addNewUser.profilePicture"
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

<script setup>
import { ref, watch } from 'vue';
import { useUserStore } from "@/stores/user";

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
  username: [
    (value) => !!value || 'Campo obrigatório'
  ]
});

const addNewUser = ref(initialUserState());

// Manipuladores de eventos
const handleSaveItem = async (e) => {
  e.preventDefault();

  const data = { ...addNewUser.value };

  try {
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
};

// Redefine o formulário quando o diálogo é fechado
watch(() => props.showDialog, (newVal) => {
  if (!newVal) {
    resetForm();
  }
});
</script>
