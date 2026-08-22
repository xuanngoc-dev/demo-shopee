<template>
  <div class="bieu-do-cot-va-duong">
    <VueApexCharts
      :key="chartKey"
      type="line"
      width="100%"
      :height="height"
      :options="chartOptions"
      :series="chartSeries"
    />
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

const props = defineProps({
  categories: {
    type: Array,
    required: true,
  },
  columnSeries: {
    type: Object,
    required: true,
  },
  lineSeries: {
    type: Object,
    required: true,
  },
  columnYTitle: {
    type: String,
    default: '',
  },
  lineYTitle: {
    type: String,
    default: '',
  },
  columnSuffix: {
    type: String,
    default: '',
  },
  lineSuffix: {
    type: String,
    default: '%',
  },
  height: {
    type: [Number, String],
    default: 350,
  },
  colors: {
    type: Array,
    default: () => ['#ee4d2d', '#409eff'],
  },
  columnWidth: {
    type: String,
    default: '65%',
  },
})

const isDark = ref(document.documentElement.classList.contains('dark'))
let themeObserver

const chartKey = computed(() => (isDark.value ? 'dark' : 'light'))
const labelColor = computed(() => (isDark.value ? '#cfd3dc' : '#303133'))

const chartSeries = computed(() => [
  {
    name: props.columnSeries.name,
    type: 'column',
    data: props.columnSeries.data,
  },
  {
    name: props.lineSeries.name,
    type: 'line',
    data: props.lineSeries.data,
  },
])

function formatCount(val) {
  const safeVal = Math.max(0, Number(val) || 0)
  const formatted = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(safeVal)
  return props.columnSuffix ? `${formatted} ${props.columnSuffix}` : formatted
}

function formatLine(val) {
  const safeVal = Number(val) || 0
  const formatted = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 }).format(safeVal)
  return props.lineSuffix ? `${formatted}${props.lineSuffix === '%' ? '%' : ` ${props.lineSuffix}`}` : formatted
}

function formatDataLabel(val, opts) {
  return opts.seriesIndex === 1 ? formatLine(val) : formatCount(val)
}

function formatTooltip(val, opts) {
  return opts.seriesIndex === 1 ? formatLine(val) : formatCount(val)
}

const axisTitleStyle = computed(() => ({
  color: labelColor.value,
  fontWeight: 500,
}))

const chartOptions = computed(() => ({
  chart: {
    type: 'line',
    fontFamily:
      "'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif",
    toolbar: { show: false },
    background: 'transparent',
    parentHeightOffset: 0,
    redrawOnParentResize: true,
    redrawOnWindowResize: true,
  },
  theme: {
    mode: isDark.value ? 'dark' : 'light',
  },
  colors: props.colors,
  stroke: {
    width: [0, 3],
    curve: 'smooth',
  },
  plotOptions: {
    bar: {
      columnWidth: props.columnWidth,
      borderRadius: 5,
      borderRadiusApplication: 'end',
      dataLabels: {
        position: 'top',
      },
    },
  },
  dataLabels: {
    enabled: true,
    formatter: formatDataLabel,
    offsetY: -6,
    background: {
      enabled: false,
    },
    style: {
      fontSize: '11px',
      fontWeight: 600,
      colors: [labelColor.value],
    },
  },
  markers: {
    size: 5,
    strokeWidth: 2,
    hover: {
      sizeOffset: 2,
    },
  },
  xaxis: {
    categories: props.categories,
    labels: {
      style: {
        colors: labelColor.value,
      },
    },
    axisBorder: {
      color: isDark.value ? '#414243' : '#e4e7ed',
    },
    axisTicks: {
      color: isDark.value ? '#414243' : '#e4e7ed',
    },
  },
  yaxis: [
    {
      seriesName: props.columnSeries.name,
      min: 0,
      forceNiceScale: true,
      title: props.columnYTitle
        ? {
            text: props.columnYTitle,
            style: axisTitleStyle.value,
          }
        : undefined,
      labels: {
        formatter: formatCount,
        style: {
          colors: labelColor.value,
        },
      },
    },
    {
      seriesName: props.lineSeries.name,
      opposite: true,
      min: 0,
      forceNiceScale: true,
      title: props.lineYTitle
        ? {
            text: props.lineYTitle,
            style: axisTitleStyle.value,
          }
        : undefined,
      labels: {
        formatter: formatLine,
        style: {
          colors: labelColor.value,
        },
      },
    },
  ],
  legend: {
    position: 'top',
    horizontalAlign: 'left',
    fontSize: '13px',
    markers: {
      size: 6,
      shape: 'circle',
    },
    labels: {
      colors: isDark.value ? '#e5eaf3' : '#1f1f1f',
    },
  },
  grid: {
    borderColor: isDark.value ? '#414243' : '#ebeef5',
    strokeDashArray: 4,
    padding: {
      top: 16,
    },
  },
  tooltip: {
    shared: true,
    intersect: false,
    theme: isDark.value ? 'dark' : 'light',
    y: {
      formatter: formatTooltip,
    },
  },
}))

onMounted(() => {
  themeObserver = new MutationObserver(() => {
    isDark.value = document.documentElement.classList.contains('dark')
  })
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })
})

onBeforeUnmount(() => {
  themeObserver?.disconnect()
})
</script>

<style scoped lang="scss">
.bieu-do-cot-va-duong {
  width: 100%;
  min-height: 0;
}
</style>
