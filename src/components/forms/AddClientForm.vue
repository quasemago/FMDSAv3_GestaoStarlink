<script setup>
import {reactive} from 'vue';
import {useUserStore} from "@/stores/user";

const userStore = useUserStore();
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

const newUser = reactive({
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

// Manipuladores de eventos
const handleSaveItem = async (e) => {
  e.preventDefault();

  const data = {...newUser};
  console.log(data);

  try {
    await userStore.registerClient(data);
    console.log("criado")
  } catch (error) {
    console.error(error);
  }

  handleCancelEdit();
};

const handleCancelEdit = () => {
  emit('form:cancel');
};
</script>

<template>
  <VCard width="640px">
    <VToolbar tag="div">
      <VToolbarTitle>Cadastrar Cliente</VToolbarTitle>
      <VBtn icon="mdi-close" @click="$emit('form:cancel')"></VBtn>
    </VToolbar>
    <VCardText>
      <VForm>
        <VRow class="d-flex mb-3">
          <VCol cols="12">
            <VTextField
              label="Email"
              v-model="newUser.account.email"
              :rules="formRules.username"
              variant="outlined"
              color="primary"
              name="email"
              type="email"
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              label="Senha"
              v-model="newUser.account.password"
              :rules="formRules.username"
              variant="outlined"
              color="primary"
              name="password"
              type="password"
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              label="Nome"
              v-model="newUser.name"
              :rules="formRules.username"
              variant="outlined"
              color="primary"
              name="name"
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              label="Telefone"
              v-model="newUser.tel"
              :rules="formRules.username"
              variant="outlined"
              color="primary"
              name="tel"
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              label="Endereço"
              v-model="newUser.address"
              :rules="formRules.username"
              variant="outlined"
              color="primary"
              name="address"
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              label="Data de Nascimento"
              v-model="newUser.birthDate"
              variant="outlined"
              color="primary"
              name="birthDate"
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              label="Gênero"
              v-model="newUser.gender"
              :rules="formRules.username"
              variant="outlined"
              color="primary"
              name="gender"
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              label="Foto do Perfil"
              v-model="newUser.profilePicture"
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
