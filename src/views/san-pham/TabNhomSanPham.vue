<template>
  <div class="tab-panel">
    <div class="tab-toolbar">
      <el-input
        v-model="keyword"
        placeholder="Tìm theo tên nhóm..."
        clearable
        class="tab-toolbar__search"
      >
        <template #prefix>
          <CustomIcon><Search /></CustomIcon>
        </template>
      </el-input>

      <CustomButton type="primary" @click="openCreate">
        <CustomIcon class="el-icon--left"><Plus /></CustomIcon>
        Thêm nhóm sản phẩm
      </CustomButton>
    </div>

    <CustomTable :data="filteredRows" stripe empty-text="Không có nhóm sản phẩm">
      <CustomTableColumn prop="name" label="Tên nhóm" min-width="180" />
      <CustomTableColumn prop="description" label="Mô tả" min-width="240" />
      <CustomTableColumn label="Số sản phẩm" width="140" align="right">
        <template #default="{ row }">
          {{ productCountByGroup(row.id) }}
        </template>
      </CustomTableColumn>
      <CustomTableColumn prop="createdAt" label="Ngày tạo" width="140" />
      <CustomTableColumn label="Hành động" width="160" align="right" fixed="right">
        <template #default="{ row }">
          <CustomButton text type="primary" @click="openEdit(row)">Sửa</CustomButton>
          <CustomButton text type="danger" @click="confirmRemove(row)">Xoá</CustomButton>
        </template>
      </CustomTableColumn>
    </CustomTable>

    <el-dialog
      v-model="dialogOpen"
      :title="editingId ? 'Sửa nhóm sản phẩm' : 'Thêm nhóm sản phẩm'"
      width="480px"
      destroy-on-close
      @closed="resetForm"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
      >
        <el-form-item label="Tên nhóm" prop="name">
          <el-input v-model="form.name" placeholder="VD: Thời trang nam" />
        </el-form-item>
        <el-form-item label="Mô tả" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="Mô tả ngắn về nhóm sản phẩm"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <CustomButton @click="dialogOpen = false">Huỷ</CustomButton>
        <CustomButton type="primary" @click="submit">Lưu</CustomButton>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'
import { CustomButton, CustomIcon, CustomTable, CustomTableColumn } from '@/components/element'
import {
  createGroup,
  nhomSanPhamList,
  productCountByGroup,
  removeGroup,
  updateGroup,
} from './mockData'

const keyword = ref('')
const dialogOpen = ref(false)
const editingId = ref(null)
const formRef = ref()

const emptyForm = () => ({
  name: '',
  description: '',
})

const form = reactive(emptyForm())

const rules = {
  name: [{ required: true, message: 'Nhập tên nhóm', trigger: 'blur' }],
}

const filteredRows = computed(() => {
  const q = keyword.value.trim().toLowerCase()
  if (!q) return nhomSanPhamList.value
  return nhomSanPhamList.value.filter((row) => {
    return (
      row.name.toLowerCase().includes(q) ||
      row.description.toLowerCase().includes(q)
    )
  })
})

function assignForm(payload) {
  Object.assign(form, emptyForm(), payload)
}

function resetForm() {
  editingId.value = null
  assignForm(emptyForm())
  formRef.value?.resetFields()
}

function openCreate() {
  resetForm()
  dialogOpen.value = true
}

function openEdit(row) {
  editingId.value = row.id
  assignForm({
    name: row.name,
    description: row.description,
  })
  dialogOpen.value = true
}

async function submit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  const payload = {
    name: form.name.trim(),
    description: form.description.trim(),
  }

  if (editingId.value) {
    updateGroup(editingId.value, payload)
    ElMessage.success('Đã cập nhật nhóm sản phẩm')
  } else {
    createGroup(payload)
    ElMessage.success('Đã thêm nhóm sản phẩm')
  }

  dialogOpen.value = false
}

async function confirmRemove(row) {
  const count = productCountByGroup(row.id)
  const extra = count
    ? ` Nhóm đang có ${count} sản phẩm (sản phẩm vẫn giữ nguyên).`
    : ''

  try {
    await ElMessageBox.confirm(
      `Xoá nhóm “${row.name}”?${extra} Thao tác này chỉ giả lập trên giao diện.`,
      'Xác nhận xoá',
      {
        type: 'warning',
        confirmButtonText: 'Xoá',
        cancelButtonText: 'Huỷ',
      },
    )
    removeGroup(row.id)
    ElMessage.success('Đã xoá nhóm sản phẩm')
  } catch {
    // cancelled
  }
}
</script>

<style scoped lang="scss">
.tab-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.tab-toolbar__search {
  width: 280px;
  max-width: 100%;
}
</style>
