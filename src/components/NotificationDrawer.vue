<template>
  <el-drawer
    v-model="visible"
    title="Thông báo"
    direction="rtl"
    size="380px"
  >
    <el-empty v-if="!items.length" description="Chưa có thông báo" />

    <div v-else class="notice-list">
      <button
        v-for="item in items"
        :key="item.id"
        type="button"
        class="notice-item"
        :class="{ 'is-unread': !item.read }"
        @click="markRead(item)"
      >
        <el-icon class="notice-item__icon" :size="18">
          <component :is="item.icon" />
        </el-icon>
        <div class="notice-item__body">
          <strong>{{ item.title }}</strong>
          <p>{{ item.content }}</p>
          <span>{{ item.time }}</span>
        </div>
      </button>
    </div>

    <template #footer>
      <el-button text type="primary" @click="markAllRead">
        Đánh dấu đã đọc tất cả
      </el-button>
    </template>
  </el-drawer>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Bell, Box, Wallet } from '@element-plus/icons-vue'

const visible = defineModel({ type: Boolean, default: false })
const unreadCount = defineModel('unreadCount', { type: Number, default: 0 })

const items = ref([
  {
    id: 1,
    title: 'Đơn hàng mới',
    content: 'Bạn có 2 đơn hàng vừa được đặt.',
    time: '5 phút trước',
    read: false,
    icon: Bell,
  },
  {
    id: 2,
    title: 'Sắp hết hàng',
    content: 'Áo thun basic còn 3 sản phẩm trong kho.',
    time: '1 giờ trước',
    read: false,
    icon: Box,
  },
  {
    id: 3,
    title: 'Đối soát ví',
    content: 'Số dư ví Shopee đã được cập nhật.',
    time: 'Hôm qua',
    read: false,
    icon: Wallet,
  },
])

const unread = computed(() => items.value.filter((item) => !item.read).length)

function syncUnread() {
  unreadCount.value = unread.value
}

function markRead(item) {
  item.read = true
  syncUnread()
}

function markAllRead() {
  items.value.forEach((item) => {
    item.read = true
  })
  syncUnread()
}

syncUnread()
</script>

<style scoped lang="scss">
.notice-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.notice-item {
  display: flex;
  gap: 12px;
  width: 100%;
  padding: 12px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 10px;
  background: var(--el-fill-color-blank);
  text-align: left;
  cursor: pointer;

  &.is-unread {
    background: var(--el-color-primary-light-9);
    border-color: var(--el-color-primary-light-7);
  }

  &__icon {
    flex-shrink: 0;
    margin-top: 2px;
    color: var(--el-color-primary);
  }

  &__body {
    min-width: 0;

    strong {
      display: block;
      font-size: 14px;
    }

    p {
      margin: 4px 0;
      font-size: 13px;
      color: var(--el-text-color-regular);
    }

    span {
      font-size: 12px;
      color: var(--el-text-color-secondary);
    }
  }
}
</style>
