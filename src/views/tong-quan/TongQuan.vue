<template>
  <div class="dashboard">
    <section class="period-bar">
      <CustomDatePicker
        v-model="dateRange"
        type="daterange"
        unlink-panels
        range-separator="–"
        start-placeholder="Từ ngày"
        end-placeholder="Đến ngày"
        format="DD/MM/YYYY"
        :disabled-date="isFutureDate"
        :clearable="false"
        class="period-bar__picker"
        @change="onCustomRangeChange"
      />

      <CustomRadioGroup
        v-model="periodPreset"
        class="period-bar__presets"
        @change="applyPreset"
      >
        <CustomRadioButton
          v-for="item in periodOptions"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </CustomRadioButton>
      </CustomRadioGroup>
    </section>

    <section
      v-for="group in statGroups"
      :key="group.title"
      class="stat-group"
    >
      <h3 class="stat-group__title">{{ group.title }}</h3>
      <div
        class="stat-group__grid"
        :class="`stat-group__grid--${group.key}`"
      >
        <CustomCard
          v-for="card in group.cards"
          :key="card.label"
          shadow="hover"
          class="stat-card"
        >
          <div class="stat-card__icon" :style="{ background: card.bg, color: card.color }">
            <CustomIcon :size="20">
              <component :is="card.icon" />
            </CustomIcon>
          </div>
          <div class="stat-card__content">
            <span class="stat-card__label">{{ card.label }}</span>
            <strong>{{ card.value }}</strong>
            <span v-if="card.subValue" class="stat-card__sub">{{ card.subValue }}</span>
          </div>
        </CustomCard>
      </div>
    </section>

    <CustomRow :gutter="16" class="charts-row">
      <CustomCol
        v-for="chart in overviewCharts"
        :key="chart.title"
        :xs="24"
        :sm="12"
        :lg="8"
      >
        <CustomCard shadow="never" class="chart-card">
          <template #header>
            <div class="chart-card__header">
              <span>{{ chart.title }}</span>
              <span class="chart-card__hint">{{ chart.hint }}</span>
            </div>
          </template>
          <BieuDoCotTheoNhom
            :categories="chart.categories"
            :series="chart.series"
            :y-axis-title="chart.yAxisTitle"
            :value-suffix="chart.valueSuffix"
            :height="280"
          />
        </CustomCard>
      </CustomCol>

      <CustomCol :xs="24" :sm="12" :lg="8">
        <CustomCard shadow="never" class="chart-card">
          <template #header>
            <div class="chart-card__header">
              <span>Hiệu quả khuyến mại theo mức giảm giá</span>
            </div>
          </template>
          <BieuDoCotVaDuong
            :categories="promoEffectiveness.categories"
            :column-series="promoEffectiveness.columnSeries"
            :line-series="promoEffectiveness.lineSeries"
            column-y-title="Số đơn"
            line-y-title="Biên lợi nhuận"
            line-suffix="%"
            :height="280"
          />
        </CustomCard>
      </CustomCol>
    </CustomRow>

    <CustomCard shadow="never" class="orders-card">
      <template #header>
        <div class="orders-card__header">
          <span>Đơn hàng gần đây</span>
          <CustomButton text type="primary" @click="$router.push({ name: 'don-hang' })">
            Xem tất cả
          </CustomButton>
        </div>
      </template>

      <CustomTable :data="orders" stripe>
        <CustomTableColumn prop="id" label="Mã đơn" width="140" />
        <CustomTableColumn prop="customer" label="Khách hàng" min-width="200" />
        <CustomTableColumn prop="total" label="Tổng tiền" width="140" />
        <CustomTableColumn prop="status" label="Trạng thái" width="160">
          <template #default="{ row }">
            <CustomTag :type="row.tag" size="small">{{ row.status }}</CustomTag>
          </template>
        </CustomTableColumn>
      </CustomTable>
    </CustomCard>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Wallet, Money, TrendCharts, PieChart, Goods, CircleCheck, Clock, Van, CircleClose } from '@element-plus/icons-vue'
import {
  CustomButton,
  CustomCard,
  CustomCol,
  CustomDatePicker,
  CustomIcon,
  CustomRadioButton,
  CustomRadioGroup,
  CustomRow,
  CustomTable,
  CustomTableColumn,
  CustomTag,
} from '@/components/element'
import BieuDoCotTheoNhom from '@/components/charts/BieuDoCotTheoNhom.vue'
import BieuDoCotVaDuong from '@/components/charts/BieuDoCotVaDuong.vue'

const periodOptions = [
  { value: 'today', label: 'Hôm nay' },
  { value: 'yesterday', label: 'Hôm qua' },
  { value: 'week', label: 'Tuần này' },
  { value: 'month', label: 'Tháng này' },
  { value: 'quarter', label: 'Quý này' },
  { value: 'year', label: 'Năm nay' },
]

function startOfDay(date) {
  const next = new Date(date)
  next.setHours(0, 0, 0, 0)
  return next
}

function endOfDay(date) {
  const next = new Date(date)
  next.setHours(23, 59, 59, 999)
  return next
}

function toDayKey(date) {
  const d = new Date(date)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function rangeForPreset(key) {
  const now = new Date()
  const today = startOfDay(now)

  if (key === 'today') return [today, endOfDay(now)]

  if (key === 'yesterday') {
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    return [yesterday, endOfDay(yesterday)]
  }

  if (key === 'week') {
    const weekday = today.getDay()
    const mondayOffset = weekday === 0 ? 6 : weekday - 1
    const start = new Date(today)
    start.setDate(start.getDate() - mondayOffset)
    return [start, endOfDay(now)]
  }

  if (key === 'month') {
    return [new Date(today.getFullYear(), today.getMonth(), 1), endOfDay(now)]
  }

  if (key === 'quarter') {
    const quarterStartMonth = Math.floor(today.getMonth() / 3) * 3
    return [new Date(today.getFullYear(), quarterStartMonth, 1), endOfDay(now)]
  }

  return [new Date(today.getFullYear(), 0, 1), endOfDay(now)]
}

function rangesEqual(left, right) {
  if (!left?.length || !right?.length) return false
  return toDayKey(left[0]) === toDayKey(right[0]) && toDayKey(left[1]) === toDayKey(right[1])
}

function isFutureDate(date) {
  return startOfDay(date).getTime() > startOfDay(new Date()).getTime()
}

function applyPreset(key) {
  dateRange.value = rangeForPreset(key)
}

function onCustomRangeChange(val) {
  if (!val?.length) {
    periodPreset.value = 'today'
    applyPreset('today')
    return
  }
  const matched = periodOptions.find((item) => rangesEqual(val, rangeForPreset(item.value)))
  periodPreset.value = matched?.value ?? ''
}

const periodPreset = ref('today')
const dateRange = ref(rangeForPreset('today'))

const statGroups = [
  {
    key: 'overview',
    title: 'Tổng quan',
    cards: [
      { label: 'Tổng doanh thu', value: '48.6tr', icon: Wallet, color: '#ee4d2d', bg: '#fef2ef' },
      { label: 'Lợi nhuận sau phí', value: '12.8tr', icon: Money, color: '#67c23a', bg: '#f0f9eb' },
      { label: 'Lợi nhuận dòng', value: '9.4tr', icon: TrendCharts, color: '#409eff', bg: '#ecf5ff' },
      { label: 'Biên lợi nhuận', value: '26,3%', icon: PieChart, color: '#e6a23c', bg: '#fdf6ec' },
      { label: 'Giá trị đơn hàng TB', value: '186.000đ', icon: Goods, color: '#9b59b6', bg: '#f5eef8' },
    ],
  },
  {
    key: 'reconciliation',
    title: 'Đối soát',
    cards: [
      { label: 'Đã đối soát', value: '32.1tr', subValue: '142 đơn', icon: CircleCheck, color: '#67c23a', bg: '#f0f9eb' },
      { label: 'Đang chờ đối soát', value: '8.4tr', subValue: '36 đơn', icon: Clock, color: '#e6a23c', bg: '#fdf6ec' },
      { label: 'Đang giao', value: '6.2tr', subValue: '28 đơn', icon: Van, color: '#409eff', bg: '#ecf5ff' },
      { label: 'Đã huỷ', value: '1.1tr', subValue: '9 đơn', icon: CircleClose, color: '#f56c6c', bg: '#fef0f0' },
    ],
  },
]

function lastThreeMonthLabels() {
  const now = new Date()
  return Array.from({ length: 3 }, (_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (2 - i), 1)
    return `${date.getMonth() + 1}/${date.getFullYear()}`
  })
}

const monthLabels = lastThreeMonthLabels()

const overviewCharts = [
  {
    title: 'Cơ cấu chi phí',
    hint: '3 tháng gần đây',
    categories: monthLabels,
    yAxisTitle: 'Chi phí',
    valueSuffix: '₫',
    series: [
      { name: 'Phí cố định', data: [1_500_000, 1_500_000, 1_500_000] },
      { name: 'Phí dịch vụ', data: [2_180_000, 2_640_000, 2_410_000] },
      { name: 'Phí xử lý', data: [860_000, 1_120_000, 980_000] },
    ],
  },
  {
    title: 'Doanh thu',
    hint: '3 tháng gần đây',
    categories: monthLabels,
    yAxisTitle: 'Doanh thu',
    valueSuffix: '₫',
    series: [
      { name: 'Doanh thu', data: [18_400_000, 21_250_000, 19_780_000] },
      { name: 'Chiết khấu', data: [1_120_000, 1_480_000, 1_260_000] },
    ],
  },
  {
    title: 'Đơn hàng',
    hint: '3 tháng gần đây',
    categories: monthLabels,
    yAxisTitle: 'Số đơn',
    valueSuffix: '',
    series: [
      { name: 'Thành công', data: [186, 214, 198] },
      { name: 'Hoàn / hủy', data: [12, 18, 15] },
    ],
  },
]

const promoEffectiveness = {
  categories: ['0–10%', '10–20%', '20–30%', '>30%'],
  columnSeries: {
    name: 'Số đơn',
    data: [420, 680, 310, 95],
  },
  lineSeries: {
    name: 'Biên lợi nhuận',
    data: [28.5, 21.2, 12.4, 4.8],
  },
}

const orders = [
  { id: 'DH-10241', customer: 'Nguyễn Minh Anh', total: '259.000đ', status: 'Chờ xác nhận', tag: 'warning' },
  { id: 'DH-10240', customer: 'Trần Quốc Huy', total: '890.000đ', status: 'Đang giao', tag: '' },
  { id: 'DH-10238', customer: 'Lê Thu Hà', total: '149.000đ', status: 'Hoàn thành', tag: 'success' },
  { id: 'DH-10235', customer: 'Phạm Văn Đức', total: '420.000đ', status: 'Trả hàng', tag: 'danger' },
]
</script>

<style scoped lang="scss">
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px;
  border-radius: 12px;
  background: linear-gradient(135deg, #ee4d2d 0%, #ff8a65 100%);
  color: #fff;

  h1 {
    margin: 0 0 6px;
    font-size: 22px;
  }

  p {
    margin: 0;
    opacity: 0.9;
  }
}

.period-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;

  &__presets {
    display: flex;
    flex-wrap: wrap;
  }

  &__picker {
    width: 280px;
    max-width: 100%;
  }
}

.stat-group {
  display: flex;
  flex-direction: column;
  gap: 10px;

  &__title {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }

  &__grid {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(2, minmax(0, 1fr));

    @media (min-width: 768px) {
      gap: 16px;
    }

    &--overview {
      @media (min-width: 1200px) {
        grid-template-columns: repeat(5, minmax(0, 1fr));
      }
    }

    &--reconciliation {
      @media (min-width: 1200px) {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }
    }
  }
}

.stat-card {
  :deep(.el-card__body) {
    display: flex;
    align-items: center;
    gap: 14px;
    height: 100%;
  }

  &__icon {
    width: 42px;
    height: 42px;
    border-radius: 10px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__content {
    min-width: 0;
  }

  &__label {
    display: block;
    font-size: 12px;
    color: var(--el-text-color-secondary);
    margin-bottom: 4px;
  }

  strong {
    display: block;
    font-size: 20px;
    line-height: 1.2;
  }

  &__sub {
    display: block;
    margin-top: 4px;
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
}

.charts-row {
  :deep(.el-col) {
    margin-bottom: 16px;
  }
}

.chart-card {
  height: 100%;

  &__header,
  &__hint {
    min-width: 0;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  &__hint {
    font-size: 12px;
    font-weight: 400;
    color: var(--el-text-color-secondary);
    white-space: nowrap;
  }
}

.orders-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
