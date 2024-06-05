<template>
  <v-dialog v-model="modalVisible" max-width="800px">
    <v-card>
      <v-card-title class="d-flex justify-space-between">
        <span>Histórico de{{ getTranslatedHistoryType(historyType) }}</span>
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
import { ref, watch, onMounted } from 'vue';
import { useUserStore } from "@/stores/user";

const props = defineProps({
  clientId: {
    type: String,
    required: true,
  },
  historyType: {
    type: String,
    required: true,
  },
  value: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['input']);
const modalVisible = ref(props.value);
const headers = ref([]);
const historyData = ref([]);
const confirmDelete = ref(false);

const historyTypeTranslations = {
  browsing: 'Navegação',
  location: 'Localização',
  interests: 'Interesse',
  purchases: 'Compras',
  sessions: 'Sessão'
};

const getTranslatedHistoryType = (type) => {
  return historyTypeTranslations[type] || type;
};

watch(() => props.value, (val) => {
  modalVisible.value = val;
});

watch(modalVisible, (val) => {
  emit('input', val);
});

onMounted(async () => {
  switch (props.historyType) {
    case 'browsing':
      headers.value = [
        { title: 'Id', value: 'id', sortable: true },
        { title: 'Url', value: 'url', sortable: true },
      ];
      break;
    case 'location':
      headers.value = [
        { title: 'Id', value: 'id' },
        { title: 'Localização', value: 'geoLocation' },
        { title: 'Endereço_IP', value: 'ipAddress' },
      ];
      break;
    case 'interests':
      headers.value = [
        { title: 'Id', value: 'id' },
        { title: 'Interesse', value: 'keyword' },
      ];
      break;
    case 'purchases':
      headers.value = [
        { title: 'Id', value: 'id' },
        { title: 'Descrição', value: 'description' },
        { title: 'Preço', value: 'price' },
        { title: 'Data', value: 'date' },
      ];
      break;
    case 'sessions':
      headers.value = [
        { title: 'Id', value: 'id' },
        { title: 'Data_login', value: 'loginDate' },
      ];
      break;
  }

  try {
    const response = await fetch(`http://129.159.63.39:8080/v1/history/${props.clientId}/${props.historyType}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${useUserStore().user.accessToken}`,
      },
    });

    const data = await response.json();

    if (Array.isArray(data)) {
      historyData.value = data;
    } else {
      console.error('Os dados recebidos não são um array:', data);
    }
  } catch (error) {
    console.error('Erro ao obter os dados do histórico:', error);
  }
});

function confirmDeleteHistory() {
  confirmDelete.value = true;
}

async function deleteHistory() {
  const userStore = useUserStore();
  try {
    await fetch(`http://129.159.63.39:8080/v1/history/${props.clientId}/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${useUserStore().user.accessToken}`,
      },
      body: JSON.stringify({ historyType: props.historyType }),
    });

    confirmDelete.value = false;
    modalVisible.value = false;
    emit('input', false);
  } catch (error) {
    console.error('Erro ao deletar o histórico:', error);
  }
}
</script>

<style scoped>
/* Seus estilos aqui */
</style>
