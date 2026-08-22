import { createRouter, createWebHistory } from 'vue-router'

const placeholder = () => import('@/components/PagePlaceholder.vue')

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        redirect: { name: 'tong-quan' },
      },
      {
        path: 'tong-quan',
        name: 'tong-quan',
        component: () => import('@/views/tong-quan/TongQuan.vue'),
        meta: { title: 'Tổng quan' },
      },
      {
        path: 'san-pham',
        name: 'san-pham',
        component: placeholder,
        meta: { title: 'Sản phẩm' },
      },
      {
        path: 'quang-cao',
        name: 'quang-cao',
        component: placeholder,
        meta: { title: 'Quảng cáo' },
      },
      {
        path: 'doi-soat',
        name: 'doi-soat',
        component: placeholder,
        meta: { title: 'Đối soát' },
      },
      {
        path: 'chi-phi-khuyen-mai',
        name: 'chi-phi-khuyen-mai',
        component: placeholder,
        meta: { title: 'Chi phí & khuyến mãi' },
      },
      {
        path: 'quan-ly-kho',
        name: 'quan-ly-kho',
        component: placeholder,
        meta: { title: 'Quản lý kho' },
      },
      {
        path: 'marketing',
        name: 'marketing',
        component: placeholder,
        meta: { title: 'Kênh marketing' },
      },
      {
        path: 'doanh-thu',
        name: 'doanh-thu',
        component: placeholder,
        meta: { title: 'Doanh thu' },
      },
      {
        path: 'vi-shopee',
        name: 'vi-shopee',
        component: placeholder,
        meta: { title: 'Ví Shopee' },
      },
      {
        path: 'ho-so-shop',
        name: 'ho-so-shop',
        component: placeholder,
        meta: { title: 'Hồ sơ shop' },
      },
      {
        path: 'danh-gia',
        name: 'danh-gia',
        component: placeholder,
        meta: { title: 'Đánh giá' },
      },
      {
        path: 'cai-dat',
        name: 'cai-dat',
        component: placeholder,
        meta: { title: 'Cài đặt' },
      },

      // Redirect đường dẫn cũ
      { path: 'san-pham/kho', redirect: { name: 'quan-ly-kho' } },
      { path: 'marketing/quang-cao', redirect: { name: 'quang-cao' } },
      { path: 'tai-chinh/doanh-thu', redirect: { name: 'doanh-thu' } },
      { path: 'tai-chinh/vi', redirect: { name: 'vi-shopee' } },
      { path: 'shop/ho-so', redirect: { name: 'ho-so-shop' } },
      { path: 'shop/danh-gia', redirect: { name: 'danh-gia' } },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.afterEach((to) => {
  const title = to.meta.title
  document.title = title ? `${title} — Shopee Seller` : 'Shopee Seller'
})

export default router
