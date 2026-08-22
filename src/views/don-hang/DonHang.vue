<template>
  <div class="page-don-hang">
    <CustomCard shadow="never" class="page-card">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="Danh sách đơn hàng" name="danh-sach">
          <TabDanhSachDonHang />
        </el-tab-pane>
        <el-tab-pane label="Sản phẩm hay mua cùng nhau" name="mua-cung-nhau">
          <TabMuaCungNhau />
        </el-tab-pane>
      </el-tabs>
    </CustomCard>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { CustomCard } from '@/components/element'
import TabDanhSachDonHang from './TabDanhSachDonHang.vue'
import TabMuaCungNhau from './TabMuaCungNhau.vue'

const activeTab = ref('danh-sach')
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
