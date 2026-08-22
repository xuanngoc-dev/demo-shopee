<script setup>
/**
 * CustomDatePicker — wrapper el-date-picker.
 */
import { useSlots } from 'vue'

defineOptions({ name: 'CustomDatePicker', inheritAttrs: false })

const slots = useSlots()
</script>

<template>
  <el-date-picker v-bind="$attrs">
    <template v-for="(_, name) in slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData || {}" />
    </template>
  </el-date-picker>
</template>
