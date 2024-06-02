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
              show-select
            >
              <template #item.profilePicture="{ item }">
                <v-avatar :color="item.profilePicture ? '' : 'surface-variant'" class="ma-3">
                  <VImg :src="String(item.profilePicture)" v-if="item.profilePicture"/>
                  <span v-else>{{ computeAvatarText(item.username) }}</span>
                </v-avatar>
              </template>
              <template #item.action="{ item }">
                <v-btn variant="plain" density="compact" icon="mdi-pencil-outline" @click="handleEditItem(item)"></v-btn>
                <v-btn variant="plain" density="compact" icon="mdi-trash-can-outline"></v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="showEditDialog" width="auto" eager>
      <EditClientForm :user="selectedUser" @form:cancel="showEditDialog = false" />
    </v-dialog>
    <v-dialog v-model="showAddDialog" width="auto" eager>
      <AddClientForm :show-dialog="showAddDialog" @form:cancel="showAddDialog = false" />
    </v-dialog>
  </v-container>
</template>

<script setup>
import {reactive, ref} from 'vue';
import {useUserStore} from "@/stores/user";
import EditClientForm from '@/components/forms/EditClientForm.vue';
import AddClientForm from '@/components/forms/AddClientForm.vue';

const userStore = useUserStore();
const itemsPerPage = ref(10);
const showFilter = ref(true);
const showAddDialog = ref(false);
const showEditDialog = ref(false);
const searchText = ref('');
const originalUsers = ref([]);
const filteredUsers = ref([]);

const selectedUser = reactive({
  id: null,
  name: '',
  tel: '',
  address: '',
  birthDate: '',
  gender: '',
  profilePicture: null
});

// search filters
const headers = reactive([
  {title: 'Foto', value: 'profilePicture'},
  {title: 'Nome', value: 'name', sortable: true},
  {title: 'Telefone', value: 'tel', sortable: true},
  {title: 'Endereço', value: 'address', sortable: true},
  {title: 'Data de Nascimento', value: 'birthDate', sortable: true},
  {title: 'Gênero', value: 'gender', sortable: true},
  {title: 'Ações', value: 'action'},
]);

const loading = ref(true);
const computeAvatarText = (value) => {
  if (!value) return '';
  const nameArray = value.split(' ');
  return nameArray.map((word) => word.charAt(0).toUpperCase()).join('');
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
    console.log("chegou aqui")
    filteredUsers.value = originalUsers.value.filter((user) => {
      return user.name.toLowerCase().includes(searchText.value.toLowerCase());
    });
  }
};
const handleRefreshItem = () => {
  searchText.value = '';
  loadData();
};
const handleCreateItem = () => {
  showAddDialog.value = true;
};
const handleEditItem = (row) => {
  Object.assign(selectedUser, row);
  showEditDialog.value = true;
};

const handleDeleteItem = () => {
  // showDialog.value = true;
  console.log('delete');
};
const handleClear = () => {

};
const handleResetFilter = () => {
  loadData();
};
</script>


<style lang="scss">
.search {
  input {
    padding-top: 10px;
  }
}
</style>
