<template>
  <el-dialog
    v-model="visible"
    title="Tìm kiếm nhanh"
    width="520px"
    append-to-body
  >
    <el-input
      v-model="keyword"
      placeholder="Tìm đơn hàng, sản phẩm, voucher..."
      clearable
      autofocus
    >
      <template #prefix>
        <el-icon><Search /></el-icon>
      </template>
    </el-input>

    <el-empty
      v-if="!filtered.length"
      description="Không có kết quả"
      :image-size="80"
    />

    <ul v-else class="search-results">
      <li v-for="item in filtered" :key="item.path">
        <button type="button" @click="go(item.path)">
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.title }}</span>
        </button>
      </li>
    </ul>
  </el-dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Search, List, Goods, Ticket, Wallet } from '@element-plus/icons-vue'

const visible = defineModel({ type: Boolean, default: false })
const keyword = ref('')
const router = useRouter()

const sources = [
  { title: 'Sản phẩm', path: '/san-pham', icon: Goods },
  { title: 'Đơn hàng', path: '/don-hang', icon: List },
  { title: 'Quảng cáo', path: '/quang-cao', icon: List },
  { title: 'Chi phí & khuyến mãi', path: '/chi-phi-khuyen-mai', icon: Ticket },
  { title: 'Ví Shopee', path: '/vi-shopee', icon: Wallet },
]

const filtered = computed(() => {
  const q = keyword.value.trim().toLowerCase()
  if (!q) return sources
  return sources.filter((item) => item.title.toLowerCase().includes(q))
})

function go(path) {
  visible.value = false
  router.push(path)
}

watch(visible, (open) => {
  if (!open) keyword.value = ''
})
</script>

<style scoped lang="scss">
.search-results {
  margin: 16px 0 0;
  padding: 0;
  list-style: none;

  button {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border: 0;
    border-radius: 8px;
    background: transparent;
    color: inherit;
    cursor: pointer;
    text-align: left;

    &:hover {
      background: var(--el-fill-color-light);
    }
  }
}
</style>
