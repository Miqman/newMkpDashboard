const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "homePage",
        component: () => import("pages/dashboard/IndexPage.vue"),
      },
      {
        path: "/laporan-transaksi",
        name: "laporanTransaksi",
        component: () => import("pages/laporanTransaksi/index.vue"),
      },
      // {
      //   path: "/laporan/sukses-transaksi",
      //   name: "succesTransaction",
      //   component: () => import("pages/transaksiSukses/index.vue"),
      // },
      // {
      //   path: "/laporan/settled-transaksi",
      //   name: "settledTransaction",
      //   component: () => import("pages/transaksiSettled/index.vue"),
      // },
      // {
      //   path: "/laporan/list-transaksi",
      //   name: "listTransaction",
      //   component: () => import("pages/transaksiList/index.vue"),
      // },
    ],
  },
  {
    path: "/auth",
    component: () => import("layouts/AuthLayout.vue"),
    children: [
      {
        path: "login",
        name: "loginPage",
        component: () => import("pages/auth/login/LoginPage.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
