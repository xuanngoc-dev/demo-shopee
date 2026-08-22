<template>
  <div class="tab-panel">
    <div class="tab-toolbar">
      <el-input
        v-model="keyword"
        placeholder="Tìm theo tên, SKU hoặc nhà cung cấp..."
        clearable
        class="tab-toolbar__search"
      >
        <template #prefix>
          <CustomIcon><Search /></CustomIcon>
        </template>
      </el-input>

      <CustomButton type="primary" @click="openCreate">
        <CustomIcon class="el-icon--left"><Plus /></CustomIcon>
        Thêm sản phẩm
      </CustomButton>
    </div>

    <CustomTable :data="filteredRows" stripe empty-text="Không có sản phẩm">
      <CustomTableColumn label="Sản phẩm" min-width="240" fixed>
        <template #default="{ row }">
          <div class="product-cell">
            <span class="product-cell__thumb">{{ row.name.charAt(0) }}</span>
            <div class="product-cell__meta">
              <strong>{{ row.name }}</strong>
              <span>{{ row.sku }} · {{ row.unit }}</span>
            </div>
          </div>
        </template>
      </CustomTableColumn>
      <CustomTableColumn label="Nhóm" min-width="130" show-overflow-tooltip>
        <template #default="{ row }">
          {{ groupNameById(row.groupId) }}
        </template>
      </CustomTableColumn>
      <CustomTableColumn label="Giá bán" width="128" align="right">
        <template #default="{ row }">
          {{ formatVnd(row.price) }}
        </template>
      </CustomTableColumn>
      <CustomTableColumn label="Giá vốn" width="128" align="right">
        <template #default="{ row }">
          {{ formatVnd(row.costPrice) }}
        </template>
      </CustomTableColumn>
      <CustomTableColumn label="Phí sàn" width="128" align="right">
        <template #default="{ row }">
          <div class="metric-cell">
            <strong>{{ formatVnd(platformFeeAmount(row)) }}</strong>
            <span>{{ formatPercent(row.platformFeeRate) }}</span>
          </div>
        </template>
      </CustomTableColumn>
      <CustomTableColumn label="Lợi nhuận / SP" width="140" align="right">
        <template #default="{ row }">
          <div
            class="metric-cell"
            :class="{ 'is-negative': unitProfit(row) < 0 }"
          >
            <strong>{{ formatVnd(unitProfit(row)) }}</strong>
            <span>{{ formatPercent(profitMargin(row)) }}</span>
          </div>
        </template>
      </CustomTableColumn>
      <CustomTableColumn label="Tồn kho" width="110" align="right">
        <template #default="{ row }">
          <div class="metric-cell">
            <strong>{{ row.stock }}</strong>
            <span>{{ formatVnd(stockValue(row)) }}</span>
          </div>
        </template>
      </CustomTableColumn>
      <CustomTableColumn prop="sold" label="Đã bán" width="90" align="right" />
      <CustomTableColumn label="Ngày nhập" width="120">
        <template #default="{ row }">
          {{ formatDate(row.importedAt) }}
        </template>
      </CustomTableColumn>
      <CustomTableColumn
        prop="supplier"
        label="Nhà cung cấp"
        min-width="150"
        show-overflow-tooltip
      />
      <CustomTableColumn label="Trạng thái" width="120">
        <template #default="{ row }">
          <CustomTag :type="statusMeta(row.status).tag" size="small">
            {{ statusMeta(row.status).label }}
          </CustomTag>
        </template>
      </CustomTableColumn>
      <CustomTableColumn label="Hành động" width="150" align="right" fixed="right">
        <template #default="{ row }">
          <CustomButton text type="primary" @click="openEdit(row)">Sửa</CustomButton>
          <CustomButton text type="danger" @click="confirmRemove(row)">Xoá</CustomButton>
        </template>
      </CustomTableColumn>
    </CustomTable>

    <el-dialog
      v-model="dialogOpen"
      :title="editingId ? 'Sửa sản phẩm' : 'Thêm sản phẩm'"
      width="720px"
      destroy-on-close
      @closed="resetForm"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
      >
        <CustomRow :gutter="16">
          <CustomCol :xs="24" :sm="12">
            <el-form-item label="SKU" prop="sku">
              <el-input v-model="form.sku" placeholder="VD: SP-009" />
            </el-form-item>
          </CustomCol>
          <CustomCol :xs="24" :sm="12">
            <el-form-item label="Tên sản phẩm" prop="name">
              <el-input v-model="form.name" placeholder="Nhập tên sản phẩm" />
            </el-form-item>
          </CustomCol>
          <CustomCol :xs="24" :sm="12">
            <el-form-item label="Nhóm sản phẩm" prop="groupId">
              <el-select
                v-model="form.groupId"
                placeholder="Chọn nhóm"
                style="width: 100%"
              >
                <el-option
                  v-for="item in groupOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </CustomCol>
          <CustomCol :xs="24" :sm="12">
            <el-form-item label="Nhà cung cấp" prop="supplier">
              <el-input v-model="form.supplier" placeholder="Tên nhà cung cấp" />
            </el-form-item>
          </CustomCol>
          <CustomCol :xs="24" :sm="12">
            <el-form-item label="Giá bán (VNĐ)" prop="price">
              <el-input-number
                v-model="form.price"
                :min="0"
                :step="1000"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>
          </CustomCol>
          <CustomCol :xs="24" :sm="12">
            <el-form-item label="Giá vốn (VNĐ)" prop="costPrice">
              <el-input-number
                v-model="form.costPrice"
                :min="0"
                :step="1000"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>
          </CustomCol>
          <CustomCol :xs="24" :sm="12">
            <el-form-item label="Phí sàn (%)" prop="platformFeeRate">
              <el-input-number
                v-model="form.platformFeeRate"
                :min="0"
                :max="100"
                :step="0.5"
                :precision="1"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>
          </CustomCol>
          <CustomCol :xs="24" :sm="12">
            <el-form-item label="Ngày nhập" prop="importedAt">
              <CustomDatePicker
                v-model="form.importedAt"
                type="date"
                placeholder="Chọn ngày nhập"
                format="DD/MM/YYYY"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </CustomCol>
          <CustomCol :xs="24" :sm="8">
            <el-form-item label="Tồn kho" prop="stock">
              <el-input-number
                v-model="form.stock"
                :min="0"
                :step="1"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>
          </CustomCol>
          <CustomCol :xs="24" :sm="8">
            <el-form-item label="Đã bán" prop="sold">
              <el-input-number
                v-model="form.sold"
                :min="0"
                :step="1"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>
          </CustomCol>
          <CustomCol :xs="24" :sm="8">
            <el-form-item label="Đơn vị" prop="unit">
              <el-select v-model="form.unit" style="width: 100%">
                <el-option
                  v-for="item in unitOptions"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </CustomCol>
          <CustomCol :xs="24" :sm="12">
            <el-form-item label="Trạng thái" prop="status">
              <el-select v-model="form.status" style="width: 100%">
                <el-option
                  v-for="item in productStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </CustomCol>
          <CustomCol :xs="24" :sm="12">
            <div class="form-preview">
              <span>Lợi nhuận ước tính</span>
              <strong :class="{ 'is-negative': previewProfit < 0 }">
                {{ formatVnd(previewProfit) }}
              </strong>
              <em>{{ formatPercent(previewMargin) }} biên LN · phí sàn {{ formatVnd(previewFee) }}</em>
            </div>
          </CustomCol>
        </CustomRow>
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
import {
  CustomButton,
  CustomCol,
  CustomDatePicker,
  CustomIcon,
  CustomRow,
  CustomTable,
  CustomTableColumn,
  CustomTag,
} from '@/components/element'
import {
  createProduct,
  formatDate,
  formatPercent,
  formatVnd,
  groupNameById,
  groupOptions,
  nextSku,
  platformFeeAmount,
  productStatusOptions,
  profitMargin,
  removeProduct,
  sanPhamList,
  statusMeta,
  stockValue,
  todayIso,
  unitOptions,
  unitProfit,
  updateProduct,
} from './mockData'

const keyword = ref('')
const dialogOpen = ref(false)
const editingId = ref(null)
const formRef = ref()

const emptyForm = () => ({
  sku: '',
  name: '',
  groupId: null,
  price: 0,
  costPrice: 0,
  platformFeeRate: 6,
  stock: 0,
  sold: 0,
  unit: 'cái',
  supplier: '',
  importedAt: todayIso(),
  status: 'active',
})

const form = reactive(emptyForm())

const rules = {
  sku: [{ required: true, message: 'Nhập SKU', trigger: 'blur' }],
  name: [{ required: true, message: 'Nhập tên sản phẩm', trigger: 'blur' }],
  groupId: [{ required: true, message: 'Chọn nhóm sản phẩm', trigger: 'change' }],
  price: [{ required: true, message: 'Nhập giá bán', trigger: 'change' }],
  costPrice: [{ required: true, message: 'Nhập giá vốn', trigger: 'change' }],
  platformFeeRate: [{ required: true, message: 'Nhập phí sàn', trigger: 'change' }],
  importedAt: [{ required: true, message: 'Chọn ngày nhập', trigger: 'change' }],
  stock: [{ required: true, message: 'Nhập tồn kho', trigger: 'change' }],
  sold: [{ required: true, message: 'Nhập số đã bán', trigger: 'change' }],
  unit: [{ required: true, message: 'Chọn đơn vị', trigger: 'change' }],
  status: [{ required: true, message: 'Chọn trạng thái', trigger: 'change' }],
}

const previewFee = computed(() => platformFeeAmount(form))
const previewProfit = computed(() => unitProfit(form))
const previewMargin = computed(() => profitMargin(form))

const filteredRows = computed(() => {
  const q = keyword.value.trim().toLowerCase()
  if (!q) return sanPhamList.value
  return sanPhamList.value.filter((row) => {
    const group = groupNameById(row.groupId).toLowerCase()
    return (
      row.name.toLowerCase().includes(q) ||
      row.sku.toLowerCase().includes(q) ||
      group.includes(q) ||
      String(row.supplier || '').toLowerCase().includes(q)
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
  form.sku = nextSku()
  dialogOpen.value = true
}

function openEdit(row) {
  editingId.value = row.id
  assignForm({
    sku: row.sku,
    name: row.name,
    groupId: row.groupId,
    price: row.price,
    costPrice: row.costPrice,
    platformFeeRate: row.platformFeeRate,
    stock: row.stock,
    sold: row.sold,
    unit: row.unit,
    supplier: row.supplier,
    importedAt: row.importedAt,
    status: row.status,
  })
  dialogOpen.value = true
}

async function submit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  const payload = {
    sku: form.sku.trim(),
    name: form.name.trim(),
    groupId: form.groupId,
    price: form.price,
    costPrice: form.costPrice,
    platformFeeRate: form.platformFeeRate,
    stock: form.stock,
    sold: form.sold,
    unit: form.unit,
    supplier: form.supplier.trim(),
    importedAt: form.importedAt,
    status: form.status,
  }

  if (editingId.value) {
    updateProduct(editingId.value, payload)
    ElMessage.success('Đã cập nhật sản phẩm')
  } else {
    createProduct(payload)
    ElMessage.success('Đã thêm sản phẩm')
  }

  dialogOpen.value = false
}

async function confirmRemove(row) {
  try {
    await ElMessageBox.confirm(
      `Xoá sản phẩm “${row.name}”? Thao tác này chỉ giả lập trên giao diện.`,
      'Xác nhận xoá',
      {
        type: 'warning',
        confirmButtonText: 'Xoá',
        cancelButtonText: 'Huỷ',
      },
    )
    removeProduct(row.id)
    ElMessage.success('Đã xoá sản phẩm')
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
  width: 320px;
  max-width: 100%;
}

.product-cell {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.product-cell__thumb {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  font-weight: 700;
}

.product-cell__meta {
  min-width: 0;

  strong {
    display: block;
    font-size: 14px;
    line-height: 1.3;
  }

  span {
    display: block;
    margin-top: 2px;
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
}

.metric-cell {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  color: var(--el-color-success);

  strong {
    font-weight: 600;
    font-size: 13px;
    line-height: 1.2;
  }

  span {
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }

  &.is-negative {
    color: var(--el-color-danger);
  }
}

.form-preview {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 72px;
  padding: 10px 12px;
  border-radius: 8px;
  background: var(--el-fill-color-light);

  span {
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }

  strong {
    margin-top: 4px;
    font-size: 18px;
    color: var(--el-color-success);

    &.is-negative {
      color: var(--el-color-danger);
    }
  }

  em {
    margin-top: 2px;
    font-style: normal;
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
}
</style>
