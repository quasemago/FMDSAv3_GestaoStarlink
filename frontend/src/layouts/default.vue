<template>
  <v-app>
    <MenuBar />
    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
    <AppFooter />
  </v-app>
</template>

<script setup>
import MenuBar from "@/components/MenuBar.vue";
import AppFooter from "@/components/AppFooter.vue";
</script>
