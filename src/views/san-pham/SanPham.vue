<template>
  <div class="page-san-pham">
    <CustomCard shadow="never" class="page-card">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="Sản phẩm" name="san-pham">
          <TabSanPham />
        </el-tab-pane>
        <el-tab-pane label="Combo sản phẩm" name="combo-san-pham">
          <TabComboSanPham />
        </el-tab-pane>
        <el-tab-pane label="Nhóm sản phẩm" name="nhom-san-pham">
          <TabNhomSanPham />
        </el-tab-pane>
      </el-tabs>
    </CustomCard>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { CustomCard } from '@/components/element'
import TabSanPham from './TabSanPham.vue'
import TabComboSanPham from './TabComboSanPham.vue'
import TabNhomSanPham from './TabNhomSanPham.vue'

const activeTab = ref('san-pham')
</script>

<style scoped lang="scss">
.page-card {
  :deep(.el-card__body) {
    padding-top: 8px;
  }

  :deep(.el-tabs__header) {
    margin-bottom: 16px;
  }
}
</style>
