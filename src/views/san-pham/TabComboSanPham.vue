<template>
  <div class="tab-panel">
    <div class="tab-toolbar">
      <el-input
        v-model="keyword"
        placeholder="Tìm theo mã combo, tên hoặc sản phẩm..."
        clearable
        class="tab-toolbar__search"
      >
        <template #prefix>
          <CustomIcon><Search /></CustomIcon>
        </template>
      </el-input>

      <CustomButton type="primary" @click="openCreate">
        <CustomIcon class="el-icon--left"><Plus /></CustomIcon>
        Thêm combo
      </CustomButton>
    </div>

    <CustomTable :data="filteredRows" stripe empty-text="Không có combo sản phẩm">
      <CustomTableColumn label="Combo" min-width="220" fixed>
        <template #default="{ row }">
          <div class="product-cell">
            <span class="product-cell__thumb">C</span>
            <div class="product-cell__meta">
              <strong>{{ row.name }}</strong>
              <span>{{ row.sku }} · {{ comboItemDetails(row).length }} sản phẩm</span>
            </div>
          </div>
        </template>
      </CustomTableColumn>
      <CustomTableColumn label="Sản phẩm trong combo" min-width="260">
        <template #default="{ row }">
          <div class="combo-tags">
            <CustomTag
              v-for="item in comboItemDetails(row)"
              :key="item.productId"
              size="small"
              type="info"
            >
              {{ item.name }} ×{{ item.qty }}
            </CustomTag>
          </div>
        </template>
      </CustomTableColumn>
      <CustomTableColumn label="Giá lẻ" width="128" align="right">
        <template #default="{ row }">
          <span class="retail-price">{{ formatVnd(comboRetailPrice(row)) }}</span>
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
      <CustomTableColumn label="Lợi nhuận / combo" width="150" align="right">
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
      <CustomTableColumn label="Tồn kho" width="90" align="right">
        <template #default="{ row }">
          {{ comboStockFromItems(row) }}
        </template>
      </CustomTableColumn>
      <CustomTableColumn prop="sold" label="Đã bán" width="90" align="right" />
      <CustomTableColumn label="Ngày tạo" width="120">
        <template #default="{ row }">
          {{ formatDate(row.importedAt) }}
        </template>
      </CustomTableColumn>
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
      :title="editingId ? 'Sửa combo sản phẩm' : 'Thêm combo sản phẩm'"
      width="760px"
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
            <el-form-item label="Mã combo" prop="sku">
              <el-input v-model="form.sku" placeholder="VD: CB-005" />
            </el-form-item>
          </CustomCol>
          <CustomCol :xs="24" :sm="12">
            <el-form-item label="Tên combo" prop="name">
              <el-input v-model="form.name" placeholder="VD: Combo son môi + chuốt mi" />
            </el-form-item>
          </CustomCol>
          <CustomCol :span="24">
            <el-form-item label="Sản phẩm trong combo" prop="items">
              <div class="combo-builder">
                <el-select
                  v-model="addProductId"
                  filterable
                  clearable
                  placeholder="Chọn sản phẩm để thêm vào combo"
                  style="width: 100%"
                  @change="addItem"
                >
                  <el-option
                    v-for="item in productSelectOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>

                <CustomTable
                  v-if="form.items.length"
                  :data="form.items"
                  stripe
                  size="small"
                  class="combo-builder__table"
                  empty-text="Chưa có sản phẩm"
                >
                  <CustomTableColumn label="Sản phẩm" min-width="220">
                    <template #default="{ row }">
                      <div class="item-name">
                        <strong>{{ productById(row.productId)?.name || 'Sản phẩm đã xoá' }}</strong>
                        <span>{{ productById(row.productId)?.sku || '—' }}</span>
                      </div>
                    </template>
                  </CustomTableColumn>
                  <CustomTableColumn label="Số lượng" width="140">
                    <template #default="{ row }">
                      <el-input-number
                        v-model="row.qty"
                        :min="1"
                        :step="1"
                        controls-position="right"
                        style="width: 100%"
                      />
                    </template>
                  </CustomTableColumn>
                  <CustomTableColumn label="" width="70" align="right">
                    <template #default="{ $index }">
                      <CustomButton text type="danger" @click="removeItem($index)">
                        Xoá
                      </CustomButton>
                    </template>
                  </CustomTableColumn>
                </CustomTable>
              </div>
            </el-form-item>
          </CustomCol>
          <CustomCol :xs="24" :sm="12">
            <el-form-item label="Giá bán combo (VNĐ)" prop="price">
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
            <el-form-item label="Ngày tạo" prop="importedAt">
              <CustomDatePicker
                v-model="form.importedAt"
                type="date"
                placeholder="Chọn ngày"
                format="DD/MM/YYYY"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </CustomCol>
          <CustomCol :xs="24" :sm="12">
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
          <CustomCol :span="24">
            <div class="form-preview">
              <div>
                <span>Giá lẻ các SP</span>
                <strong>{{ formatVnd(previewRetail) }}</strong>
              </div>
              <div>
                <span>Tồn kho combo</span>
                <strong>{{ previewStock }}</strong>
              </div>
              <div>
                <span>Lợi nhuận ước tính</span>
                <strong :class="{ 'is-negative': previewProfit < 0 }">
                  {{ formatVnd(previewProfit) }}
                </strong>
                <em>{{ formatPercent(previewMargin) }} biên LN · phí sàn {{ formatVnd(previewFee) }}</em>
              </div>
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
import { computed, nextTick, reactive, ref, watch } from 'vue'
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
  comboCostFromItems,
  comboItemDetails,
  comboList,
  comboRetailPrice,
  comboStockFromItems,
  createCombo,
  formatDate,
  formatPercent,
  formatVnd,
  nextComboSku,
  platformFeeAmount,
  productById,
  productSelectOptions,
  productStatusOptions,
  profitMargin,
  removeCombo,
  statusMeta,
  todayIso,
  unitProfit,
  updateCombo,
} from './mockData'

const keyword = ref('')
const dialogOpen = ref(false)
const editingId = ref(null)
const formRef = ref()
const addProductId = ref(null)
const skipCostSync = ref(false)

const emptyForm = () => ({
  sku: '',
  name: '',
  items: [],
  price: 0,
  costPrice: 0,
  platformFeeRate: 6,
  sold: 0,
  importedAt: todayIso(),
  status: 'active',
})

const form = reactive(emptyForm())

const rules = {
  sku: [{ required: true, message: 'Nhập mã combo', trigger: 'blur' }],
  name: [{ required: true, message: 'Nhập tên combo', trigger: 'blur' }],
  items: [
    {
      type: 'array',
      min: 2,
      required: true,
      message: 'Combo cần ít nhất 2 sản phẩm',
      trigger: 'change',
    },
  ],
  price: [{ required: true, message: 'Nhập giá bán combo', trigger: 'change' }],
  costPrice: [{ required: true, message: 'Nhập giá vốn', trigger: 'change' }],
  platformFeeRate: [{ required: true, message: 'Nhập phí sàn', trigger: 'change' }],
  importedAt: [{ required: true, message: 'Chọn ngày tạo', trigger: 'change' }],
  sold: [{ required: true, message: 'Nhập số đã bán', trigger: 'change' }],
  status: [{ required: true, message: 'Chọn trạng thái', trigger: 'change' }],
}

const previewFee = computed(() => platformFeeAmount(form))
const previewProfit = computed(() => unitProfit(form))
const previewMargin = computed(() => profitMargin(form))
const previewRetail = computed(() => comboRetailPrice(form))
const previewStock = computed(() => comboStockFromItems(form))

watch(
  () => form.items.map((item) => `${item.productId}:${item.qty}`).join('|'),
  () => {
    if (skipCostSync.value) return
    form.costPrice = comboCostFromItems(form)
  },
)

const filteredRows = computed(() => {
  const q = keyword.value.trim().toLowerCase()
  if (!q) return comboList.value
  return comboList.value.filter((row) => {
    const itemText = comboItemDetails(row)
      .map((item) => `${item.name} ${item.sku}`)
      .join(' ')
      .toLowerCase()
    return (
      row.name.toLowerCase().includes(q) ||
      row.sku.toLowerCase().includes(q) ||
      itemText.includes(q)
    )
  })
})

function assignForm(payload) {
  skipCostSync.value = true
  Object.assign(form, emptyForm(), payload)
  nextTick(() => {
    skipCostSync.value = false
  })
}

function resetForm() {
  editingId.value = null
  addProductId.value = null
  assignForm(emptyForm())
  formRef.value?.resetFields()
}

function openCreate() {
  resetForm()
  form.sku = nextComboSku()
  dialogOpen.value = true
}

function openEdit(row) {
  editingId.value = row.id
  assignForm({
    sku: row.sku,
    name: row.name,
    items: row.items.map((item) => ({ ...item })),
    price: row.price,
    costPrice: row.costPrice,
    platformFeeRate: row.platformFeeRate,
    sold: row.sold,
    importedAt: row.importedAt,
    status: row.status,
  })
  dialogOpen.value = true
}

function addItem(productId) {
  if (!productId) return
  const existing = form.items.find((item) => item.productId === productId)
  if (existing) {
    existing.qty += 1
  } else {
    form.items.push({ productId, qty: 1 })
  }
  addProductId.value = null
}

function removeItem(index) {
  form.items.splice(index, 1)
}

async function submit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  const payload = {
    sku: form.sku.trim(),
    name: form.name.trim(),
    items: form.items.map((item) => ({
      productId: item.productId,
      qty: item.qty,
    })),
    price: form.price,
    costPrice: form.costPrice,
    platformFeeRate: form.platformFeeRate,
    sold: form.sold,
    importedAt: form.importedAt,
    status: form.status,
  }

  if (editingId.value) {
    updateCombo(editingId.value, payload)
    ElMessage.success('Đã cập nhật combo')
  } else {
    createCombo(payload)
    ElMessage.success('Đã thêm combo')
  }

  dialogOpen.value = false
}

async function confirmRemove(row) {
  try {
    await ElMessageBox.confirm(
      `Xoá combo “${row.name}”? Thao tác này chỉ giả lập trên giao diện.`,
      'Xác nhận xoá',
      {
        type: 'warning',
        confirmButtonText: 'Xoá',
        cancelButtonText: 'Huỷ',
      },
    )
    removeCombo(row.id)
    ElMessage.success('Đã xoá combo')
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

.combo-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.retail-price {
  color: var(--el-text-color-secondary);
  text-decoration: line-through;
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

.combo-builder {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.combo-builder__table {
  width: 100%;
}

.item-name {
  min-width: 0;

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

.form-preview {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  background: var(--el-fill-color-light);

  span {
    display: block;
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }

  strong {
    display: block;
    margin-top: 4px;
    font-size: 16px;

    &.is-negative {
      color: var(--el-color-danger);
    }
  }

  em {
    display: block;
    margin-top: 2px;
    font-style: normal;
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}
</style>
