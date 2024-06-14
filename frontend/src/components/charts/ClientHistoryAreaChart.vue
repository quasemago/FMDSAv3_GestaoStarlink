<template>
  <VueApexCharts type="area" height="350" :options="chartConfig" :series="series"/>
</template>

<script setup>
import VueApexCharts from 'vue3-apexcharts';
import {computed, onMounted, ref, watch} from 'vue';
import {useTheme} from 'vuetify';
import {getAreaChartSplineConfig} from './apexChartConfig';
import {useUserStore} from "@/stores/user";

const userStore = useUserStore();
const vuetifyTheme = useTheme();

const chartConfig = computed(() => getAreaChartSplineConfig(vuetifyTheme.current.value));
const series = ref([]);

const props = defineProps({
  selectedYear: {
    type: Number,
    required: true
  }
});

const selectedYear = ref(props.selectedYear || 2023);

const loadData = async () => {
  const historyData = await userStore.getAllBrowsingHistoryCountByYear(selectedYear.value);
  const purchasesData = await userStore.getAllPurchasesHistoryCountByYear(selectedYear.value);
  const sessionsData = await userStore.getAllSessionsHistoryCountByYear(selectedYear.value);

  const historySeriesData = new Array(12).fill(0);
  const purchasesSeriesData = new Array(12).fill(0);
  const sessionsSeriesData = new Array(12).fill(0);

  historyData.forEach(item => {
    historySeriesData[item.month - 1] = item.count;
  });
  purchasesData.forEach(item => {
    purchasesSeriesData[item.month - 1] = item.count;
  });
  sessionsData.forEach(item => {
    sessionsSeriesData[item.month - 1] = item.count;
  });

  series.value = [{
    name: 'Acessos',
    data: historySeriesData,
  }, {
    name: 'Compras',
    data: purchasesSeriesData,
  }, {
    name: 'Sessões',
    data: sessionsSeriesData,
  }];
};

onMounted(async () => {
  await loadData();
});

watch(props, async () => {
    selectedYear.value = props.selectedYear;
    await loadData();
  }
);
</script>
