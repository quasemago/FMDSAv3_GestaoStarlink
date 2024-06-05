<template>
  <v-container> 
    <v-card>
      <v-card-item class="py-0">
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Digite o nome para pesquisar"
          hide-details
          clearable
          single-line
          variant="plain"
          @click:clear="searchClear"
        ></v-text-field>
      </v-card-item>
      <v-data-table
        :headers="headers"
        :items="filteredClients"
        class="elevation-1"
      >
        <template v-slot:item.actions="{ item }">
          <v-btn variant="plain" density="compact" icon="mdi-dots-vertical" @click="openHistoryModal(item.id)"></v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="historyModal" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Selecione o Historico</span>
        </v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item v-for="history in histories" :key="history.name" @click="viewHistory(history.endpoint)">
              <v-list-item-content>{{ history.name }}</v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="modals[history.endpoint]" v-for="history in histories" :key="history.endpoint" width="auto" eager>
      <HistoryModal
        :client-id="selectedClientId"
        :history-type="history.endpoint"
        v-model="modals[history.endpoint]"
      /> 
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from "@/stores/user";
import HistoryModal from '@/components/forms/HistoryModal.vue';

const headers = ref([
  { title: 'Nome', value: 'name' },
  { title: 'Telefone', value: 'tel' },
  { title: 'Endereço', value: 'address' },
  { title: 'Historico', value: 'actions', sortable: false },
]);

const clients = ref([]);
const search = ref('');
const historyModal = ref(false);
const selectedClientId = ref(null);

const histories = ref([
  { name: 'Historico de Navegação', endpoint: 'browsing' },
  { name: 'Historico de Localização', endpoint: 'location' },
  { name: 'Historico de Interesse', endpoint: 'interests' },
  { name: 'Historico de Compras', endpoint: 'purchases' },
  { name: 'Historico de Sessão', endpoint: 'sessions' },
]);

const modals = ref({
  browsing: false,
  location: false,
  interests: false,
  purchases: false,
  sessions: false,
});

onMounted(async () => {
  const userStore = useUserStore();
  clients.value = await userStore.GetAllClientList();
});

const filteredClients = computed(() => {
  return clients.value.filter(client => {
    return client.name.toLowerCase().includes(search.value.toLowerCase());
  });
});

function openHistoryModal(clientId) {
  selectedClientId.value = clientId;
  historyModal.value = true;
}

function viewHistory(historyType) {
  modals.value[historyType] = true;
  historyModal.value = false;
}

function searchClear() {
  search.value = '';
}
</script>

<style scoped>
/* Seus estilos aqui */
</style>
