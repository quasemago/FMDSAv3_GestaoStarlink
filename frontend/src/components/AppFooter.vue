<template>
  <v-footer app color="grey">
    <a v-for="item in items" :key="item.title" :href="item.href" :title="item.title"
      class="d-inline-block mx-2 social-link" rel="noopener noreferrer" target="_blank">
      <v-icon :icon="item.icon" :size="item.icon === '$vuetify' ? 24 : 16" />
    </a>

    <div class="text-caption text-disabled" style="position: absolute; right: 16px;">
      &copy; 2024 — Desenvolvido para 3º avaliação da disciplina de FMDS |
      <a class="text-decoration-none on-surface footer-link" href="https://unemat.br" rel="noopener noreferrer" target="_blank">
        UNEMAT
      </a>
    </div>
  </v-footer>
</template>

<script setup>
const items = [
  {
    title: 'GitHub',
    icon: `mdi-github`,
    href: 'https://github.com/quasemago',
  }
]
</script>

<style scoped lang="sass">
  .footer-link
    font-weight: bold !important

  a:hover
    color: rgba(25, 118, 210, 1) !important

  .social-link :deep(.v-icon)
    color: rgba(var(--v-theme-on-background), var(--v-disabled-opacity))
    text-decoration: none
    transition: .2s ease-in-out

    &:hover
      color: rgba(25, 118, 210, 1)
</style>
