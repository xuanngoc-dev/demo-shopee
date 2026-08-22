<template>
  <div class="dashboard">
    <section class="hero">
      <div>
        <h1>Xin chào, Chủ shop</h1>
        <p>Theo dõi đơn hàng, sản phẩm và doanh thu gian hàng trong ngày.</p>
      </div>
      <el-button type="primary" @click="$router.push({ name: 'them-san-pham' })">
        Thêm sản phẩm
      </el-button>
    </section>

    <el-row :gutter="16">
      <el-col v-for="card in statCards" :key="card.label" :xs="24" :sm="12" :lg="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-card__icon" :style="{ background: card.bg, color: card.color }">
            <el-icon :size="20">
              <component :is="card.icon" />
            </el-icon>
          </div>
          <div>
            <span class="stat-card__label">{{ card.label }}</span>
            <strong>{{ card.value }}</strong>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" class="charts-row">
      <el-col
        v-for="chart in overviewCharts"
        :key="chart.title"
        :xs="24"
        :sm="12"
        :lg="8"
      >
        <el-card shadow="never" class="chart-card">
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
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="8">
        <el-card shadow="never" class="chart-card">
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
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never" class="orders-card">
      <template #header>
        <div class="orders-card__header">
          <span>Đơn hàng gần đây</span>
          <el-button text type="primary" @click="$router.push({ name: 'don-hang' })">
            Xem tất cả
          </el-button>
        </div>
      </template>

      <el-table :data="orders" stripe>
        <el-table-column prop="id" label="Mã đơn" width="140" />
        <el-table-column prop="customer" label="Khách hàng" />
        <el-table-column prop="total" label="Tổng tiền" width="140" />
        <el-table-column prop="status" label="Trạng thái" width="160">
          <template #default="{ row }">
            <el-tag :type="row.tag" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { List, Goods, Wallet, Star } from '@element-plus/icons-vue'
import BieuDoCotTheoNhom from '@/components/charts/BieuDoCotTheoNhom.vue'
import BieuDoCotVaDuong from '@/components/charts/BieuDoCotVaDuong.vue'

const statCards = [
  { label: 'Đơn hôm nay', value: '24', icon: List, color: '#ee4d2d', bg: '#fef2ef' },
  { label: 'Sản phẩm đang bán', value: '186', icon: Goods, color: '#e6a23c', bg: '#fdf6ec' },
  { label: 'Doanh thu', value: '12.4tr', icon: Wallet, color: '#67c23a', bg: '#f0f9eb' },
  { label: 'Đánh giá shop', value: '4.9', icon: Star, color: '#409eff', bg: '#ecf5ff' },
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

.stat-card {
  margin-bottom: 16px;

  :deep(.el-card__body) {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  &__icon {
    width: 42px;
    height: 42px;
    border-radius: 10px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  &__label {
    display: block;
    font-size: 12px;
    color: var(--el-text-color-secondary);
    margin-bottom: 4px;
  }

  strong {
    font-size: 20px;
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
