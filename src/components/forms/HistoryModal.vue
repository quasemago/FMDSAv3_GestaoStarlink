<template>
  <v-snackbar v-model="successDeleteMessage" color="success" timeout="3000" location="top">
    <v-icon icon="mdi-check-circle"></v-icon>
    Histórico de {{ getTranslatedHistoryType(historyType) }} excluído com sucesso!
  </v-snackbar>
  <v-dialog v-model="modalVisible" max-width="800px">
    <v-card>
      <v-card-title class="d-flex justify-space-between">
        <span>Histórico de {{ getTranslatedHistoryType(historyType) }}</span>
        <v-btn icon @click="confirmDeleteHistory">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-data-table :headers="headers" :items="historyData" class="elevation-1">
          <template v-slot:[`item.date`]="{ item }">
            {{ formatDate(item.date) }}
          </template>
        </v-data-table>
      </v-card-text>
      <v-dialog v-model="confirmDelete" max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">Apagar Histórico</span>
          </v-card-title>
          <v-card-text>Tem certeza de que deseja deletar o Histórico?</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="tonal" color="#FF0000" text @click="deleteHistory">Sim</v-btn>
            <v-btn variant="tonal" color="#d3d3d3" text @click="confirmDelete = false">Cancelar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </v-dialog>
</template>

<script setup>
import {onMounted, ref, watch} from 'vue';
import {useUserStore} from "@/stores/user";

const userStore = useUserStore();
const props = defineProps({
  clientId: {
    type: String,
    required: true,
  },
  historyType: {
    type: String,
    required: true,
  },
  visible: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['update:visible']);
const modalVisible = ref(props.visible);
const headers = ref([]);
const historyData = ref([]);
const confirmDelete = ref(false);
const successDeleteMessage = ref(false);

const historyTypeTranslations = {
  browsing: 'Navegação',
  location: 'Localização',
  interests: 'Interesse',
  purchases: 'Compras',
  sessions: 'Sessão',
};

const getTranslatedHistoryType = (type) => {
  return historyTypeTranslations[type] || type;
};

watch(() => props.visible, (val) => {
  modalVisible.value = val;
});

watch(modalVisible, (val) => {
  emit('update:visible', val);
});

watch([() => props.clientId, () => props.historyType], async ([newClientId, newHistoryType]) => {
  await fetchHistoryData(newClientId, newHistoryType);
});

onMounted(async () => {
  await fetchHistoryData(props.clientId, props.historyType);
});

async function fetchHistoryData(clientId, historyType) {
  if (!clientId || clientId === '') {
    return;
  }
  switch (historyType) {
    case 'browsing':
      headers.value = [
        {title: 'Url', value: 'url', sortable: true},
        {title: 'Data', value: 'date', sortable: true},
      ];
      break;
    case 'location':
      headers.value = [
        {title: 'Localização', value: 'geoLocation', sortable: true},
        {title: 'Endereço IP', value: 'ipAddress', sortable: true},
        {title: 'Data', value: 'date', sortable: true},
      ];
      break;
    case 'interests':
      headers.value = [
        {title: 'Palavra-chave', value: 'keyword', sortable: true},
        {title: 'Data', value: 'date', sortable: true},
      ];
      break;
    case 'purchases':
      headers.value = [
        {title: 'Descrição', value: 'description'},
        {title: 'Preço', value: 'price', sortable: true},
        {title: 'Data', value: 'date', sortable: true},
      ];
      break;
    case 'sessions':
      headers.value = [
        {title: 'Data', value: 'date', sortable: true},
      ];
      break;
  }

  try {
    let data = await userStore.getAllClientHistoryType(clientId, historyType);
    historyData.value = data;
  } catch (error) {
    console.error('Erro ao obter os dados do histórico:', error);
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function confirmDeleteHistory() {
  confirmDelete.value = true;
}

async function deleteHistory() {
  if (!props.clientId || props.clientId === '') {
    return;
  }
  try {
    await userStore.deleteClientHistoryType(props.clientId, props.historyType);
    await fetchHistoryData(props.clientId, props.historyType);

    successDeleteMessage.value = true;
    confirmDelete.value = false;
    modalVisible.value = false;
    emit('update:visible', false);
  } catch (error) {
    console.error('Erro ao deletar o histórico:', error);
  }
}
</script>
