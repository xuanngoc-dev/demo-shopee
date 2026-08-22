import { computed, ref } from 'vue'

let nextProductId = 10
let nextGroupId = 6
let nextComboId = 5

export const nhomSanPhamList = ref([
  {
    id: 1,
    name: 'Thời trang nam',
    description: 'Áo, quần và phụ kiện nam',
    createdAt: '12/01/2026',
  },
  {
    id: 2,
    name: 'Mỹ phẩm',
    description: 'Chăm sóc da và trang điểm',
    createdAt: '05/02/2026',
  },
  {
    id: 3,
    name: 'Điện tử',
    description: 'Thiết bị và phụ kiện điện tử',
    createdAt: '18/03/2026',
  },
  {
    id: 4,
    name: 'Gia dụng',
    description: 'Đồ dùng nhà bếp và sinh hoạt',
    createdAt: '02/04/2026',
  },
  {
    id: 5,
    name: 'Mẹ & bé',
    description: 'Sản phẩm chăm sóc mẹ và bé',
    createdAt: '21/05/2026',
  },
])

export const unitOptions = ['cái', 'bộ', 'hộp', 'chai', 'cây', 'bịch']

export const sanPhamList = ref([
  {
    id: 1,
    sku: 'SP-001',
    name: 'Áo thun basic trắng',
    groupId: 1,
    price: 99000,
    costPrice: 42000,
    platformFeeRate: 5.5,
    stock: 120,
    sold: 86,
    unit: 'cái',
    supplier: 'Xưởng May An Phú',
    importedAt: '2026-01-12',
    status: 'active',
  },
  {
    id: 2,
    sku: 'SP-002',
    name: 'Quần jean slim fit',
    groupId: 1,
    price: 259000,
    costPrice: 145000,
    platformFeeRate: 5.5,
    stock: 45,
    sold: 32,
    unit: 'cái',
    supplier: 'Denim House',
    importedAt: '2026-02-03',
    status: 'active',
  },
  {
    id: 3,
    sku: 'SP-003',
    name: 'Son môi Velvet Matte',
    groupId: 2,
    price: 189000,
    costPrice: 78000,
    platformFeeRate: 7,
    stock: 8,
    sold: 54,
    unit: 'cây',
    supplier: 'Cosmetics VN',
    importedAt: '2026-03-15',
    status: 'active',
  },
  {
    id: 4,
    sku: 'SP-004',
    name: 'Tai nghe Bluetooth TWS',
    groupId: 3,
    price: 349000,
    costPrice: 210000,
    platformFeeRate: 4,
    stock: 0,
    sold: 18,
    unit: 'bộ',
    supplier: 'Tech Import',
    importedAt: '2026-04-02',
    status: 'out',
  },
  {
    id: 5,
    sku: 'SP-005',
    name: 'Nồi chiên không dầu 5L',
    groupId: 4,
    price: 890000,
    costPrice: 520000,
    platformFeeRate: 3.5,
    stock: 22,
    sold: 9,
    unit: 'cái',
    supplier: 'Gia Dụng Minh Tâm',
    importedAt: '2026-04-20',
    status: 'active',
  },
  {
    id: 6,
    sku: 'SP-006',
    name: 'Bỉm dán size M (72 miếng)',
    groupId: 5,
    price: 265000,
    costPrice: 198000,
    platformFeeRate: 6,
    stock: 60,
    sold: 41,
    unit: 'bịch',
    supplier: 'Unicharm Dist',
    importedAt: '2026-05-08',
    status: 'active',
  },
  {
    id: 7,
    sku: 'SP-007',
    name: 'Kem chống nắng SPF50+',
    groupId: 2,
    price: 175000,
    costPrice: 92000,
    platformFeeRate: 7,
    stock: 3,
    sold: 12,
    unit: 'chai',
    supplier: 'Cosmetics VN',
    importedAt: '2026-06-01',
    status: 'hidden',
  },
  {
    id: 8,
    sku: 'SP-008',
    name: 'Áo khoác gió chống nước',
    groupId: 1,
    price: 319000,
    costPrice: 168000,
    platformFeeRate: 5.5,
    stock: 18,
    sold: 7,
    unit: 'cái',
    supplier: 'Xưởng May An Phú',
    importedAt: '2026-06-18',
    status: 'active',
  },
  {
    id: 9,
    sku: 'SP-009',
    name: 'Chuốt mi Volume Lash',
    groupId: 2,
    price: 159000,
    costPrice: 68000,
    platformFeeRate: 7,
    stock: 35,
    sold: 28,
    unit: 'cây',
    supplier: 'Cosmetics VN',
    importedAt: '2026-03-20',
    status: 'active',
  },
])

export const comboList = ref([
  {
    id: 1,
    sku: 'CB-001',
    name: 'Combo son môi + chuốt mi',
    items: [
      { productId: 3, qty: 1 },
      { productId: 9, qty: 1 },
    ],
    price: 299000,
    costPrice: 146000,
    platformFeeRate: 7,
    sold: 24,
    importedAt: '2026-03-22',
    status: 'active',
  },
  {
    id: 2,
    sku: 'CB-002',
    name: 'Combo áo thun + quần jean',
    items: [
      { productId: 1, qty: 1 },
      { productId: 2, qty: 1 },
    ],
    price: 329000,
    costPrice: 187000,
    platformFeeRate: 5.5,
    sold: 15,
    importedAt: '2026-02-10',
    status: 'active',
  },
  {
    id: 3,
    sku: 'CB-003',
    name: 'Combo áo thun + áo khoác gió',
    items: [
      { productId: 1, qty: 1 },
      { productId: 8, qty: 1 },
    ],
    price: 379000,
    costPrice: 210000,
    platformFeeRate: 5.5,
    sold: 8,
    importedAt: '2026-06-20',
    status: 'active',
  },
  {
    id: 4,
    sku: 'CB-004',
    name: 'Combo chống nắng + son môi',
    items: [
      { productId: 7, qty: 1 },
      { productId: 3, qty: 1 },
    ],
    price: 329000,
    costPrice: 170000,
    platformFeeRate: 7,
    sold: 5,
    importedAt: '2026-06-05',
    status: 'hidden',
  },
])

export const productStatusOptions = [
  { value: 'active', label: 'Đang bán', tag: 'success' },
  { value: 'hidden', label: 'Tạm ẩn', tag: 'info' },
  { value: 'out', label: 'Hết hàng', tag: 'danger' },
]

export function statusMeta(status) {
  return productStatusOptions.find((item) => item.value === status) || {
    value: status,
    label: status,
    tag: 'info',
  }
}

export function groupNameById(groupId) {
  return nhomSanPhamList.value.find((item) => item.id === groupId)?.name || '—'
}

export function productCountByGroup(groupId) {
  return sanPhamList.value.filter((item) => item.groupId === groupId).length
}

export const groupOptions = computed(() =>
  nhomSanPhamList.value.map((item) => ({
    value: item.id,
    label: item.name,
  })),
)

export function nextSku() {
  const max = sanPhamList.value.reduce((acc, item) => {
    const num = Number(String(item.sku).replace(/\D/g, ''))
    return Number.isFinite(num) ? Math.max(acc, num) : acc
  }, 0)
  return `SP-${String(max + 1).padStart(3, '0')}`
}

export function createProduct(payload) {
  const item = { id: nextProductId++, ...payload }
  sanPhamList.value.unshift(item)
  return item
}

export function updateProduct(id, payload) {
  const index = sanPhamList.value.findIndex((item) => item.id === id)
  if (index === -1) return
  sanPhamList.value[index] = { ...sanPhamList.value[index], ...payload }
}

export function removeProduct(id) {
  sanPhamList.value = sanPhamList.value.filter((item) => item.id !== id)
}

export const productSelectOptions = computed(() =>
  sanPhamList.value.map((item) => ({
    value: item.id,
    label: `${item.sku} — ${item.name}`,
  })),
)

export function productById(id) {
  return sanPhamList.value.find((item) => item.id === id)
}

export function comboItemDetails(combo) {
  return (combo.items || []).map((item) => {
    const product = productById(item.productId)
    return {
      productId: item.productId,
      qty: Number(item.qty) || 1,
      product,
      name: product?.name || 'Sản phẩm đã xoá',
      sku: product?.sku || '—',
    }
  })
}

export function comboCostFromItems(combo) {
  return comboItemDetails(combo).reduce((sum, item) => {
    return sum + (Number(item.product?.costPrice) || 0) * item.qty
  }, 0)
}

export function comboRetailPrice(combo) {
  return comboItemDetails(combo).reduce((sum, item) => {
    return sum + (Number(item.product?.price) || 0) * item.qty
  }, 0)
}

export function comboStockFromItems(combo) {
  const details = comboItemDetails(combo)
  if (!details.length) return 0
  return Math.min(
    ...details.map((item) => {
      const stock = Number(item.product?.stock) || 0
      return Math.floor(stock / item.qty)
    }),
  )
}

export function nextComboSku() {
  const max = comboList.value.reduce((acc, item) => {
    const num = Number(String(item.sku).replace(/\D/g, ''))
    return Number.isFinite(num) ? Math.max(acc, num) : acc
  }, 0)
  return `CB-${String(max + 1).padStart(3, '0')}`
}

export function createCombo(payload) {
  const item = { id: nextComboId++, ...payload }
  comboList.value.unshift(item)
  return item
}

export function updateCombo(id, payload) {
  const index = comboList.value.findIndex((item) => item.id === id)
  if (index === -1) return
  comboList.value[index] = { ...comboList.value[index], ...payload }
}

export function removeCombo(id) {
  comboList.value = comboList.value.filter((item) => item.id !== id)
}

export function createGroup(payload) {
  const now = new Date()
  const item = {
    id: nextGroupId++,
    createdAt: now.toLocaleDateString('vi-VN'),
    ...payload,
  }
  nhomSanPhamList.value.unshift(item)
  return item
}

export function updateGroup(id, payload) {
  const index = nhomSanPhamList.value.findIndex((item) => item.id === id)
  if (index === -1) return
  nhomSanPhamList.value[index] = { ...nhomSanPhamList.value[index], ...payload }
}

export function removeGroup(id) {
  nhomSanPhamList.value = nhomSanPhamList.value.filter((item) => item.id !== id)
}

export function formatVnd(value) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value || 0)
}

export function formatDate(value) {
  if (!value) return '—'
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('vi-VN')
}

export function formatPercent(value) {
  return `${Number(value || 0).toFixed(1)}%`
}

export function platformFeeAmount(row) {
  return Math.round((Number(row.price) || 0) * (Number(row.platformFeeRate) || 0) / 100)
}

export function unitProfit(row) {
  return (Number(row.price) || 0) - (Number(row.costPrice) || 0) - platformFeeAmount(row)
}

export function profitMargin(row) {
  const price = Number(row.price) || 0
  if (!price) return 0
  return (unitProfit(row) / price) * 100
}

export function stockValue(row) {
  return (Number(row.stock) || 0) * (Number(row.costPrice) || 0)
}

export function todayIso() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
