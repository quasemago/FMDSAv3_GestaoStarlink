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
            name="email"
            :rules="emailRules"
            v-model="formModel.email"
          />
        </v-col>
        <v-col cols="12">
          <v-text-field
            variant="outlined"
            type="password"
            color="primary"
            label="Senha"
            :rules="passwordRules"
            v-model="formModel.password"
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
import {reactive, ref} from 'vue';
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

const formModel = reactive({
  email: '',
  password: ''
});

const errorLogin = ref(false);
const errorLoginMessage = ref('');

const submitLoginForm = async () => {
  if (formLoginValid.value === true) {
    submitting.value = true;
    try {
      await userStore.signIn(formModel);
      submitting.value = false;
    } catch (error) {
      console.log(error);
      await userStore.signOut();
      submitting.value = false;
      errorLogin.value = true;
      errorLoginMessage.value = error;
    }
    loginForm.value.reset();
  }
};
</script>
