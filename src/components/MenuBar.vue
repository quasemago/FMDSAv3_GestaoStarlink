<template>
  <div v-if="!!userStore.isAuthenticated">
    <v-navigation-drawer v-model="drawer">
      <MenuList/>
    </v-navigation-drawer>
    <v-app-bar color="primary">
      <v-app-bar-nav-icon @click="drawer = !drawer"/>
      <v-app-bar-title>Gestão Starlink</v-app-bar-title>
      <div class="mr-4">
        <v-btn class="bg-blue-lighten-2" @click="userStore.signOut">Logout</v-btn>
      </div>
    </v-app-bar>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {useUserStore} from '@/stores/user'
import MenuList from "@/components/MenuList.vue";

const drawer = ref(true);
const userStore = useUserStore();
</script>
