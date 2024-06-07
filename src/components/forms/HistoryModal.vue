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
        {title: 'Id', value: 'id', sortable: true},
        {title: 'Url', value: 'url', sortable: true},
      ];
      break;
    case 'location':
      headers.value = [
        {title: 'Id', value: 'id'},
        {title: 'Localização', value: 'geoLocation'},
        {title: 'Endereço IP', value: 'ipAddress'},
      ];
      break;
    case 'interests':
      headers.value = [
        {title: 'Id', value: 'id'},
        {title: 'Interesse', value: 'keyword'},
      ];
      break;
    case 'purchases':
      headers.value = [
        {title: 'Id', value: 'id'},
        {title: 'Descrição', value: 'description'},
        {title: 'Preço', value: 'price'},
        {title: 'Data', value: 'date'},
      ];
      break;
    case 'sessions':
      headers.value = [
        {title: 'Id', value: 'id'},
        {title: 'Data do Login', value: 'loginDate'},
      ];
      break;
  }

  try {
    historyData.value = await userStore.getAllClientHistoryType(clientId, historyType);
  } catch (error) {
    console.error('Erro ao obter os dados do histórico:', error);
  }
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
