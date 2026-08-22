<script setup>
/**
 * CustomTable — wrapper el-table.
 * Default slot phải là con trực tiếp của el-table để cột được đăng ký đúng.
 */
import { computed, useSlots } from 'vue'

defineOptions({ name: 'CustomTable', inheritAttrs: false })

const slots = useSlots()
const namedSlots = computed(() =>
  Object.fromEntries(Object.entries(slots).filter(([name]) => name !== 'default')),
)
</script>

<template>
  <el-table v-bind="$attrs">
    <slot />
    <template v-for="(_, name) in namedSlots" #[name]="slotData">
      <slot :name="name" v-bind="slotData || {}" />
    </template>
  </el-table>
</template>
