<template>
  <VCard>
    <VCardItem>
      <VCardTitle>Registros Recentes</VCardTitle>
      <VDataTable
        :headers="headers"
        :items="items"
        items-per-page="5"
        :loading="loading"
        hover
        hide-default-footer
      >
        <template v-slot:[`item.profilePicture`]="{ item }">
          <v-avatar class="ma-3">
            <VImg :src="String(userStore.formatProfilePicture(item.profilePicture))" v-if="item.profilePicture"/>
            <VImg src="https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png" v-else/>
          </v-avatar>
        </template>
        <template v-slot:[`item.birthDate`]="{ item }">
          <span>{{ formatDate(item.birthDate) }}</span>
        </template>
        <template v-slot:[`item.gender`]="{ item }">
          <span>{{ item.gender === 'M' ? 'Masculino' : 'Feminino' }}</span>
        </template>
      </VDataTable>
    </VCardItem>
  </VCard>
</template>

<script setup>
import {onMounted, reactive, ref} from 'vue';
import {useUserStore} from "@/stores/user";

const userStore = useUserStore();
const loading = ref(true);
const items = ref([]);

const headers = reactive([
  {title: 'Foto', value: 'profilePicture'},
  {title: 'Nome', value: 'name', sortable: true},
  {title: 'Email', value: 'account.email', sortable: true},
  {title: 'Telefone', value: 'tel', sortable: true},
  {title: 'Endereço', value: 'address', sortable: true},
  {title: 'Data de Nascimento', value: 'birthDate', sortable: true},
  {title: 'Gênero', value: 'gender', sortable: true}
]);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

onMounted(async () => {
  items.value = await userStore.getAllClientList("size=5&sort=createdAt,desc");
  loading.value = false;
});
</script>
