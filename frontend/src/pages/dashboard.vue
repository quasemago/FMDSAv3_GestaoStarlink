<template>
  <h2>Dashboard</h2>
  <v-container>
    <VRow id="apex-chart-wrapper">
      <VCol cols="12">
        <VCard>
          <VCardItem class="d-flex flex-wrap justify-space-between gap-4">
            <VCardTitle>Relatório</VCardTitle>
            <VCardSubtitle>Histórico dos Clientes</VCardSubtitle>

            <template #append>
              <div class="date-picker-wrapper">
                <VSelect
                  v-model="selectedYear"
                  :items="years"
                  label="Filtro: Ano"
                  dense
                  outlined
                  hide-details
                />
              </div>
            </template>
          </VCardItem>
          <VCardText>
            <ClientHistoryAreaChart :selected-year="selectedYear" />
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12" lg="4">
        <ClientRecentSessions />
      </VCol>
      <VCol cols="12" lg="8">
        <ClientRecentRegisters />
      </VCol>
    </VRow>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import ClientHistoryAreaChart from "@/components/charts/ClientHistoryAreaChart.vue";
import ClientRecentSessions from "@/components/dashboard/ClientRecentSessions.vue";
import ClientRecentRegisters from "@/components/dashboard/ClientRecentRegisters.vue";

const selectedYear = ref(2023);
const years = Array.from({ length: 1 }, (_, i) => 2023 - i);
</script>

<style lang="scss" scoped>
.date-picker-wrapper {
  inline-size: 10.5rem;
}

#apex-chart-wrapper {
  .v-card-item__append {
    padding-inline-start: 0;
  }
}
</style>
