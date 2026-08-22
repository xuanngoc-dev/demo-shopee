<template>
  <div class="bieu-do-cot-theo-nhom">
    <div v-if="showStackedToggle" class="bieu-do-cot-theo-nhom__toolbar">
      <span class="bieu-do-cot-theo-nhom__toolbar-label">Chồng cột</span>
      <el-switch v-model="stacked" size="small" />
    </div>

    <VueApexCharts
      :key="chartKey"
      type="bar"
      width="100%"
      :height="height"
      :options="chartOptions"
      :series="series"
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
  series: {
    type: Array,
    required: true,
  },
  height: {
    type: [Number, String],
    default: 350,
  },
  yAxisTitle: {
    type: String,
    default: '',
  },
  valueSuffix: {
    type: String,
    default: '',
  },
  colors: {
    type: Array,
    default: () => ['#ee4d2d', '#409eff', '#67c23a', '#e6a23c'],
  },
  columnWidth: {
    type: String,
    default: '75%',
  },
  showStackedToggle: {
    type: Boolean,
    default: true,
  },
})

const stacked = defineModel('stacked', { type: Boolean, default: false })

const isDark = ref(document.documentElement.classList.contains('dark'))
let themeObserver

const chartKey = computed(
  () => `${isDark.value ? 'dark' : 'light'}-${stacked.value ? 'stacked' : 'grouped'}`,
)

const labelColor = computed(() => (isDark.value ? '#e5eaf3' : '#303133'))

function formatValue(val) {
  const safeVal = Math.max(0, Number(val) || 0)
  const formatted = new Intl.NumberFormat('vi-VN').format(safeVal)
  return props.valueSuffix ? `${formatted} ${props.valueSuffix}` : formatted
}

function formatYAxis(val) {
  const safeVal = Math.max(0, Number(val) || 0)
  if (safeVal >= 1_000_000) {
    const compact = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 }).format(
      safeVal / 1_000_000,
    )
    return `${compact} tr`
  }
  if (safeVal >= 1_000) {
    const compact = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(
      safeVal / 1_000,
    )
    return `${compact}k`
  }
  return new Intl.NumberFormat('vi-VN').format(safeVal)
}

function formatPercent(val, digits = 1) {
  const safeVal = Math.max(0, Number(val) || 0)
  return `${new Intl.NumberFormat('vi-VN', { maximumFractionDigits: digits }).format(safeVal)}%`
}

function getSeriesPercent(opts) {
  return Number(opts?.w?.globals?.seriesPercent?.[opts.seriesIndex]?.[opts.dataPointIndex]) || 0
}

function getPointPercent(opts) {
  const fromGlobals = getSeriesPercent(opts)
  if (fromGlobals > 0) return fromGlobals

  const seriesIndex = opts?.seriesIndex
  const dataPointIndex = opts?.dataPointIndex
  const seriesList = opts?.w?.config?.series || []
  const value = Number(seriesList[seriesIndex]?.data?.[dataPointIndex]) || 0
  const total = seriesList.reduce(
    (sum, item) => sum + (Math.max(0, Number(item?.data?.[dataPointIndex]) || 0)),
    0,
  )
  if (total <= 0) return 0
  return (value / total) * 100
}

function formatDataLabel(val, opts) {
  if (!stacked.value) return formatYAxis(val)
  const percent = getPointPercent(opts)
  if (percent < 4) return ''
  return formatPercent(percent)
}

function formatTooltip(val, opts) {
  if (!stacked.value) return formatValue(val)
  return `${formatPercent(getPointPercent(opts))} (${formatValue(val)})`
}

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    stacked: stacked.value,
    stackType: stacked.value ? '100%' : undefined,
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
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: props.columnWidth,
      borderRadius: 5,
      borderRadiusApplication: 'end',
      borderRadiusWhenStacked: 'last',
      dataLabels: {
        position: stacked.value ? 'center' : 'top',
        hideOverflowingLabels: false,
        total: {
          enabled: false,
          offsetY: -4,
          formatter: formatPercent,
          style: {
            fontSize: '11px',
            fontWeight: 700,
            color: labelColor.value,
          },
        },
      },
    },
  },
  dataLabels: {
    enabled: true,
    formatter: formatDataLabel,
    offsetY: stacked.value ? 0 : -18,
    style: {
      fontSize: '11px',
      fontWeight: 600,
      colors: stacked.value ? ['#ffffff'] : [labelColor.value],
    },
  },
  stroke: {
    show: true,
    width: stacked.value ? 1 : 2,
    colors: stacked.value ? [isDark.value ? '#1d1e1f' : '#ffffff'] : ['transparent'],
  },
  xaxis: {
    categories: props.categories,
    labels: {
      style: {
        colors: isDark.value ? '#cfd3dc' : '#303133',
      },
    },
    axisBorder: {
      color: isDark.value ? '#414243' : '#e4e7ed',
    },
    axisTicks: {
      color: isDark.value ? '#414243' : '#e4e7ed',
    },
  },
  yaxis: stacked.value
    ? {
        min: 0,
        max: 100,
        tickAmount: 5,
        forceNiceScale: false,
        title: {
          text: 'Tỷ lệ',
          style: {
            color: isDark.value ? '#cfd3dc' : '#303133',
          },
        },
        labels: {
          formatter: (val) => formatPercent(val, 0),
          style: {
            colors: isDark.value ? '#cfd3dc' : '#303133',
          },
        },
      }
    : {
        min: 0,
        forceNiceScale: true,
        max: (max) => (Number.isFinite(max) && max > 0 ? max * 1.18 : 1),
        title: props.yAxisTitle
          ? {
              text: props.yAxisTitle,
              style: {
                color: isDark.value ? '#cfd3dc' : '#303133',
              },
            }
          : undefined,
        labels: {
          formatter: formatYAxis,
          style: {
            colors: isDark.value ? '#cfd3dc' : '#303133',
          },
        },
      },
  fill: {
    opacity: 1,
  },
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
      top: stacked.value ? 8 : 18,
    },
  },
  tooltip: {
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
.bieu-do-cot-theo-nhom {
  position: relative;
  width: 100%;
  min-height: 0;

  &__toolbar {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__toolbar-label {
    font-size: 12px;
    color: var(--el-text-color-secondary);
    user-select: none;
    white-space: nowrap;
  }

  :deep(.apexcharts-legend) {
    max-width: calc(100% - 118px);
    padding-right: 8px;
  }
}
</style>
