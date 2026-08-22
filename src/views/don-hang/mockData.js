import { comboList, platformFeeAmount, productById, sanPhamList } from '../san-pham/mockData'

export const orderStatusOptions = [
  { value: 'pending', label: 'Đang lên đơn', tag: 'warning' },
  { value: 'packing', label: 'Đang chuẩn bị', tag: 'info' },
  { value: 'shipping', label: 'Đang giao hàng', tag: '' },
  { value: 'success', label: 'Thành công', tag: 'success' },
  { value: 'cancelled', label: 'Huỷ', tag: 'danger' },
  { value: 'returned', label: 'Hoàn', tag: 'danger' },
]

export const paymentOptions = ['ShopeePay', 'COD', 'Thẻ tín dụng', 'Chuyển khoản']
export const carrierOptions = ['SPX Express', 'Giao Hàng Nhanh', 'J&T Express', 'Viettel Post']

export function orderStatusMeta(status) {
  return orderStatusOptions.find((item) => item.value === status) || {
    value: status,
    label: status,
    tag: 'info',
  }
}

export const donHangList = [
  {
    id: 'DH-10248',
    customer: 'Ngô Bảo Châu',
    phone: '0901 234 111',
    province: 'TP. Hồ Chí Minh',
    items: [{ comboId: 1, qty: 1 }],
    discount: 20000,
    shippingFee: 0,
    status: 'success',
    createdAt: '2026-08-21T09:18:00',
    receivedAt: '2026-08-22T16:40:00',
    payment: 'ShopeePay',
    carrier: 'SPX Express',
    note: 'Giao giờ hành chính',
  },
  {
    id: 'DH-10247',
    customer: 'Đặng Thanh Tùng',
    phone: '0912 888 221',
    province: 'Hà Nội',
    items: [
      { productId: 1, qty: 1 },
      { productId: 2, qty: 1 },
    ],
    discount: 15000,
    shippingFee: 25000,
    status: 'shipping',
    createdAt: '2026-08-21T14:02:00',
    receivedAt: null,
    payment: 'COD',
    carrier: 'Giao Hàng Nhanh',
    note: '',
  },
  {
    id: 'DH-10246',
    customer: 'Vũ Minh Ngọc',
    phone: '0987 654 300',
    province: 'Đà Nẵng',
    items: [
      { productId: 3, qty: 1 },
      { productId: 9, qty: 1 },
    ],
    discount: 18000,
    shippingFee: 0,
    status: 'success',
    createdAt: '2026-08-20T11:26:00',
    receivedAt: '2026-08-22T10:15:00',
    payment: 'Thẻ tín dụng',
    carrier: 'SPX Express',
    note: '',
  },
  {
    id: 'DH-10245',
    customer: 'Hoàng Thị Lan',
    phone: '0933 120 445',
    province: 'Cần Thơ',
    items: [
      { productId: 7, qty: 1 },
      { productId: 3, qty: 1 },
    ],
    discount: 25000,
    shippingFee: 18000,
    status: 'success',
    createdAt: '2026-08-19T19:44:00',
    receivedAt: '2026-08-21T15:08:00',
    payment: 'ShopeePay',
    carrier: 'J&T Express',
    note: 'Gọi trước khi giao',
  },
  {
    id: 'DH-10244',
    customer: 'Bùi Anh Khoa',
    phone: '0908 555 019',
    province: 'Hải Phòng',
    items: [{ productId: 5, qty: 1 }],
    discount: 40000,
    shippingFee: 0,
    status: 'packing',
    createdAt: '2026-08-19T08:12:00',
    receivedAt: null,
    payment: 'Chuyển khoản',
    carrier: 'Viettel Post',
    note: '',
  },
  {
    id: 'DH-10243',
    customer: 'Phan Thị Mai',
    phone: '0976 441 208',
    province: 'Bình Dương',
    items: [{ productId: 6, qty: 2 }],
    discount: 10000,
    shippingFee: 22000,
    status: 'pending',
    createdAt: '2026-08-18T21:05:00',
    receivedAt: null,
    payment: 'COD',
    carrier: 'SPX Express',
    note: '',
  },
  {
    id: 'DH-10242',
    customer: 'Lý Quốc Việt',
    phone: '0915 777 634',
    province: 'Hà Nội',
    items: [
      { productId: 1, qty: 1 },
      { productId: 8, qty: 1 },
    ],
    discount: 30000,
    shippingFee: 0,
    status: 'success',
    createdAt: '2026-08-18T10:40:00',
    receivedAt: '2026-08-20T13:22:00',
    payment: 'ShopeePay',
    carrier: 'SPX Express',
    note: '',
  },
  {
    id: 'DH-10241',
    customer: 'Nguyễn Minh Anh',
    phone: '0902 118 990',
    province: 'TP. Hồ Chí Minh',
    items: [{ productId: 2, qty: 1 }],
    discount: 0,
    shippingFee: 16000,
    status: 'pending',
    createdAt: '2026-08-17T16:33:00',
    receivedAt: null,
    payment: 'COD',
    carrier: 'SPX Express',
    note: 'Chờ shop xác nhận',
  },
  {
    id: 'DH-10240',
    customer: 'Trần Quốc Huy',
    phone: '0938 220 157',
    province: 'Đồng Nai',
    items: [{ productId: 5, qty: 1 }],
    discount: 50000,
    shippingFee: 0,
    status: 'shipping',
    createdAt: '2026-08-17T09:08:00',
    receivedAt: null,
    payment: 'Thẻ tín dụng',
    carrier: 'Giao Hàng Nhanh',
    note: '',
  },
  {
    id: 'DH-10239',
    customer: 'Trịnh Hà My',
    phone: '0981 009 442',
    province: 'Huế',
    items: [{ productId: 4, qty: 1 }],
    discount: 0,
    shippingFee: 30000,
    status: 'cancelled',
    createdAt: '2026-08-16T20:17:00',
    receivedAt: null,
    payment: 'COD',
    carrier: 'J&T Express',
    note: 'Khách huỷ vì đổi ý',
  },
  {
    id: 'DH-10238',
    customer: 'Lê Thu Hà',
    phone: '0906 334 218',
    province: 'Hà Nội',
    items: [{ productId: 3, qty: 1 }],
    discount: 10000,
    shippingFee: 0,
    status: 'success',
    createdAt: '2026-08-15T13:51:00',
    receivedAt: '2026-08-17T11:05:00',
    payment: 'ShopeePay',
    carrier: 'SPX Express',
    note: '',
  },
  {
    id: 'DH-10237',
    customer: 'Đỗ Văn Nam',
    phone: '0914 662 870',
    province: 'Nghệ An',
    items: [{ productId: 8, qty: 1 }],
    discount: 12000,
    shippingFee: 25000,
    status: 'returned',
    createdAt: '2026-08-14T18:29:00',
    receivedAt: '2026-08-16T09:40:00',
    payment: 'COD',
    carrier: 'Viettel Post',
    note: 'Hoàn vì sai size',
  },
  {
    id: 'DH-10236',
    customer: 'Mai Phương Thảo',
    phone: '0972 145 663',
    province: 'TP. Hồ Chí Minh',
    items: [
      { productId: 3, qty: 1 },
      { productId: 9, qty: 1 },
      { productId: 7, qty: 1 },
    ],
    discount: 35000,
    shippingFee: 0,
    status: 'success',
    createdAt: '2026-08-13T15:14:00',
    receivedAt: '2026-08-15T17:30:00',
    payment: 'Thẻ tín dụng',
    carrier: 'SPX Express',
    note: '',
  },
  {
    id: 'DH-10235',
    customer: 'Phạm Văn Đức',
    phone: '0903 778 541',
    province: 'Bắc Ninh',
    items: [
      { productId: 1, qty: 1 },
      { productId: 2, qty: 1 },
    ],
    discount: 20000,
    shippingFee: 18000,
    status: 'returned',
    createdAt: '2026-08-12T12:07:00',
    receivedAt: '2026-08-14T10:18:00',
    payment: 'COD',
    carrier: 'Giao Hàng Nhanh',
    note: 'Khách hoàn một phần',
  },
  {
    id: 'DH-10234',
    customer: 'Nguyễn Thị Hạnh',
    phone: '0945 210 887',
    province: 'Hà Nội',
    items: [
      { productId: 1, qty: 2 },
      { productId: 2, qty: 1 },
    ],
    discount: 25000,
    shippingFee: 0,
    status: 'success',
    createdAt: '2026-08-11T08:55:00',
    receivedAt: '2026-08-13T14:12:00',
    payment: 'ShopeePay',
    carrier: 'SPX Express',
    note: '',
  },
  {
    id: 'DH-10233',
    customer: 'Trần Gia Bảo',
    phone: '0922 336 109',
    province: 'Khánh Hòa',
    items: [{ comboId: 2, qty: 1 }],
    discount: 18000,
    shippingFee: 22000,
    status: 'shipping',
    createdAt: '2026-08-10T17:21:00',
    receivedAt: null,
    payment: 'Chuyển khoản',
    carrier: 'J&T Express',
    note: '',
  },
  {
    id: 'DH-10232',
    customer: 'Lê Minh Khang',
    phone: '0968 441 225',
    province: 'TP. Hồ Chí Minh',
    items: [
      { productId: 3, qty: 1 },
      { productId: 9, qty: 1 },
    ],
    discount: 15000,
    shippingFee: 0,
    status: 'success',
    createdAt: '2026-08-08T10:03:00',
    receivedAt: '2026-08-10T16:47:00',
    payment: 'ShopeePay',
    carrier: 'SPX Express',
    note: '',
  },
  {
    id: 'DH-10231',
    customer: 'Phạm Quỳnh Anh',
    phone: '0936 552 814',
    province: 'Hà Nội',
    items: [{ comboId: 4, qty: 1 }],
    discount: 22000,
    shippingFee: 0,
    status: 'packing',
    createdAt: '2026-08-07T19:38:00',
    receivedAt: null,
    payment: 'Thẻ tín dụng',
    carrier: 'SPX Express',
    note: 'Combo chống nắng + son',
  },
]

function comboById(id) {
  return comboList.value.find((item) => item.id === id)
}

export function resolveOrderLines(order) {
  return (order.items || []).map((item) => {
    if (item.comboId) {
      const combo = comboById(item.comboId)
      return {
        type: 'combo',
        comboId: item.comboId,
        productId: null,
        name: combo?.name || 'Combo đã xoá',
        sku: combo?.sku || '—',
        qty: item.qty || 1,
        price: combo?.price || 0,
        costPrice: combo?.costPrice || 0,
        platformFeeRate: combo?.platformFeeRate || 0,
      }
    }

    const product = productById(item.productId)
    return {
      type: 'product',
      comboId: null,
      productId: item.productId,
      name: product?.name || 'Sản phẩm đã xoá',
      sku: product?.sku || '—',
      qty: item.qty || 1,
      price: product?.price || 0,
      costPrice: product?.costPrice || 0,
      platformFeeRate: product?.platformFeeRate || 0,
    }
  })
}

export function orderTotals(order) {
  const lines = resolveOrderLines(order)
  const price = lines.reduce((sum, line) => sum + line.price * line.qty, 0)
  const cost = lines.reduce((sum, line) => sum + line.costPrice * line.qty, 0)
  const fee = lines.reduce((sum, line) => sum + platformFeeAmount(line) * line.qty, 0)
  const discount = Number(order.discount) || 0
  const shippingFee = Number(order.shippingFee) || 0
  const profit = price - cost - fee - discount
  return { price, cost, fee, discount, shippingFee, profit, itemCount: lines.length }
}

export function expandOrderProductIds(order) {
  const ids = []
  for (const item of order.items || []) {
    if (item.comboId) {
      const combo = comboById(item.comboId)
      for (const comboItem of combo?.items || []) ids.push(comboItem.productId)
    } else if (item.productId) {
      ids.push(item.productId)
    }
  }
  return [...new Set(ids)]
}

export function frequentlyBoughtTogether(orders = donHangList) {
  const relevant = orders.filter((order) =>
    ['success', 'shipping', 'packing'].includes(order.status),
  )

  const originCount = {}
  const pairCount = {}

  for (const order of relevant) {
    const ids = expandOrderProductIds(order)
    for (const id of ids) originCount[id] = (originCount[id] || 0) + 1
    if (ids.length < 2) continue
    for (const originId of ids) {
      for (const companionId of ids) {
        if (originId === companionId) continue
        const key = `${originId}|${companionId}`
        pairCount[key] = (pairCount[key] || 0) + 1
      }
    }
  }

  return Object.entries(pairCount)
    .map(([key, together]) => {
      const [originId, companionId] = key.split('|').map(Number)
      const origin = productById(originId) || sanPhamList.value.find((item) => item.id === originId)
      const companion = productById(companionId)
      const originTotal = originCount[originId] || 0
      return {
        originId,
        companionId,
        originName: origin?.name || '—',
        originSku: origin?.sku || '—',
        companionName: companion?.name || '—',
        companionSku: companion?.sku || '—',
        together,
        originTotal,
        percent: originTotal ? (together / originTotal) * 100 : 0,
      }
    })
    .sort((a, b) => b.together - a.together || b.percent - a.percent)
}

export function dateKey(value) {
  if (!value) return ''
  return String(value).slice(0, 10)
}

export function inDateRange(value, range) {
  if (!range?.length) return true
  if (!value) return false
  const key = dateKey(value)
  return key >= range[0] && key <= range[1]
}

export function formatDateTime(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}
