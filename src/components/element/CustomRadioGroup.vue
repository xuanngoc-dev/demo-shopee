<script setup>
/**
 * CustomRadioGroup — wrapper el-radio-group.
 */
import { useSlots } from 'vue'

defineOptions({ name: 'CustomRadioGroup', inheritAttrs: false })

const slots = useSlots()
</script>

<template>
  <el-radio-group v-bind="$attrs">
    <template v-for="(_, name) in slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData || {}" />
    </template>
  </el-radio-group>
</template>
