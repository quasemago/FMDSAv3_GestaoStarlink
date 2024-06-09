<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<template>
  <v-card class="mx-auto" width="256" variant="flat">
    <v-layout>
      <v-navigation-drawer absolute permanent>
        <v-list>
          <v-list-item :prepend-avatar="userStore.getUserProfilePicture" :subtitle="userStore.user.username"
                       :title="userStore.getUserName"/>
        </v-list>

        <v-divider></v-divider>

        <v-list :lines="false" density="compact" nav>
          <v-list-item v-for="(item, i) in filteredItems" :key="i" :value="item" :to="item.to" color="primary">
            <template v-slot:prepend>
              <v-icon :icon="item.icon"></v-icon>
            </template>
            <v-list-item-title v-text="item.text"></v-list-item-title>
          </v-list-item>
          <v-list-item class="logoutBtn">
            <template v-slot:prepend>
              <v-icon icon="mdi-logout"></v-icon>
            </template>
            <v-list-item-title @click="logout()">Deslogar</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main style="height: 354px;"></v-main>
    </v-layout>
  </v-card>
</template>

<script setup>
import {computed} from 'vue';
import {useUserStore} from '@/stores/user';

const userStore = useUserStore();

const items = [
  {text: 'Dashboard', icon: 'mdi-view-dashboard', to: '/dashboard'},
  {text: 'Editar Perfil', icon: 'mdi-account', to: '/editarperfil', access: 'USER'},
  {text: 'Gestão de Clientes', icon: 'mdi-cog-box', to: '/gestaoclientes', access: 'ADMIN'},
]
const filteredItems = computed(() => {
  return items.filter(item => !item.access || item.access === userStore.user.role);
});

const logout = () => {
  userStore.signOut();
}
</script>

<style scoped>
.logoutBtn {
  cursor: pointer;
}
.logoutBtn:hover {
  background-color: rgba(0, 0, 0, 0.03);
}
</style>
