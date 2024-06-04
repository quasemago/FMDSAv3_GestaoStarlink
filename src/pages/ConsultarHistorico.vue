<template>
  <v-container> 
    <v-card>
      <v-card-item class="py-0">
        <!-- Campo de texto para buscar clientes pelo nome -->
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
      <!-- Tabela de dados para exibir os clientes -->
      <v-data-table
        :headers="headers"
        :items="filteredClients"
        class="elevation-1"
      >
        <!-- Slot para adicionar um botão de ações (três pontinhos) em cada linha da tabela -->
        <template v-slot:item.actions="{ item }">
          <v-btn variant="plain" density="compact" icon="mdi-dots-vertical" @click="openHistoryModal(item.id)"></v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Modal para selecionar o tipo de histórico -->
    <v-dialog v-model="historyModal" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Selecione o Historico</span>
        </v-card-title>
        <v-card-text>
          <v-list>
            <!-- Lista de tipos de históricos -->
            <v-list-item v-for="history in histories" :key="history.name" @click="viewHistory(history.endpoint)">
              <v-list-item-content>{{ history.name }}</v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Componentes modais para cada tipo de histórico -->
    <v-dialog v-model="modals[history.endpoint]" v-for="history in histories" :key="history.endpoint" width="auto" eager>
      <HistoryModal
        :client-id="selectedClientId"
        :history-type="history.endpoint"
        v-model="modals[history.endpoint]"
      /> 
    </v-dialog>
  </v-container>
</template>

<script>
import { useUserStore } from "@/stores/user";
import HistoryModal from '@/components/forms/HistoryModal.vue';

export default {
  components: {
    HistoryModal,
  },
  data() {
    return {
      headers: [
        { title: 'Nome', value: 'name' },           // Cabeçalho da coluna Nome
        { title: 'Telefone', value: 'tel' },        // Cabeçalho da coluna Telefone
        { title: 'Endereço', value: 'address' },    // Cabeçalho da coluna Endereço
        { title: 'Historico', value: 'actions', sortable: false },  // Cabeçalho da coluna Ações
      ],
      clients: [],                                  // Lista de clientes
      search: '',                                   // Termo de busca
      historyModal: false,                          // Estado do modal de seleção de histórico
      selectedClientId: null,                       // ID do cliente selecionado
      histories: [                                  // Tipos de históricos disponíveis
        { name: 'Historico de Navegação', endpoint: 'browsing' },
        { name: 'Historico de Localização', endpoint: 'location' },
        { name: 'Historico de Interesse', endpoint: 'interests' },
        { name: 'Historico de Compras', endpoint: 'purchases' },
        { name: 'Historico de Sessão', endpoint: 'sessions' },
      ],
      modals: {
        browsing: false,
        location: false,
        interests: false,
        purchases: true,
        sessions: false,
      },
    };
  },
  async created() {
    const userStore = useUserStore();
    this.clients = await userStore.GetAllClientList(); // Obtém a lista de todos os clientes
  },
  computed: {
    filteredClients() {
      // Filtra os clientes com base no termo de busca
      return this.clients.filter(client => {
        return client.name.toLowerCase().includes(this.search.toLowerCase());
      });
    },
  },
  methods: {
    openHistoryModal(clientId) {
      // Abre o modal de seleção de histórico para o cliente selecionado
      this.selectedClientId = clientId;
      this.historyModal = true;
    },
    viewHistory(historyType) {
      // Abre o modal do tipo de histórico clicado
      this.$set(this.modals, historyType, true);
      this.historyModal = false;
    },
    // Função para lidar com o clique no ícone de limpar o campo de busca
    searchClear() {
      // Limpa o termo de busca
      this.search = '';
    },
  },
};
</script>

<style scoped>
/* Seus estilos aqui */
</style>
