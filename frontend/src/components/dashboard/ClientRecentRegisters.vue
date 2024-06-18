<template>
  <VCard>
    <VCardItem>
      <VCardTitle>Registros Recentes</VCardTitle>
      <VDataTable
        :headers="headers"
        :items="items"
        items-per-page="6"
        :loading="loading"
        hover
        hide-default-footer
      >
        <template v-slot:[`item.profilePicture`]="{ item }">
          <v-avatar class="ma-3">
            <VImg :src="String(userStore.formatProfilePicture(item.profilePicture))" v-if="item.profilePicture"/>
            <VImg src="https://i.imgur.com/5apTItQ.png" v-else/>
          </v-avatar>
        </template>
        <template v-slot:[`item.birthDate`]="{ item }">
          <span>{{ formatDate(item.birthDate) }}</span>
        </template>
        <template v-slot:[`item.tel`]="{ item }">
          <span>{{ formatTel(item.tel) }}</span>
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
import {formatDate, formatTel} from "@/utils";
import {useUserStore} from "@/stores/user";

const userStore = useUserStore();
const loading = ref(true);
const items = ref([]);

const headers = reactive([
  {title: 'Foto', value: 'profilePicture'},
  {title: 'Nome', value: 'name', sortable: true},
  {title: 'Email', value: 'Account.email', sortable: true},
  {title: 'Telefone', value: 'tel', sortable: true},
  {title: 'Endereço', value: 'address', sortable: true},
  {title: 'Data de Nascimento', value: 'birthDate', sortable: true},
  {title: 'Gênero', value: 'gender', sortable: true}
]);

onMounted(async () => {
  items.value = await userStore.getAllClientList("sort=createdAt&order=desc&limit=6");
  loading.value = false;
});
</script>
