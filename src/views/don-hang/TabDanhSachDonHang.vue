<template>
  <div class="tab-panel">
    <section class="metric-grid">
      <button
        v-for="card in metricCards"
        :key="card.key"
        type="button"
        class="quick-card"
        :class="{ 'is-active': sortKey === card.key }"
        @click="selectMetric(card.key)"
      >
        <div class="quick-card__icon" :style="{ background: card.bg, color: card.color }">
          <CustomIcon :size="18">
            <component :is="card.icon" />
          </CustomIcon>
        </div>
        <div class="quick-card__body">
          <span>{{ card.label }}</span>
          <strong>{{ formatVnd(metricTotals[card.key]) }}</strong>
          <em>{{ sortHint(card.key) }}</em>
        </div>
      </button>
    </section>

    <section class="summary-grid">
      <button
        v-for="card in summaryCards"
        :key="card.value"
        type="button"
        class="summary-card"
        :class="{ 'is-active': statusFilter === card.value }"
        @click="statusFilter = card.value"
      >
        <div class="summary-card__icon" :style="{ background: card.bg, color: card.color }">
          <CustomIcon :size="18">
            <component :is="card.icon" />
          </CustomIcon>
        </div>
        <div class="summary-card__body">
          <span>{{ card.label }}</span>
          <strong>{{ card.count }} đơn</strong>
          <em>{{ formatVnd(card.amount) }}</em>
        </div>
      </button>
    </section>

    <div class="filter-bar">
      <el-input
        v-model="keyword"
        placeholder="Tìm mã đơn, khách hàng, SĐT, sản phẩm..."
        clearable
        class="filter-bar__search"
      >
        <template #prefix>
          <CustomIcon><Search /></CustomIcon>
        </template>
      </el-input>

      <el-select
        v-model="statusFilter"
        placeholder="Trạng thái"
        class="filter-bar__select"
      >
        <el-option label="Tất cả trạng thái" value="all" />
        <el-option
          v-for="item in orderStatusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>

      <el-select
        v-model="paymentFilter"
        placeholder="Thanh toán"
        clearable
        class="filter-bar__select"
      >
        <el-option
          v-for="item in paymentOptions"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>

      <CustomDatePicker
        v-model="createdRange"
        type="daterange"
        unlink-panels
        range-separator="–"
        start-placeholder="Lên đơn từ"
        end-placeholder="đến ngày"
        format="DD/MM/YYYY"
        value-format="YYYY-MM-DD"
        style="width: 100%"
        class="filter-bar__dates"
      />

      <CustomDatePicker
        v-model="receivedRange"
        type="daterange"
        unlink-panels
        range-separator="–"
        start-placeholder="Nhận từ"
        end-placeholder="đến ngày"
        format="DD/MM/YYYY"
        value-format="YYYY-MM-DD"
        style="width: 100%"
        class="filter-bar__dates"
      />
    </div>

    <CustomTable :data="sortedRows" stripe empty-text="Không có đơn hàng khớp bộ lọc">
      <CustomTableColumn label="Đơn hàng" min-width="200" fixed>
        <template #default="{ row }">
          <div class="order-cell">
            <strong>{{ row.id }}</strong>
            <span>{{ row.customer }}</span>
            <em>{{ row.phone }}</em>
          </div>
        </template>
      </CustomTableColumn>
      <CustomTableColumn label="Sản phẩm" min-width="240">
        <template #default="{ row }">
          <div class="item-list">
            <span v-for="line in resolveOrderLines(row)" :key="`${line.sku}-${line.qty}`">
              {{ line.name }} ×{{ line.qty }}
            </span>
          </div>
        </template>
      </CustomTableColumn>
      <CustomTableColumn label="Giá bán" width="124" align="right">
        <template #default="{ row }">
          {{ formatVnd(orderTotals(row).price) }}
        </template>
      </CustomTableColumn>
      <CustomTableColumn label="Giá vốn" width="124" align="right">
        <template #default="{ row }">
          {{ formatVnd(orderTotals(row).cost) }}
        </template>
      </CustomTableColumn>
      <CustomTableColumn label="Phí sàn" width="124" align="right">
        <template #default="{ row }">
          {{ formatVnd(orderTotals(row).fee) }}
        </template>
      </CustomTableColumn>
      <CustomTableColumn label="Giảm giá" width="118" align="right">
        <template #default="{ row }">
          {{ formatVnd(row.discount) }}
        </template>
      </CustomTableColumn>
      <CustomTableColumn label="Lợi nhuận" width="128" align="right">
        <template #default="{ row }">
          <span
            class="profit"
            :class="{ 'is-negative': orderTotals(row).profit < 0 }"
          >
            {{ formatVnd(orderTotals(row).profit) }}
          </span>
        </template>
      </CustomTableColumn>
      <CustomTableColumn label="Trạng thái" width="140">
        <template #default="{ row }">
          <CustomTag :type="orderStatusMeta(row.status).tag || undefined" size="small">
            {{ orderStatusMeta(row.status).label }}
          </CustomTag>
        </template>
      </CustomTableColumn>
      <CustomTableColumn label="Thời gian lên đơn" width="150">
        <template #default="{ row }">
          {{ formatDateTime(row.createdAt) }}
        </template>
      </CustomTableColumn>
      <CustomTableColumn label="Ngày nhận" width="150">
        <template #default="{ row }">
          {{ formatDateTime(row.receivedAt) }}
        </template>
      </CustomTableColumn>
      <CustomTableColumn label="Thanh toán" width="130" show-overflow-tooltip>
        <template #default="{ row }">
          {{ row.payment }}
        </template>
      </CustomTableColumn>
      <CustomTableColumn label="Vận chuyển" min-width="140" show-overflow-tooltip>
        <template #default="{ row }">
          <div class="ship-cell">
            <strong>{{ row.carrier }}</strong>
            <span>{{ row.province }}</span>
          </div>
        </template>
      </CustomTableColumn>
      <CustomTableColumn label="" width="100" align="right" fixed="right">
        <template #default="{ row }">
          <CustomButton text type="primary" @click="openDetail(row)">Chi tiết</CustomButton>
        </template>
      </CustomTableColumn>
    </CustomTable>

    <el-dialog
      v-model="detailOpen"
      :title="detailOrder ? `Chi tiết ${detailOrder.id}` : 'Chi tiết đơn'"
      width="640px"
    >
      <template v-if="detailOrder">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="Khách hàng" :span="2">
            {{ detailOrder.customer }} · {{ detailOrder.phone }}
          </el-descriptions-item>
          <el-descriptions-item label="Khu vực">{{ detailOrder.province }}</el-descriptions-item>
          <el-descriptions-item label="Trạng thái">
            {{ orderStatusMeta(detailOrder.status).label }}
          </el-descriptions-item>
          <el-descriptions-item label="Thời gian lên đơn">
            {{ formatDateTime(detailOrder.createdAt) }}
          </el-descriptions-item>
          <el-descriptions-item label="Ngày nhận">
            {{ formatDateTime(detailOrder.receivedAt) }}
          </el-descriptions-item>
          <el-descriptions-item label="Thanh toán">{{ detailOrder.payment }}</el-descriptions-item>
          <el-descriptions-item label="Đơn vị vận chuyển">{{ detailOrder.carrier }}</el-descriptions-item>
          <el-descriptions-item label="Giá bán">
            {{ formatVnd(orderTotals(detailOrder).price) }}
          </el-descriptions-item>
          <el-descriptions-item label="Giá vốn">
            {{ formatVnd(orderTotals(detailOrder).cost) }}
          </el-descriptions-item>
          <el-descriptions-item label="Phí sàn">
            {{ formatVnd(orderTotals(detailOrder).fee) }}
          </el-descriptions-item>
          <el-descriptions-item label="Giảm giá">
            {{ formatVnd(detailOrder.discount) }}
          </el-descriptions-item>
          <el-descriptions-item label="Phí vận chuyển">
            {{ formatVnd(detailOrder.shippingFee) }}
          </el-descriptions-item>
          <el-descriptions-item label="Lợi nhuận">
            {{ formatVnd(orderTotals(detailOrder).profit) }}
          </el-descriptions-item>
          <el-descriptions-item label="Ghi chú" :span="2">
            {{ detailOrder.note || '—' }}
          </el-descriptions-item>
        </el-descriptions>

        <CustomTable :data="resolveOrderLines(detailOrder)" stripe class="detail-items" empty-text="">
          <CustomTableColumn prop="sku" label="SKU" width="110" />
          <CustomTableColumn prop="name" label="Sản phẩm / combo" min-width="220" />
          <CustomTableColumn prop="qty" label="SL" width="70" align="right" />
          <CustomTableColumn label="Giá bán" width="120" align="right">
            <template #default="{ row }">{{ formatVnd(row.price) }}</template>
          </CustomTableColumn>
          <CustomTableColumn label="Giá vốn" width="120" align="right">
            <template #default="{ row }">{{ formatVnd(row.costPrice) }}</template>
          </CustomTableColumn>
        </CustomTable>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Money, Ticket, Discount, Coin, Search, Box, Goods, Clock, CircleCheck, CircleClose, Van } from '@element-plus/icons-vue'
import {
  CustomButton,
  CustomDatePicker,
  CustomIcon,
  CustomTable,
  CustomTableColumn,
  CustomTag,
} from '@/components/element'
import { formatVnd } from '../san-pham/mockData'
import {
  donHangList,
  formatDateTime,
  inDateRange,
  orderStatusMeta,
  orderStatusOptions,
  orderTotals,
  paymentOptions,
  resolveOrderLines,
} from './mockData'

const keyword = ref('')
const statusFilter = ref('all')
const paymentFilter = ref('')
const createdRange = ref(null)
const receivedRange = ref(null)
const sortKey = ref('profit')
const sortDir = ref('desc')
const detailOpen = ref(false)
const detailOrder = ref(null)

const metricCards = [
  { key: 'price', label: 'Đã bán', icon: Money, color: '#ee4d2d', bg: '#fef2ef' },
  { key: 'cost', label: 'Giá vốn', icon: Box, color: '#409eff', bg: '#ecf5ff' },
  { key: 'fee', label: 'Phí sàn', icon: Ticket, color: '#e6a23c', bg: '#fdf6ec' },
  { key: 'discount', label: 'Giảm giá', icon: Discount, color: '#9b59b6', bg: '#f5eef8' },
  { key: 'profit', label: 'Lợi nhuận', icon: Coin, color: '#67c23a', bg: '#f0f9eb' },
]

const dateFiltered = computed(() => {
  const q = keyword.value.trim().toLowerCase()
  return donHangList.filter((order) => {
    if (!inDateRange(order.createdAt, createdRange.value)) return false
    if (receivedRange.value?.length && !inDateRange(order.receivedAt, receivedRange.value)) return false
    if (paymentFilter.value && order.payment !== paymentFilter.value) return false
    if (!q) return true
    const lines = resolveOrderLines(order)
      .map((line) => `${line.name} ${line.sku}`)
      .join(' ')
      .toLowerCase()
    return (
      order.id.toLowerCase().includes(q) ||
      order.customer.toLowerCase().includes(q) ||
      order.phone.replace(/\s/g, '').includes(q.replace(/\s/g, '')) ||
      order.province.toLowerCase().includes(q) ||
      lines.includes(q)
    )
  })
})

const summaryCards = computed(() => {
  const all = dateFiltered.value
  const byStatus = (status) => all.filter((order) => order.status === status)

  return [
    { value: 'all', label: 'Tổng số đơn', icon: Goods, color: '#409eff', bg: '#ecf5ff', ...summarizeOrders(all) },
    { value: 'pending', label: 'Đang lên đơn', icon: Clock, color: '#909399', bg: '#f4f4f5', ...summarizeOrders(byStatus('pending')) },
    { value: 'success', label: 'Hoàn thành', icon: CircleCheck, color: '#67c23a', bg: '#f0f9eb', ...summarizeOrders(byStatus('success')) },
    { value: 'cancelled', label: 'Đơn huỷ', icon: CircleClose, color: '#f56c6c', bg: '#fef0f0', ...summarizeOrders(byStatus('cancelled')) },
    { value: 'shipping', label: 'Đang giao', icon: Van, color: '#e6a23c', bg: '#fdf6ec', ...summarizeOrders(byStatus('shipping')) },
  ]
})

function summarizeOrders(orders) {
  return orders.reduce(
    (acc, order) => {
      acc.count += 1
      acc.amount += orderTotals(order).price
      return acc
    },
    { count: 0, amount: 0 },
  )
}

const filteredRows = computed(() => {
  if (statusFilter.value === 'all') return dateFiltered.value
  return dateFiltered.value.filter((order) => order.status === statusFilter.value)
})

const metricTotals = computed(() => {
  return filteredRows.value.reduce(
    (acc, order) => {
      const totals = orderTotals(order)
      acc.price += totals.price
      acc.cost += totals.cost
      acc.fee += totals.fee
      acc.discount += totals.discount
      acc.profit += totals.profit
      return acc
    },
    { price: 0, cost: 0, fee: 0, discount: 0, profit: 0 },
  )
})

const sortedRows = computed(() => {
  const rows = [...filteredRows.value]
  const dir = sortDir.value === 'asc' ? 1 : -1
  return rows.sort((a, b) => {
    const left = metricValue(a, sortKey.value)
    const right = metricValue(b, sortKey.value)
    if (left === right) return b.id.localeCompare(a.id)
    return (left - right) * dir
  })
})

function metricValue(order, key) {
  const totals = orderTotals(order)
  if (key === 'discount') return order.discount || 0
  return totals[key] || 0
}

function selectMetric(key) {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === 'desc' ? 'asc' : 'desc'
    return
  }
  sortKey.value = key
  sortDir.value = 'desc'
}

function sortHint(key) {
  if (sortKey.value !== key) return 'Bấm để sắp xếp'
  return sortDir.value === 'desc' ? 'Đang xếp giảm dần' : 'Đang xếp tăng dần'
}

function resetFilters() {
  keyword.value = ''
  statusFilter.value = 'all'
  paymentFilter.value = ''
  createdRange.value = null
  receivedRange.value = null
  sortKey.value = 'profit'
  sortDir.value = 'desc'
}

function openDetail(row) {
  detailOrder.value = row
  detailOpen.value = true
}
</script>

<style scoped lang="scss">
.metric-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-bottom: 12px;

  @media (min-width: 900px) {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}

.summary-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-bottom: 12px;

  @media (min-width: 900px) {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}

.quick-card,
.summary-card {
  border: 1px solid var(--el-border-color);
  background: var(--el-bg-color);
  color: inherit;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &:hover,
  &.is-active {
    border-color: var(--el-color-primary);
    box-shadow: 0 0 0 1px var(--el-color-primary-light-8);
  }
}

.quick-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 10px;
}

.quick-card__icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.quick-card__body {
  min-width: 0;

  span,
  em {
    display: block;
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }

  strong {
    display: block;
    margin: 2px 0;
    font-size: 15px;
    line-height: 1.2;
  }

  em {
    font-style: normal;
  }
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 10px;
  min-width: 0;

  &__icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__body {
    min-width: 0;

    span,
    em {
      display: block;
      font-size: 12px;
      color: var(--el-text-color-secondary);
    }

    strong {
      display: block;
      margin: 2px 0;
      font-size: 16px;
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

.filter-bar {
  display: grid;
  gap: 12px 16px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-bottom: 16px;
  align-items: stretch;

  @media (min-width: 900px) {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }

  @media (min-width: 1280px) {
    grid-template-columns:
      minmax(0, 1.2fr)
      minmax(0, 0.9fr)
      minmax(0, 0.9fr)
      minmax(280px, 1.5fr)
      minmax(280px, 1.5fr);
  }

  :deep(.el-input),
  :deep(.el-select) {
    width: 100%;
    max-width: 100%;
  }

  :deep(.el-date-editor),
  :deep(.el-date-editor.el-input__wrapper),
  :deep(.el-date-editor.el-date-editor--daterange) {
    width: 100% !important;
    max-width: 100%;
    min-width: 0;
    box-sizing: border-box;
    --el-date-editor-daterange-width: 100%;
  }

  :deep(.el-date-editor .el-range-input) {
    flex: 1 1 0;
    width: auto !important;
    min-width: 0;
    font-size: 12px;
    text-align: left;
    padding: 0 6px;
  }

  :deep(.el-date-editor .el-range-separator) {
    flex: 0 0 24px;
    width: 24px;
    padding: 0;
  }
}

.filter-bar__search,
.filter-bar__select,
.filter-bar__dates {
  width: 100%;
  min-width: 0;
}

@media (min-width: 900px) and (max-width: 1279px) {
  .filter-bar__search,
  .filter-bar__select {
    grid-column: span 2;
  }

  .filter-bar__dates {
    grid-column: span 3;
  }
}

.order-cell {
  strong {
    display: block;
    font-size: 13px;
  }

  span,
  em {
    display: block;
    font-size: 12px;
    font-style: normal;
    color: var(--el-text-color-secondary);
  }
}

.item-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 12px;
  line-height: 1.4;
}

.ship-cell {
  strong {
    display: block;
    font-size: 13px;
    font-weight: 500;
  }

  span {
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
}

.profit {
  color: var(--el-color-success);
  font-weight: 600;

  &.is-negative {
    color: var(--el-color-danger);
  }
}

.detail-items {
  margin-top: 16px;
}
</style>
