export const adChannels = [
  { key: 'tiktok', label: 'TikTok' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'google', label: 'Google' },
  { key: 'shopee', label: 'Shopee' },
]

const WEEKDAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

export function startOfDay(date) {
  const next = new Date(date)
  next.setHours(0, 0, 0, 0)
  return next
}

export function endOfDay(date) {
  const next = new Date(date)
  next.setHours(23, 59, 59, 999)
  return next
}

export function toDayKey(date) {
  const d = new Date(date)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function eachDayKeys(start, end) {
  const days = []
  const cursor = startOfDay(start)
  const last = startOfDay(end)
  while (cursor.getTime() <= last.getTime()) {
    days.push(toDayKey(cursor))
    cursor.setDate(cursor.getDate() + 1)
  }
  return days
}

function seedFromKey(iso) {
  let hash = 2166136261
  for (let i = 0; i < iso.length; i += 1) {
    hash ^= iso.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function dayRng(iso) {
  let state = seedFromKey(iso)
  return (min, max) => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    const unit = state / 0xffffffff
    return min + unit * (max - min)
  }
}

function roundTo(value, step = 1000) {
  return Math.round(value / step) * step
}

export function metricsForDay(iso) {
  const date = new Date(`${iso}T00:00:00`)
  const weekend = date.getDay() === 0 || date.getDay() === 6
  const factor = weekend ? 0.62 : 1
  const rand = dayRng(iso)

  const cost = {
    tiktok: roundTo((180_000 + rand(0, 420_000)) * factor),
    facebook: roundTo((150_000 + rand(0, 360_000)) * factor),
    google: roundTo((90_000 + rand(0, 220_000)) * factor),
    shopee: roundTo((70_000 + rand(0, 180_000)) * factor),
  }
  cost.total = cost.tiktok + cost.facebook + cost.google + cost.shopee

  const inbox = {
    tiktok: Math.round((18 + rand(0, 42)) * factor),
    facebook: Math.round((14 + rand(0, 36)) * factor),
    google: Math.round((6 + rand(0, 18)) * factor),
    shopee: Math.round((10 + rand(0, 28)) * factor),
  }
  inbox.total = inbox.tiktok + inbox.facebook + inbox.google + inbox.shopee

  const customers = {
    tiktok: Math.min(inbox.tiktok, Math.round(inbox.tiktok * (0.22 + rand(0, 0.28)))),
    facebook: Math.min(inbox.facebook, Math.round(inbox.facebook * (0.2 + rand(0, 0.26)))),
    google: Math.min(inbox.google, Math.round(inbox.google * (0.18 + rand(0, 0.24)))),
    shopee: Math.min(inbox.shopee, Math.round(inbox.shopee * (0.24 + rand(0, 0.3)))),
  }
  customers.total = customers.tiktok + customers.facebook + customers.google + customers.shopee

  const orders = Math.min(customers.total, Math.round(customers.total * (0.55 + rand(0, 0.3))))
  const aov = 160_000 + rand(0, 90_000)
  const revenue = roundTo(orders * aov)
  const cpa = customers.total ? Math.round(cost.total / customers.total) : 0
  const roas = cost.total ? revenue / cost.total : 0
  const conversion = inbox.total ? (customers.total / inbox.total) * 100 : 0

  return {
    date: iso,
    weekday: WEEKDAYS[date.getDay()],
    cost,
    inbox,
    customers,
    orders,
    revenue,
    cpa,
    roas,
    conversion,
  }
}

export function adsRowsForRange(start, end) {
  if (!start || !end) return []
  return eachDayKeys(start, end).map((iso) => metricsForDay(iso)).reverse()
}

export function sumAdsRows(rows) {
  const emptyChannel = { total: 0, tiktok: 0, facebook: 0, google: 0, shopee: 0 }
  const acc = {
    cost: { ...emptyChannel },
    inbox: { ...emptyChannel },
    customers: { ...emptyChannel },
    orders: 0,
    revenue: 0,
  }

  for (const row of rows) {
    for (const key of Object.keys(emptyChannel)) {
      acc.cost[key] += row.cost[key]
      acc.inbox[key] += row.inbox[key]
      acc.customers[key] += row.customers[key]
    }
    acc.orders += row.orders
    acc.revenue += row.revenue
  }

  acc.cpa = acc.customers.total ? Math.round(acc.cost.total / acc.customers.total) : 0
  acc.roas = acc.cost.total ? acc.revenue / acc.cost.total : 0
  acc.conversion = acc.inbox.total ? (acc.customers.total / acc.inbox.total) * 100 : 0
  return acc
}

export function formatDayTitle(iso) {
  const date = new Date(`${iso}T00:00:00`)
  return date.toLocaleDateString('vi-VN')
}

export function formatRoas(value) {
  return `${Number(value || 0).toFixed(2)}x`
}

export function formatCount(value) {
  return new Intl.NumberFormat('vi-VN').format(value || 0)
}
