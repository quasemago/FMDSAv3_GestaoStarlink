<template>
  <VCard>
    <VCardItem>
      <VCardTitle>Sessões Recentes</VCardTitle>
      <div class="recent-session mt-10 px-3">
        <div v-for="list in recentSessions" :key="list.title">
          <VRow class="d-flex mb-4">
            <VCol cols="4" lg="3" md="auto" sm="auto" class="px-0 pt-0 pb-1 d-flex align-start">
              <h6 class="text-body-1 textSecondary text-no-wrap">{{ formatDate(list.date) }}</h6>
            </VCol>
            <VCol cols="1" sm="1" class="px-0 text-center pt-0 pb-1 ml-2">
              <VIcon icon="mdi-circle" size="13" class="text-success"/>
              <div class="line mx-auto bg-grey100"></div>
            </VCol>
            <VCol cols="7" sm="7" class="pt-0">
              <h6 class="text-body-1 textSecondary font-weight-bold">{{ list.name }}</h6>
              <div class="mt-n1">
                <span class="text-body-1 text-decoration-none">{{ list.email }}</span>
              </div>
            </VCol>
          </VRow>
        </div>
      </div>
    </VCardItem>
  </VCard>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {useUserStore} from "@/stores/user";

const userStore = useUserStore();
const recentSessions = ref([]);

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

onMounted(async () => {
    recentSessions.value = await userStore.getAllClientRecentSessions();
  }
)
</script>

<style lang="scss">
.recent-session {
  .line {
    width: 2px;
    height: 35px;
  }
}
</style>
