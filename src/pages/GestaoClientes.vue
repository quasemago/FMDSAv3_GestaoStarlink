<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-item class="py-0">
            <v-toolbar tag="div" color="transparent" flat>
              <v-text-field
                :prepend-icon="!showFilter ? 'mdi-filter-variant-plus' : 'mdi-filter-variant'"
                placeholder="Pesquise por algo"
                hide-details
                clearable
                variant="plain"
                class="search"
                v-model="searchText"
                @keyup.enter="handleApplyFilter"
                @click:prepend="showFilter = !showFilter"
                @click:clear="handleClear"
              />
              <v-btn icon @click="handleApplyFilter" density="comfortable">
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
              <v-btn icon @click="handleRefreshItem" density="comfortable">
                <VIcon>mdi-refresh</VIcon>
              </v-btn>
              <v-btn icon @click="handleCreateItem" density="comfortable">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-toolbar>
          </v-card-item>
          <v-card-text class="pa-0 pb-5">
            <v-divider />
            <v-data-table
              :headers="headers"
              :items="filteredUsers"
              v-model:items-per-page="itemsPerPage"
              :loading="loading"
              @update:options="loadData"
              hover
            >
              <template v-slot:[`item.profilePicture`]="{ item }">
                <v-avatar class="ma-3">
                  <VImg :src="String(item.profilePicture)" v-if="item.profilePicture" />
                  <VImg src="https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png" v-else />
                </v-avatar>
              </template>
              <template v-slot:[`item.birthDate`]="{ item }">
                <span>{{ formatDate(item.birthDate) }}</span>
              </template>
              <template v-slot:[`item.gender`]="{ item }">
                <span>{{ item.gender === 'M' ? 'Masculino' : 'Feminino' }}</span>
              </template>
              <template v-slot:[`item.action`]="{ item }">
                <v-btn variant="plain" density="compact" icon="mdi-pencil-outline" @click="handleEditItem(item)"></v-btn>
                <v-btn variant="plain" density="compact" icon="mdi-trash-can-outline" @click="handleDeleteItem(item)"></v-btn>
                <v-btn variant="plain" density="compact" icon="mdi-history" @click="openHistoryModal(item.id)"></v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialogs for Edit, Add and Delete -->
    <v-dialog v-model="showEditDialog" width="auto" eager>
      <EditClientForm :user="selectedUser" @form:cancel="showEditDialog = false" @form:saved="handleItemEdited" />
    </v-dialog>
    <v-dialog v-model="showAddDialog" width="auto" eager>
      <AddClientForm :show-dialog="showAddDialog" @form:cancel="showAddDialog = false" @form:saved="handleItemSaved" />
    </v-dialog>
    <v-dialog v-model="showDeleteDialog" width="auto" eager>
      <v-card>
        <v-card-title class="headline">Confirmar Exclusão</v-card-title>
        <v-card-text>
          Tem certeza de que deseja excluir este cliente?
        </v-card-text>
        <v-card-actions>
          <v-btn color="error" text @click="handleDeleteItemConfirm">Confirmar</v-btn>
          <v-btn text @click="showDeleteDialog = false">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog for Selecting History Type -->
    <v-dialog v-model="historyModal" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Selecione o Histórico</span>
        </v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item v-for="history in histories" :key="history.endpoint" @click="viewHistory(history.endpoint)">
              <v-list-item-title v-text="history.name"></v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- History Modals -->
    <HistoryModal
      v-for="history in histories"
      :key="history.endpoint"
      :client-id="selectedClientId ? selectedClientId.toString() : ''"
      :history-type="history.endpoint"
      v-model:visible="modals[history.endpoint]"
    />
  </v-container>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useUserStore } from "@/stores/user";
import EditClientForm from '@/components/forms/EditClientForm.vue';
import AddClientForm from '@/components/forms/AddClientForm.vue';
import HistoryModal from '@/components/forms/HistoryModal.vue';

const userStore = useUserStore();
const itemsPerPage = ref(10);
const showFilter = ref(true);
const showAddDialog = ref(false);
const showEditDialog = ref(false);
const showDeleteDialog = ref(false);
const historyModal = ref(false);
const searchText = ref('');
const originalUsers = ref([]);
const filteredUsers = ref([]);

const selectedUser = reactive({
  id: null,
  account: {
    email: '',
    role: '',
  },
  name: '',
  tel: '',
  address: '',
  birthDate: '',
  gender: '',
  profilePicture: null
});

const selectedUserIdToDelete = ref(null);
const selectedClientId = ref(null);

const histories = ref([
  { name: 'Histórico de Navegação', endpoint: 'browsing' },
  { name: 'Histórico de Localização', endpoint: 'location' },
  { name: 'Histórico de Interesse', endpoint: 'interests' },
  { name: 'Histórico de Compras', endpoint: 'purchases' },
  { name: 'Histórico de Sessão', endpoint: 'sessions' },
]);

const modals = ref({
  browsing: false,
  location: false,
  interests: false,
  purchases: false,
  sessions: false,
});

const loading = ref(true);

const headers = reactive([
  { title: 'Foto', value: 'profilePicture' },
  { title: 'Nome', value: 'name', sortable: true },
  { title: 'Email', value: 'account.email', sortable: true },
  { title: 'Telefone', value: 'tel', sortable: true },
  { title: 'Endereço', value: 'address', sortable: true },
  { title: 'Data de Nascimento', value: 'birthDate', sortable: true },
  { title: 'Gênero', value: 'gender', sortable: true },
  { title: 'Ações', value: 'action' },
]);

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
};

const loadData = async () => {
  loading.value = true;
  await userStore.GetAllClientList()
    .then((response) => {
      originalUsers.value = response;
      filteredUsers.value = response;
    })
  loading.value = false;
};

const handleApplyFilter = () => {
  filteredUsers.value = originalUsers.value;
  if (searchText.value) {
    filteredUsers.value = originalUsers.value.filter((user) => {
      return user.name.toLowerCase().includes(searchText.value.toLowerCase());
    });
  }
};

const handleRefreshItem = async () => {
  searchText.value = '';
  await loadData();
};

const handleCreateItem = () => {
  showAddDialog.value = true;
};

const handleItemSaved = async () => {
  await loadData();
  showAddDialog.value = false;
};

const handleEditItem = (row) => {
  Object.assign(selectedUser, row);
  showEditDialog.value = true;
};

const handleItemEdited = async () => {
  await loadData();
  showEditDialog.value = false;
};

const handleDeleteItem = (row) => {
  showDeleteDialog.value = true;
  selectedUserIdToDelete.value = row.id;
  console.log(selectedUserIdToDelete.value);
};

const handleDeleteItemConfirm = async () => {
  try {
    await userStore.deleteClient(selectedUserIdToDelete.value);
    await loadData();
    console.log("deletado");
  } catch (error) {
    console.log(error);
  }
  showDeleteDialog.value = false;
  selectedUserIdToDelete.value = null;
};

const handleClear = () => {};

const openHistoryModal = (clientId) => {
  selectedClientId.value = clientId;
  historyModal.value = true;
};

const viewHistory = (historyType) => {
  modals.value[historyType] = true;
  historyModal.value = false;
};
</script>

<style lang="scss">
.search {
  input {
    padding-top: 10px;
  }
}
</style>
