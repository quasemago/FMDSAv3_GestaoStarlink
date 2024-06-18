<template>
  <v-container>
    <v-snackbar v-model="successSaveMessage" color="success" timeout="3000" location="top">
      <v-icon icon="mdi-check-circle"></v-icon>
      Perfil atualizado com sucesso!
    </v-snackbar>
    <v-card>
      <v-card-title>Editar Perfil</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-row>
            <v-col cols="12" md="4" class="d-flex flex-column align-center mt-16">
              <div class="profile-picture-container" @click="selectProfilePicture">
                <v-avatar size="254px" class="mb-4 avatar-clickable">
                  <v-img :src="profilePictureUrl"></v-img>
                  <div class="overlay">
                    <v-icon>mdi-camera</v-icon>
                    <span>Alterar Foto</span>
                  </div>
                </v-avatar>
              </div>
              <v-file-input
                ref="profilePictureInput"
                label="Alterar Foto do Perfil"
                v-model="profilePictureFile"
                accept="image/png, image/jpeg"
                prepend-icon=""
                hide-input
              />
            </v-col>
            <!-- Formulário de Perfil -->
            <v-col cols="12" md="8">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="Nome"
                    v-model="profile.name"
                    :rules="formRules.emptyField"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="Telefone"
                    v-model="profile.tel"
                    :rules="formRules.tel"
                    type="tel"
                    v-mask="'(##) #####-####'"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="Endereço"
                    v-model="profile.address"
                    :rules="formRules.emptyField"
                    required
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="Data de Nascimento"
                    v-model="profile.birthDate"
                    variant="outlined"
                    color="primary"
                    name="birthDate"
                    type="date"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    label="Gênero"
                    v-model="profile.gender"
                    :items="genderOptions"
                    item-title="title"
                    item-value="value"
                    :rules="formRules.gender"
                    variant="outlined"
                    color="primary"
                    name="gender"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="Nova Senha (opcional)"
                    v-model="profile.newPassword"
                    type="password"
                    :rules="formRules.password"
                  />
                </v-col>
                <v-card-actions>
                  <v-btn class="btnEdit mb-6" variant="tonal" color="primary" @click="saveProfile">Salvar</v-btn>
                  <v-btn class="btnEdit mb-6" variant="tonal" @click="resetForm">Resetar</v-btn>
                </v-card-actions>
              </v-row>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import {reactive, ref, watch} from 'vue';
import {normalizeTel} from "@/utils";
import {useUserStore} from "@/stores/user";

const userStore = useUserStore();

const successSaveMessage = ref(false);
const valid = ref(false);

const loadData = () => {
  const client = userStore.getClientProfile
  return initialUserState(client);
}

const initialUserState = (client) => ({
  name: client.name,
  tel: client.tel,
  address: client.address,
  birthDate: client.birthDate,
  gender: client.gender,
  profilePicture: client.profilePicture || '',
  newPassword: ''
});

const profile = reactive(loadData());
const profilePictureFile = ref(null);
const profilePictureUrl = ref(userStore.formatProfilePicture(profile.profilePicture));

const formRules = ref({
  emptyField: [
    (value) => !!value || 'Campo obrigatório',
    (value) => value.length >= 3 || 'Esse campo deve ter no mínimo 3 caracteres'
  ],
  password: [(v) => !v || v.length >= 6 || 'A senha deve ter pelo menos 6 caracteres'],
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

const saveProfile = async () => {
  if (!valid.value) {
    return;
  }

  const data = {...profile};

  try {
    // Se a nova senha foi preenchida, tente atualizar primeiro a nova senha.
    if (data.newPassword && data.newPassword.length > 0) {
      await userStore.updateClientSelfPassword(data.newPassword);
    }

    // Checa se o usuário alterou a foto do perfil,
    // e atualiza a foto do perfil se necessário.
    if (profilePictureFile.value) {
      await userStore.updateClientSelfProfilePicture(profilePictureFile.value);
    }

    // Normalize fields.
    data.tel = normalizeTel(data.tel);

    await userStore.updateClientSelfDetails({
      name: data.name,
      tel: data.tel,
      address: data.address,
      birthDate: data.birthDate,
      gender: data.gender
    });
    successSaveMessage.value = true;
  } catch (error) {
    console.error(error);
  }
};

const resetForm = () => {
  Object.assign(profile, loadData());
  profilePictureFile.value = null;
  profilePictureUrl.value = userStore.formatProfilePicture(profile.profilePicture);
};

// Método para abrir o seletor de arquivo
const profilePictureInput = ref(null);
const selectProfilePicture = () => {
  if (profilePictureInput.value) {
    profilePictureInput.value.click();
  }
};

// Observador para atualizar a URL da foto do perfil quando um novo arquivo é selecionado
watch(profilePictureFile, (newFile) => {
  if (newFile) {
    profilePictureUrl.value = URL.createObjectURL(newFile);
  }
});
</script>

<style scoped>
.btnEdit {
  padding: 20px 25px 35px;
  font-size: 1.12em;
}

.profile-picture-container {
  cursor: pointer;
}

.avatar-clickable:hover .overlay {
  display: flex;
}

.overlay {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
}

.overlay v-icon {
  font-size: 48px;
}
</style>
