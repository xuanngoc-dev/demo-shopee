<template>
  <div class="page-quang-cao">
    <CustomCard shadow="never" class="page-card">
      <section class="period-bar">
        <CustomDatePicker
          v-model="dateRange"
          type="daterange"
          unlink-panels
          range-separator="–"
          start-placeholder="Từ ngày"
          end-placeholder="Đến ngày"
          format="DD/MM/YYYY"
          size="small"
          :disabled-date="isFutureDate"
          :clearable="false"
          class="period-bar__picker"
          @change="onCustomRangeChange"
        />

        <CustomRadioGroup
          v-model="periodPreset"
          size="small"
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

      <section class="stat-grid">
        <CustomCard
          v-for="card in summaryCards"
          :key="card.label"
          shadow="hover"
          class="stat-card"
        >
          <div class="stat-card__icon" :style="{ background: card.bg, color: card.color }">
            <CustomIcon :size="16">
              <component :is="card.icon" />
            </CustomIcon>
          </div>
          <div class="stat-card__body">
            <span>{{ card.label }}</span>
            <strong>{{ card.value }}</strong>
            <em v-if="card.sub">{{ card.sub }}</em>
          </div>
        </CustomCard>
      </section>

      <CustomTable
        :data="rows"
        stripe
        border
        show-summary
        :summary-method="getSummaries"
        sum-text="Tổng"
        empty-text="Không có dữ liệu trong khoảng ngày đã chọn"
        class="ads-table"
      >
        <el-table-column label="Ngày" min-width="120" fixed>
          <template #default="{ row }">
            <div class="day-cell">
              <p>{{ row.weekday }} - {{ formatDayTitle(row.date) }}</p>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Chi phí quảng cáo" align="center">
          <el-table-column label="Tổng" min-width="122" align="right" class-name="is-total">
            <template #default="{ row }">{{ formatVnd(row.cost.total) }}</template>
          </el-table-column>
          <el-table-column
            v-for="channel in adChannels"
            :key="`cost-${channel.key}`"
            :label="channel.label"
            min-width="118"
            align="right"
          >
            <template #default="{ row }">{{ formatVnd(row.cost[channel.key]) }}</template>
          </el-table-column>
        </el-table-column>

        <el-table-column label="Inbox" align="center">
          <el-table-column label="Tổng" min-width="88" align="right" class-name="is-total">
            <template #default="{ row }">{{ formatCount(row.inbox.total) }}</template>
          </el-table-column>
          <el-table-column
            v-for="channel in adChannels"
            :key="`inbox-${channel.key}`"
            :label="channel.label"
            min-width="88"
            align="right"
          >
            <template #default="{ row }">{{ formatCount(row.inbox[channel.key]) }}</template>
          </el-table-column>
        </el-table-column>

        <el-table-column label="Khách hàng" align="center">
          <el-table-column label="Tổng" min-width="88" align="right" class-name="is-total">
            <template #default="{ row }">{{ formatCount(row.customers.total) }}</template>
          </el-table-column>
          <el-table-column
            v-for="channel in adChannels"
            :key="`customers-${channel.key}`"
            :label="channel.label"
            min-width="88"
            align="right"
          >
            <template #default="{ row }">{{ formatCount(row.customers[channel.key]) }}</template>
          </el-table-column>
        </el-table-column>

        <el-table-column label="Đơn hàng" min-width="96" align="right">
          <template #default="{ row }">{{ formatCount(row.orders) }}</template>
        </el-table-column>
        <el-table-column label="Doanh thu" min-width="128" align="right">
          <template #default="{ row }">{{ formatVnd(row.revenue) }}</template>
        </el-table-column>
        <el-table-column label="CPA" min-width="112" align="right">
          <template #default="{ row }">{{ formatVnd(row.cpa) }}</template>
        </el-table-column>
        <el-table-column label="ROAS" min-width="88" align="right">
          <template #default="{ row }">
            <span class="roas" :class="{ 'is-low': row.roas < 1 }">{{ formatRoas(row.roas) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Tỷ lệ chốt" min-width="96" align="right">
          <template #default="{ row }">{{ formatPercent(row.conversion) }}</template>
        </el-table-column>
      </CustomTable>
    </CustomCard>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Money, ChatDotRound, User, ShoppingCart, TrendCharts } from '@element-plus/icons-vue'
import {
  CustomCard,
  CustomDatePicker,
  CustomIcon,
  CustomRadioButton,
  CustomRadioGroup,
  CustomTable,
} from '@/components/element'
import { formatPercent, formatVnd } from '../san-pham/mockData'
import {
  adChannels,
  adsRowsForRange,
  endOfDay,
  formatCount,
  formatDayTitle,
  formatRoas,
  startOfDay,
  sumAdsRows,
  toDayKey,
} from './mockData'

const periodOptions = [
  { value: 'thisWeek', label: 'Tuần này' },
  { value: 'lastWeek', label: 'Tuần trước' },
  { value: 'thisMonth', label: 'Tháng này' },
  { value: 'lastMonth', label: 'Tháng trước' },
]

function rangeForPreset(key) {
  const now = new Date()
  const today = startOfDay(now)
  const weekday = today.getDay()
  const mondayOffset = weekday === 0 ? 6 : weekday - 1
  const thisMonday = new Date(today)
  thisMonday.setDate(thisMonday.getDate() - mondayOffset)

  if (key === 'thisWeek') return [thisMonday, endOfDay(now)]

  if (key === 'lastWeek') {
    const lastMonday = new Date(thisMonday)
    lastMonday.setDate(lastMonday.getDate() - 7)
    const lastSunday = new Date(thisMonday)
    lastSunday.setDate(lastSunday.getDate() - 1)
    return [lastMonday, endOfDay(lastSunday)]
  }

  if (key === 'thisMonth') {
    return [new Date(today.getFullYear(), today.getMonth(), 1), endOfDay(now)]
  }

  const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1)
  const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0)
  return [lastMonthStart, endOfDay(lastMonthEnd)]
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
    periodPreset.value = 'thisMonth'
    applyPreset('thisMonth')
    return
  }
  const matched = periodOptions.find((item) => rangesEqual(val, rangeForPreset(item.value)))
  periodPreset.value = matched?.value ?? ''
}

const periodPreset = ref('thisMonth')
const dateRange = ref(rangeForPreset('thisMonth'))

const rows = computed(() => {
  const range = dateRange.value
  if (!range?.length) return []
  return adsRowsForRange(range[0], range[1])
})

const totals = computed(() => sumAdsRows(rows.value))

const summaryCards = computed(() => {
  const sum = totals.value
  return [
    {
      label: 'Chi phí quảng cáo',
      value: formatVnd(sum.cost.total),
      sub: `${formatCount(rows.value.length)} ngày`,
      icon: Money,
      color: '#ee4d2d',
      bg: '#fef2ef',
    },
    {
      label: 'Inbox',
      value: formatCount(sum.inbox.total),
      sub: `TikTok ${formatCount(sum.inbox.tiktok)} · FB ${formatCount(sum.inbox.facebook)}`,
      icon: ChatDotRound,
      color: '#409eff',
      bg: '#ecf5ff',
    },
    {
      label: 'Khách hàng',
      value: formatCount(sum.customers.total),
      sub: `Tỷ lệ chốt ${formatPercent(sum.conversion)}`,
      icon: User,
      color: '#67c23a',
      bg: '#f0f9eb',
    },
    {
      label: 'Đơn hàng',
      value: formatCount(sum.orders),
      sub: formatVnd(sum.revenue),
      icon: ShoppingCart,
      color: '#e6a23c',
      bg: '#fdf6ec',
    },
    {
      label: 'ROAS',
      value: formatRoas(sum.roas),
      sub: `CPA ${formatVnd(sum.cpa)}`,
      icon: TrendCharts,
      color: '#9b59b6',
      bg: '#f5eef8',
    },
  ]
})

function getSummaries({ columns }) {
  const sum = totals.value
  const values = [
    'Tổng',
    formatVnd(sum.cost.total),
    ...adChannels.map((channel) => formatVnd(sum.cost[channel.key])),
    formatCount(sum.inbox.total),
    ...adChannels.map((channel) => formatCount(sum.inbox[channel.key])),
    formatCount(sum.customers.total),
    ...adChannels.map((channel) => formatCount(sum.customers[channel.key])),
    formatCount(sum.orders),
    formatVnd(sum.revenue),
    formatVnd(sum.cpa),
    formatRoas(sum.roas),
    formatPercent(sum.conversion),
  ]
  return columns.map((_, index) => values[index] ?? '')
}
</script>

<style scoped lang="scss">
.page-card {
  > :deep(.el-card__body) {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}

.period-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;

  &__presets {
    display: flex;
    flex-wrap: wrap;
  }

  &__picker {
    width: 220px;
    max-width: 100%;

    :deep(.el-date-editor),
    :deep(.el-date-editor.el-input__wrapper),
    :deep(.el-date-editor.el-date-editor--daterange) {
      width: 220px;
      max-width: 100%;
      --el-date-editor-daterange-width: 220px;
    }

    :deep(.el-range-input) {
      font-size: 12px;
    }

    :deep(.el-range-separator) {
      flex: 0 0 16px;
      padding: 0 2px;
    }
  }
}

.stat-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  @media (min-width: 900px) {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}

.stat-card {
  :deep(.el-card__body) {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    min-height: 0;
  }

  &__icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__body {
    min-width: 0;
    flex: 1;

    span,
    em {
      display: block;
      font-size: 12px;
      line-height: 1.2;
      color: var(--el-text-color-secondary);
    }

    strong {
      display: block;
      margin: 1px 0;
      font-size: 15px;
      line-height: 1.2;
    }

    em {
      font-style: normal;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

.ads-table {
  width: 100%;

  :deep(.el-table__header th) {
    background: var(--el-fill-color-light);
  }

  :deep(.is-total) {
    font-weight: 600;
    background: var(--el-fill-color-blank);
  }

  :deep(.el-table__footer .cell) {
    font-weight: 600;
  }
}

.day-cell {
  strong {
    display: block;
    font-size: 13px;
  }

  span {
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
}

.roas {
  color: var(--el-color-success);
  font-weight: 600;

  &.is-low {
    color: var(--el-color-danger);
  }
}
</style>
