<template>
  <div class="tab-panel">
    <p class="hint">
      Tỷ lệ được tính trên các đơn thành công, đang giao và đang chuẩn bị.
      “% tổng đơn SP gốc” = số đơn có cả hai sản phẩm / tổng đơn chứa sản phẩm gốc.
    </p>

    <div class="filter-bar">
      <el-input
        v-model="keyword"
        placeholder="Tìm sản phẩm gốc hoặc sản phẩm mua cùng..."
        clearable
        class="filter-bar__search"
      >
        <template #prefix>
          <CustomIcon><Search /></CustomIcon>
        </template>
      </el-input>
    </div>

    <CustomTable :data="filteredRows" stripe empty-text="Chưa có cặp sản phẩm mua cùng nhau">
      <CustomTableColumn type="index" label="STT" width="70" align="center" />
      <CustomTableColumn label="Sản phẩm gốc" min-width="240">
        <template #default="{ row }">
          <div class="product-cell">
            <strong>{{ row.originName }}</strong>
            <span>{{ row.originSku }}</span>
          </div>
        </template>
      </CustomTableColumn>
      <CustomTableColumn label="Hay mua cùng" min-width="240">
        <template #default="{ row }">
          <div class="product-cell">
            <strong>{{ row.companionName }}</strong>
            <span>{{ row.companionSku }}</span>
          </div>
        </template>
      </CustomTableColumn>
      <CustomTableColumn label="Số đơn" width="120" align="right">
        <template #default="{ row }">
          {{ row.together }}
        </template>
      </CustomTableColumn>
      <CustomTableColumn label="Tổng đơn SP gốc" width="160" align="right">
        <template #default="{ row }">
          {{ row.originTotal }}
        </template>
      </CustomTableColumn>
      <CustomTableColumn label="% tổng đơn SP gốc" min-width="200">
        <template #default="{ row }">
          <div class="percent-cell">
            <span>{{ formatPercent(row.percent) }}</span>
            <el-progress
              :percentage="Math.min(100, Number(row.percent.toFixed(1)))"
              :stroke-width="8"
              :show-text="false"
              color="var(--el-color-primary)"
            />
          </div>
        </template>
      </CustomTableColumn>
    </CustomTable>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { CustomIcon, CustomTable, CustomTableColumn } from '@/components/element'
import { formatPercent } from '../san-pham/mockData'
import { frequentlyBoughtTogether } from './mockData'

const keyword = ref('')
const rows = frequentlyBoughtTogether()

const filteredRows = computed(() => {
  const q = keyword.value.trim().toLowerCase()
  if (!q) return rows
  return rows.filter((row) => {
    return (
      row.originName.toLowerCase().includes(q) ||
      row.originSku.toLowerCase().includes(q) ||
      row.companionName.toLowerCase().includes(q) ||
      row.companionSku.toLowerCase().includes(q)
    )
  })
})
</script>

<style scoped lang="scss">
.hint {
  margin: 0 0 14px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.filter-bar {
  display: flex;
  margin-bottom: 16px;
}

.filter-bar__search {
  width: 320px;
  max-width: 100%;
}

.product-cell {
  strong {
    display: block;
    font-size: 13px;
    line-height: 1.3;
  }

  span {
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
}

.percent-cell {
  display: flex;
  flex-direction: column;
  gap: 6px;

  span {
    font-weight: 600;
    font-size: 13px;
  }
}
</style>
