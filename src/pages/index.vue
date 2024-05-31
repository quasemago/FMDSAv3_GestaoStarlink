<template>
  <v-container>
    <v-row class="d-flex justify-center mt-15">
      <v-card rounded="md" elevation="10" class="login-card" max-width="500px" width="500px">
        <v-card-item class="pa-sm-8">
          <div class="d-flex flex-column align-center justify-center py-4">
            <Logo :height="32"/>
          </div>
          <LoginForm/>
        </v-card-item>
      </v-card>
    </v-row>
  </v-container>
</template>

<script setup>
import Logo from '@/components/Logo.vue';
import LoginForm from '@/components/forms/LoginForm.vue';
</script>

<style lang="scss">
.login-card {
  overflow: visible;

  &::before {
    content: '';
    width: 6rem;
    height: 6rem;
    position: absolute;
    bottom: -2rem;
    left: -2rem;
    z-index: 0;
  }
}
</style>
