<template>
  <v-dialog v-model="modalVisible" max-width="800px">
    <v-card>
      <v-card-title>
        {{ historyType.charAt(0).toUpperCase() + historyType.slice(1) }} History
        <v-spacer></v-spacer>
        <v-btn icon @click="confirmDeleteHistory">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <!-- Tabela de dados para exibir o histórico -->
        <v-data-table :headers="headers" :items="historyData" class="elevation-1">
        </v-data-table>
      </v-card-text>
      <!-- Modal de confirmação para deletar o histórico -->
      <v-dialog v-model="confirmDelete" max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">Apagar Historico</span>
          </v-card-title>
          <v-card-text>Tem certeza de que deseja deletar o Historico?</v-card-text>
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

<script>
import { useUserStore } from "@/stores/user";
const url = "http://129.159.63.39:8080/v1";

export default {
  props: {
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
  },
  data() {
    return {
      modalVisible: this.value, // Controla a visibilidade do modal
      headers: [], // Cabeçalhos da tabela
      historyData: [], // Dados do histórico
      confirmDelete: false, // Controla a visibilidade do modal de confirmação de exclusão
    };
  },
  watch: {
    value(val) {
      this.modalVisible = val;
    },
    modalVisible(val) {
      this.$emit('input', val); // Emite um evento para atualizar o valor do modal
    },
  },
  async created() {
    // Define os cabeçalhos da tabela com base no tipo de histórico
    switch (this.historyType) {
      case 'browsing':
        this.headers = [
          { title: 'Id', value: 'id', sortable: true },
          { title: 'Url', value: 'url', sortable: true },
        ];
        break;
      case 'location':
        this.headers = [
          { title: 'Id', value: 'id' },
          { title: 'Localização', value: 'geoLocation' },
          { title: 'Endereço_IP', value: 'ipAddress' },
        ];
        break;
      case 'interests':
        this.headers = [
          { title: 'Id', value: 'id' },
          { title: 'Interesse', value: 'keyword' },
        ];
        break;
      case 'purchases':
        this.headers = [
          { title: 'Id', value: 'id' },
          { title: 'Descrição', value: 'description' },
          { title: 'Preço', value: 'price' },
          { title: 'Data', value: 'date' },
        ];
        break;
      case 'sessions':
        this.headers = [
          { title: 'Id', value: 'id' },
          { title: 'Data_login', value: 'loginDate' },
        ];
        break;
    }

    // Faz uma solicitação GET para obter os dados do histórico
    try {
      const response = await fetch(`${url}/history/${this.clientId}/${this.historyType}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${useUserStore().user.accessToken}`,
        },
      });

      const data = await response.json();

      // Verifica se os dados recebidos são um array
      if (Array.isArray(data)) {
        this.historyData = data;
      } else {
        console.error('Os dados recebidos não são um array:', data);
      }
    } catch (error) {
      console.error('Erro ao obter os dados do histórico:', error);
    }
  },
  methods: {
    confirmDeleteHistory() {
      // Abre o modal de confirmação de exclusão
      this.confirmDelete = true;
    },
    async deleteHistory() {
      const userStore = useUserStore();
      try {
        await fetch(`${url}/history/${this.clientId}/delete`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userStore.user.accessToken}`,
          },
          body: JSON.stringify({ historyType: this.historyType }),
        });

        this.confirmDelete = false;
        this.modalVisible = false; // Fecha o modal
        this.$emit('input', false); // Emite um evento para atualizar o valor do modal
      } catch (error) {
        console.error('Erro ao deletar o histórico:', error);
      }
    },
  },
};
</script>

<style scoped>
/* Seus estilos aqui */
</style>
