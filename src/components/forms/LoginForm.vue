<template>
  <v-snackbar v-model="errorLogin" color="error" timeout="3000" location="top">
    {{ errorLoginMessage }}
  </v-snackbar>

  <v-container>
    <v-form ref="loginForm" v-model="formLoginValid" @submit.prevent="submitLoginForm">
      <v-row class="d-flex mb-3">
        <v-col cols="12">
          <v-text-field
            variant="outlined"
            type="email"
            color="primary"
            label="Usuário"
            :rules="emailRules"
            v-model="loginFormModel.email"
          />
        </v-col>
        <v-col cols="12">
          <v-text-field
            variant="outlined"
            type="password"
            color="primary"
            label="Senha"
            :rules="passwordRules"
            v-model="loginFormModel.password"
          />
        </v-col>
        <v-col cols="12" class="pt-0">
          <v-btn :loading="submitting" type="submit" color="primary" block flat>Realizar Login</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script setup>
import {ref} from 'vue';
import {useUserStore} from '@/stores/user';

const userStore = useUserStore();
const submitting = ref(false);

const loginForm = ref(null);
const formLoginValid = ref(false);

const emailRules = [
  (v) => !!v || 'Campo obrigatório',
  (v) => /.+@.+\..+/.test(v) || 'Email inválido'
];
const passwordRules = [
  (v) => !!v || 'Campo obrigatório'
];

const loginFormModel = ref({
  email: '',
  password: ''
});

const errorLogin = ref(false);
const errorLoginMessage = ref('');

const submitLoginForm = async () => {
  if (formLoginValid.value) {
    submitting.value = true;
    try {
      await userStore.signIn(loginFormModel.value);
      loginFormModel.value = {email: '', password: ''};
      loginForm.value.reset();
    } catch (error) {
      console.error(error);
      await userStore.signOut();
      errorLogin.value = true;
      errorLoginMessage.value = error.message || 'Erro ao realizar login';
    } finally {
      submitting.value = false;
    }
  }
};
</script>
